using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CinemaTickets.Models
{
    public class Cinema
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Display(Name = "Cinema Name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(1, 50)]
        [Display(Name = "Number of Rows (n)")]
        public int Rows { get; set; }

        [Required]
        [Range(1, 50)]
        [Display(Name = "Seats per Row (m)")]
        public int SeatsPerRow { get; set; }

        //navigation for screenings
        public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();
    }
}