// ===================================
// API Configuration
// ===================================
const API_KEY = '69080a7a19d0c07801e31d17a217f75f';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// ===================================
// DOM Elements
// ===================================
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const themeCheckbox = document.getElementById('themeCheckbox');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const weatherDisplay = document.getElementById('weatherDisplay');

// Weather display elements
const cityName = document.getElementById('cityName');
const date = document.getElementById('date');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const humidityFill = document.getElementById('humidityFill');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');
const recentPills = document.getElementById('recentPills');

// ===================================
// Theme Management
// ===================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeCheckbox.checked = savedTheme === 'dark';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

themeCheckbox.addEventListener('change', toggleTheme);
initTheme();

// ===================================
// Recent Searches Management
// ===================================
function getRecents() {
    const cities = localStorage.getItem('recentSearches');
    return cities ? JSON.parse(cities) : [];
}

function saveRecent(city) {
    let cities = getRecents();
    cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());
    cities.unshift(city);
    cities = cities.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(cities));
    renderRecents();
}

function removeRecent(index) {
    let cities = getRecents();
    cities.splice(index, 1);
    localStorage.setItem('recentSearches', JSON.stringify(cities));
    renderRecents();
}

function renderRecents() {
    const cities = getRecents();
    recentPills.innerHTML = '';
    
    cities.forEach((city, index) => {
        const pill = document.createElement('div');
        pill.className = 'recent-pill';
        
        const pillText = document.createElement('span');
        pillText.className = 'recent-pill-text';
        pillText.textContent = city;
        pillText.addEventListener('click', (e) => {
            e.stopPropagation();
            cityInput.value = city;
            searchWeather(city);
        });
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'recent-pill-remove';
        removeBtn.textContent = '❌';
        removeBtn.setAttribute('aria-label', 'Remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeRecent(index);
        });
        
        pill.appendChild(pillText);
        pill.appendChild(removeBtn);
        recentPills.appendChild(pill);
    });
}

// Initialize recent searches on load
renderRecents();

// ===================================
// Weather Icon Mapping
// ===================================
function getWeatherIcon(condition) {
    const iconMap = {
        'clear': '☀️',
        'clouds': '☁️',
        'rain': '🌧️',
        'drizzle': '🌦️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️',
        'fog': '🌫️',
        'haze': '🌫️',
        'dust': '🌫️',
        'sand': '🌫️',
        'ash': '🌫️',
        'squall': '💨',
        'tornado': '🌪️'
    };
    
    const conditionLower = condition.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (conditionLower.includes(key)) {
            return icon;
        }
    }
    return '☀️';
}

// ===================================
// Dynamic Background Based on Weather
// ===================================
function updateBackground(condition) {
    document.body.className = ''; // Clear existing classes
    
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear')) {
        document.body.classList.add('clear');
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('thunderstorm')) {
        document.body.classList.add('rain');
    } else if (conditionLower.includes('cloud')) {
        document.body.classList.add('clouds');
    } else if (conditionLower.includes('snow')) {
        document.body.classList.add('snow');
    }
}

// ===================================
// Temperature Color Class
// ===================================
function getTemperatureClass(temp) {
    if (temp < 10) return 'cold';
    if (temp < 20) return 'normal';
    if (temp < 30) return 'warm';
    return 'hot';
}

// ===================================
// Format Date
// ===================================
function formatDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
}

// ===================================
// API Functions
// ===================================
async function fetchWeatherData(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
            } else {
                throw new Error('Failed to fetch weather data. Please try again later.');
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        if (error.message.includes('API key')) {
            throw error;
        }
        throw new Error('Network error. Please check your internet connection.');
    }
}

async function getWeatherByCity(city) {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    return await fetchWeatherData(url);
}

async function getWeatherByCoords(lat, lon) {
    const url = `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return await fetchWeatherData(url);
}

// ===================================
// Display Weather Data
// ===================================
function displayWeather(data) {
    // Extract data
    const city = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const feelsLikeTemp = Math.round(data.main.feels_like);
    const desc = data.weather[0].description;
    const mainCondition = data.weather[0].main;
    const humidityValue = data.main.humidity;
    const wind = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    const visibilityValue = data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A';
    const pressureValue = data.main.pressure;
    
    // Update UI
    cityName.textContent = `${city}, ${country}`;
    date.textContent = formatDate();
    temperature.textContent = temp;
    temperature.className = `temperature ${getTemperatureClass(temp)}`;
    description.textContent = desc;
    weatherIcon.textContent = getWeatherIcon(mainCondition);
    humidity.textContent = `${humidityValue}%`;
    humidityFill.style.width = `${humidityValue}%`;
    windSpeed.textContent = `${wind} km/h`;
    feelsLike.textContent = `${feelsLikeTemp}°C`;
    visibility.textContent = visibilityValue === 'N/A' ? 'N/A' : `${visibilityValue} km`;
    pressure.textContent = `${pressureValue} hPa`;
    
    // Update background
    updateBackground(mainCondition);
    
    // Save to recent searches (only after successful API response)
    saveRecent(city);
    
    // Show weather display
    hideLoading();
    hideError();
    weatherDisplay.classList.add('active');
}

// ===================================
// Search Weather
// ===================================
async function searchWeather(city) {
    if (!city || !city.trim()) {
        showError('Please enter a city name.');
        return;
    }
    
    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        showError('Please add your OpenWeatherMap API key in script.js');
        return;
    }
    
    showLoading();
    hideError();
    weatherDisplay.classList.remove('active');
    
    try {
        const data = await getWeatherByCity(city.trim());
        displayWeather(data);
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// ===================================
// Get Current Location Weather
// ===================================
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }
    
    showLoading();
    hideError();
    weatherDisplay.classList.remove('active');
    locationBtn.disabled = true;
    locationBtn.textContent = 'Locating...';
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const data = await getWeatherByCoords(latitude, longitude);
                displayWeather(data);
            } catch (error) {
                hideLoading();
                showError(error.message);
            } finally {
                locationBtn.disabled = false;
                locationBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v4M12 18v4M4 12H2M22 12h-2M19.07 19.07l-2.83-2.83M19.07 4.93l-2.83 2.83M4.93 4.93l2.83 2.83M4.93 19.07l2.83-2.83"></path>
                    </svg>
                    Current Location
                `;
            }
        },
        (error) => {
            hideLoading();
            locationBtn.disabled = false;
            locationBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4 12H2M22 12h-2M19.07 19.07l-2.83-2.83M19.07 4.93l-2.83 2.83M4.93 4.93l2.83 2.83M4.93 19.07l2.83-2.83"></path>
                </svg>
                Current Location
            `;
            
            let errorMsg = 'Unable to retrieve your location. ';
            if (error.code === error.PERMISSION_DENIED) {
                errorMsg += 'Please allow location access.';
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                errorMsg += 'Location information is unavailable.';
            } else {
                errorMsg += 'Location request timed out.';
            }
            showError(errorMsg);
        }
    );
}

// ===================================
// UI Helper Functions
// ===================================
function showLoading() {
    loading.classList.add('active');
}

function hideLoading() {
    loading.classList.remove('active');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
}

function hideError() {
    errorMessage.classList.remove('active');
}

// ===================================
// Event Listeners
// ===================================
searchBtn.addEventListener('click', () => {
    searchWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather(cityInput.value);
    }
});

locationBtn.addEventListener('click', getCurrentLocationWeather);

// Focus search input on load
cityInput.focus();

