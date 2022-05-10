const WordsList = []

module.exports = {
  getSolutionWord: function () {
    return WordsList[Math.floor((Math.random() * WordsList.length))]
  }
}
