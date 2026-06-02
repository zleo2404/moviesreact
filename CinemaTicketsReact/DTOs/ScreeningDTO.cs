using System;

namespace CinemaTicketsReact.DTOs
{
    public class ScreeningDTO
    {
        public int Id { get; set; }
        public string MovieTitle { get; set; }
        public DateTime StartTime { get; set; }
        public string CinemaName { get; set; } 
    }
}