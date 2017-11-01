/* eslint-disable */
import { shallow, mount } from 'vue-test-utils'
import Login from '@/components/Login/Login'

describe('Login.vue', () => {
  it('should display alert when isError = true', () => {
    const wrapper = shallow(Login)
    wrapper.setData({isError: true})
    expect(wrapper.contains('alert'))
  })

  it('should not display alert when isError = false', () => {
    const wrapper = shallow(Login)
    wrapper.setData({isError: false})
    expect(wrapper.contains('alert')).to.be.false
  })

  it('should not display alert when initially created', () => {
    const wrapper = shallow(Login)
    expect(wrapper.contains('alert')).to.be.false
  })

  it('should render the div containing the login buttons when the component is initially created', () => {
    const wrapper = shallow(Login)
    let loginDiv = wrapper.find('#loginOptions')
    expect(loginDiv.contains('#facebook'))
    expect(loginDiv.contains('#login'))
  })

  it('should not render the div containing the login buttons when the login button is clicked', () => {
    const wrapper = mount(Login)
    let loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    expect(wrapper.contains('#loginOptions')).to.be.false
  })

  it('should render the login form when the login button is clicked', () => {
    const wrapper = mount(Login)
    const loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    expect(wrapper.contains('#internalLoginForm'))
  })

  it('should not render the login form when the component is initially created', () => {
    const wrapper = shallow(Login)
    expect(wrapper.contains('#internalLoginForm')).to.be.false
  })

  it('should disable the submit button on the login form when a valid email is entered with no password', () => {
    const wrapper = mount(Login)
    const loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    const email = wrapper.find('input[type=email]')
    email.element.value = 'invalidemail'
    email.trigger('input')
    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).to.equal('disabled')
  })

  it('should disable the submit button on the login form when a password is entered with no email', () => {
    const wrapper = mount(Login)
    const loginButton = wrapper.find('#login')
    loginButton.trigger('click')
    const password = wrapper.find('input[type=password]')
    password.element.value = 'password'
    password.trigger('input')

    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).to.equal('disabled')
  })

  it('should disable the submit button on the login form when an no email or password are entered', () => {
    const wrapper = mount(Login)
    wrapper.find('#login').trigger('click')

    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).to.equal('disabled')
  })

  it('should disable the submit button on the login form when an invalid email is entered with a password', () => {
    const wrapper = mount(Login)
    wrapper.find('#login').trigger('click')
    const email = wrapper.find('input[type=email]')
    email.element.value = 'invalidemail'
    email.trigger('input')
    const password = wrapper.find('input[type=password]')
    password.element.value = 'password'
    password.trigger('input')

    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).to.equal('disabled')
  })

  it('should enable the submit button on the login form when a valid email is entered with a password', () => {
    const wrapper = mount(Login)
    wrapper.find('#login').trigger('click')
    const email = wrapper.find('input[type=email]')
    email.element.value = 'avalidemail@email.com'
    email.trigger('input')
    const password = wrapper.find('input[type=password]')
    password.element.value = 'password'
    password.trigger('input')

    let submitButton = wrapper.find('#submit')
    expect(submitButton.element.getAttribute('disabled')).to.be.null
  })
})
