# GlobaLens AI - Development Guide

## 🚀 Quick Start

### Option 1: One-Command Development Setup
```bash
./start-dev.sh
```
This script will automatically:
- Start the FastAPI backend on `http://localhost:8000`
- Start the Next.js frontend on `http://localhost:3000`
- Handle all dependencies and virtual environments

### Option 2: Docker Compose (Full Stack)
```bash
docker-compose up --build
```

### Option 3: Manual Setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

#### Frontend Setup (in new terminal)
```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🔗 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health

## 🧪 Testing

### Backend Testing
```bash
cd backend
source venv/bin/activate
python test_simple.py
```

### Frontend Testing
The frontend includes TanStack Query DevTools accessible at:
http://localhost:3000 (check the bottom-left corner)

### API Testing with Postman
Import the collection: `docs/GlobaLens_AI_Backend.postman_collection.json`

## 🔧 Development Workflow

1. **Start Services**: Use `./start-dev.sh` for development
2. **Code Changes**: Both frontend and backend support hot reload
3. **API Changes**: Check Swagger docs for updated endpoints
4. **Database**: SQLite file is auto-created in `backend/globalens.db`
5. **Logs**: Check terminal output for both services

## 📁 Project Structure

```
GlobaLens-AI/
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   ├── tests/           # Test files
│   ├── requirements.txt # Python dependencies
│   └── run.py          # Entry point
├── frontend/            # Next.js frontend
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── package.json    # Node dependencies
├── docs/               # Documentation
├── docker-compose.yml  # Docker orchestration
└── start-dev.sh       # Development script
```

## 🌐 Environment Variables

### Backend (.env in backend/)
```bash
DATABASE_URL=sqlite:///./globalens.db
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
SMYTHOS_API_KEY=your-smythos-key
```

### Frontend (.env.local in frontend/)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 in use**: Kill existing processes or change port in `run.py`
- **Module not found**: Ensure virtual environment is activated
- **Database errors**: Delete `globalens.db` to reset

### Frontend Issues
- **Port 3000 in use**: Change port with `npm run dev -- -p 3001`
- **Build errors**: Delete `.next` folder and `node_modules`, then reinstall
- **API connection**: Verify backend is running and CORS is configured

### Common Solutions
```bash
# Reset backend
cd backend && rm -rf venv globalens.db && python3 -m venv venv

# Reset frontend
cd frontend && rm -rf .next node_modules && npm install

# Check running processes
lsof -i :3000
lsof -i :8000
```

## 📱 Mobile Development

The frontend is fully responsive. Test on:
- Chrome DevTools device emulation
- Real mobile devices on same network: `http://[your-ip]:3000`

## 🚀 Production Deployment

### Frontend (Vercel - Recommended)
```bash
cd frontend
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
# Follow platform-specific deployment guides
```

### Full Stack (Docker)
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔒 Security Notes

- Change default secret keys in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Configure proper CORS origins

## 🎯 Performance Tips

- Backend: Use `uvicorn --workers 4` for production
- Frontend: Enable Next.js optimizations in `next.config.ts`
- Database: Consider PostgreSQL for production
- Caching: TanStack Query handles frontend caching

## 📊 Monitoring

### Development
- FastAPI: Built-in request logging
- Next.js: Built-in performance metrics
- React Query DevTools: Query debugging

### Production
- Add logging middleware
- Set up error tracking (Sentry)
- Monitor API performance
- Track user analytics

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes in respective directories
3. Test both frontend and backend
4. Update documentation as needed
5. Submit pull request

## 📞 Support

For development issues:
1. Check logs in terminal
2. Verify all services are running
3. Test API endpoints in Swagger UI
4. Check browser console for frontend errors
5. Review this troubleshooting guide
