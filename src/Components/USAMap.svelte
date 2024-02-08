<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  let map;

  let getColor = (pass, push) => {
    return pass > push ? 'red' :
           pass < push  ? 'green' :
                         'white';
}

  onMount(() => {
    map = L.map('map').setView([37.8, -96], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.geoJson(statesData).addTo(map);
  });

</script>

<style>
  #map {
    height: 500px;
    width: 800px;
  }
</style>

<div id="map"></div>
