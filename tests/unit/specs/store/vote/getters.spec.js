/* eslint-disable */ 
import getters from '@/store/vote/getters' 
import startState from '../exampleState'
 
describe('Vote Getters', () => { 
  let state;
  let poll;

  beforeEach(() => { 
    state = startState.vote
    poll = {_id: '5b0892a47ed2e65d86dd8f91', options: [
      {_id: '5b0892a47ed2e65d86dd8f92', name: '92'}, {_id: '5b0892b27ed2e65d86dd8f93', name: '93'}
    ]};
  }) 
 
  it('getVotesByOption Produces Correct Array of Maps When Options Exist', () => {
    const result = getters.getVotesByOption(state)(poll)
    
    expect(result.length).toBe(2)
    expect(result[0].option_id).toBe('5b0892b27ed2e65d86dd8f93')
    expect(result[0].votes.length).toBe(1)
    expect(result[1].option_id).toBe('5b0892a47ed2e65d86dd8f92')
    expect(result[1].votes.length).toBe(0)
  })

  it('getVoteCountsByOption Produces Correct Vote Counts', () => {
    let mockGetters = {
      getVotesByOption: () => [{option_id: '5b0892b27ed2e65d86dd8f93', votes: []}, {option_id: '5b0892a47ed2e65d86dd8f92', votes: [{}]}]
    }
    const result = getters.getVoteCountsByOption(state, mockGetters)(poll)
    expect(result).toEqual([{option_id: '5b0892b27ed2e65d86dd8f93', totalVotes: 0 }, {option_id: '5b0892a47ed2e65d86dd8f92', totalVotes: 1 }]) 
  })

  it('getGraphData Sorts The Data From High to Low', () => {
    let mockGetters = {
      getVoteCountsByOption: () => [{option_id: '5b0892b27ed2e65d86dd8f94', totalVotes: 5}, {option_id: '5b0892b27ed2e65d86dd8f93', totalVotes: 0 }, {option_id: '5b0892a47ed2e65d86dd8f92', totalVotes: 1 }]
    }

    poll.options.push({_id: '5b0892b27ed2e65d86dd8f94', name: '94'})

    const result = getters.getGraphData(state, mockGetters)(poll)
    expect(result[0].votes).toBe(5)
  })

  it('getGraphData Has The Correct Data Structure', () => {
    let mockGetters = {
      getVoteCountsByOption: () => [{option_id: '5b0892b27ed2e65d86dd8f94', totalVotes: 5}, {option_id: '5b0892b27ed2e65d86dd8f93', totalVotes: 0 }, {option_id: '5b0892a47ed2e65d86dd8f92', totalVotes: 1 }]
    }
    poll.options.push({_id: '5b0892b27ed2e65d86dd8f94', name: '94'})

    const expected = [{name: '93', votes: 0}, {name: '94', votes: 5}, {name: '92', votes: 1}]

    const result = getters.getGraphData(state, mockGetters)(poll)
    expect(result).toHaveLength(3)
    expect(result).toEqual(expect.arrayContaining(expected))
  })

  it('areVotesForPoll returns true when there are votes for a given poll', () => {
    let mockGetters = {
      getVoteCountsByOption: () => [{option_id: '5b0892b27ed2e65d86dd8f94', totalVotes: 5}, {option_id: '5b0892b27ed2e65d86dd8f93', totalVotes: 0 }, {option_id: '5b0892a47ed2e65d86dd8f92', totalVotes: 1 }]
    }
    const result = getters.areVotesForPoll(state, mockGetters)(poll)
    expect(result).toBe(true)
  })

  it('areVotesForPoll returns false when there are no votes for a given poll', () => {
    let mockGetters = {
      getVoteCountsByOption: () => [{option_id: '5b0892b27ed2e65d86dd8f93', totalVotes: 0 }, {option_id: '5b0892a47ed2e65d86dd8f92', totalVotes: 0 }]
    }
    const result = getters.areVotesForPoll(state, mockGetters)(poll)
    expect(result).toBe(false)
  })

  it('getNumberOfUniqueVoters returns the correct number of voters for a poll (no-dupes)', () => {
    const result = getters.getNumberOfUniqueVoters(state)(poll._id)
    expect(result).toBe(1)
  })

  it('getNumberOfUniqueVoters returns the correct number of voters for a poll (dupes)', () => {
    // Add a duplicate key for the user
    state.keyedById['5b0893d57ed2e65d86dd8f93'] = {
        "_id": "5b0893d57ed2e65d86dd8f93",
        "poll_id": "5b0892a47ed2e65d86dd8f91",
        "option_id": "5b0892b27ed2e65d86dd8f93",
        "createdAt": "2018-05-25T22:53:09.314Z",
        "updatedAt": "2018-05-25T22:53:09.314Z",
        "user_id": "59cba12cf67f7507c5812182"
      }
      
      const result = getters.getNumberOfUniqueVoters(state)(poll._id)
      expect(result).toBe(1)
  })

  it('getNumberOfUniqueVoters returns 0 when the pollId passed is not for a poll in state', () => {    
      const result = getters.getNumberOfUniqueVoters(state)('Thursday')
      expect(result).toBe(0)
  })
})