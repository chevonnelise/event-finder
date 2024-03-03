document.addEventListener("DOMContentLoaded", async function () {

    // setup the map
    const map = L.map('map').setView([45.9432, 24.9668], 1);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

    // Create marker cluster group
    const venueClusterLayer = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            const childCount = cluster.getChildCount();

            return L.divIcon({
                html: `<div class="venue-cluster-icon"><img src="assets/img/microphone.png">${childCount}</div>`,
                className: 'venue-cluster',
                iconSize: L.point(100, 100)
            });
        }
    });
    venueClusterLayer.addTo(map);

    const venueResponse = await axios.get('assets/data/venue.geojson');
    for (let venue of venueResponse.data.features) {
        let reversedCoordinates = [venue.geometry.coordinates[1], venue.geometry.coordinates[0]]; // Reverse coordinates

        const venueIcon = L.icon({
            iconUrl: 'assets/img/microphone_zoom.png', // Path to your custom marker image
            iconSize: [40, 40], // Size of the icon
            iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
            popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
        });

        // Create marker with venue icon
        const venueMarker = L.marker(reversedCoordinates, { icon: venueIcon }).bindPopup(`<h3>${venue.properties.Stadium}</h3><h5>${venue.properties.Country} (${venue.properties["City/State"]})</h5>`);

        // Add marker to cluster layer
        venueClusterLayer.addLayer(venueMarker);
        

        // Add mouseover event listener
        venueMarker.on('mouseover', function (event) {
            venueMarker.openPopup(); // Open popup on mouseover
        });
        // Add mouseout event listener
        venueMarker.on('mouseout', function (event) {
            venueMarker.closePopup(); // Close popup on mouseout
        });

    }

    const baseLayer2 = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors'
    });

    const overlayLayer = L.tileLayer('https://example.com/{z}/{x}/{y}.png', {
        attribution: 'Your attribution here'
    }).addTo(map);

    const baseLayers = {
        "Venue": venueClusterLayer,
        "Base Layer 2": baseLayer2
    };

    const overlayLayers = {
        "Overlay Layer": overlayLayer
    };

    L.control.layers(baseLayers, overlayLayers).addTo(map);
});

