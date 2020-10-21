//import { SVG } from '@svgdotjs/svg.js/dist/svg.esm.js';

// Import styles (automatically injected into <head>).
import "./main.css";

// Import default options object
import { defaultOptions } from "./defaultOptions.js";

/*
* -----------------------------------------------------------------------------
SirChartsALot JS
* Version: 0.0.1
* https://www.jeremyfelix.com
* Copyright, Jeremy Dombrowski
* Licensed under MIT (https://www.gethalfmoon.com/license)
* -----------------------------------------------------------------------------
* The above notice must be included in its entirety when this file is used.
*/

/**
 * Initialize sirchartsalot chart with specified data and options and attach to element
 * @param  {Object} data The chart data object
 * @param  {Object} options Chart options configuration object
 * @param  {String} element The selector of the element to attach the chart to
 * @return {Object} Chart object
 */
export const drawBarChart = function (data, options, element) {
  let chartOptions = mergeOptions(defaultOptions, options);

  let chart = new Chart(data, chartOptions);
  console.log(chart);
  // Get data from params and store it in config object
  chart.data = data;
  //Detect dark mode and set config
  chart.options.config.darkmode = (chart.options.config.darkmode) ? chart.options.config.darkmode : detectDarkMode();

  setMutationObserver();

  // Build and inject CSS rules
  let cssText = buildCSS(chart);
  let cssElement = addCSS(cssText);
  // Store element for later modification
  chart.css.element = cssElement;

  var chartSVG = SVG()
    .addTo(element)
    .size("100%", "100%")
    .viewbox(0, 0, chart.options.size.width, chart.options.size.height);

  // Calculate chart axis min, max, major/minor interval
  let dataMax = 0;
  let dataMin = 0;
  for (const datum of data) {
    dataMax = datum > dataMax ? datum : dataMax;
    dataMin = datum < dataMin ? datum : dataMin;
  }
  chart.scale = calculateTicks(
    chart.options.tick.maxTicks,
    chart.options.tick.maxMinorTicks,
    dataMin,
    dataMax
  );
  console.log(chart.scale);

  chart.shapes.gridLines = draw.drawGridLines(chartSVG, chart);
  chart.shapes.bars = draw.drawBars(chartSVG, chart);
  chart.shapes.yAxisLine = draw.drawYAxisLine(chartSVG, chart);
  chart.shapes.xAxisLine = draw.drawXAxisLine(chartSVG, chart);
  chart.shapes.yAxisMinorTicks = draw.drawYAxisMinorTicks(chartSVG, chart);
  chart.shapes.yAxisMajorTicks = draw.drawYAxisMajorTicks(chartSVG, chart);
  chart.shapes.xAxisMajorTicks = draw.drawXAxisMajorTicks(chartSVG, chart);
  chart.shapes.yAxisLabels = draw.drawYAxisLabels(chartSVG, chart);
  chart.shapes.xAxisLabels = draw.drawXAxisLabels(chartSVG, chart);

  return chart;
};

class Chart {
  constructor(data, options) {
    this.data = data;
    this.options = {...defaultOptions, ...options};
    //processOptions();

    this.shapes = {};
    this.css = {};
  }

  toggleDarkMode() {
    this.options.config.darkmode = !this.options.config.darkmode;
    // Set colours on elements to light
    for (const child of this.shapes.gridLines.x.children()) {
      child.attr({
        stroke: this.options.config.darkmode
          ? this.options.grid.majorColorDark
          : this.options.grid.majorColor,
      });
    }
    for (const child of this.shapes.gridLines.y.children()) {
      child.attr({
        stroke: this.options.config.darkmode
          ? this.options.grid.majorColorDark
          : this.options.grid.majorColor,
      });
    }
    this.shapes.yAxisLine.attr({
      stroke: this.options.config.darkmode ? this.options.axis.colorDark : this.options.axis.color,
    });
    this.shapes.xAxisLine.attr({
      stroke: this.options.config.darkmode ? this.options.axis.colorDark : this.options.axis.color,
    });
    for (const child of this.shapes.bars.children()) {
      child.attr({
        fill: this.options.config.darkmode ? this.options.bar.colorDark : this.options.bar.color,
        stroke: this.options.config.darkmode
          ? this.options.bar.strokeColorDark
          : this.options.bar.strokeColor,
      });
    }
    for (const child of this.shapes.yAxisMinorTicks.children()) {
      child.attr({
        stroke: this.options.config.darkmode
          ? this.options.tick.minorColorDark
          : this.options.tick.minorColor,
      });
    }
    for (const child of this.shapes.yAxisMajorTicks.children()) {
      child.attr({
        stroke: this.options.config.darkmode ? this.options.tick.colorDark : this.options.tick.color,
      });
    }
    for (const child of this.shapes.xAxisMajorTicks.children()) {
      child.attr({
        stroke: this.options.config.darkmode
          ? this.options.labels.colorDark
          : this.options.labels.color,
      });
    }
    for (const child of this.shapes.yAxisLabels.children()) {
      child.attr({
        fill: this.options.config.darkmode ? this.options.labels.colorDark : this.options.labels.color,
      });
    }
    for (const child of this.shapes.xAxisLabels.children()) {
      child.attr({
        fill: this.options.config.darkmode ? this.options.labels.colorDark : this.options.labels.color,
      });
    }
  }
}

function mergeOptions(defaults, user) {
  let merged = {};
  for (const key in defaults){
    merged[key] = {...defaults[key], ...user[key]};
  }
  return merged;
};

function setMutationObserver() {
  //Set up body class observer to watch for dark mode activation
  function callback(mutationsList) {
    mutationsList.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        if (
          (!chart.options.config.darkmode &&
            document.querySelector("body").classList.contains("dark-mode")) ||
          (chart.options.config.darkmode &&
            !document.querySelector("body").classList.contains("dark-mode"))
        ) {
          chart.toggleDarkMode();
        }
      }
    });
  }
  const mutationObserver = new MutationObserver(callback);
  mutationObserver.observe(document.querySelector("body"), {
    attributes: true,
  });
}

function buildCSS(chart) {
  let cssText = `
  rect.bar:hover{
    fill: ${LightenDarkenColor(chart.options.bar.color, 90)};
    stroke: ${LightenDarkenColor(chart.options.bar.strokeColor, 55)};
  }
  body.dark-mode rect.bar:hover{
    fill: ${LightenDarkenColor(chart.options.bar.colorDark, 90)};
    stroke: ${LightenDarkenColor(chart.options.bar.strokeColorDark, 55)};
  }
  `;
  console.log(cssText);
  return cssText;
}

function LightenDarkenColor(col, amt) {
  var usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }
  var num = parseInt(col, 16);
  var r = (num >> 16) + amt;
  if (r > 255) r = 255;
  else if (r < 0) r = 0;
  var b = ((num >> 8) & 0x00ff) + amt;
  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  var g = (num & 0x0000ff) + amt;
  if (g > 255) g = 255;
  else if (g < 0) g = 0;
  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

function addCSS(text) {
  var style = document.createElement("style");
  style.id = `sirchart-${ID()}-style`;
  style.textContent = text;
  document.head.appendChild(style);
  console.log(`${style.id} - ${style.textContent}`);
  return style;
}

function removeCSS(element) {
  element.parentNode.removeChild(element);
  return true;
}

// Detect dark mode
function detectDarkMode() {
  let element = document.querySelector("body");
  let darkmode = element.classList.contains("dark-mode");
  return darkmode;
}

const draw = {};
// Draw the chart y-axis line
draw.drawYAxisLine = function (svg, chart) {
  return svg
    .line(
      chart.options.margin.left,
      chart.options.margin.top,
      chart.options.margin.left,
      chart.options.size.height - chart.options.margin.bottom
    )
    .stroke({
      color: chart.options.config.darkmode ? chart.options.axis.colorDark : chart.options.axis.color,
      width: chart.options.axis.thickness,
      linecap: "round",
    });
};

// Draw the chart x-axis line
draw.drawXAxisLine = function (svg, chart) {
  return svg
    .line(
      chart.options.margin.left,
      chart.options.size.height - chart.options.margin.bottom,
      chart.options.size.width - chart.options.margin.right,
      chart.options.size.height - chart.options.margin.bottom
    )
    .stroke({
      color: chart.options.config.darkmode ? chart.options.axis.colorDark : chart.options.axis.color,
      width: chart.options.axis.thickness,
      linecap: "round",
    });
};

// Draw the y-axis minor ticks
draw.drawYAxisMinorTicks = function (svg, chart) {
  let yAxisMinorTicks = svg.group();
  let xStart = chart.options.margin.left;
  let xEnd = chart.options.margin.left - chart.options.tick.minorLength;
  let yStart = chart.options.margin.top;
  let yEnd = chart.options.size.height - chart.options.margin.bottom;
  let yRange = Math.abs(yEnd - yStart);
  let yTickSpacing =
    yRange / chart.scale.tickCount / chart.scale.minorTickCount;
  for (
    let i = 0;
    i <= chart.scale.tickCount * chart.scale.minorTickCount;
    i++
  ) {
    let yCurrent = yStart + i * yTickSpacing;
    yAxisMinorTicks.line(xStart, yCurrent, xEnd, yCurrent).stroke({
      color: chart.options.config.darkmode
        ? chart.options.tick.minorColorDark
        : chart.options.tick.minorColor,
      width: chart.options.tick.thickness,
      linecap: "round",
    });
  }
  return yAxisMinorTicks;
};

// Draw the y-axis major ticks
draw.drawYAxisMajorTicks = function (svg, chart) {
  let yAxisMajorTicks = svg.group();
  let xStart = chart.options.margin.left;
  let xEnd = chart.options.margin.left - chart.options.tick.length;
  let yStart = chart.options.margin.top;
  let yEnd = chart.options.size.height - chart.options.margin.bottom;
  let yRange = Math.abs(yEnd - yStart);
  let yTickSpacing = yRange / chart.scale.tickCount;
  for (let i = 0; i <= chart.scale.tickCount; i++) {
    let yCurrent = yStart + i * yTickSpacing;
    yAxisMajorTicks.line(xStart, yCurrent, xEnd, yCurrent).stroke({
      color: chart.options.config.darkmode ? chart.options.tick.colorDark : chart.options.tick.color,
      width: chart.options.tick.thickness,
      linecap: "round",
    });
  }
  return yAxisMajorTicks;
};

// Draw the x-axis ticks
draw.drawXAxisMajorTicks = function (svg, chart) {
  let xAxisMajorTicks = svg.group();
  let yStart = chart.options.size.height - chart.options.margin.bottom;
  let yEnd = yStart + chart.options.tick.length;
  let xStart = chart.options.margin.left;
  let xEnd = chart.options.size.width - chart.options.margin.right;
  let xRange = Math.abs(xEnd - xStart);
  let xTickSpacing = xRange / chart.data.length;
  for (let i = 0; i <= chart.data.length; i++) {
    let xCurrent = xStart + i * xTickSpacing;
    xAxisMajorTicks.line(xCurrent, yStart, xCurrent, yEnd).stroke({
      color: chart.options.config.darkmode ? chart.options.tick.colorDark : chart.options.tick.color,
      width: chart.options.tick.thickness,
      linecap: "round",
    });
  }
  return xAxisMajorTicks;
};

// Draw backgroud graph lines
draw.drawGridLines = function (svg, chart) {
  let gridLines = {
    x: svg.group(),
    y: svg.group(),
  };
  let xAxisStart = {
    x1: chart.options.margin.left,
    y1: chart.options.size.height - chart.options.margin.bottom,
    x2: chart.options.size.width - chart.options.margin.right,
    y2: chart.options.size.height - chart.options.margin.bottom,
  };
  let yAxisStart = {
    x1: chart.options.margin.left,
    y1: chart.options.size.height - chart.options.margin.bottom,
    x2: chart.options.margin.left,
    y2: chart.options.margin.top,
  };
  let yStep = Math.abs(yAxisStart.y2 - yAxisStart.y1) / chart.scale.tickCount;
  let xStep = Math.abs(xAxisStart.x2 - xAxisStart.x1) / chart.data.length;
  for (let i = 1; i <= chart.scale.tickCount; i++) {
    let xAxisCurrent = {
      y1: xAxisStart.y1 - i * yStep,
      y2: xAxisStart.y2 - i * yStep,
    };
    gridLines.x
      .line(xAxisStart.x1, xAxisCurrent.y1, xAxisStart.x2, xAxisCurrent.y2)
      .stroke({
        color: chart.options.config.darkmode
          ? chart.options.grid.majorColorDark
          : chart.options.grid.majorColor,
        width: chart.options.grid.majorThickness,
        linecap: "round",
        dasharray: chart.options.grid.majorDasharray,
      })
      .addClass("gridline-major-x");
  }

  for (let i = 0; i <= chart.data.length; i++) {
    let yAxisCurrent = {
      x1: yAxisStart.x1 + i * xStep,
      x2: yAxisStart.x2 + i * xStep,
    };
    gridLines.y
      .line(yAxisCurrent.x1, yAxisStart.y1, yAxisCurrent.x2, yAxisStart.y2)
      .stroke({
        color: chart.options.config.darkmode
          ? chart.options.grid.majorColorDark
          : chart.options.grid.majorColor,
        width: chart.options.grid.majorThickness,
        linecap: "round",
        dasharray: chart.options.grid.majorDasharray,
      })
      .addClass("gridline-major-y");
  }
  return gridLines;
};

// Draw bars
draw.drawBars = function (svg, chart) {
  let bars = svg.group();
  let xAxisStart = chart.options.margin.left;
  let xAxisEnd = chart.options.size.width - chart.options.margin.right;
  let xAxisRange = Math.abs(xAxisEnd - xAxisStart);
  let barSpace = xAxisRange / chart.data.length;
  let xStart = xAxisStart + barSpace / 2;
  let width = barSpace - barSpace * (chart.options.bar.spacing / 100);
  let yStart = chart.options.size.height - chart.options.margin.bottom;
  let yEnd = chart.options.margin.top;
  let yRange = Math.abs(yEnd - yStart);
  let yConstant = yRange / Math.abs(chart.scale.niceMax - chart.scale.niceMin);
  for (let i = 0; i < chart.data.length; i++) {
    let xCurrent = xStart + barSpace * i;
    bars
      .rect(width, data[i] * yConstant)
      .transform({
        origin: "bottom center",
        position: {
          x: xCurrent,
          y: yStart,
        },
      })
      .attr({
        fill: chart.options.config.darkmode ? chart.options.bar.colorDark : chart.options.bar.color,
        "fill-opacity": chart.options.bar.fillOpacity,
        stroke: chart.options.config.darkmode
          ? chart.options.bar.strokeColorDark
          : chart.options.bar.strokeColor,
        "stroke-width": chart.options.bar.strokeWidth,
      })
      .addClass("bar")
      .addClass("dataset-01");
  }
  return bars;
};

// Draw y-axis labels
draw.drawYAxisLabels = function (svg, chart) {
  let yAxisLabels = svg.group();
  let xOrigin = chart.options.margin.left - chart.options.labels.yOffset;
  let yOrigin = chart.options.size.height - chart.options.margin.bottom;
  let yRange = Math.abs(chart.options.margin.top - yOrigin);
  let yStep = yRange / chart.scale.tickCount;
  for (let i = 0; i <= chart.scale.tickCount; i++) {
    let yCurrent = yOrigin - i * yStep;
    let yValue = chart.scale.niceMin + i * chart.scale.tickSpacing;
    let labelText = (+yValue)
      .toFixed(2)
      .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, "$1");
    yAxisLabels
      .text(labelText)
      .font({
        fill: chart.options.config.darkmode
          ? chart.options.labels.colorDark
          : chart.options.labels.color,
        family: "Roboto",
      })
      .transform({
        origin: "right center",
        position: {
          x: xOrigin,
          y: yCurrent,
        },
      });
  }
  return yAxisLabels;
};

// Draw x-axis labels
draw.drawXAxisLabels = function (svg, chart) {
  let xAxisLabels = svg.group();
  let xOrigin = chart.options.margin.left;
  let yOrigin = chart.options.size.height - chart.options.margin.bottom + chart.options.labels.xOffset;
  let xRange = Math.abs(chart.options.size.width - chart.options.margin.right - xOrigin);
  let xStep = xRange / chart.data.length;
  let xStart = xOrigin + xStep / 2;
  for (let i = 0; i < chart.data.length; i++) {
    let xCurrent = xStart + i * xStep;
    xAxisLabels
      .text(String(i))
      .font({
        fill: chart.options.config.darkmode
          ? chart.options.labels.colorDark
          : chart.options.labels.color,
        family: "Roboto",
      })
      .transform({
        origin: "top center",
        position: {
          x: xCurrent,
          y: yOrigin,
        },
      });
  }
  return xAxisLabels;
};

/**
 * Calculate and update values for tick spacing and nice
 * minimum and maximum data points on the axis.
 * @param {number} maxTicks The maximum number of ticks desired
 * @param {number} minPoint The minimum value of the data points
 * @param {number} maxPoint The maximum value of the data points
 * @return {Object} scale
 * @return {number} scale.tickCount - the number of ticks displayed
 * @return {number} scale.tickSpacing - The range of each tick
 * @return {number} scale.niceMin - The calculated nice minimum value
 * @return {number} scale.niceMax - The calculated nice maximum value
 */
function calculateTicks(maxTicks, maxMinorTicks, minPoint, maxPoint) {
  let range = niceNum(maxPoint - minPoint, false);
  let tickSpacing = niceNum(range / (maxTicks - 1), true);
  let niceMin = Math.floor(minPoint / tickSpacing) * tickSpacing;
  let niceMax = Math.ceil(maxPoint / tickSpacing) * tickSpacing;
  let tickCount = Math.abs(niceMax - niceMin) / tickSpacing; // I modified this and added the Math.abs
  let minorTickSpacing = niceNum(tickSpacing / (maxMinorTicks - 1), true);
  let minorTickCount = tickSpacing / minorTickSpacing;
  return {
    tickCount: tickCount,
    tickSpacing: tickSpacing,
    minorTickCount: minorTickCount,
    minorTickSpacing: minorTickSpacing,
    niceMin: niceMin,
    niceMax: niceMax,
  };
}

/**
 * Returns a "nice" number approximately equal to range Rounds
 * the number if round = true Takes the ceiling if round = false.
 *
 * @param range the data range
 * @param round whether to round the result
 * @return a "nice" number to be used for the data range
 */
function niceNum(range, round) {
  let exponent;
  /** exponent of range */
  let fraction;
  /** fractional part of range */
  let niceFraction;
  /** nice, rounded fraction */

  exponent = Math.floor(Math.log10(range));
  fraction = range / Math.pow(10, exponent);

  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }

  return niceFraction * Math.pow(10, exponent);
}

// Generate unique IDs for use as pseudo-private/protected names.
// Similar in concept to
// <http://wiki.ecmascript.org/doku.php?id=strawman:names>.
//
// The goals of this function are twofold:
//
// * Provide a way to generate a string guaranteed to be unique when compared
//   to other strings generated by this function.
// * Make the string complex enough that it is highly unlikely to be
//   accidentally duplicated by hand (this is key if you're using `ID`
//   as a private/protected name on an object).
//
// Use:
//
//     var privateName = ID();
//     var o = { 'public': 'foo' };
//     o[privateName] = 'bar';
var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return Math.random().toString(36).substr(2, 9);
};
