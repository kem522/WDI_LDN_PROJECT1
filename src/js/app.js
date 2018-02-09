
$(() => {
  console.log('JS Loaded');

  //Variables
  const $cells = $('li');
  const cells = [].slice.call($('li'));
  const key = document.addEventListener('keydown', (e) => e.which);

  const lastCell = cells.length-1;
  console.log(lastCell);

  //Objects
  class Square {
    constructor() {
      this.sq1 = 0;
      this.sq2 = this.sq1 + 1;
      this.sq3 = this.sq1 + 10;
      this.sq4 = this.sq2 + 10;
    }
  }

  const square = new Square();
  cellChange();

  function cellChange() {
    cells.forEach((cell, i) => {
      if (Object.values(square).includes(i)) $(cell).addClass('red');
      else $(cell).removeClass('red');
    });
  }

  const timerId = setInterval(() => {
    square.sq1 += key;
    square.sq2 = square.sq1 + 1;
    square.sq3 = square.sq1 + 10;
    square.sq4 = square.sq2 + 10;
    if (Object.values(square).some((sq) => sq > lastCell)) clearInterval(timerId);
    else cellChange();
  },1000);

});
