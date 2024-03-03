document.addEventListener("DOMContentLoaded", async function () {
   
    // setup the map
    const map = L.map("map");
    map.setView([1.3521, 103.8198], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

    const hdbLayerPromise = createLayer("assets/data/hdb.json", map);
    const mallLayerPromise =  createLayer("assets/data/mall.json", map);
    const naturePromise =  createLayer("assets/data/nature.json", map);

    // when you await a promise, JavaScipt will pause
    // at that line and return the value from the promise (function that takes a long time execute)
    const hdbLayer = await hdbLayerPromise;
    const mallLayer = await mallLayerPromise;
    const natureLayer = await naturePromise;

    L.control.layers({
        'HDB': hdbLayer,
        'Malls': mallLayer,
        "Nature": natureLayer
    }, {}).addTo(map);

});

async function createLayer(jsonFileName, map) {
    // the await pauses the function BUT only that function
    const response = await axios.get(jsonFileName);
    const layer = L.layerGroup();
    layer.addTo(map);
    for (let location of response.data) {
        // this technique is known as function chaining
        // this works because .bindPopup also returs the marker
        L.marker(location.coordinates).bindPopup(`<h1>${location.name}</h1>`).addTo(layer);
    }
    return layer;
}
