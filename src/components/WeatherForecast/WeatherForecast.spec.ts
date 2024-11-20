import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import WeatherForecast from '../WeatherForecast/WeatherForecast.vue'
import { server } from '@/utils/mockServer'
import { http, HttpResponse } from 'msw'
import { configuration } from '@/utils/configuration'

const sendForm = async (value: string) => {
  const wrapper = mount(WeatherForecast)
  await wrapper.get('input').setValue(value)
  await wrapper.get('form').trigger('submit')
  return wrapper
}

describe('Test a weather forecast', () => {
  beforeAll(() => {
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  it('The forecast data is loaded', async () => {
    const wrapper = await sendForm('Paris')

    wrapper.get('[data-testid=spinner]')
    const searchButton = wrapper.get('input[type=submit]')
    expect(searchButton.attributes()).toHaveProperty('disabled')
    vi.mock('echarts')

    await flushPromises()

    console.log(wrapper.html())
    expect(wrapper.find('[data-testid=spinner]').exists()).toBe(false)
    expect(searchButton.attributes()).not.toHaveProperty('disabled')
  })

  it('No results message is displayed', async () => {
    server.use(
      http.get(`${configuration.geocodingAPIBaseURL}/v1/search`, () =>
        HttpResponse.json({
          generationtime_ms: 0.09202957,
        }),
      ),
    )
    const wrapper = await sendForm('Xyz')

    await flushPromises()

    expect(wrapper.text()).toContain('No results found. Try a different location')
  })

  it('Error message is shown', async () => {
    server.use(
      http.get(`${configuration.geocodingAPIBaseURL}/v1/search`, () =>
        HttpResponse.json({ error: 'Server error' }, { status: 500 }),
      ),
    )
    const wrapper = await sendForm('Paris')

    await flushPromises()

    expect(wrapper.text()).toContain('An error occurred. Try again later.')
  })
})
