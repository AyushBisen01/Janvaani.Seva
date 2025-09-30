# Janvaani Seva - AI-Powered Civic Issue Management

Janvaani Seva is a modern, full-stack web application designed to streamline civic issue reporting and management. It provides a comprehensive dashboard for municipal corporations to efficiently track, triage, assign, and resolve problems reported by citizens, leveraging AI for intelligent automation.

This project was built within **Firebase Studio**, demonstrating how to integrate generative AI, data visualization, and real-time features into a production-ready application.

![Janvaani Seva Dashboard Screenshot](https://res.cloudinary.com/dtstc3zpl/image/upload/v1721903632/Screenshot_2024-07-25_at_3.23.01_PM_c3f59e.png)

## Core Features

-   **AI-Powered Triage & Analysis**: Automatically analyzes and categorizes incoming issue descriptions and images using Google's Generative AI. It suggests a priority level and flags critical reports for immediate attention.
-   **Interactive Dashboard**: A central hub providing a comprehensive overview of all issues with key metrics (total, new, resolved), charts for trends over time, and issue breakdowns by category, priority, and status.
-   **GIS Map Integration**: Visualizes all issue locations on an interactive map, showing issue hotspots with color-coded pins based on status. Allows for geographical filtering and exploration.
-   **Real-time Updates**: Built with SWR for automatic data refreshing, ensuring the dashboard always displays the most current information without manual reloads.
-   **End-to-End Issue Management**: A complete workflow for municipal staff to review, approve, reject, assign to departments, and track issues from submission to resolution.
-   **User & Department Management**: A dedicated interface to manage staff accounts and departmental assignments.
-   **Custom Reporting & Analytics**: Generate and export detailed reports based on filters like date range, status, priority, and department. Includes advanced visualizations for department performance and issue resolution funnels.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Generative AI**: [Google's Genkit](https://firebase.google.com/docs/genkit) (with Gemini) for AI flows and issue analysis.
-   **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)
-   **Data Fetching**: [SWR](https://swr.vercel.app/) for real-time client-side data synchronization.
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Charts & Visualization**: [Recharts](https://recharts.org/)
-   **Maps**: [React Google Maps](https://visgl.github.io/react-google-maps/)

## Project Structure

```
.
├── src
│   ├── app
│   │   ├── (app)         # Main application routes (dashboard, issues, etc.)
│   │   ├── (auth)        # Authentication routes (login)
│   │   ├── api           # API routes for data handling
│   │   └── layout.tsx    # Root layout
│   ├── components
│   │   ├── dashboard     # Components for the main dashboard page
│   │   ├── issues        # Components for issue lists and details
│   │   ├── map           # Map-related components
│   │   ├── reports       # Components for the reports page
│   │   └── ui            # Reusable shadcn/ui components
│   ├── lib
│   │   ├── data.ts       # Main data fetching and mutation logic
│   │   ├── models        # Mongoose schemas for database models
│   │   ├── db.ts         # MongoDB connection handler
│   │   └── types.ts      # Core TypeScript types
│   ├── ai
│   │   ├── genkit.ts     # Genkit configuration
│   │   └── ai-issue-triage.ts # AI flow for issue analysis
│   └── hooks             # Custom React hooks (use-toast, use-mobile)
├── public                # Static assets
└── tailwind.config.ts    # Tailwind CSS configuration
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 20 or later)
-   [npm](https://www.npmjs.com/) (included with Node.js)
-   A MongoDB database (e.g., a free cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```
# MongoDB Connection String (replace with your own)
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

# Google Maps API Key for map visualizations
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY

# Gemini API Key for AI features
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/AyushBisen01/Janvaani.Seva.git
    cd Janvaani.Seva
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

The application requires two separate processes to run concurrently: the Next.js frontend and the Genkit AI service.

1.  **Start the Next.js Development Server:**
    This runs the main web application on port 9002.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

2.  **Start the Genkit AI Server:**
    In a **separate terminal**, run this command to start the Genkit development UI. This service handles all the AI-related tasks.
    ```bash
    npm run genkit:dev
    ```
    The Genkit UI will be available at `http://localhost:4000`.
```