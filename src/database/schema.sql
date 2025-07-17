-- Portfolio Database Schema
-- Creates tables for managing online portfolio data

-- Projects table: stores information about completed projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack TEXT[], -- Array of technologies used
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    image_url VARCHAR(500),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'completed', -- completed, in_progress, planned
    category VARCHAR(100), -- web, mobile, desktop, data_science, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tech Stack Learning Materials table: stores learning resources and progress
CREATE TABLE tech_stack_materials (
    id SERIAL PRIMARY KEY,
    technology VARCHAR(255) NOT NULL,
    resource_title VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100), -- course, tutorial, documentation, book, video
    resource_url VARCHAR(500),
    provider VARCHAR(255), -- Udemy, YouTube, official docs, etc.
    difficulty_level VARCHAR(50), -- beginner, intermediate, advanced
    completion_status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed
    completion_percentage INTEGER DEFAULT 0,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    start_date DATE,
    completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work Experience table: stores professional work history
CREATE TABLE work_experience (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    position_title VARCHAR(255) NOT NULL,
    employment_type VARCHAR(100), -- full_time, part_time, contract, internship
    location VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE, -- NULL if current position
    is_current BOOLEAN DEFAULT FALSE,
    job_description TEXT,
    key_achievements TEXT[],
    technologies_used TEXT[],
    company_url VARCHAR(500),
    company_logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study Experience table: stores educational background
CREATE TABLE study_experience (
    id SERIAL PRIMARY KEY,
    institution_name VARCHAR(255) NOT NULL,
    degree_type VARCHAR(100), -- bachelor, master, phd, certificate, diploma
    field_of_study VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE, -- NULL if currently studying
    is_current BOOLEAN DEFAULT FALSE,
    gpa DECIMAL(3,2),
    grade_scale VARCHAR(50), -- 4.0, 100, letter, etc.
    location VARCHAR(255),
    institution_url VARCHAR(500),
    institution_logo_url VARCHAR(500),
    major_courses TEXT[],
    achievements TEXT[], -- dean's list, honors, awards, etc.
    thesis_title VARCHAR(500),
    thesis_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Careers table: stores career goals, aspirations and achievements
CREATE TABLE careers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    career_type VARCHAR(100), -- goal, achievement, milestone, aspiration
    category VARCHAR(100), -- professional, personal, academic, technical
    status VARCHAR(50) DEFAULT 'planned', -- planned, in_progress, achieved, paused, cancelled
    priority_level VARCHAR(50) DEFAULT 'medium', -- low, medium, high, critical
    target_date DATE,
    achieved_date DATE,
    skills_required TEXT[],
    skills_gained TEXT[],
    steps_to_achieve TEXT[],
    resources_needed TEXT[],
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    challenges TEXT[],
    lessons_learned TEXT[],
    related_experiences TEXT[], -- references to work_experience or study_experience
    tags TEXT[],
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_tech_materials_technology ON tech_stack_materials(technology);
CREATE INDEX idx_tech_materials_completion_status ON tech_stack_materials(completion_status);
CREATE INDEX idx_work_experience_current ON work_experience(is_current);
CREATE INDEX idx_study_experience_current ON study_experience(is_current);
CREATE INDEX idx_careers_status ON careers(status);
CREATE INDEX idx_careers_category ON careers(category);
CREATE INDEX idx_careers_priority ON careers(priority_level);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to automatically update updated_at columns
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tech_materials_updated_at BEFORE UPDATE ON tech_stack_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_experience_updated_at BEFORE UPDATE ON work_experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_experience_updated_at BEFORE UPDATE ON study_experience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_careers_updated_at BEFORE UPDATE ON careers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();