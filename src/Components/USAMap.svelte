<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import statesData from '../statesData';

  let map;
  let info;
  let geojson;

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: function (e) {
        highlightFeature(e);
      },
      mouseout: function (e) {
        resetHighlight(e);
      },
      click: function (e) {
        zoomToFeature(e);
      }
    });
  }

  function getColor(d) {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }

  function style(feature) {
    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });
    layer.bringToFront();

    // Update information displayed in the top right corner
    info.update(layer.feature.properties);
  }

  function resetHighlight(e) {
    geojson.resetStyle(e.target);

    // Reset information displayed in the top right corner
    info.update();
  }

  onMount(() => {
    map = L.map('map').setView([37.8, -96], 4);

    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Define info object with update method
    info = {
      update: function(props) {
        if (props) {
          this._div.innerHTML = '<h4>US Population Density</h4>' + props.name + ' : ' + props.density + ' people / mi<sup>2</sup>';
        } else {
          this._div.innerHTML = '<h4>US Population Density</h4>Hover over a state';
        }
      },
      _div: null
    };

    // Create and add info control to the map
    var infoControl = L.control();
    infoControl.onAdd = function (map) {
      info._div = L.DomUtil.create('div', 'info');
      info.update();
      return info._div;
    };
    infoControl.addTo(map);

    // Load GeoJSON data and apply styles and interactions
    geojson = L.geoJson(statesData, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  });
</script>

<style>
  .info {
    position: absolute;
    top: 10px;
    right: 10px;
    background: white;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
  .info h4 {
    margin-top: 0;
  }
</style>

<div id="map"  style="height: 600px;"></div>
