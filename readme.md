## Demo Leaflet

Para esta demo utilizaremos la librería de Leaflet: https://leafletjs.com/


Para añadir el mapa a nuestro proyecto


### 1. Añadir hoja de estilos de leaflet en `<head>`
```html
 <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
```

### 2. Añadir script de leaflet después del link a la hoja de estilos

```html 

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="">
</script>

```

### 3. Añade el div que contendrá el mapa

```html 

 <div id="map"></div>

 ```

### 4. Da una altura mínima al mapa

```css
#map { height: 180px; }
```

### 5. Crea el mapa en JS, el mapa se centrará en las coordenadas pasadas a setView con el zoom correspondiente al segundo argumento. 

```js

const map = L.map('map').setView([51.505, -0.09], 13);

```

### 6. Establece una capa de mapas

```js 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

```

Tu mapa debería mostrarse ahora en el DOM. 

### 7. Añade marcadores
```js
const marker = L.marker([51.5, -0.09]).addTo(map);

```

### 8. Añade areas
```js
const circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

```

### 9. Añade polígonos
```js

const polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);
```

### 10. Añade pop-ups
```js
const popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);
```


### 11. Cambiar capas de mapa, (librerías de mapas para leaflet)[https://github.com/leaflet-extras/leaflet-providers]:

Añadir las librerias de mapas

```html 
<head>
    <script src="https://unpkg.com/leaflet@latest/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-providers@latest/leaflet-providers.js"></script>
</head>

```

Utilizar la capa deseada, siguiendo la documentación de cada una.

```js 
L.tileLayer.provider('OpenTopoMap').addTo(map);
```

