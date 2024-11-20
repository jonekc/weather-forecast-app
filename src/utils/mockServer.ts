import { setupServer } from 'msw/node'
import type { RequestHandler } from 'node_modules/msw/lib/core/handlers/RequestHandler'
import { http, HttpResponse } from 'msw'
import { configuration } from './configuration'
import type { ForecastResponse, TownResponse } from '@/types/weatherForecast'

const handlers: Array<RequestHandler> = [
  http.get(`${configuration.geocodingAPIBaseURL}/v1/search`, () =>
    HttpResponse.json<TownResponse>({
      results: [
        {
          id: 2988507,
          name: 'Paris',
          latitude: 48.85341,
          longitude: 2.3488,
        },
      ],
    }),
  ),
  http.get(`${configuration.forecastAPIBaseURL}/v1/forecast`, () =>
    HttpResponse.json<ForecastResponse>({
      latitude: 48.86,
      longitude: 2.3399997,
      generationtime_ms: 0.09000301361083984,
      utc_offset_seconds: 3600,
      timezone: 'Europe/Paris',
      timezone_abbreviation: 'CET',
      elevation: 43.0,
      hourly_units: {
        time: 'iso8601',
        temperature_2m: '°C',
        precipitation: 'mm',
      },
      hourly: {
        time: ['2024-11-19T00:00', '2024-11-19T01:00'],
        temperature_2m: [11.4, 11.1],
        precipitation: [0.7, 0.4],
      },
    }),
  ),
]

const server = setupServer(...handlers)

export { server }
