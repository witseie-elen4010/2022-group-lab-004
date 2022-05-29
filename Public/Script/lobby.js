const button = document.getElementById('JoinGame')
button.addEventListener('click', function () {
  location = String(location).replace("hostlobby", "multiPlayer")
  const action = 'startMultiRand'
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action})
  }
  fetch('/api/logAction', options)
  .then(result => result.json())
  .catch((error) => {
    console.error('Error:', error)
  })
}, false) 