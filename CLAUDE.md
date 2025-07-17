# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `npm run build` - Compiles TypeScript to JavaScript in `dist/` directory
- **Socket.IO Server**: `npm run dev:socket` - Builds and runs the Socket.IO server on port 5005
- **Apollo GraphQL Server**: `npm run dev:appolo` - Runs the Apollo GraphQL server on port 5051 using ts-node

## Project Architecture

This is a dual-server Node.js/TypeScript project with two distinct server implementations:

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

### TypeScript Configuration
- Compiles to CommonJS modules targeting ES6
- Output directory: `dist/`
- Source maps enabled for debugging

## Port Configuration
- Socket.IO server: port 5005
- Apollo GraphQL server: port 5051
- Expected client connection: localhost:3001