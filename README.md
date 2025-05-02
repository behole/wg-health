# Mom's Microsite

A personalized web application designed for my mom with early-onset dementia.

## Features

- Daily greeting with date and weather information
- Daily inspirational quotes that change every 24 hours
- Simple appointment and task management
- Family photo gallery
- Entertainment tracking (Books, TV Shows)
- Meal ideas and medication tracking
- Admin panel for family members to manage content

## Technical Features

- React.js with Next.js framework
- Responsive design using Tailwind CSS
- Firebase Firestore database for data persistence
- OpenWeatherMap API integration

## Setup and Development

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`:
   ```
   # OpenWeatherMap API Key - get from https://openweathermap.org/api
   OPENWEATHER_API_KEY=your_api_key_here
   
   # Default zip code for weather
   DEFAULT_WEATHER_ZIP=92054
   ```
3. Run development server: `npm run dev`
4. Deploy Firestore rules: `node deploy-rules.js`

## Firebase Integration

This project uses Firebase Firestore for database functionality:

- Book tracking
- TV and movie watchlist
- Meal ideas catalog
- Medication tracking

To work with Firebase:
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore database
3. Update the Firebase configuration in `lib/firebase.js`

## Project Structure

The project follows a feature-based organization to make maintenance straightforward:

- `/app` - Next.js app router pages and API routes
- `/components` - React components organized by feature
- `/lib` - Utility functions and services
- `/hooks` - Custom React hooks
- `/styles` - Global CSS styles
- `/public` - Static assets
# BoomPlan
# wg-health
