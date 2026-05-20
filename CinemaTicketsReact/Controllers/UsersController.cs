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
                return NotFound(new { message = "User not found." });
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
                return BadRequest(new { message = "ID mismatch." });
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

                // Update the cookie if the user modifies themselves
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
                    message = "Profile updated successfully!",
                    rowVersion = user.RowVersion
                });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound(new { message = "User not found." });
                }
                else
                {
                    return Conflict(new { message = "The data has been modified by another user. Please reload the page." });
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
                return NotFound(new { message = "Cannot delete: the user has already been deleted." });
            }

            try
            {
                if (rowVersion != null && rowVersion.Length > 0)
                {
                    _context.Entry(user).Property("RowVersion").OriginalValue = rowVersion;
                }

                _context.User.Remove(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "User deleted successfully." });
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict(new { message = "Cannot delete: the user has been modified by another admin." });
            }
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            // Remove unnecessary validation checks for the incoming payload
            ModelState.Remove("Role");
            ModelState.Remove("RowVersion");

            var userExists = await _context.User.AnyAsync(u => u.Email == user.Email);
            if (userExists)
            {
                return BadRequest(new { message = "This email is already in use." });
            }

            user.Role = "User";

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully. You can now log in!" });
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            var user = await _context.User
                .FirstOrDefaultAsync(u => u.Email == model.Email && u.Password == model.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password." });
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

            return Ok(new
            {
                message = "Login successful",
                user = new { user.Id, user.FirstName, user.LastName, user.Role }
            });
        }

        // POST: api/Users/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Logout successful." });
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }
    }
}