import { DatabaseConnection } from './connection';

/**
 * Database setup script
 * Run this to test connection and initialize the database
 */
async function setupDatabase() {
  console.log('🔄 Setting up portfolio database...\n');

  try {
    // Test database connection
    console.log('1. Testing database connection...');
    const isConnected = await DatabaseConnection.testConnection();
    
    if (!isConnected) {
      console.error('❌ Database connection failed!');
      console.log('\n📋 Setup checklist:');
      console.log('   • Ensure PostgreSQL is running');
      console.log('   • Create database: createdb portfolio_db');
      console.log('   • Update connection settings in .env file');
      process.exit(1);
    }

    // Check/initialize tables
    console.log('2. Checking database tables...');
    await DatabaseConnection.initializeDatabase();

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📁 Next steps:');
    console.log('   • Run schema: psql -U postgres -d portfolio_db -f src/database/schema.sql');
    console.log('   • Load sample data: psql -U postgres -d portfolio_db -f src/database/sample-data.sql');
    console.log('   • Start your application');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await DatabaseConnection.closeConnections();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export { setupDatabase };