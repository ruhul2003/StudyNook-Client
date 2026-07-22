# StudyNook

A modern study room booking platform that allows users to browse, reserve, and list private study spaces in their library.

## Features

- **Browse Study Rooms**: Explore and filter available rooms by capacity, floor, and amenities.
- **Instant Booking**: Reserve time slots with built-in double-booking protection.
- **List a Room**: Authenticated users can list their own study spaces.
- **User Authentication**: Supports Email/Password registration and Google OAuth using Better Auth.
- **My Bookings**: View, manage, and cancel active reservations.
- **My Listings**: Manage rooms created by the logged-in user.
- **Responsive Interface**: Mobile-friendly design built with Tailwind CSS and Framer Motion animations.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React
- **Animations**: Framer Motion
- **Authentication**: Better Auth
- **Database**: MongoDB
- **Notifications**: React Hot Toast

## Project Structure

```
studynook-client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.js             # Home page
│   │   ├── layout.js           # Root layout
│   │   ├── rooms/              # Room browsing and details
│   │   ├── add-room/           # Add room page
│   │   ├── my-bookings/        # User bookings page
│   │   ├── my-listings/        # User listings page
│   │   ├── login/              # Login page
│   │   ├── register/           # Register page
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   └── api/                # Better Auth API routes
│   ├── components/             # Reusable UI components
│   ├── context/                # Context providers
│   └── lib/                    # API client and auth helper functions
├── .env.local                  # Environment variables
├── next.config.mjs             # Next.js configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js version 18 or higher
- npm package manager
- Running backend API service for StudyNook

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/StudyNook-Client.git
   cd StudyNook-Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory.

   ```env
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
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth tokens |
| `BETTER_AUTH_URL` | Base URL of the app |
| `MONGODB_URI` | MongoDB connection string |

## Available Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint to check for code quality.

## License

This project is licensed under the MIT License.
