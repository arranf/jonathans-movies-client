// TODO: Rename me to spec.js

/* eslint-disable */


import {createLocalVue, mount } from 'vue-test-utils'
import {MdAutocomplete, MdMenu, MdHighlightText, MdField} from 'vue-material/dist/components'
import mockQueries from '@/mocks/queries' // queries is the mock
import MovieSuggest from '@/components/Create/MovieSuggest'

jest.mock('@/api', () => mockQueries) 

describe('MovieSuggest.vue', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(MdAutocomplete)
  localVue.use(MdMenu) 
  localVue.use(MdHighlightText) 
  localVue.use(MdField)

  beforeEach(() => {
    wrapper = mount(MovieSuggest, {
      localVue,
      mocks: {
        queries: mockQueries
      }
    })
  })

  it('Should emit fill with a name and null id when the \'Add Anyway!\' button is pressed', async () => {
    let input = wrapper.find('input')
    expect(input.element.value).toBe('')
    input.element.value = 'Double Wagon'
    input.trigger('input')
    await localVue.nextTick()
    wrapper.find('#add-anyway').trigger('click')
    
    let emittedFill = wrapper.emitted().fill
    expect(emittedFill).toBeDefined()
    expect(emittedFill[0][0].film_id).toBeNull()
    expect(emittedFill[0][0].name).toBe('Double Wagon')
  })

  it('Emits text and id when a suggestion is clicked', async () => {
    let input = wrapper.find('input')
    input.element.value = 'Die Hard 2'
    input.trigger('input')
    await localVue.nextTick()

    wrapper.find('div[id^=\'suggestion\']').trigger('click')
    let emittedFill = wrapper.emitted().fill
    expect(emittedFill).toBeDefined()
    expect(emittedFill[0][0].film_id).anything()
    expect(emittedFill[0][0].name).tobe('Die Hard 2')
  })

  // Emits text and id on clicked suggestion

  // Shows suggestions when there are suggestions

})