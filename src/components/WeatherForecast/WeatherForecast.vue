<script setup lang="ts">
import type { ForecastResponse, HourlyWeather, Town, TownResponse } from '@/types/weatherForecast'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import ComboChart, { type ComboChartProps } from '../ComboChart/ComboChart.vue'
import dayjs from 'dayjs'
import ListView, { type ListItem } from '../ListView/ListView.vue'
import { configuration } from '@/utils/configuration'
import type { TopLevelFormatterParams } from 'echarts/types/dist/shared'
import SpinnerComponent from '../SpinnerComponent.vue'
import type { AutoComplete, AutoCompleteCompleteEvent } from 'primevue'

const town = ref<Town | string>('')
const suggestions = ref<Town[]>([])
const selectedTownLabel = ref('')

const hourlyWeather = ref<HourlyWeather | null>(null)
const isLoading = ref(false)
const isError = ref(false)
const noResults = ref(false)

const selectElement = ref<InstanceType<typeof AutoComplete> | null>(null)

onMounted(() => {
  const element = (selectElement.value as { $el?: HTMLInputElement | null })?.$el
  if (element) {
    element.querySelector('input')?.focus()
  }
})

const fetchSuggestions = async (count?: number) => {
  const name = typeof town.value === 'string' ? town.value : town.value.name
  const {
    data: { results },
  } = await axios.get<TownResponse>(`${configuration.geocodingAPIBaseURL}/v1/search`, {
    params: { name, count },
  })
  suggestions.value = results || []
  return results
}

const handleSelectComplete = (e: AutoCompleteCompleteEvent) => {
  if (e.query.length >= 2) {
    try {
      fetchSuggestions()
    } catch (e) {
      console.log(e)
      suggestions.value = []
    }
  } else {
    suggestions.value = []
  }
}

const handleEnterPress = () => {
  if (typeof town.value === 'string' && town.value.length >= 2) {
    ;(selectElement.value as { hide?: () => void }).hide?.()
    searchForecast()
  }
}

const getAdmininistrativeAreas = (suggestion: Town) =>
  `${suggestion.admin1 ? `, ${suggestion.admin1}` : ''}${suggestion.admin2 ? `, ${suggestion.admin2}` : ''}${suggestion.admin3 ? `, ${suggestion.admin3}` : ''}${suggestion.admin4 ? `, ${suggestion.admin4}` : ''}${suggestion.country ? `, ${suggestion.country}` : ''}`

const formatSuggestion = (suggestion: Town) =>
  `${suggestion.name}${getAdmininistrativeAreas(suggestion)}`

const searchForecast = async () => {
  const hourly = 'temperature_2m,precipitation'
  const timezone = 'auto'

  try {
    isLoading.value = true
    isError.value = false
    noResults.value = false

    let results: Town[] | undefined = typeof town.value === 'string' ? [] : [town.value]
    if (!results.length) {
      results = await fetchSuggestions(1)
    }
    if (results?.length) {
      selectedTownLabel.value = formatSuggestion(results[0])
      const latitude = results[0].latitude
      const longitude = results[0].longitude

      const { data: forecastData } = await axios.get<ForecastResponse>(
        `${configuration.forecastAPIBaseURL}/v1/forecast`,
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
    town.value = ''
  }
}

const labelFormatter = (value: string) => dayjs(value).format('MMM D, HH:mm')
const tooltipFormatter = (params: TopLevelFormatterParams) => {
  const data = [...(Array.isArray(params) ? params : [params])]
  const precipitation = data[0]
  const temperature = data[1]
  return `${labelFormatter(temperature.name)}: ${temperature.data}°C, ${precipitation.data}mm`
}

const forecastListData = computed<Record<string, ListItem[]> | null>(() =>
  hourlyWeather.value
    ? hourlyWeather.value.time.reduce(
        (acc, time, index) => {
          const temperature = hourlyWeather.value?.temperature_2m[index]
          const precipitation = hourlyWeather.value?.precipitation[index]
          const formattedTime = labelFormatter(time)

          const date = dayjs(time).format('MMM D')
          const label = `${formattedTime}:`
          const value = temperature !== undefined ? `${temperature}°C, ${precipitation}mm` : ''
          const currentList = acc[date] || []

          return { ...acc, [date]: [...currentList, { label, value }] }
        },
        {} as Record<string, ListItem[]>,
      )
    : null,
)
const forecastChartData = computed<Pick<ComboChartProps, 'yAxis' | 'series'> | null>(() =>
  hourlyWeather.value
    ? {
        yAxis: [
          { type: 'value', name: 'Precipitation mm', position: 'right' },
          { type: 'value', name: 'Temperature °C' },
        ],
        series: [
          { type: 'bar', data: hourlyWeather.value?.precipitation, yAxisIndex: 0 },
          { type: 'line', smooth: true, data: hourlyWeather.value.temperature_2m, yAxisIndex: 1 },
        ],
      }
    : null,
)
</script>

<template>
  <h3 class="heading">Weather forecast</h3>
  <form @submit="searchForecast" @submit.prevent>
    <label>
      Enter a town<br />
      <AutoComplete
        v-model="town"
        @keyup.enter="handleEnterPress"
        :suggestions="suggestions"
        :option-label="formatSuggestion"
        :min-length="2"
        @complete="handleSelectComplete"
        @option-select="searchForecast"
        ref="selectElement"
      />
    </label>
    <input type="submit" value="Search" class="search-button" :disabled="isLoading" />
  </form>
  <div v-if="isLoading" class="message" data-testid="spinner">
    <SpinnerComponent width="100%" height="400px" />
  </div>
  <template v-else-if="hourlyWeather && forecastChartData && forecastListData && !isError">
    <p class="town-label">{{ selectedTownLabel }}</p>
    <ComboChart
      :y-axis="forecastChartData.yAxis"
      :series="forecastChartData.series"
      :labels="hourlyWeather.time"
      :formatter="labelFormatter"
      :tooltip-formatter="tooltipFormatter"
    />
    <div class="list">
      <ListView v-for="(item, key) in forecastListData" :key="key" :data="item" />
    </div>
  </template>
  <p v-if="isError" class="message">An error occurred. Try again later.</p>
  <p v-if="noResults" class="message">No results found. Try a different location.</p>
</template>

<style scoped>
.heading {
  font-weight: 500;
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
  margin-left: 0.5rem;
}

.town-label {
  margin-top: 1rem;
}

.list {
  display: grid;
  row-gap: 2rem;
}

.message {
  margin-top: 1rem;
}
</style>
