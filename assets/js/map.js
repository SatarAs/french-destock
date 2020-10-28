
const $ = require('jquery');

$(document).ready(function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoicmVkb3hnZW51czY5IiwiYSI6ImNrMGh6dmh6djA3OW8zaXA1dDA3eGYxa24ifQ.aoKS5PsFip6HxcYeK4ktOA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 12,
        center: [1.182004, 49.4680]
    }).setStyle('mapbox://styles/mapbox/' + 'light-v10');

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    var response = JSON.parse(JSON.parse(httpGet("https://roster-evo.fr:8000/AjaxUserGeo")));

    map.on('load', function () {
        map.addSource("map", {
            type: "geojson",
            data: response
        });
        // var coordinates = response.features[0].geometry.coordinates;
        response.features.forEach(function (feature) {
            console.log(response);
            var el = document.createElement('div');
            el.id = 'marker';
            var marker = new mapboxgl.Marker()
                .setLngLat(feature.geometry.coordinates)
                .addTo(map);
        });

    });

    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    );

    map.on('mousemove', function (e) {
        document.getElementById('info').innerHTML =
            JSON.stringify(e.point) +
            '<br />' +
            JSON.stringify(e.lngLat.wrap());
    });

    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            marker: {
                color: 'orange'
            },
            mapboxgl: mapboxgl
        })
    );
});