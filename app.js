document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')

    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
      '#FF6347',
      '#FFA07A',
      '#ba55d3',
      '#9370DB',
      '#9ACD32',
      '#FF69B4',
      '#98FB98'
    ]
    // Hình :v
    const hìnhJ = [
      [1, 11, 21, 2],//j ngược
      [width, width+1, width+2, width*2+2],//j trái
      [1, 11, 21, 20],//j
      [10, 20, 21, 22],//j trái
    ]
    const hìnhL = [
      [0,1,11,21],
      [10,11,12,2],
      [1,11,21,22],
      [10,0,1,2],
    ]
    const hìnhZ = [
      [0, 1, 11, 12],
      [1, 11, 10, 20],
      [0, 1, 11, 12],
      [1, 11, 10, 20],
      /*[12,11,21,20],
      [1,11,12,22],*/
    ]
    const hìnhO = [
      [0, 1, 10, 11],
      [0, 1, 10, 11],
      [0, 1, 10, 11],
      [0, 1, 10, 11],
    ]
    const hìnhT = [
      [0, 1, 2, 11],
      [10, 11, 12, 1],
      [1, 11, 21, 10],
      [1, 11, 21, 12],
    ]
    const hìnhI = [
      [1, 11, 21, 31],
      [10, 11, 12, 13],
      [1, 11, 21, 31],
      [10, 11, 12, 13],
    ]
    const hìnhZ2 = [
      [1,2,11,10],
      [1,11,12,22],
      [1,2,11,10],
      [1,11,12,22],
    ]
    const theTetrominoes = [hìnhJ, hìnhI, hìnhO,hìnhT,hìnhZ,hìnhL]
    let currentPosition = 4
    let currentRotation = 0
    //random
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
    //draw test
    function draw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.borderColor = colors[random]
        squares[currentPosition + index].style.boxShadow = "inset 0 0 0.35em 0 " + colors[random] + ", 0 0 0.35em 0 " + colors[random];
        squares[currentPosition + index].style.opacity = "1";
      })
    }
    //undraw
    function undraw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.borderColor = ''
        squares[currentPosition+index].style.boxShadow=''
      })
    }
    //make the tetromino fall down every second
    //control
    function control(e) {
      if(e.keyCode === 37) {
        moveLeft()
      }
      else if (e.keyCode ===38) {
        rotate()

      }
      else if (e.keyCode === 39) {
        moveRight()
      }
      else if (e.keyCode === 40) {
        moveDown()
      }
    }
    document.addEventListener('keydown',control)
    //move down function
    function moveDown() {
      undraw()
      currentPosition += width
      draw()
      freeze()
    }
    //freeze
    function freeze() {
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index =>
          squares[currentPosition + index].classList.add('taken')
        )

        //start a new one
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
      }
    }
    //blockage for left right
    function moveLeft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

      if(!isAtLeftEdge) currentPosition -=1

      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }
      draw()
    }
    function moveRight() {
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)

      if(!isAtRightEdge) currentPosition +=1

      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
      draw()
    }
    function checkCurrentPosition(P){
      P = P || currentPosition
    }
    //rotate
    function rotate() {
      undraw()
      currentRotation ++
      if(currentRotation === current.length) {
        currentRotation = 0
      }
      current = theTetrominoes[random][currentRotation]
    }
    //show up-next in mini
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    //no rotation
    const upNextTetrominoes = [
      //count differently from the first div
      [8,13,18,17],//j
      [2,7,12,17],//i
      [6,7,8,11],// o
      [6,7,8,12],//t
      [6,7,12,13],//z
      [6,11,16,17],//L
      [7,8,12,11]//z
    ]
    //display the shape in mini
    function displayShape() {
      //remove any trace of a tetrominomm   form the entire grid
      displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.borderColor = ''
        square.style.boxShadow = ''
      })
      //add
      upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex +index].style.borderColor = colors[nextRandom]
        displaySquares[displayIndex + index].style.boxShadow = "inset 0 0 0.35em 0 " + colors[nextRandom] + ", 0 0 0.35em 0 " + colors[nextRandom];
        displaySquares[displayIndex + index].style.opacity = "1";
      })
    }

    //start button
    startBtn.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      } else {
        draw()
        timerId = setInterval(moveDown, 800)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()

      }
    })
    //add scoreDisplay
    function addScore() {
      for (let i=0; i< 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
          score +=100
          scoreDisplay.innerHTML = score
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.borderColor = ''
            squares[index].style.boxShadow=''
            squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }
    //game over
    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over'
        clearInterval(timerId)
      }

    }

  })