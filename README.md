# InternshipHub

## Description
A web application for finding and applying to internships.

## Features
- User authentication (login/signup)
- Internship listings
- Dashboard for managing applications

## Technology Stack
- React with TypeScript
- Tailwind CSS for styling
- Express.js for server-side logic
- EJS for templating (for login/signup pages)

## Getting Started

### Installation
1. Clone the repository
2. Install dependencies
```bash
npm install
```

### Running the Application

#### Development Mode (React App)
```bash
npm run dev
```
This will start the Vite development server for the React application.

#### Production Mode
1. Build the React application
```bash
npm run build
```

2. Start the Express server
```bash
npm run server
```
This will start the Express server that serves the built React application and renders the login/signup pages using EJS.

## Important Notes
- The login and signup pages are now implemented using EJS templates with Tailwind CSS
- All other pages remain in TypeScript/React
- The server runs on http://localhost:3000 by default