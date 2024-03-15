// 1. Foursquare API 
const BASE_API_URL = "https://api.foursquare.com/v3";
const API_KEY = "fsq3wvnLGd2aP9AqDQAVE8JuRvhzlab05d3vi2sdPjueMNE="

// 1a. Function to search for locations using FourSquare API
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

// 1b. Function to fetch photos from FourSquare
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


// 2. Form JSON bin
const BASE_JSON_BIN_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "65ca629bdc74654018a3d305";
const MASTER_KEY = "$2a$10$bGGtgHiNbK3z4vgOgJ28J.fxGlg8OD9LqM/yfLGJp7zF6XnFV0hoa";

let todos = [];

function addTodo(todos, name, status, album){
    let newTodo = {
        id: Math.floor(Math.random() * 100 + 1),
        name: name,
        status: status,
        album: album
    };
    todos.push(newTodo);
}

function modifyTask(todos, id, newName, newStatus, newAlbum) {
    // creating the new task
    let modifiedTask = {
        "id": id,
        "name": newName,
        "status": newStatus,
        "album": newAlbum
    }

    // insert index of the task that user wants to replace
    const indexToReplace = todos.findIndex(function(t){
        return t.id == id;
    });

    // if loop to check if the findIndex can find the index, if not findIndex to return -1
    if (indexToReplace > -1) {
        todos[indexToReplace] = modifiedTask;
    }
}

function deleteTask(todos, id) {
    let indexToDelete = null;
    for (let i = 0; i < todos.length; i++){
        if (todos[i].id == id){
            indexToDelete = i;
            break;
        }
    }
    if (indexToDelete !== null) {
        todos.splice(indexToDelete, 1);
    } else {
        console.log("Unable to find song");
    }
}

async function loadTasks() {
    const response = await axios.get(BASE_JSON_BIN_URL + "/" + BIN_ID + "/latest");
    console.log(response.data);
    return response.data.record;
}


async function saveTasks(todos) {
    const response = await axios.put(`${BASE_JSON_BIN_URL}/${BIN_ID}`, todos, {
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": MASTER_KEY
        }
    });
    return response.data;
}