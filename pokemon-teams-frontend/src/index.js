const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", function() {
    const main = document.querySelector("main")

    fetch(TRAINERS_URL)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        data.forEach(function(trainer) 
            // let pokemon = trainer.pokemons.map(function(pokemon) {
            //     return  `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
            // }).join("")

            main.insertAdjacentHTML("beforeend",
            `<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
            <button data-action="add" data-trainer-id="${trainer.id}">Add Pokemon</button>
            <ul id="pokemon-list">
            </ul>
            </div>`)

            let pokemonList = main.querySelector(`div[data-id="${trainer.id}"] #pokemon-list`)
            trainer.pokemons.forEach(function(pokemon) {
                pokemonList.insertAdjacentHTML("beforeend", 
                `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`)
            })
        })
    })

    main.addEventListener("click", function(e) {
        const card = e.target.closest('.card')
        const pokeList = card.querySelector("#pokemon-list")
        if (e.target.dataset.action === "add") {
            // if (pokeList.querySelectorAll('li').length < 6) {
                fetch(POKEMONS_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({trainer_id: e.target.dataset.trainerId})
                })
                .then(function(response) {
                    return response.json()
                })
                .then(function(pokemon) {
                    if (pokemon.error) {
                        alert(pokemon.error)
                    }
                    else {
                        pokeList.insertAdjacentHTML("beforeend",
                        `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`)
                    }
                })
            // }
            // else {
            //     alert("You already have 6 pokemon, please release one pokemon before adding more")
            // }
        }
        else if (e.target.className === "release") {
            fetch(`${POKEMONS_URL}/${e.target.dataset.pokemonId}`, {
                method: "DELETE"
            })
            .then(function(data) {
                e.target.closest('li').remove()
            })
        }
    })
})