addEventListener('DOMContentLoaded', (event) => {
  let singlePoke
  let main = document.querySelector("main")

  const BASE_URL = "http://localhost:3000"
  const TRAINERS_URL = `${BASE_URL}/trainers`
  const POKEMONS_URL = `${BASE_URL}/pokemons`

  //--------------------  Functions ---------
  function buildSinglePokemonLiElement(poke){
    return `<li>${poke.nickname} (${poke.species}) <button class="release" data-pokemon-id="${poke.id}">Release</button></li>`
  }//ends buildSinglPokemonLiElement
  
  function buildPokemonLiElements(pokemonArr) {
    let liString = ""
    pokemonArr.forEach( function(poke) {
      liString += buildSinglePokemonLiElement(poke)
    }) // ends forEach loop
    return liString
  } //ends buildPokemonLiElements

  function addOneTrainerToDOM(trainer) {
    main.insertAdjacentHTML("beforeend", `
    <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul data-trainer-id='${trainer.id}'>
      ${buildPokemonLiElements(trainer.pokemons)}
    </ul>
  </div>
    `) // ends InsertAjacent HTMKL
  } // ends addOneTrainerToDOM function

  function addAllTrainers(objArr) {
    objArr.forEach( function(trainer) {
      addOneTrainerToDOM(trainer)
    })
  }//ends addAllTrainers function

  function fetchAndAddNewPokemon(trainerId) {
    fetch("http://localhost:3000/pokemons", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({trainer_id: `${trainerId}`})
    }) //Ends Fetch call
    .then (function(response) {
      return response.json()
    })
    .then (function (response) {
      if (!response.errors) {
        singlePoke = response
        main.querySelector(`ul[data-trainer-id='${trainerId}']`).insertAdjacentHTML("beforeend", buildSinglePokemonLiElement(singlePoke))
      } else { return response.errors }
    })
    .catch (function(errors) { alert(errors) })
  } // ends fetchAndAddNewPokemon function

  function fetchAndDeleteReleasedPokemon(pokeId, clickTarget) {
    fetch(`http://localhost:3000/pokemons/${pokeId}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "DELETE",
    }) //Ends Fetch call
    .then (function(response) {
      return response.json()
    })
    .then (function (response) {
      if (!response.errors) {
        clickTarget.parentElement.remove()
      } else { return response.errors }
    })
    .catch (function(errors) { alert(errors) })
  } // ends fetchAndDeleteReleasedPokemon function

  // ----------------Listeners------------
  main.addEventListener("click", function(clickEvent) {
    switch (true) {
      
      case (clickEvent.target.innerText == "Add Pokemon"):
        let trainerId = clickEvent.target.dataset.trainerId
          if (clickEvent.target.nextElementSibling.childElementCount < 6) {
            fetchAndAddNewPokemon(trainerId)
          } else {
            alert("You already gots 6, homie")
          } // ends IF trainer's Pokecount is LESS THAN 6
        break

      case (clickEvent.target.innerText == "Release"):
        let pokeId = clickEvent.target.dataset.pokemonId
        fetchAndDeleteReleasedPokemon(pokeId, clickEvent.target)
        break
    } // ends SWITCH Statement

  })//Ends Main Add Event Listener

  // ----------------- Fetch for Initial DOM Load
  fetch("http://localhost:3000/trainers")
  .then( function(results) {
    return results.json()
  })
  .then(function(results) {
    addAllTrainers(results)
  }) //ends final GET FETCH's THEN statement
});// ends Document Load Event Listener