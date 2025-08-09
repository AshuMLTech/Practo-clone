# Healthcare Platform

A modern healthcare platform built with Encore.ts backend and React frontend, featuring doctor search and listing functionality. This project is designed for local development only and does not require authentication or deployment setup.

## Features

- **Doctor Search**: Search for doctors by location and specialization
- **Doctor Listings**: Browse detailed doctor profiles with ratings, experience, and availability
- **Responsive Design**: Fully responsive design that works on all devices
- **Real-time Search**: Fast and efficient search with filtering options
- **Modern UI**: Clean, professional interface inspired by leading healthcare platforms

## Tech Stack

### Backend
- **Encore.ts**: TypeScript backend framework
- **PostgreSQL**: Database for storing doctor information (automatically managed by Encore)
- **REST APIs**: Type-safe API endpoints

### Frontend
- **React**: Modern React with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)


## Local Setup Instructions

### Step 1: Install Encore CLI

Install the Encore CLI which will handle the backend and database automatically:

```bash
# On macOS/Linux
curl -L https://encore.dev/install.sh | bash

# On Windows (using PowerShell)
iwr https://encore.dev/install.ps1 | iex
```

After installation, restart your terminal or run:
```bash
source ~/.bashrc  # or ~/.zshrc depending on your shell
```

### Step 2: Clone and Setup Project

```bash
# Clone the repository
git clone <repository-url>
cd healthcare-platform

# Verify Encore installation
encore version
```

### Step 3: Start the Application

```bash
# Start both backend and frontend with a single command
encore run
```

This command will:
- Start the Encore.ts backend on `http://localhost:4000`
- Automatically create and manage a PostgreSQL database
- Run database migrations
- Start the React frontend on `http://localhost:5173`
- Enable hot reloading for both backend and frontend

### Step 4: Access the Application

Once the application starts successfully:

- **Frontend**: Open your browser and go to `http://localhost:5173`
- **Backend API**: Available at `http://localhost:4000`
- **API Documentation**: Available at `http://localhost:4000/api-docs` (auto-generated)

### Step 5: Verify Everything Works

1. Open `http://localhost:5173` in your browser
2. You should see the healthcare platform homepage
3. Try searching for doctors (e.g., search for "Dermatologist" in "Bangalore")
4. You should see a list of sample doctors

## Project Structure

```
├── backend/
│   └── doctor/
│       ├── encore.service.ts    # Service definition
│       ├── db.ts               # Database configuration
│       ├── migrations/         # Database migrations
│       │   └── 1_create_tables.up.sql
│       ├── search.ts          # Doctor search API
│       └── get.ts             # Get doctor by ID API
├── frontend/
│   ├── pages/
│   │   ├── HomePage.tsx       # Landing page with search
│   │   └── DoctorListingPage.tsx # Doctor search results
│   ├── components/
│   │   ├── Header.tsx         # Navigation header
│   │   ├── DoctorCard.tsx     # Doctor profile card
│   │   └── FilterSection.tsx  # Search filters
│   └── App.tsx               # Main app component
└── README.md
```

## API Endpoints

The backend automatically exposes these endpoints:

- `GET /doctors/search` - Search doctors by location and specialization
- `GET /doctors/:id` - Get specific doctor details

## Database

Encore automatically manages a PostgreSQL database with the following schema:

### doctors table
- `id` - Primary key (auto-generated)
- `name` - Doctor's full name
- `specialization` - Medical specialization
- `experience_years` - Years of experience
- `location` - Practice location
- `clinic_name` - Associated clinic
- `consultation_fee` - Consultation cost
- `rating` - Patient rating percentage
- `patient_stories` - Number of patient reviews
- `available_today` - Current availability
- `no_booking_fee` - Whether booking is free
- `image_url` - Profile image URL
- `created_at` - Record creation timestamp
- `updated_at` - Record update timestamp

The database comes pre-populated with sample doctor data for testing.

## Development

### Making Changes

1. **Backend Changes**: Edit files in the `backend/` directory
   - API changes are automatically reflected
   - Database changes require new migration files

2. **Frontend Changes**: Edit files in the `frontend/` directory
   - Changes are automatically hot-reloaded

### Adding New Features

1. **New API Endpoints**: Create new files in `backend/doctor/`
2. **New Frontend Pages**: Add files to `frontend/pages/`
3. **New Components**: Add files to `frontend/components/`
4. **Database Changes**: Create new migration files in `backend/doctor/migrations/`




```



## Features Overview

### Homepage
- Hero section with search functionality
- Location and specialization search
- Popular search suggestions
- Service icons and navigation

### Doctor Listing Page
- Advanced search and filtering
- Doctor cards with detailed information
- Responsive grid layout
- Sorting options

### Doctor Cards
- Doctor photos and basic information
- Ratings and patient reviews
- Consultation fees and availability
- Booking buttons (UI only)

## Code Style

- TypeScript for type safety
- React functional components with hooks
- Tailwind CSS for styling
- Clean, modular component structure
- Proper error handling and loading states

## No Authentication Required




