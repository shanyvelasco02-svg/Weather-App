# Weather Forecast App

A modern, responsive weather web application built with vanilla HTML, CSS, and JavaScript.

## Features

- 🌍 **City Search** - Search for weather by city name with Enter key support
- 📍 **Current Location** - Get weather for your current location using Geolocation API
- 🌗 **Light/Dark Mode** - Beautiful toggle switch with moon/sun icons (persisted in localStorage)
- 🕒 **Recent Searches** - Quick access to your last 5 searched cities with remove functionality
- 🎨 **Dynamic Backgrounds** - Background changes based on weather conditions
- 🌡️ **Temperature Colors** - Visual temperature indicators (cold/normal/warm/hot)
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- ✨ **Smooth Animations** - Micro-interactions and transitions throughout

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Copy your API key

### 2. Configure API Key

1. Open `script.js`
2. Find the line: `const API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   const API_KEY = 'your-actual-api-key-here';
   ```

**Note:** The app includes Font Awesome icons via CDN for the theme toggle.

### 3. Run the App

Simply open `index.html` in your web browser. No build process or server required!

## File Structure

```
weather-app/
├── index.html          # Main HTML structure
├── style.css           # All styling and themes
├── script.js           # Weather API integration and functionality
├── assets/
│   └── icons/
│       └── ICONS.md    # Icons documentation
└── README.md           # This file
```

## Usage

1. **Search by City**: Type a city name in the search bar and press Enter or click the search button
2. **Current Location**: Click "Current Location" to get weather for your current position
3. **Recent Searches**: 
   - Click any city pill in the recent searches section to quickly view its weather
   - Click the ❌ button on any pill to remove it from the list
   - Maximum of 5 recent searches are stored
4. **Toggle Theme**: Click the theme toggle switch (top right) with moon/sun icons to switch between light and dark modes

## Weather Information Displayed

- City name and country
- Current date
- Temperature (°C) with color coding
- Weather description
- Weather icon
- Humidity (with animated progress bar)
- Wind speed (km/h)
- Feels like temperature
- Visibility (km)
- Air pressure (hPa)

## Browser Compatibility

Works on all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- Geolocation API
- LocalStorage API
- Fetch API

## Notes

- The app uses emoji icons for weather conditions (no external image files needed)
- All data is fetched from OpenWeatherMap API
- Recent searches and theme preference are stored in browser localStorage
- Cities are only saved to recent searches after a successful API response
- Font Awesome icons are loaded via CDN for the theme toggle
- No build process or external frameworks required

## License

Free to use and modify.

