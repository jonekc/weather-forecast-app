import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import WeatherForecast from './WeatherForecast.vue'
import { server } from '@/utils/mockServer'

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
    const wrapper = mount(WeatherForecast)
    await wrapper.get('input').setValue('Paris')
    const searchButton = wrapper.get('input[type=submit]')
    await wrapper.get('form').trigger('submit')

    wrapper.get('[data-testid=spinner]')
    expect(searchButton.attributes()).toHaveProperty('disabled')
    vi.mock('echarts')

    await flushPromises()

    console.log(wrapper.html())
    expect(wrapper.find('[data-testid=spinner]').exists()).toBe(false)
    expect(searchButton.attributes()).not.toHaveProperty('disabled')
  })
})
