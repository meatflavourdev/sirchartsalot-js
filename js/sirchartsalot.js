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

var draw = SVG().addTo('#graph-01').size('100%', '500');
var rect01 = draw.rect(100, 100).attr({ fill: '#f06' });
var rect02 = draw.rect(100, 100).attr({ fill: '#000' }).move(200, 350);
