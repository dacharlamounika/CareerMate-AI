import type {
  ExperienceLevel,
  InterviewQuestion,
  InterviewRole,
  InterviewType,
  QuestionCategory,
} from '../types/mockInterviewTypes';

interface Q {
  category: QuestionCategory;
  text: string;
  keywords: string[];
  modelAnswer: string;
}

const rawBank: Record<InterviewRole, Record<InterviewType, Q[]>> = {
  'Software Developer': {
    Technical: [
      {
        category: 'Technical',
        text: 'Explain the difference between an array and a linked list.',
        keywords: ['array', 'linked list', 'memory', 'contiguous', 'index', 'pointer', 'insertion', 'deletion'],
        modelAnswer:
          'Arrays store elements in contiguous memory allowing O(1) random access, while linked lists use nodes with pointers so insertion/deletion is O(1) at known positions but access is O(n). Arrays have fixed or amortized size; linked lists grow dynamically.',
      },
      {
        category: 'Technical',
        text: 'What is the time complexity of binary search and what precondition does it require?',
        keywords: ['binary search', 'sorted', 'log n', 'o(log n)', 'divide', 'conquer', 'ordered'],
        modelAnswer:
          'Binary search runs in O(log n). It requires the input collection to be sorted and to support random access by index.',
      },
      {
        category: 'Technical',
        text: 'Describe what Big-O notation represents and why it matters.',
        keywords: ['big-o', 'time complexity', 'worst case', 'growth', 'scalability', 'upper bound'],
        modelAnswer:
          'Big-O describes the upper bound on an algorithm\'s growth as input size increases. It matters because it lets us compare algorithm efficiency and predict scalability independent of hardware.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you debug a program that crashes only occasionally?',
        keywords: ['debug', 'reproduce', 'logs', 'race condition', 'concurrency', 'memory', 'stack trace', 'testing'],
        modelAnswer:
          'I would gather logs and stack traces, try to reproduce by varying inputs or timing, check for race conditions or uninitialised memory, add assertions, and use a debugger or print statements to narrow the cause.',
      },
      {
        category: 'Project-Based',
        text: 'Describe a software project you built and the biggest technical challenge you faced.',
        keywords: ['project', 'challenge', 'architecture', 'problem', 'solution', 'technologies', 'learned'],
        modelAnswer:
          'Describe the project goal, the tech stack, the specific challenge, the steps you took to solve it, and what you learned. Emphasise your individual contribution and the outcome.',
      },
    ],
    HR: [
      {
        category: 'HR',
        text: 'Tell me about yourself.',
        keywords: ['background', 'education', 'skills', 'experience', 'interests', 'goal', 'developer'],
        modelAnswer:
          'A concise summary covering education, relevant skills, any project or internship experience, and why you are interested in this role. Keep it under two minutes and tie it to the job.',
      },
      {
        category: 'HR',
        text: 'Why do you want to join our company?',
        keywords: ['company', 'values', 'products', 'mission', 'culture', 'growth', 'learning'],
        modelAnswer:
          'Reference specific things about the company (products, engineering culture, mission) and connect them to your goals and what you can contribute.',
      },
      {
        category: 'Behavioral',
        text: 'Describe a time you worked in a team and faced a conflict. How did you handle it?',
        keywords: ['team', 'conflict', 'communication', 'listen', 'resolve', 'compromise', 'result'],
        modelAnswer:
          'Use STAR: Situation, Task, Action, Result. Describe the conflict objectively, the action you took to communicate and resolve it, and the positive outcome.',
      },
      {
        category: 'Behavioral',
        text: 'Where do you see yourself in five years?',
        keywords: ['five years', 'goals', 'grow', 'learn', 'senior', 'lead', 'skills', 'career'],
        modelAnswer:
          'Show ambition aligned with the company: growing technical depth, taking more responsibility, and eventually mentoring others. Avoid unrelated career changes.',
      },
    ],
    Mixed: [
      {
        category: 'Technical',
        text: 'What is the difference between a stack and a queue? Give a real-world use for each.',
        keywords: ['stack', 'queue', 'lifo', 'fifo', 'push', 'pop', 'enqueue', 'dequeue', 'use case'],
        modelAnswer:
          'A stack is LIFO (last-in first-out) used for function call management and undo; a queue is FIFO (first-in first-out) used for task scheduling and request handling.',
      },
      {
        category: 'HR',
        text: 'What are your greatest strengths and one weakness you are improving?',
        keywords: ['strengths', 'weakness', 'improve', 'honest', 'self-aware', 'example'],
        modelAnswer:
          'Pick strengths relevant to the role with brief evidence. For weakness, choose a real one and explain the concrete steps you are taking to improve it.',
      },
      {
        category: 'Role-Specific',
        text: 'How do you ensure the code you write is maintainable?',
        keywords: ['maintainable', 'readable', 'naming', 'comments', 'testing', 'review', 'modular', 'clean code'],
        modelAnswer:
          'Use clear naming, small focused functions, version control, code reviews, unit tests, and documentation. Explain that maintainability reduces long-term cost.',
      },
      {
        category: 'Project-Based',
        text: 'Walk me through how you would design a simple URL shortener.',
        keywords: ['url shortener', 'hash', 'database', 'redirect', 'api', 'shortening', 'unique', 'scale'],
        modelAnswer:
          'Generate a short key (hash or counter encoded), store the mapping in a database, and redirect on lookup via an API. Mention collision handling and caching for scale.',
      },
      {
        category: 'Behavioral',
        text: 'Tell me about a time you failed and what you learned.',
        keywords: ['fail', 'mistake', 'learn', 'reflect', 'improve', 'ownership', 'result'],
        modelAnswer:
          'Pick a genuine failure, take ownership, explain what went wrong, what you learned, and how you changed your approach afterwards.',
      },
    ],
  },
  'Python Developer': {
    Technical: [
      {
        category: 'Technical',
        text: 'What is the difference between a list and a tuple in Python?',
        keywords: ['list', 'tuple', 'mutable', 'immutable', 'brackets', 'parentheses', 'speed', 'hashable'],
        modelAnswer:
          'Lists are mutable, use square brackets, and are slower; tuples are immutable, use parentheses, are faster, and can be used as dictionary keys because they are hashable.',
      },
      {
        category: 'Technical',
        text: 'Explain how Python handles memory management and garbage collection.',
        keywords: ['memory', 'garbage collection', 'reference counting', 'gc', 'cyclic', 'objects', 'reference'],
        modelAnswer:
          'Python uses reference counting plus a cyclic garbage collector. When an object\'s reference count hits zero it is freed; the gc module handles reference cycles.',
      },
      {
        category: 'Technical',
        text: 'What are decorators in Python and how do they work?',
        keywords: ['decorator', 'function', 'wrapper', 'higher-order', '@', 'argument', 'closure'],
        modelAnswer:
          'A decorator is a function that takes another function and returns a new one, usually wrapping the original to add behaviour. The @ syntax applies it at definition time.',
      },
      {
        category: 'Role-Specific',
        text: 'What is the GIL and how does it affect multithreaded Python programs?',
        keywords: ['gil', 'global interpreter lock', 'thread', 'cpu', 'io', 'multiprocessing', 'concurrency'],
        modelAnswer:
          'The GIL ensures only one thread executes Python bytecode at a time. CPU-bound threads do not parallelise; use multiprocessing or C extensions. I/O-bound threads still benefit from concurrency.',
      },
      {
        category: 'Project-Based',
        text: 'Describe a Python project you built. Which libraries did you use and why?',
        keywords: ['project', 'library', 'flask', 'django', 'pandas', 'requests', 'purpose', 'choice'],
        modelAnswer:
          'Name the project, the libraries (e.g., Flask, pandas, requests), why each was chosen, the structure, and the outcome. Show understanding of trade-offs.',
      },
    ],
    HR: [
      {
        category: 'HR',
        text: 'Why did you choose Python as your primary language?',
        keywords: ['python', 'choice', 'readable', 'community', 'libraries', 'versatile', 'learning'],
        modelAnswer:
          'Reference Python\'s readability, large ecosystem, versatility across web/data/automation, and strong community. Tie it to your interests and the role.',
      },
      {
        category: 'HR',
        text: 'How do you stay updated with new Python features and best practices?',
        keywords: ['learn', 'pep', 'documentation', 'community', 'blog', 'practice', 'project'],
        modelAnswer:
          'Mention reading PEPs, official docs, blogs, contributing to or reading open source, and applying new features in side projects.',
      },
      {
        category: 'Behavioral',
        text: 'Describe a time you had to learn a new library quickly for a project.',
        keywords: ['learn', 'library', 'deadline', 'documentation', 'example', 'project', 'adapt'],
        modelAnswer:
          'Use STAR: describe the project need, how you prioritised learning the essentials, the resource you used, and the result delivered on time.',
      },
    ],
    Mixed: [
      {
        category: 'Technical',
        text: 'What is a Python virtual environment and why would you use one?',
        keywords: ['venv', 'virtual', 'environment', 'isolate', 'dependencies', 'packages', 'pip'],
        modelAnswer:
          'A virtual environment isolates project dependencies so different projects can use different package versions without conflict. Created with venv or virtualenv.',
      },
      {
        category: 'HR',
        text: 'Tell me about yourself and your interest in Python development.',
        keywords: ['background', 'python', 'interest', 'skills', 'project', 'goal'],
        modelAnswer:
          'Summarise education, Python skills, a project, and why you enjoy Python development, connecting to the role.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you handle exceptions in a Python script that processes a large file?',
        keywords: ['exception', 'try', 'except', 'finally', 'file', 'error', 'log', 'continue'],
        modelAnswer:
          'Wrap file operations in try/except, catch specific exceptions, log errors, and use finally or context managers to close files. Continue processing remaining records.',
      },
      {
        category: 'Project-Based',
        text: 'How would you build a REST API in Python? Which framework would you choose?',
        keywords: ['rest', 'api', 'flask', 'fastapi', 'django', 'endpoint', 'json', 'route'],
        modelAnswer:
          'Choose Flask/FastAPI for lightweight APIs or Django REST Framework for larger apps. Define routes, handle JSON, validate input, and return proper status codes.',
      },
      {
        category: 'Behavioral',
        text: 'Tell me about a time you optimised slow Python code.',
        keywords: ['optimize', 'slow', 'profile', 'performance', 'algorithm', 'refactor', 'result'],
        modelAnswer:
          'Describe how you profiled the code, found the bottleneck, and improved it (better algorithm, caching, or built-in functions). Share the measurable speedup.',
      },
    ],
  },
  'Java Developer': {
    Technical: [
      {
        category: 'Technical',
        text: 'Explain the four pillars of OOP and how Java supports them.',
        keywords: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'class', 'interface', 'object'],
        modelAnswer:
          'Encapsulation via private fields and accessors, inheritance via extends, polymorphism via overriding and overloading, abstraction via abstract classes and interfaces.',
      },
      {
        category: 'Technical',
        text: 'What is the JVM, and how does "write once, run anywhere" work?',
        keywords: ['jvm', 'bytecode', 'compile', 'platform', 'portable', 'class file', 'interpreter'],
        modelAnswer:
          'Java compiles source to bytecode (.class). The JVM on each platform interprets/JIT-compiles bytecode to native code, enabling portability across operating systems.',
      },
      {
        category: 'Technical',
        text: 'What is the difference between an interface and an abstract class in Java?',
        keywords: ['interface', 'abstract', 'class', 'multiple', 'inheritance', 'methods', 'default', 'state'],
        modelAnswer:
          'Abstract classes can have state and constructors with some concrete methods; interfaces historically had only abstract method signatures (now default/static methods) and cannot hold instance state. A class can implement multiple interfaces but extend only one class.',
      },
      {
        category: 'Role-Specific',
        text: 'How does Java handle multithreading? What is the role of synchronized?',
        keywords: ['thread', 'multithreading', 'synchronized', 'concurrent', 'lock', 'runnable', 'race'],
        modelAnswer:
          'Java provides Thread class and Runnable, plus java.util.concurrent. synchronized creates a lock ensuring only one thread executes a block/method at a time, preventing race conditions.',
      },
      {
        category: 'Project-Based',
        text: 'Describe a Java application you built and the design patterns you used.',
        keywords: ['project', 'java', 'pattern', 'mvc', 'singleton', 'factory', 'spring', 'architecture'],
        modelAnswer:
          'Name the project, framework (e.g., Spring), and patterns (Singleton, Factory, MVC). Explain why each pattern fit and the benefit it provided.',
      },
    ],
    HR: [
      {
        category: 'HR',
        text: 'Why are you interested in Java development specifically?',
        keywords: ['java', 'interest', 'enterprise', 'ecosystem', 'scalable', 'community', 'career'],
        modelAnswer:
          'Reference Java\'s enterprise use, strong ecosystem, platform independence, and career stability. Connect to your learning and the company\'s stack.',
      },
      {
        category: 'HR',
        text: 'How do you handle tight deadlines in a Java project?',
        keywords: ['deadline', 'prioritize', 'plan', 'communicate', 'break down', 'focus', 'deliver'],
        modelAnswer:
          'Break work into small tasks, prioritise core functionality, communicate risks early, and avoid gold-plating. Emphasise delivering working software.',
      },
      {
        category: 'Behavioral',
        text: 'Tell me about a time you had a disagreement with a teammate about a technical decision.',
        keywords: ['disagree', 'technical', 'discuss', 'data', 'compromise', 'respect', 'outcome'],
        modelAnswer:
          'Use STAR. Describe the disagreement respectfully, how you used data or prototypes to evaluate options, and the agreed-upon decision and outcome.',
      },
    ],
    Mixed: [
      {
        category: 'Technical',
        text: 'What are generics in Java and why are they useful?',
        keywords: ['generics', 'type', 'parameter', 'compile', 'type-safe', 'casting', 'collection'],
        modelAnswer:
          'Generics allow types to be parameters. They enable compile-time type checking, eliminate casts, and improve code reusability (e.g., List<String>).',
      },
      {
        category: 'HR',
        text: 'Tell me about yourself and your journey learning Java.',
        keywords: ['background', 'java', 'learn', 'project', 'course', 'goal', 'developer'],
        modelAnswer:
          'Summarise education, how you learned Java (course, projects), a highlight project, and your goal as a Java developer.',
      },
      {
        category: 'Role-Specific',
        text: 'What is the Spring Framework and what problem does it solve?',
        keywords: ['spring', 'framework', 'di', 'dependency injection', 'ioc', 'beans', 'configuration', 'enterprise'],
        modelAnswer:
          'Spring is an enterprise framework providing dependency injection (IoC), aspect-oriented programming, and abstractions over JDBC/transactions/web, reducing boilerplate and improving testability.',
      },
      {
        category: 'Project-Based',
        text: 'How would you design a simple banking application in Java?',
        keywords: ['banking', 'account', 'class', 'transaction', 'balance', 'design', 'encapsulation', 'validation'],
        modelAnswer:
          'Model Account, Customer, and Transaction classes with encapsulated balance, deposit/withdraw methods with validation, and a service layer. Mention concurrency for transfers and persistence.',
      },
      {
        category: 'Behavioral',
        text: 'Describe a time you mentored or helped a peer with a coding problem.',
        keywords: ['mentor', 'help', 'peer', 'explain', 'pair', 'patient', 'result'],
        modelAnswer:
          'Use STAR. Describe the peer\'s problem, how you explained or pair-programmed, and the positive outcome for them and the team.',
      },
    ],
  },
  'Full Stack Developer': {
    Technical: [
      {
        category: 'Technical',
        text: 'Explain the difference between SQL and NoSQL databases and when you would use each.',
        keywords: ['sql', 'nosql', 'relational', 'schema', 'scale', 'document', 'acid', 'flexible'],
        modelAnswer:
          'SQL databases are relational with fixed schema and ACID guarantees, suited for structured data and complex joins. NoSQL (document, key-value, graph) offers flexible schema and horizontal scaling, suited for unstructured or rapidly changing data.',
      },
      {
        category: 'Technical',
        text: 'What is REST and what are its core principles?',
        keywords: ['rest', 'resource', 'http', 'stateless', 'verb', 'get', 'post', 'uri', 'representation'],
        modelAnswer:
          'REST is an architectural style using HTTP verbs (GET, POST, PUT, DELETE) on resources identified by URIs, stateless, with standard status codes and representations (JSON).',
      },
      {
        category: 'Technical',
        text: 'How does the browser render a web page after receiving HTML?',
        keywords: ['render', 'dom', 'cssom', 'html', 'parse', 'layout', 'paint', 'critical'],
        modelAnswer:
          'Browser parses HTML into the DOM and CSS into the CSSOM, combines them into a render tree, runs layout to compute geometry, and paints pixels. JS can modify the DOM and cause reflows.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you secure authentication in a full stack application?',
        keywords: ['auth', 'jwt', 'token', 'password', 'hash', 'bcrypt', 'https', 'session', 'cookie'],
        modelAnswer:
          'Hash passwords with bcrypt/argon2, use HTTPS, issue JWT or session cookies with proper flags (HttpOnly, Secure, SameSite), implement rate limiting, and validate input server-side.',
      },
      {
        category: 'Project-Based',
        text: 'Describe a full stack application you built end to end.',
        keywords: ['full stack', 'frontend', 'backend', 'database', 'react', 'node', 'api', 'deploy'],
        modelAnswer:
          'Cover the frontend (React), backend (Node/Express or similar), database, auth, and deployment. Explain the data flow and the hardest part you solved.',
      },
    ],
    HR: [
      {
        category: 'HR',
        text: 'Why do you enjoy full stack development over specialising in one area?',
        keywords: ['full stack', 'end to end', 'ownership', 'learn', 'versatile', 'product', 'impact'],
        modelAnswer:
          'Emphasise enjoying end-to-end ownership, seeing how frontend and backend connect, and the ability to build complete products. Tie to your curiosity and impact.',
      },
      {
        category: 'HR',
        text: 'How do you prioritise frontend vs backend work when both need attention?',
        keywords: ['prioritize', 'frontend', 'backend', 'user', 'impact', 'plan', 'communicate'],
        modelAnswer:
          'Prioritise by user impact and dependencies. Start with the API contract so frontend and backend can proceed in parallel, and communicate blockers early.',
      },
      {
        category: 'Behavioral',
        text: 'Tell me about a time you had to ship a feature with an incomplete specification.',
        keywords: ['incomplete', 'spec', 'assumption', 'clarify', 'iterate', 'feedback', 'deliver'],
        modelAnswer:
          'Use STAR. Describe the ambiguity, the assumptions you made and validated with stakeholders, the MVP you shipped, and the iteration based on feedback.',
      },
    ],
    Mixed: [
      {
        category: 'Technical',
        text: 'What is the difference between cookies, localStorage, and sessionStorage?',
        keywords: ['cookie', 'localstorage', 'sessionstorage', 'persist', 'size', 'server', 'expire', 'origin'],
        modelAnswer:
          'Cookies are sent to the server with each request and can expire; localStorage persists indefinitely per origin (~5MB) and is client-only; sessionStorage is like localStorage but cleared when the tab closes.',
      },
      {
        category: 'HR',
        text: 'Tell me about yourself and the stack you are most comfortable with.',
        keywords: ['background', 'stack', 'react', 'node', 'database', 'project', 'comfortable'],
        modelAnswer:
          'Summarise education, your preferred stack (e.g., React + Node + Postgres), a project using it, and why you enjoy full stack work.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you design the data model for a simple blog with posts and comments?',
        keywords: ['blog', 'post', 'comment', 'table', 'relationship', 'foreign key', 'user', 'schema'],
        modelAnswer:
          'Users, Posts (with user_id foreign key), and Comments (with post_id and user_id foreign keys). Include timestamps and soft-delete flags. Normalise to 3NF.',
      },
      {
        category: 'Project-Based',
        text: 'How would you add real-time notifications to an existing web app?',
        keywords: ['realtime', 'websocket', 'notification', 'socket', 'event', 'push', 'frontend', 'backend'],
        modelAnswer:
          'Use WebSockets (e.g., Socket.IO) or Server-Sent Events. Backend publishes events; frontend subscribes and shows notifications. Handle reconnection and auth on the socket.',
      },
      {
        category: 'Behavioral',
        text: 'Describe a time you improved the performance of a slow web page.',
        keywords: ['performance', 'slow', 'optimize', 'lazy', 'cache', 'bundle', 'image', 'result'],
        modelAnswer:
          'Use STAR. Describe the slow page, the metrics you measured, the changes (code splitting, caching, image optimisation), and the improvement achieved.',
      },
    ],
  },
  'Data Analyst': {
    Technical: [
      {
        category: 'Technical',
        text: 'What is the difference between INNER JOIN and LEFT JOIN in SQL?',
        keywords: ['inner join', 'left join', 'match', 'null', 'rows', 'table', 'sql'],
        modelAnswer:
          'INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right, with NULLs where there is no match.',
      },
      {
        category: 'Technical',
        text: 'Explain the difference between mean, median, and mode and when to use each.',
        keywords: ['mean', 'median', 'mode', 'average', 'outlier', 'skew', 'central tendency'],
        modelAnswer:
          'Mean is the arithmetic average (sensitive to outliers), median is the middle value (robust to outliers), mode is the most frequent value. Use median for skewed data and mode for categorical data.',
      },
      {
        category: 'Technical',
        text: 'What is the difference between GROUP BY and ORDER BY?',
        keywords: ['group by', 'order by', 'aggregate', 'sort', 'sql', 'having', 'ascending'],
        modelAnswer:
          'GROUP BY aggregates rows sharing a key (used with SUM, COUNT). ORDER BY sorts the final result set by a column. HAVING filters groups; WHERE filters rows before grouping.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you handle missing values in a dataset?',
        keywords: ['missing', 'null', 'impute', 'drop', 'mean', 'median', 'category', 'analyse'],
        modelAnswer:
          'First assess the extent and pattern of missingness. Options: drop rows/columns if minimal, impute with mean/median/mode or predictive models, or flag as a separate category. Justify based on data size and analysis goal.',
      },
      {
        category: 'Project-Based',
        text: 'Describe a data analysis project you worked on end to end.',
        keywords: ['project', 'data', 'clean', 'analyse', 'visualise', 'tool', 'insight', 'result'],
        modelAnswer:
          'Cover the business question, data source, cleaning steps, analysis (SQL/Python), visualisation (Tableau/Matplotlib), and the insight or recommendation delivered.',
      },
    ],
    HR: [
      {
        category: 'HR',
        text: 'Why do you want to be a data analyst?',
        keywords: ['data', 'analyst', 'curious', 'insight', 'decision', 'impact', 'story'],
        modelAnswer:
          'Express curiosity about turning data into decisions, enjoyment of problem-solving, and the impact analytics has on business outcomes. Tie to a project or course.',
      },
      {
        category: 'HR',
        text: 'How do you explain technical findings to a non-technical stakeholder?',
        keywords: ['communicate', 'non-technical', 'simple', 'visual', 'story', 'impact', 'avoid jargon'],
        modelAnswer:
          'Focus on the business impact, use simple visuals, avoid jargon, and frame the finding as a recommendation. Start with the conclusion, then supporting detail.',
      },
      {
        category: 'Behavioral',
        text: 'Tell me about a time your analysis contradicted a team\'s assumption.',
        keywords: ['analysis', 'contradict', 'assumption', 'evidence', 'present', 'respectful', 'result'],
        modelAnswer:
          'Use STAR. Describe the assumption, your analysis, how you presented evidence respectfully, and the decision made. Emphasise openness to being wrong.',
      },
    ],
    Mixed: [
      {
        category: 'Technical',
        text: 'What is a primary key and a foreign key in a relational database?',
        keywords: ['primary key', 'foreign key', 'unique', 'reference', 'relationship', 'table', 'integrity'],
        modelAnswer:
          'A primary key uniquely identifies each row in a table. A foreign key references the primary key of another table, enforcing referential integrity.',
      },
      {
        category: 'HR',
        text: 'Tell me about yourself and the analytics tools you know.',
        keywords: ['background', 'tools', 'sql', 'excel', 'python', 'tableau', 'power bi', 'project'],
        modelAnswer:
          'Summarise education, the tools you know (SQL, Excel, Python, Tableau/Power BI), a project, and your goal as a data analyst.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you measure the success of a new product feature?',
        keywords: ['metric', 'success', 'kpi', 'adoption', 'retention', 'conversion', 'a/b test', 'baseline'],
        modelAnswer:
          'Define the goal, choose metrics (adoption, retention, conversion), establish a baseline, run an A/B test if possible, and compare against the baseline while checking for confounders.',
      },
      {
        category: 'Project-Based',
        text: 'How would you analyse customer churn for a subscription business?',
        keywords: ['churn', 'retention', 'cohort', 'segment', 'sql', 'visualise', 'reason', 'recommend'],
        modelAnswer:
          'Define churn, pull usage and billing data, compute churn by cohort and segment, identify correlated factors (tenure, plan, usage), visualise trends, and recommend retention actions.',
      },
      {
        category: 'Behavioral',
        text: 'Describe a time you worked with a messy dataset. What did you do?',
        keywords: ['messy', 'clean', 'validate', 'missing', 'duplicate', 'transform', 'result'],
        modelAnswer:
          'Use STAR. Describe the data quality issues, the cleaning steps (deduplication, imputation, type fixes), validation, and the reliable analysis you produced.',
      },
    ],
  },
  'AI/ML Engineer': {
    Technical: [
      {
        category: 'Technical',
        text: 'Explain the difference between supervised and unsupervised learning with examples.',
        keywords: ['supervised', 'unsupervised', 'label', 'labelled', 'classification', 'clustering', 'example', 'k-means'],
        modelAnswer:
          'Supervised learning uses labelled data to predict outputs (classification, regression — e.g., spam detection). Unsupervised learning finds structure in unlabelled data (clustering, dimensionality reduction — e.g., K-means customer segmentation).',
      },
      {
        category: 'Technical',
        text: 'What is overfitting and how can you reduce it?',
        keywords: ['overfitting', 'generalise', 'variance', 'regularisation', 'cross-validation', 'prune', 'data', 'dropout'],
        modelAnswer:
          'Overfitting is when a model learns noise/training specifics and generalises poorly. Reduce it with more data, regularisation (L1/L2), dropout, simpler models, early stopping, and cross-validation.',
      },
      {
        category: 'Technical',
        text: 'What is gradient descent and how does it train a model?',
        keywords: ['gradient descent', 'loss', 'learning rate', 'update', 'weights', 'minimise', 'step', 'derivative'],
        modelAnswer:
          'Gradient descent iteratively updates weights in the direction that reduces the loss function, using the gradient and a learning rate. It minimises the loss until convergence.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you handle an imbalanced classification dataset?',
        keywords: ['imbalanced', 'class', 'resample', 'smote', 'weight', 'metric', 'precision', 'recall', 'f1'],
        modelAnswer:
          'Use resampling (oversample minority, undersample majority), SMOTE, class weights, and choose appropriate metrics (precision, recall, F1, AUC) rather than accuracy. Consider anomaly detection if extreme.',
      },
      {
        category: 'Project-Based',
        text: 'Describe an ML project you built from data collection to evaluation.',
        keywords: ['project', 'data', 'preprocess', 'model', 'train', 'evaluate', 'metric', 'deploy'],
        modelAnswer:
          'Cover the problem, data source and cleaning, feature engineering, model choice, training, evaluation metric, and any deployment. Highlight challenges and how you validated results.',
      },
    ],
    HR: [
      {
        category: 'HR',
        text: 'What excites you about working in AI/ML?',
        keywords: ['ai', 'ml', 'excite', 'impact', 'learn', 'future', 'problem', 'intelligence'],
        modelAnswer:
          'Express genuine excitement about solving real problems with data-driven intelligence, continuous learning, and the field\'s impact. Tie to a specific interest or project.',
      },
      {
        category: 'HR',
        text: 'How do you keep up with the fast-moving AI/ML field?',
        keywords: ['learn', 'paper', 'course', 'project', 'community', 'experiment', 'news'],
        modelAnswer:
          'Mention reading papers (arXiv), taking courses, experimenting with new techniques in projects, following researchers, and participating in Kaggle or communities.',
      },
      {
        category: 'Behavioral',
        text: 'Tell me about a time a model you built did not perform as expected.',
        keywords: ['model', 'underperform', 'debug', 'data', 'feature', 'evaluate', 'iterate', 'learn'],
        modelAnswer:
          'Use STAR. Describe the poor result, your debugging process (data quality, features, leakage), the fix, and what you learned about validation.',
      },
    ],
    Mixed: [
      {
        category: 'Technical',
        text: 'What is the difference between bias and variance?',
        keywords: ['bias', 'variance', 'tradeoff', 'error', 'underfit', 'overfit', 'model', 'generalisation'],
        modelAnswer:
          'Bias is error from wrong assumptions (underfitting); variance is error from sensitivity to training data (overfitting). There is a trade-off: decreasing one often increases the other.',
      },
      {
        category: 'HR',
        text: 'Tell me about yourself and your interest in machine learning.',
        keywords: ['background', 'ml', 'interest', 'project', 'math', 'learn', 'goal'],
        modelAnswer:
          'Summarise education, math/programming foundation, an ML project, and your goal as an AI/ML engineer.',
      },
      {
        category: 'Role-Specific',
        text: 'Explain what a confusion matrix is and the metrics derived from it.',
        keywords: ['confusion matrix', 'tp', 'fp', 'tn', 'fn', 'precision', 'recall', 'accuracy', 'f1'],
        modelAnswer:
          'A confusion matrix shows TP, FP, TN, FN. From it: accuracy = (TP+TN)/total, precision = TP/(TP+FP), recall = TP/(TP+FN), F1 is their harmonic mean.',
      },
      {
        category: 'Project-Based',
        text: 'How would you build a simple spam classifier?',
        keywords: ['spam', 'classifier', 'naive bayes', 'tf-idf', 'feature', 'train', 'evaluate', 'text'],
        modelAnswer:
          'Collect labelled emails, preprocess text (tokenise, remove stop words), vectorise with TF-IDF or counts, train Naive Bayes or logistic regression, and evaluate with precision/recall/F1.',
      },
      {
        category: 'Behavioral',
        text: 'Describe a time you had to explain a complex ML concept simply.',
        keywords: ['explain', 'simple', 'ml', 'analogy', 'audience', 'visual', 'result'],
        modelAnswer:
          'Use STAR. Describe the audience, the concept, the analogy or visual you used, and how the audience understood and acted on it.',
      },
    ],
  },
  'Web Developer': {
    Technical: [
      {
        category: 'Technical',
        text: 'What is the difference between HTML, CSS, and JavaScript in a web page?',
        keywords: ['html', 'css', 'javascript', 'structure', 'style', 'behavior', 'semantic', 'dom'],
        modelAnswer:
          'HTML provides structure/semantics, CSS controls presentation/layout, and JavaScript adds interactivity and behaviour by manipulating the DOM.',
      },
      {
        category: 'Technical',
        text: 'Explain the CSS box model and its components.',
        keywords: ['box model', 'content', 'padding', 'border', 'margin', 'css', 'layout'],
        modelAnswer:
          'The box model treats every element as a box consisting of content, padding, border, and margin, from inside out. box-sizing controls whether width includes padding and border.',
      },
      {
        category: 'Technical',
        text: 'What is the DOM and how does JavaScript interact with it?',
        keywords: ['dom', 'document', 'object', 'model', 'tree', 'node', 'javascript', 'manipulate'],
        modelAnswer:
          'The DOM is a tree representation of the HTML document. JavaScript can query, create, modify, and remove nodes via APIs like querySelector and addEventListener to update the page dynamically.',
      },
      {
        category: 'Role-Specific',
        text: 'How do you make a web page responsive?',
        keywords: ['responsive', 'media query', 'viewport', 'flexbox', 'grid', 'mobile', 'breakpoint'],
        modelAnswer:
          'Use a responsive viewport meta tag, flexible layouts with Flexbox/Grid, media queries for breakpoints, relative units (rem, %), and responsive images. Test across devices.',
      },
      {
        category: 'Project-Based',
        text: 'Describe a website you built. What technologies did you use?',
        keywords: ['website', 'html', 'css', 'javascript', 'react', 'responsive', 'feature', 'result'],
        modelAnswer:
          'Name the site, the tech (HTML/CSS/JS or React), key features, how you made it responsive, and what you learned. Mention deployment if applicable.',
      },
    ],
    HR: [
      {
        category: 'HR',
        text: 'Why did you choose web development as a career path?',
        keywords: ['web', 'development', 'career', 'create', 'visual', 'impact', 'learn', 'user'],
        modelAnswer:
          'Express enjoyment of building visible, usable products, the fast feedback loop, and the creativity of web development. Tie to a project that sparked your interest.',
      },
      {
        category: 'HR',
        text: 'How do you ensure a good user experience in your websites?',
        keywords: ['user experience', 'ux', 'simple', 'fast', 'accessible', 'feedback', 'test', 'mobile'],
        modelAnswer:
          'Focus on clarity, fast load times, accessibility, intuitive navigation, mobile-friendliness, and testing with real users. Iterate based on feedback.',
      },
      {
        category: 'Behavioral',
        text: 'Tell me about a time you fixed a tricky CSS or layout bug.',
        keywords: ['css', 'bug', 'layout', 'inspect', 'devtools', 'fix', 'learn', 'result'],
        modelAnswer:
          'Use STAR. Describe the bug, how you used dev tools to inspect, the root cause, the fix, and what you learned about the CSS feature involved.',
      },
    ],
    Mixed: [
      {
        category: 'Technical',
        text: 'What is the difference between flexbox and CSS grid? When would you use each?',
        keywords: ['flexbox', 'grid', 'one-dimensional', 'two-dimensional', 'layout', 'css', 'use case'],
        modelAnswer:
          'Flexbox is one-dimensional (row or column) for component-level alignment; Grid is two-dimensional (rows and columns) for page-level layout. Use Flexbox for nav bars and Grid for overall page structure.',
      },
      {
        category: 'HR',
        text: 'Tell me about yourself and the kind of websites you like to build.',
        keywords: ['background', 'websites', 'react', 'responsive', 'interest', 'project', 'goal'],
        modelAnswer:
          'Summarise education, the types of sites you enjoy building (e.g., interactive, accessible), a project, and your goal as a web developer.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you optimise a website\'s load performance?',
        keywords: ['performance', 'optimise', 'image', 'minify', 'cache', 'cdn', 'lazy', 'render', 'bundle'],
        modelAnswer:
          'Minify CSS/JS, optimise and lazy-load images, use a CDN, enable caching, reduce HTTP requests, defer non-critical scripts, and measure with Lighthouse.',
      },
      {
        category: 'Project-Based',
        text: 'How would you build a responsive landing page with a contact form?',
        keywords: ['landing', 'responsive', 'form', 'html', 'css', 'validation', 'flexbox', 'grid'],
        modelAnswer:
          'Use semantic HTML, CSS Grid/Flexbox for responsive layout, validate form input client-side, and handle submission with fetch to a backend or service. Test on mobile and desktop.',
      },
      {
        category: 'Behavioral',
        text: 'Describe a time you received critical feedback on a website you built.',
        keywords: ['feedback', 'critical', 'listen', 'improve', 'iterate', 'result', 'open'],
        modelAnswer:
          'Use STAR. Describe the feedback, how you accepted it without defensiveness, the changes you made, and the improved result.',
      },
    ],
  },
  'Database Developer': {
    Technical: [
      {
        category: 'Technical',
        text: 'What is database normalization? Explain 1NF, 2NF, and 3NF.',
        keywords: ['normalization', '1nf', '2nf', '3nf', 'redundancy', 'dependency', 'atomic', 'normal form'],
        modelAnswer:
          'Normalization reduces redundancy and anomalies. 1NF: atomic values, no repeating groups. 2NF: 1NF plus no partial dependency on a composite key. 3NF: 2NF plus no transitive dependency on non-key attributes.',
      },
      {
        category: 'Technical',
        text: 'What is an index in a database and what are the trade-offs of using one?',
        keywords: ['index', 'b-tree', 'query', 'fast', 'insert', 'update', 'storage', 'tradeoff'],
        modelAnswer:
          'An index is a data structure (usually B-tree) that speeds up reads on indexed columns. Trade-off: faster reads but slower inserts/updates and extra storage. Index selectively on columns used in filters and joins.',
      },
      {
        category: 'Technical',
        text: 'Explain the difference between a clustered and a non-clustered index.',
        keywords: ['clustered', 'non-clustered', 'index', 'order', 'leaf', 'pointer', 'table', 'physical'],
        modelAnswer:
          'A clustered index determines the physical row order of the table (one per table). A non-clustered index is a separate structure with pointers to rows; a table can have many.',
      },
      {
        category: 'Role-Specific',
        text: 'How would you optimise a slow-running SQL query?',
        keywords: ['slow', 'query', 'explain', 'plan', 'index', 'join', 'rewrite', 'optimise', 'analyse'],
        modelAnswer:
          'Run EXPLAIN/ANALYZE to inspect the plan, add or fix indexes, rewrite to avoid correlated subqueries, reduce columns selected, and check for table scans or bad join order.',
      },
      {
        category: 'Project-Based',
        text: 'Describe a database you designed. What schema decisions did you make?',
        keywords: ['database', 'schema', 'table', 'relationship', 'index', 'normalization', 'decision', 'project'],
        modelAnswer:
          'Describe the entity relationships, normalisation level, indexes added, and key constraints. Explain trade-offs like denormalisation for read performance if relevant.',
      },
    ],
    HR: [
      {
        category: 'HR',
        text: 'Why are you passionate about databases?',
        keywords: ['database', 'passion', 'data', 'structure', 'performance', 'foundation', 'problem'],
        modelAnswer:
          'Express interest in how data is organised, made fast and reliable, and how databases underpin every application. Tie to a project or course that drew you in.',
      },
      {
        category: 'HR',
        text: 'How do you ensure data integrity in a database?',
        keywords: ['integrity', 'constraint', 'primary key', 'foreign key', 'unique', 'validation', 'transaction', 'acid'],
        modelAnswer:
          'Use constraints (primary key, foreign key, unique, not null, check), transactions with ACID properties, and application-level validation. Mention triggers or stored procedures if relevant.',
      },
      {
        category: 'Behavioral',
        text: 'Tell me about a time you diagnosed and fixed a data inconsistency.',
        keywords: ['data', 'inconsistency', 'diagnose', 'fix', 'constraint', 'audit', 'result', 'learn'],
        modelAnswer:
          'Use STAR. Describe the inconsistency, how you traced it (logs, queries, constraints), the fix, and the preventive measure you added.',
      },
    ],
    Mixed: [
      {
        category: 'Technical',
        text: 'What is a transaction and what do ACID properties mean?',
        keywords: ['transaction', 'acid', 'atomicity', 'consistency', 'isolation', 'durability', 'commit', 'rollback'],
        modelAnswer:
          'A transaction is a unit of work. ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don\'t interfere), Durability (committed data persists).',
      },
      {
        category: 'HR',
        text: 'Tell me about yourself and the database systems you have worked with.',
        keywords: ['background', 'database', 'mysql', 'postgres', 'mongodb', 'project', 'goal'],
        modelAnswer:
          'Summarise education, the databases you\'ve used (MySQL, Postgres, MongoDB), a project, and your goal as a database developer.',
      },
      {
        category: 'Role-Specific',
        text: 'What is a stored procedure and when would you use one?',
        keywords: ['stored procedure', 'sql', 'logic', 'reuse', 'performance', 'security', 'parameter', 'database'],
        modelAnswer:
          'A stored procedure is precompiled SQL stored in the database. Use it for reusable business logic, to reduce network traffic, and to centralise logic with better security and performance.',
      },
      {
        category: 'Project-Based',
        text: 'How would you design a database schema for an e-commerce store?',
        keywords: ['ecommerce', 'schema', 'product', 'order', 'customer', 'cart', 'relationship', 'normalize'],
        modelAnswer:
          'Tables for Customers, Products, Categories, Orders, and Order_Items with proper foreign keys. Normalise to 3NF, index foreign keys and search columns, and consider denormalising for reporting.',
      },
      {
        category: 'Behavioral',
        text: 'Describe a time you had to learn a new database tool or system quickly.',
        keywords: ['learn', 'database', 'tool', 'quickly', 'documentation', 'project', 'adapt', 'result'],
        modelAnswer:
          'Use STAR. Describe the need, the resource you used to learn, how you applied it, and the successful outcome.',
      },
    ],
  },
};

let counter = 0;
const questionBank: InterviewQuestion[] = [];

(Object.keys(rawBank) as InterviewRole[]).forEach((role) => {
  const types = rawBank[role];
  (Object.keys(types) as InterviewType[]).forEach((type) => {
    types[type].forEach((q) => {
      counter += 1;
      questionBank.push({
        id: `q-${counter}`,
        role,
        type,
        category: q.category,
        text: q.text,
        keywords: q.keywords,
        modelAnswer: q.modelAnswer,
      });
    });
  });
});

export function getQuestions(
  role: InterviewRole,
  type: InterviewType,
  count: number
): InterviewQuestion[] {
  let pool = questionBank.filter(
    (q) => q.role === role && (type === 'Mixed' ? true : q.type === type)
  );
  if (pool.length === 0) {
    pool = questionBank.filter((q) => q.role === role);
  }
  if (pool.length === 0) {
    pool = questionBank.slice();
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export const roles: InterviewRole[] = [
  'Software Developer',
  'Python Developer',
  'Java Developer',
  'Full Stack Developer',
  'Data Analyst',
  'AI/ML Engineer',
  'Web Developer',
  'Database Developer',
];

export const interviewTypes: InterviewType[] = ['Technical', 'HR', 'Mixed'];

export const experienceLevels: ExperienceLevel[] = [
  'Fresher',
  'Beginner',
  'Intermediate',
];

export const questionCountOptions = [5, 10, 15] as const;

export type { InterviewRole, InterviewType, ExperienceLevel, QuestionCategory };
