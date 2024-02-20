async function search(lat, lng, searchTerms) {
    const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        params: {
            query: encodeURI(searchTerms),
            ll: lat + "," + lng,
            sort: "DISTANCE",
            radius: 5000,
            limit: 50
        },
    headers: {
            accept: "application/json", 
        Authorization: 'fsq3wvnLGd2aP9AqDQAVE8JuRvhzlab05d3vi2sdPjueMNE='
        }
    })
    return response.data;
}