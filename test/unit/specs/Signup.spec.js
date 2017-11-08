/* eslint-disable */
import { mount } from 'vue-test-utils'
import SignUp from '@/components/SignUp/SignUp'

describe('SignUp.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SignUp, {
      attachToDocument: true
    })
  })

  it('should not display snackbar when initially created', () => {
    expect(wrapper.contains('.mdl-snackbar--active')).to.be.false
  })

  it('submit button should be disabled initially', () => {
    expect(wrapper.find('#submit').element.getAttribute('disabled')).to.equal('disabled')
  })

  it('should disable the submit button when an invalid email is input', () => {
    let email = wrapper.find('input[type=email]')
    email.element.value = 'invalidemail'
    email.trigger('input')
    expect(wrapper.find('#submit').element.getAttribute('disabled')).to.equal('disabled')
  })


  it('should disable the submit button when the password field is blank but a valid email is input', () => {
    let email = wrapper.find('input[type=email]')
    email.element.value = 'valid@email.com'
    email.trigger('input')
    expect(wrapper.find('#submit').element.getAttribute('disabled')).to.equal('disabled')
  })

  it('should disable the submit button when a password is input but an invalid email is input', () => {
    let email = wrapper.find('input[type=email]')
    email.element.value = 'invalid'
    email.trigger('input')

    let password = wrapper.find('input[type=password]')
    password.element.value = 'pass'
    password.trigger('input')
    expect(wrapper.find('#submit').element.getAttribute('disabled')).to.equal('disabled')
  })

  it('should enable the submit button when a valid email and password are input', () => {
    let email = wrapper.find('input[type=email]')
    email.element.value = 'valid@email.com'
    email.trigger('input')

    let password = wrapper.find('input[type=password]')
    password.element.value = 'pass'
    password.trigger('input')
    expect(wrapper.find('#submit').element.getAttribute('disabled')).to.equal.null
  })
  //TODO
  // Add a test (which mocks the $store and emits a signUpError) to see if the snackbar is displayed on invalid signup
})
