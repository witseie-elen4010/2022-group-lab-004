const WordsList = ['Ounce', 'flesh', 'march', 'nurse', 'stage', 'glass', 'stair', 'chief', 'label']
let solutionWord

module.exports = {
  RandomSolutionWord: function () {
    solutionWord = WordsList[Math.floor((Math.random() * WordsList.length))].toUpperCase()
  },
  getSolutionWord: function () {
    return solutionWord
  },
  setSolutionWord: function (Word) {
    solutionWord = Word.toUpperCase()
  },
  CompareLetter: function (Letter, index) {
    return solutionWord[index] === Letter
  },
  IncludesLetter: function (Letter) {
    return solutionWord.includes(Letter)
  },
  EvaluateGuess: function (guessedWord) {
    const MatchingIndex = []
    const IncludedIndex = []

    for (let index = 0; index < guessedWord.length; index++) {
      MatchingIndex.push(this.CompareLetter(guessedWord[index], index))
      IncludedIndex.push(this.IncludesLetter(guessedWord[index]))
    }
    return [MatchingIndex, IncludedIndex]
  }

}
