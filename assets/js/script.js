document.addEventListener("DOMContentLoaded", async function () {
    const map = createMap('map', 1.3521, 103.8198);

     // Make a GET request to fetch GeoJSON data
     const venueResponse = await axios.get("data/venue.geojson");
     const venueLayer = L.layergroup();
     venueLayer.addTo(map);
     for (let venue of venueResponse.data) {
         L.marker(venue.coordinates).bindPopup(`<h5>${venue.features[0].properties.Stadium}</h5>`).addTo(venueLayer);
     }

    document.querySelector("#searchBtn").addEventListener("click", async function () {
        const searchTerms = document.querySelector("#searchTerms").value;
        const data = await search(1.3521, 103.8198, searchTerms);


        // edit marker icon
        var customIcon = L.icon({
            iconUrl: 'assets/img/concert_location.png',
            iconSize: [70, 70],
            iconAnchor: [20, 40], // Adjust based on your icon's size
            popupAnchor: [0, -40] // Adjust to position popup relative to the icon
        });

        /*identify each location from data.results each search*/
        for (let location of data.results) {
            /*create marker for each location*/
            const lat = location.geocodes.main.latitude;
            const lng = location.geocodes.main.longitude;
            const address = location.location.formatted_address;
            const marker = L.marker([lat, lng], { icon: customIcon });
            marker.bindPopup(`<h5>${address}</h5>`);

            // add marker to the map
            marker.addTo(map);
        }
    })
});