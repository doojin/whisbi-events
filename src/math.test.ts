import { sum } from './math'

describe('math', () => {
  describe('sum', () => {
    test('returns sum of two numbers', () => {
      expect(sum(1, 2)).toEqual(3)
    })
  })
})
