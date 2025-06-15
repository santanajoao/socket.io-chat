# Socket IO Chat - Fullstack

![Project Banner](frontend/docs/images/socket-io-chat-screenshot.png)

## Table of Contents
- [Description](#description)
- [Detailed Documentation](#detailed-documentation)
- [Tech and Tools](#tech-and-tools)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Installation and Setup](#installation-and-setup)
- [Features](#features)

## Description
A fullstack chat application. It combines a **React** and **Next.js** frontend with a **NestJS** and **Prisma** backend, leveraging **Socket.IO** for seamless real-time interactions.

## Detailed Documentation
For more detailed information about the frontend and backend, refer to their respective documentation:

- **Frontend Documentation**: [Frontend README](./frontend/README.md)
- **Backend Documentation**: [Backend README](./backend/README.md)

## Tech and Tools

### Frontend
The frontend is built with modern tools and frameworks to ensure a responsive and dynamic user experience:
- **React**: [React Documentation](https://reactjs.org/)
- **Next.js**: [Next.js Documentation](https://nextjs.org/)
- **Socket.IO Client**: [Socket.IO Documentation](https://socket.io/)
- **TailwindCSS**: [TailwindCSS Documentation](https://tailwindcss.com/)
- **Axios**: [Axios Documentation](https://axios-http.com/)
- **Shadcn**: [shadcn Documentation](https://shadcn.dev/)
- **React Hook Form**: [React Hook Form Documentation](https://react-hook-form.com/)
- **Zod**: [Zod Documentation](https://zod.dev/)
- **ESLint**: [ESLint Documentation](https://eslint.org/)
- **pnpm**: [pnpm Documentation](https://pnpm.io/)

### Backend
The backend is designed for scalability and performance, with a focus on real-time communication and robust API design:
- **Node.js**: [Node.js Documentation](https://nodejs.org/)
- **NestJS**: [NestJS Documentation](https://nestjs.com/)
- **Socket.IO**: [Socket.IO Documentation](https://socket.io/)
- **TypeScript**: [TypeScript Documentation](https://www.typescriptlang.org/)
- **Zod**: [Zod Documentation](https://zod.dev/)
- **Prisma**: [Prisma Documentation](https://www.prisma.io/)
- **ESLint**: [ESLint Documentation](https://eslint.org/)
- **Prettier**: [Prettier Documentation](https://prettier.io/)
- **pnpm**: [pnpm Documentation](https://pnpm.io/)

## Installation and Setup
This project uses Docker for a streamlined setup process. Follow the steps below to get started:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/santanajoao/socket.io-chat.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd socket.io-chat
   ```

3. **Configure the environment file**:
   - Rename the `.env.example` file to `.env`.
   - Update the environment variables as needed (e.g., database URL, ports).

4. **Start the application using Docker Compose**:
   ```bash
   docker-compose up --build
   ```

5. **Access the application**:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend**: [http://localhost:3001](http://localhost:3001)

## Features
- **Real-time Chat**: Instant communication between users using **Socket.IO**.
- **Private Chats**: Secure one-on-one conversations.
- **Global Chats**: Public chat rooms for all users.
- **Group Chats**: Create and manage chat groups for specific topics or teams.
- **User Invitations**: Invite others to join private or group chats.
- **Group Roles**: Admins can assign roles and manage participants.
- **Group Management**: Update group details and settings.
- **Notifications**: Real-time alerts for new messages, user joins, and user leaves.
- **RESTful API**: Endpoints for authentication, user management, chats, and invitations.
- **JWT Authentication**: Secure token-based authentication.
- **Database Management**: Relational database handled with **Prisma** and **PostgreSQL**.
