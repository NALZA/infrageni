/**
 * Question Library
 * Sample system design questions with comprehensive educational content
 */

import { 
  DesignQuestion, 
  DifficultyLevel, 
  QuestionCategory, 
  LearningObjective,
  TeachingStep,
  PatternExplanation,
  DiagramAnnotation
} from '../types';
import { createSimple3TierWebAppPattern } from '../../patterns/library/web-app-patterns';
import { PatternCategory, PatternComplexity, PatternStatus } from '../../patterns/core/pattern-types';

/**
 * Beginner Level Questions
 */

export const urlShortenerQuestion: DesignQuestion = {
  id: 'url-shortener-basic',
  title: 'Design a URL Shortener Service',
  description: 'Design a system like bit.ly that can shorten long URLs and redirect users when they click the short URL.',
  
  category: QuestionCategory.WEB_ARCHITECTURE,
  difficulty: DifficultyLevel.BEGINNER,
  estimatedTime: 30,
  learningObjectives: [
    LearningObjective.UNDERSTAND_CONCEPTS,
    LearningObjective.APPLY_PATTERNS,
    LearningObjective.DESIGN_SYSTEMS
  ],
  
  requirements: [
    'Users can input a long URL and get a shortened version',
    'When someone clicks the short URL, they are redirected to the original URL',
    'System should handle 100 URL shortenings per day',
    'URLs should not expire',
    'System should be available 99% of the time'
  ],
  
  constraints: [
    'Budget-conscious solution for a startup',
    'Simple architecture that one developer can maintain',
    'Must be web-based (accessible via browser)',
    'No need for analytics or custom domains initially'
  ],
  
  assumptions: [
    'Users are primarily from a single geographic region',
    'Most URLs will be clicked within the first week of creation',
    'Read-to-write ratio is approximately 10:1',
    'No need for user accounts or authentication initially'
  ],
  
  scaleRequirements: {
    users: '1,000 daily active users',
    requests: '100 shortenings/day, 1,000 redirects/day',
    data: '10,000 URLs stored',
    availability: '99% uptime'
  },
  
  solution: {
    pattern: {
      ...createSimple3TierWebAppPattern(),
      id: 'url-shortener-pattern',
      name: 'URL Shortener Architecture',
      description: 'Simple 3-tier architecture for URL shortening service',
      components: [
        {
          componentId: 'generic-vpc',
          instanceId: 'main-vpc',
          displayName: 'Main VPC',
          position: { x: 50, y: 50 },
          configuration: { cidrBlock: '10.0.0.0/16' },
          required: true,
          dependencies: [],
          metadata: { description: 'Isolated network for URL shortener service' }
        },
        {
          componentId: 'generic-compute',
          instanceId: 'web-server',
          displayName: 'Web Application',
          position: { x: 150, y: 150 },
          configuration: { instanceType: 't3.micro', operatingSystem: 'linux' },
          required: true,
          dependencies: ['main-vpc'],
          metadata: { description: 'Handles URL shortening requests and redirects' }
        },
        {
          componentId: 'generic-database',
          instanceId: 'url-database',
          displayName: 'URL Database',
          position: { x: 350, y: 150 },
          configuration: { engine: 'mysql', instanceClass: 'db.t3.micro' },
          required: true,
          dependencies: ['main-vpc'],
          metadata: { description: 'Stores URL mappings and metadata' }
        }
      ]
    },
    
    teachingSteps: [
      {
        id: 'step-1',
        title: 'Understand the Problem',
        description: 'Break down what a URL shortener needs to do',
        explanation: 'A URL shortener has two main functions: 1) Take a long URL and create a short version, 2) When someone visits the short URL, redirect them to the original long URL. Think of it like a simple lookup table.',
        keyPoints: [
          'Two main operations: shorten and redirect',
          'Need to store URL mappings permanently',
          'Redirect operation will be much more frequent than shortening',
          'Simple problem but good for learning web architecture basics'
        ],
        commonMistakes: [
          'Over-engineering for the scale requirements',
          'Forgetting about the redirect functionality',
          'Not considering data persistence'
        ]
      },
      {
        id: 'step-2',
        title: 'Choose the Architecture Pattern',
        description: 'Select a 3-tier architecture for simplicity',
        explanation: 'For this scale (100 shortenings/day), a simple 3-tier architecture is perfect. We have: 1) Web layer (handles requests), 2) Application layer (business logic), 3) Data layer (storage).',
        visualHighlights: ['web-server', 'url-database'],
        keyPoints: [
          '3-tier architecture separates concerns clearly',
          'Web server handles HTTP requests and responses',
          'Database stores the URL mappings',
          'Simple and cost-effective for small scale'
        ],
        commonMistakes: [
          'Choosing microservices for this simple use case',
          'Adding unnecessary caching layers',
          'Using NoSQL when SQL is simpler for this use case'
        ]
      },
      {
        id: 'step-3',
        title: 'Design the Database Schema',
        description: 'Simple table to store URL mappings',
        explanation: 'We need a simple table with columns: short_code (unique), original_url, created_at. The short_code serves as our primary key and maps to the original URL.',
        codeExample: `
CREATE TABLE url_mappings (
  short_code VARCHAR(10) PRIMARY KEY,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        keyPoints: [
          'Keep it simple with just essential columns',
          'short_code should be unique and serve as primary key',
          'original_url can be TEXT to handle very long URLs',
          'created_at helps with debugging and potential analytics'
        ]
      },
      {
        id: 'step-4',
        title: 'Implement URL Shortening Logic',
        description: 'Generate unique short codes for URLs',
        explanation: 'For generating short codes, we can use a simple approach: generate a random string and check if it exists. For 10,000 URLs, collision probability is very low with 6-character codes.',
        codeExample: `
function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}`,
        keyPoints: [
          'Random generation is simple and sufficient for this scale',
          '6 characters gives us 62^6 = 56+ billion possibilities',
          'Check for collisions and regenerate if needed',
          'Could optimize later with counter-based approach if needed'
        ]
      },
      {
        id: 'step-5',
        title: 'Handle Redirect Logic',
        description: 'Implement fast URL lookups and redirects',
        explanation: 'When a user visits short.ly/abc123, look up abc123 in the database, get the original URL, and send an HTTP 301 redirect. This is the most frequent operation.',
        codeExample: `
app.get('/:shortCode', async (req, res) => {
  const url = await db.findByShortCode(req.params.shortCode);
  if (url) {
    res.redirect(301, url.original_url);
  } else {
    res.status(404).send('URL not found');
  }
});`,
        keyPoints: [
          'Use HTTP 301 for permanent redirects',
          'Handle case when short code doesn\'t exist',
          'This endpoint will handle 90% of traffic',
          'Database lookup should be fast with proper indexing'
        ]
      }
    ],
    
    annotations: [
      {
        id: 'web-annotation',
        componentId: 'web-server',
        position: { x: 200, y: 130 },
        type: 'explanation',
        title: 'Web Application Layer',
        content: 'Handles HTTP requests for shortening URLs and redirecting users. Contains both the API endpoints and simple web interface.',
        importance: 'high',
        relatedConcepts: ['HTTP handling', 'Web servers', 'REST APIs']
      },
      {
        id: 'db-annotation',
        componentId: 'url-database',
        position: { x: 400, y: 130 },
        type: 'explanation',
        title: 'URL Mapping Storage',
        content: 'Stores the mapping between short codes and original URLs. Simple relational database is perfect for this use case.',
        importance: 'high',
        relatedConcepts: ['Relational databases', 'Primary keys', 'Data persistence']
      }
    ],
    
    patternExplanations: [
      {
        patternName: '3-Tier Architecture',
        when: 'When you need a simple, well-understood architecture for web applications with clear separation of concerns.',
        why: 'Separates presentation (web), logic (application), and data (database) layers. Easy to develop, test, and maintain.',
        how: 'Deploy web server to handle requests, application logic in the same or separate tier, and database for persistence.',
        tradeoffs: {
          pros: [
            'Simple to understand and implement',
            'Clear separation of concerns',
            'Easy to scale individual tiers',
            'Well-supported by hosting providers'
          ],
          cons: [
            'Can become monolithic if not careful',
            'Database can become a bottleneck',
            'Less flexible than microservices for complex domains'
          ]
        },
        alternatives: [
          'Serverless functions + managed database',
          'Single-tier (everything in one process)',
          'Microservices (overkill for this scale)'
        ],
        realWorldExamples: [
          'Most small business websites',
          'E-commerce sites like early Amazon',
          'Content management systems',
          'Basic SaaS applications'
        ],
        scalingConsiderations: [
          'Add caching layer (Redis) for frequently accessed URLs',
          'Use read replicas for database scaling',
          'Add load balancer for multiple web servers',
          'Consider CDN for global distribution'
        ]
      }
    ]
  },
  
  hints: [
    {
      level: 'subtle',
      content: 'Think about the two main operations this system needs to perform.',
      triggeredAfter: 60
    },
    {
      level: 'moderate', 
      content: 'Consider what happens when someone clicks a shortened URL - how does the system know where to redirect them?',
      triggeredAfter: 180
    },
    {
      level: 'explicit',
      content: 'You need to store a mapping between short codes and original URLs. A simple database table would work well.',
      triggeredAfter: 300
    }
  ],
  
  commonPitfalls: [
    'Over-engineering the solution with microservices',
    'Forgetting about the redirect functionality',
    'Not considering URL collision handling',
    'Making the short codes too long or too short',
    'Not thinking about database indexing for fast lookups'
  ],
  
  extensionChallenges: [
    'Add user accounts so people can manage their URLs',
    'Add analytics to track click counts',
    'Add custom domains (e.g., mycompany.short/abc123)',
    'Add URL expiration functionality',
    'Scale to handle 1 million URLs per day'
  ],
  
  relatedQuestions: [
    'chat-application-basic',
    'photo-sharing-basic'
  ],
  
  tags: ['web-development', 'databases', 'http', 'beginner', '3-tier'],
  author: 'InfraGeni Education Team',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  rating: 4.5,
  completionCount: 150
};

export const chatApplicationQuestion: DesignQuestion = {
  id: 'chat-application-basic',
  title: 'Design a Simple Chat Application',
  description: 'Design a basic chat application where users can join rooms and send messages to each other in real-time.',
  
  category: QuestionCategory.REAL_TIME,
  difficulty: DifficultyLevel.BEGINNER,
  estimatedTime: 35,
  learningObjectives: [
    LearningObjective.UNDERSTAND_CONCEPTS,
    LearningObjective.APPLY_PATTERNS,
    LearningObjective.DESIGN_SYSTEMS
  ],
  
  requirements: [
    'Users can join chat rooms by entering a room name',
    'Users can send messages that appear in real-time for all room members',
    'Show list of users currently in each room',
    'Support 50 concurrent users across 10 chat rooms',
    'Messages should appear within 1 second of being sent'
  ],
  
  constraints: [
    'Web-based application (no mobile apps needed initially)',
    'No need for user registration or login',
    'Messages do not need to be persisted long-term',
    'Simple UI is acceptable'
  ],
  
  assumptions: [
    'Users have stable internet connections',
    'Average message length is 50 characters',
    'Peak usage is 50 messages per minute across all rooms',
    'Users typically stay in rooms for 30 minutes'
  ],
  
  scaleRequirements: {
    users: '50 concurrent users',
    requests: '50 messages/minute',
    data: 'Temporary message storage only',
    availability: '99% uptime during business hours'
  },
  
  solution: {
    pattern: {
      id: 'chat-app-pattern',
      name: 'Real-time Chat Architecture',
      description: 'WebSocket-based chat application with temporary message storage',
      version: '1.0.0',
      category: PatternCategory.WEB_APPLICATIONS,
      complexity: PatternComplexity.BEGINNER,
      status: PatternStatus.PUBLISHED,
      components: [
        {
          componentId: 'generic-compute',
          instanceId: 'chat-server',
          displayName: 'Chat Server',
          position: { x: 150, y: 150 },
          configuration: { 
            instanceType: 't3.small',
            operatingSystem: 'linux',
            runtime: 'nodejs'
          },
          required: true,
          dependencies: [],
          metadata: { 
            description: 'WebSocket server handling real-time messaging'
          }
        },
        {
          componentId: 'generic-storage',
          instanceId: 'message-cache',
          displayName: 'Message Cache',
          position: { x: 350, y: 150 },
          configuration: {
            type: 'redis',
            size: 'small'
          },
          required: true,
          dependencies: ['chat-server'],
          metadata: {
            description: 'Temporary storage for active chat messages'
          }
        }
      ],
      relationships: [
        {
          id: 'server-cache-connection',
          fromInstanceId: 'chat-server',
          toInstanceId: 'message-cache',
          relationshipType: 'data-flow' as any,
          configuration: {
            bidirectional: true,
            protocols: ['redis']
          },
          metadata: {
            description: 'Server stores and retrieves messages from cache'
          }
        }
      ],
      parameters: [],
      preview: {
        thumbnail: '',
        description: 'Real-time chat with WebSockets',
        features: ['Real-time messaging', 'Chat rooms', 'User presence'],
        benefits: ['Low latency', 'Simple architecture', 'Cost effective'],
        useCases: ['Team chat', 'Customer support', 'Gaming chat']
      },
      documentation: {} as any,
      tags: ['chat', 'websockets', 'real-time'],
      author: 'InfraGeni Education',
      license: 'MIT',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      providers: ['aws', 'gcp', 'azure'],
      requiredFeatures: ['websockets', 'cache'],
      changelog: [],
      migrations: []
    },
    
    teachingSteps: [
      {
        id: 'step-1',
        title: 'Understand Real-time Requirements',
        description: 'Identify what makes chat different from regular web apps',
        explanation: 'Chat applications need real-time communication. Unlike regular web pages where users request information, chat needs to push messages to users instantly when someone else sends them.',
        keyPoints: [
          'Messages must appear in real-time (< 1 second)',
          'Server needs to push data to clients, not just respond',
          'Multiple users need to see the same messages simultaneously',
          'Traditional HTTP request-response is too slow'
        ],
        commonMistakes: [
          'Trying to use regular HTTP polling',
          'Not considering connection management',
          'Forgetting about message ordering'
        ]
      },
      {
        id: 'step-2',
        title: 'Choose WebSocket Technology',
        description: 'Select WebSockets for bidirectional real-time communication',
        explanation: 'WebSockets allow persistent connections between browser and server. Once connected, both sides can send messages instantly without the overhead of HTTP requests.',
        keyPoints: [
          'WebSockets provide full-duplex communication',
          'Much lower latency than HTTP polling',
          'Persistent connection reduces overhead',
          'Supported by all modern browsers'
        ],
        commonMistakes: [
          'Using HTTP long polling instead of WebSockets',
          'Not handling connection drops gracefully',
          'Forgetting about connection limits'
        ]
      },
      {
        id: 'step-3',
        title: 'Design Message Flow',
        description: 'Plan how messages move between users',
        explanation: 'When User A sends a message: 1) Message goes to server via WebSocket, 2) Server validates and processes message, 3) Server broadcasts to all users in the same room, 4) Other users receive message instantly.',
        codeExample: `
// Client sends message
socket.emit('message', { room: 'general', text: 'Hello everyone!' });

// Server receives and broadcasts
socket.on('message', (data) => {
  // Broadcast to all users in the room
  socket.to(data.room).emit('newMessage', {
    user: socket.username,
    text: data.text,
    timestamp: new Date()
  });
});`,
        keyPoints: [
          'Server acts as message broker',
          'Room-based message routing',
          'Add timestamp and user info server-side',
          'Broadcast to room members only'
        ]
      },
      {
        id: 'step-4',
        title: 'Handle User Presence',
        description: 'Track who is online in each room',
        explanation: 'Keep track of which users are in which rooms. When users join/leave, update all room members. Use WebSocket connection events to detect when users disconnect.',
        keyPoints: [
          'Track user-to-room mapping',
          'Broadcast join/leave events',
          'Handle unexpected disconnections',
          'Show online user list to room members'
        ]
      },
      {
        id: 'step-5',
        title: 'Add Message Persistence',
        description: 'Store recent messages for new users joining rooms',
        explanation: 'Use Redis or similar cache to store the last 50 messages per room. When users join a room, send them recent message history so they have context.',
        visualHighlights: ['message-cache'],
        keyPoints: [
          'Store limited message history (last 50 messages)',
          'Send history when user joins room',
          'Use cache for fast access',
          'Clean up old messages automatically'
        ]
      }
    ],
    
    annotations: [
      {
        id: 'server-annotation',
        componentId: 'chat-server',
        position: { x: 200, y: 130 },
        type: 'explanation',
        title: 'WebSocket Chat Server',
        content: 'Maintains persistent connections with all chat clients. Handles message routing, user presence, and room management.',
        importance: 'high',
        relatedConcepts: ['WebSockets', 'Real-time communication', 'Connection management']
      },
      {
        id: 'cache-annotation',
        componentId: 'message-cache',
        position: { x: 400, y: 130 },
        type: 'explanation',
        title: 'Message History Cache',
        content: 'Stores recent messages for each room. Allows new users to see conversation context when they join.',
        importance: 'medium',
        relatedConcepts: ['Caching', 'Message persistence', 'User experience']
      }
    ],
    
    patternExplanations: [
      {
        patternName: 'Real-time WebSocket Architecture',
        when: 'When you need instant bidirectional communication between client and server.',
        why: 'HTTP is request-response only. WebSockets allow server to push data to clients instantly without polling.',
        how: 'Establish persistent WebSocket connections. Server maintains connection pool and broadcasts messages to relevant clients.',
        tradeoffs: {
          pros: [
            'Very low latency communication',
            'Efficient for high-frequency updates',
            'Full-duplex communication',
            'Lower server load than HTTP polling'
          ],
          cons: [
            'More complex connection management',
            'Harder to scale than stateless HTTP',
            'Need to handle connection drops',
            'Firewalls sometimes block WebSockets'
          ]
        },
        alternatives: [
          'HTTP Server-Sent Events (one-way only)',
          'HTTP long polling (higher latency)',
          'WebRTC (peer-to-peer, more complex)'
        ],
        realWorldExamples: [
          'Slack and Discord chat',
          'Google Docs collaborative editing',
          'Trading platforms with live prices',
          'Multiplayer game communications'
        ],
        scalingConsiderations: [
          'Use Redis pub/sub for multi-server scaling',
          'Load balance WebSocket connections carefully',
          'Consider connection limits per server',
          'Implement reconnection logic in clients'
        ]
      }
    ]
  },
  
  hints: [
    {
      level: 'subtle',
      content: 'Think about how messages need to appear instantly for all users in a room.',
      triggeredAfter: 60
    },
    {
      level: 'moderate',
      content: 'Regular HTTP requests are too slow for real-time chat. What technology allows instant two-way communication?',
      triggeredAfter: 180
    },
    {
      level: 'explicit',
      content: 'WebSockets create persistent connections that allow the server to push messages to clients instantly.',
      triggeredAfter: 300
    }
  ],
  
  commonPitfalls: [
    'Using HTTP polling instead of WebSockets',
    'Not handling user disconnections properly',
    'Forgetting to limit message history storage',
    'Not implementing room-based message routing',
    'Ignoring connection scaling limits'
  ],
  
  extensionChallenges: [
    'Add private direct messaging between users',
    'Implement message encryption for security',
    'Add file sharing capabilities',
    'Scale to 1000 concurrent users',
    'Add message reactions and replies'
  ],
  
  relatedQuestions: [
    'url-shortener-basic',
    'photo-sharing-basic'
  ],
  
  tags: ['real-time', 'websockets', 'chat', 'beginner'],
  author: 'InfraGeni Education Team',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  rating: 4.3,
  completionCount: 89
};

/**
 * Export the complete question library
 */
export const questionLibrary: DesignQuestion[] = [
  urlShortenerQuestion,
  chatApplicationQuestion
  // More questions will be added here
];

/**
 * Helper functions for question management
 */
export const getQuestionsByDifficulty = (difficulty: DifficultyLevel): DesignQuestion[] => {
  return questionLibrary.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByCategory = (category: QuestionCategory): DesignQuestion[] => {
  return questionLibrary.filter(q => q.category === category);
};

export const getQuestionById = (id: string): DesignQuestion | undefined => {
  return questionLibrary.find(q => q.id === id);
};

export const getRelatedQuestions = (questionId: string): DesignQuestion[] => {
  const question = getQuestionById(questionId);
  if (!question) return [];
  
  return questionLibrary.filter(q => 
    question.relatedQuestions.includes(q.id) || 
    q.relatedQuestions.includes(questionId)
  );
};

export const searchQuestions = (query: string): DesignQuestion[] => {
  const lowerQuery = query.toLowerCase();
  return questionLibrary.filter(q => 
    q.title.toLowerCase().includes(lowerQuery) ||
    q.description.toLowerCase().includes(lowerQuery) ||
    q.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};