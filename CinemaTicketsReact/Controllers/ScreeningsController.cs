using CinemaTickets.Data;
using CinemaTickets.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaTickets.DTOs;

namespace CinemaTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController] // <-- Fondamentale: trasforma la classe in un'API!
    public class ScreeningsController : ControllerBase // <-- Ereditiamo da ControllerBase, non da Controller
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
            // Usiamo .Select() per trasformare "al volo" ogni Screening del database in un ScreeningDTO
            return await _context.Screening
                .Include(s => s.Cinema)
                .Select(s => new ScreeningDTO
                {
                    Id = s.Id,
                    MovieTitle = s.MovieTitle,
                    StartTime = s.StartTime,
                    CinemaName = s.Cinema != null ? s.Cinema.Name : "N/A" // Se il cinema esiste prendi il nome, altrimenti "N/A"
                })
                .ToListAsync();
        }

        // GET: api/Screenings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScreeningDTO>> GetScreening(int id)
        {
            var screening = await _context.Screening
                .Include(s => s.Cinema)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (screening == null)
            {
                return NotFound(new { message = "Proiezione non trovata." });
            }

            // Travasiamo i dati della singola proiezione nel DTO
            var dto = new ScreeningDTO
            {
                Id = screening.Id,
                MovieTitle = screening.MovieTitle,
                StartTime = screening.StartTime,
                CinemaName = screening.Cinema != null ? screening.Cinema.Name : "N/A"
            };

            return dto;
        }

        // POST: api/Screenings
        // SOLO GLI ADMIN possono creare nuove proiezioni
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Screening>> CreateScreening(Screening screening)
        {
            _context.Screening.Add(screening);
            await _context.SaveChangesAsync();

            // Restituisce il codice 201 Created e l'oggetto appena creato
            return CreatedAtAction(nameof(GetScreening), new { id = screening.Id }, screening);
        }

        // PUT: api/Screenings/5
        // SOLO GLI ADMIN possono modificare proiezioni esistenti
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScreening(int id, Screening screening)
        {
            if (id != screening.Id)
            {
                return BadRequest(new { message = "ID non corrispondente." });
            }

            _context.Entry(screening).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Proiezione aggiornata con successo!" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ScreeningExists(id))
                {
                    return NotFound(new { message = "La proiezione non esiste più." });
                }
                else
                {
                    throw; // Rilancia l'errore se è un problema non gestito
                }
            }
        }

        // DELETE: api/Screenings/5
        // SOLO GLI ADMIN possono eliminare le proiezioni
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScreening(int id)
        {
            var screening = await _context.Screening.FindAsync(id);
            if (screening == null)
            {
                return NotFound(new { message = "Proiezione già eliminata o non trovata." });
            }

            _context.Screening.Remove(screening);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Proiezione eliminata correttamente." });
        }

        private bool ScreeningExists(int id)
        {
            return _context.Screening.Any(e => e.Id == id);
        }
    }
}