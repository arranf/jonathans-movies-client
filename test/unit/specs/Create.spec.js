/* eslint-disable */ 
import { mount } from 'vue-test-utils' 
import Create from '@/components/Create/Create' 
 
describe('Login.vue', () => { 
  let wrapper 
 
  beforeEach(() => { 
    wrapper = mount(Create, { 
      attachToDocument: true 
    }) 
  }) 
 
  it('Initially there should be no options present', () => { 
    expect(wrapper.find('#options').exists()).to.be.false 
  }) 
 
  it('Initially, the start poll button should be disabled', () => { 
    let startPoll = wrapper.find('#start-poll') 
    expect(startPoll.exists()).to.be.true 
    expect(startPoll).to.be.an('object') 
    expect(startPoll.element.getAttribute('disabled')).to.equal('disabled') 
  }) 
 
  it('The start poll button should still be disabled, when one movie is added', () => { 
    let movieSuggestion = wrapper.find('#movie-suggest') 
    expect(movieSuggestion).to.be.an('object') 
    movieSuggestion.element.value = 'Movie 1' 
    movieSuggestion.trigger('input') 
    wrapper.find('#add').trigger('click') 
 
    expect(wrapper.find('#start-poll').element.getAttribute('disabled')).to.equal('disabled') 
  }) 
 
  it('When a movie is added it should appear in the options', () => { 
    let movieSuggestion = wrapper.find('#movie-suggest') 
    expect(movieSuggestion).to.be.an('object') 
    movieSuggestion.element.value = 'Movie 1' 
    movieSuggestion.trigger('input') 
    wrapper.find('#add').trigger('click') 
 
    expect(wrapper.find('#options').exists()).to.be.true 
 
    let li = wrapper.findAll('#options li') 
    expect(li.length).to.equal(1) 
  }) 
 
})