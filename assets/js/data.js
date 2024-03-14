// Foursquare API
const BASE_API_URL = "https://api.foursquare.com/v3";
const API_KEY = "fsq3wvnLGd2aP9AqDQAVE8JuRvhzlab05d3vi2sdPjueMNE="

// Function to search for locations using FourSquare API
async function search(lat, lng, searchTerms) {
    try {
        const response = await axios.get(`${BASE_API_URL}/places/search`, {
            params: {
                query: encodeURI(searchTerms),
                ll: lat + "," + lng,
                sort: "DISTANCE",
                radius: 5000,
                limit: 50
            },
            headers: {
                Accept: "application/json",
                Authorization: API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error searching for locations:", error);
        return [];
    }
}

// Function to fetch photos from FourSquare
async function getPhotoFromFourSquare(fsqId) {
    try {
        const response = await axios.get(`${BASE_API_URL}/places/${fsqId}/photos`, {
            headers: {
                Accept: "application/json",
                Authorization: API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching photos:", error);
        return [];
    }
}