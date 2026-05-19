using CinemaTickets.Data; // ASSICURATI che questo sia il namespace corretto per il tuo context
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// 1. IL DATABASE (Questa è la riga che mancava e che causava l'errore!)
builder.Services.AddDbContext<CinemaTicketsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CinemaTicketsContext")
    ?? throw new InvalidOperationException("Connection string not found.")));

// 2. LA SICUREZZA (Cookie per le API)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            }
        };
    });

// 3. CONFIGURAZIONE CORS (Il passaporto per far funzionare React su porta 5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", // (O qualunque nome tu gli abbia dato)
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "https://localhost:5173") // <--- AGGIUNGI LA VERSIONE HTTPS QUI!
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // <--- Assicurati che questo ci sia sempre per i Cookie!
        });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseHttpsRedirection();
// ORDINE CRITICO DEI MIDDLEWARE
app.UseRouting();

// Il CORS deve stare qui!
app.UseCors("AllowReactApp");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();