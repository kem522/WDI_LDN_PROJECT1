$(() => {
  console.log('JS Loaded');

  //Variables
  let cells = [].slice.call($('li'));
  const $ul = $('ul');
  const $h2 = $('h2');
  const lastCell = cells.length-1;
  let timerId = null;
  let shape = null;
  let key = '';
  let color = '';
  // let playing = true;

  let shapes= [[0,1,10,11]];
  // [0,1,2,10], [0,1,2,11],[0,1,11,12],[0,1,2,3]];
  const colors = ['red','blue','yellow','green'];
  gamePlay();

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
        // playing = false;
        clearInterval(timerId);
        $h2.text('You Lose!');
      }
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
        clear = false;
        rowsArray[i].forEach((el) => $(cells[el]).remove());
        $ul.prepend('<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>');
        cells = [].slice.call($('li'));
      }
    }
  }

  function gamePlay() {
    setTimeout(checkLoss, 2000);
    color = colors[Math.floor(Math.random()*colors.length)];
    shape = shapes[Math.floor(Math.random()*shapes.length)];
    cellChange();
    timerId = setInterval(move, 500);
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

  function move() {
    horizontalMove();
    shape[0] += 10;
    shape[1] = shape[0] + 1;
    shape[2] = shape[2] + 10;
    shape[3] = shape[3] + 10;
    checkForEnd();
    checkRow();
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
    }
    key = '';
  }

  function checkForEnd() {
    if (shape.some((sq) => sq > lastCell || shape.some((sq) => $(cells[sq]).hasClass('fixed')))) {
      cells.forEach(cell => {
        if ($(cell).hasClass('color')) $(cell).addClass('fixed');
      });
      clearInterval(timerId);
      shapes= [[0,1,10,11]];
      // [0,1,2,10], [0,1,2,11],[0,1,11,12]];
      gamePlay();
    } else {
      cellChange();
    }
  }


  function keyDown(e) {
    var keyCode = e.keyCode;
    if(keyCode === 39) key = 'ArrowRight';
    else if (keyCode === 37) key = 'ArrowLeft';
  }

  //Event Listeners
  document.addEventListener('keydown', keyDown, false);

});
