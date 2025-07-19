import { FastifyInstance } from 'fastify';
import pool from '../../database/connection';
import { CreateWorkExperience, UpdateWorkExperience } from '../../database/models';

interface WorkExperienceParams {
  id: string;
}

interface WorkExperienceQuery {
  employment_type?: string;
  is_current?: string;
  company_name?: string;
  limit?: string;
  offset?: string;
}

export async function workExperienceRoutes(fastify: FastifyInstance) {
  // GET /api/work-experience - Get all work experiences with optional filtering
  fastify.get<{ Querystring: WorkExperienceQuery }>('/', async (request, reply) => {
    try {
      const { employment_type, is_current, company_name, limit = '50', offset = '0' } = request.query;

      let query = 'SELECT * FROM work_experience WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (employment_type) {
        query += ` AND employment_type = $${paramIndex}`;
        params.push(employment_type);
        paramIndex++;
      }

      if (is_current !== undefined) {
        query += ` AND is_current = $${paramIndex}`;
        params.push(is_current === 'true');
        paramIndex++;
      }

      if (company_name) {
        query += ` AND company_name ILIKE $${paramIndex}`;
        params.push(`%${company_name}%`);
        paramIndex++;
      }

      query += ` ORDER BY start_date DESC, is_current DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
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
      reply.status(500).send({ error: 'Failed to fetch work experiences' });
    }
  });

  // GET /api/work-experience/:id - Get work experience by ID
  fastify.get<{ Params: WorkExperienceParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query('SELECT * FROM work_experience WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Work experience not found' });
      }

      return { data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch work experience' });
    }
  });

  // POST /api/work-experience - Create new work experience
  fastify.post<{ Body: CreateWorkExperience }>('/', async (request, reply) => {
    try {
      const workExp = request.body;

      const query = `
        INSERT INTO work_experience (
          company_name, position_title, employment_type, location,
          start_date, end_date, is_current, job_description,
          key_achievements, technologies_used, company_url, company_logo_url
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        ) RETURNING *
      `;

      const values = [
        workExp.company_name,
        workExp.position_title,
        workExp.employment_type || null,
        workExp.location || null,
        workExp.start_date,
        workExp.end_date || null,
        workExp.is_current || false,
        workExp.job_description || null,
        workExp.key_achievements || [],
        workExp.technologies_used || [],
        workExp.company_url || null,
        workExp.company_logo_url || null
      ];

      const result = await pool.query(query, values);

      reply.status(201).send({ data: result.rows[0] });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to create work experience' });
    }
  });

  // PUT /api/work-experience/:id - Update work experience
  fastify.put<{ Params: WorkExperienceParams; Body: UpdateWorkExperience }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const updates = request.body;

      // Check if work experience exists
      const existingWorkExp = await pool.query('SELECT * FROM work_experience WHERE id = $1', [id]);
      if (existingWorkExp.rows.length === 0) {
        return reply.status(404).send({ error: 'Work experience not found' });
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
        UPDATE work_experience 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;
      values.push(id);

      const result = await pool.query(query, values);

      return { data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to update work experience' });
    }
  });

  // DELETE /api/work-experience/:id - Delete work experience
  fastify.delete<{ Params: WorkExperienceParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;

      const result = await pool.query('DELETE FROM work_experience WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Work experience not found' });
      }

      return { message: 'Work experience deleted successfully', data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to delete work experience' });
    }
  });

  // GET /api/work-experience/current - Get current work experiences
  fastify.get('/current', async (request, reply) => {
    try {
      const result = await pool.query('SELECT * FROM work_experience WHERE is_current = true ORDER BY start_date DESC');
      return { data: result.rows };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch current work experiences' });
    }
  });

  // GET /api/work-experience/stats - Get work experience statistics
  fastify.get('/stats', async (request, reply) => {
    try {
      const statsQuery = `
        SELECT 
          employment_type,
          COUNT(*) as count,
          COUNT(CASE WHEN is_current THEN 1 END) as current_count
        FROM work_experience 
        GROUP BY employment_type
        ORDER BY employment_type
      `;

      const totalQuery = 'SELECT COUNT(*) as total FROM work_experience';
      const currentQuery = 'SELECT COUNT(*) as current_total FROM work_experience WHERE is_current = true';

      const [statsResult, totalResult, currentResult] = await Promise.all([
        pool.query(statsQuery),
        pool.query(totalQuery),
        pool.query(currentQuery)
      ]);

      return {
        total: parseInt(totalResult.rows[0].total),
        current_total: parseInt(currentResult.rows[0].current_total),
        breakdown: statsResult.rows
      };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch work experience statistics' });
    }
  });
}
