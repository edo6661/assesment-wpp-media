# AI-Powered Natural Language to Data System

This repository contains a full-stack application built for the AI Engineer/Fullstack Developer exercise. The system interprets natural language inputs from users, extracts the intent and entities using Google's Gemini AI, and directly queries a relational database to return structured, meaningful data.

## Project Structure

The project is split into two main directories:

- `/server`: Node.js, Express, TypeScript, Prisma ORM, and Google Generative AI. Built with Clean Architecture principles.
- `/client`: React, Vite, Tailwind CSS, TypeScript, and React Query.

## Prerequisites

- Node.js (v18 or higher)
- MySQL database running locally or remotely
- Google Gemini API Key

## Setup & Installation

### 1. Backend Setup

Navigate to the server directory:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory based on your environment:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/wpp_assessment"
CORS_ORIGINS="http://localhost:5173"
GEMINI_API_KEY="your_gemini_api_key_here"
```

Run database migrations and seed the database with sample data:
```bash
npm run db:push
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

Open a new terminal and navigate to the client directory:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL="http://localhost:3000/api/v1"
```

Start the frontend development server:
```bash
npm run dev
```

## Assumptions

- The user inputs will generally fall within the domains of products, marketing campaigns, target audiences, and performance metrics.
- The Gemini model (`gemini-2.5-flash`) is highly capable of adhering to the provided JSON Schema constraints.
- A relational database (MySQL) is sufficient for the scale of this exercise.

## Limitations

- **Language Nuances:** Highly ambiguous or out-of-domain queries will default to an `unknown` intent and return no data.
- **Rate Limiting:** The system is subject to the rate limits imposed by the free tier of the Google Gemini API.
- **Latency:** Because the system relies on an external LLM to process the query before hitting the database, response times are inherently longer than traditional hardcoded SQL filters.