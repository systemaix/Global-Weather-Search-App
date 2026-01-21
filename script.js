async function searchWeather() {
    const city = document.getElementById('cityInput').value;
    const spinner = document.getElementById('spinner');
    const searchIcon = document.getElementById('searchIcon');
    const content = document.getElementById('content');

    if (!city) return;

    // --- START LOADING ---
    spinner.classList.remove('hidden');
    searchIcon.classList.add('hidden');
    content.classList.add('loading-view');

    try {
        // 1. Get City Coordinates
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoRes.json();
        if (!geoData.results) throw new Error("City not found");
        
        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Get Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`);
        const weatherData = await weatherRes.json();

        // 3. Update UI
        document.getElementById('cityName').innerText = `${name}, ${country}`;
        document.getElementById('temp').innerText = `${Math.round(weatherData.current.temperature_2m)}°C`;
        document.getElementById('wind').innerText = `${weatherData.current.wind_speed_10m} km/h`;
        document.getElementById('humidity').innerText = `${weatherData.current.relative_humidity_2m}%`;

    } catch (error) {
        alert(error.message);
    } finally {
        // --- STOP LOADING ---
        spinner.classList.add('hidden');
        searchIcon.classList.remove('hidden');
        content.classList.remove('loading-view');
        lucide.createIcons();
    }
}

lucide.createIcons();
