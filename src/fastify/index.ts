import fastify from 'fastify';
import cors from '@fastify/cors';
import { DatabaseConnection } from '../database/connection';
import { careersRoutes } from './routes/careers';
import { workExperienceRoutes } from './routes/work-experience';
import { studyExperienceRoutes } from './routes/study-experience';

const server = fastify({ logger: true });

const PORT = 5052;

// Register CORS plugin
server.register(cors, {
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true,
});

// Health check endpoint
server.get('/health', async (request, reply) => {
  const dbConnected = await DatabaseConnection.testConnection();
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
    service: 'fastify-api'
  };
});

// Register route plugins
server.register(careersRoutes, { prefix: '/api/careers' });
server.register(workExperienceRoutes, { prefix: '/api/work-experience' });
server.register(studyExperienceRoutes, { prefix: '/api/study-experience' });

// Start server
const start = async () => {
  try {
    // Test database connection
    const dbConnected = await DatabaseConnection.testConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Please check your database configuration.');
      process.exit(1);
    }

    // Initialize database tables check
    await DatabaseConnection.initializeDatabase();

    // Start server
    await server.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 Fastify API server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`💼 Careers API: http://localhost:${PORT}/api/careers`);
    console.log(`🏢 Work Experience API: http://localhost:${PORT}/api/work-experience`);
    console.log(`🎓 Study Experience API: http://localhost:${PORT}/api/study-experience`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...');
  await DatabaseConnection.closeConnections();
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM. Graceful shutdown...');
  await DatabaseConnection.closeConnections();
  await server.close();
  process.exit(0);
});

start();