document.addEventListener("DOMContentLoaded", () => {
  var frase = document.getElementById("text-option")
  var jogador = document.getElementById("player")
  var monstro = document.getElementById("monster")
  var maoDiv = document.getElementById("mao")
  var maoMonstroDiv = document.getElementById("maoMonstro")
  var h3Jogador = document.querySelector("#mao-container h3")
  var h3Monstro = document.querySelector("#maoMonstro-container h3")

  var baralho = [
    "../Imagens/machado.png",
    "../Imagens/escudo.png",
    "../Imagens/espada.png",
  ]
  var pontos = parseInt(localStorage.getItem("pontos")) || 0

  // Inicializando 5 cartas para cada mão
  var mao = JSON.parse(localStorage.getItem("mao")) || [0, 1, 2, 0, 1]
  var maoMonstro = JSON.parse(localStorage.getItem("maoMonstro")) || [
    2, 1, 0, 2, 1,
  ]

  function salvarEstado() {
    localStorage.setItem("pontos", pontos)
    localStorage.setItem("mao", JSON.stringify(mao))
    localStorage.setItem("maoMonstro", JSON.stringify(maoMonstro))
  }

  function renderMao() {
    if (!maoDiv) return
    maoDiv.innerHTML = ""
    mao.forEach((carta, i) => {
      let img = document.createElement("img")
      img.src = baralho[carta]
      img.onclick = () => select(i)
      maoDiv.appendChild(img)
    })
    const pontosEl = document.getElementById("pontos")
    if (pontosEl) pontosEl.textContent = "Pontos: " + pontos
  }

  function renderMaoMonstro() {
    if (!maoMonstroDiv) return
    maoMonstroDiv.innerHTML = ""
    maoMonstro.forEach((carta) => {
      let img = document.createElement("img")
      img.src = baralho[carta]
      maoMonstroDiv.appendChild(img)
    })
  }

  renderMao()
  renderMaoMonstro()

  if (jogador) jogador.style.top = "50%"
  if (monstro) monstro.style.top = "50%"

  let animInterval

  function select(userIndex) {
    if (mao.length === 0 || maoMonstro.length === 0) return

    // Esconde mãos, h3, background e borda dos containers
    if (maoDiv) maoDiv.style.display = "none"
    if (maoMonstroDiv) maoMonstroDiv.style.display = "none"
    if (h3Jogador) h3Jogador.style.display = "none"
    if (h3Monstro) h3Monstro.style.display = "none"
    // Remove background e borda dos containers
    var maoContainer = document.getElementById("mao-container")
    var maoMonstroContainer = document.getElementById("maoMonstro-container")
    if (maoContainer) {
      maoContainer.style.background = "none"
      maoContainer.style.border = "none"
    }
    if (maoMonstroContainer) {
      maoMonstroContainer.style.background = "none"
      maoMonstroContainer.style.border = "none"
    }

    // Mostra cronômetro
    if (frase) {
      frase.style.display = "block"
      frase.textContent = "3"
    }

    // Carta do jogador centralizada
    if (jogador) {
      jogador.src = baralho[mao[userIndex]]
      jogador.classList.add("fly-center")
      jogador.style.left = "45%"
      jogador.style.top = "-5%"
      jogador.style.display = "block"
    }

    // Carta do monstro ao lado direito, mesmo nível
    if (monstro) {
      monstro.classList.add("fly-center")
      monstro.style.left = "55%"
      monstro.style.top = "-5%"
      monstro.style.display = "block"
    }

    // Animação mais suave
    animInterval = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * 3)
      if (monstro) monstro.src = baralho[randomIndex]
    }, 150)

    let tempo = setInterval(() => {
      let cron = parseInt(frase.textContent)
      cron--
      frase.textContent = cron
      if (cron === 0) {
        clearInterval(tempo)
        clearInterval(animInterval)

        // Carta final do monstro
        let monstroCard = Math.floor(Math.random() * 3)
        if (monstro) monstro.src = baralho[monstroCard]

        let userCard = mao[userIndex]
        // Resultado
        if (userCard === monstroCard) {
          frase.textContent = "Empate!"
        } else if (
          (userCard === 0 && monstroCard === 2) ||
          (userCard === 1 && monstroCard === 0) ||
          (userCard === 2 && monstroCard === 1)
        ) {
          pontos++
          frase.textContent = "Você venceu"
        } else {
          frase.textContent = "Você perdeu"
        }

        // Remove cartas jogadas
        mao.splice(userIndex, 1)
        let idxMonstro = Math.floor(Math.random() * maoMonstro.length)
        maoMonstro.splice(idxMonstro, 1)

        salvarEstado()
        renderMao()
        renderMaoMonstro()

        // Volta mãos e H3 após 1,5s
        setTimeout(() => {
          if (jogador) jogador.style.display = "none"
          if (monstro) monstro.style.display = "none"
          if (jogador) jogador.style.background = "transparent"
          if (monstro) monstro.style.background = "transparent"
          if (frase) frase.style.display = "none"
          if (maoDiv) maoDiv.style.display = "flex"
          if (maoMonstroDiv) maoMonstroDiv.style.display = "flex"
          if (h3Jogador) h3Jogador.style.display = "block"
          if (h3Monstro) h3Monstro.style.display = "block"
          // Restaura background e borda dos containers
          var maoContainer = document.getElementById("mao-container")
          var maoMonstroContainer = document.getElementById(
            "maoMonstro-container"
          )
          if (maoContainer) {
            maoContainer.style.background = "#1c1b49"
            maoContainer.style.border = "2px solid #caf0f8"
          }
          if (maoMonstroContainer) {
            maoMonstroContainer.style.background = "#1c1b49"
            maoMonstroContainer.style.border = "2px solid #caf0f8"
          }
        }, 1500)

        verificarFimDeJogo()
      }
    }, 1000)
  }

  function verificarFimDeJogo() {
    if (mao.length === 0 || maoMonstro.length === 0) {
      let msg =
        mao.length === 0 && maoMonstro.length === 0
          ? "Empate Final! Ambos sem cartas!"
          : mao.length === 0
          ? "Fim! Você ficou sem cartas!"
          : "Fim! O monstro ficou sem cartas!"
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "FIM DE JOGO",
        showConfirmButton: false,
        timer: 3000,
        text: msg + "\nPlacar final: " + pontos + " ponto(s).",
      })
    }
  }

  // Expondo resetarJogo globalmente para uso em HTML (onclick)
  window.resetarJogo = function () {
    localStorage.clear()
    location.reload()
  }
})
