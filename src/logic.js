function info() {
  console.log("INFO")
  const response = {
    apiversion: "1",
    author: "",
    color: "#C2B280",
    head: "fang",
    tail: "sharp"
  }
  return response
}

function start(gameState) {
  console.log(`${gameState.game.id} START`)
}

function end(gameState) {
  console.log(`${gameState.game.id} END\n`)
}

function move(gameState) {
  let validMoves = {
    up: true,
    down: true,
    left: true,
    right: true
  }
  let moveWeights = {
    up: 0,
    down: 0,
    left: 0,
    right: 0
  }

  // Step 0: Don't let your Battlesnake move back on its own neck
  const myHead = gameState.you.head;
  const myNeck = gameState.you.body[1];
  if (myNeck.x < myHead.x) {
    validMoves.left = false
  } else if (myNeck.x > myHead.x) {
    validMoves.right = false
  } else if (myNeck.y < myHead.y) {
    validMoves.down = false
  } else if (myNeck.y > myHead.y) {
    validMoves.up = false
  }

  // TODO: Step 1 - Don't hit walls.
  // Use information in gameState to prevent your Battlesnake from moving beyond the boundaries of the board.
  const boardWidth = gameState.board.width - 1;
  const boardHeight = gameState.board.height - 1;
  if (myHead.x == 0) {
    validMoves.left = false
  } 
  if (myHead.x == boardWidth) {
    validMoves.right = false
  } 
  if (myHead.y == 0) {
    validMoves.down = false
  } 
  if (myHead.y == boardHeight) {
    validMoves.up = false
  }

  // TODO: Step 2 - Don't hit yourself.
  // Use information in gameState to prevent your Battlesnake from colliding with itself.
  // const mybody = gameState.you.body
  // TODO: Step 3 - Don't collide with others.
  // Use information in gameState to prevent your Battlesnake from colliding with others.
  const heads = [];
  const tails = [];
  const bodies = [];
  
  for(const snake of gameState.board.snakes) {
    if(snake.id !== gameState.you.id)
      heads.push([snake.head, snake.length])
    tails.push(snake.body.pop())
    bodies.push(...snake.body)
  }
  
  if(bodies.some(body => body.x == myHead.x - 1 && body.y == myHead.y)) {
    validMoves.left = false
  }
  if (bodies.some(body => body.x == myHead.x + 1 && body.y == myHead.y)) {
    validMoves.right = false
  }
  if (bodies.some(body => body.x == myHead.x && body.y == myHead.y - 1)) {
    validMoves.down = false
  }
  if (bodies.some(body => body.x == myHead.x && body.y == myHead.y + 1)) {
    validMoves.up = false
  }
  
  if(tails.some(tail => tail.x == myHead.x - 1 && tail.y == myHead.y)) {
    moveWeights.left -= 100
  }
  if (tails.some(tail => tail.x == myHead.x + 1 && tail.y == myHead.y)) {
    moveWeights.right -= 100
  }
  if (tails.some(tail => tail.x == myHead.x && tail.y == myHead.y - 1)) {
    moveWeights.down -= 100
  }
  if (tails.some(tail => tail.x == myHead.x && tail.y == myHead.y + 1)) {
    moveWeights.up -= 100
  }

  for(const snake of heads) {
    const head = snake[0];
    const length = snake[1];
    if((head.x == myHead.x && head.y == myHead.y + 2) ||
       (head.x == myHead.x + 1 && head.y == myHead.y + 1) ||
       (head.x == myHead.x - 1 && head.y == myHead.y + 1)) {
      moveWeights.up += gameState.you.length > length  ? 20 : -500
    }
    if((head.x == myHead.x && head.y == myHead.y - 2) ||
       (head.x == myHead.x + 1 && head.y == myHead.y - 1) ||
       (head.x == myHead.x - 1 && head.y == myHead.y - 1)) {
      moveWeights.down += gameState.you.length > length  ? 20 : -500
    }
    if((head.x == myHead.x + 2 && head.y == myHead.y) ||
       (head.x == myHead.x + 1 && head.y == myHead.y + 1) ||
       (head.x == myHead.x + 1 && head.y == myHead.y - 1)) {
      moveWeights.right += gameState.you.length > length  ? 20 : -500
    }
    if((head.x == myHead.x - 2 && head.y == myHead.y) ||
       (head.x == myHead.x - 1 && head.y == myHead.y + 1) ||
       (head.x == myHead.x - 1 && head.y == myHead.y - 1)) {
      moveWeights.left += gameState.you.length > length  ? 20 : -500
    }
  }

  
  
  // TODO: Step 4 - Find food.
  // Use information in gameState to seek out and find food.
  for(const food of gameState.board.food) {
    if(food.x < myHead.x) {
      moveWeights.left++;
    } else if(food.x > myHead.x) {
      moveWeights.right++;
    } else if(food.y < myHead.y) {
      moveWeights.down++;
    } else if(food.y > myHead.y) {
      moveWeights.up++;
    }
  }

  // Finally, choose a move from the available safe moves.
  // TODO: Step 5 - Select a move to make based on strategy, rather than random.
  const safeMoves = Object.keys(validMoves).filter(key => validMoves[key])
  moveWeights = Object.fromEntries(Object.entries(moveWeights).filter(entry => validMoves[entry[0]]))
  const response = {
    move: safeMoves.find(key => moveWeights[key] == Math.max(...Object.values(moveWeights))),
  }
  //console.log(`${myHead.x}/${boardWidth} ${myHead.y}/${boardHeight} ${safeMoves}`)
  console.log(`${new Date().toISOString().slice(11, -1)} ${gameState.game.id} MOVE ${gameState.turn}: ${response.move}`)
  return response
}

module.exports = {
  info: info,
  start: start,
  move: move,
  end: end
}
