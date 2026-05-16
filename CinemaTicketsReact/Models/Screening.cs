using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CinemaTickets.Models
{
    public class Screening
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Movie Title")]
        public string MovieTitle { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Start Time")]
        public DateTime StartTime { get; set; }

        //fk to cinema
        [Required]
        public int CinemaId { get; set; }
        public virtual Cinema? Cinema { get; set; }

        //navigation for reservations
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}