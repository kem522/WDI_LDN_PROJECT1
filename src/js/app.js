$(() => {
  console.log('JS Loaded');

  //Variables
  //Gameplay Variables
  let cells = [].slice.call($('ul li'));
  let shapes= [[4,5,14,15],[4,5,14,24], [4,5,15,25],[4,14,15,25], [4,5,6,7],[5,14,15,24],[5,14,15,16]];
  let shape = null;
  const colors = ['red','blue','yellow','green','purple','orange'];
  let color = '';
  const $ul = $('ul');
  const lastCell = cells.length-1;
  const $startBtn = $('.start');
  let timerId = null;
  let score = 0;
  const $scoreboard = $('.scoreboard');
  const $h2 = $('h2');


  //Audio & Animation Variables
  const $musicBtn = $('.musicBtn');
  const music = $('.music')[0];
  let musicOn = true;

  //Shape Rotation Variables
  let canMoveShape = true;
  let rotatedShape = [];
  let newIndex  = 0;

  const rowsArray = [
    [0,1,2,3,4,5,6,7,8,9],
    [10,11,12,13,14,15,16,17,18,19],
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
    [210,211,212,213,214,215,216,217,218,219]
  ];


  //Functions
  //Gameplay functions
  function checkLoss() {
    for (let i = 0; i < 10; i++) {
      if ($(cells[i]).hasClass('fixed')) {
        clearInterval(timerId);
        $h2.text('You Lose!');
      }
    }
  }

  function gamePlay() {
    checkRow();
    checkLoss();
    color = colors[Math.floor(Math.random()*colors.length)];
    shape = shapes[Math.floor(Math.random()*shapes.length)];
    cellChange();
    timerId = setInterval(move, 1000);
  }

  function move() {
    cellChange();
    checkForEnd();
    shape = shape.map((i) => i += 10);
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
        rotateShape();
        break;
      case 40:
        if(!shape.some(i => i + 10 > lastCell || $(cells[i + 10]).hasClass('fixed'))) shape = shape.map((i) => i += 10);
    }
    cellChange();
  }



  function rotateIndex() {
    if (shape[2] % 10 <= 1) canMoveShape = newIndex % 10 !== 9 && newIndex % 10 !== 8;
    else if (shape[2] % 10 >= 8) canMoveShape =  newIndex % 10 !== 0 && newIndex % 10 !== 1;
    rotatedShape.push(newIndex);
  }

  //shape[2] is the center of rotation for each shape
  function rotateShape() {
    canMoveShape = true;
    rotatedShape = [];
    let length = shape.length;
    while(length-- && canMoveShape) {
      const diff = Math.abs(shape[2] - shape[length]);
      switch (diff) {
        case 1:
          newIndex = shape[length] < shape[2] ? shape[2] - 10 : shape[2] + 10;
          rotateIndex();
          break;
        case 10:
          newIndex = (shape[length] < shape[2]) ? shape[2] + 1 : shape[2] - 1;
          rotateIndex();
          break;
        case 9:
          newIndex = (shape[length] < shape[2]) ? shape[2] + 11 : shape[2] - 11;
          rotateIndex();
          break;
        case 11:
          newIndex = (shape[length] < shape[2]) ? shape[2] - 9 : shape[2] + 9;
          rotateIndex();
          break;
        case 20:
          newIndex =  (shape[length] < shape[2]) ? shape[2] + 2 : shape[2] - 2;
          rotateIndex();
          break;
        case 2:
          newIndex =  (shape[length] < shape[2]) ? shape[2] - 20 : shape[2] + 20;
          rotateIndex();
          break;
        default:
          rotatedShape.push(shape[length]);
      }
    }
    if(canMoveShape) shape = rotatedShape.reverse();
  }

  function checkForEnd() {
    if (shape.some((i) => i + 10 > lastCell || shape.some((i) => $(cells[i + 10]).hasClass('fixed')))) {
      clearInterval(timerId);
      shape.forEach((i) => {
        $(cells[i]).addClass(`fixed ${color}`);
      });
      shapes = [[4,5,14,15],[4,5,14,24], [4,5,15,25],[4,14,15,25], [4,5,6,7],[5,14,15,24],[5,14,15,16]];
      gamePlay();
    }
  }

  function checkRow() {
    for (let i = 0; i < rowsArray.length; i++) {
      let clear = true;
      rowsArray[i].forEach((el) => {
        if (!$(cells[el]).hasClass('fixed')) {
          clear = false;
        }
      });
      if (clear)  {
        rowsArray[i].forEach((el) => $(cells[el]).removeAttr('class').prependTo($ul));
        cells = [].slice.call($('ul li'));
        score += 100;
        $scoreboard.text(`Your score is: ${score}`);
      }
    }
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
