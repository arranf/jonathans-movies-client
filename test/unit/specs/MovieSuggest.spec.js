/* eslint-disable */

jest.mock('@/api', () => ({
  getFilmSuggestions: jest.fn(() => Promise.resolve({data: [{name: 'Double Dragon', release_date: '2017-01-01'}]}))
}))

import { mount } from 'vue-test-utils'
import queries from '@/api' // queries is from the mock from above
import MovieSuggest from '@/components/Create/MovieSuggest'

describe('MovieSuggest.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(MovieSuggest, {
      attachToDocument: true
    })
  })

  it('The button should be disabled when there is no query', () => {
    expect(wrapper.find('input').element.value).toBe('')
    expect(wrapper.find('#add').element.getAttribute('disabled')).toBe('disabled')
  })

  it('The button should be enabled when there is a query', () => {
    let input = wrapper.find('input')
    expect(input.element.value).toBe('')
    input.element.value = 'Input'
    input.trigger('input')
    expect(wrapper.find('#add').element.getAttribute('disabled')).toBeNull()
  })

  it('Should emit fill with a name and null id when the add button is pressed', () => {
    let input = wrapper.find('input')
    expect(input.element.value).toBe('')
    input.element.value = 'Film Name'
    input.trigger('input')
    wrapper.find('#add').trigger('click')
    
    let emittedFill = wrapper.emitted().fill
    expect(emittedFill).toBeDefined()
    expect(emittedFill[0][0].film_id).toBeNull()
    expect(emittedFill[0][0].name).toBe('Film Name')
  })

  // Emits text and id on clicked suggestion

  // Shows suggestions when there are suggestions

})