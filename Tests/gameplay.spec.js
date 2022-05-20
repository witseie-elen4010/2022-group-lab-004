/* eslint-env jest */
'use strict'

const gameplay = require('../WordList')

test('All GuessWord Indexes return true if Words Are the same', () => {
  gameplay.setSolutionWord('Clean')
  const guessedWord = 'CLEAN'
  let Results = []
  Results = gameplay.EvaluateGuess(guessedWord)
  expect(Results[0]).toEqual([true, true, true, true, true])
})
test('All GuessWord Letters Indexes return true if at correct postion at Words are different', () => {
  gameplay.setSolutionWord('Learn')
  const guessedWord = 'CLEAN'
  let Results = []
  Results = gameplay.EvaluateGuess(guessedWord)
  expect(Results[0]).toEqual([false, false, false, false, true])
})

test('GuessedWord Included Letters Position Are returned', () => {
  gameplay.setSolutionWord('glass')
  const guessedWord = 'FLAGS'
  let Results = []
  Results = gameplay.EvaluateGuess(guessedWord)
  console.log(Results[1])
  expect(Results[1]).toEqual([false, true, true, true, true])
})
