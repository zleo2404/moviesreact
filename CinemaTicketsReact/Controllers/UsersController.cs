using CinemaTickets.Data;
using CinemaTickets.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CinemaTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CinemaTicketsContext _context;

        public UsersController(CinemaTicketsContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.User.ToListAsync();
        }

        // GET: api/Users/5
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            if (id.ToString() != loggedInUserId && !isAdmin)
            {
                return Forbid();
            }

            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Utente non trovato." });
            }

            return user;
        }

        // POST: api/Users
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: api/Users/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest(new { message = "ID non corrispondente." });
            }

            var loggedInUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            if (id.ToString() != loggedInUserId && !isAdmin)
            {
                return Forbid();
            }

            try
            {
                _context.User.Update(user);
                await _context.SaveChangesAsync();

                // Aggiorna il cookie se l'utente modifica se stesso
                if (user.Id.ToString() == loggedInUserId)
                {
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.Role, user.Role)
                    };

                    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    var principal = new ClaimsPrincipal(identity);

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
                }

                return Ok(new
                {
                    message = "Profilo aggiornato con successo!",
                    rowVersion = user.RowVersion // <--- Spediamo la nuova RowVersion a React!
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new { message = "Utente non trovato." });
                }
                else
                {
                    return Conflict(new { message = "I dati sono stati modificati da un altro utente. Ricarica la pagina." });
                }
            }
        }

        // DELETE: api/Users/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id, [FromBody] byte[] rowVersion)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Impossibile eliminare: l'utente è già stato eliminato." });
            }

            try
            {
                if (rowVersion != null && rowVersion.Length > 0)
                {
                    _context.Entry(user).Property("RowVersion").OriginalValue = rowVersion;
                }

                _context.User.Remove(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Utente eliminato correttamente." });
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { message = "Impossibile eliminare: l'utente è stato modificato da un altro admin." });
            }
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            // Rimuoviamo controlli di validazione non necessari per il payload in arrivo
            ModelState.Remove("Role");
            ModelState.Remove("RowVersion");

            var userExists = await _context.User.AnyAsync(u => u.Email == user.Email);
            if (userExists)
            {
                return BadRequest(new { message = "Questa email è già in uso." });
            }

            user.Role = "User";

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Utente registrato con successo. Ora puoi effettuare il login!" });
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            var user = await _context.User
                .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Email o password non validi." });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            // Restituiamo i dati dell'utente per React
            return Ok(new
            {
                message = "Login effettuato con successo",
                user = new { user.Id, user.FirstName, user.LastName, user.Role }
            });
        }

        // POST: api/Users/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Logout effettuato con successo." });
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }
    }
}