# Injury Management Companion

## Overview

This project is an **Injury Management Companion** application built using Next.js, which allows users to keep track of injury. The app integrates modern full-stack development practices and state-of-the-art technologies to ensure optimal performance and a seamless user experience. Whether you're a healthcare professional or an individual recovering from an injury, this companion helps you stay organized, track progress, and get insights into your injury management journey.

## Live Demo

[Lief: Injury Management System](https://injury-tracking-system-roan.vercel.app/)

## Features

- **Real-time CRUD**: Users can Create, View, Update and Delete Injury Report.

- **Visual Representation**: We uses HTML5 Canvas for visual representation of body map.

- **Secure Authentication**: Uses Auth0 for secure user authentication and management.

- **Clean UI Updates**: Provides users with real-time, responsive feedback when interacting with the app.

## Technologies Used

### Frontend

- **Next.js**: Server-side rendering and optimized performance.
- **shadcn-ui**: UI components for a seamless and modern user interface.
- **Tanstack Query**: For Data Mutation and Data Query, we use React Query.
- **TypeScript**: Ensures robust type-checking and code reliability.

### Backend

- **Node.js & Express.js**: Backend service handling for API and business logic.
- **Prisma ORM**: Type-safe database access and manipulation.
- **PostgresSQL**: For Persistant data storage.

- **Auth0**: Secure user authentication and authorization.

### Infrastructure & DevOps

- **GitHub**: Version control and collaboration.
- **Vercel**: Hosting platform for Next.js with a focus on frontend performance.

## Project Setup

To get started with this project, follow these steps:

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **PostgresSQL** (v13 or higher)
- **Auth0 Account**: Create an account on Auth0 to set up authentication.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ansarjarvis/injury-tracking-system.git
   cd injury-tracking-system
   ```

2. set up the environment variables:

   ```bash
    DATABASE_URL=
    AUTH0_SECRET=
    AUTH0_BASE_URL=
    AUTH0_ISSUER_BASE_URL=
    AUTH0_CLIENT_ID=
    AUTH0_CLIENT_SECRET=
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
    npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
