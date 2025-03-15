<!-- pages/index.vue -->
<template>
    <div class="game-container">
      <h1>Flappy Bird</h1>
      <div class="game-wrapper">
        <div class="overlay">
          <p class="score">Score: {{ score }}</p>
          <button v-if="gameOver" @click="restartGame">Chơi lại</button>
        </div>
        <canvas ref="gameCanvas" width="400" height="600"></canvas>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  
  const gameCanvas = ref(null)
  const score = ref(0)
  const gameOver = ref(false)
  
  let ctx, bird, pipes, animationFrameId
  
  const initGame = () => {
    const canvas = gameCanvas.value
    ctx = canvas.getContext('2d')
  
    bird = {
      x: 50,
      y: 300,
      width: 30,
      height: 25,
      velocity: 0,
      gravity: 0.5,
      lift: -10
    }
    pipes = []
    score.value = 0
    gameOver.value = false
  
    let frameCount = 0
  
    const drawBird = () => {
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.arc(bird.x + bird.width/2, bird.y + bird.height/2, bird.width/2, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.fillStyle = '#FFA500'
      ctx.fillRect(bird.x + 5, bird.y + bird.height/2, 15, 5)
      
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(bird.x + bird.width - 5, bird.y + 5, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'black'
      ctx.beginPath()
      ctx.arc(bird.x + bird.width - 5, bird.y + 5, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  
    const createPipe = () => {
      const gap = 150
      const pipeHeight = Math.random() * (canvas.height - gap - 100) + 50
      pipes.push({
        x: canvas.width,
        top: pipeHeight,
        bottom: canvas.height - pipeHeight - gap,
        width: 50,
        passed: false
      })
    }
  
    const drawPipes = () => {
      pipes.forEach(pipe => {
        // Ống trên
        ctx.fillStyle = '#00FA9A' // Medium Spring Green
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top)
        ctx.fillStyle = '#00CD66' // Viền sáng hơn
        ctx.fillRect(pipe.x - 2, 0, 4, pipe.top)
        ctx.fillRect(pipe.x + pipe.width - 2, 0, 4, pipe.top)
  
        // Ống dưới
        ctx.fillStyle = '#00FA9A'
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom)
        ctx.fillStyle = '#00CD66'
        ctx.fillRect(pipe.x - 2, canvas.height - pipe.bottom, 4, pipe.bottom)
        ctx.fillRect(pipe.x + pipe.width - 2, canvas.height - pipe.bottom, 4, pipe.bottom)
      })
    }
  
    const update = () => {
      bird.velocity += bird.gravity
      bird.y += bird.velocity
  
      frameCount++
      if (frameCount % 100 === 0) createPipe()
  
      pipes.forEach(pipe => {
        pipe.x -= 2
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
          score.value++
          pipe.passed = true
        }
      })
  
      pipes = pipes.filter(pipe => pipe.x + pipe.width > 0)
    }
  
    const checkCollision = () => {
      if (bird.y < 0 || bird.y + bird.height > canvas.height) return true
      for (const pipe of pipes) {
        if (
          bird.x + bird.width > pipe.x &&
          bird.x < pipe.x + pipe.width &&
          (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
          return true
        }
      }
      return false
    }
  
    const gameLoop = () => {
      if (gameOver.value) return
  
      // Gradient nền tươi sáng
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#40C4FF') // Light Blue
      gradient.addColorStop(1, '#B2EBF2') // Cyan nhạt
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
  
      update()
      drawBird()
      drawPipes()
  
      if (checkCollision()) {
        gameOver.value = true
        cancelAnimationFrame(animationFrameId)
      } else {
        animationFrameId = requestAnimationFrame(gameLoop)
      }
    }
  
    const flap = () => {
      if (!gameOver.value) bird.velocity = bird.lift
    }
  
    window.addEventListener('keydown', handleKeydown)
    canvas.addEventListener('click', flap)
  
    gameLoop()
  }
  
  const handleKeydown = (e) => {
    if (e.code === 'Space' && !gameOver.value) bird.velocity = bird.lift
  }
  
  onMounted(() => {
    initGame()
  })
  
  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('keydown', handleKeydown)
    gameCanvas.value?.removeEventListener('click', () => {})
  })
  
  const restartGame = () => {
    cancelAnimationFrame(animationFrameId)
    initGame()
  }
  </script>
  
  <style scoped>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Arial', sans-serif;
    margin: 20px auto;
    max-width: 500px;
    background: linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%);
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    color: #0288D1;
    font-size: 2.5em;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
  }
  
  .game-wrapper {
    position: relative;
  }
  
  canvas {
    border: 2px solid #0288D1;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
  
  .overlay {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
  }
  
  .score {
    font-size: 1.5em;
    color: white;
    background: rgba(2, 136, 209, 0.8);
    padding: 5px 15px;
    border-radius: 20px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }
  
  button {
    pointer-events: auto;
    padding: 8px 20px;
    font-size: 1.1em;
    background: linear-gradient(45deg, #FF4081, #F06292);
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(255, 64, 129, 0.4);
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 64, 129, 0.6);
  }
  
  button:active {
    transform: translateY(1px);
  }
  </style>