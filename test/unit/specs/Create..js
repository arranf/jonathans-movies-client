// TODO: Rename me to spec.js
/* eslint-disable */ 
import { createLocalVue,mount } from 'vue-test-utils' 
import Create from '@/components/Create/Create' 
import VueMaterial from 'vue-material'
 
describe('Create.vue', () => { 
  let wrapper 
  const localVue = createLocalVue()
  localVue.use(VueMaterial)
 
  beforeEach(() => { 
    wrapper = mount(Create, { 
      localVue
    }) 
  }) 
 
  it('Initially there should be no options present', () => { 
    expect(wrapper.find('#options').exists()).toBe(false) 
  })
 
  it('Initially, the start poll button should be disabled', () => { 
    let startPoll = wrapper.find('#start-poll') 
    expect(startPoll.exists()).toBe(true) 
    expect(typeof startPoll).toBe('object') 
    expect(startPoll.element.getAttribute('disabled')).toBe('disabled') 
  })
 
  it('The start poll button should still be disabled, when one movie is added and nominations are disabled', async () => { 
    let movieSuggestion = wrapper.find('#suggest-input') 
    expect(typeof movieSuggestion).toBe('object')
    movieSuggestion.element.value = 'Movie 1' 
    movieSuggestion.trigger('input') 
    await localVue.nextTick()
    wrapper.find('#add-anyway').trigger('click') 
 
    expect(wrapper.find('#start-poll').element.getAttribute('disabled')).toBe('disabled') 
  })

  it('The start poll button should be enabled, when two movies are added and nominations are disabled', async () => { 
    let movieSuggestion = wrapper.find('#suggest-input') 
    expect(typeof movieSuggestion).toBe('object') 
    movieSuggestion.element.value = 'Movie 1' 
    movieSuggestion.trigger('input') 

    await localVue.nextTick()
    wrapper.find('#add-anyway').trigger('click') 
    expect(wrapper.find('#start-poll').element.getAttribute('disabled')).toBe('disabled') 
  })

  it('The start poll button should be enabled, when two movies are added and nominations are disabled', async () => { 
    let movieSuggestion = wrapper.find('#movie-suggest') 
    expect(typeof movieSuggestion).toBe('object') 
    movieSuggestion.element.value = 'Movie 1' 
    movieSuggestion.trigger('input') 
    await localVue.nextTick()
    wrapper.find('#add-anyway').trigger('click') 
 
    expect(wrapper.find('#start-poll').element.getAttribute('disabled')).toBe('disabled') 
  })
 
  it('When a movie is added it should appear in the options', () => { 
    let movieSuggestion = wrapper.find('#movie-suggest') 
    expect(typeof movieSuggestion).toBe('object') 
    movieSuggestion.element.value = 'Movie 1' 
    movieSuggestion.trigger('input') 
    wrapper.find('#add-anyway').trigger('click') 
 
    expect(wrapper.find('#options').exists()).toBe(true) 
 
    let li = wrapper.findAll('#options') 
    expect(li.length).toBe(1) 
  })
 
})