using CinemaTickets.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<CinemaTicketsContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("CinemaTicketsContext")
    ?? throw new InvalidOperationException("Connection string not found.")));

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

builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();

app.UseDefaultFiles(new DefaultFilesOptions
{
    DefaultFileNames = ["index.html"]
});

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();