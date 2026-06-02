namespace CinemaTicketsReact.DTOs
{
    public class ScreeningDetailsDTO
    {
        public int Id { get; set; }
        public string MovieTitle { get; set; }
        public DateTime StartTime { get; set; }
        public CinemaDetailsDTO Cinema { get; set; }
        public List<ReservationDTO> Reservations { get; set; }
    }
}
