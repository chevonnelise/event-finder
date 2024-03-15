// 1. createMap function
function createMap(mapContainerID, lat, lng) {
    const map = L.map(mapContainerID).setView([lat, lng], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    return map;
}
   

// 2. Add markers to searchLayer
function addMarkersToMap(searchResults, layer, map) {
    // Remove all existing markers from the provided layer
    layer.clearLayers();

    const searchResultOutput = document.querySelector("#search-results");
    searchResultOutput.innerHTML = "";

    const markerIcon = L.icon({
        iconUrl: 'assets/img/map-markers/magnifying-glass.png', // Path to your new marker icon image
        iconSize: [30, 30], // Size of the icon
        iconAnchor: [20, 40], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
    });

    // Loop through each location in the search results
    for (let location of searchResults.results) {
        // Create a marker for each location
        const lat = location.geocodes.main.latitude;
        const lng = location.geocodes.main.longitude;
        const address = location.location.formatted_address;
        const name = location.name;
        const marker = L.marker([lat, lng], { icon: markerIcon });

        marker.bindPopup(function () {
            const divElement = document.createElement('div');
            divElement.innerHTML = `
            <h5>${location.name}</h5>
            <img src="#"/>
            <p>${location.location.formatted_address}</p>
        `;
            // <button class="btn btn-primary clickButton">Click</button> //

            async function getPicture() {
                const photos = await getPhotoFromFourSquare(location.fsq_id);
                const firstPhoto = photos[0];
                const photoUrl = firstPhoto.prefix + '150x150' + firstPhoto.suffix;
                divElement.querySelector("img").src = photoUrl;
            }

            getPicture();

            // divElement.querySelector(".clickButton").addEventListener("click", function () {
            //             alert("Search stadium!");
            // });

            return divElement;
        });

        // Add the marker to the map
        marker.addTo(layer);

        // Create and display the search result
        const divElement = document.createElement('div');
        divElement.innerHTML = location.name;

        // Event listener for clicking a search result
        divElement.addEventListener("click", function () {
            map.flyTo([lat, lng], 16); // Fly to the location
            marker.openPopup(); // Open marker popup
        });

        searchResultOutput.appendChild(divElement);

        // Add click event listener
        marker.on('click', function (event) {
            marker.openPopup(); 
        });
        // Add click event listener
        marker.on('click', function (event) {
            marker.closePopup(); 
        });
    }
}

