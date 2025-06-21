document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const citySearchInput = document.getElementById('city-search');
    const searchButton = document.getElementById('search-button');
    const mapLinkContainer = document.getElementById('map-link-container');
    const popularCitiesContainer = document.getElementById('popular-cities');
    const suggestionsContainer = document.getElementById('suggestions');
    const suggestionsWrapper = document.querySelector('.suggestions-container');
    const guideTitleEl = document.getElementById('guide-title');
    const guideStepsEl = document.getElementById('guide-steps');

    // --- Language and Text Data ---
    const texts = {
        tr: {
            title: "🌍 Offline Harita İndirici",
            subtitle: "Seyahate çıkmadan önce haritanı indir, çevrimdışı gezmeye hazır ol!",
            searchPlaceholder: "Şehir adı girin... (örn. Barselona)",
            searchButton: "Ara",
            downloadPrompt: "Haritayı İndirmek İçin Tıkla",
            suggestionTitle: "Yakındaki popüler yerler",
            popularTitle: "Popüler Şehirler",
            guideTitle: "Çevrimdışı Harita Nasıl İndirilir?",
            guideStep1: "Google Haritalar'da profil resminize dokunun.",
            guideStep2: "'Çevrimdışı haritalar'ı seçin.",
            guideStep3: "'Kendi haritanızı seçin'e dokunun.",
            guideStep4: "İndirmek istediğiniz alanı ayarlayın ve 'İndir'e dokunun."
        },
        en: {
            title: "🌍 Offline Map Downloader",
            subtitle: "Download your map before you travel, be ready to explore offline!",
            searchPlaceholder: "Enter a city name... (e.g., Barcelona)",
            searchButton: "Search",
            downloadPrompt: "Click to Download The Map",
            suggestionTitle: "Nearby popular places",
            popularTitle: "Popular Cities",
            guideTitle: "How to Download an Offline Map?",
            guideStep1: "In Google Maps, tap your profile picture.",
            guideStep2: "Select 'Offline maps'.",
            guideStep3: "Tap 'Select your own map'.",
            guideStep4: "Adjust the area you want to download and tap 'Download'."
        }
    };

    // --- City Data ---
    const popularCities = ["Paris", "Rome", "Istanbul", "New York", "Tokyo", "London", "Bangkok", "Dubai", "Prague", "Barcelona"];
    const citySuggestions = {
        "BARCELONA": ["Girona", "Tarragona", "Sitges"],
        "PARIS": ["Versailles", "Disneyland", "Fontainebleau"],
        "LONDON": ["Windsor", "Cambridge", "Oxford"],
        "ISTANBUL": ["Bursa", "Edirne", "Sapanca"]
    };

    // --- Functions ---

    /**
     * Detects browser language and sets UI texts accordingly.
     */
    const setLanguage = () => {
        const lang = navigator.language.startsWith('tr') ? 'tr' : 'en';
        const t = texts[lang];

        document.getElementById('title').textContent = t.title;
        document.getElementById('subtitle').textContent = t.subtitle;
        citySearchInput.placeholder = t.searchPlaceholder;
        searchButton.textContent = t.searchButton;
        document.getElementById('suggestion-title').textContent = t.suggestionTitle;
        document.getElementById('popular-title').textContent = t.popularTitle;

        // Set guide text
        guideTitleEl.textContent = t.guideTitle;
        guideStepsEl.innerHTML = `
            <li>${t.guideStep1}</li>
            <li>${t.guideStep2}</li>
            <li>${t.guideStep3}</li>
            <li>${t.guideStep4}</li>
        `;

        // Store lang for later use
        document.documentElement.lang = lang;
    };

    /**
     * Normalizes city names: uppercase, trims whitespace, and handles Turkish characters.
     * @param {string} cityName - The city name to normalize.
     * @returns {string} The normalized city name.
     */
    const normalizeCityName = (cityName) => {
        const turkishMap = { 'İ': 'I', 'I': 'I', 'Ş': 'S', 'Ğ': 'G', 'Ü': 'U', 'Ö': 'O', 'Ç': 'C', 'ı': 'i', 'ş': 's', 'ğ': 'g', 'ü': 'u', 'ö': 'o', 'ç': 'c' };
        return cityName.trim().toLocaleUpperCase('en-US').replace(/[İIŞĞÜÖÇıişğüöç]/g, char => turkishMap[char] || char);
    };

    /**
     * Creates a clickable city chip element.
     * @param {string} cityName - The name of the city for the chip.
     * @returns {HTMLElement} The created chip element.
     */
    const createCityChip = (cityName) => {
        const chip = document.createElement('div');
        chip.className = 'city-chip';
        chip.textContent = cityName;
        chip.addEventListener('click', () => {
            citySearchInput.value = cityName;
            handleSearch();
        });
        return chip;
    };

    /**
     * Populates the popular cities section.
     */
    const populatePopularCities = () => {
        popularCitiesContainer.innerHTML = '';
        popularCities.forEach(city => {
            popularCitiesContainer.appendChild(createCityChip(city));
        });
    };

    /**
     * Displays suggestions for a given city.
     * @param {string} normalizedCity - The normalized name of the main city.
     */
    const showSuggestions = (normalizedCity) => {
        suggestionsContainer.innerHTML = '';
        const suggestions = citySuggestions[normalizedCity];
        if (suggestions) {
            suggestionsWrapper.style.display = 'block';
            suggestions.forEach(suggestion => {
                suggestionsContainer.appendChild(createCityChip(suggestion));
            });
        } else {
            suggestionsWrapper.style.display = 'none';
        }
    };
    
    /**
     * Generates and displays the Google Maps link.
     * @param {string} city - The name of the city.
     */
    const generateMapLink = (city) => {
        const normalizedCity = normalizeCityName(city);
        if (!normalizedCity) return;
        
        const lang = document.documentElement.lang || 'en';
        const linkText = texts[lang].downloadPrompt;

        const mapUrl = `https://www.google.com/maps/place/${encodeURIComponent(normalizedCity)}`;
        
        mapLinkContainer.innerHTML = `<a href="${mapUrl}" target="_blank" class="map-link">${linkText}</a>`;
        
        // Also show suggestions for this city
        showSuggestions(normalizedCity);
    };

    /**
     * Main function to handle the search action.
     */
    const handleSearch = () => {
        const city = citySearchInput.value;
        if (city) {
            generateMapLink(city);
        }
    };


    // --- Event Listeners ---
    searchButton.addEventListener('click', handleSearch);
    citySearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // --- Initial Setup ---
    setLanguage();
    populatePopularCities();
    suggestionsWrapper.style.display = 'none'; // Hide suggestions initially
});
