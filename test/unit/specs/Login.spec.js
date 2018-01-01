/* eslint-disable */
import { mount } from 'vue-test-utils'
// import { __createMocks as createStoreMocks } from '@/store';
import Login from '@/components/Login/Login'

// jest.mock('@/store')

describe('Login.vue', () => {
  let wrapper

  beforeEach(() => {
    // const wrapper = createLocalVue();
    wrapper.use(Vuex);
    wrapper = mount(Login, {
      attachToDocument: true
    })
  })

  it('should not display snackbar when initially created', () => {
    expect(wrapper.contains('.mdl-snackbar--active')).toBe(false)
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

  it('should disable the submit button on the login form when a valid email is entered with no password', () => {
    let loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    let email = wrapper.find('input[type=email]')
    expect(typeof email).toBe('object')
    email.element.value = 'invalidemail'
    email.trigger('input')
    let submitButton = wrapper.find('#submit')
    expect(typeof submitButton).toBe('object')
    expect(submitButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should disable the submit button on the login form when a password is entered with no email', () => {
    const wrapper = mount(Login)
    let loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    let password = wrapper.find('input[type=password]')
    expect(typeof password).toBe('object')
    password.element.value = 'password'
    password.trigger('input')

    let submitButton = wrapper.find('#submit')
    expect(typeof submitButton).toBe('object')
    expect(submitButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should disable the submit button on the login form when an no email or password are entered', () => {
    const wrapper = mount(Login)
    wrapper.find('#login').trigger('click')
    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should disable the submit button on the login form when an invalid email is entered with a password', () => {
    const wrapper = mount(Login)
    wrapper.find('#login').trigger('click')
    let email = wrapper.find('input[type=email]')
    email.element.value = 'invalidemail'
    email.trigger('input')
    let password = wrapper.find('input[type=password]')
    password.element.value = 'password'
    password.trigger('input')

    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).toBe('disabled')
  })

  it('should enable the submit button on the login form when a valid email is entered with a password', () => {
    const wrapper = mount(Login)
    wrapper.find('#login').trigger('click')
    let email = wrapper.find('input[type=email]')
    email.element.value = 'avalidemail@email.com'
    email.trigger('input')
    let password = wrapper.find('input[type=password]')
    password.element.value = 'password'
    password.trigger('input')

    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).toBeNull()
  })

  //TODO
  // Add a test (which mocks the $store and emits a loginError) to see if the snackbar is displayed on invalid login
})
