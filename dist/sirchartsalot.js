
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var sirChart = (function (exports) {
  'use strict';

  //import { SVG } from '@svgdotjs/svg.js/dist/svg.esm.js';

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
  const drawBarChart = function (data, options, element) {
    let chart = new Chart(data, options);
    // Get data from params and store it in config object
    chart.data = data;
    //Detect dark mode and set config
    chart.config.darkmode = detectDarkMode();

    setMutationObserver();

    var chartSVG = SVG()
      .addTo(element)
      .size("100%", "100%")
      .viewbox(0, 0, chart.size.width, chart.size.height);

    // Calculate chart axis min, max, major/minor interval
    let dataMax = 0;
    let dataMin = 0;
    for (const datum of data) {
      dataMax = datum > dataMax ? datum : dataMax;
      dataMin = datum < dataMin ? datum : dataMin;
    }
    chart.scale = calculateTicks(
      chart.tick.maxTicks,
      chart.tick.maxMinorTicks,
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
    config = {
      darkmode: false,
    };
    margin = {
      top: 40,
      bottom: 50,
      left: 72,
      right: 50,
    };
    size = {
      width: 2000,
      height: 1000,
    };
    axis = {
      color: "#BDBDBD",
      colorDark: "#9E9E9E",
      thickness: 1,
    };
    tick = {
      length: 15,
      color: "#9E9E9E",
      colorDark: "#9E9E9E",
      thickness: 1,
      maxTicks: 10,
      maxMinorTicks: 5,
      minorLength: 8,
      minorColor: "#c2c2c2",
      minorColorDark: "#9E9E9E",
      minorThickness: 0.5,
    };
    grid = {
      major: true,
      minor: false,
      majorColor: "#E0E0E0",
      majorColorDark: "#757575",
      majorThickness: 1,
      majorDasharray: "4,4",
      minorColor: "#E0E0E0",
      minorColorDark: "#E0E0E0",
      minorThickness: 1,
      minorDasharray: "5,10",
    };
    labels = {
      yOffset: 20,
      xOffset: 15,
      color: "#000000",
      colorDark: "#E0E0E0",
    };
    bar = {
      spacing: 25,
      color: "#FFEB3B",
      colorDark: "#7048ff",
      fillOpacity: 0.8,
      strokeColor: "#FDD835",
      strokeColorDark: "#7f5cff",
      strokeWidth: 2,
    };
    shapes = {};

    constructor(data, options) {
      this.data = data;
      this.options = options;
      //processOptions();
    }

    toggleDarkMode() {
      this.config.darkmode = !this.config.darkmode;
      // Set colours on elements to light
      for (const child of this.shapes.gridLines.x.children()) {
        child.attr({
          stroke: this.config.darkmode
            ? this.grid.majorColorDark
            : this.grid.majorColor,
        });
      }
      for (const child of this.shapes.gridLines.y.children()) {
        child.attr({
          stroke: this.config.darkmode
            ? this.grid.majorColorDark
            : this.grid.majorColor,
        });
      }
      this.shapes.yAxisLine.attr({
        stroke: this.config.darkmode ? this.axis.colorDark : this.axis.color,
      });
      this.shapes.xAxisLine.attr({
        stroke: this.config.darkmode ? this.axis.colorDark : this.axis.color,
      });
      for (const child of this.shapes.bars.children()) {
        child.attr({
          fill: this.config.darkmode ? this.bar.colorDark : this.bar.color,
          stroke: this.config.darkmode
            ? this.bar.strokeColorDark
            : this.bar.strokeColor,
        });
      }
      for (const child of this.shapes.yAxisMinorTicks.children()) {
        child.attr({
          stroke: this.config.darkmode
            ? this.tick.minorColorDark
            : this.tick.minorColor,
        });
      }
      for (const child of this.shapes.yAxisMajorTicks.children()) {
        child.attr({
          stroke: this.config.darkmode ? this.tick.colorDark : this.tick.color,
        });
      }
      for (const child of this.shapes.xAxisMajorTicks.children()) {
        child.attr({
          stroke: this.config.darkmode
            ? this.labels.colorDark
            : this.labels.color,
        });
      }
      for (const child of this.shapes.yAxisLabels.children()) {
        child.attr({
          fill: this.config.darkmode ? this.labels.colorDark : this.labels.color,
        });
      }
      for (const child of this.shapes.xAxisLabels.children()) {
        child.attr({
          fill: this.config.darkmode ? this.labels.colorDark : this.labels.color,
        });
      }
    }
  }

  function setMutationObserver() {
    //Set up body class observer to watch for dark mode activation
    function callback(mutationsList) {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          if (
            (!chart.config.darkmode &&
              document.querySelector("body").classList.contains("dark-mode")) ||
            (chart.config.darkmode &&
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
        chart.margin.left,
        chart.margin.top,
        chart.margin.left,
        chart.size.height - chart.margin.bottom
      )
      .stroke({
        color: chart.config.darkmode ? chart.axis.colorDark : chart.axis.color,
        width: chart.axis.thickness,
        linecap: "round",
      });
  };

  // Draw the chart x-axis line
  draw.drawXAxisLine = function (svg, chart) {
    return svg
      .line(
        chart.margin.left,
        chart.size.height - chart.margin.bottom,
        chart.size.width - chart.margin.right,
        chart.size.height - chart.margin.bottom
      )
      .stroke({
        color: chart.config.darkmode ? chart.axis.colorDark : chart.axis.color,
        width: chart.axis.thickness,
        linecap: "round",
      });
  };

  // Draw the y-axis minor ticks
  draw.drawYAxisMinorTicks = function (svg, chart) {
    let yAxisMinorTicks = svg.group();
    let xStart = chart.margin.left;
    let xEnd = chart.margin.left - chart.tick.minorLength;
    let yStart = chart.margin.top;
    let yEnd = chart.size.height - chart.margin.bottom;
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
        color: chart.config.darkmode
          ? chart.tick.minorColorDark
          : chart.tick.minorColor,
        width: chart.tick.thickness,
        linecap: "round",
      });
    }
    return yAxisMinorTicks;
  };

  // Draw the y-axis major ticks
  draw.drawYAxisMajorTicks = function (svg, chart) {
    let yAxisMajorTicks = svg.group();
    let xStart = chart.margin.left;
    let xEnd = chart.margin.left - chart.tick.length;
    let yStart = chart.margin.top;
    let yEnd = chart.size.height - chart.margin.bottom;
    let yRange = Math.abs(yEnd - yStart);
    let yTickSpacing = yRange / chart.scale.tickCount;
    for (let i = 0; i <= chart.scale.tickCount; i++) {
      let yCurrent = yStart + i * yTickSpacing;
      yAxisMajorTicks.line(xStart, yCurrent, xEnd, yCurrent).stroke({
        color: chart.config.darkmode ? chart.tick.colorDark : chart.tick.color,
        width: chart.tick.thickness,
        linecap: "round",
      });
    }
    return yAxisMajorTicks;
  };

  // Draw the x-axis ticks
  draw.drawXAxisMajorTicks = function (svg, chart) {
    let xAxisMajorTicks = svg.group();
    let yStart = chart.size.height - chart.margin.bottom;
    let yEnd = yStart + chart.tick.length;
    let xStart = chart.margin.left;
    let xEnd = chart.size.width - chart.margin.right;
    let xRange = Math.abs(xEnd - xStart);
    let xTickSpacing = xRange / chart.data.length;
    for (let i = 0; i <= chart.data.length; i++) {
      let xCurrent = xStart + i * xTickSpacing;
      xAxisMajorTicks.line(xCurrent, yStart, xCurrent, yEnd).stroke({
        color: chart.config.darkmode ? chart.tick.colorDark : chart.tick.color,
        width: chart.tick.thickness,
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
      x1: chart.margin.left,
      y1: chart.size.height - chart.margin.bottom,
      x2: chart.size.width - chart.margin.right,
      y2: chart.size.height - chart.margin.bottom,
    };
    let yAxisStart = {
      x1: chart.margin.left,
      y1: chart.size.height - chart.margin.bottom,
      x2: chart.margin.left,
      y2: chart.margin.top,
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
          color: chart.config.darkmode
            ? chart.grid.majorColorDark
            : chart.grid.majorColor,
          width: chart.grid.majorThickness,
          linecap: "round",
          dasharray: chart.grid.majorDasharray,
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
          color: chart.config.darkmode
            ? chart.grid.majorColorDark
            : chart.grid.majorColor,
          width: chart.grid.majorThickness,
          linecap: "round",
          dasharray: chart.grid.majorDasharray,
        })
        .addClass("gridline-major-y");
    }
    return gridLines;
  };

  // Draw bars
  draw.drawBars = function (svg, chart) {
    let bars = svg.group();
    let xAxisStart = chart.margin.left;
    let xAxisEnd = chart.size.width - chart.margin.right;
    let xAxisRange = Math.abs(xAxisEnd - xAxisStart);
    let barSpace = xAxisRange / chart.data.length;
    let xStart = xAxisStart + barSpace / 2;
    let width = barSpace - barSpace * (chart.bar.spacing / 100);
    let yStart = chart.size.height - chart.margin.bottom;
    let yEnd = chart.margin.top;
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
          fill: chart.config.darkmode ? chart.bar.colorDark : chart.bar.color,
          "fill-opacity": chart.bar.fillOpacity,
          stroke: chart.config.darkmode
            ? chart.bar.strokeColorDark
            : chart.bar.strokeColor,
          "stroke-width": chart.bar.strokeWidth,
        })
        .addClass("bar")
        .addClass("dataset-01");
    }
    return bars;
  };

  // Draw y-axis labels
  draw.drawYAxisLabels = function (svg, chart) {
    let yAxisLabels = svg.group();
    let xOrigin = chart.margin.left - chart.labels.yOffset;
    let yOrigin = chart.size.height - chart.margin.bottom;
    let yRange = Math.abs(chart.margin.top - yOrigin);
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
          fill: chart.config.darkmode
            ? chart.labels.colorDark
            : chart.labels.color,
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
    let xOrigin = chart.margin.left;
    let yOrigin = chart.size.height - chart.margin.bottom + chart.labels.xOffset;
    let xRange = Math.abs(chart.size.width - chart.margin.right - xOrigin);
    let xStep = xRange / chart.data.length;
    let xStart = xOrigin + xStep / 2;
    for (let i = 0; i < chart.data.length; i++) {
      let xCurrent = xStart + i * xStep;
      xAxisLabels
        .text(String(i))
        .font({
          fill: chart.config.darkmode
            ? chart.labels.colorDark
            : chart.labels.color,
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

  exports.drawBarChart = drawBarChart;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
