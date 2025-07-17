const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const movesDisplay = document.getElementById('moves');
const levelDisplay = document.getElementById('level');

const width = 8;
const tileCount = width * width;
let tiles = [];
let score = 0;
let moves = 20;
let level = 1;

const fruits = [
  'banana', 'grape', 'pear', 'peach',
  'strawberry', 'blueberry', 'orange', 'apple'
];

const fruitImages = {
  banana: 'assets/fruits/banana.png',
  grape: 'assets/fruits/grape.png',
  pear: 'assets/fruits/pear.png',
  peach: 'assets/fruits/peach.png',
  strawberry: 'assets/fruits/strawberry.png',
  blueberry: 'assets/fruits/blueberry.png',
  orange: 'assets/fruits/orange.png',
  apple: 'assets/fruits/apple.png'
};

function createBoard() {
  for (let i = 0; i < tileCount; i++) {
    const tile = document.createElement('div');
    tile.setAttribute('draggable', true);
    tile.setAttribute('id', i);
    tile.classList.add('tile');

    const fruit = getRandomFruit();
    tile.style.backgroundImage = `url(${fruitImages[fruit]})`;
    tile.dataset.fruit = fruit;

    board.appendChild(tile);
    tiles.push(tile);
  }
}

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

// Drag logic
let draggedTile = null;
let replacedTile = null;

board.addEventListener('dragstart', (e) => {
  draggedTile = e.target;
});

board.addEventListener('dragover', (e) => e.preventDefault());

board.addEventListener('drop', (e) => {
  replacedTile = e.target;
  swapTiles();
});

function swapTiles() {
  const fromId = parseInt(draggedTile.id);
  const toId = parseInt(replacedTile.id);

  const validMoves = [fromId - 1, fromId + 1, fromId - width, fromId + width];
  if (validMoves.includes(toId)) {
    let fromFruit = draggedTile.dataset.fruit;
    let toFruit = replacedTile.dataset.fruit;

    draggedTile.style.backgroundImage = `url(${fruitImages[toFruit]})`;
    draggedTile.dataset.fruit = toFruit;

    replacedTile.style.backgroundImage = `url(${fruitImages[fromFruit]})`;
    replacedTile.dataset.fruit = fromFruit;

    moves--;
    movesDisplay.textContent = moves;

    setTimeout(() => {
      if (checkMatches()) {
        applyGravity();
        fillEmpty();
        checkLevelUp();
      }
    }, 200);
  }
}

function checkMatches() {
  let foundMatch = false;

  // Check rows
  for (let i = 0; i < tileCount; i++) {
    if (i % width > width - 3) continue;
    const fruit = tiles[i].dataset.fruit;
    if (
      fruit &&
      fruit === tiles[i + 1].dataset.fruit &&
      fruit === tiles[i + 2].dataset.fruit
    ) {
      [i, i + 1, i + 2].forEach(j => {
        tiles[j].style.backgroundImage = '';
        tiles[j].dataset.fruit = '';
      });
      score += 10;
      scoreDisplay.textContent = score;
      foundMatch = true;
    }
  }

  // Check columns
  for (let i = 0; i < tileCount - 2 * width; i++) {
    const fruit = tiles[i].dataset.fruit;
    if (
      fruit &&
      fruit === tiles[i + width].dataset.fruit &&
      fruit === tiles[i + 2 * width].dataset.fruit
    ) {
      [i, i + width, i + 2 * width].forEach(j => {
        tiles[j].style.backgroundImage = '';
        tiles[j].dataset.fruit = '';
      });
      score += 10;
      scoreDisplay.textContent = score;
      foundMatch = true;
    }
  }

  return foundMatch;
}

function applyGravity() {
  for (let i = tileCount - 1; i >= 0; i--) {
    if (tiles[i].dataset.fruit === '' && i - width >= 0) {
      tiles[i].dataset.fruit = tiles[i - width].dataset.fruit;
      tiles[i].style.backgroundImage = tiles[i - width].style.backgroundImage;

      tiles[i - width].dataset.fruit = '';
      tiles[i - width].style.backgroundImage = '';
    }
  }
}

function fillEmpty() {
  for (let i = 0; i < tileCount; i++) {
    if (tiles[i].dataset.fruit === '') {
      const fruit = getRandomFruit();
      tiles[i].dataset.fruit = fruit;
      tiles[i].style.backgroundImage = `url(${fruitImages[fruit]})`;
    }
  }
}

function checkLevelUp() {
  if (score >= level * 50) {
    level++;
    moves += 10;
    levelDisplay.textContent = level;
    movesDisplay.textContent = moves;
    alert(`🎉 Level ${level} reached!`);
  }

  if (moves <= 0) {
    alert(`😢 Game Over! Final Score: ${score}`);
    location.reload();
  }
}

createBoard();
