
$(() => {
  console.log('JS Loaded');

  //Variables
  const $cells = $('li');
  const cells = [].slice.call($('li'));
  const lastCell = cells.length-1;
  let timerId = null;
  let shape = null;

  //Objects
  // class Square {
  //   constructor() {
  //     this.sq1 = 0;
  //     this.sq2 = this.sq1 + 1;
  //     this.sq3 = this.sq1 + 10;
  //     this.sq4 = this.sq2 + 10;
  //   }
  // }

  const square = [0, 1, 10, 11];
  const newsquare = [0, 1, 10, 11];
  const shapes = [square, newsquare];

  // const square = new Square();
  // shape = square;

  shapes.forEach((el) => {
    shape = el;
    cellChange();
    timerId = setInterval(move,1000);
  });

  //Functions

  // function cellChange() {
  //   cells.forEach((cell, i) => {
  //     console.log(shape);
  //     if (Object.values(shape).includes(i)) $(cell).addClass('red');
  //     else $(cell).removeClass('red');
  //   });
  // }

  function cellChange() {
    cells.forEach((cell, i) => {
      if (shape.includes(i)) $(cell).addClass('red');
      else $(cell).removeClass('red');
    });
  }

  function move() {
    shape[0] += 10;
    shape[1] = shape[0] + 1;
    shape[2] = shape[0] + 10;
    shape[3] = shape[1] + 10;
    if (shape.some((sq) => sq > lastCell)) {
      cells.forEach(cell => {
        if ($(cell).hasClass('red')) $(cell).addClass('fixed');
      });
      clearInterval(timerId);
    } else {
      cellChange();
    }
  }

});
