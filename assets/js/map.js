/* create map */
function createMap(mapContainerID, lat, lng) {
    const map = L.map(mapContainerID);
    map.setView([lat, lng], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' })
        .addTo(map);
    return map;
}

/* add markers to map */
function addMarkersToMap(searchResults, layer, map) {
    // remove existing markers
    layer.clearLayers();

    const searchResultOutput = document.querySelector("#search-results");
    searchResultOutput.innerHTML = "";
}

