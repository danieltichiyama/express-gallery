"strict mode";

function resizeGridCard(card) {
  let grid = document.getElementById("grid");
  let rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-auto-rows")
  ); //gets height of the grid's row;
  let rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-row-gap")
  ); //gets the height of the grid's gaps;
  let rowSpan = Math.ceil(
    (card.querySelector(".cardContent").getBoundingClientRect().height +
      rowGap) /
      (rowHeight + rowGap)
  ); //returns the value of the height of a card based on how many times the card's height + rowGap can be divided by the grid's rowHeight + rowGap;

  card.style.gridRowEnd = "span " + rowSpan; //sets the number of rows the card spans;
} //sets the number of rows the card spans;

function resizeAllGridCards() {
  let allCards = document.getElementsByClassName("card");
  for (let i = 0; i < allCards.length; i++) {
    imagesLoaded(allCards[i], resizeInstance); //runs the resizeGridItem func only after images have loaded;
  }
} //finds and applies the resizeGridCard to all instances of the card class;

function resizeInstance(instance) {
  let card = instance.elements[0];
  resizeGridCard(card);
} //used as a callback for resizeAllGridCards;

window.onload = resizeAllGridCards(); //runs function on window load;

window.addEventListener("resize", resizeAllGridCards);
