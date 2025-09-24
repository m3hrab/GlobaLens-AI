# GlobaLens AI Backend

A robust, production-ready FastAPI backend for global supply chain risk monitoring using SmythOS agents.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   FastAPI        │    │   SmythOS       │
│   (Next.js)     │◄──►│   Backend        │◄──►│   Agents        │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   SQLite         │
                       │   Database       │
                       │                  │
                       └──────────────────┘
```

## 🚀 Features

- **JWT Authentication** - Secure user registration and login
- **Agent Integration** - Seamless integration with SmythOS risk monitoring and action plan agents
- **Asynchronous Processing** - Background tasks for agent communication
- **RESTful API** - Clean, documented endpoints with OpenAPI/Swagger
- **Database Models** - Normalized SQLite schema with relationships
- **Docker Support** - Containerized for easy deployment
- **Error Handling** - Comprehensive error handling and validation
- **CORS Enabled** - Ready for frontend integration

## 📊 Database Schema (ER Diagram)

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ password_hash   │
│ is_active       │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    queries      │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ question        │
│ route_data      │
│ status          │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    reports      │
├─────────────────┤
│ id (PK)         │
│ query_id (FK)   │
│ report_type     │
│ json_report     │
│ confidence_score│
│ processing_time │
│ agent_version   │
│ generated_at    │
└─────────────────┘
```

## 🛠️ Installation & Setup

### Local Development

1. **Clone the repository**
   ```bash
   cd backend/
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the API**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Query Management
- `POST /api/v1/query/` - Create new risk analysis query
- `GET /api/v1/query/{query_id}` - Get specific query
- `GET /api/v1/query/` - Get user query history (paginated)

### Reports
- `GET /api/v1/report/{query_id}/risk-analysis` - Get risk analysis report
- `POST /api/v1/report/{query_id}/action-plan` - Generate action plan
- `GET /api/v1/report/{query_id}/action-plan` - Get action plan report
- `GET /api/v1/report/{query_id}/reports` - Get all reports for a query

### Health & Status
- `GET /` - Basic health check
- `GET /health` - Detailed health check

## 🔄 Data Flow

1. **User Authentication**
   ```
   Frontend → POST /auth/signup → JWT Token
   Frontend → POST /auth/login → JWT Token
   ```

2. **Risk Analysis Workflow**
   ```
   Frontend → POST /query/ → Background Task → SmythOS Web-Risk-Monitor
   Frontend → GET /query/{id} → Query Status
   Frontend → GET /report/{id}/risk-analysis → Risk Report
   ```

3. **Action Plan Generation**
   ```
   Frontend → POST /report/{id}/action-plan → Background Task → SmythOS Action-Plan-Agent
   Frontend → GET /report/{id}/action-plan → Action Plan
   ```

## 🔧 Configuration

Environment variables (set in `.env` or docker-compose.yml):

```env
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./globallens.db
WEB_RISK_MONITOR_URL=https://cmfwyngz91sn8o3wt46vmu9sp.agent.a.smyth.ai/api/analyze_route_risks
ACTION_PLAN_AGENT_URL=https://cmfxk1sby3663o3wtnuunk659.agent.a.smyth.ai/api/generate_action_plan
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📋 SmythOS Agent Integration

### Web-Risk-Monitor Agent
- **Endpoint**: `POST /api/analyze_route_risks`
- **Input**: `{"question": "string"}`
- **Output**: Structured risk analysis JSON with route info, risks, and sources

### Action Plan Agent
- **Endpoint**: `POST /api/generate_action_plan`
- **Input**: Risk analysis JSON from Web-Risk-Monitor
- **Output**: Prioritized action plan with mitigation strategies

## 🧪 Testing

Run the application and test endpoints:

```bash
# Health check
curl http://localhost:8000/health

# User registration
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "testpass123"}'

# Create query
curl -X POST http://localhost:8000/api/v1/query/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the risks for shipping from Shanghai to Los Angeles?"}'
```

## 📊 Performance & Production Considerations

- **Async Processing**: Agent calls run in background tasks to avoid blocking requests
- **Connection Pooling**: SQLAlchemy connection management
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Input Validation**: Pydantic schemas for request/response validation
- **Security**: JWT tokens, password hashing, CORS configuration
- **Monitoring**: Health check endpoints for container orchestration
- **Scalability**: Stateless design ready for horizontal scaling

## 🔍 Development Notes

- **Code Quality**: Modular architecture with clear separation of concerns
- **Type Hints**: Full type annotation for better IDE support
- **Documentation**: Comprehensive docstrings and API documentation
- **Standards**: Follows REST API best practices and FastAPI conventions
- **Frontend Ready**: JSON responses optimized for visualization components

## 🚀 Deployment

The application is fully containerized and ready for deployment to:
- Local development (docker-compose)
- Cloud platforms (AWS ECS, Google Cloud Run, Azure Container Instances)
- Kubernetes clusters
- Traditional VPS with Docker

For production, consider:
- Using PostgreSQL instead of SQLite for better concurrency
- Adding Redis for caching and session storage
- Implementing rate limiting and API versioning
- Setting up proper logging and monitoring
- Using a reverse proxy (nginx) for SSL termination
