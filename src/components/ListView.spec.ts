import { expect, it } from 'vitest'
import ListView, { type ListViewProps } from './ListView.vue'
import { mount } from '@vue/test-utils'

it('Hourly weather is displayed in a list', () => {
  const props: ListViewProps = {
    data: [
      { label: 'Nov 15', value: '5' },
      { label: 'Nov 16', value: '7' },
    ],
  }
  const list = mount(ListView, {
    props,
  })
  expect(list.text()).toContain('Nov 15 5')
  expect(list.text()).toContain('Nov 16 7')
})
