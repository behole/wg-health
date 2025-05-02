# CLAUDE.md - Agentic Coding Assistant Guide

## Build & Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Run production build
- `npm run lint` - Run ESLint checks

## Code Style Guide
- **React Components**: Use functional components with hooks, explicit prop typing
- **Imports**: Group imports as: React, external libraries, components, hooks, utils
- **State Management**: Use React hooks (useState, useEffect, custom hooks)
- **Naming Conventions**: 
  - Components: PascalCase (Button.jsx)
  - Hooks: camelCase with "use" prefix (useCalendar.js)
  - Functions: camelCase and descriptive verb prefixes (getWeatherTheme)
- **Error Handling**: Try/catch blocks with specific error messages, fallbacks for loading states
- **Styling**: Tailwind CSS utility classes

## Project Structure
- Feature-based organization (components/calendar/, hooks/useCalendar.js)
- Next.js app router with page.js files
- Shared UI components in components/ui/ directory