document.addEventListener("DOMContentLoaded", async function () {
   
    // setup the map
    const map = L.map('map').setView([45.9432, 24.9668], 2);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

       
        const venueResponse = await axios.get('assets/data/venue.geojson');
        const venueLayer = L.layerGroup();
        venueLayer.addTo(map);
        for (let venue of venueResponse.data.features) {
            let reversedCoordinates = [venue.geometry.coordinates[1], venue.geometry.coordinates[0]]; // Reverse coordinates
            
            const venueIcon = L.icon({
            iconUrl: 'assets/img/concert_location.png', // Path to your custom marker image
            iconSize: [32, 32], // Size of the icon
            iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
            popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
            });

            // Create marker with venue icon
            L.marker(reversedCoordinates, {icon: venueIcon}).bindPopup(`<h3>${venue.properties.Stadium}</h3><h5>${venue.properties.Country} (${venue.properties["City/State"]})</h5>`).addTo(venueLayer);
        }

        // var baseLayer1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     attribution: '&copy; OpenStreetMap contributors'
        // }).addTo(map);

        var baseLayer2 = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenTopoMap contributors'
        });

        var overlayLayer = L.tileLayer('https://example.com/{z}/{x}/{y}.png', {
            attribution: 'Your attribution here'
        }).addTo(map);

        const baseLayers = {
            "Base Layer 1": venueLayer,
            "Base Layer 2": baseLayer2
        };

        const overlayLayers = {
            "Overlay Layer": overlayLayer
        };

        L.control.layers(baseLayers, overlayLayers).addTo(map);
    });
    
