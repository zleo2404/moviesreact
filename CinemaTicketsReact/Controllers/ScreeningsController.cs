using CinemaTickets.Data;
using CinemaTickets.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaTicketsReact.DTOs;

namespace CinemaTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScreeningsController : ControllerBase
    {
        private readonly CinemaTicketsContext _context;

        public ScreeningsController(CinemaTicketsContext context)
        {
            _context = context;
        }

        // GET: api/Screenings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScreeningDTO>>> GetScreenings()
        {

            return await _context.Screening
                .Include(s => s.Cinema)
                .Select(s => new ScreeningDTO
                {
                    Id = s.Id,
                    MovieTitle = s.MovieTitle,
                    StartTime = s.StartTime,
                    CinemaName = s.Cinema != null ? s.Cinema.Name : "N/A"
                })
                .ToListAsync();
        }

        // GET: api/Screenings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScreeningDetailsDTO>> GetScreening(int id)
        {
            var screening = await _context.Screening
                .Include(s => s.Cinema)
                .Include(s => s.Reservations)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (screening == null)
            {
                return NotFound(new { message = "Screening not found." });
            }
            var dto = new ScreeningDetailsDTO
            {
                Id = screening.Id,
                MovieTitle = screening.MovieTitle,
                StartTime = screening.StartTime,

                Cinema = screening.Cinema != null ? new CinemaDetailsDTO
                {
                    Name = screening.Cinema.Name,
                    Rows = screening.Cinema.Rows,
                    SeatsPerRow = screening.Cinema.SeatsPerRow
                } : null,
                Reservations = screening.Reservations?.Select(r => new ReservationDTO
                {
                    Id = r.Id,
                    RowX = r.RowX,
                    SeatY = r.SeatY,
                    UserId = r.UserId
                }).ToList() ?? new List<ReservationDTO>()
            };

            return dto;
        }

        // POST: api/Screenings
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Screening>> CreateScreening(Screening screening)
        {
            _context.Screening.Add(screening);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetScreening), new { id = screening.Id }, screening);
        }

        // PUT: api/Screenings/5
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScreening(int id, Screening screening)
        {
            if (id != screening.Id)
            {
                return BadRequest(new { message = "ID mismatch." });
            }

            _context.Entry(screening).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Screening updated successfully!" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScreeningExists(id))
                {
                    return NotFound(new { message = "The screening no longer exists." });
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/Screenings/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScreening(int id)
        {
            var screening = await _context.Screening.FindAsync(id);
            if (screening == null)
            {
                return NotFound(new { message = "Screening already deleted or not found." });
            }

            _context.Screening.Remove(screening);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Screening deleted successfully." });
        }

        private bool ScreeningExists(int id)
        {
            return _context.Screening.Any(e => e.Id == id);
        }
    }
}