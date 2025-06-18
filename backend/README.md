# Socket IO Chat - Backend

## Table of Contents
- [Description](#description)
- [Tech and Tools](#tech-and-tools)
- [Installation and Setup](#installation-and-setup)
- [Features](#features)
- [Architecture and Organization](#architecture-and-organization)
- [Modules common structure](#modules-common-structure)
- [Shared module structure](#shared-module-structure)
- [Response Format](#response-format)

## Description
A backend application for a chat system that provides a API and real-time communication features using Node.js, NestJS, and Socket.IO.

## Tech and Tools
- **Node.js** (v18+): [Node.js Documentation](https://nodejs.org/)
- **NestJS** (v11+): [NestJS Documentation](https://nestjs.com/)
- **Socket.IO** (v4+): [Socket.IO Documentation](https://socket.io/)
- **TypeScript** (v5+): [TypeScript Documentation](https://www.typescriptlang.org/)
- **Zod**: [Zod Documentation](https://zod.dev/)
- **Prisma** (v6+): [Prisma Documentation](https://www.prisma.io/)
- **ESLint** (v9+): [ESLint Documentation](https://eslint.org/)
- **Prettier** (v3+): [Prettier Documentation](https://prettier.io/)
- **pnpm** (v8+): [pnpm Documentation](https://pnpm.io/)

## Installation and Setup
This project is the backend part of a fullstack application. To ensure all features work as expected, set up both the frontend and backend. For an integrated experience, refer to the root repository's README for the recommended Docker setup.

1. Clone the repository:
   ```bash
   git clone https://github.com/santanajoao/socket.io-chat.git
   ```

2. Navigate to the backend directory:
   ```bash
   cd socket.io-chat/backend
   ```

3. Install dependencies using your preferred package manager:
   - Using **pnpm**:
     ```bash
     pnpm install
     ```
   - Using **npm**:
     ```bash
     npm install
     ```
   - Using **yarn**:
     ```bash
     yarn install
     ```

4. Configure the environment file:
   - Rename the `.env.example` file to `.env` or create a `.env` and copy the env examples.
   - The example values provided in the file are enough to run the project.

5. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

6. Start the development server:
   - Using **pnpm**:
     ```bash
     pnpm dev
     ```
   - Using **npm**:
     ```bash
     npm run dev
     ```
   - Using **yarn**:
     ```bash
     yarn dev
     ```

7. The backend will be available at `http://localhost:3001` or the port configured in the `.env` file.

## Features
- **RESTful API**: Provides endpoints for authentication, user management, chats, and invitations using **NestJS**.
- **Real-Time Communication**: Manages WebSocket events for messages, notifications, and state updates using **Socket.IO** and **NestJS WebSocket adapters**.
- **JWT Authentication**: Implements secure token-based authentication with support for **cookies** using **jsonwebtoken**, **cookie-parser** and **guards**.
- **Data Validation**: Uses **Zod** for input schema validation.
- **Relational Database**: Managed with **Prisma** and **PostgreSQL**.
- **Custom Decorators**: Utilizes **NestJS custom decorators** to simplify and standardize request handling and validation.
- **Error Handlers**: Centralized error handling using **NestJS's built-in exception filters**.
- **Event Emitters**: Uses **NestJS's Event Emitter module** to handle asynchronous events across the application.

## Response Format

All API responses follow a consistent structure to ensure clarity and ease of integration. Below is the standard format:

### Successful Response

- **HTTP Status**: Any success status (e.g., 200, 201).
- **Body**:
```json
{
  "data": "data here"
}
```

### Error Response

- **HTTP Status**: Corresponds to the type of error (e.g., 400, 401, 404, 500).
- **Body**:
```json
{
  "error": {
    "message": "Error message here",
    "status": 400,
    "statusText": "Bad Request"
  }
}
```

## Architecture and Organization

- **`src/`**: Contains the main backend source code.
  - **`app.module.ts`**: The root module that imports and organizes all feature modules.
  - **`main.ts`**: The entry point of the application, responsible for initializing the NestJS application.
  - **`auth/`**: Handles authentication logic.
  - **`chats/`**: Manages chat functionality.
  - **`invites/`**: Handles invitation logic for chats and groups.
  - **`messages/`**: Manages chat messages and their metadata.
  - **`shared/`**: Contains reusable resources shared across the application.
  - **`users/`**: Manages user-related logic.

### Modules common structure
Each module (e.g., `auth/`, `chats/`, `invites/`, `messages/`, `users/`) follows a common structure with the following folders:

- **`controllers/`**: Defines the endpoint logic.
- **`services/`**: Contains business logic and database interactions.
- **`dtos/`**: Data Transfer Objects for request validation and data handling.
- **`interfaces/`**: Defines TypeScript interfaces for repositories and services.
- **`repositories/`**: Implements database operations using Prisma or other data sources.
- **`models/`**: Represents data models for the module.
- **`constants/`**: Stores constants specific to the module.
- **`formatters/`**: Utilities for formatting data specific to the module.
- **`adapters/`**: Custom adapters for module-specific functionality (e.g., WebSocket adapters).
- **`guards/`**: Implements route protection logic.
- **`decorators/`**: Custom decorators for simplifying route handling.

### Shared module structure
The **`shared/`** module contains reusable resources shared across the application. Its structure is as follows:

- **`config/`**: Configuration files, such as CORS settings.
- **`datasources/`**: Manages database connections, such as Prisma datasource.
- **`exception-filters/`**: Global exception filters for error handling.
- **`formatters/`**: Utilities for formatting data, such as pagination.
- **`hashing/`**: Services for hashing
- **`repositories/`**: Base repository implementations and transaction handling.
- **`shared.module.ts`**: A module that exports shared services and utilities.
