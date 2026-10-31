import type { ResumeContent } from '@/types';

export type MatchLevel = 'High' | 'Medium' | 'Developing';

export interface CareerRecommendation {
  role: string;
  matchLevel: MatchLevel;
  matchScore: number;
  whyItMatches: string;
  relevantSkills: string[];
  skillsToDevelop: string[];
  learningAreas: string[];
  typicalResponsibilities: string;
  roleOverview: string;
  suggestedProjectAreas: string[];
}

interface RoleDefinition {
  role: string;
  coreSkills: string[];
  secondarySkills: string[];
  relatedKeywords: string[];
  learningAreas: string[];
  typicalResponsibilities: string;
  roleOverview: string;
  suggestedProjectAreas: string[];
  educationRelevant: string[];
}

const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'Software Developer',
    coreSkills: ['Java', 'Python', 'JavaScript', 'SQL', 'Git', 'API', 'REST', 'Debugging', 'Testing'],
    secondarySkills: ['Spring', 'Django', 'Flask', 'Node.js', 'Agile', 'CI/CD', 'Docker'],
    relatedKeywords: ['software', 'application', 'backend', 'server', 'api', 'development', 'coding', 'programming'],
    learningAreas: ['Design Patterns', 'System Design fundamentals', 'REST API best practices', 'Unit Testing frameworks', 'Version control workflows'],
    typicalResponsibilities: 'Design, develop, test, and maintain software applications using programming languages and frameworks. Collaborate with teams to deliver features and fix bugs.',
    roleOverview: 'A Software Developer builds and maintains applications — writing code, fixing bugs, writing tests, and working with a team to deliver software that meets user needs. It is a versatile role spanning many languages and domains.',
    suggestedProjectAreas: ['Build a CRUD web app with a REST API backend', 'Create a task management tool with authentication', 'Contribute to an open-source project'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Software Engineering', 'Computer Applications'],
  },
  {
    role: 'Python Developer',
    coreSkills: ['Python', 'SQL', 'Flask', 'Django', 'REST API', 'API', 'Git', 'Testing'],
    secondarySkills: ['Pandas', 'NumPy', 'Celery', 'PostgreSQL', 'MySQL', 'Docker', 'Unit Testing', 'PyTest'],
    relatedKeywords: ['python', 'flask', 'django', 'backend', 'api', 'web', 'scripting', 'automation'],
    learningAreas: ['Django or Flask advanced patterns', 'Python testing with PyTest', 'Asynchronous Python (asyncio, Celery)', 'Database optimization', 'REST API design'],
    typicalResponsibilities: 'Develop Python-based backend services and web applications, write clean tested code, integrate databases and APIs, and automate tasks using Python scripts.',
    roleOverview: 'A Python Developer specializes in building backend systems, web applications, and automation scripts using Python and frameworks like Flask or Django. They work on server-side logic, APIs, and data processing.',
    suggestedProjectAreas: ['Build a REST API with Flask and MySQL', 'Create a web scraper with data storage', 'Develop a CRUD application using Django'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Data Science', 'Software Engineering'],
  },
  {
    role: 'Java Developer',
    coreSkills: ['Java', 'Spring', 'Spring Boot', 'Hibernate', 'SQL', 'JDBC', 'Maven', 'JUnit', 'REST API'],
    secondarySkills: ['MySQL', 'PostgreSQL', 'Tomcat', 'Git', 'Docker', 'Microservices', 'JPA'],
    relatedKeywords: ['java', 'spring', 'hibernate', 'backend', 'enterprise', 'jsp', 'servlet', 'jvm'],
    learningAreas: ['Spring Boot and Spring Security', 'Hibernate/JPA advanced mapping', 'Microservices with Spring Cloud', 'JUnit and integration testing', 'JVM performance tuning'],
    typicalResponsibilities: 'Build scalable Java-based backend applications and enterprise systems using Spring, Hibernate, and REST APIs. Write tested, maintainable code and integrate with databases.',
    roleOverview: 'A Java Developer builds enterprise-grade backend systems using Java and frameworks like Spring and Hibernate. They work on server-side logic, database integration, and scalable APIs.',
    suggestedProjectAreas: ['Build a REST API with Spring Boot and JPA', 'Create an e-commerce backend with Hibernate', 'Develop a microservice with Spring Cloud'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Software Engineering'],
  },
  {
    role: 'Full Stack Developer',
    coreSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'SQL', 'MongoDB', 'REST API', 'HTML', 'CSS', 'Git'],
    secondarySkills: ['TypeScript', 'Next.js', 'Redux', 'Tailwind', 'PostgreSQL', 'Docker', 'Authentication'],
    relatedKeywords: ['fullstack', 'full stack', 'frontend', 'backend', 'web', 'react', 'node', 'api', 'database'],
    learningAreas: ['React state management (Redux/Context)', 'Node.js middleware and security', 'Database schema design', 'Authentication and authorization', 'Deployment with Docker'],
    typicalResponsibilities: 'Develop end-to-end web applications — frontend interfaces with React/HTML/CSS and backend APIs with Node.js/Express. Manage databases and deploy applications.',
    roleOverview: 'A Full Stack Developer works on both the frontend and backend of web applications. They build user interfaces, server-side APIs, manage databases, and handle deployment — covering the entire stack.',
    suggestedProjectAreas: ['Build a full-stack social media app with React and Node.js', 'Create an e-commerce platform with payment integration', 'Develop a real-time chat application'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Software Engineering', 'Web Development'],
  },
  {
    role: 'Frontend Developer',
    coreSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git', 'REST API'],
    secondarySkills: ['Angular', 'Vue', 'Tailwind', 'Redux', 'Next.js', 'Responsive Design', 'Bootstrap'],
    relatedKeywords: ['frontend', 'front-end', 'ui', 'ux', 'react', 'css', 'html', 'javascript', 'web', 'interface', 'responsive'],
    learningAreas: ['Advanced CSS and animations', 'React hooks and performance optimization', 'TypeScript for frontend', 'Accessibility (a11y) standards', 'State management patterns'],
    typicalResponsibilities: 'Build responsive, user-focused web interfaces using HTML, CSS, JavaScript, and frameworks like React. Ensure cross-browser compatibility and a smooth user experience.',
    roleOverview: 'A Frontend Developer creates the visual and interactive parts of websites that users see and interact with. They use HTML, CSS, JavaScript, and frameworks like React to build responsive, accessible interfaces.',
    suggestedProjectAreas: ['Build a responsive portfolio website with React', 'Create a dashboard UI with charts and tables', 'Develop a movie browser app with API integration'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Web Development', 'Design'],
  },
  {
    role: 'Backend Developer',
    coreSkills: ['Node.js', 'Express', 'Java', 'Python', 'SQL', 'PostgreSQL', 'REST API', 'Docker', 'Authentication'],
    secondarySkills: ['Redis', 'MongoDB', 'Microservices', 'GraphQL', 'AWS', 'CI/CD', 'Kubernetes'],
    relatedKeywords: ['backend', 'back-end', 'server', 'api', 'database', 'microservice', 'endpoint', 'auth'],
    learningAreas: ['API design and documentation (OpenAPI/Swagger)', 'Database indexing and optimization', 'Authentication patterns (JWT, OAuth)', 'Caching with Redis', 'Message queues (RabbitMQ, Kafka)'],
    typicalResponsibilities: 'Build robust backend systems and APIs, manage databases, implement authentication, and ensure server-side performance and security. Deploy services using Docker and cloud platforms.',
    roleOverview: 'A Backend Developer builds the server-side logic, APIs, and database interactions that power applications. They work with server frameworks, databases, authentication, and deployment infrastructure.',
    suggestedProjectAreas: ['Build a REST API with authentication and rate limiting', 'Create a microservice with message queue integration', 'Develop a backend with PostgreSQL and Redis caching'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Software Engineering'],
  },
  {
    role: 'Data Analyst',
    coreSkills: ['SQL', 'Python', 'Pandas', 'Excel', 'Data Visualization', 'Tableau', 'Power BI', 'Statistics'],
    secondarySkills: ['R', 'NumPy', 'Matplotlib', 'ETL', 'Google Analytics', 'Data Cleaning', 'Jupyter'],
    relatedKeywords: ['data', 'analytics', 'analysis', 'sql', 'pandas', 'excel', 'tableau', 'visualization', 'reporting', 'insights'],
    learningAreas: ['Advanced SQL (window functions, CTEs)', 'Data visualization with Tableau or Power BI', 'Statistical analysis methods', 'ETL pipelines', 'Storytelling with data'],
    typicalResponsibilities: 'Analyze data using SQL, Python, and visualization tools to support business decisions. Clean and transform data, create dashboards and reports, and communicate insights to stakeholders.',
    roleOverview: 'A Data Analyst turns raw data into actionable insights. They use SQL, Python, Excel, and visualization tools to analyze data, build dashboards, and help organizations make data-driven decisions.',
    suggestedProjectAreas: ['Analyze a sales dataset and build a Tableau dashboard', 'Create an Excel-based financial model with charts', 'Build a Python data pipeline with Pandas and Matplotlib'],
    educationRelevant: ['Data Science', 'Statistics', 'Computer Science', 'Mathematics', 'Economics', 'Business Analytics'],
  },
  {
    role: 'Data Scientist',
    coreSkills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL', 'Statistics', 'Data Visualization'],
    secondarySkills: ['TensorFlow', 'PyTorch', 'R', 'Matplotlib', 'NLP', 'Feature Engineering', 'Jupyter', 'Deep Learning'],
    relatedKeywords: ['data science', 'machine learning', 'ml', 'model', 'predictive', 'statistics', 'pandas', 'numpy', 'scikit'],
    learningAreas: ['Machine learning algorithms (supervised/unsupervised)', 'Feature engineering techniques', 'Model evaluation and tuning', 'Deep learning with TensorFlow or PyTorch', 'Statistical foundations'],
    typicalResponsibilities: 'Build predictive models and machine learning pipelines, analyze large datasets, perform statistical analysis, and communicate findings to drive business outcomes.',
    roleOverview: 'A Data Scientist builds machine learning models and performs advanced analytics to solve complex problems. They combine programming, statistics, and domain knowledge to extract insights and make predictions from data.',
    suggestedProjectAreas: ['Build a movie recommendation system with collaborative filtering', 'Create a customer churn prediction model', 'Develop a sentiment analysis model with NLP'],
    educationRelevant: ['Data Science', 'Statistics', 'Computer Science', 'Mathematics', 'Artificial Intelligence'],
  },
  {
    role: 'AI/ML Engineer',
    coreSkills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Scikit-learn'],
    secondarySkills: ['MLOps', 'Keras', 'OpenCV', 'Hugging Face', 'Docker', 'AWS', 'SQL', 'Feature Engineering'],
    relatedKeywords: ['ai', 'ml', 'machine learning', 'deep learning', 'neural', 'model', 'training', 'nlp', 'computer vision', 'tensorflow', 'pytorch'],
    learningAreas: ['Deep learning architectures (CNNs, RNNs, Transformers)', 'MLOps and model deployment', 'NLP with Hugging Face Transformers', 'Computer Vision with OpenCV', 'Model optimization and quantization'],
    typicalResponsibilities: 'Develop and deploy machine learning models, build training pipelines, implement NLP and computer vision solutions, and optimize models for production environments.',
    roleOverview: 'An AI/ML Engineer designs, trains, and deploys machine learning and deep learning models. They work with neural networks, NLP, computer vision, and MLOps to bring AI solutions into production.',
    suggestedProjectAreas: ['Build an image classifier with transfer learning', 'Create a chatbot using a pre-trained NLP model', 'Develop a real-time object detection system'],
    educationRelevant: ['Artificial Intelligence', 'Computer Science', 'Data Science', 'Machine Learning', 'Mathematics'],
  },
  {
    role: 'Cloud Engineer',
    coreSkills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Networking', 'IAM'],
    secondarySkills: ['CI/CD', 'Jenkins', 'Ansible', 'Bash', 'Prometheus', 'Grafana', 'Load Balancing', 'Security'],
    relatedKeywords: ['cloud', 'aws', 'azure', 'gcp', 'infrastructure', 'docker', 'kubernetes', 'terraform', 'deploy', 'scalable'],
    learningAreas: ['AWS/Azure certification fundamentals', 'Infrastructure as Code with Terraform', 'Kubernetes orchestration', 'Cloud security best practices', 'Networking and load balancing'],
    typicalResponsibilities: 'Design and manage cloud infrastructure, deploy containerized applications, configure networking and security, and ensure scalability and availability of cloud services.',
    roleOverview: 'A Cloud Engineer designs, deploys, and manages infrastructure on cloud platforms like AWS, Azure, or GCP. They work with containers, infrastructure-as-code, and cloud networking to build scalable systems.',
    suggestedProjectAreas: ['Deploy a containerized app on AWS with Terraform', 'Set up a Kubernetes cluster with CI/CD', 'Build a multi-tier architecture with load balancing'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Cloud Computing', 'Network Engineering'],
  },
  {
    role: 'DevOps Engineer',
    coreSkills: ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'AWS', 'Terraform', 'Linux', 'Git', 'Monitoring'],
    secondarySkills: ['Ansible', 'Grafana', 'Prometheus', 'Bash', 'Python', 'Nagios', 'GitLab CI', 'Helm'],
    relatedKeywords: ['devops', 'ci/cd', 'pipeline', 'automation', 'deploy', 'docker', 'kubernetes', 'jenkins', 'infrastructure', 'monitoring'],
    learningAreas: ['CI/CD pipeline design', 'Infrastructure as Code (Terraform, Ansible)', 'Container orchestration with Kubernetes', 'Monitoring and alerting (Prometheus, Grafana)', 'Cloud automation scripting'],
    typicalResponsibilities: 'Automate deployment pipelines, manage infrastructure as code, monitor system health, ensure reliable releases, and bridge development and operations for faster delivery.',
    roleOverview: 'A DevOps Engineer automates the software delivery process — building CI/CD pipelines, managing infrastructure, and ensuring reliable, fast deployments. They bridge the gap between development and operations.',
    suggestedProjectAreas: ['Set up a CI/CD pipeline with Jenkins and Docker', 'Automate infrastructure provisioning with Terraform', 'Build a monitoring stack with Prometheus and Grafana'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Software Engineering'],
  },
  {
    role: 'Cybersecurity Analyst',
    coreSkills: ['Network Security', 'Python', 'Linux', 'OWASP', 'Cryptography', 'Penetration Testing', 'Incident Response', 'SIEM'],
    secondarySkills: ['Wireshark', 'Splunk', 'Firewalls', 'Risk Assessment', 'Bash', 'Nmap', 'Metasploit', 'IAM'],
    relatedKeywords: ['security', 'cybersecurity', 'vulnerability', 'penetration', 'owasp', 'network', 'threat', 'incident', 'encryption', 'firewall'],
    learningAreas: ['Network security fundamentals', 'Web application security (OWASP Top 10)', 'Penetration testing tools (Nmap, Metasploit)', 'Security information and event management (SIEM)', 'Incident response procedures'],
    typicalResponsibilities: 'Identify and mitigate security risks, monitor for threats, perform vulnerability assessments, respond to security incidents, and ensure compliance with security policies.',
    roleOverview: 'A Cybersecurity Analyst protects systems and networks from security threats. They monitor for attacks, test for vulnerabilities, respond to incidents, and help organizations stay secure and compliant.',
    suggestedProjectAreas: ['Conduct a vulnerability assessment of a web application', 'Build a network monitoring setup with an open-source SIEM', 'Create a password strength checker with Python'],
    educationRelevant: ['Cybersecurity', 'Computer Science', 'Information Technology', 'Network Security'],
  },
  {
    role: 'Database Developer',
    coreSkills: ['SQL', 'PostgreSQL', 'MySQL', 'Oracle', 'MongoDB', 'Database Design', 'Indexing', 'Stored Procedures'],
    secondarySkills: ['Redis', 'SQLite', 'Triggers', 'Performance Tuning', 'ETL', 'Python', 'Normalization', 'Query Optimization'],
    relatedKeywords: ['database', 'sql', 'query', 'schema', 'table', 'stored procedure', 'index', 'dbms', 'mongodb', 'postgres'],
    learningAreas: ['Advanced SQL (window functions, CTEs, optimization)', 'Database design and normalization', 'Stored procedures and triggers', 'NoSQL databases (MongoDB, Redis)', 'Database performance tuning'],
    typicalResponsibilities: 'Design and optimize database schemas, write complex SQL queries and stored procedures, ensure data integrity and performance, and integrate databases with applications.',
    roleOverview: 'A Database Developer designs, builds, and optimizes databases. They write complex queries, create stored procedures, design schemas, and ensure databases perform efficiently for applications.',
    suggestedProjectAreas: ['Design a normalized database schema for an e-commerce system', 'Build a reporting dashboard with complex SQL queries', 'Create a stored procedure library for a banking database'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Database Management', 'Information Systems'],
  },
  {
    role: 'Application Support Engineer',
    coreSkills: ['SQL', 'Python', 'Troubleshooting', 'Debugging', 'Issue Tracking', 'Database', 'Testing', 'Application Support'],
    secondarySkills: ['Bash', 'Linux', 'Jira', 'Monitoring', 'Logs Analysis', 'Java', 'REST API', 'Ticketing'],
    relatedKeywords: ['support', 'troubleshoot', 'debug', 'issue', 'incident', 'application', 'ticket', 'maintenance', 'resolve', 'monitor'],
    learningAreas: ['Application monitoring tools (Nagios, Grafana)', 'Log analysis and debugging techniques', 'SQL for data investigation', 'Incident management processes', 'Basic scripting for automation'],
    typicalResponsibilities: 'Troubleshoot and resolve application issues, investigate bugs using logs and databases, monitor system health, manage support tickets, and collaborate with developers to fix problems.',
    roleOverview: 'An Application Support Engineer keeps applications running smoothly. They diagnose and fix issues, investigate problems using logs and databases, and work with developers to resolve bugs and incidents.',
    suggestedProjectAreas: ['Build a log analyzer tool with Python', 'Create a ticketing system dashboard with SQL', 'Develop an automated health-check script for a web service'],
    educationRelevant: ['Computer Science', 'Information Technology', 'Information Systems', 'Computer Applications'],
  },
];

function normalizeList(items: string[]): string[] {
  return items.map((s) => s.trim()).filter(Boolean);
}

function splitTechs(raw: string): string[] {
  return raw.split(/[,/]+/).map((s) => s.trim()).filter(Boolean);
}

function lower(s: string): string {
  return s.toLowerCase().trim();
}

interface ExtractedProfile {
  allSkills: string[];
  allText: string;
  projectTexts: string[];
  experienceTexts: string[];
  certifications: string[];
  achievements: string[];
  interests: string[];
  educationSpec: string;
  educationDegree: string;
  targetRole: string;
}

function extractProfile(content: ResumeContent): ExtractedProfile {
  const allSkills: string[] = [];
  const textParts: string[] = [];
  const projectTexts: string[] = [];
  const experienceTexts: string[] = [];

  for (const exp of content.experience) {
    if (exp.technology) {
      splitTechs(exp.technology).forEach((t) => allSkills.push(t));
    }
    const expText = [exp.role, exp.technology, exp.description, exp.company].filter(Boolean).join(' ');
    if (expText) {
      experienceTexts.push(expText);
      textParts.push(expText);
    }
  }

  for (const proj of content.projects) {
    if (proj.technologies) {
      splitTechs(proj.technologies).forEach((t) => allSkills.push(t));
    }
    const projText = [proj.title, proj.technologies, proj.description, proj.keyFeatures, proj.contribution].filter(Boolean).join(' ');
    if (projText) {
      projectTexts.push(projText);
      textParts.push(projText);
    }
  }

  const certifications = content.certifications.map((c) => c.name).filter(Boolean);
  certifications.forEach((c) => {
    allSkills.push(c);
    textParts.push(c);
  });

  const achievements = content.achievements.map((a) => a.title).filter(Boolean);
  achievements.forEach((a) => textParts.push(a));
  content.achievements.forEach((a) => {
    if (a.description) textParts.push(a.description);
  });

  const interests = content.interests.map((i) => i.name).filter(Boolean);
  interests.forEach((i) => textParts.push(i));

  const educationSpec = content.education[0]?.specialization || '';
  const educationDegree = content.education[0]?.degree || '';
  if (educationSpec) textParts.push(educationSpec);
  if (educationDegree) textParts.push(educationDegree);

  if (content.introduction) textParts.push(content.introduction);

  const targetRole = content.targetRole === 'Other' ? content.customRole : content.targetRole;

  return {
    allSkills: [...new Set(allSkills.map((s) => s.trim()).filter(Boolean))],
    allText: lower(textParts.join(' ')),
    projectTexts,
    experienceTexts,
    certifications,
    achievements,
    interests,
    educationSpec,
    educationDegree,
    targetRole,
  };
}

function skillMatchesProfile(skill: string, profileSkills: string[], profileText: string): boolean {
  const lowerSkill = lower(skill);
  for (const ps of profileSkills) {
    const lowerPs = lower(ps);
    if (lowerPs === lowerSkill || lowerPs.includes(lowerSkill) || lowerSkill.includes(lowerPs)) {
      return true;
    }
  }
  return profileText.includes(lowerSkill);
}

function calculateRoleScore(roleDef: RoleDefinition, profile: ExtractedProfile): { score: number; matchedCore: string[]; matchedSecondary: string[] } {
  const matchedCore: string[] = [];
  const matchedSecondary: string[] = [];

  for (const skill of roleDef.coreSkills) {
    if (skillMatchesProfile(skill, profile.allSkills, profile.allText)) {
      matchedCore.push(skill);
    }
  }

  for (const skill of roleDef.secondarySkills) {
    if (skillMatchesProfile(skill, profile.allSkills, profile.allText)) {
      matchedSecondary.push(skill);
    }
  }

  // Core skills weighted heavily, secondary skills lightly
  const coreScore = (matchedCore.length / roleDef.coreSkills.length) * 65;

  // Secondary skills up to 15%
  const secondaryScore = roleDef.secondarySkills.length > 0
    ? (matchedSecondary.length / roleDef.secondarySkills.length) * 15
    : 0;

  // Keyword relevance in projects/experience (up to 10%)
  const projectExperienceText = lower([...profile.projectTexts, ...profile.experienceTexts].join(' '));
  let keywordHits = 0;
  for (const keyword of roleDef.relatedKeywords) {
    if (projectExperienceText.includes(lower(keyword))) {
      keywordHits++;
    }
  }
  const keywordScore = Math.min(10, (keywordHits / Math.max(1, roleDef.relatedKeywords.length)) * 20);

  // Education relevance (up to 5%)
  let eduScore = 0;
  if (profile.educationSpec) {
    const lowerEdu = lower(profile.educationSpec);
    for (const eduKey of roleDef.educationRelevant) {
      if (lowerEdu.includes(lower(eduKey)) || lower(eduKey).includes(lowerEdu)) {
        eduScore = 5;
        break;
      }
    }
  }

  // Certification relevance (up to 5%)
  let certScore = 0;
  if (profile.certifications.length > 0) {
    const certText = lower(profile.certifications.join(' '));
    for (const keyword of [...roleDef.relatedKeywords, ...roleDef.coreSkills.map(lower)]) {
      if (certText.includes(keyword)) {
        certScore = 5;
        break;
      }
    }
  }

  const totalScore = Math.round(coreScore + secondaryScore + keywordScore + eduScore + certScore);

  return { score: Math.min(100, totalScore), matchedCore, matchedSecondary };
}

function buildWhyItMatches(roleDef: RoleDefinition, profile: ExtractedProfile, matchedCore: string[], matchedSecondary: string[]): string {
  const reasons: string[] = [];

  if (matchedCore.length > 0) {
    reasons.push(`Your profile includes ${formatList(matchedCore.slice(0, 4))}, which are core skills for this role`);
  }

  if (matchedSecondary.length > 0) {
    reasons.push(`you also have ${formatList(matchedSecondary.slice(0, 3))}`);
  }

  // Project relevance
  const projectExperienceText = lower([...profile.projectTexts, ...profile.experienceTexts].join(' '));
  const relevantKeywords = roleDef.relatedKeywords.filter((k) => projectExperienceText.includes(lower(k)));
  if (relevantKeywords.length > 0) {
    reasons.push(`your projects and experience relate to ${formatList(relevantKeywords.slice(0, 3))}`);
  }

  if (profile.educationSpec) {
    const lowerEdu = lower(profile.educationSpec);
    const eduMatch = roleDef.educationRelevant.find((e) => lowerEdu.includes(lower(e)) || lower(e).includes(lowerEdu));
    if (eduMatch) {
      reasons.push(`your ${profile.educationSpec} background is relevant`);
    }
  }

  if (profile.certifications.length > 0) {
    const certText = lower(profile.certifications.join(' '));
    const certMatch = [...roleDef.relatedKeywords, ...roleDef.coreSkills.map(lower)].find((k) => certText.includes(k));
    if (certMatch) {
      reasons.push(`your certifications align with this career path`);
    }
  }

  if (reasons.length === 0) {
    return 'This role could be a direction to explore based on your general technical background.';
  }

  return capitalize(reasons.join(', ')) + '.';
}

function buildSkillsToDevelop(roleDef: RoleDefinition, profile: ExtractedProfile): string[] {
  const toDevelop: string[] = [];
  for (const skill of roleDef.coreSkills) {
    if (!skillMatchesProfile(skill, profile.allSkills, profile.allText)) {
      toDevelop.push(skill);
    }
  }
  // Add a few secondary skills if there's room
  for (const skill of roleDef.secondarySkills) {
    if (toDevelop.length >= 6) break;
    if (!skillMatchesProfile(skill, profile.allSkills, profile.allText)) {
      toDevelop.push(skill);
    }
  }
  return toDevelop;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatList(items: string[]): string {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return '';
  if (filtered.length === 1) return filtered[0];
  if (filtered.length === 2) return `${filtered[0]} and ${filtered[1]}`;
  return `${filtered.slice(0, -1).join(', ')}, and ${filtered[filtered.length - 1]}`;
}

function matchLevelFromScore(score: number): MatchLevel {
  if (score >= 60) return 'High';
  if (score >= 35) return 'Medium';
  return 'Developing';
}

/**
 * Generate career recommendations based on the user's actual resume profile.
 * Recommendations change when the profile changes — no hardcoded list.
 */
export function getCareerRecommendations(content: ResumeContent): CareerRecommendation[] {
  const profile = extractProfile(content);

  // Score every role definition
  const scored = ROLE_DEFINITIONS.map((roleDef) => {
    const { score, matchedCore, matchedSecondary } = calculateRoleScore(roleDef, profile);
    return { roleDef, score, matchedCore, matchedSecondary };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top 3–5 roles (at least score > 0, or if all are 0, take top 3 anyway)
  const minScore = scored.some((s) => s.score > 0) ? 1 : 0;
  const topRoles = scored.filter((s) => s.score >= minScore).slice(0, 5);

  // If we have fewer than 3, fill with top scoring ones regardless
  const selected = topRoles.length >= 3 ? topRoles : scored.slice(0, 3);

  return selected.map(({ roleDef, score, matchedCore, matchedSecondary }) => {
    const relevantSkills = [...new Set([...matchedCore, ...matchedSecondary])];
    const skillsToDevelop = buildSkillsToDevelop(roleDef, profile);

    return {
      role: roleDef.role,
      matchLevel: matchLevelFromScore(score),
      matchScore: score,
      whyItMatches: buildWhyItMatches(roleDef, profile, matchedCore, matchedSecondary),
      relevantSkills,
      skillsToDevelop,
      learningAreas: roleDef.learningAreas,
      typicalResponsibilities: roleDef.typicalResponsibilities,
      roleOverview: roleDef.roleOverview,
      suggestedProjectAreas: roleDef.suggestedProjectAreas,
    };
  });
}
