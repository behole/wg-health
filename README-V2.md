# Plan'd v2 - Modern Family Planning App

> **Version 2.0** - A complete rebuild with modern architecture, TypeScript, and enhanced security.

## 🚀 What's New in v2

### ✅ Architecture Improvements
- **TypeScript**: Full type safety across the entire codebase
- **Modular Components**: Broken down large components into focused, reusable modules
- **Error Boundaries**: Comprehensive error handling and user-friendly error states
- **Performance Optimizations**: React.memo, useMemo, useCallback where needed
- **State Management**: Centralized app state with React Context and reducers

### 🔒 Security Enhancements
- **Firebase Authentication**: Proper user authentication system
- **Security Rules**: Granular Firestore security rules with role-based access
- **API Middleware**: Input validation, rate limiting, and security headers
- **Input Sanitization**: Zod schemas for API validation

### ♿ Accessibility & UX
- **ARIA Labels**: Proper semantic HTML and accessibility attributes
- **Focus Management**: Keyboard navigation and focus trapping in modals
- **Loading States**: Proper loading indicators and skeleton screens
- **Error States**: User-friendly error messages and retry mechanisms

### 🎨 UI/UX Improvements
- **Design System**: Consistent Button, Card, Modal components
- **Responsive Design**: Mobile-first approach with better touch targets
- **Theme Support**: Dark/light/auto theme system ready for implementation
- **Loading States**: Skeleton loading for better perceived performance

## 📁 Project Structure

```
mom-microsite/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes with middleware
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── weather/          # Weather-specific components
│   ├── priorities/       # Priority management
│   └── ...               # Feature-based organization
├── lib/                   # Utilities and services
│   ├── context/          # React context providers
│   ├── auth.ts           # Authentication service
│   ├── api-middleware.ts # API security & validation
│   └── firebase.js       # Firebase configuration
├── types/                 # TypeScript type definitions
└── styles/               # CSS stylesheets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18.17.0 or higher
- npm or yarn
- Firebase project with Firestore enabled

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create `.env.local` with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Security Rules
Deploy the updated security rules:
```bash
firebase deploy --only firestore:rules
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm start
```

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

## 🏗️ Key Components

### UI Components
- **Button**: Accessible button with variants, loading states
- **Card**: Flexible container with title, actions, variants
- **Modal**: Focus-trapped modal with keyboard navigation
- **ErrorBoundary**: React error boundary with fallback UI

### Feature Components
- **WeatherCard**: Weather display with error/loading states
- **PriorityItem**: Task item with priority levels and actions
- **AppProvider**: Global state management with React Context

## 🔐 Security Features

### Authentication
- Email/password authentication via Firebase Auth
- User profile management in Firestore
- Role-based access control (admin, family, user)

### API Security
- Input validation with Zod schemas
- Rate limiting (configurable)
- CORS and security headers
- Error handling middleware

### Firestore Rules
- User-specific data isolation
- Role-based permissions
- Family member access to shared data
- Admin-only system configuration

## 📱 Component Usage Examples

### Button Component
```tsx
import { Button } from '@/components/ui';

<Button 
  variant="primary" 
  size="medium" 
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Save Changes
</Button>
```

### Card Component
```tsx
import { Card } from '@/components/ui';

<Card 
  title="Weather" 
  variant="elevated"
  actions={<Button>Refresh</Button>}
>
  <WeatherData />
</Card>
```

### Using App Context
```tsx
import { useApp } from '@/lib/context/AppContext';

function MyComponent() {
  const { state, actions } = useApp();
  
  const handleLogin = async () => {
    actions.setLoading(true);
    try {
      const user = await signIn(email, password);
      actions.setUser(user);
    } catch (error) {
      actions.setError({
        code: 'LOGIN_FAILED',
        message: error.message,
        timestamp: new Date()
      });
    }
  };
}
```

## 🚀 Migration from v1

### Breaking Changes
1. **TypeScript**: All components now require proper typing
2. **Import Paths**: Updated to use `@/` aliases
3. **Props**: Components now have strict prop validation
4. **State Management**: Global state moved to React Context

### Migration Steps
1. Install new dependencies (`npm install`)
2. Update imports to use new UI components
3. Add type annotations to custom components
4. Replace direct localStorage usage with context actions
5. Update Firebase security rules
6. Test authentication flow

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic route-based splitting with Next.js
- **Component Memoization**: React.memo for expensive components
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Next.js Image component (when needed)
- **Bundle Analysis**: Built-in Next.js bundle analyzer

## 📋 Testing Strategy

### Recommended Testing Approach
1. **Unit Tests**: Test individual components with Jest/React Testing Library
2. **Integration Tests**: Test component interactions and API calls
3. **E2E Tests**: Test complete user flows with Playwright/Cypress
4. **Accessibility Tests**: Use axe-core for automated a11y testing

### Example Test Structure
```
__tests__/
├── components/
│   ├── ui/
│   │   ├── Button.test.tsx
│   │   └── Card.test.tsx
│   └── weather/
│       └── WeatherCard.test.tsx
├── lib/
│   ├── auth.test.ts
│   └── api-middleware.test.ts
└── pages/
    └── index.test.tsx
```

## 🔄 Future Enhancements

### Planned Features
- [ ] Push notifications
- [ ] Offline support with service workers
- [ ] Real-time updates with Firestore listeners
- [ ] Advanced scheduling with recurring events
- [ ] Photo upload and management
- [ ] Family member invitations
- [ ] Mobile app with React Native

### Technical Improvements
- [ ] Add comprehensive test suite
- [ ] Implement CI/CD pipeline
- [ ] Add monitoring and analytics
- [ ] Performance monitoring
- [ ] Error tracking with Sentry

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new code
3. Include error handling for all async operations
4. Test components with various props and states
5. Update documentation for new features

## 📄 License

This project is private and intended for family use only.

---

**Plan'd v2** - Built with ❤️ for better family organization