let offset = 0
const limit = 50
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const loader = document.getElementById('loader')

// Converte Pokémon em HTML
function convertPokemonToLi(pokemon) {
    if (!pokemon || !pokemon.name || !pokemon.photo) {
        console.warn("Pokémon inválido:", pokemon)
        return ''
    }

    const typesHtml = pokemon.types && pokemon.types.length > 0
        ? pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')
        : `<li class="type unknown">Unknown</li>`

    return `
        <li class="pokemon fade-in ${pokemon.type || 'unknown'}" data-name="${pokemon.name}">
            <span class="number">#${pokemon.number || '???'}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">${typesHtml}</ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

// Cria e mostra a modal de detalhes
function showPokemonDetails(pokemon) {
    const modal = document.createElement('div')
    modal.classList.add('pokemon-modal')

    modal.innerHTML = `
        <div class="modal-content fade-in ${pokemon.type}">
            <button class="close-modal">&times;</button>
            <h2>${pokemon.name} <span>#${pokemon.number}</span></h2>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <ul class="stats">
                <li><strong>HP:</strong> ${pokemon.hp}</li>
                <li><strong>Ataque:</strong> ${pokemon.attack}</li>
                <li><strong>Defesa:</strong> ${pokemon.defense}</li>
                <li><strong>Velocidade:</strong> ${pokemon.speed}</li>
            </ul>
        </div>
    `

    document.body.appendChild(modal)

    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove())
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove()
    })
}

// Função para carregar Pokémon com animação
function loadPokemonItens(offset, limit) {
    loader.classList.remove('hidden')
    loadMoreButton.disabled = true

    pokeApi.getPokemons(offset, limit).then(pokemons => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.insertAdjacentHTML('beforeend', newHtml)

        // aplica animação em cascata
        const newCards = document.querySelectorAll('.pokemon.fade-in')
        newCards.forEach((card, index) => {
            setTimeout(() => card.classList.add('visible'), index * 100)

            card.addEventListener('click', () => {
                const pokemonName = card.dataset.name.toLowerCase()
                const selectedPokemon = pokemons.find(p => p.name === pokemonName)
                if (selectedPokemon) showPokemonDetails(selectedPokemon)
            })
        })
    }).finally(() => {
        loader.classList.add('hidden')
        loadMoreButton.disabled = false
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    loadPokemonItens(offset, limit)
})
