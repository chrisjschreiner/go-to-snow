mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // stylesheet location
    center: resort.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.scrollZoom.disable();

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(resort.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${resort.title}</h3><p>${resort.location}</p>`
            )
    )
    .addTo(map)