# DailyXP

DailyXP is a gamified productivity tracker built with React Native using Expo and Supabase. Tasks, quests and achievements are managed via Supabase, while Expo Router handles navigation across the app.

## Directory structure

```
.
├── android
├── app
├── app.config.js
├── app.json
├── assets
├── components
├── constants
├── contexts
├── eas.json
├── hooks
├── ios
├── lib
├── package-lock.json
├── package.json
├── supabase
├── tsconfig.json
└── types

12 directories, 6 files
```

- `app` - screens and navigation using Expo Router
- `components` - shared UI components
- `constants` - theme and configuration constants
- `contexts` - React contexts for auth, theme and user state
- `hooks` - custom React hooks for fetching quests, tasks and more
- `lib` - utilities including the Supabase client
- `supabase` - database migrations
- `android` and `ios` - native project files
- `assets` - images and static assets
- `types` - TypeScript type definitions

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with your Supabase credentials:

```bash
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These values are loaded in `app.config.js` and used by the Supabase client.

## Development

Start the Expo dev server:

```bash
npm run dev
```

You can also run the app directly on Android or iOS simulators:

```bash
npm run android
npm run ios
```

## Build scripts

- `npm run build:web` - export a production web build
- `npm run lint` - run Expo linting

Enjoy leveling up your daily tasks!
