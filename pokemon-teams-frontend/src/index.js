const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

const trainerContainer = document.getElementById("trainer-container")

fetch(TRAINERS_URL)
  .then(resp => resp.json())
  .then(trainers => {
    trainers.forEach(renderTrainer)
  })

function addPokemon(postBody) {
  return fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postBody)
  })
  .then(resp => resp.json())
}

function releasePokemon(pokemonId) {
  return fetch(`${POKEMONS_URL}/${pokemonId}`, {
    method: "DELETE"
  })
  .then(resp => resp.json())
}

function renderTrainer(trainer) {
  let pokemons = trainer.pokemons
  let trainerId = trainer.id
  trainerContainer.insertAdjacentHTML("beforeend", `
    <div class="card" data-id="${trainerId}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainerId}" data-action="add">Add Pokemon</button>
      <ul id="pokemons">
      
      </ul>
      </div>
  `)

  pokemons.forEach(pokemon => {
    renderPokemon(pokemon, trainerId)
  })  
}

function renderPokemon(pokemon, trainerId) {
  const pokemonContainer = trainerContainer.querySelector(`[data-id='${trainerId}'] ul`)

  pokemonContainer.insertAdjacentHTML("beforeend", `
    <li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}" data-action="release">Release</button></li>
  `)
}

trainerContainer.addEventListener("click", e => {
  //add a pokemon
  if (e.target.dataset.action === "add") {

    let trainerId = e.target.dataset.trainerId
    let postBody = {
      trainer_id: trainerId
    }
    //post request & pessimistic render of new guy
    addPokemon(postBody)
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
        renderPokemon(data, trainerId)
        }
      })
      .catch(err => alert(err))
    //release a pokemon
  } else if (e.target.dataset.action === "release") {
    let liToRemove = e.target.closest("li")
    let pokemonId = e.target.dataset.pokemonId
    console.log(liToRemove)
    releasePokemon(pokemonId)
    .then(data => {
      if (data.error) {alert(data.error)}
      liToRemove.remove()
    })
  }
})

      