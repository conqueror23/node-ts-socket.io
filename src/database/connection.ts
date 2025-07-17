import { Client, Pool } from 'pg';

// Database configuration interface
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Default configuration for local development
const defaultConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'portfolio_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
};

// Connection pool for better performance
export const pool = new Pool({
  ...defaultConfig,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Database connection utilities
export class DatabaseConnection {
  /**
   * Test database connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW()');
      client.release();
      console.log('Database connected successfully at:', result.rows[0].now);
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      return false;
    }
  }

  /**
   * Initialize database tables
   */
  static async initializeDatabase(): Promise<void> {
    const client = await pool.connect();
    try {
      // Check if tables exist
      const tableCheck = await client.query(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('projects', 'tech_stack_materials', 'work_experience', 'study_experience', 'careers')
      `);

      if (tableCheck.rows.length < 5) {
        console.log('Tables not found. Please run the schema.sql file to create tables.');
        console.log('Command: psql -U postgres -d portfolio_db -f src/database/schema.sql');
      } else {
        console.log('All required tables found in database.');
      }
    } catch (error) {
      console.error('Error checking database tables:', error);
    } finally {
      client.release();
    }
  }

  /**
   * Close all connections
   */
  static async closeConnections(): Promise<void> {
    await pool.end();
    console.log('Database connections closed.');
  }
}

// Export pool as default for direct use
export default pool;
