-- Sample Data for Portfolio Database
-- Insert sample records to demonstrate the database structure

-- Sample Projects
INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, start_date, end_date, status, category) VALUES
('E-commerce Platform', 'Full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment integration', 
 ARRAY['React', 'Node.js', 'Express', 'PostgreSQL', 'Stripe API', 'JWT', 'Tailwind CSS'], 
 'https://github.com/username/ecommerce-platform', 'https://myecommerce.netlify.app', 
 'https://example.com/ecommerce-screenshot.png', '2024-01-15', '2024-04-20', 'completed', 'web'),

('Task Management Mobile App', 'Cross-platform mobile app for task management with offline sync capabilities', 
 ARRAY['React Native', 'Redux', 'SQLite', 'Firebase', 'TypeScript'], 
 'https://github.com/username/task-manager-mobile', NULL, 
 'https://example.com/taskapp-screenshot.png', '2024-05-01', '2024-07-15', 'completed', 'mobile'),

('Data Analytics Dashboard', 'Interactive dashboard for visualizing sales and customer data with real-time updates', 
 ARRAY['Python', 'Django', 'PostgreSQL', 'Chart.js', 'WebSocket', 'Docker'], 
 'https://github.com/username/analytics-dashboard', 'https://analytics-demo.herokuapp.com', 
 'https://example.com/dashboard-screenshot.png', '2024-08-01', NULL, 'in_progress', 'web'),

('Personal Portfolio Website', 'Responsive portfolio website showcasing projects and skills', 
 ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'], 
 'https://github.com/username/portfolio', 'https://myportfolio.vercel.app', 
 'https://example.com/portfolio-screenshot.png', '2024-03-10', '2024-03-25', 'completed', 'web');

-- Sample Tech Stack Learning Materials
INSERT INTO tech_stack_materials (technology, resource_title, resource_type, resource_url, provider, difficulty_level, completion_status, completion_percentage, notes, rating, start_date, completion_date) VALUES
('React', 'Complete React Developer Course', 'course', 'https://udemy.com/react-complete-course', 'Udemy', 'intermediate', 'completed', 100, 'Excellent course covering hooks, context, and modern React patterns', 5, '2023-11-01', '2023-12-15'),

('PostgreSQL', 'PostgreSQL Tutorial for Beginners', 'tutorial', 'https://postgresql.org/docs', 'Official Documentation', 'beginner', 'completed', 100, 'Great foundation for database concepts and SQL queries', 4, '2023-10-15', '2023-11-10'),

('Docker', 'Docker Mastery: Complete Toolset', 'course', 'https://udemy.com/docker-mastery', 'Udemy', 'intermediate', 'in_progress', 75, 'Learning containerization and orchestration', 4, '2024-06-01', NULL),

('GraphQL', 'GraphQL with React: The Complete Developers Guide', 'course', 'https://udemy.com/graphql-react', 'Udemy', 'advanced', 'not_started', 0, 'Planned for next quarter', NULL, NULL, NULL),

('TypeScript', 'Understanding TypeScript', 'course', 'https://udemy.com/understanding-typescript', 'Udemy', 'intermediate', 'completed', 100, 'Essential for type-safe JavaScript development', 5, '2024-01-10', '2024-02-20'),

('AWS', 'AWS Certified Solutions Architect', 'certification', 'https://aws.amazon.com/certification', 'Amazon Web Services', 'advanced', 'in_progress', 60, 'Preparing for certification exam', 4, '2024-07-01', NULL);

-- Sample Work Experience
INSERT INTO work_experience (company_name, position_title, employment_type, location, start_date, end_date, is_current, job_description, key_achievements, technologies_used, company_url, company_logo_url) VALUES
('TechCorp Solutions', 'Full Stack Developer', 'full_time', 'San Francisco, CA', '2023-06-01', NULL, true, 
 'Develop and maintain web applications using modern JavaScript frameworks. Collaborate with cross-functional teams to deliver high-quality software solutions.',
 ARRAY['Reduced application load time by 40% through code optimization', 'Led migration from legacy system to modern React architecture', 'Mentored 2 junior developers'],
 ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
 'https://techcorp.com', 'https://techcorp.com/logo.png'),

('StartupXYZ', 'Frontend Developer', 'full_time', 'Remote', '2022-08-15', '2023-05-30', false,
 'Built responsive user interfaces and implemented new features for the company''s main product. Worked closely with UX/UI designers to ensure pixel-perfect implementations.',
 ARRAY['Improved user engagement by 25% through UI/UX improvements', 'Implemented comprehensive testing suite', 'Reduced bug reports by 30%'],
 ARRAY['Vue.js', 'JavaScript', 'SCSS', 'Jest', 'Cypress', 'Figma'],
 'https://startupxyz.com', 'https://startupxyz.com/logo.png'),

('Freelance Web Developer', 'Web Developer', 'contract', 'Remote', '2022-01-01', '2022-08-01', false,
 'Provided web development services to small and medium businesses. Created custom websites and web applications based on client requirements.',
 ARRAY['Successfully delivered 15+ projects on time and within budget', 'Achieved 98% client satisfaction rating', 'Built long-term relationships with repeat clients'],
 ARRAY['WordPress', 'PHP', 'MySQL', 'HTML/CSS', 'JavaScript', 'Bootstrap'],
 NULL, NULL);

-- Sample Study Experience
INSERT INTO study_experience (institution_name, degree_type, field_of_study, specialization, start_date, end_date, is_current, gpa, grade_scale, location, institution_url, institution_logo_url, major_courses, achievements, thesis_title, thesis_description) VALUES
('Stanford University', 'master', 'Computer Science', 'Software Engineering', '2021-09-01', '2023-06-15', false, 3.85, '4.0', 'Stanford, CA', 'https://stanford.edu', 'https://stanford.edu/logo.png',
 ARRAY['Advanced Algorithms', 'Database Systems', 'Software Engineering', 'Machine Learning', 'Computer Networks', 'Distributed Systems'],
 ARRAY['Dean''s List (Fall 2022, Spring 2023)', 'Graduate Teaching Assistant for CS106A', 'Published research paper in ICSE 2023'],
 'Optimizing Database Query Performance in Distributed Systems', 'Research focused on improving query execution time in distributed database environments through novel caching strategies and load balancing algorithms.'),

('University of California, Berkeley', 'bachelor', 'Computer Science', NULL, '2017-08-25', '2021-05-20', false, 3.72, '4.0', 'Berkeley, CA', 'https://berkeley.edu', 'https://berkeley.edu/logo.png',
 ARRAY['Data Structures', 'Computer Architecture', 'Operating Systems', 'Computer Graphics', 'Artificial Intelligence', 'Software Engineering'],
 ARRAY['Summa Cum Laude', 'Phi Beta Kappa Honor Society', 'ACM Programming Contest Finalist'],
 NULL, NULL),

('Google Career Certificates', 'certificate', 'UX Design', NULL, '2024-01-15', '2024-04-30', false, NULL, NULL, 'Online', 'https://grow.google/certificates', 'https://grow.google/logo.png',
 ARRAY['Foundations of User Experience Design', 'Start the UX Design Process', 'Build Wireframes and Low-Fidelity Prototypes', 'Conduct UX Research and Test Early Concepts'],
 ARRAY['Completed with distinction', 'Created portfolio of 3 UX projects'],
 NULL, NULL);

-- Display record counts
SELECT 'Projects' as table_name, COUNT(*) as record_count FROM projects
UNION ALL
SELECT 'Tech Stack Materials', COUNT(*) FROM tech_stack_materials
UNION ALL
SELECT 'Work Experience', COUNT(*) FROM work_experience
UNION ALL
SELECT 'Study Experience', COUNT(*) FROM study_experience;