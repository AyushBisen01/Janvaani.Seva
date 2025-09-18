# Janvaani Seva

This is a Next.js application for a civic issue reporting and management dashboard called "Janvaani Seva", built within Firebase Studio. It allows municipal staff to view, triage, and manage issues reported by citizens.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [React](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Data Fetching**: [SWR](httpss://swr.vercel.app/)
- **Charts**: [Recharts](https://recharts.org/)
- **Maps**: [Google Maps React](https://visgl.github.io/react-google-maps/)

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 20 or later) and npm installed on your system.

### Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project directory and install the dependencies:

    ```bash
    npm install
    ```

### Environment Variables

To use the mapping features, you will need a Google Maps API key. Create a `.env.local` file in the root of the project and add your key:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

To use the GenAI features, you will need a Gemini API key. Add it to your `.env.local` file:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### Running the Application

The application consists of two main parts: the Next.js frontend and the Genkit AI service. You'll need to run both concurrently in separate terminal windows.

1.  **Start the Next.js development server:**

    This will run the main web application.

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:9002`.

2.  **Start the Genkit development server:**

    This runs the AI flows that power features like issue triage.

    ```bash
    npm run genkit:dev
    ```

    This will start the Genkit development UI, which you can use to inspect and test your AI flows.

Now you can open your browser and navigate to `http://localhost:9002` to see the application in action.
# Janvaani_Seva
