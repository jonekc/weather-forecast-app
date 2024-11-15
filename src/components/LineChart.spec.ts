import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, afterEach, type Mock } from 'vitest'
import LineChart, { type ChartProps } from './LineChart.vue'
import * as echarts from 'echarts'

describe('Test a line chart', () => {
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

    const props: ChartProps = {
      labels: ['Nov 15', 'Nov 16'],
      data: [5, 7],
      axisName: 'Temperature',
      formatter: (value) => `${value}°C`,
    }
    const wrapper = mount(LineChart, { props })

    expect(mock).toBeCalledWith(wrapper.element)

    const option = {
      xAxis: {
        type: 'category',
        data: props.labels,
        axisLabel: { formatter: props.formatter },
      },
      yAxis: {
        type: 'value',
        name: props.axisName,
      },
      series: [
        {
          data: props.data,
          type: 'line',
          smooth: true,
        },
      ],
    }
    expect(mockSetOption).toHaveBeenCalledWith(expect.objectContaining(option))
  })

  it('disposes the chart instance on unmount', () => {
    const mockDispose = vi.fn()
    ;(echarts.init as Mock).mockReturnValueOnce({
      setOption: vi.fn(),
      dispose: mockDispose,
    })

    const props: ChartProps = {
      labels: ['Nov 15', 'Nov 16'],
      data: [5, 7],
      axisName: 'Temperature',
      formatter: (value) => `${value}°C`,
    }
    const wrapper = mount(LineChart, { props })

    wrapper.unmount()
    expect(mockDispose).toHaveBeenCalled()
  })
})
