
function setupMap() {
    // setup the map
    const map = L.map('map').setView([1.3521, 103.8198], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

    // Define searchLayer as a layer group
    const searchLayer = L.layerGroup();
    searchLayer.addTo(map);

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
    venueClusterLayer.addTo(map);

    return { map, searchLayer, venueClusterLayer };
}
