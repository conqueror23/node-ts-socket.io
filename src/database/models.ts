// TypeScript interfaces for database entities

export interface Project {
  id?: number;
  title: string;
  description?: string;
  tech_stack?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  start_date?: Date;
  end_date?: Date;
  status?: 'completed' | 'in_progress' | 'planned';
  category?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TechStackMaterial {
  id?: number;
  technology: string;
  resource_title: string;
  resource_type?: 'course' | 'tutorial' | 'documentation' | 'book' | 'video';
  resource_url?: string;
  provider?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  completion_status?: 'not_started' | 'in_progress' | 'completed';
  completion_percentage?: number;
  notes?: string;
  rating?: number;
  start_date?: Date;
  completion_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface WorkExperience {
  id?: number;
  company_name: string;
  position_title: string;
  employment_type?: 'full_time' | 'part_time' | 'contract' | 'internship';
  location?: string;
  start_date: Date;
  end_date?: Date;
  is_current?: boolean;
  job_description?: string;
  key_achievements?: string[];
  technologies_used?: string[];
  company_url?: string;
  company_logo_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface StudyExperience {
  id?: number;
  institution_name: string;
  degree_type?: 'bachelor' | 'master' | 'phd' | 'certificate' | 'diploma';
  field_of_study: string;
  specialization?: string;
  start_date: Date;
  end_date?: Date;
  is_current?: boolean;
  gpa?: number;
  grade_scale?: string;
  location?: string;
  institution_url?: string;
  institution_logo_url?: string;
  major_courses?: string[];
  achievements?: string[];
  thesis_title?: string;
  thesis_description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Career {
  id?: number;
  title: string;
  description?: string;
  career_type?: 'goal' | 'achievement' | 'milestone' | 'aspiration';
  category?: 'professional' | 'personal' | 'academic' | 'technical';
  status?: 'planned' | 'in_progress' | 'achieved' | 'paused' | 'cancelled';
  priority_level?: 'low' | 'medium' | 'high' | 'critical';
  target_date?: Date;
  achieved_date?: Date;
  skills_required?: string[];
  skills_gained?: string[];
  steps_to_achieve?: string[];
  resources_needed?: string[];
  progress_percentage?: number;
  challenges?: string[];
  lessons_learned?: string[];
  related_experiences?: string[];
  tags?: string[];
  is_public?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Input types for creating new records (without auto-generated fields)
export type CreateProject = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type CreateTechStackMaterial = Omit<TechStackMaterial, 'id' | 'created_at' | 'updated_at'>;
export type CreateWorkExperience = Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>;
export type CreateStudyExperience = Omit<StudyExperience, 'id' | 'created_at' | 'updated_at'>;
export type CreateCareer = Omit<Career, 'id' | 'created_at' | 'updated_at'>;

// Update types for partial updates
export type UpdateProject = Partial<CreateProject>;
export type UpdateTechStackMaterial = Partial<CreateTechStackMaterial>;
export type UpdateWorkExperience = Partial<CreateWorkExperience>;
export type UpdateStudyExperience = Partial<CreateStudyExperience>;
export type UpdateCareer = Partial<CreateCareer>;