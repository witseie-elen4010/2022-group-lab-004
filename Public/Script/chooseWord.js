const buttonSingle = document.getElementById('send')
buttonSingle.addEventListener('click', function () {
  location = String(location).replace('chooseWord', 'singleplayer')
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  } 
  fetch('/api/chooseWord', options)
    .then(result => result.json())
    .catch((error) => {
      console.error('Error:', error)
    })
})

/*
const buttonSingle = document.getElementById('send')
buttonSingle.addEventListener('click', function () {
validate()
})

function validate()
{
  const chosenWord = document.getElementById("username").value;
  const SubmitGuessedWord = () => {
    
    if (chosenWord.length === 5) {

      GuessedWordValidation(chosenWord)
      //location = String(location).replace("chooseWord", "multiPlayer")

    } else {
      window.alert('Not Enough Letters')
    }
  }
  SubmitGuessedWord()

    
  const GuessedWordValidation = (chosenWord) => {
      fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${chosenWord}`,
        {
          method: 'GET'
        }
      ).then((res) => {
        if (!res.ok) {
          throw Error()
        }
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action })
          
        }
        fetch('/api/chooseWord', options)
        .catch((error) => {
          console.error('Error:', error)
        })
        
      }).catch(() => {
        window.alert('word not in a dictioanary')
      })
    }

    
  //console.log("name: "+chosenWord)
}*/
