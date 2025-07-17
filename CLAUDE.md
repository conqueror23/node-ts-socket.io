# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript to JavaScript in `dist/` directory
- **Socket.IO Server**: `npm run dev:socket` - Builds and runs the Socket.IO server on port 5005
- **Apollo GraphQL Server**: `npm run dev:appolo` - Runs the Apollo GraphQL server on port 5051 using ts-node
- **Fastify API Server**: `npm run dev:fastify` - Runs the Fastify REST API server on port 5052 using ts-node

## Project Architecture

This is a multi-server Node.js/TypeScript project with three distinct server implementations:

### Socket.IO Server (`src/socket-io/`)
- Real-time chat server using Socket.IO
- Handles client connections, message echoing, and client-to-client communication
- Configured with CORS for `localhost:3001`
- Events: `message`, `client-message`, `chatMessage`

### Apollo GraphQL Server (`src/appolo/`)
- GraphQL API server using Apollo Server v3
- Modular schema structure with separate type definitions and resolvers
- Resolvers organized by domain: `car`, `house`, `shoe`
- Schema files mirror resolver structure in `schema/` directory

### Fastify REST API Server (`src/fastify/`)
- REST API server using Fastify framework
- CRUD operations for careers, work experiences, and study experiences
- PostgreSQL database integration with connection pooling
- Routes organized by domain: `/api/careers`, `/api/work-experience`, `/api/study-experience`
- Features filtering, pagination, statistics endpoints, and health checks

### TypeScript Configuration
- Compiles to CommonJS modules targeting ES6
- Output directory: `dist/`
- Source maps enabled for debugging

## Port Configuration
- Socket.IO server: port 5005
- Apollo GraphQL server: port 5051
- Fastify REST API server: port 5052
- Expected client connection: localhost:3001

## Database
- PostgreSQL database with Docker Compose setup
- Database name: `portfolio_db`
- Tables: `projects`, `tech_stack_materials`, `work_experience`, `study_experience`, `careers`
- Commands: `npm run db:start`, `npm run db:stop`, `npm run db:reset`