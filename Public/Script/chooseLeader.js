let logger = []

class Vote {
  constructor(root, title) {
      this.root = root;
      this.selected = sessionStorage.getItem("vote-selected"); // So that js can remember which option I chose 
      this.endpoint = "http://localhost:3000/vote";


      this.root.insertAdjacentHTML("afterbegin", `
          <div class="voteTitle">${ title }</div>
      `);

      this._refresh(); // call the api and retreve the votes

  }

  async _refresh() {
      const response = await fetch(this.endpoint); //string of url
      const data = await response.json();//convert from json to js

      // if you refresh the page you'll clear the data
      this.root.querySelectorAll(".voteOption").forEach(option => {
          option.remove();
      });

      for (const option of data) {
          const template = document.createElement("template");//build up a new set of element for our options
          const fragment = template.content;

          template.innerHTML = `
              <div class="voteOption ${ this.selected == option.label ? "voteOption--selected": "" }">
                  <div class="voteOption-fill"></div>
                  <div class="voteOption-info">
                      <span class="voteOption">${ option.label }</span>
                      <span class="voteOption">${ option.percentage }%</span>
                  </div>
              </div>
          `;

        //logic for the option that is chosen  
          if (!this.selected) {
              fragment.querySelector(".voteOption").addEventListener("click", () => {
                  fetch(this.endpoint, {
                      method: "post",
                      body: `add=${ option.label }`,// adds the player chosen
                      headers: {
                          "Content-Type": "application/x-www-form-urlencoded" // tells the serverthe type of data in body
                           
                        }
                  })
                  .then(() => {
                      this.selected = option.label;

                      sessionStorage.setItem("vote-selected", option.label); //remebers what you chose when you refresh

                      this._refresh();
                  })
              });
          } 

          fragment.querySelector(".voteOption-fill").style.width = `${ option.percentage }%`;

          this.root.appendChild(fragment);

          if (option.percentage== 33)
          {
            location = String(location).replace("chooseLeader", "multiPlayer")
          }


      }
      
  }
}
let counter =0;

const v = new Vote(
  document.querySelector(".vote"),
  "Who do you want to be the leader?"
);

const displayResults = document.getElementById('name')
const action = 'accessLog'
let options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({action})
}
fetch('/api/logAction', options)
.then(response => response.json())
.then(data => {
  data.recordset.forEach(element => {
    const displayText = document.createElement('h5')
    const text = document.createTextNode(`${element.playerID}`)
    displayText.appendChild(text)
    displayResults.appendChild(displayText)
    logger.push(element.playerID)

  })
})
.catch((error) => {
  console.error('Error:', error)
})
