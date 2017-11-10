/* eslint-disable */
import { mount } from 'vue-test-utils'

import MovieSuggest from '@/components/Create/MovieSuggest'

describe('MovieSuggest.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(MovieSuggest, {
      attachToDocument: true
    })
  })

  it('The button should be disabled when there is no query', () => {
    expect(wrapper.find('input').element.value).to.equal('')
    expect(wrapper.find('#add').element.getAttribute('disabled')).to.equal('disabled')
  })

  it('The button should be enabled when there is a query', () => {
    let input = wrapper.find('input')
    expect(input.element.value).to.equal('')
    input.element.value = 'Input'
    input.trigger('input')
    expect(wrapper.find('#add').element.getAttribute('disabled')).to.equal.null
  })

  it('Should emit fill with a name and null id when the add button is pressed', () => {
    let input = wrapper.find('input')
    expect(input.element.value).to.equal('')
    input.element.value = 'Film Name'
    input.trigger('input')
    wrapper.find('#add').trigger('click')
    
    let emittedFill = wrapper.emitted().fill
    expect(emittedFill).to.exist
    console.log(emittedFill[0][0])
    expect(emittedFill[0][0].film_id).to.be.null
    expect(emittedFill[0][0].name).to.equal('Film Name')
  })

  // Emits text and id on clicked suggestion

  // Shows suggestions when there are suggestions

})