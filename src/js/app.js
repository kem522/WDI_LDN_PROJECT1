
$(() => {
  console.log('JS Loaded');

  //Variables
  // const $cells = $('li');
  const cells = [].slice.call($('li'));
  const $h2 = $('h2');
  const lastCell = cells.length-1;
  let timerId = null;
  let shape = null;
  let color = '';
  let playing = true;

  //ARRAY STUFF
  let shapes= [[0,1,10,11], [0,1,2,10], [0,1,2,11],[0,1,11,12],[0,1,2,3]];
  const colors = ['red','blue','yellow','green'];
  gamePlay();

  function checkLoss() {
    for (let i = 0; i < 10; i++) {
      if ($(cells[i]).hasClass('color')) {
        playing = false;
        clearInterval(timerId);
        $h2.text('You Lose!');
      }
    }
    console.log(playing);
  }

  function gamePlay() {
    setTimeout(checkLoss, 2000);
    console.log('started loop');
    color = colors[Math.floor(Math.random()*colors.length)];
    // console.log(color);
    shape = shapes[Math.floor(Math.random()*shapes.length)];
    cellChange();
    timerId = setInterval(move, 100);
  }
  //Functions
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
    shape[0] += 10;
    shape[1] = shape[0] + 1;
    shape[2] = shape[2] + 10;
    shape[3] = shape[3] + 10;
    if (shape.some((sq) => sq > lastCell || shape.some((sq) => $(cells[sq]).hasClass('fixed')))) {
      cells.forEach(cell => {
        if ($(cell).hasClass('color')) $(cell).addClass('fixed').attr('style',`backgroundColor:${color}`);
      });
      clearInterval(timerId);
      shapes= [[0,1,10,11], [0,1,2,10], [0,1,2,11],[0,1,11,12]];
      gamePlay();
    } else {
      cellChange();
    }
  }

});
