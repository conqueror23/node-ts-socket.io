import { FastifyInstance } from 'fastify';
import pool from '../../database/connection';
import { CreateCareer, UpdateCareer } from '../../database/models';

interface CareerParams {
  id: string;
}

interface CareerQuery {
  status?: string;
  category?: string;
  priority_level?: string;
  limit?: string;
  offset?: string;
}

export async function careersRoutes(fastify: FastifyInstance) {
  // GET /api/careers - Get all careers with optional filtering
  fastify.get<{ Querystring: CareerQuery }>('/', async (request, reply) => {
    try {
      const { status, category, priority_level, limit = '50', offset = '0' } = request.query;

      let query = 'SELECT * FROM careers WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (status) {
        query += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (category) {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (priority_level) {
        query += ` AND priority_level = $${paramIndex}`;
        params.push(priority_level);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, params);

      return {
        data: result.rows,
        meta: {
          total: result.rowCount,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch careers' });
    }
  });

  // GET /api/careers/:id - Get career by ID
  fastify.get<{ Params: CareerParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query('SELECT * FROM careers WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Career not found' });
      }

      return { data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch career' });
    }
  });

  // POST /api/careers - Create new career
  fastify.post<{ Body: CreateCareer }>('/', async (request, reply) => {
    try {
      const career = request.body;

      const query = `
        INSERT INTO careers (
          title, description, career_type, category, status, priority_level,
          target_date, achieved_date, skills_required, skills_gained,
          steps_to_achieve, resources_needed, progress_percentage,
          challenges, lessons_learned, related_experiences, tags, is_public
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING *
      `;

      const values = [
        career.title,
        career.description || null,
        career.career_type || null,
        career.category || null,
        career.status || 'planned',
        career.priority_level || 'medium',
        career.target_date || null,
        career.achieved_date || null,
        career.skills_required || [],
        career.skills_gained || [],
        career.steps_to_achieve || [],
        career.resources_needed || [],
        career.progress_percentage || 0,
        career.challenges || [],
        career.lessons_learned || [],
        career.related_experiences || [],
        career.tags || [],
        career.is_public !== undefined ? career.is_public : true
      ];

      const result = await pool.query(query, values);

      reply.status(201).send({ data: result.rows[0] });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to create career' });
    }
  });

  // PUT /api/careers/:id - Update career
  fastify.put<{ Params: CareerParams; Body: UpdateCareer }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const updates = request.body;

      // Check if career exists
      const existingCareer = await pool.query('SELECT * FROM careers WHERE id = $1', [id]);
      if (existingCareer.rows.length === 0) {
        return reply.status(404).send({ error: 'Career not found' });
      }

      // Build dynamic update query
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          updateFields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });

      if (updateFields.length === 0) {
        return reply.status(400).send({ error: 'No fields to update' });
      }

      const query = `
        UPDATE careers 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;
      values.push(id);

      const result = await pool.query(query, values);

      return { data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to update career' });
    }
  });

  // DELETE /api/careers/:id - Delete career
  fastify.delete<{ Params: CareerParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const result = await pool.query('DELETE FROM careers WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Career not found' });
      }

      return { message: 'Career deleted successfully', data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to delete career' });
    }
  });

  // GET /api/careers/stats - Get career statistics
  fastify.get('/stats', async (request, reply) => {
    try {
      const statsQuery = `
        SELECT 
          status,
          category,
          priority_level,
          COUNT(*) as count,
          AVG(progress_percentage) as avg_progress
        FROM careers 
        GROUP BY status, category, priority_level
        ORDER BY status, category, priority_level
      `;

      const totalQuery = 'SELECT COUNT(*) as total FROM careers';

      const [statsResult, totalResult] = await Promise.all([
        pool.query(statsQuery),
        pool.query(totalQuery)
      ]);

      return {
        total: parseInt(totalResult.rows[0].total),
        breakdown: statsResult.rows
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch career statistics' });
    }
  });
}
