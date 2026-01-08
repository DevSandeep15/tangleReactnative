# Tangle - React Native Project Structure

## 📁 Project Structure

```
Tangle/
├── src/
│   ├── screens/              # Screen components
│   │   ├── Home/
│   │   │   └── HomeScreen.tsx
│   │   ├── Service/
│   │   │   └── ServiceScreen.tsx
│   │   ├── Add/
│   │   │   └── AddScreen.tsx
│   │   ├── Hub/
│   │   │   └── HubScreen.tsx
│   │   └── Profile/
│   │       └── ProfileScreen.tsx
│   │
│   ├── components/           # Reusable components
│   │   └── common/
│   │       └── Button.tsx
│   │
│   ├── navigation/           # Navigation setup
│   │   ├── BottomTabNavigator.tsx
│   │   └── types.ts
│   │
│   ├── assets/              # Static assets
│   │   ├── icons/           # Tab icons (add your PNG icons here)
│   │   ├── images/          # App images
│   │   └── fonts/           # Custom fonts
│   │
│   ├── constants/           # App constants
│   │   ├── colors.ts        # Color palette
│   │   └── theme.ts         # Theme configuration
│   │
│   ├── utils/              # Utility functions
│   │   └── helpers.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │
│   ├── services/           # API services
│   │   └── api.ts
│   │
│   └── types/             # TypeScript types
│       └── index.ts
│
├── App.tsx                # Main app entry point
└── package.json
```

## 🚀 Features

- ✅ **Bottom Tab Navigation** with 5 tabs (Home, Service, Add, Hub, Profile)
- ✅ **TypeScript** for type safety
- ✅ **Organized folder structure** following React Native best practices
- ✅ **Theme system** with colors and spacing constants
- ✅ **Reusable components** in the components folder
- ✅ **Navigation types** for type-safe navigation
- ✅ **Image-based tab icons** (add your icons to `src/assets/icons/`)

## 📱 Bottom Tabs

1. **Home** - Main dashboard/home screen
2. **Service** - Services listing screen
3. **Add** - Create/Add new items screen
4. **Hub** - Central hub screen
5. **Profile** - User profile screen

## 🎨 Adding Tab Icons

To add custom icons for your tabs:

1. Create or download 5 icon images (PNG format recommended)
2. Place them in `src/assets/icons/` with these names:
   - `home.png`
   - `service.png`
   - `add.png`
   - `hub.png`
   - `profile.png`

3. Update `src/navigation/BottomTabNavigator.tsx` to use your icons:

```typescript
const getIconSource = () => {
  switch (iconName) {
    case 'home':
      return require('../assets/icons/home.png');
    case 'service':
      return require('../assets/icons/service.png');
    case 'add':
      return require('../assets/icons/add.png');
    case 'hub':
      return require('../assets/icons/hub.png');
    case 'profile':
      return require('../assets/icons/profile.png');
    default:
      return null;
  }
};
```

## 🛠️ Development

```bash
# Install dependencies
yarn install

# Run on Android
yarn android

# Run on iOS
yarn ios

# Start Metro bundler
yarn start
```

## 📝 Next Steps

1. Add your custom tab icons to `src/assets/icons/`
2. Customize the screen content in each screen component
3. Add more reusable components to `src/components/`
4. Set up API integration in `src/services/api.ts`
5. Add custom hooks in `src/hooks/`
6. Customize colors and theme in `src/constants/`

## 🎯 Tips

- Keep components small and focused
- Use TypeScript types for better code quality
- Follow the established folder structure
- Reuse components from `src/components/common/`
- Use the theme constants for consistent styling
