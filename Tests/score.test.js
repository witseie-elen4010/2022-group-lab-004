'use strict'

let colours = []
let score = 0

const evaluateScore = function(colours, score) {
  score = 1500
  // This score evaluation follows the same procedure as the actual code
  colours.forEach(function(colour) {
    // Blocks are initialised to grey
    // Score is initialised assuming all blocks are grey
    score -= 50
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
      score += 50
    }
  })
  return score
}

test('All grey returns 1500 - 250 points', () => {
  colours = ['grey', 'grey', 'grey', 'grey', 'grey']
  expect(evaluateScore(colours, score)).toEqual(1250)
})

test('All yellow returns 1500 - 250 + 100 points', () => {
  colours = ['yellow', 'yellow', 'yellow', 'yellow', 'yellow']
  expect(evaluateScore(colours, score)).toEqual(1350)
})

test('All green returns 1500 - 250 + 250 points', () => {
  colours = ['green', 'green', 'green', 'green', 'green']
  expect(evaluateScore(colours, score)).toEqual(1500)
})

describe('Various colour compositions return correct score', () => {
  test('Green, grey and yellow mixed', () => {
    colours = ['green', 'grey', 'grey', 'yellow', 'grey']
    expect(evaluateScore(colours, score)).toEqual(1320)
  })
  test('Green, grey and yellow mixed', () => {
    colours = ['green', 'yellow', 'grey', 'green', 'yellow']
    expect(evaluateScore(colours, score)).toEqual(1390)
  })

  test('Green and yellow mixed', () => {
    colours = ['yellow', 'green', 'green', 'yellow', 'yellow']
    expect(evaluateScore(colours, score)).toEqual(1410)
  })
  test('Green and yellow mixed', () => {
    colours = ['green', 'yellow', 'green', 'green', 'yellow']
    expect(evaluateScore(colours, score)).toEqual(1440)
  })

  test('Grey and yellow mixed', () => {
    colours = ['yellow', 'grey', 'grey', 'yellow', 'grey']
    expect(evaluateScore(colours, score)).toEqual(1290)
  })
  test('Grey and yellow mixed', () => {
    colours = ['grey', 'yellow', 'grey', 'yellow', 'yellow']
    expect(evaluateScore(colours, score)).toEqual(1310)
  })

  test('Green and grey mixed', () => {
    colours = ['green', 'grey', 'grey', 'grey', 'grey']
    expect(evaluateScore(colours, score)).toEqual(1300)
  })
  test('Green and grey mixed', () => {
    colours = ['green', 'green', 'grey', 'grey', 'green']
    expect(evaluateScore(colours, score)).toEqual(1400)
  })
})