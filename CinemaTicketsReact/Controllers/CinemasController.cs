using CinemaTickets.Data;
using CinemaTickets.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CinemasController : ControllerBase
    {
        private readonly CinemaTicketsContext _context;

        public CinemasController(CinemaTicketsContext context)
        {
            _context = context;
        }

        // GET: api/Cinemas
        // Restituisce la lista di tutti i cinema in formato JSON per la tendina di React
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cinema>>> GetCinemas()
        {
            return await _context.Cinema.ToListAsync();
        }
    }
}