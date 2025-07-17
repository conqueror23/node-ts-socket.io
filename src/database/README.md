# Portfolio Database

PostgreSQL database mock for online portfolio with 4 main entities: projects, tech stack learning materials, work experience, and study experience.

## Quick Start

### Option 1: Docker (Recommended)

**Quick Setup:**
```bash
npm run db:setup
```

**Manual Steps:**
1. **Start database with Docker:**
   ```bash
   npm run db:start
   ```

2. **Install dependencies:**
   ```bash
   npm install pg @types/pg
   ```

3. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Test connection:**
   ```bash
   npx ts-node src/database/setup.ts
   ```

5. **Access database tools:**
   - pgAdmin: http://localhost:8080 (admin@portfolio.com / admin)
   - Adminer: http://localhost:8081 (server: postgres, user: postgres, password: password)

**Available NPM Scripts:**
```bash
npm run db:start        # Start PostgreSQL + pgAdmin + Adminer
npm run db:stop         # Stop all database services
npm run db:reset        # Reset database (removes all data)
npm run db:migrate:up   # Run schema + seed data
npm run db:migrate:down # Drop all tables
npm run db:logs         # View PostgreSQL logs
npm run db:setup        # Complete setup (env + start + test)
```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL** (if not already installed)
2. **Create database:**
   ```bash
   createdb portfolio_db
   ```

3. **Install dependencies:**
   ```bash
   npm install pg @types/pg
   ```

4. **Setup environment variables** (create `.env` file):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=portfolio_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

5. **Create tables:**
   ```bash
   psql -U postgres -d portfolio_db -f src/database/schema.sql
   ```

6. **Load sample data:**
   ```bash
   psql -U postgres -d portfolio_db -f src/database/sample-data.sql
   ```

7. **Test connection:**
   ```bash
   npx ts-node src/database/setup.ts
   ```

## Database Structure

### Tables

1. **projects** - Portfolio projects
2. **tech_stack_materials** - Learning resources and progress
3. **work_experience** - Professional work history
4. **study_experience** - Educational background

### Features

- Automatic timestamps (`created_at`, `updated_at`)
- Array fields for technologies, achievements, courses
- Flexible status tracking
- Comprehensive indexing for performance
- Sample data for testing

## Files

- `schema.sql` - Database structure and constraints
- `sample-data.sql` - Example records for all tables
- `connection.ts` - Database connection pool
- `models.ts` - TypeScript interfaces
- `setup.ts` - Database initialization script

## Usage in Code

```typescript
import pool from './database/connection';
import { Project, WorkExperience } from './database/models';

// Query projects
const result = await pool.query('SELECT * FROM projects WHERE status = $1', ['completed']);
const projects: Project[] = result.rows;
```