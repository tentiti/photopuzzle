# 사진퍼즐 / Photo Puzzle

A Progressive Web App (PWA) that lets users upload photos, create puzzles, and solve them by shaking their phone.

## Features

- 📸 **Photo Upload**: Drag & drop or tap to upload images
- 🎯 **Multiple Difficulties**: Easy (3x3), Medium (4x4), Hard (5x5)
- 📱 **Shake to Shuffle**: Shake your phone to randomize the puzzle
- 🏆 **Progress Tracking**: Move counter and timer
- 🎉 **Victory Celebration**: Confetti animation and sharing
- 🔒 **Privacy First**: Photos are processed locally, never saved to server
- 🌐 **Bilingual**: Korean and English support
- 📱 **PWA Ready**: Install as a native app

## How to Play

1. Upload a photo by tapping the upload area or dragging an image
2. Choose difficulty level (Easy/Medium/Hard)
3. Start the puzzle - it begins assembled
4. Shake your phone or tap "Shake to Shuffle" to randomize
5. Tap adjacent pieces to move them and solve the puzzle
6. Complete the puzzle to see confetti and share your results!

## Technical Details

- **No Backend Required**: Everything runs in the browser
- **Local Processing**: Images are processed client-side only
- **Offline Support**: Works without internet connection
- **Mobile Optimized**: Touch-friendly interface
- **PWA Features**: Installable, offline-capable, app-like experience

## Setup

1. Clone or download the files
2. Open `index.html` in a web browser
3. For PWA features, serve via HTTPS (required for service worker)

## Browser Support

- Chrome/Edge (recommended for PWA features)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Privacy

- All photos are processed locally in your browser
- No images are uploaded to any server
- No personal data is collected or stored

## Icons

**Note**: You'll need to create app icons for the PWA to work properly. The app expects icons in the `icons/` directory with the following sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

You can create a simple puzzle piece icon or use any image editing tool to generate these sizes.

## License

This project is open source and available under the MIT License. 