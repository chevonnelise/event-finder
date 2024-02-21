document.addEventListener("DOMContentLoaded", function(){
    const map = createMap('map',40.730610, -73.935242);

    document.querySelector("#searchBtn").addEventListener("click", async function(){
        const searchTerms = document.querySelector("#searchTerms").value;
        const data = await search(40.730610, -73.935242, searchTerms);
        console.log(data);

    /*identify each location from data.results each search*/
    for (let location of data.results) {
        /*create marker for each location*/
        const lat = location.geocodes.main.latitude;
        const lng = location.geocodes.main.longitude
        const marker = L.marker([lat, lng])

    }

    })
});