//VARIABLES
//Gameplay Variables
const shapes = {
  O: [4,5,14,15],
  J: [4,5,14,24],
  L: [4,5,15,25],
  S: [4,14,15,25],
  I: [4,5,6,7],
  Z: [5,14,15,24],
  T: [5,14,15,16]
};
let isSquare = false;
let shape = null;
const colors = ['yellow','blue','orange','green','cyan','red','purple'];
let color = '';
let timerId = null;
let key = 0;
const rowsArray = [
  // [0,1,2,3,4,5,6,7,8,9],
  // [10,11,12,13,14,15,16,17,18,19],
  [20,21,22,23,24,25,26,27,28,29],
  [30,31,32,33,34,35,36,37,38,39],
  [40,41,42,43,44,45,46,47,48,49],
  [50,51,52,53,54,55,56,57,58,59],
  [60,61,62,63,64,65,66,67,68,69],
  [70,71,72,73,74,75,76,77,78,79],
  [80,81,82,83,84,85,86,87,88,89],
  [90,91,92,93,94,95,96,97,98,99],
  [100,101,102,103,104,105,106,107,108,109],
  [110,111,112,113,114,115,116,117,118,119],
  [120,121,122,123,124,125,126,127,128,129],
  [130,131,132,133,134,135,136,137,138,139],
  [140,141,142,143,144,145,146,147,148,149],
  [150,151,152,153,154,155,156,157,158,159],
  [160,161,162,163,164,165,166,167,168,169],
  [170,171,172,173,174,175,176,177,178,179],
  [180,181,182,183,184,185,186,187,188,189],
  [190,191,192,193,194,195,196,197,198,199],
  [200,201,202,203,204,205,206,207,208,209],
  [210,211,212,213,214,215,216,217,218,219],
  [220,221,222,223,224,225,226,227,228,229],
  [230,231,232,233,234,235,236,237,238,239]
];

//Score and Level Variables
let score = 0;
let level = 1;

//Audio & Animation Variables
let musicOn = true;

//FUNCTIONS
$(() => {
  console.log('JS Loaded');

  //DOM DEPENDENT VARIABLES
  //Gameplay Variables
  let cells = [].slice.call($('.gamegrid li'));
  const lastCell = cells.length-1;
  const $ul = $('ul');
  const $startBtn = $('.start');
  const $startScreen = $('.start-screen');
  const $mainScreen = $('.main-screen');
  const $endScreen = $('.end-screen');

  //Score and Level Variables
  const $scoreboard = $('.scoreboard');
  const $currentLevel = $('.current-level');
  const speed = [1000,750,500,250,100];
  const $oldScore = $('.old-score');
  const $newScore = $('.new-score');

  //Audio & Animation Variables
  const $musicBtn = $('.musicBtn');
  const music = $('.music')[0];
  const $h2 = $('h2');
  const gameSounds = $('.game-sounds')[0];

  //FUNCTIONS
  //Gameplay functions
  function gamePlay() {
    $startScreen.addClass('hidden');
    $mainScreen.removeClass('hidden');
    $startBtn.remove();
    checkLoss();
    checkRow();
    getShapes();
    cellChange();
    timerId = setInterval(move, speed[level]);
  }

  function move() {
    cellChange();
    checkForEnd();
    checkLoss();
    checkLevel();
    shape = shape.map((i) => i += 10);
  }

  function checkLoss() {
    for (let i = 20; i < 30; i++) {
      if ($(cells[i]).hasClass('fixed')) {
        clearInterval(timerId);
        endGame();
      }
    }
  }

  function checkLevel() {
    switch (Math.floor(score / 1000)) {
      case 2:
        level = 2;
        break;
      case 4:
        level = 3;
        break;
      case 6:
        level = 4;
        break;
      case 8:
        beatGame();
        break;
    }
    $currentLevel.text(level);
  }

  function getShapes() {
    const shapeKey = Object.keys(shapes)[Math.floor(Math.random()*Object.keys(shapes).length)];
    isSquare = shapeKey === 'O';
    shape = shapes[shapeKey];
    color = colors[Object.keys(shapes).indexOf(shapeKey)];
  }

  function cellChange() {
    cells.forEach((cell, i) => {
      if (shape.includes(i)) {
        $(cell).addClass(`color ${color}`);
      } else if (!$(cell).hasClass('fixed')) {
        $(cell).removeClass(`color ${color}`);
      }
    });
  }

  function keyDown() {
    switch (key) {
      case 39:
        if(!shape.some(i => i % 10 === 9 || $(cells[i + 1]).hasClass('fixed'))) shape = shape.map((i) => i += 1);
        break;
      case 37:
        if(!shape.some(i => i % 10 === 0 || $(cells[i - 1]).hasClass('fixed'))) shape = shape.map((i) => i -= 1);
        break;
      case 38:
        gameSounds.src = '/sounds/sfx_sounds_button6.wav';
        gameSounds.play();
        if (!isSquare) rotateShape();
        break;
      case 40:
        if(!shape.some(i => i + 10 > lastCell || $(cells[i + 10]).hasClass('fixed'))) shape = shape.map((i) => i += 10);
    }
    cellChange();
  }

  function getKeyDesktop(e) {
    e.preventDefault();
    key = e.keyCode;
    keyDown();
  }

  function getKeyMobile(e) {
    const X = e.touches[0].pageX;
    const Y = e.touches[0].pageY;
    if (Y < 120) key = 38;
    else if (Y > 420) key = 40;
    else if (X < 80 && Y > 120 && Y < 420) key = 37;
    else if (X > 230 && Y > 120 && Y < 420) key = 39;
    keyDown();
  }

  function updateRotationArrays(newIndex, modulos, rotatedShape) {
    modulos.push(newIndex % 10);
    rotatedShape.push(newIndex);
  }

  function rotateShape() {
    let canRotate = true;
    let newIndex = 0;
    let length = shape.length;
    const rotatedShape = [];
    let modulos = [];
    while (canRotate && length--) {
      const diff = Math.abs(shape[2] - shape[length]);
      switch (true) {
        case diff === 9:
          newIndex = shape[length] < shape[2] ? shape[2] + 11 : shape[2] - 11;
          break;
        case diff === 11:
          newIndex = shape[length] < shape[2] ? shape[2] - 9 : shape[2] + 9;
          break;
        case diff < 10:
          newIndex = shape[length] < shape[2] ? shape[2] - diff*10 : shape[2] + diff*10;
          break;
        case diff >= 10:
          newIndex = shape[length] < shape[2] ? shape[2] + diff/10 : shape[2] - diff/10;
          break;
        default:
          rotatedShape.push(shape[length]);
      }
      updateRotationArrays(newIndex, modulos, rotatedShape);
    }

    canRotate = rotatedShape.every((i) => !($(cells[i]).hasClass('fixed') || i > lastCell || i < 20));

    modulos = modulos.sort();
    if (shape[2] % 10 <= 1 && (modulos.includes(8) || modulos.includes(9))) {
      shape = shape.map((i) => i += 10 - modulos[modulos.length-1]);
      rotateShape();
    } else if (shape[2] % 10 >= 8 && (modulos.includes(0) || modulos.includes(1))) {
      shape = shape.map((i) => i -= modulos[0] + 1);
      rotateShape();
    } else if (canRotate) shape = rotatedShape.reverse();
  }


  function checkForEnd() {
    if (shape.some((i) => i + 10 > lastCell || shape.some((i) => $(cells[i + 10]).hasClass('fixed')))) {
      clearInterval(timerId);
      gameSounds.src = '/sounds/sfx_sounds_impact7.wav';
      gameSounds.play();
      shape.forEach((i) => {
        $(cells[i]).addClass(`fixed ${color}`);
      });
      gamePlay();
    }
  }

  function checkRow() {
    let lines = 0;
    for (let i = 0; i < rowsArray.length; i++) {
      let clear = true;
      clear = rowsArray[i].every((sq) => $(cells[sq]).hasClass('fixed'));
      if (clear)  {
        lines += 1;
        gameSounds.src = '/sounds/sfx_movement_portal2.wav';
        gameSounds.play();
        rowsArray[i].forEach((sq) => $(cells[sq]).removeAttr('class').prependTo($ul));
        cells = [].slice.call($('ul li'));
      }
    }
    updateScore(lines);
    updateGameboard();
  }


  function updateScore(lines) {
    switch (lines) {
      case 1:
        score += 100*level;
        break;
      case 2:
        score += 300*level;
        break;
      case 3:
        score += 500*level;
        break;
      case 4:
        score += 800*level;
        break;
    }
    $scoreboard.text(`Score: ${score}`);
  }

  function updateGameboard() {
    cells.forEach((cell) => $(cell).removeClass('hidden'));
    for (let i = 0; i < 20; i++) {
      $(cells[i]).addClass('hidden');
    }
  }

  function endGame() {
    music.src = '/sounds/15 Ending.mp3';
    music.play();
    $endScreen.removeClass('hidden');
    $mainScreen.addClass('hidden');
    let currentHighScore = 0;
    if (localStorage.getItem('currentHighScore')) currentHighScore = localStorage.getItem('currentHighScore');

    if (currentHighScore === 0){
      if($(window).width() > 600) $endScreen.css({backgroundImage: 'url(/images/stars.gif)', color: 'white'});
      $h2.text('Game Over');
      $newScore.text(`Your High Score: ${score}`);
    } else if (score > currentHighScore) {
      if($(window).width() > 600) $endScreen.css({backgroundImage: 'url(/images/clouds.gif)'});
      $h2.text('You Beat Your Highscore!');
      $oldScore.text(`Previous High Score: ${currentHighScore}`);
      $newScore.text(`Your New High Score: ${score}`);
    } else if (score < currentHighScore) {
      if($(window).width() > 600) $endScreen.css({backgroundImage: 'url(/images/stars.gif)', color: 'white'});
      $h2.text('Better Luck Next Time');
      $oldScore.text(`Current High Score: ${currentHighScore}`);
      $newScore.text(`Your Score: ${score}`);
    }

    if (score > currentHighScore) localStorage.setItem('currentHighScore', score);
  }

  function beatGame() {
    clearInterval(timerId);
    music.src = '/sounds/Player Wins.mp3';
    music.play();
    $endScreen.removeClass('hidden');
    $mainScreen.addClass('hidden');
    $h2.html(`Congratulations, you beat the game! <br><br> Your final score is ${score}`);
    if($(window).width() > 600) $endScreen.css({backgroundImage: 'url(/images/fireworks.gif)', color: 'white'});
  }

  //Audio & Styling Functions
  function playMusic() {
    if (musicOn) {
      music.pause();
      musicOn = false;
      $musicBtn.html('<i class="fas fa-volume-off"></i>');
    } else {
      music.play();
      musicOn = true;
      $musicBtn.html('<i class="fas fa-volume-up"></i>');
    }
  }

  function mobileBackground() {
    if ($(window).width() < 600) {
      $endScreen.css({background: 'transparent', color: 'black'});
    }
  }

  //Event Listeners
  $(document).on('keydown', getKeyDesktop);
  $(document).on('touchstart', getKeyMobile);
  $(window).on('resize', mobileBackground);
  $startBtn.one('click', gamePlay);
  $musicBtn.on('click', playMusic);

});
