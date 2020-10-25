// Document Ready Function
function ready(fn) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

// Define options object
const options = {
  config: {
    darkWatch: {
      element: 'body',
      class: 'dark-mode'
    }
  }
};
// Get chart element
// const element = document.getElementById("#graph");
const element = "#graph";
let data = [];
// Initialize chart on ready
let chart;
const init = function () {
  // Define the chart data
  let num = getRandomArbitrary(5, 50);
  let min = 0;
  let max = getRandomArbitrary(1, 5000);
  data = [];
  for (let i = 0; i <= num; i++) {
    data.push(getRandomArbitrary(min, max));
  }
  chart = sirChart.drawBarChart(data, options, element);
};
ready(init);

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
