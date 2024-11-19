import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest'
import ComboChart, { type ComboChartProps } from './ComboChart.vue'
import * as echarts from 'echarts'

const props: ComboChartProps = {
  labels: ['Nov 15', 'Nov 16'],
  yAxis: { type: 'value', name: 'Temperature °C' },
  series: { type: 'line', smooth: true, data: [5, 7] },
}

describe('Test a combo chart', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  vi.mock('echarts')

  it('sets the chart options with correct data', () => {
    const mockSetOption = vi.fn()
    const mockDispose = vi.fn()
    const mock = (echarts.init as Mock).mockReturnValueOnce({
      setOption: mockSetOption,
      dispose: mockDispose,
    })

    const wrapper = mount(ComboChart, { props })

    expect(mock).toBeCalledWith(wrapper.element)

    const option = {
      xAxis: {
        type: 'category',
        data: props.labels,
        axisLabel: { formatter: props.formatter },
      },
      yAxis: props.yAxis,
      series: props.series,
    }
    expect(mockSetOption).toHaveBeenCalledWith(expect.objectContaining(option))
  })

  it('disposes the chart instance on unmount', () => {
    const mockDispose = vi.fn()
    ;(echarts.init as Mock).mockReturnValueOnce({
      setOption: vi.fn(),
      dispose: mockDispose,
    })

    const wrapper = mount(ComboChart, { props })

    wrapper.unmount()
    expect(mockDispose).toHaveBeenCalled()
  })
})
