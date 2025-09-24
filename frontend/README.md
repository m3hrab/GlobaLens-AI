# GlobaLens AI Frontend

A modern, responsive Next.js frontend for the GlobaLens AI supply chain risk monitoring platform.

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Powerful data fetching and caching
- **Axios** - HTTP client for API communication
- **Lucide React** - Modern icon library

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── history/           # Query history page
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
│   ├── forms/             # Form components
│   ├── Navbar.tsx         # Navigation bar
│   ├── ProtectedRoute.tsx # Route protection
│   └── QueryProvider.tsx  # React Query setup
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state
├── hooks/                 # Custom hooks
│   ├── useAuth.ts         # Authentication hooks
│   └── useQueries.ts      # API query hooks
├── lib/                   # Utilities and configurations
│   ├── api.ts             # API client and endpoints
│   └── auth.ts            # Authentication utilities
└── types/                 # TypeScript type definitions
    ├── auth.ts            # Auth-related types
    └── api.ts             # API response types
```

## 🛠️ Features

### Authentication
- **Signup/Login** - User registration and authentication
- **JWT Token Management** - Secure token storage and refresh
- **Protected Routes** - Automatic redirection for unauthenticated users
- **Persistent Sessions** - Remember user login state

### Dashboard
- **Risk Query Submission** - Submit supply chain risk analysis requests
- **Real-time Status** - Track query processing status
- **Quick Stats** - Overview of user's query history
- **Recent Reports** - Preview of latest risk analyses

### History Management
- **Paginated History** - Browse all submitted queries
- **Detailed Reports** - View complete risk analysis results
- **Status Tracking** - Monitor query processing progress
- **Search & Filter** - Find specific reports quickly

### User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Loading States** - Clear feedback during API calls
- **Error Handling** - Graceful error messages and recovery
- **Optimistic Updates** - Immediate UI feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:8000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### API Integration

The frontend communicates with the FastAPI backend through:

- **Authentication**: `/api/v1/auth/` endpoints
- **Query Management**: `/api/v1/query/` endpoints  
- **Risk Reports**: `/api/v1/report/` endpoints

All API calls include:
- Automatic JWT token attachment
- Error handling and retry logic
- Response caching with TanStack Query
- Optimistic updates for better UX

### State Management

- **Authentication State**: React Context + localStorage
- **Server State**: TanStack Query for caching and synchronization
- **Form State**: React Hook Form for form management
- **UI State**: React useState/useReducer

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Blue primary, semantic colors for status
- **Typography**: Inter font family for readability
- **Spacing**: Consistent 8px grid system
- **Shadows**: Subtle shadows for depth

### Components
- **Responsive Navigation** - Collapsible mobile menu
- **Form Validation** - Real-time client-side validation
- **Loading Spinners** - Consistent loading indicators
- **Status Badges** - Color-coded query status indicators
- **Modal Dialogs** - Accessible modal components

### Accessibility
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - Semantic HTML and ARIA labels
- **Color Contrast** - WCAG compliant color combinations
- **Focus Management** - Clear focus indicators

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

Update `.env.local` for production:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Deployment Options

1. **Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Docker**
   ```bash
   docker build -t globalens-frontend .
   docker run -p 3000:3000 globalens-frontend
   ```

3. **Static Export**
   ```bash
   npm run build
   npm run export
   ```

## 🔗 Integration with Backend

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- Your production domain

### API Authentication
- All protected endpoints require `Authorization: Bearer <token>`
- Tokens are automatically attached by the API client
- Token refresh is handled automatically

### Error Handling
- 401 responses trigger automatic logout
- Network errors show user-friendly messages
- Retry logic for transient failures

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Dashboard query submission
- [ ] History page navigation
- [ ] Responsive design on mobile
- [ ] Error handling scenarios
- [ ] Token expiration handling

### API Testing
Use the provided Postman collection to test backend integration:
```
docs/GlobaLens_AI_Backend.postman_collection.json
```

## 📱 Mobile Responsiveness

The frontend is fully responsive with:
- **Mobile-first design** - Optimized for small screens
- **Touch-friendly** - Appropriate touch targets
- **Fast loading** - Optimized images and code splitting
- **Offline support** - Basic offline functionality

## 🎯 Performance

### Optimization Features
- **Code splitting** - Automatic route-based splitting
- **Image optimization** - Next.js built-in optimization
- **Bundle analysis** - Webpack bundle analyzer
- **Caching** - Aggressive caching with TanStack Query

### Lighthouse Scores
Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Test responsive design on multiple devices
4. Update documentation for new features
5. Ensure accessibility compliance

## 📄 License

Built for HackTheAI 2025 by Team BUBT_Droptouts.