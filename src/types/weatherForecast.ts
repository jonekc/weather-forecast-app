type Town = {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
  admin2?: string
  admin3?: string
  admin4?: string
}

type TownResponse = {
  results?: Town[]
}

type HourlyWeather = {
  time: string[]
  temperature_2m: number[] // Array of temperatures in °C
  precipitation: number[] // Array of precipitation in mm
}

type ForecastResponse = {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  hourly_units: {
    time: string
    temperature_2m: string
    precipitation: string
  }
  hourly: HourlyWeather
}

type ChartData = {
  labels: string[]
  data: number[]
}

export type { Town, TownResponse, HourlyWeather, ForecastResponse, ChartData }
