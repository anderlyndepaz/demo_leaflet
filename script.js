if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        console.log(`Latitud: ${position.coords.latitude}\nLongitud: ${position.coords.longitude}`);
        let datos = `<h1>Aquí estoy!</h1>
        <p>Lat: ${position.coords.latitude.toFixed(4)}</p>
        <p>Long: ${position.coords.longitude.toFixed(4)}</p>`
        document.getElementById("localizacion").innerHTML = datos;
    });

    navigator.geolocation.watchPosition(position => {
        console.log(`${position.coords.latitude}, ${position.coords.longitude}`)
    }, error => {
        console.warn(`Error! - ${error}`);
    });

} else {
    console.warn("Tu navegador no soporta Geolocalización!! ");
}
//Crear un mapa en el div con id "map"
var map = L.map('map').setView([40.423, -3.692], 15);


//Agregar capa de OpenStreetMap
L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//Para capa personalizada, se puede usar la libreria leaflet-providers, comentar antes la capa de OpenStreetMap
L.tileLayer.provider('OpenStreetMap.CH').addTo(map);


//Agregar marcador
const marker = L.marker([40.423, -3.692])
    .bindPopup("<b>Holaa!</b><br>Estas aqui.")
    .openPopup()
    .addTo(map);

//Crear otro mapa en el div con id "map2"
var map2 = L.map('map2').setView([40.369, -100.383], 4);


//Agregar capa de OpenStreetMap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2);


//Para capa personalizada, se puede usar la libreria leaflet-providers, comentar antes la capa de OpenStreetMap
// L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(map2);
// // Crear un icono personalizado rojo
// const redIcon = L.icon({
//     iconUrl: 'https://static.vecteezy.com/system/resources/previews/012/377/736/original/red-place-markers-sign-icon-png.png', // Icono rojo
//     iconSize: [25, 41], // Tamaño del icono (ajustado al predeterminado)
//     iconAnchor: [12, 41], // Punto de anclaje del icono
//     popupAnchor: [1, -34], // Punto de anclaje del popup
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // Sombra del marcador
//     shadowSize: [41, 41] // Tamaño de la sombra
// });

// // Agregar el marcador con el icono personalizado rojo
// const markerrojo = L.markerrojo([40.423, -3.692], { icon: redIcon })
//                 .bindPopup("<b>Holaa!</b><br>Estas aqui.")
//                 .openPopup()
//                 .addTo(map);
// Suponiendo que data.features contiene los terremotos de la API


// 2. Dibujar en un mapa las coordenadas de posiciones donde hay terremotos
function getTerremotos(mUrl) {

    //const valorURL = url;
    const url = mUrl;

    let resultado = fetch(url)
        .then(response => {
            if (!response.ok) {
                // si la respuesta no devuelve un ok
                throw new Error(`API no encontrada: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // devolvemos el objeto.results
            return data.features;
        })
        .catch(error => {
            console.error('Error al conectar:', error);
            const boxMensaje = document.getElementById('mensaje');
            let cadena = "";
            cadena += "Error al conectar con la BB.DD";
            //TODO: Crear un string en el que se llame a una imagen según el tipo de error
            // Ejemplo: 
            boxMensaje.innerHTML = cadena; // Mensaje de error en el DOM
        });
    return resultado;
}

getTerremotos('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson').then(datos => {

    console.log(datos)

    datos.forEach(feature => {
        const magnitude = feature.properties.mag; // Obtener la magnitud del terremoto
        const coords = feature.geometry.coordinates; // Obtener las coordenadas (longitud, latitud)
        const latLng = [coords[1], coords[0]]; // Leaflet usa lat, long en vez de long, lat

        // Determinar el color del marcador según la magnitud
        let markerColor;
        if (magnitude >= 5.0) {
            // Terremotos graves (marcador rojo)
            markerColor = L.icon({
                iconUrl: './assets/img/mark_rojo.png',
                iconSize: [30, 30],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        } else if (magnitude >= 3.0 && magnitude <= 4.9) {
            markerColor = L.icon({
                iconUrl: './assets/img/mark_yellow.png',
                iconSize: [30, 30],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        } else if (magnitude >= 1.9 && magnitude <= 2.9) {
            markerColor = L.icon({
                iconUrl: './assets/img/mark_verde.png',
                iconSize: [30, 30],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        } else {
            // Terremotos suaves (marcador verde)
            markerColor = L.icon({
                iconUrl: './assets/img/mark_azul.png',
                iconSize: [30, 30],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
        }
        let fecha = milisegundosToFecha(feature.properties.time);

        let cadena = "";
        cadena += `
            <strong>Título:</strong> <label>${feature.properties.title}</label><br>
            <strong>Fecha:</strong> <label>${fecha}</label><br>
            <strong>Ubicación:</strong> <label>${feature.properties.place}</label><br>
            <strong>Código:</strong> <label>${feature.properties.code}</label><br>
            <strong>Magnitud:</strong> <label>${feature.properties.mag}</label>
        `;


        // Crear el marcador y añadirlo al mapa
        L.marker(latLng, { icon: markerColor })
            .bindPopup(cadena)
            .addTo(map2);
    });

});

function milisegundosToFecha(msegundos) {
    const timestamp = msegundos;
    const date = new Date(timestamp);

    // Extraer componentes de la fecha
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');

    // Formatear la fecha como "dd/mm/yyyy hh:mm:ss"
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
}



// //Agregar circulo
// const circle = L.circle([51.508, -0.11], {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(map);

// //Agregar poligono
// const polygon = L.polygon([
//     [51.509, -0.08],
//     [51.503, -0.06],
//     [51.51, -0.047]
// ]).addTo(map);

// //Agregar popup
// const popup = L.popup()
//     .setLatLng([51.513, -0.09])
//     .setContent("I am a standalone popup.")
//     .openOn(map);

var map3 = L.map('map3').setView([40.423, -3.692], 3);


//Agregar capa de OpenStreetMap
L.tileLayer('https://tile.osm.ch/switzerland/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map3);


//Para capa personalizada, se puede usar la libreria leaflet-providers, comentar antes la capa de OpenStreetMap
L.tileLayer.provider('OpenStreetMap.CH').addTo(map3);



let btn_mostrar = document.getElementById("btn_mostrar");
btn_mostrar.addEventListener("click", function (event) {
    event.preventDefault();

    let fInicio = document.getElementById("fInicio");
    let fFin = document.getElementById("fFin");
    let magnitud = document.getElementById("magnitud")

    console.log("fInicio=", fInicio.value)
    console.log("fFin=", fFin.value)

    let url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${fInicio.value}&endtime=${fFin.value}&minmagnitude=${magnitud.value}`
    console.log("url=", url)

    getTerremotos(url).then(datos => {

        console.log(datos);

        datos.forEach(item => {
            const magnitud = item.properties.mag; // Obtener la magnitud del terremoto
            const coords = item.geometry.coordinates; // Obtener las coordenadas (longitud, latitud)
            const latLng = [coords[1], coords[0]]; // Leaflet usa lat, long en vez de long, lat

            let fechaInicio = milisegundosToFecha(item.properties.time);
            let fechaFin = milisegundosToFecha(item.properties.updated);



            // Determinar el color del marcador según la magnitud
            let markerColor;
            if (magnitud >= 5.0) {
                // Terremotos graves (marcador rojo)
                markerColor = L.icon({
                    iconUrl: './assets/img/mark_rojo.png',
                    iconSize: [30, 30],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34]
                });
            } else if (magnitud >= 3.0 && magnitud <= 4.9) {
                markerColor = L.icon({
                    iconUrl: './assets/img/mark_yellow.png',
                    iconSize: [30, 30],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34]
                });
            } else if (magnitud >= 1.9 && magnitud <= 2.9) {
                markerColor = L.icon({
                    iconUrl: './assets/img/mark_verde.png',
                    iconSize: [30, 30],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34]
                });
            } else {
                // Terremotos suaves (marcador verde)
                markerColor = L.icon({
                    iconUrl: './assets/img/mark_azul.png',
                    iconSize: [30, 30],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34]
                });
            }


            //console.log("magnitud=" + magnitud + ", fechaInicio=" + fechaInicio + ", fechaFin=" + fechaFin)
            let cadena = "";
            cadena += `
                    <strong>Fecha Inicio:</strong> <label>${fechaInicio}</label><br>
                    <strong>fecha Fin:</strong> <label>${fechaFin}</label><br>
                    <strong>Magnitud:</strong> <label>${magnitud}</label>
                `;

                    // Crear el marcador y añadirlo al mapa
        L.marker(latLng, { icon: markerColor })
        .bindPopup(cadena)
        .addTo(map3);

        });
    
    });
})




