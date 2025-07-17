import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import pool from '../../database/connection';
import { StudyExperience, CreateStudyExperience, UpdateStudyExperience } from '../../database/models';

interface StudyExperienceParams {
  id: string;
}

interface StudyExperienceQuery {
  degree_type?: string;
  is_current?: string;
  institution_name?: string;
  field_of_study?: string;
  limit?: string;
  offset?: string;
}

export async function studyExperienceRoutes(fastify: FastifyInstance) {
  // GET /api/study-experience - Get all study experiences with optional filtering
  fastify.get<{ Querystring: StudyExperienceQuery }>('/', async (request, reply) => {
    try {
      const { degree_type, is_current, institution_name, field_of_study, limit = '50', offset = '0' } = request.query;
      
      let query = 'SELECT * FROM study_experience WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (degree_type) {
        query += ` AND degree_type = $${paramIndex}`;
        params.push(degree_type);
        paramIndex++;
      }

      if (is_current !== undefined) {
        query += ` AND is_current = $${paramIndex}`;
        params.push(is_current === 'true');
        paramIndex++;
      }

      if (institution_name) {
        query += ` AND institution_name ILIKE $${paramIndex}`;
        params.push(`%${institution_name}%`);
        paramIndex++;
      }

      if (field_of_study) {
        query += ` AND field_of_study ILIKE $${paramIndex}`;
        params.push(`%${field_of_study}%`);
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
      reply.status(500).send({ error: 'Failed to fetch study experiences' });
    }
  });

  // GET /api/study-experience/:id - Get study experience by ID
  fastify.get<{ Params: StudyExperienceParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const result = await pool.query('SELECT * FROM study_experience WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Study experience not found' });
      }
      
      return { data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch study experience' });
    }
  });

  // POST /api/study-experience - Create new study experience
  fastify.post<{ Body: CreateStudyExperience }>('/', async (request, reply) => {
    try {
      const studyExp = request.body;
      
      const query = `
        INSERT INTO study_experience (
          institution_name, degree_type, field_of_study, specialization,
          start_date, end_date, is_current, gpa, grade_scale, location,
          institution_url, institution_logo_url, major_courses, achievements,
          thesis_title, thesis_description
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        ) RETURNING *
      `;
      
      const values = [
        studyExp.institution_name,
        studyExp.degree_type || null,
        studyExp.field_of_study,
        studyExp.specialization || null,
        studyExp.start_date,
        studyExp.end_date || null,
        studyExp.is_current || false,
        studyExp.gpa || null,
        studyExp.grade_scale || null,
        studyExp.location || null,
        studyExp.institution_url || null,
        studyExp.institution_logo_url || null,
        studyExp.major_courses || [],
        studyExp.achievements || [],
        studyExp.thesis_title || null,
        studyExp.thesis_description || null
      ];
      
      const result = await pool.query(query, values);
      
      reply.status(201).send({ data: result.rows[0] });
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to create study experience' });
    }
  });

  // PUT /api/study-experience/:id - Update study experience
  fastify.put<{ Params: StudyExperienceParams; Body: UpdateStudyExperience }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const updates = request.body;
      
      // Check if study experience exists
      const existingStudyExp = await pool.query('SELECT * FROM study_experience WHERE id = $1', [id]);
      if (existingStudyExp.rows.length === 0) {
        return reply.status(404).send({ error: 'Study experience not found' });
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
        UPDATE study_experience 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $${paramIndex} 
        RETURNING *
      `;
      values.push(id);
      
      const result = await pool.query(query, values);
      
      return { data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to update study experience' });
    }
  });

  // DELETE /api/study-experience/:id - Delete study experience
  fastify.delete<{ Params: StudyExperienceParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      
      const result = await pool.query('DELETE FROM study_experience WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return reply.status(404).send({ error: 'Study experience not found' });
      }
      
      return { message: 'Study experience deleted successfully', data: result.rows[0] };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to delete study experience' });
    }
  });

  // GET /api/study-experience/current - Get current study experiences
  fastify.get('/current', async (request, reply) => {
    try {
      const result = await pool.query('SELECT * FROM study_experience WHERE is_current = true ORDER BY start_date DESC');
      return { data: result.rows };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch current study experiences' });
    }
  });

  // GET /api/study-experience/stats - Get study experience statistics
  fastify.get('/stats', async (request, reply) => {
    try {
      const statsQuery = `
        SELECT 
          degree_type,
          COUNT(*) as count,
          COUNT(CASE WHEN is_current THEN 1 END) as current_count,
          AVG(gpa) as avg_gpa
        FROM study_experience 
        WHERE degree_type IS NOT NULL
        GROUP BY degree_type
        ORDER BY degree_type
      `;
      
      const totalQuery = 'SELECT COUNT(*) as total FROM study_experience';
      const currentQuery = 'SELECT COUNT(*) as current_total FROM study_experience WHERE is_current = true';
      
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
      reply.status(500).send({ error: 'Failed to fetch study experience statistics' });
    }
  });

  // GET /api/study-experience/degrees - Get degrees by type
  fastify.get('/degrees', async (request, reply) => {
    try {
      const result = await pool.query(`
        SELECT 
          degree_type,
          field_of_study,
          institution_name,
          gpa,
          start_date,
          end_date,
          is_current
        FROM study_experience 
        ORDER BY degree_type, start_date DESC
      `);
      
      // Group by degree type
      const degreesByType = result.rows.reduce((acc: any, row: any) => {
        const degreeType = row.degree_type || 'unspecified';
        if (!acc[degreeType]) {
          acc[degreeType] = [];
        }
        acc[degreeType].push(row);
        return acc;
      }, {});
      
      return { data: degreesByType };
    } catch (error) {
      request.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch degrees by type' });
    }
  });
}