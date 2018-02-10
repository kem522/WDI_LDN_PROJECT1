
$(() => {
  console.log('JS Loaded');

  //Variables
  // const $cells = $('li');
  const cells = [].slice.call($('li'));
  const $h2 = $('h2');
  const lastCell = cells.length-1;
  let timerId = null;
  let shape = null;
  let key = '';
  let color = '';
  const rows = 16;
  const columns = 10;
  // let playing = true;

  let shapes= [[0,1,10,11]];
  // [0,1,2,10], [0,1,2,11],[0,1,11,12],[0,1,2,3]];
  const colors = ['red','blue','yellow','green'];
  gamePlay();

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

  // function checkRow() {
  //   for (let i = 0; i < rows*columns; i += 10) {
  //     let clear = true;
  //     for (let x = i; x < i + columns; i++) {
  //       if (!$(cells[i]).hasClass('fixed')) clear = false;
  //     }
  //     if (clear) {
  //       for (let x = i; x < i + columns; i++) {
  //         $(cells[i]).remove();
  //       }
  //     }
  //   }
  // }

  function gamePlay() {
    setTimeout(checkLoss, 2000);
    // setTimeout(checkRow, 2000);
    color = colors[Math.floor(Math.random()*colors.length)];
    shape = shapes[Math.floor(Math.random()*shapes.length)];
    cellChange();
    timerId = setInterval(move, 1000);
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

  // function checkRow() {
  //   let clear = true;
  //   for (let i = cells.length - 10; i < cells.length; i++) {
  //     if (!$(cells[i]).hasClass('fixed')) clear = false;
  //   }
  //   }
  // }

  function checkForEnd() {
    if (shape.some((sq) => sq > lastCell || shape.some((sq) => $(cells[sq]).hasClass('fixed')))) {
      cells.forEach(cell => {
        if ($(cell).hasClass('color')) $(cell).addClass('fixed').attr('style',`backgroundColor:${color}`);
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
