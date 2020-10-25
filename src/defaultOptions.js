const defaultOptions = {
  config: {
    darkmode: false
  },
  size: {
    width: 2000,
    height: 1000
  },
  margin: {
    top: 40,
    bottom: 50,
    left: 72,
    right: 50,
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
    minorColor: "#c2c2c2",
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
    fillOpacity: 0.8,
    strokeColor: "#FDD835",
    strokeColorDark: "#7f5cff",
    strokeWidth: 2,
  }
};

export { defaultOptions };
