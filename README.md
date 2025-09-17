# 🧩 Crossword Puzzle Game

A modern, interactive crossword puzzle game built with HTML, CSS, and JavaScript. Test your knowledge across different subjects with varying difficulty levels!

## ✨ Features

### 🎮 Game Flow
- **Start Screen**: Welcome interface with game introduction
- **User Registration**: Enter your name to personalize the experience
- **Subject Selection**: Choose from 6 different subjects:
  - Data Structure & Algorithm
  - Fundamental Data Science
  - Engineering Economy
  - Industrial Management
  - Applied Life Skills
  - Environmental Science
- **Difficulty Levels**: Three challenge levels:
  - Easy: Perfect for beginners
  - Moderate: For experienced players
  - Hard: Ultimate challenge
- **Game Screen**: Interactive crossword puzzle with real-time feedback
- **Score Screen**: Results with detailed statistics

### 🎯 Core Features
- **Dynamic Crossword Generation**: Puzzles are generated based on subject and difficulty
- **Interactive Grid**: Click and type to fill in answers
- **Keyboard Navigation**: Use arrow keys to move between cells
- **Real-time Timer**: Track your solving time
- **Hint System**: Get help when stuck
- **Answer Validation**: Check your answers with visual feedback
- **Score Calculation**: Percentage-based scoring system

### 🎨 Design Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with persistent preference
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: Keyboard navigation and screen reader friendly
- **Smooth Transitions**: Beautiful animations between screens

### 🏆 Additional Features
- **Leaderboard**: Local storage-based score tracking
- **Pause/Resume**: Pause the game anytime
- **Sound Toggle**: Mute/unmute sound effects
- **Play Again**: Quick restart functionality
- **Progress Tracking**: Save and view your best scores

## 🚀 How to Play

1. **Start the Game**: Click "Start Game" on the welcome screen
2. **Enter Your Name**: Provide your name for personalization
3. **Choose Subject**: Select from 6 available subjects
4. **Select Difficulty**: Pick your challenge level
5. **Solve the Puzzle**: 
   - Click on any cell to start typing
   - Use arrow keys to navigate
   - Click on clues to jump to their starting position
   - Use the hint button if you need help
6. **Check Answers**: Click "Check Answers" when finished
7. **View Results**: See your score and time taken
8. **Play Again**: Try different subjects or difficulties

## 🎮 Controls

### Mouse
- **Click**: Select cells and clues
- **Type**: Enter letters in selected cells

### Keyboard
- **Arrow Keys**: Navigate between cells
- **Backspace**: Delete and move to previous cell
- **Tab**: Move to next cell
- **Enter**: Submit answers

## 📱 Responsive Design

The game is fully responsive and works on:
- **Desktop**: Full-featured experience with side-by-side layout
- **Tablet**: Optimized touch interface
- **Mobile**: Single-column layout with touch-friendly controls

## 🎨 Theme System

- **Light Theme**: Clean, bright interface (default)
- **Dark Theme**: Easy on the eyes for low-light environments
- **Persistent**: Your theme preference is saved locally

## 💾 Data Storage

The game uses browser localStorage to save:
- Theme preference
- Leaderboard scores
- Game progress (if implemented)

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Object-oriented programming with classes
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Typography (Poppins)

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### File Structure
```
crossword-game/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript game logic
└── README.md           # This file
```

## 🎯 Game Mechanics

### Scoring System
- **100%**: All answers correct
- **Partial Credit**: Percentage based on correct answers
- **Time Bonus**: Faster completion times (future feature)

### Difficulty Levels
- **Easy**: 4-6 letter words, simple clues
- **Moderate**: 6-9 letter words, intermediate clues
- **Hard**: 10+ letter words, challenging clues

### Subject Categories
Each subject contains relevant vocabulary and concepts:
- **Data Structure, Algorithm**: Data analysis, algorithms, machine learning
- **Fundamental Data Science**: Core principles and basic concepts
- **Engineering Economy**: Cost analysis, economic principles
- **Industrial Management**: Team management, leadership
- **Applied Life Skills**: Communication, problem solving
- **Environmental Science**: Ecology, sustainability

## 🔧 Customization

### Adding New Puzzles
To add new crossword puzzles, modify the `getPuzzleData()` method in `script.js`:

```javascript
const newPuzzle = {
    grid: [['A', 'B', 'C'], ['D', '', ''], ['E', '', '']],
    words: ['ABC', 'ADE'],
    clues: {
        across: [{ number: 1, clue: 'First three letters', word: 'ABC' }],
        down: [{ number: 1, clue: 'First letter of each row', word: 'ADE' }]
    }
};
```

### Styling Customization
Modify CSS variables in `styles.css` to change colors and styling:

```css
:root {
    --primary-color: #6366f1;
    --bg-primary: #ffffff;
    --text-primary: #1e293b;
    /* ... more variables */
}
```

## 🚀 Getting Started

1. **Download**: Clone or download the project files
2. **Open**: Open `index.html` in your web browser
3. **Play**: Start playing immediately - no installation required!

## 📝 Future Enhancements

- [ ] Sound effects and background music
- [ ] More puzzle categories
- [ ] Online multiplayer mode
- [ ] Puzzle sharing functionality
- [ ] Advanced hint system
- [ ] Achievement system
- [ ] Export/import game progress
- [ ] Accessibility improvements

## 🤝 Contributing

Feel free to contribute to this project by:
- Adding new puzzle categories
- Improving the UI/UX
- Adding new features
- Fixing bugs
- Improving accessibility

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Enjoy Playing!

Have fun solving crossword puzzles and testing your knowledge across different subjects! The game is designed to be both educational and entertaining, perfect for students, teachers, and puzzle enthusiasts.

---

**Built with ❤️ using HTML, CSS, and JavaScript** 