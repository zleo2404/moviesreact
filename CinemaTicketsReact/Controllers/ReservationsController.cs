using CinemaTickets.Data;
using CinemaTicketsReact.DTOs;
using CinemaTickets.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CinemaTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly CinemaTicketsContext _context;

        public ReservationsController(CinemaTicketsContext context)
        {
            _context = context;
        }

        // POST: api/Reservations
        [HttpPost]
        public async Task<IActionResult> CreateReservation(ReservationInputDTO dto)
        {
            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out int userId))
            {
                return Unauthorized(new { message = "User session is invalid." });
            }

            bool isSeatTaken = await _context.Reservation.AnyAsync(r =>
                r.ScreeningId == dto.ScreeningId &&
                r.RowX == dto.RowX &&
                r.SeatY == dto.SeatY);

            if (isSeatTaken)
            {
                return Conflict(new { message = "Sorry, this seat was just booked by someone else!" });
            }

            var reservation = new Reservation
            {
                ScreeningId = dto.ScreeningId,
                UserId = userId,
                RowX = dto.RowX,
                SeatY = dto.SeatY
            };

            _context.Reservation.Add(reservation);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Booking confirmed successfully! Enjoy the movie." });
            }
            catch (DbUpdateException)
            {
                return Conflict(new { message = "Sorry, this seat was just booked by someone else right before you!" });
            }
        }

        // DELETE: api/Reservations/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservation.FindAsync(id);
            if (reservation == null)
            {
                return NotFound(new { message = "Reservation not found." });
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (reservation.UserId.ToString() != currentUserId && !User.IsInRole("Admin"))
            {
                return StatusCode(403, new { message = "You do not have permission to cancel this booking." });
            }

            _context.Reservation.Remove(reservation);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ticket successfully cancelled. The seat is now available." });
        }
    }
}