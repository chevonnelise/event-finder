document.addEventListener("DOMContentLoaded", async function () {

    // Call the createMap function
    const map = createMap('map', 1.3521, 103.8198);

    // Add searchLayer
    const searchLayer = L.layerGroup();
    searchLayer.addTo(map);

    // searchBtn
    document.querySelector("#searchBtn").addEventListener("click", function () {
        const searchTerms = document.querySelector("#searchTerms").value;
        // find the lat lng of the center of the map
        const centerPoint = map.getBounds().getCenter();
        const data = search(centerPoint.lat, centerPoint.lng, searchTerms);
        // adding markers to the map for the search results
        addMarkersToMap(data, searchLayer, map);
    });

    document.querySelector("#searchBtn").addEventListener("click", function () {
        const searchTerms = document.querySelector("#searchTerms").value;
        // find the lat lng of the center of the map
        const centerPoint = map.getBounds().getCenter();
        const data = search(centerPoint.lat, centerPoint.lng, searchTerms);
        // adding markers to the map for the search results
        addMarkersToMap(data, searchLayer, map);
    });


    // toggle searchBtn
    document.querySelector("#toggleSearchBtn").addEventListener("click", function () {
        const searchContainer = document.querySelector("#search-container");
        const style = window.getComputedStyle(searchContainer);
        // if the search container is already visible, we'll hide it
        if (style.display != "none") {
            searchContainer.style.display = "none";
        } else {
            // otherwise, show it
            searchContainer.style.display = 'block';
        }
    })

    // Create marker cluster group
    const venueClusterLayer = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
            const childCount = cluster.getChildCount();

            return L.divIcon({
                html: `<div class="venue-cluster-icon"><img src="assets/img/map-markers/microphone.png">${childCount}</div>`,
                className: 'venue-cluster',
                iconSize: L.point(100, 100)
            });
        }
    });

    // Add markers to venueClusterLayer
    const venueResponse = await axios.get('assets/data/venue.geojson');
    for (let venue of venueResponse.data.features) {
        let reversedCoordinates = [venue.geometry.coordinates[1], venue.geometry.coordinates[0]]; // Reverse coordinates

        const venueIcon = L.icon({
            iconUrl: 'assets/img/map-markers/microphone-zoom.png', // Path to your custom marker image
            iconSize: [40, 40], // Size of the icon
            iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
            popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
        });

        // Create marker with venue icon
        const venueMarker = L.marker(reversedCoordinates, { icon: venueIcon }).bindPopup(`<h3>${venue.properties.Stadium}</h3><h5>${venue.properties.Country} (${venue.properties["City/State"]})</h5>`);

        // Add marker to cluster layer
        venueClusterLayer.addLayer(venueMarker);

        // Add click event listener
        venueMarker.on('click', function (event) {
            venueMarker.openPopup();
        });
        // Add click event listener
        venueMarker.on('click', function (event) {
            venueMarker.closePopup();
        });
    }
    venueClusterLayer.addTo(map);

    // 2. Weather 
    // Function to fetch weather data for a specific location (Open Meteo API)
    async function fetchWeatherData(latitude, longitude) {
        try {
            const response = await axios.get('https://api.open-meteo.com/v1/gfs', {
                params: {
                    latitude: latitude,
                    longitude: longitude,
                    hourly: 'temperature_2m',
                    timezone: 'auto'
                }
            });
            return response.data;
            
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }

    // Leaflet Routing Machine
    // Define control variable for Leaflet Routing Machine
    let userIcon = new L.Icon({
        iconUrl: 'assets/img/user.png',
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const control = L.Routing.control({
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim({
            language: 'en' // Set language to English
        }),
        createMarker: function (i, wp, nWps) {
            if (i === 0 || i === nWps - 1) {
                return L.marker(wp.latLng, {
                    icon: userIcon
                });
            } else {
                return L.marker(wp.latLng, {
                    icon: myViaIcon
                });
            }
        }
    });
    control.addTo(map);

    // navContainer - Get references to HTML elements 
    const navContainer = document.getElementById('navContainer');
    const startBtn = document.getElementById('startBtn');
    const destBtn = document.getElementById('destBtn');
    const weatherContainer = document.getElementById('weatherContainer');

    // navContainer
    map.on('click', function (e) {
        // Create popups
        const navPopup = L.popup().setLatLng(e.latlng).setContent(navContainer);
        const weatherPopup = L.popup({
            offset:[0,180]
        }).setLatLng(e.latlng).setContent(weatherContainer);
    
        // Clear existing contents of popups
        navContainer.innerHTML = '';
        weatherContainer.innerHTML = '';
    
        // Append start and destination buttons to the navContainer
        navContainer.appendChild(startBtn);
        navContainer.appendChild(destBtn);
    
        // Append weather container to the weatherContainer
        fetchWeatherData(e.latlng.lat, e.latlng.lng)
            .then(weatherData => {
                weatherContainer.innerHTML = `
                    <h4>Weather Information</h4>
                    <h5>Temperature: ${weatherData.hourly.temperature_2m[0]}°C</h5>
                `;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    
        // Open popups on the map
        navPopup.addTo(map);
        weatherPopup.addTo(map);
    
        // Event listeners for start and destination buttons
        L.DomEvent.on(startBtn, 'click', function () {
            control.spliceWaypoints(0, 1, e.latlng);
            map.closePopup();
        });
    
        L.DomEvent.on(destBtn, 'click', function () {
            control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
            map.closePopup();
        });
    });
    
    


    // Create base and overlay layers
    const baseLayers = {
        "Venue": venueClusterLayer,
        "View Search Only": searchLayer
    };

    // const overlayLayers = {
    //     "Weather": weatherLayer
    // };

    // Add control layers to the map
    // L.control.layers(baseLayers, overlayLayers).addTo(map);
    L.control.layers(baseLayers).addTo(map);
});
