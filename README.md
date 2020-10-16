# SirChartsALot.js

A simple JavaScript bar chart library



## Features & Considerations

- Bar charts plot categorial data to show comparison among discreet categories. One axis shows categories being compared, and the other represents a measured value.
- Should jQuery be required or optional(?)
  - Do I need jQuery to manipulate the DOM, or can I use vanilla JavaScript for this(?)
  - Do I want to accept jQuery elements for the `element` parameter even if I don't use jQuery to manipulate the DOM?
- Horizontal and Vertical charts supported
  - Necessary for optimal display of certain types of data
- Supported Chart types
  - Regular Bar Graph
    - Single Bar Graph
    - Grouped Bar Graph
    - *Floating Bar Graph (Start and end values)(?)*
    - *Funnel Chart(?)* / *Split Funnel(?)*
  - Stacked Bar Graph
    - Simple Stacked Bar Graph
    - 100% Stacked Bar Graph
    - *Diverging Stacked Bar Graph (negative values)(?)*
- Bar width & height should be dependent on the data and the size of the chart
- Chart data and options should be able to be updated dynamically
- Animations for loading and updating
- Should some properties support function definitions(?) -- function can use options context to return unique argument
- Selection indicator *(optional)* - grey bar in the background that moves from bar to bar following mouse
- Consider adding data table viewer feature (modal data table?)

## API Definition
### Initialize Chart

Render a bar chart with the specified `data` configured with `options` into the DOM element (or jQuery element?) referenced by `element`

#### Usage

```javascript
Chart (Object): drawBarChart(data , options, element)
```

#### Returns

##### `Chart` (Object):  The bar chart object

#### Arguments 

##### `data` (Array|Object): Simple value Array or data object

This argument accepts either a simple array or values or a data object wherein multiple data series and corresponding properties may be specified.

```javascript
{
	"category": ["label_01", "label_02", "label_03"],
	"series": [
		"name": (String),
        "data": [Array]
	]
}
```

`Array` of number eg. `[1, 2, 3, 4, 5]`

##### `options` (Object): Chart options object

An `Object` which has options for the chart

- `stacking` (String):
  - `none`: Displays a standard single or grouped bar chart
  - `stacked`: Simple stacked bar graph which places every value in each  group in a segmented section
  - `100%` : 
- `title` 
  - `chart` (String): 
  - `subtitle` (String): 
  - `categoryAxis` (String): 
  - `valueAxis` (String): 
- Axis Labels (appearance?)
  - category axis
    - label
  - value axis 
    - label
    - unit
- Data Value
  - Appearance options
    - Numerical value display
    - Numerical value display position
      - `top`, `center`, `bottom` 
- Group properties(?)
  - fillColor: Specified for the entire group
  - borderColor
  - borderWidth
  - value_colour: Data value label colour for the group
- Series properties
  - bar_colour: Specified for the entire data series
  - value_colour: Data value label colour for the series
- Bar properties
  - bar_colour: Specified for individual data values
  - value_colour: Data value label colour for individual data values
  - padding - Space between bars (relative or absolute)
- Spacing
  - Space between bars/groups
  - Space between bars in the same group
- Legend
- Axis/Grid/Ticks
  - min
  - max
  - Gridlines
  - Tick intervals
- Chart size
  - width
  - height
- Font sizes and colours
- Animations
- Tooltip

##### `element` (Object): DOM element
Specifies the DOM element (or jQuery element?) that the chart will be rendered into

### Updating Charts

#### Usage

Charts can be made to show updated data and configuration by calling the `update()` method on the `chart` object. If animations are specified in `options`, the chart will animate to the new data values and options.

```javascript
chart.update();
```

#### Adding Data

##### Example

```javascript
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}
```

#### Removing Data

##### Example

```javascript
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
```

#### Updating Options

##### Examples

```javascript
function updateConfigByMutating(chart) {
    chart.options.title.text = 'new title';
    chart.update();
}

function updateConfigAsNewObject(chart) {
    chart.options = {
        responsive: true,
        title: {
            display: true,
            text: 'Chart.js'
        },
        scales: {
            xAxes: [{
                display: true
            }],
            yAxes: [{
                display: true
            }]
        }
    };
    chart.update();
}
```
