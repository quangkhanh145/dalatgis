var vectorSource = new ol.source.Vector({
  format: new ol.format.WFS({
    gmlFormat: new ol.format.GML2({srsName: "EPSG:3857"})
  }),
  loader: function (extent, resolution, projection) {
    var url = _thuadat;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    var onError = function(){
      vectorSource.removeLoadedExtent(extent);
    }
    xhr.onerror = onError;
    xhr.onload = function(){
      if (xhr.status == 200){
        vectorSource.addFeatures(vectorSource.getFormat().readFeatures(xhr.responseText));
      } else {
        onError();
      }
    }
    xhr.send();
  },
  strategy: ol.loadingstrategy.bbox
});
var quihoachSource = new ol.source.TileWMS({
  url: _premapserv,
  params: {
    'LAYERS': 'quihoach',
    'FORMAT': 'image/png',
    'TILED': true},
  serverType: 'mapserver',
  crossOrigin: 'Anonymous'
});
var ranhgioiSource = new ol.source.TileWMS({
  url: _premapserv,
  params: {
    'LAYERS': 'ranhgioi',
    'FORMAT': 'image/png',
    'TILED': true
  },
  serverType: 'mapserver',
  crossOrigin: 'Anonymous'
});
var quihoachLayer = new ol.layer.Tile({
  'title' : 'Quy hoạch',
  visible: false,
  source: quihoachSource
});
var vectorLayer = new ol.layer.Vector({
  'title' : 'Thửa đất',
  source: vectorSource,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 51, 0, 0.4)'
    }),
    stroke: new ol.style.Stroke({
      width: 0
    })
  })
});
var ranhgioiLayer = new ol.layer.Tile({
  'title': 'Ranh giới phường/xã',
  visible: true,
  source: ranhgioiSource
});
vectorLayer.on("change:visible",function(){
  selectInteraction.getFeatures().clear();
});
var osmLayer = new ol.layer.Tile ({
  title: 'OpenStreetMap',
  visible: false,
  source: new ol.source.OSM});

var baselayers = new ol.layer.Group({
  'title': 'Bản đồ nền',
  layers : [osmLayer]
});
var dataLayer = new ol.layer.Group({
  'title' : 'Bản đồ dữ liệu',
  layers: [quihoachLayer,vectorLayer,ranhgioiLayer]
});
var map = new ol.Map({
  layers: [baselayers,dataLayer],
  target: 'map',
  view: new ol.View({
    center: [12071122,1338668],
    zoom: 16
  })
});

//Add layer switcher
var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Légende' // Optional label for button
    });
map.addControl(layerSwitcher);
//Add control position
var mousePosition = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(2),
  projection: 'EPSG:3857',
  target: document.getElementById('position'),
  undefinedHTML: '&nbsp;'
});
map.addControl(mousePosition);
//Add zoom to extent
var zoomToExtentControl = new ol.control.ZoomToExtent({
  extent: [12070401, 1338567, 12072757, 1340779]
});
map.addControl(zoomToExtentControl);
//Add export map
var generateExportControl = function(opt_options){
  var options = opt_options || {};
  var anchor = document.createElement('a');
  anchor.href = '#export-map';
  anchor.innerHTML = 'Ex';
  anchor.style.color = "white";
  anchor.style.textDecoration = "none";
  var this_ = this;
  var loading = 0;
  var loaded = 0;
  var getMap = function(e){
    e.preventDefault();
    document.body.style.cursor = 'progress';
    var img = new Image();
    img.crossOrigin = "Anonymous";
    var dataURL;
    var dim = [420, 297];
    var width = Math.round(dim[0] * 150 / 25.4);
    var height = Math.round(dim[1] * 150 / 25.4);
    img.src = _premapserv + "layer=quihoach&mode=map&FORMAT=image/jpg&width="+width+"&height="+height;
    img.onload = function(){
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      dataURL = canvas.toDataURL('image/jpeg');
      var pdf = new jsPDF('landscape');
      pdf.addImage(dataURL, 'JPEG', 0, 0);
      pdf.save('map.pdf');
    }
    document.body.style.cursor = 'auto';
  }
  anchor.addEventListener('click', getMap, false);
  anchor.addEventListener('touchstart', getMap, false);
  var element = document.createElement('div');
  element.className = 'export-map ol-unselectable';
  element.appendChild(anchor);
  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });
}
ol.inherits(generateExportControl, ol.control.Control);
var exportMap = new generateExportControl();
map.addControl(exportMap);
//
var selectedLand = new ol.style.Style({
  fill: new ol.style.Fill({
    color: '#ffff00'
  }),
  stroke: new ol.style.Stroke({
    color: '#ff0000',
    width: 1
  })
});
var selectInteraction = new ol.interaction.Select({
  layers: function(layer){
    return layer.get('selectable') == true;
  },
  style: selectedLand
});

function addInteractionLand() {
  map.getInteractions().extend([selectInteraction]);
  vectorLayer.set('selectable',true);
}
function removeInteractionLand() {
  selectInteraction.getFeatures().clear();
  map.removeInteraction([selectInteraction]);
  vectorLayer.set('selectable',false);
  map.updateSize();
}
addInteractionLand();

//Mesure

/**
 * Currently drawn feature.
 * @type {ol.Feature}
 */
var sketch;

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click để tiếp tục vẽ vùng';

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click để tiếp tục vẽ đường thẳng';

/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;

/**
 * Overlay to show the measurement.
 * @type {ol.Overlay}
 */
var measureTooltip;

/**
 * The help tooltip element.
 * @type {Element}
 */
 var helpTooltipElement;

 /**
 * Overlay to show the help messages.
 * @type {ol.Overlay}
 */
var helpTooltip;

/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt
 */
 var pointerMoveHandler = function(evt) {
  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  var helpMsg = 'Click để bắt đầu vẽ';
  /** @type {ol.Coordinate|undefined} */
  var tooltipCoord = evt.coordinate;
  if (sketch) {
    var output;
    var geom = (sketch.getGeometry());
    if (geom instanceof ol.geom.Polygon) {
      output = formatArea((geom));
      helpMsg = continuePolygonMsg;
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof ol.geom.LineString) {
      output = formatLength((geom));
      helpMsg = continueLineMsg;
      tooltipCoord = geom.getLastCoordinate();
    }
    measureTooltipElement.innerHTML = output;
    measureTooltip.setPosition(tooltipCoord);
  }
  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);
 }

var draw;
var vectorMesurement;

function addInteraction(buttonid) {
  map.on('pointermove', pointerMoveHandler);
  
  var sourceMesurement = new ol.source.Vector();
  vectorMesurement = new ol.layer.Vector({
    source: sourceMesurement,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: '#F78F1E',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });
  map.addLayer(vectorMesurement);
  var type = (buttonid=='mesureline'?'LineString':'Polygon');
  draw = new ol.interaction.Draw({
    source: sourceMesurement,
    type: type,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
        lineDash: [10, 10],
        width: 3
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });
  map.addInteraction(draw);
  createMeasureTooltip();
  createHelpTooltip();
  draw.on('drawstart',function(evt){
    // set sketch
    sketch = evt.feature;
  },this);
  draw.on('drawend',function(evt){
    measureTooltipElement.className = 'tooltip tooltip-static';
    measureTooltip.setOffset([0, -7]);
    // unset sketch
    sketch = null;
    // unset tooltip so that a new one can be created
    measureTooltipElement = null;
    createMeasureTooltip();
  },this);
}

/**
 * Creates a new help tooltip
 */
 function createHelpTooltip() {
  if (helpTooltipElement){
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'tooltip';
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left'
  });
  map.addOverlay(helpTooltip);
 }
 function createMeasureTooltip() {
  if (measureTooltipElement){
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'tooltip tooltip-measure';
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  map.addOverlay(measureTooltip);
 }
 /**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
 */
 var formatLength = function(line) {
  var length;
  length = Math.round(line.getLength() * 100) / 100;
  var output;
  if (length > 1000) {
    output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
  } else {
    output = (Math.round(length * 100) / 100) + ' ' + 'm';
  }
  return output;
 }
 /**
 * format length output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
var formatArea = function(polygon) {
  var area;
  area = polygon.getArea();
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
  } else {
    output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
  }
  return output;
}
$('#mesureline').click(function(){
  addInteraction("mesureline");
  mesureClick();
});
$('#mesurepolygon').click(function(){
  addInteraction("mesurepolygon");
  mesureClick();
});
$('#closer').click(function(evt){
  $("#mode").css("display","none");
  map.on('click', onMouseClick);

  map.un('pointermove', pointerMoveHandler);
  map.removeLayer(vectorMesurement);
  map.removeInteraction(draw);
  map.removeOverlay(helpTooltip);
  map.removeOverlay(measureTooltip);
  map.getOverlays().clear();
  map.on('click', onMouseClick);
  $("#dockContainer").css("display","unset");
  addInteractionLand();
  return false;
});
function mesureClick(){
  map.un('click', onMouseClick);
  $("#mode").css("display","inline");
  $("#dockContainer").css("display","none");
  removeInteractionLand();
}

