// TODO: Rename me to spec.js

/* eslint-disable */
import { createLocalVue, mount } from 'vue-test-utils'
import VueMaterial from 'vue-material'
import SignUp from '@/components/SignUp/SignUp'

describe('SignUp.vue', () => {
  let wrapper
  const localVue = createLocalVue()
  localVue.use(VueMaterial)

  beforeEach(() => {
    wrapper = mount(SignUp, {
      localVue
    })
  })

  test('should not display snackbar when initially created', () => {
    expect(wrapper.contains('.md-snackbar')).toBe(false)
  })

  test('submit button should be disabled initially', () => {
    expect(wrapper.find('#submit').element.getAttribute('disabled')).toBe('disabled')
  })

  test('should disable the submit button when an invalid email is input', () => {
    let email = wrapper.find('#email')
    email.element.value = 'invalidemail'
    email.trigger('input')
    expect(wrapper.find('#submit').element.getAttribute('disabled')).toBe('disabled')
  })


  test('should disable the submit button when the password field is blank but a valid email is input', async () => {
    let email = wrapper.find('#email')
    email.element.value = 'valid@email.com'
    email.trigger('input')
    await localVue.nextTick()
    expect(wrapper.find('#submit').element.getAttribute('disabled')).toBe('disabled')
  })

  test('should disable the submit button when a password is input but an invalid email is input', async () => {
    let email = wrapper.find('#email')
    email.element.value = 'invalid'
    email.trigger('input')

    let password = wrapper.find('#password')
    password.element.value = 'password'
    password.trigger('input')

    await localVue.nextTick()
    expect(wrapper.find('#submit').element.getAttribute('disabled')).toBe('disabled')
  })

  test('should enable the submit button when a valid email and password are input', async () => {
    let email = wrapper.find('#email')
    email.element.value = 'valid@email.com'
    email.trigger('input')

    let password = wrapper.find('#password')
    password.element.value = 'password'
    password.trigger('input')

    await localVue.nextTick()
    expect(wrapper.find('#submit').element.getAttribute('disabled')).toBeNull()
  })

  test('shouldn\'t show the snackbar after a successful signup', async () => {
    const trySignUpMock = jest.fn();
    
    wrapper.setMethods({trySignUp: trySignUpMock});
    let email = wrapper.find('#email')
    email.element.value = 'valid@email.com'
    email.trigger('input')

    let password = wrapper.find('#password')
    password.element.value = 'password'
    password.trigger('input')

    await localVue.nextTick()
    wrapper.find('#submit').trigger('click')
    expect(trySignUpMock).toBeCalled()
    expect(wrapper.contains('#snackbar')).toBe(false)
  })
})
