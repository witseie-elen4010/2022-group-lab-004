'use strict'

let colours = []
let score = 0

const evaluateScore = function(colours, score) {
  score = 0
  // This score evaluation follows the same procedure as the actual code
  colours.forEach(function(colour) {
    // Blocks are initialised to grey
    // Score is initialised assuming all blocks are grey
    score -= 10
    if(colour === 'yellow') {
      // If block is yellow add 20 points
      // 10 points to counteract the score initialisation
      // 10 points for yellow blocks
      score += 20
    }
    if(colour === 'green') {
      // If block is green add 60 points
      // 10 points to counteract the score initialisation
      // 50 points for green blocks
      score += 60
    }
  })
  return score
}

test('All grey returns -50 points', () => {
  colours = ['grey', 'grey', 'grey', 'grey', 'grey']
  expect(evaluateScore(colours, score)).toEqual(-50)
})

test('All yellow returns +50 points', () => {
  colours = ['yellow', 'yellow', 'yellow', 'yellow', 'yellow']
  expect(evaluateScore(colours, score)).toEqual(50)
})

test('All green returns +250 points', () => {
  colours = ['green', 'green', 'green', 'green', 'green']
  expect(evaluateScore(colours, score)).toEqual(250)
})

describe('Various colour compositions return correct score', () => {
  test('Green, grey and yellow mixed', () => {
    colours = ['green', 'grey', 'grey', 'yellow', 'grey']
    expect(evaluateScore(colours, score)).toEqual(30)
  })
  test('Green, grey and yellow mixed', () => {
    colours = ['green', 'yellow', 'grey', 'green', 'yellow']
    expect(evaluateScore(colours, score)).toEqual(110)
  })

  test('Green and yellow mixed', () => {
    colours = ['yellow', 'green', 'green', 'yellow', 'yellow']
    expect(evaluateScore(colours, score)).toEqual(130)
  })
  test('Green and yellow mixed', () => {
    colours = ['green', 'yellow', 'green', 'green', 'yellow']
    expect(evaluateScore(colours, score)).toEqual(170)
  })

  test('Grey and yellow mixed', () => {
    colours = ['yellow', 'grey', 'grey', 'yellow', 'grey']
    expect(evaluateScore(colours, score)).toEqual(-10)
  })
  test('Grey and yellow mixed', () => {
    colours = ['grey', 'yellow', 'grey', 'yellow', 'yellow']
    expect(evaluateScore(colours, score)).toEqual(10)
  })

  test('Green and grey mixed', () => {
    colours = ['green', 'grey', 'grey', 'grey', 'grey']
    expect(evaluateScore(colours, score)).toEqual(10)
  })
  test('Green and grey mixed', () => {
    colours = ['green', 'green', 'grey', 'grey', 'green']
    expect(evaluateScore(colours, score)).toEqual(130)
  })
})