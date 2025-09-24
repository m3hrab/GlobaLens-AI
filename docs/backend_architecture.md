# GlobaLens AI Backend Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        GlobaLens AI System                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌──────────────────┐    ┌─────────────┐│
│  │   Frontend      │    │   FastAPI        │    │   SmythOS   ││
│  │   (Next.js)     │◄──►│   Backend        │◄──►│   Agents    ││
│  │                 │    │                  │    │             ││
│  │ • Dashboard     │    │ • Authentication │    │ • Web Risk  ││
│  │ • Risk Heatmap  │    │ • Query Mgmt     │    │   Monitor   ││
│  │ • Action Plans  │    │ • Agent Integration│  │ • Action    ││
│  │ • Export        │    │ • Report Service │    │   Plan Gen  ││
│  └─────────────────┘    └──────────────────┘    └─────────────┘│
│                                 │                               │
│                                 ▼                               │
│                        ┌──────────────────┐                     │
│                        │   SQLite         │                     │
│                        │   Database       │                     │
│                        │                  │                     │
│                        │ • Users          │                     │
│                        │ • Queries        │                     │
│                        │ • Reports        │                     │
│                        └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Database Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Database Schema                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐                                            │
│  │     users       │                                            │
│  ├─────────────────┤                                            │
│  │ 🔑 id (PK)      │                                            │
│  │ 👤 name         │                                            │
│  │ 📧 email (UNQ)  │                                            │
│  │ 🔒 password_hash│                                            │
│  │ ✅ is_active    │                                            │
│  │ 📅 created_at   │                                            │
│  │ 📅 updated_at   │                                            │
│  └─────────────────┘                                            │
│           │                                                     │
│           │ 1:N (One user has many queries)                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │    queries      │                                            │
│  ├─────────────────┤                                            │
│  │ 🔑 id (PK)      │                                            │
│  │ 🔗 user_id (FK) │                                            │
│  │ ❓ question     │                                            │
│  │ 🛣️  route_data  │                                            │
│  │ 📊 status       │                                            │
│  │ 📅 created_at   │                                            │
│  │ 📅 updated_at   │                                            │
│  └─────────────────┘                                            │
│           │                                                     │
│           │ 1:N (One query has many reports)                    │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │    reports      │                                            │
│  ├─────────────────┤                                            │
│  │ 🔑 id (PK)      │                                            │
│  │ 🔗 query_id (FK)│                                            │
│  │ 📋 report_type  │ ← "risk_analysis" | "action_plan"          │
│  │ 📄 json_report  │ ← Complete agent response                  │
│  │ 🎯 confidence   │                                            │
│  │ ⏱️  process_time │                                            │
│  │ 🏷️  agent_version│                                            │
│  │ 📅 generated_at │                                            │
│  └─────────────────┘                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow & Process Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Request Flow Diagram                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. Authentication Flow                                          │
│ ┌─────────┐   POST /auth/signup   ┌─────────┐   JWT Token      │
│ │ Client  │────────────────────────│Backend  │─────────────────►│
│ │         │◄────────────────────────│         │                 │
│ └─────────┘                       └─────────┘                 │
│                                                                 │
│ 2. Risk Analysis Flow                                           │
│ ┌─────────┐   POST /query/        ┌─────────┐                  │
│ │ Client  │────────────────────────│Backend  │                  │
│ │         │                       │         │                  │
│ │         │   Query Status        │    │    │ Background Task  │
│ │         │◄──────────────────────────│    │─────────────────┐│
│ │         │                       │    ▼    │                ││
│ │         │                       │ Database│                ││
│ │         │                       │         │                ││
│ │         │                       │         │   HTTP POST    ││
│ │         │                       │         │─────────────────┤│
│ │         │                       │         │                ││
│ │         │                       │         │◄───────────────┘│
│ │         │                       │         │ SmythOS Agent   │
│ └─────────┘                       └─────────┘ Response        │
│                                                                 │
│ 3. Action Plan Generation                                       │
│ ┌─────────┐   POST /report/       ┌─────────┐                  │
│ │ Client  │   {id}/action-plan    │Backend  │                  │
│ │         │────────────────────────│         │                  │
│ │         │                       │    │    │ Background Task  │
│ │         │   Processing Status   │    │    │─────────────────┐│
│ │         │◄──────────────────────────│    │                ││
│ │         │                       │    ▼    │                ││
│ │         │                       │ Database│                ││
│ │         │                       │         │                ││
│ │         │                       │         │   HTTP POST    ││
│ │         │                       │         │─────────────────┤│
│ │         │                       │         │                ││
│ │         │                       │         │◄───────────────┘│
│ │         │                       │         │ Action Plan     │
│ └─────────┘                       └─────────┘ Agent Response  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🧩 Module Structure

```
backend/
├── app/
│   ├── core/                 # Core configuration and utilities
│   │   ├── auth.py          # JWT authentication logic
│   │   ├── config.py        # Application settings
│   │   └── database.py      # Database configuration
│   │
│   ├── models/              # SQLAlchemy database models
│   │   ├── user.py          # User model
│   │   ├── query.py         # Query model
│   │   └── report.py        # Report model
│   │
│   ├── schemas/             # Pydantic validation schemas
│   │   ├── user.py          # User request/response schemas
│   │   ├── query.py         # Query schemas
│   │   ├── report.py        # Report schemas
│   │   └── agent.py         # SmythOS agent schemas
│   │
│   ├── services/            # Business logic layer
│   │   ├── agent_service.py # SmythOS agent integration
│   │   ├── query_service.py # Query management
│   │   └── report_service.py# Report processing
│   │
│   ├── routes/              # API route handlers
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── query.py         # Query management endpoints
│   │   └── report.py        # Report endpoints
│   │
│   ├── middleware/          # Custom middleware
│   │   └── error_handler.py # Global error handling
│   │
│   └── main.py              # FastAPI application entry point
│
├── requirements.txt         # Python dependencies
├── Dockerfile              # Container configuration
├── docker-compose.yml      # Docker composition
├── run.py                  # Development server runner
├── test_api.py             # API testing script
├── start.sh                # Quick start script
└── README.md               # Complete documentation
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Security Layers                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. Input Validation Layer                                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ • Pydantic schemas validate all input/output                │ │
│ │ • Email validation, password strength requirements          │ │
│ │ • Query length limits and content validation                │ │
│ │ • JSON schema validation for agent responses                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 2. Authentication & Authorization Layer                         │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ • JWT token-based authentication                            │ │
│ │ • Bcrypt password hashing (industry standard)               │ │
│ │ • Token expiration and refresh mechanism                    │ │
│ │ • User ownership verification for resources                 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 3. Data Protection Layer                                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ • SQLAlchemy ORM prevents SQL injection                     │ │
│ │ • Password hashing with salt                                │ │
│ │ • No sensitive data in logs or responses                    │ │
│ │ • Environment variables for secrets                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 4. Network Security Layer                                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ • CORS configuration for frontend integration               │ │
│ │ • HTTPS ready (reverse proxy configuration)                 │ │
│ │ • Rate limiting ready (can be added with middleware)        │ │
│ │ • Secure HTTP headers                                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Options                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Option 1: Local Development                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Host Machine                                                │ │
│ │ ├── Python 3.11+ Virtual Environment                       │ │
│ │ ├── SQLite Database File                                    │ │
│ │ ├── FastAPI Server (port 8000)                             │ │
│ │ └── Direct SmythOS Agent Connection                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Option 2: Docker Container                                      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Docker Container                                            │ │
│ │ ├── Python 3.11 Alpine Base                                │ │
│ │ ├── Application Code                                        │ │
│ │ ├── Dependencies Pre-installed                              │ │
│ │ ├── Health Check Endpoint                                   │ │
│ │ └── Volume Mounted Database                                 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Option 3: Cloud Production                                      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Load Balancer (nginx)                                       │ │
│ │ ├── SSL Termination                                         │ │
│ │ ├── Static File Serving                                     │ │
│ │ └── Backend Proxy                                           │ │
│ │                                                             │ │
│ │ Container Orchestration (Kubernetes/ECS)                    │ │
│ │ ├── Multiple Backend Instances                              │ │
│ │ ├── Auto-scaling                                            │ │
│ │ ├── Health Monitoring                                       │ │
│ │ └── Rolling Updates                                         │ │
│ │                                                             │ │
│ │ Database (PostgreSQL/managed service)                       │ │
│ │ ├── Connection Pooling                                      │ │
│ │ ├── Backup & Recovery                                       │ │
│ │ └── Performance Monitoring                                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📈 Performance Considerations

### Scalability Features
- **Async Processing**: Background tasks for agent calls prevent blocking
- **Connection Pooling**: SQLAlchemy manages database connections efficiently
- **Stateless Design**: Each request is independent, enabling horizontal scaling
- **JSON Caching**: Agent responses stored for quick retrieval

### Optimization Points
- **Database Indexing**: User emails and query IDs are indexed
- **Response Compression**: Gzip compression for large JSON responses
- **Lazy Loading**: Database relationships loaded on demand
- **Background Processing**: Long-running agent calls don't block API responses

### Monitoring & Observability
- **Health Check Endpoints**: `/health` for container orchestration
- **Structured Logging**: JSON logs for aggregation and analysis
- **Error Tracking**: Comprehensive exception handling
- **Performance Metrics**: Processing time tracking for agent calls

## 🔧 Configuration Management

### Environment Variables
```bash
# Security
SECRET_KEY=<strong-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///./globallens.db

# SmythOS Agents
WEB_RISK_MONITOR_URL=https://...
ACTION_PLAN_AGENT_URL=https://...

# Performance
AGENT_TIMEOUT=60
AGENT_RETRIES=3
```

### Development vs Production
- **Development**: SQLite, debug logging, CORS permissive
- **Production**: PostgreSQL, info logging, CORS restricted
- **Testing**: In-memory SQLite, verbose logging

This architecture provides a solid foundation for the GlobaLens AI hackathon project, demonstrating production-ready practices while maintaining simplicity for rapid development and deployment.
