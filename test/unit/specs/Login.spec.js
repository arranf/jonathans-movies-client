/* eslint-disable */
import {createLocalVue, mount } from 'vue-test-utils'
import VueMaterial from 'vue-material'

import Login from '@/components/Login/Login'
import { wrap } from 'module';


describe('Login.vue', () => {
  let wrapper

  const localVue = createLocalVue()
  localVue.use(VueMaterial)

  beforeEach(() => {
    wrapper = mount(Login, {
      localVue,
      // computed: {
      //   user: () => {
      //     return {
      //       _id: "695345fsfdsfsdf",
      //       isAdmin: false,
      //       createdAt: "2017-09-27T13:01:32.926Z",
      //       email: "email@email.com",
      //       facebook: {},
      //       facebookId: "100847354",
      //       name: "Bob Jones",
      //       updatedAt: "2017-09-27T13:01:32.926Z"
      //     }
      //   }
      // }
    })
  })

  it('should not display snackbar when initially created', () => {
    expect(wrapper.contains('.md-snackbar')).toBe(false)
  })

  it('should render the div containing the login buttons when the component is initially created', () => {
    let loginDiv = wrapper.find('#loginOptions')
    expect(loginDiv.contains('#facebook')).toBe(true)
    expect(loginDiv.contains('#login')).toBe(true)
  })

  it('should not render the div containing the login buttons after the login button is clicked', () => {
    let loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    expect(wrapper.contains('#loginOptions')).toBe(false)
  })

  it('should render the login form when the login button is clicked', () => {
    const loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    expect(wrapper.contains('#internalLoginForm')).toBe(true)
  })

  it('should not render the login form when the component is initially created', () => {
    expect(wrapper.contains('#internalLoginForm')).toBe(false)
  })

  it('should disable the submit button on the login form when a valid email is entered with no password', async () => {
    let loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    let email = wrapper.find('#email')
    expect(typeof email).toBe('object')
    email.element.value = 'invalidemail'
    email.trigger('input')
    let submitButton = wrapper.find('#submit')
    expect(typeof submitButton).toBe('object')

    // MdField does things after nextTick
    await localVue.nextTick()
    expect(submitButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should disable the submit button on the login form when a password is entered with no email', async () => {
    let loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    let password = wrapper.find('#password')
    expect(typeof password).toBe('object')
    password.element.value = 'password'
    password.trigger('input')
    let submitButton = wrapper.find('#submit')
    expect(typeof submitButton).toBe('object')

    // MdField does things after nextTick
    await localVue.nextTick()
    expect(submitButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should disable the submit button on the login form when an no email or password are entered', () => {

    wrapper.find('#login').trigger('click')
    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should disable the submit button on the login form when an invalid email is entered with a password', async () => {
    wrapper.find('#login').trigger('click')
    let email = wrapper.find('#email')
    email.element.value = 'invalidemail'
    email.trigger('input')
    let password = wrapper.find('#password')
    password.element.value = 'password'
    password.trigger('input')
    let submitButton = wrapper.find('#submit')

    // MdField does things after nextTick
    await localVue.nextTick()
    expect(submitButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should enable the submit button on the login form when a valid email is entered with a password', async () => {
    wrapper.find('#login').trigger('click')
    let emailInput = wrapper.find('#email')
    emailInput.element.value = 'avalidemail@email.com'
    emailInput.trigger('input')

    let passwordInput = wrapper.find('#password')
    passwordInput.element.value = 'password'
    passwordInput.trigger('input')
    let submitButton = wrapper.find('#submit')

    // MdField does things after nextTick 
    await localVue.nextTick()
    expect(submitButton.attributes().disabled).toBeFalsy()
  })
  
  it('the snackbar should not appear after a successful login', async () => {
    const tryLoginMock = jest.fn();

    wrapper.setMethods({tryLogin: tryLoginMock})
    wrapper.find('#login').trigger('click')
    let email = wrapper.find('#email')
    email.element.value = 'avalidemail@email.com'
    email.trigger('input')
    let password = wrapper.find('#password')
    password.element.value = 'password'
    password.trigger('input')
    let submitButton = wrapper.find('#submit')

    // MdField does things after nextTick 
    await localVue.nextTick()
    submitButton.trigger('click')
    expect(tryLoginMock).toBeCalled()
    expect(wrapper.contains('#snackbar')).toBe(false)
  })
})
