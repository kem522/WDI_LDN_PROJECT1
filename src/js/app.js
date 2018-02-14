$(() => {
  console.log('JS Loaded');
  console.log(document.cookie);

  //Variables
  //Gameplay Variables
  let cells = [].slice.call($('.gamegrid li'));
  let shapes = [[4,5,14,15,'O'],[4,5,14,24], [4,5,15,25],[4,14,15,25], [4,5,6,7],[5,14,15,24],[5,14,15,16]];
  let shape = null;
  // const terminos = [];
  const colors = ['yellow','blue','orange','green','cyan','red','purple'];
  let color = '';
  const $ul = $('ul');
  const lastCell = cells.length-1;
  const $startBtn = $('.start');
  let timerId = null;
  const $startScreen = $('.start-screen');
  const $mainScreen = $('.main-screen');
  const $endScreen = $('.end-screen');

  //Shape Rotation Variables
  let rotatedShape = [];
  let modulos = [];
  let canRotate = true;
  let newIndex = 0;

  //Score and Level Variables
  let score = 0;
  let lines = 0;
  const $scoreboard = $('.scoreboard');
  let level = 1;
  const $currentLevel = $('.current-level');
  const speed = [1000,750,500,250,100];
  let newHighScore = 0;
  // const nextShape = [].slice.call($('.next-shape li'));

  //Audio & Animation Variables
  const $musicBtn = $('.musicBtn');
  const music = $('.music')[0];
  let musicOn = true;
  const $h2 = $('h2');


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


  //Functions
  //Gameplay functions
  function gamePlay() {
    $startScreen.addClass('hidden');
    $mainScreen.removeClass('hidden');
    $startBtn.remove();
    checkLevel();
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
        endGame();
        break;
    }
    $currentLevel.text(level);
  }

  //TODO: COLORS DON'T WORK WITH NEXT SHAPE
  function getShapes() {
    shape = shapes[Math.floor(Math.random()*shapes.length)];
    color =  colors[shapes.indexOf(shape)];
    // terminos.push( shapes[Math.floor(Math.random()*shapes.length)],shapes[Math.floor(Math.random()*shapes.length)]);
    // shape = terminos[0];
    // nextShape.forEach((cell,i) => {
    //   if (terminos[1].includes(i)) $(cell[i+10]).addClass('red');
    //   else $(cell).removeClass('red');
    // });
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

  function keyDown(e) {
    e.preventDefault();
    switch (e.keyCode) {
      case 39:
        if(!shape.some(i => i % 10 === 9 || $(cells[i + 1]).hasClass('fixed'))) shape = shape.map((i) => i += 1);
        break;
      case 37:
        if(!shape.some(i => i % 10 === 0 || $(cells[i - 1]).hasClass('fixed'))) shape = shape.map((i) => i -= 1);
        break;
      case 38:
        if (!(shape.join('').includes('O') || shape.join('').includes('NaN'))) rotateShape();
        break;
      case 40:
        if(!shape.some(i => i + 10 > lastCell || $(cells[i + 10]).hasClass('fixed'))) shape = shape.map((i) => i += 10);
    }
    cellChange();
  }

  function rotateIndex() {
    canRotate = !($(cells[newIndex]).hasClass('fixed') || $(cells[newIndex]) > lastCell);
    modulos.push(newIndex % 10);
    rotatedShape.push(newIndex);
  }

  //TODO: Can rotate off the top and bottom edges
  function rotateShape() {
    rotatedShape = [];
    modulos = [];
    let length = shape.length;
    while (canRotate && length--) {
      const diff = Math.abs(shape[2] - shape[length]);
      switch (diff) {
        case 1:
          newIndex = shape[length] < shape[2] ? shape[2] - 10 : shape[2] + 10;
          rotateIndex();
          break;
        case 10:
          newIndex = shape[length] < shape[2] ? shape[2] + 1 : shape[2] - 1;
          rotateIndex();
          break;
        case 9:
          newIndex = shape[length] < shape[2] ? shape[2] + 11 : shape[2] - 11;
          rotateIndex();
          break;
        case 11:
          newIndex = shape[length] < shape[2] ? shape[2] - 9 : shape[2] + 9;
          rotateIndex();
          break;
        case 20:
          newIndex = shape[length] < shape[2] ? shape[2] + 2 : shape[2] - 2;
          rotateIndex();
          break;
        case 2:
          newIndex = shape[length] < shape[2] ? shape[2] - 20 : shape[2] + 20;
          rotateIndex();
          break;
        default:
          rotatedShape.push(shape[length]);
      }
    }

    if (shape[2] % 10 === 0) {
      if (modulos.includes(8)) shape = shape.map((i) => i += 2);
      else if (modulos.includes(9)) shape = shape.map((i) => i += 1);
      rotateShape();
    } else if (shape[2] % 10 === 1 && modulos.includes(9)) {
      shape = shape.map((i) => i += 1);
      rotateShape();
    } else if (shape[2] % 10 === 9) {
      if (modulos.includes(1)) shape = shape.map((i) => i -= 2);
      else if (modulos.includes(0)) shape = shape.map((i) => i -= 1);
      rotateShape();
    } else if (shape[2] % 10 === 8 && modulos.includes(0)) {
      shape = shape.map((i) => i -= 1);
      rotateShape();
    } else if (canRotate) shape = rotatedShape.reverse();
  }


  function checkForEnd() {
    if (shape.some((i) => i + 10 > lastCell || shape.some((i) => $(cells[i + 10]).hasClass('fixed')))) {
      clearInterval(timerId);
      shape.forEach((i) => {
        $(cells[i]).addClass(`fixed ${color}`);
      });
      shapes = [[4,5,14,15,'O'],[4,5,14,24], [4,5,15,25],[4,14,15,25], [4,5,6,7],[5,14,15,24],[5,14,15,16]];
      // terminos.splice(0,1);
      // // shapeIndex += 1;
      gamePlay();
    }
  }

  function checkRow() {
    lines = 0;
    for (let i = 0; i < rowsArray.length; i++) {
      let clear = true;
      clear = rowsArray[i].every((el) => $(cells[el]).hasClass('fixed'));
      if (clear)  {
        lines += 1;
        rowsArray[i].forEach((el) => {
          $(cells[el]).removeAttr('class').prependTo($ul);
        });
        cells = [].slice.call($('ul li'));
      }
    }
    updateScore();
    updateGameboard();
  }


  function updateScore() {
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
    $endScreen.removeClass('hidden');
    $mainScreen.addClass('hidden');
    const currentHighScore = getCookie();
    if (score > currentHighScore) setCookie();
    // $h2.text(`Your final score is ${score}`);
    // if (level / 1000 === 8 )
    $h2.html(`Congratulations, you win! <br><br> Your final score is ${score}`);
  }
  // function displayNext() {
  //   nextShape.forEach((cell) => {
  //     if (terminos[1].includes(cell)) $(cell).addClass('color red');
  //   });
  // }
  // //
  function getCookie(){
    const allCookies = document.cookie.split(';');
    allCookies.forEach((c) => {
      if (c.includes('highscore')) newHighScore = c.split('=')[1];
    });
    return newHighScore;
  }

  function setCookie() {
    document.cookie = `highscore=${score}`;
  }

  //Audio Functions
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

  //Event Listeners
  $(document).on('keydown', keyDown);
  $startBtn.one('click', gamePlay);
  $musicBtn.on('click', playMusic);


});
