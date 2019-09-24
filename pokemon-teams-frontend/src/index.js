const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const trainerCardsPanel = document.querySelector("body > main")
let trainersData;

getAllTrainers().then(seeAllTrainers)



function seeAllTrainers(trainers){
  trainersData = trainers 
  trainers.forEach(renderOneTrainer)
}

function renderOneTrainer(trainer){
  const pokemonLis = trainer.pokemons.map(pokemon => {
    return `<li>${pokemon.nickname} (${pokemon.species}) <button data-action="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
  })

  const cardInfo = `
    <div class="card" data-id=${trainer.id}><p>${trainer.name}</p>
      <button data-action="add" data-trainer-id=${trainer.id}>Add Pokemon</button>
      <ul id=${trainer.id}>
        ${pokemonLis.join("")}
      </ul>
    </div>
  `
  trainerCardsPanel.insertAdjacentHTML('beforeend', cardInfo)
  
  trainerCardsPanel.addEventListener('click', clickAddPokemon)
  trainerCardsPanel.addEventListener('click', clickRelease)

  // ALTERNATIVE STRATEGY - adding the pokemon to the cards 
  // const pokemonArr = trainer.pokemons
  
  // pokemonArr.forEach(pokemon => {
  //   const trainerUl = document.getElementById(`${pokemon.trainer_id}`);
  //   if(pokemon.trainer_id === parseInt(trainerUl.id)){
  //     const pokemonLi = `<li>${pokemon.nickname} ${pokemon.species} <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`

  //     trainerUl.insertAdjacentHTML("beforeend", pokemonLi)
  //   }
  // })

}

function clickAddPokemon(e){
  if(e.target.dataset.action === "add"){
  const trainerId = parseInt(e.target.dataset.trainerId)
  const trainerMatch = trainersData.find(trainer => trainerId === trainer.id)
  const pokemonArr = trainerMatch.pokemons
    if(pokemonArr.length < 6){
        postNewPokemon(trainerMatch.id).then(pokemon => {
          const ul = e.target.parentElement.querySelector('ul')
          ul.insertAdjacentHTML('beforeend', `<li>${pokemon.nickname} (${pokemon.species}) <button data-action="release" data-pokemon-id="${pokemon.id}">Release</button></li>`)
          pokemonArr.push(pokemon)
        })
    } else if(pokemonArr.length >= 6) {
      alert('You already have too many Pokemon!')
    }
  }
}

function renderOnePokemon(pokemon){
  debugger
  const newPokemonLi = `<li>${pokemon.nickname} (${pokemon.species}) <button data-action="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
}

function clickRelease(e){
  debugger
  if(e.target.innerText === "Release"){
    // const pokemonLi = e.target.closest('li') 
    const pokemonId = e.target.dataset.pokemonId  
    deletePokemon(pokemonId).then(e.target.parentElement.remove())
  }
}


//FETCHES

function getAllTrainers(){
  return fetch(TRAINERS_URL)
    .then(resp => resp.json())
}

function postNewPokemon(trainerId){
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"trainer_id": trainerId})
  }
  
  return fetch(POKEMONS_URL, options)
    .then(resp => resp.json())
}

function deletePokemon(pokemonId){

  const options = {
    method: "DELETE"
  }

  return fetch(POKEMONS_URL + `/${pokemonId}`, options)
    .then(response => response.json())
}