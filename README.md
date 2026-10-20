# Cinema Tickets

Cinema Tickets is a full-stack web application designed for browsing movie screenings, booking tickets, and managing complex multi-user reservations.

The project is built on a modern client-server architecture, featuring a dynamic frontend developed in React (`CinemaTicketsClient`) and a robust RESTful API backend developed in C# with ASP.NET Core (`CinemaTicketsReact`).

The application was developed with a strong focus on separation of concerns, concurrent session handling, and advanced user management, keeping the codebase modular, extensible, and secure.

## Requirements

* Node.js (v16 or higher) and npm (for the React client)

* .NET SDK (v6.0 or higher, for the ASP.NET Core backend)

* SQL Server (or LocalDB) for Entity Framework Core database

## Getting Started

To run the backend server from source:

```
cd CinemaTicketsReact
dotnet restore
dotnet ef database update
dotnet run

```

To run the frontend client:

```
cd CinemaTicketsClient
npm install
npm run dev

```

The frontend will typically be served at `http://localhost:5173`, and the backend API will run on its configured local port.

## Features

**Multi-User Booking:**
* Concurrent seat reservation handling to support multiple users booking screenings simultaneously without data conflicts.
* Real-time validation checks ensuring seat availability and preventing double-booking across different user sessions.
* Comprehensive reservation tracking allowing users to review, update, or cancel their multi-ticket bookings.

**User & Account Management Across Sessions:**
* Support for concurrent edits and state changes to the same user profile from different accounts/sessions with proper authorization checks.
* Administrative capabilities to oversee user accounts, modify roles, and handle cross-account data updates (`EditUser`, `DeleteUser`).
* Secure session management via `AuthContext` tracking active states across multiple client instances.

**Additional User & Admin Capabilities:**
* Browse available cinemas and movie screenings.
* Register and Log in to a personal account.
* Create and manage new movie screenings (`CreateScreening`, `DeleteScreening`).
* Cancel bookings (`DeleteBook`).

## Build and Test

**Compile and build the backend project:**

```
cd CinemaTicketsReact
dotnet build

```

**Build the frontend for production:**

```
cd CinemaTicketsClient
npm run build

```

## Project Structure

```
.
├── CinemaTicketsClient/           React Frontend Application
│   ├── public/                    Static assets (images, icons)
│   ├── src/
│   │   ├── assets/                Application assets (logos, UI graphics)
│   │   ├── components/            Reusable UI components (FormInput, UserRow, etc.)
│   │   ├── App.jsx                Main frontend routing component
│   │   ├── AuthContext.jsx        Global authentication state management
│   │   ├── Home.jsx               Landing page
│   │   ├── Login.jsx / Register.jsx Authentication views
│   │   ├── Screenings.jsx         Movie screenings view
│   │   └── main.jsx               React entry point
│   ├── package.json               Frontend dependencies
│   └── vite.config.js             Vite bundler configuration
│
└── CinemaTicketsReact/            ASP.NET Core Backend Application
    ├── Controllers/               API Endpoints (Cinemas, Reservations, Screenings, Users)
    ├── Data/                      Entity Framework Database Context
    ├── DTOs/                      Data Transfer Objects for API requests/responses
    ├── Migrations/                Database schema migrations
    ├── Models/                    Domain entities (Cinema, Reservation, Screening, User)
    ├── Program.cs                 Backend entry point and service configuration
    └── appsettings.json           Backend configuration and connection strings

```

## Architecture

The application follows a decoupled Client-Server architecture.

The `CinemaTicketsReact` backend acts as a RESTful API. The `Controllers` package mediates incoming HTTP requests, interacting with the database via Entity Framework Core, and returning JSON responses.

The `CinemaTicketsClient` frontend is a Single Page Application (SPA) built with React. The `src/components` directory contains modular UI elements, while top-level files act as views.

This separation keeps the user interface behavior completely independent from the data processing and storage logic, making both components easier to test, scale, and deploy.

## Design Patterns and Design Choices

Several design patterns and principles were applied to reduce coupling between classes and improve extensibility.

* **MVC (Model-View-Controller):** Used on the backend to separate API routing (Controllers) from data structures (Models).

* **DTO (Data Transfer Object):** Implemented in the backend (`CinemaDetailsDTO`, `ReservationDTO`, etc.) to decouple internal database models from the external API contract, preventing over-posting and hiding sensitive data.

* **Context API / Provider Pattern:** Used in the frontend (`AuthContext.jsx`) to provide global state management for user authentication without prop-drilling.

* **Component-Based UI:** The frontend breaks down complex views into reusable pieces (e.g., `ScreeningRow`, `DeleteCard`, `FormInput`).

* **Repository/ORM Pattern:** Entity Framework Core (`CinemaTicketsContext`) abstracts raw SQL queries into object-oriented C# operations.

## Application Flow

Users begin at the `Home` view and navigate through available cinemas and `Screenings`.

Authentication is handled via the `Login` and `Register` components. Once authenticated, the `AuthContext` provides the user's session data across the application.
Users can then view `ScreeningDetails`, select seats for multi-user booking, and make a `ConfirmBook` request. These actions trigger asynchronous fetch calls to the backend `Controllers`, which validate business logic, manage concurrency, and handle changes across multiple sessions before finalizing transactions.

## Data and Persistence

Application data is stored in a relational database managed via Entity Framework Core.

The core domain model includes:

* **Users:** Stores account details, multi-account modification tracking, and authentication status.

* **Cinemas:** Stores theater locations and details.

* **Screenings:** Links a movie, a cinema, and a specific showtime.

* **Reservations:** A mapping entity connecting a User to a specific Screening, supporting multi-user ticket allocation.

Database schema changes are tracked and persisted using EF Core Migrations (found in the `Migrations/` directory).
