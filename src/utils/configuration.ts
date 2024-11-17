const configuration = {
  geocodingAPIBaseURL:
    import.meta.env.VITE_GEOCODING_API_BASE_URL || 'https://geocoding-api.open-meteo.com',
  forecastAPIBaseURL: import.meta.env.VITE_FORECAST_API_BASE_URL || 'https://api.open-meteo.com',
}

export { configuration }
