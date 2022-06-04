function validate()
{
const chosenWord=document.getElementById("username").value;



}

const GuessedWordValidation = (chosenWord) => {
    fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${guessedWord}`,
      {
        method: 'GET'
      }
    ).then((res) => {
      if (!res.ok) {
        throw Error()
      }
  
      WordEvaluation(chosenWord)
    }).catch(() => {
      window.alert('word not in a dictioanary')
    })
  }