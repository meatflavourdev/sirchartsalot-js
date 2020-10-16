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

let sirChart = (function () {
  let chart = {
    config: {
      darkmode: false,
    },
    margin: {
      top: 40,
      bottom: 50,
      left: 72,
      right: 50,
    },
    size: {
      width: 2000,
      height: 1000,
    },
    axis: {
      color: "#BDBDBD",
      colorDark: "#9E9E9E",
      thickness: 1,
    },
    tick: {
      length: 15,
      color: "#9E9E9E",
      colorDark: "#9E9E9E",
      thickness: 1,
      maxTicks: 10,
      maxMinorTicks: 5,
      minorLength: 8,
      minorColor: "#FAFAFA",
      minorColorDark: "#9E9E9E",
      minorThickness: 0.5,
    },
    grid: {
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
    },
    labels: {
      yOffset: 20,
      xOffset: 15,
      color: "#000000",
      colorDark: "#E0E0E0",
    },
    bar: {
      spacing: 25,
      color: "#FFEB3B",
      colorDark: "#7048ff",
      fillOpacity: 0.85,
      strokeColor: "#FDD835",
      strokeColorDark: "#7f5cff",
      strokeWidth: 2,
    },
    shapes: {},
    toggleDarkMode: function () {
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
          stroke: this.config.darkmode
            ? this.tick.colorDark
            : this.tick.color,
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
          fill: this.config.darkmode
            ? this.labels.colorDark
            : this.labels.color,
        });
      }
      for (const child of this.shapes.xAxisLabels.children()) {
        child.attr({
          fill: this.config.darkmode
            ? this.labels.colorDark
            : this.labels.color,
        });
      }
    },
  };

  return {
    drawBarChart: function (data, options, element) {
      // Get data from params and store it in config object
      chart.data = data;
      //Detect dark mode and set config
      chart.config.darkmode = detectDarkMode();

      //Set up body class observer to watch for dark mode activation
      function callback(mutationsList) {
        mutationsList.forEach((mutation) => {
          if (mutation.attributeName === "class") {
            if (
              (!chart.config.darkmode &&
                document
                  .querySelector("body")
                  .classList.contains("dark-mode")) ||
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

      var draw = SVG()
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

      chart.shapes.gridLines = drawGridLines(draw, chart);
      chart.shapes.bars = drawBars(draw, chart);
      chart.shapes.yAxisLine = drawYAxisLine(draw, chart);
      chart.shapes.xAxisLine = drawXAxisLine(draw, chart);
      chart.shapes.yAxisMinorTicks = drawYAxisMinorTicks(draw, chart);
      chart.shapes.yAxisMajorTicks = drawYAxisMajorTicks(draw, chart);
      chart.shapes.xAxisMajorTicks = drawXAxisMajorTicks(draw, chart);
      chart.shapes.yAxisLabels = drawYAxisLabels(draw, chart);
      chart.shapes.xAxisLabels = drawXAxisLabels(draw, chart);

      return chart;
    },
  };

  // Detect dark mode
  function detectDarkMode() {
    return document.querySelector("body").classList.contains("dark-mode");
  }

  // Draw the chart y-axis line
  function drawYAxisLine(draw, config) {
    return draw
      .line(
        config.margin.left,
        config.margin.top,
        config.margin.left,
        config.size.height - config.margin.bottom
      )
      .stroke({
        color: chart.config.darkmode
          ? config.axis.colorDark
          : config.axis.color,
        width: config.axis.thickness,
        linecap: "round",
      });
  }

  // Draw the chart x-axis line
  function drawXAxisLine(draw, config) {
    return draw
      .line(
        config.margin.left,
        config.size.height - config.margin.bottom,
        config.size.width - config.margin.right,
        config.size.height - config.margin.bottom
      )
      .stroke({
        color: chart.config.darkmode
          ? config.axis.colorDark
          : config.axis.color,
        width: config.axis.thickness,
        linecap: "round",
      });
  }

  // Draw the y-axis minor ticks
  function drawYAxisMinorTicks(draw, config) {
    let yAxisMinorTicks = draw.group();
    let xStart = config.margin.left;
    let xEnd = config.margin.left - config.tick.minorLength;
    let yStart = config.margin.top;
    let yEnd = config.size.height - config.margin.bottom;
    let yRange = Math.abs(yEnd - yStart);
    let yTickSpacing =
      yRange / config.scale.tickCount / config.scale.minorTickCount;
    for (
      let i = 0;
      i <= config.scale.tickCount * config.scale.minorTickCount;
      i++
    ) {
      let yCurrent = yStart + i * yTickSpacing;
      yAxisMinorTicks.line(xStart, yCurrent, xEnd, yCurrent).stroke({
        color: chart.config.darkmode
          ? config.tick.minorColorDark
          : config.tick.minorColor,
        width: config.tick.thickness,
        linecap: "round",
      });
    }
    return yAxisMinorTicks;
  }

  // Draw the y-axis major ticks
  function drawYAxisMajorTicks(draw, config) {
    let yAxisMajorTicks = draw.group();
    let xStart = config.margin.left;
    let xEnd = config.margin.left - config.tick.length;
    let yStart = config.margin.top;
    let yEnd = config.size.height - config.margin.bottom;
    let yRange = Math.abs(yEnd - yStart);
    let yTickSpacing = yRange / config.scale.tickCount;
    for (let i = 0; i <= config.scale.tickCount; i++) {
      let yCurrent = yStart + i * yTickSpacing;
      yAxisMajorTicks.line(xStart, yCurrent, xEnd, yCurrent).stroke({
        color: chart.config.darkmode
          ? config.tick.colorDark
          : config.tick.color,
        width: config.tick.thickness,
        linecap: "round",
      });
    }
    return yAxisMajorTicks;
  }

  // Draw the x-axis ticks
  function drawXAxisMajorTicks(draw, config) {
    let xAxisMajorTicks = draw.group();
    let yStart = config.size.height - config.margin.bottom;
    let yEnd = yStart + config.tick.length;
    let xStart = config.margin.left;
    let xEnd = config.size.width - config.margin.right;
    let xRange = Math.abs(xEnd - xStart);
    let xTickSpacing = xRange / config.data.length;
    for (let i = 0; i <= config.data.length; i++) {
      let xCurrent = xStart + i * xTickSpacing;
      xAxisMajorTicks.line(xCurrent, yStart, xCurrent, yEnd).stroke({
        color: chart.config.darkmode
          ? config.tick.colorDark
          : config.tick.color,
        width: config.tick.thickness,
        linecap: "round",
      });
    }
    return xAxisMajorTicks;
  }

  // Draw backgroud graph lines
  function drawGridLines(draw, config) {
    let gridLines = {
      x: draw.group(),
      y: draw.group(),
    };
    let xAxisStart = {
      x1: config.margin.left,
      y1: config.size.height - config.margin.bottom,
      x2: config.size.width - config.margin.right,
      y2: config.size.height - config.margin.bottom,
    };
    let yAxisStart = {
      x1: config.margin.left,
      y1: config.size.height - config.margin.bottom,
      x2: config.margin.left,
      y2: config.margin.top,
    };
    let yStep =
      Math.abs(yAxisStart.y2 - yAxisStart.y1) / config.scale.tickCount;
    let xStep = Math.abs(xAxisStart.x2 - xAxisStart.x1) / config.data.length;
    for (let i = 1; i <= config.scale.tickCount; i++) {
      let xAxisCurrent = {
        y1: xAxisStart.y1 - i * yStep,
        y2: xAxisStart.y2 - i * yStep,
      };
      gridLines.x
        .line(xAxisStart.x1, xAxisCurrent.y1, xAxisStart.x2, xAxisCurrent.y2)
        .stroke({
          color: chart.config.darkmode
            ? config.grid.majorColorDark
            : config.grid.majorColor,
          width: config.grid.majorThickness,
          linecap: "round",
          dasharray: config.grid.majorDasharray,
        });
    }

    for (let i = 0; i <= config.data.length; i++) {
      let yAxisCurrent = {
        x1: yAxisStart.x1 + i * xStep,
        x2: yAxisStart.x2 + i * xStep,
      };
      gridLines.y
        .line(yAxisCurrent.x1, yAxisStart.y1, yAxisCurrent.x2, yAxisStart.y2)
        .stroke({
          color: chart.config.darkmode
            ? config.grid.majorColorDark
            : config.grid.majorColor,
          width: config.grid.majorThickness,
          linecap: "round",
          dasharray: config.grid.majorDasharray,
        });
    }
    return gridLines;
  }

  // Draw bars
  function drawBars(draw, config) {
    let bars = draw.group();
    let xAxisStart = config.margin.left;
    let xAxisEnd = config.size.width - config.margin.right;
    let xAxisRange = Math.abs(xAxisEnd - xAxisStart);
    let barSpace = xAxisRange / config.data.length;
    let xStart = xAxisStart + barSpace / 2;
    let width = barSpace - barSpace * (config.bar.spacing / 100);
    let yStart = config.size.height - config.margin.bottom;
    let yEnd = config.margin.top;
    let yRange = Math.abs(yEnd - yStart);
    let yConstant =
      yRange / Math.abs(config.scale.niceMax - config.scale.niceMin);
    for (let i = 0; i < config.data.length; i++) {
      xCurrent = xStart + barSpace * i;
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
          fill: chart.config.darkmode ? config.bar.colorDark : config.bar.color,
          "fill-opacity": config.bar.fillOpacity,
          stroke: chart.config.darkmode
            ? config.bar.strokeColorDark
            : config.bar.strokeColor,
          "stroke-width": config.bar.strokeWidth,
        })
        .addClass("bar")
        .addClass("dataset-01");
    }
    return bars;
  }

  // Draw y-axis labels
  function drawYAxisLabels(draw, config) {
    let yAxisLabels = draw.group();
    let xOrigin = config.margin.left - config.labels.yOffset;
    let yOrigin = config.size.height - config.margin.bottom;
    let yRange = Math.abs(config.margin.top - yOrigin);
    let yStep = yRange / config.scale.tickCount;
    for (let i = 0; i <= config.scale.tickCount; i++) {
      let yCurrent = yOrigin - i * yStep;
      let yValue = config.scale.niceMin + i * config.scale.tickSpacing;
      labelText = (+yValue)
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
  }

  // Draw x-axis labels
  function drawXAxisLabels(draw, config) {
    let xAxisLabels = draw.group();
    let xOrigin = config.margin.left;
    let yOrigin =
      config.size.height - config.margin.bottom + config.labels.xOffset;
    let xRange = Math.abs(config.size.width - config.margin.right - xOrigin);
    let xStep = xRange / config.data.length;
    let xStart = xOrigin + xStep / 2;
    for (let i = 0; i < config.data.length; i++) {
      xCurrent = xStart + i * xStep;
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
  }

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
})();
