using System.ComponentModel.DataAnnotations;

namespace CinemaTickets.Models
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ScreeningId { get; set; }
        public virtual Screening? Screening { get; set; }

        [Required]
        public int UserId { get; set; }
        public virtual User? User { get; set; }

        [Required]
        public int RowX { get; set; }

        [Required]
        public int SeatY { get; set; }
    }
}