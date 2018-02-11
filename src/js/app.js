$(() => {
  console.log('JS Loaded');

  //Variables
  let cells = [].slice.call($('li'));
  const $ul = $('ul');
  const $h2 = $('h2');
  const lastCell = cells.length-1;
  const $startBtn = $('.start');
  const $pauseBtn = $('.pause');
  let timerId = null;
  let shape = null;
  let key = '';
  let color = '';
  let score = 0;
  const $scoreboard = $('.scoreboard');
  let playing = true;
  let rotate = 0;


  let shapes= [[4,5,14,15,'O'],[4,5,14,24,'J'], [4,5,15,25,'L'],[4,14,15,25,'S'], [4,5,6,7,'I'],[5,14,15,24, 'Z'],[5,14,15,16,'T']];
  const colors = ['red','blue','yellow','green'];

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
    setTimeout(checkLoss, 2000);
    color = colors[Math.floor(Math.random()*colors.length)];
    shape = shapes[Math.floor(Math.random()*shapes.length)];
    cellChange();
    timerId = setInterval(move, 500);
  }

  function move() {
    horizontalMove();
    shape[0] += 10;
    shape[1] = shape[1] + 10;
    shape[2] = shape[2] + 10;
    shape[3] = shape[3] + 10;
    checkForEnd();
  }

  function cellChange() {
    cells.forEach((cell, i) => {
      if (shape.includes(i)) {
        $(cell).addClass('color').css({backgroundColor: color});
      } else {
        $(cell).removeClass('color').removeAttr('style');
      }
    });
  }

  function keyDown(e) {
    var keyCode = e.keyCode;
    if(keyCode === 39) key = 'ArrowRight';
    else if (keyCode === 37) key = 'ArrowLeft';
    else if (keyCode === 38) {
      key = 'ArrowUp';

    }
  }

  function horizontalMove() {
    let exit = false;
    switch (key) {
      case 'ArrowRight':
        shape.forEach((el) => {
          if (el % 10 === 10-1) exit = true;
        });
        if (exit === false) {
          shape[0] += 1;
          shape[1] += 1;
          shape[2] += 1;
          shape[3] += 1;
        }
        break;
      case 'ArrowLeft':
        shape.forEach((el) => {
          if (el % 10 === 0) exit = true;
        });
        if (exit === false) {
          shape[0] -= 1;
          shape[1] -= 1;
          shape[2] -= 1;
          shape[3] -= 1;
        }
        break;
      case 'ArrowUp':
        if (shape.includes('J')) rotateJ();
        if (shape.includes('L')) rotateL();
    }
    key = '';
  }

  function rotateJ() {
    if (rotate < 4) rotate++;
    else rotate = 1;
    const shape0 = [shape[2] + 1,shape[2] + 10, shape[2] - 1,shape[2] - 10];
    const shape1 = [shape[2] + 11, shape[2] + 9, shape[2] - 11,shape[2] - 9];
    const shape3 = [shape[2] - 1,shape[2] - 10, shape[2] + 1,shape[2] + 10];
    shape[0] = shape0[rotate-1];
    shape[1] = shape1[rotate-1];
    shape[3] = shape3[rotate-1];
  }

  function rotateL() {
    if (rotate < 4) rotate++;
    else rotate = 1;
    const shape0 = [shape[2] - 9,shape[2] + 11, shape[2] + 9,shape[2] - 11];
    const shape1 = [shape[2] + 1, shape[2] + 10, shape[2] - 1,shape[2] - 10];
    const shape3 = [shape[2] - 1,shape[2] - 10, shape[2] + 1,shape[2] + 10];
    shape[0] = shape0[rotate-1];
    shape[1] = shape1[rotate-1];
    shape[3] = shape3[rotate-1];
  }

  function pause() {
    if (playing) {
      playing = false;
      clearInterval(timerId);
    } else {
      setInterval(move, 500);
      playing = true;
    }
  }

  function checkForEnd() {
    if (shape.some((sq) => sq > lastCell || shape.some((sq) => $(cells[sq]).hasClass('fixed')))) {
      clearInterval(timerId);
      // shape.forEach((i) => $(cells[i]).addClass(`fixed, ${color}`));
      cells.forEach(cell => {
        if ($(cell).hasClass('color')) $(cell).addClass('fixed');
      });
      shapes = [[4,5,14,15,'O'],[4,5,14,24,'J'], [4,5,15,25,'L'],[4,14,15,25,'S'], [4,5,6,7,'I'],[5,14,15,24, 'Z'],[5,14,15,16,'T']];
      gamePlay();
    } else {
      cellChange();
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
  $startBtn.on('click', gamePlay);
  $pauseBtn.on('click', pause);
});
