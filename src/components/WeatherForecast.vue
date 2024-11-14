<script setup lang="ts">
import type { ForecastResponse, HourlyWeather, Town } from '@/types/weatherForecast'
import axios from 'axios'
import { computed, ref } from 'vue'
import LineChart from './LineChart.vue'
import dayjs from 'dayjs'
import ListView from './ListView.vue'

const town = ref('')
const hourlyWeather = ref<HourlyWeather | null>(null)
const isLoading = ref(false)
const isError = ref(false)
const noResults = ref(false)

const searchForecast = async () => {
  const geocodingAPIBaseURL = 'https://geocoding-api.open-meteo.com'
  const forecastAPIBaseURL = 'https://api.open-meteo.com'
  const hourly = 'temperature_2m'
  const timezone = 'auto'

  try {
    isLoading.value = true
    isError.value = false
    noResults.value = false

    const { data: searchData } = await axios.get<{ results?: Town[] }>(
      `${geocodingAPIBaseURL}/v1/search`,
      {
        params: { name: town.value, count: 1 },
      },
    )
    const { results } = searchData
    if (results) {
      const latitude = results[0].latitude
      const longitude = results[0].longitude

      const { data: forecastData } = await axios.get<ForecastResponse>(
        `${forecastAPIBaseURL}/v1/forecast`,
        {
          params: { latitude, longitude, hourly, timezone },
        },
      )
      hourlyWeather.value = forecastData.hourly
    } else {
      hourlyWeather.value = null
      noResults.value = true
    }
  } catch (e) {
    console.log(e)
    isError.value = true
    hourlyWeather.value = null
  } finally {
    isLoading.value = false
  }
}

const labelFormatter = (value: string) => dayjs(value).format('MMM D, HH:mm')
const forecastListData = computed(() =>
  hourlyWeather.value
    ? hourlyWeather.value.time.map((time, index) => {
        const temperature = hourlyWeather.value?.temperature_2m[index]
        const formattedTime = labelFormatter(time)
        return {
          label: `${formattedTime}:`,
          value: temperature !== undefined ? `${temperature}°C` : '',
        }
      })
    : null,
)
</script>

<template>
  <h3 class="heading">Weather forecast</h3>
  <form @submit="searchForecast" @submit.prevent>
    <label
      >Enter a town<br /><input
        v-model="town"
        @keyup.enter="searchForecast"
        required
        autofocus
        class="town-input"
    /></label>
    <input type="submit" value="Search" class="search-button" />
    <p v-if="isLoading" class="message">Loading...</p>
    <LineChart
      v-else-if="hourlyWeather && !isError"
      :data="hourlyWeather.temperature_2m"
      :labels="hourlyWeather.time"
      axis-name="Temperature °C"
      :formatter="labelFormatter"
    />
    <p v-if="isError" class="message">An error occurred. Try again later.</p>
    <p v-if="noResults" class="message">No results found. Try a different location</p>
    <ListView v-else-if="forecastListData && !isError" :data="forecastListData" />
  </form>
</template>

<style scoped>
.heading {
  margin-bottom: 0.7rem;
}

.town-input {
  height: 2rem;
  padding: 0.5rem;
  font-size: 1rem;
}

.search-button {
  height: 2rem;
  padding: 0.5rem;
}

.message {
  margin-top: 1rem;
}
</style>
