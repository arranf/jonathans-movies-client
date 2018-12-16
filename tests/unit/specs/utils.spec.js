import { groupBy } from '@/utils'

describe('Utils', () => {
  it('Group By Works on a simple array of strings', () => {
    const startState = ['one', 'two', 'three', 'four']
    const result = groupBy(startState, 'length')
    const expected = { 3: ['one', 'two'], 4: ['four'], 5: ['three'] }
    expect(result[3]).toEqual(expected[3])
    expect(result[4]).toEqual(expected[4])
    expect(result[5]).toEqual(expected[5])
  })

  it('Group By Works on an array of objects', () => {
    const startState = [{ option_id: '1', vote_id: 1 }, { option_id: '1', vote_id: 2 }, { option_id: '2', vote_id: 3 }]
    const result = groupBy(startState, 'option_id')
    const expected = { '1': [{ option_id: '1', vote_id: 1 }, { option_id: '1', vote_id: 2 }], '2': [{ option_id: '2', vote_id: 3 }] }
    expect(result['1']).toEqual(expected['1'])
    expect(result['2']).toEqual(expected['2'])
  })
})
