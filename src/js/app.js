
$(() => {
  console.log('JS Loaded');

  //Variables
  // const $cells = $('li');
  const cells = [].slice.call($('li'));
  const lastCell = cells.length-1;
  let timerId = null;
  let shape = null;

  //OBJECT STUFF
  //Objects
  // class Square {
  //   constructor() {
  //     this.sq1 = 0;
  //     this.sq2 = this.sq1 + 1;
  //     this.sq3 = this.sq1 + 10;
  //     this.sq4 = this.sq2 + 10;
  //   }
  // }
  //
  // const square = new Square();
  // shape = square;
  // timerId = setInterval(move, 1000);

  //ARRAY STUFF
  let shapes= [[0,1,10,11],[0,1,10,11]];
  console.log(shape);
  gamePlay();

  function gamePlay() {
    console.log(shapes);
    console.log('started loop');
    shape = shapes[Math.floor(Math.random()*shapes.length)];
    cellChange();
    timerId = setInterval(move, 1000);
  }
  //Functions
  //OBJECT VERSIONS
  // function cellChange() {
  //   cells.forEach((cell, i) => {
  //     console.log(shape);
  //     if (Object.values(shape).includes(i)) $(cell).addClass('red');
  //     else $(cell).removeClass('red');
  //   });
  // }

  // function move() {
  //   shape.sq1 += 10;
  //   shape.sq2 = shape.sq1 + 1;
  //   shape.sq3 = shape.sq1 + 10;
  //   shape.sq4 = shape.sq2 + 10;
  //   if (Object.values(shape).some((sq) => sq > lastCell)) {
  //     cells.forEach(cell => {
  //       if ($(cell).hasClass('red')) $(cell).addClass('fixed');
  //     });
  //     clearInterval(timerId);
  //   } else {
  //     cellChange();
  //   }
  // }

  //ARRAY VERSIONS
  function cellChange() {
    cells.forEach((cell, i) => {
      if (shape.includes(i)) $(cell).addClass('red');
      else $(cell).removeClass('red');
    });
  }

  function move() {
    shape[0] += 10;
    shape[1] = shape[0] + 1;
    shape[2] = shape[2] + 10;
    shape[3] = shape[3] + 10;
    if (shape.some((sq) => sq > lastCell || shape.some((sq) => $(cells[sq]).hasClass('fixed')))) {
      cells.forEach(cell => {
        if ($(cell).hasClass('red')) $(cell).addClass('fixed');
      });
      clearInterval(timerId);
      shapes = [[0,1,10,11],[0,1,10,11]];
      gamePlay();
    } else {
      cellChange();
    }
  }

});
