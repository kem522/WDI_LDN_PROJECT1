$(() => {
  console.log('JS Loaded');

  //Variables
  let cells = [].slice.call($('li'));
  const $ul = $('ul');
  const $h2 = $('h2');
  const lastCell = cells.length-1;
  const $startBtn = $('.start');
  // const $pauseBtn = $('.pause');
  let timerId = null;
  let shape = null;
  let key = '';
  let color = '';
  let score = 0;
  const $scoreboard = $('.scoreboard');

  let shapes= [[4,5,14,15],[4,5,14,24], [4,5,15,25],[4,14,15,25], [4,5,6,7],[5,14,15,24],[5,14,15,16]];
  const colors = ['red','blue','yellow','green','purple','orange','darkblue'];

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
    [150,151,152,153,154,155,156,157,158,159]
  ];


  //Functions
  function checkLoss() {
    for (let i = 0; i < 10; i++) {
      if ($(cells[i]).hasClass('color')) {
        clearInterval(timerId);
        $h2.text('You Lose!');
      }
    }
  }

  function gamePlay() {
    checkRow();
    setTimeout(checkLoss, 4000);
    color = colors[Math.floor(Math.random()*colors.length)];
    shape = shapes[Math.floor(Math.random()*shapes.length)];
    cellChange();
    timerId = setInterval(move, 1000);
  }

  function move() {
    cellChange();
    checkForEnd();
    horizontalMove();
    shape = shape.map((i) => i += 10);
  }

  function cellChange() {
    cells.forEach((cell, i) => {
      if (shape.includes(i)) {
        $(cell).addClass(`color ${color}`);
      } else {
        if (!$(cell).hasClass('fixed')) $(cell).removeClass(`color ${color}`);
      }
    });
  }

  function keyDown(e) {
    var keyCode = e.keyCode;
    if(keyCode === 39) key = 'ArrowRight';
    else if (keyCode === 37) key = 'ArrowLeft';
    else if (keyCode === 38) key = 'ArrowUp';
  }

  function horizontalMove() {
    let exit = false;
    switch (key) {
      case 'ArrowRight':
        shape.forEach((el) => {
          if (el % 10 === 10-1) exit = true;
        });
        if (exit === false) shape = shape.map((i) => i += 1);
        break;
      case 'ArrowLeft':
        shape.forEach((el) => {
          if (el % 10 === 0) exit = true;
        });
        if (exit === false) shape = shape.map((i) => i -= 1);
        break;
      case 'ArrowUp':
        rotateShape();
        break;
    }
    key = '';
  }


  function rotateShape() {
    let canMoveShape = true;
    let length = shape.length;
    let newIndex = 0;
    const rotatedShape = [];
    while(length-- && canMoveShape) {
      const diff = Math.abs(shape[2] - shape[length]);
      switch (diff) {
        case 1:
          newIndex = shape[length] < shape[2] ? shape[2] - 10 : shape[2] + 10;
          if (shape[2] % 10 <= 1) canMoveShape = newIndex % 10 !== 9 && newIndex % 10 !== 8;
          else if (shape[2] % 10 >= 8) canMoveShape =  newIndex % 10 !== 0 && newIndex % 10 !== 1;
          rotatedShape.push(newIndex);
          break;
        case 10:
          newIndex = (shape[length] < shape[2]) ? shape[2] + 1 : shape[2] - 1;
          if (shape[2] % 10 <= 1) canMoveShape = newIndex % 10 !== 9 && newIndex % 10 !== 8;
          else if (shape[2] % 10 >= 8) canMoveShape =  newIndex % 10 !== 0 && newIndex % 10 !== 1;
          rotatedShape.push(newIndex);
          break;
        case 9:
          newIndex = (shape[length] < shape[2]) ? shape[2] + 11 : shape[2] - 11;
          if (shape[2] % 10 <= 1) canMoveShape = newIndex % 10 !== 9 && newIndex % 10 !== 8;
          else if (shape[2] % 10 >= 8) canMoveShape =  newIndex % 10 !== 0 && newIndex % 10 !== 1;
          rotatedShape.push(newIndex);
          break;
        case 11:
          newIndex = (shape[length] < shape[2]) ? shape[2] - 9 : shape[2] + 9;
          if (shape[2] % 10 <= 1) canMoveShape = newIndex % 10 !== 9 && newIndex % 10 !== 8;
          else if (shape[2] % 10 >= 8) canMoveShape =  newIndex % 10 !== 0 && newIndex % 10 !== 1;
          rotatedShape.push(newIndex);
          break;
        case 20:
          newIndex =  (shape[length] < shape[2]) ? shape[2] + 2 : shape[2] - 2;
          if (shape[2] % 10 <= 1) canMoveShape = newIndex % 10 !== 9 && newIndex % 10 !== 8;
          else if (shape[2] % 10 >= 8) canMoveShape =  newIndex % 10 !== 0 && newIndex % 10 !== 1;
          rotatedShape.push(newIndex);
          break;
        case 2:
          newIndex =  (shape[length] < shape[2]) ? shape[2] - 20 : shape[2] + 20;
          if (shape[2] % 10 <= 1) canMoveShape = newIndex % 10 !== 9 && newIndex % 10 !== 8;
          else if (shape[2] % 10 >= 8) canMoveShape =  newIndex % 10 !== 0 && newIndex % 10 !== 1;
          rotatedShape.push(newIndex);
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
        console.log(i);
        $(cells[i]).addClass(`fixed ${color}`);
      });
      shapes= [[4,5,14,15],[4,5,14,24], [4,5,15,25],[4,14,15,25], [4,5,6,7],[5,14,15,24],[5,14,15,16]];
      // gamePlay();
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
        rowsArray[i].forEach((el) => $(cells[el]).remove());
        $ul.prepend('<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>');
        cells = [].slice.call($('li'));
        score += 100;
        $scoreboard.text(`Your score is: ${score}`);
      }
    }
  }

  //Event Listeners
  document.addEventListener('keydown', keyDown, false);
  $startBtn.one('click', gamePlay);

  // $pauseBtn.on('click', pause);
});
