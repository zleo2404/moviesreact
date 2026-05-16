using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CinemaTickets.Models;

namespace CinemaTickets.Data
{
    public class CinemaTicketsContext : DbContext
    {
        public CinemaTicketsContext(DbContextOptions<CinemaTicketsContext> options)
            : base(options)
        {
        }

        public DbSet<User> User { get; set; } = default!;
        public DbSet<Cinema> Cinema { get; set; } = default!;
        public DbSet<Screening> Screening { get; set; } = default!;
        public DbSet<Reservation> Reservation { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //unique index 
            modelBuilder.Entity<Reservation>()
                .HasIndex(r => new { r.ScreeningId, r.RowX, r.SeatY })
                .IsUnique();

            //cascade delete
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Screening)
                .WithMany(s => s.Reservations)
                .HasForeignKey(r => r.ScreeningId)
                .OnDelete(DeleteBehavior.Cascade);

            //the cinemas are fixed
            modelBuilder.Entity<Cinema>().HasData(
                new Cinema { Id = 1, Name = "Italian Cinema", Rows = 5, SeatsPerRow = 8 },
                new Cinema { Id = 2, Name = "Spanish Cinema", Rows = 6, SeatsPerRow = 9 },
                new Cinema { Id = 3, Name = "Polish Cinema", Rows = 5, SeatsPerRow = 7 }
            );

            //i create an admin
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Admin",
                    LastName = "Admin",
                    Role = "Admin",
                    Email = "admin@admin.com",
                    Password = "admin",
                    PhoneNumber = "00000000000"
                }
            );
        }
    }
}