// Centralized Dummy Data for CodeMap AI

export const statistics = [
  { label: 'Total Files', value: '148', change: '+12%', type: 'info' },
  { label: 'Classes Detected', value: '42', change: '+3%', type: 'success' },
  { label: 'Functions Indexed', value: '612', change: '+24', type: 'warning' },
  { label: 'Graph Nodes', value: '1,204', change: '+156', type: 'info' },
  { label: 'AI Queries Run', value: '84', change: '+8 yesterday', type: 'purple' },
];

export const dashboardData = {
  projectOverview: {
    name: 'CodeMap AI Core',
    description: 'A platform for automated architectural analysis, visual call-graph discovery, and automated AI code assistant.',
    languageBreakdown: [
      { language: 'JavaScript', percentage: 48, color: 'bg-yellow-500' },
      { language: 'Python', percentage: 38, color: 'bg-blue-500' },
      { language: 'CSS/HTML', percentage: 10, color: 'bg-orange-500' },
      { language: 'Shell', percentage: 4, color: 'bg-green-500' },
    ],
    lastUpdated: '10 minutes ago',
    activeBranch: 'main',
  },
  quickActions: [
    { title: 'Upload Repository', description: 'Analyze a new repository via Git URL or ZIP file.', actionHash: '/repository', icon: 'upload' },
    { title: 'Explore Codebase Graph', description: 'Interact with visual class inheritance and dependency graphs.', actionHash: '/graph', icon: 'graph' },
    { title: 'Analyze Request Flow', description: 'Track step-by-step function calling hierarchies.', actionHash: '/flow', icon: 'flow' },
    { title: 'Ask Copilot', description: 'Query the AI Assistant about structural bottlenecks or code questions.', actionHash: '/assistant', icon: 'ai' },
  ],
  recentQueries: [
    { id: 1, query: 'Show me all circular dependencies in auth module', timestamp: '2 hours ago', status: 'resolved' },
    { id: 2, query: 'Trace execution flow for user registration endpoint', timestamp: '5 hours ago', status: 'resolved' },
    { id: 3, query: 'Which files import DBConfig directly instead of using connection pool?', timestamp: 'Yesterday', status: 'resolved' },
    { id: 4, query: 'Summarize architectural patterns used in parser/ directory', timestamp: '3 days ago', status: 'resolved' },
  ],
  projectSummary: {
    circularDependencies: 2,
    deadCodeWarnings: 14,
    complexityScore: 'A (High Maintainability)',
    testCoverage: '78.4%',
  }
};

export const repositories = [
  { id: 1, name: 'codemap-ai-core', url: 'https://github.com/mpr-project/codemap-ai-core', status: 'ready', branch: 'main', files: 148, size: '24.5 MB', uploadedAt: '10 minutes ago' },
  { id: 2, name: 'fastapi-backend-service', url: 'https://github.com/mpr-project/fastapi-backend-service', status: 'ready', branch: 'development', files: 89, size: '12.8 MB', uploadedAt: '2 hours ago' },
  { id: 3, name: 'react-dashboard-mpr', url: 'local-zip-upload', status: 'processing', branch: 'N/A', files: 45, size: '4.2 MB', uploadedAt: 'Just now' },
  { id: 4, name: 'legacy-data-parser', url: 'https://github.com/mpr-project/legacy-data-parser', status: 'failed', branch: 'master', files: 0, size: '0 MB', uploadedAt: 'Yesterday' },
];

export const graphNodes = [
  // Authentication Module
  { id: 'auth.controller', label: 'auth_controller.py', type: 'file', group: 'auth', loc: 240, color: '#38bdf8' },
  { id: 'auth.service', label: 'AuthService', type: 'class', group: 'auth', loc: 412, color: '#0284c7' },
  { id: 'auth.model', label: 'UserModel', type: 'class', group: 'auth', loc: 180, color: '#0369a1' },
  // DB Module
  { id: 'db.client', label: 'DatabaseClient', type: 'class', group: 'database', loc: 320, color: '#10b981' },
  { id: 'db.config', label: 'db_config.py', type: 'file', group: 'database', loc: 60, color: '#059669' },
  // API Controller
  { id: 'api.router', label: 'router.py', type: 'file', group: 'api', loc: 150, color: '#a855f7' },
  { id: 'api.endpoints', label: 'auth_endpoints.py', type: 'file', group: 'api', loc: 95, color: '#c084fc' },
  // Utils Module
  { id: 'utils.hash', label: 'hash_utils.py', type: 'file', group: 'utils', loc: 45, color: '#f59e0b' },
  { id: 'utils.jwt', label: 'jwt_helper.py', type: 'file', group: 'utils', loc: 110, color: '#d97706' },
];

export const graphEdges = [
  { source: 'api.router', target: 'api.endpoints', label: 'includes', type: 'include' },
  { source: 'api.endpoints', target: 'auth.controller', label: 'invokes', type: 'call' },
  { source: 'auth.controller', target: 'auth.service', label: 'delegates', type: 'call' },
  { source: 'auth.service', target: 'auth.model', label: 'queries', type: 'read' },
  { source: 'auth.service', target: 'db.client', label: 'connects', type: 'call' },
  { source: 'auth.service', target: 'utils.jwt', label: 'calls', type: 'utility' },
  { source: 'auth.service', target: 'utils.hash', label: 'calls', type: 'utility' },
  { source: 'db.client', target: 'db.config', label: 'loads', type: 'read' },
];

export const executionFlow = {
  title: 'POST /login',
  description: 'Authentication lifecycle for credential validation and session token generation.',
  totalTimeMs: 145,
  steps: [
    {
      id: 1,
      name: 'POST /login',
      type: 'endpoint',
      description: 'Incoming HTTP Request with credentials payload',
      file: 'api/router.py:L24',
      duration: '4ms',
      status: 'success',
      caller: 'Client Browser',
      callee: 'auth_endpoints.py:login_endpoint()'
    },
    {
      id: 2,
      name: 'login()',
      type: 'controller',
      description: 'Controller matches credentials, starts validation transaction',
      file: 'controllers/auth_controller.py:L48',
      duration: '12ms',
      status: 'success',
      caller: 'auth_endpoints.py:login_endpoint()',
      callee: 'AuthService.validate_credentials()'
    },
    {
      id: 3,
      name: 'validate()',
      type: 'service',
      description: 'Verifies user email existence and compares hashed password',
      file: 'services/auth_service.py:L115',
      duration: '85ms',
      status: 'success',
      caller: 'controllers/auth_controller.py:L48',
      callee: 'DatabaseClient.find_user_by_email()'
    },
    {
      id: 4,
      name: 'database()',
      type: 'database',
      description: 'MongoDB query to retrieve user document by email index',
      file: 'database/client.py:L82',
      duration: '62ms',
      status: 'success',
      caller: 'services/auth_service.py:L115',
      callee: 'MongoDB Driver'
    },
    {
      id: 5,
      name: 'generate_token()',
      type: 'utility',
      description: 'JWT token signer generates signature with 24h expiration',
      file: 'utils/jwt_helper.py:L35',
      duration: '8ms',
      status: 'success',
      caller: 'controllers/auth_controller.py:L58',
      callee: 'HS256 Engine'
    },
    {
      id: 6,
      name: 'response',
      type: 'response',
      description: 'Returns HTTP 200 OK with access_token and user info',
      file: 'api/router.py:L32',
      duration: '2ms',
      status: 'success',
      caller: 'auth_endpoints.py:login_endpoint()',
      callee: 'Client Browser'
    }
  ]
};

export const assistantMessages = [
  {
    id: 1,
    role: 'assistant',
    text: 'Hello! I am CodeMap Copilot. I have parsed **148 files** in your repository. How can I help you visualize or optimize your codebase architecture today?',
    timestamp: '10:00 AM',
    suggestions: [
      'Explain authentication architecture',
      'Show circular dependencies',
      'Trace POST /login flow',
      'List unused utility functions'
    ]
  },
  {
    id: 2,
    role: 'user',
    text: 'Can you summarize how authentication is structured?',
    timestamp: '10:01 AM'
  },
  {
    id: 3,
    role: 'assistant',
    text: 'Certainly! The authentication system in **codemap-ai-core** follows a standard MVC/Service architectural pattern:\n\n1. **Route Endpoint**: `api/auth_endpoints.py` defines the `/login` route.\n2. **Controller Layer**: `controllers/auth_controller.py` orchestrates input sanitization and response formatting.\n3. **Business Logic (Service)**: `services/auth_service.py` houses `AuthService`, which manages encryption logic and user session lifecycles.\n4. **Data Layer**: `database/client.py` performs lookup/writes via `DatabaseClient` targeting MongoDB.\n\nDependencies flow downward. Would you like me to map this flow in the **Execution Flow Explorer** or see it on the **Graph Canvas**?',
    timestamp: '10:01 AM',
    suggestions: [
      'Show execution flow graph',
      'Are there database calls inside the controller?'
    ]
  }
];
