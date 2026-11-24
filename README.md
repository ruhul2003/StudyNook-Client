# StudyNook Client

A modern study room booking platform that allows users to browse, reserve, and list private study spaces in their library.

This repository contains the Next.js frontend client, which connects to the StudyNook backend API for rooms, bookings, and authentication.

## Features

- **Browse Study Rooms**: Search, explore, and filter available rooms by capacity, floor, and amenities.
- **Instant Booking**: Reserve time slots with built-in double-booking protection.
- **List a Room**: Authenticated users can list their own study spaces with room details and amenities.
- **User Authentication**: Supports Email/Password registration and Google OAuth using Better Auth.
- **My Bookings**: View, manage, and cancel active reservations.
- **My Listings**: Manage rooms created by the logged-in user.
- **Responsive Interface**: Mobile-friendly design built with Tailwind CSS and Framer Motion animations.
- **Custom 404 Page**: Friendly fallback route for unmatched URLs.

## Tech Stack

- **Framework**: Next.js 16.2 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Geist Fonts, Lucide React
- **Animations**: Framer Motion
- **Authentication**: Better Auth
- **Database**: MongoDB (via the StudyNook backend API)
- **Notifications**: React Hot Toast

## Project Structure

```
StudyNook-Client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.js             # Home page
│   │   ├── layout.js           # Root layout
│   │   ├── globals.css         # Global Tailwind styles
│   │   ├── rooms/              # Room browsing and [id] detail pages
│   │   ├── add-room/           # Add room page
│   │   ├── my-bookings/        # User bookings page
│   │   ├── my-listings/        # User listings page
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   └── not-found.js        # Custom 404 page
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.js           # Top navigation bar
│   │   ├── Footer.js           # Site footer
│   │   ├── MainLayout.js       # Page layout wrapper
│   │   ├── RoomCard.js         # Study room preview card
│   │   └── Spinner.js          # Loading indicator
│   ├── context/                # Context providers
│   │   └── AuthContext.js      # Authentication state provider
│   └── lib/                    # API client and auth helper functions
│       ├── api-client.js       # Fetch wrapper for backend requests
│       ├── auth-client.js      # Better Auth client instance
│       └── auth.js             # Auth helper functions
├── .env.local                  # Environment variables
├── eslint.config.mjs           # ESLint configuration
├── next.config.mjs             # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js version 18 or higher
- npm package manager
- Running backend API service for StudyNook (defaults to `http://localhost:5000`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ruhul2003/StudyNook-Client.git
   cd StudyNook-Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory.

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   BETTER_AUTH_SECRET=your_secret_key
   BETTER_AUTH_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 in your browser.

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the StudyNook backend API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth tokens |
| `BETTER_AUTH_URL` | Base URL of the app |
| `MONGODB_URI` | MongoDB connection string |

## Routes

### Public Routes
- `/` — Home page
- `/rooms` — Browse and filter available study rooms
- `/about` — Project overview
- `/contact` — Contact information
- `/rooms/[id]` — Study room details and booking
- `/login` — Sign in page
- `/register` — Create a new account

### Authenticated Routes
- `/add-room` — Create a new study room listing
- `/my-bookings` — View and cancel reservations
- `/my-listings` — Manage your listed rooms

## Available Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality.

## License

This project is licensed under the MIT License.
