# 🏫 School Simulator - Educational Game for Kids

A fun, interactive educational game for iPad that makes learning exciting! Kids can enter a virtual school, choose subjects, play educational games, and collect stickers as rewards.

## 📱 Features

- **School Entrance**: Interactive school building with animated door
- **Locker System**: Personal locker with colorful subject books
- **Educational Games**:
  - 🔢 **Math**: Addition and subtraction practice
  - 📚 **Reading**: Word matching and spelling
  - 🔬 **Science**: Fun quiz questions
- **Sticker Rewards**: Earn stickers for completing games
- **Progress Tracking**: Daily progress monitoring
- **Kid-Friendly UI**: Bright colors and simple navigation
- **iPad Optimized**: Portrait orientation, responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your iPad ([Download from App Store](https://apps.apple.com/us/app/expo-go/id982107779))

### Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Scan the QR code with your iPad using the Expo Go app

## 🎮 How to Play

1. **Enter School**: Tap the school door on the entrance screen
2. **Choose Subject**: In your locker, tap any subject book to start a game
3. **Play Game**: Answer questions to earn points
4. **Collect Stickers**: Complete games to earn fun stickers
5. **Track Progress**: Check your daily progress in the locker

## 📂 Project Structure

```
school-simulator/
├── app/
│   ├── index.tsx          # School entrance screen
│   ├── locker.tsx         # Locker with subject books
│   ├── _layout.tsx        # Navigation setup
│   └── games/
│       ├── math.tsx       # Math game
│       ├── reading.tsx    # Reading game
│       └── science.tsx    # Science game
├── contexts/
│   └── progress-context.tsx  # State management for progress
└── assets/                # Images and icons
```

## 🛠 Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe code
- **Expo Router**: File-based navigation
- **AsyncStorage**: Local data persistence

## 📊 Game Details

### Math Game
- Addition and subtraction problems
- Numbers 1-20 for addition
- Numbers up to 20 for subtraction
- 5 questions per game
- Multiple choice answers

### Reading Game
- Word-to-picture matching
- Simple 3-4 letter words
- Visual emoji representations
- 5 questions per game

### Science Game
- Age-appropriate quiz questions
- Topics: plants, animals, nature
- Fun emoji visuals
- 5 questions per game

## 🔧 Development

### Adding New Games

To add a new subject/game:

1. Create a new game file in `app/games/[subject].tsx`
2. Add the subject to the `Subject` type in `contexts/progress-context.tsx`
3. Add a book entry in `locker.tsx` BOOKS array
4. Add the route in `app/_layout.tsx`

### Customization

- **Colors**: Each game has its own color scheme in the styles
- **Questions**: Modify the question arrays in each game file
- **Stickers**: Update STICKERS arrays to change reward emojis
- **Difficulty**: Adjust number ranges in math.tsx or add more complex questions

## 📱 Testing on iPad

1. Install Expo Go on your iPad
2. Start the dev server with `npm start`
3. Scan the QR code with the iPad camera
4. The app will open in Expo Go

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and add your own educational games and features!

## 📧 Support

For issues or questions, please open an issue in the GitHub repository.
