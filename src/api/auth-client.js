
import AuthManagement from 'feathers-authentication-management/lib/client'
import feathersClient from './feathers-client'

export default new AuthManagement(feathersClient)
