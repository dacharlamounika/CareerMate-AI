import type { SkillGap } from './skillGapAnalysis';

export type RoadmapStage =
  | 'Foundation'
  | 'Intermediate'
  | 'Advanced'
  | 'Practice & Projects';

export interface RoadmapItem {
  id: string;
  skill: string;
  stage: RoadmapStage;
  whyItMatters: string;
  learningFocus: string[];
  practiceTask: string;
  projectIdea: string;
}

export interface LearningRoadmap {
  role: string;
  stages: {
    stage: RoadmapStage;
    title: string;
    description: string;
    items: RoadmapItem[];
  }[];
  capstoneProject: string;
}

/*
 * The roadmap content is based on the skill gaps identified
 * by CareerMate. It does not invent skills from the user's resume.
 */

const ROADMAP_MAP: Record<
  string,
  {
    stage: RoadmapStage;
    whyItMatters: string;
    learningFocus: string[];
    practiceTask: string;
    projectIdea: string;
  }
> = {
  python: {
    stage: 'Foundation',
    whyItMatters:
      'Python is a core programming skill for backend development, automation, and data-related work.',
    learningFocus: [
      'Functions and modules',
      'Object-oriented programming',
      'Exception handling',
      'File handling',
    ],
    practiceTask:
      'Build a small Python application using functions, classes, and exception handling.',
    projectIdea:
      'Create a command-line task manager using Python.',
  },

  django: {
    stage: 'Intermediate',
    whyItMatters:
      'Django provides a structured framework for building Python web applications.',
    learningFocus: [
      'Django project structure',
      'Models and ORM',
      'Views and URLs',
      'Forms and templates',
    ],
    practiceTask:
      'Create a CRUD application with Django and connect it to a database.',
    projectIdea:
      'Build a student management system using Django.',
  },

  'rest api': {
    stage: 'Intermediate',
    whyItMatters:
      'REST APIs allow applications and services to communicate through standardized HTTP requests.',
    learningFocus: [
      'HTTP methods',
      'Request and response structure',
      'JSON',
      'API status codes',
      'Authentication basics',
    ],
    practiceTask:
      'Build and test a REST API with GET, POST, PUT, and DELETE operations.',
    projectIdea:
      'Create a REST API for an issue management system.',
  },

  api: {
    stage: 'Intermediate',
    whyItMatters:
      'API development is important for integrating frontend applications, databases, and external services.',
    learningFocus: [
      'API endpoints',
      'HTTP methods',
      'JSON data',
      'Error handling',
    ],
    practiceTask:
      'Create a small API and test its endpoints using Postman.',
    projectIdea:
      'Build a student information REST API.',
  },

  testing: {
    stage: 'Intermediate',
    whyItMatters:
      'Testing helps identify defects and improves software reliability.',
    learningFocus: [
      'Unit testing concepts',
      'Test cases',
      'Assertions',
      'Test-driven thinking',
    ],
    practiceTask:
      'Write unit tests for functions from one of your existing projects.',
    projectIdea:
      'Add automated tests to an existing Flask or Python project.',
  },

  pytest: {
    stage: 'Intermediate',
    whyItMatters:
      'PyTest is widely used for automated testing of Python applications.',
    learningFocus: [
      'Test functions',
      'Assertions',
      'Fixtures',
      'Parameterized tests',
    ],
    practiceTask:
      'Write PyTest tests for a small Python module.',
    projectIdea:
      'Create a tested Python REST API.',
  },

  docker: {
    stage: 'Advanced',
    whyItMatters:
      'Docker packages applications and their dependencies into portable containers.',
    learningFocus: [
      'Images and containers',
      'Dockerfiles',
      'Container networking',
      'Environment variables',
    ],
    practiceTask:
      'Containerize one of your existing web applications.',
    projectIdea:
      'Deploy a Flask application using Docker.',
  },

  sql: {
    stage: 'Foundation',
    whyItMatters:
      'SQL is essential for storing, retrieving, and analyzing structured data.',
    learningFocus: [
      'SELECT queries',
      'JOINs',
      'GROUP BY',
      'Subqueries',
      'CTEs',
    ],
    practiceTask:
      'Solve SQL problems using a realistic relational database.',
    projectIdea:
      'Build an issue analytics database and reporting system.',
  },

  mysql: {
    stage: 'Foundation',
    whyItMatters:
      'MySQL provides practical experience with relational database systems.',
    learningFocus: [
      'Database design',
      'Tables and relationships',
      'Indexes',
      'Constraints',
      'CRUD operations',
    ],
    practiceTask:
      'Design a normalized database for a small application.',
    projectIdea:
      'Build a student management database.',
  },

  javascript: {
    stage: 'Foundation',
    whyItMatters:
      'JavaScript is a core language for interactive web applications.',
    learningFocus: [
      'Variables and functions',
      'Arrays and objects',
      'DOM manipulation',
      'Async JavaScript',
      'Fetch API',
    ],
    practiceTask:
      'Build an interactive webpage that consumes an API.',
    projectIdea:
      'Create a dynamic job-search dashboard.',
  },

  react: {
    stage: 'Intermediate',
    whyItMatters:
      'React is used to build component-based interactive web interfaces.',
    learningFocus: [
      'Components',
      'Props and state',
      'Hooks',
      'Forms',
      'API integration',
    ],
    practiceTask:
      'Create a React application that retrieves and displays API data.',
    projectIdea:
      'Build a career dashboard using React.',
  },

  html: {
    stage: 'Foundation',
    whyItMatters:
      'HTML provides the structural foundation of web pages.',
    learningFocus: [
      'Semantic HTML',
      'Forms',
      'Tables',
      'Accessibility',
    ],
    practiceTask:
      'Create a semantic multi-page website.',
    projectIdea:
      'Build an accessible student portfolio website.',
  },

  css: {
    stage: 'Foundation',
    whyItMatters:
      'CSS controls the layout, responsiveness, and visual presentation of web applications.',
    learningFocus: [
      'Flexbox',
      'Grid',
      'Responsive design',
      'Media queries',
      'Reusable styles',
    ],
    practiceTask:
      'Convert a desktop webpage into a responsive layout.',
    projectIdea:
      'Create a responsive career portfolio.',
  },

  git: {
    stage: 'Foundation',
    whyItMatters:
      'Git is essential for tracking source-code changes and collaborating on software projects.',
    learningFocus: [
      'Repositories',
      'Commits',
      'Branches',
      'Merge',
      'Pull requests',
    ],
    practiceTask:
      'Create a repository and maintain a project using feature branches.',
    projectIdea:
      'Manage one existing CareerMate-related project through Git and GitHub.',
  },

  'data visualization': {
    stage: 'Intermediate',
    whyItMatters:
      'Data visualization helps communicate patterns and insights clearly.',
    learningFocus: [
      'Charts',
      'Dashboard design',
      'Choosing suitable visualizations',
      'Data storytelling',
    ],
    practiceTask:
      'Create a dashboard from a public dataset.',
    projectIdea:
      'Build a student performance analytics dashboard.',
  },

  pandas: {
    stage: 'Intermediate',
    whyItMatters:
      'Pandas is widely used for data cleaning, transformation, and analysis in Python.',
    learningFocus: [
      'DataFrames',
      'Data cleaning',
      'Filtering',
      'Grouping',
      'Merging datasets',
    ],
    practiceTask:
      'Clean and analyze a real CSV dataset using Pandas.',
    projectIdea:
      'Build a student performance analysis project.',
  },

  numpy: {
    stage: 'Intermediate',
    whyItMatters:
      'NumPy provides efficient numerical operations used in data science and machine learning.',
    learningFocus: [
      'Arrays',
      'Vectorized operations',
      'Indexing',
      'Mathematical operations',
    ],
    practiceTask:
      'Perform numerical analysis on a dataset using NumPy.',
    projectIdea:
      'Create a numerical data-analysis notebook.',
  },

  statistics: {
    stage: 'Foundation',
    whyItMatters:
      'Statistics provides the foundation for interpreting data and evaluating analytical results.',
    learningFocus: [
      'Mean and median',
      'Variance and standard deviation',
      'Probability',
      'Correlation',
      'Basic hypothesis testing',
    ],
    practiceTask:
      'Analyze a dataset and explain its statistical properties.',
    projectIdea:
      'Perform statistical analysis of student performance data.',
  },

  'machine learning': {
    stage: 'Advanced',
    whyItMatters:
      'Machine learning enables systems to identify patterns and make predictions from data.',
    learningFocus: [
      'Supervised learning',
      'Unsupervised learning',
      'Feature engineering',
      'Model evaluation',
    ],
    practiceTask:
      'Train and evaluate a machine-learning model on a public dataset.',
    projectIdea:
      'Build a student performance prediction model.',
  },

  'power bi': {
    stage: 'Intermediate',
    whyItMatters:
      'Power BI is used to transform data into interactive business dashboards.',
    learningFocus: [
      'Data loading',
      'Power Query',
      'Data modeling',
      'DAX basics',
      'Dashboard design',
    ],
    practiceTask:
      'Create an interactive dashboard using a real dataset.',
    projectIdea:
      'Build a student analytics Power BI dashboard.',
  },

  tableau: {
    stage: 'Intermediate',
    whyItMatters:
      'Tableau is used to create interactive visual analytics and dashboards.',
    learningFocus: [
      'Data connections',
      'Charts',
      'Calculated fields',
      'Dashboard design',
    ],
    practiceTask:
      'Create a dashboard using a public dataset.',
    projectIdea:
      'Build a sales or student performance dashboard.',
  },



  linux: {
    stage: 'Foundation',
    whyItMatters:
      'Linux fundamentals are useful for application support, backend development, and cloud environments.',
    learningFocus: [
      'File system',
      'Shell commands',
      'Processes',
      'Permissions',
      'Logs',
    ],
    practiceTask:
      'Practice common Linux commands and inspect application logs.',
    projectIdea:
      'Create a Linux-based application monitoring script.',
  },

  troubleshooting: {
    stage: 'Intermediate',
    whyItMatters:
      'Troubleshooting is essential for identifying the cause of application and system problems.',
    learningFocus: [
      'Problem isolation',
      'Log analysis',
      'Root-cause analysis',
      'Incident documentation',
    ],
    practiceTask:
      'Diagnose intentionally introduced problems in a small application.',
    projectIdea:
      'Build a Python application health-check tool.',
  },

  debugging: {
    stage: 'Intermediate',
    whyItMatters:
      'Debugging helps developers identify and correct defects efficiently.',
    learningFocus: [
      'Reading stack traces',
      'Breakpoints',
      'Logging',
      'Root-cause analysis',
    ],
    practiceTask:
      'Debug several intentionally faulty Python programs.',
    projectIdea:
      'Create a log-analysis and debugging assistant.',
  },

  
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function findRoadmapTemplate(skill: string) {
  const normalizedSkill = normalize(skill);

  if (ROADMAP_MAP[normalizedSkill]) {
    return ROADMAP_MAP[normalizedSkill];
  }

  const matchingKey = Object.keys(ROADMAP_MAP).find(
    (key) =>
      normalizedSkill.includes(key) ||
      key.includes(normalizedSkill)
  );

  return matchingKey ? ROADMAP_MAP[matchingKey] : null;
}

export function generateLearningRoadmap(
  role: string,
  skillGaps: SkillGap[]
): LearningRoadmap {
  const items: RoadmapItem[] = [];

  skillGaps.forEach((gap, index) => {
    const template = findRoadmapTemplate(gap.skill);

    if (!template) {
      /*
       * For an unknown skill we do not invent learning content.
       * We provide a safe generic practice structure instead.
       */
      items.push({
        id: `${normalize(gap.skill).replace(/\s+/g, '-')}-${index}`,
        skill: gap.skill,
        stage:
          gap.priority === 'High'
            ? 'Foundation'
            : gap.priority === 'Medium'
              ? 'Intermediate'
              : 'Advanced',
        whyItMatters: `${gap.skill} was identified as a development area for ${role}.`,
        learningFocus: [
          `Understand the fundamentals of ${gap.skill}`,
          `Practice common ${gap.skill} concepts`,
          `Apply ${gap.skill} in a small project`,
        ],
        practiceTask:
          `Complete practical exercises focused on ${gap.skill}.`,
        projectIdea:
          `Build a small project that uses ${gap.skill}.`,
      });

      return;
    }

    items.push({
      id: `${normalize(gap.skill).replace(/\s+/g, '-')}-${index}`,
      skill: gap.skill,
      stage: template.stage,
      whyItMatters: template.whyItMatters,
      learningFocus: template.learningFocus,
      practiceTask: template.practiceTask,
      projectIdea: template.projectIdea,
    });
  });

  const stageOrder: RoadmapStage[] = [
    'Foundation',
    'Intermediate',
    'Advanced',
    'Practice & Projects',
  ];

  const stageDescriptions: Record<RoadmapStage, string> = {
    Foundation:
      'Build the fundamental knowledge required before moving to more advanced topics.',
    Intermediate:
      'Develop practical skills and start applying them to real development tasks.',
    Advanced:
      'Strengthen advanced concepts and work with more realistic technical scenarios.',
    'Practice & Projects':
      'Apply your learning through projects and hands-on practice.',
  };

  const stages = stageOrder
    .map((stage) => {
      const stageItems = items.filter(
        (item) => item.stage === stage
      );

      return {
        stage,
        title: stage,
        description: stageDescriptions[stage],
        items: stageItems,
      };
    })
    .filter((stage) => stage.items.length > 0);

  const capstoneProject =
    items.length > 0
      ? `Build a ${role}-focused project that combines the skills developed in this roadmap: ${items
          .map((item) => item.skill)
          .join(', ')}.`
      : `Build a practical ${role} project using the skills already present in your profile.`;

  return {
    role,
    stages,
    capstoneProject,
  };
}