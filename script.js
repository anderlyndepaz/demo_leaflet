
//Crear un mapa en el div con id "map"
var map = L.map('map').setView([51.505, -0.09], 13);


//Agregar capa de OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//Para capa personalizada, se puede usar la libreria leaflet-providers, comentar antes la capa de OpenStreetMap
L.tileLayer.provider('OpenTopoMap').addTo(map);


//Agregar marcador
const marker = L.marker([51.5, -0.09]).addTo(map);

//Agregar circulo
const circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

//Agregar poligono
const polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

//Agregar popup
const popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);








