document.addEventListener("DOMContentLoaded", function() {
    const BASE_URL = "http://localhost:3000"
    const TRAINERS_URL = `${BASE_URL}/trainers`
    const POKEMONS_URL = `${BASE_URL}/pokemons`

    const container = document.querySelector(".container")
    let all_trainers;

    fetch(TRAINERS_URL)
    .then(response => response.json())
    .then(renderTrainers)

    function renderTrainers(trainers) {
        trainers.forEach(function(trainer) {
            let str = 
            `<div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
            <button data-trainer-id="${trainer.id}">Add Pokemon</button>
            <ul data-id="poke-list-${trainer.id}"></ul>
            </div>`
            container.insertAdjacentHTML("beforeend", str)

            trainer.pokemons.forEach(function(pokemon) {
                let str2 = 
                `<li data-pokemon-id=${pokemon.id}>${pokemon.nickname} (${pokemon.species}) 
                <button class="release" data-pokemon-id="${pokemon.id}" data-trainer-id="${trainer.id}">Release</button></li>`
                document.querySelector(`[data-id="poke-list-${trainer.id}"]`).insertAdjacentHTML("beforeend", str2)
            })
        })

        all_trainers = [...trainers]
    }

    container.addEventListener("click", function(event) {
        let trainer_id = parseInt(event.target.dataset.trainerId)
        let trainer = all_trainers.find(function(trainer) {
            return trainer.id === trainer_id
        })

        // trainer.pokemons.length 

        if (event.target.innerText === "Add Pokemon" && event.target.nextElementSibling.childElementCount < 6) {
            fetch(POKEMONS_URL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"trainer_id": trainer_id })
            })
            .then(response => response.json())
            .then(function(data) {
                // trainer.pokemons.push(data)
                let str2 = `<li>${data.nickname} (${data.species}) <button class="release" data-pokemon-id="${data.id}">Release</button></li>`
                document.querySelector(`[data-id="poke-list-${trainer_id}"]`).insertAdjacentHTML("beforeend", str2)
            }) 
        } else if (event.target.innerText === "Release") {
            let pokemon_id = parseInt(event.target.dataset.pokemonId)
            // debugger
            // let trainer1 = all_trainers.find(function(trainer) {return trainer.id === parseInt(event.target.dataset.trainerId)})
            fetch(`${POKEMONS_URL}/${pokemon_id}`, {
                method: "DELETE",
            })
            .then(response => response.json())
            .then(function(data) {
                event.target.parentElement.remove()

                // trainer = all_trainers.find(function(trainer) {return trainer.id === data.trainer_id})
                // debugger
                // trainer1.pokemons = trainer1.pokemons.filter(function (pokemon) {return pokemon.id !== data.id})
                // document.querySelector(`[data-id="poke-list-${trainer1.id}"]`).querySelector(`[data-pokemon-id="${pokemon_id}"]`).innerText = ''
            })
        }

    })

})


