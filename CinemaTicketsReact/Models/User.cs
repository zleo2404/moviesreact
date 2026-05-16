using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CinemaTickets.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "First name is required")]
        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Surname is required")]
        [Display(Name = "Surname")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid Phone Number")]
        [Display(Name = "Phone Number")]
        public string PhoneNumber { get; set; } = string.Empty;

        //User or Admin
        [Required]
        public string Role { get; set; } = "User";

        [Timestamp]
        public byte[] RowVersion { get; set; }

        //navigation
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}