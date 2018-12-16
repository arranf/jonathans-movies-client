/* eslint-disable */ 
import getters from '@/store/option/getters' 
import startState from '../exampleState'

describe('getOptionsForPollByUser', () => {
  let state;
  let userId;
  let poll;

  beforeEach(() => {
    state = startState.option;
    poll = {_id: '5b0892a47ed2e65d86dd8f91', options: [
      {_id: '5b0892a47ed2e65d86dd8f92', name: '92'}, {_id: '5b0892b27ed2e65d86dd8f93', name: '93'}
    ]};
    userId = '59cba12cf67f7507c5812182';
  })

  it('getOptionsForPollByUser returns only options added by user', () => {
    const matchingOption = {poll_id: poll.id, added_by_user_id: userId}
    const mockGetters = {
      getOptionsForPoll: (poll) => [matchingOption, {poll_id: poll._id, added_by_user_id: 'not the regular user id'}]
    }
    const result = getters.getOptionsForPollByUser(state, mockGetters)(poll, userId)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(matchingOption)
  })

  it('getOptionsForPollByUser returns an empty array if no options match the user id', () => {
    const mockGetters = {
      getOptionsForPoll: (poll) => [{poll_id: poll._id, added_by_user_id: 'not the regular user id'}]
    }
    const result = getters.getOptionsForPollByUser(state, mockGetters)(poll, userId)
    expect(result).toHaveLength(0)
  })

  it('getOptionsForPollByUser returns an empty array if the userId is null', () => {
    const matchingOption = {poll_id: '5b0892a47ed2e65d86dd8f91', added_by_user_id: userId}
    const mockGetters = {
      getOptionsForPoll: (poll) => [matchingOption, {poll_id: '5b0892a47ed2e65d86dd8f91', added_by_user_id: 'not the regular user id'}]
    }
    const result = getters.getOptionsForPollByUser(state, mockGetters)(poll, null)
    expect(result).toHaveLength(0)
  })
})