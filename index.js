// Defined the class house. The constructor sets up the initial state of a house object. It assigns a name to the house
//and prepares an emtpy array to store information. 

class house{
    constructor(name){
        this.name=name;
        this.rooms=[];
    }

    //THe addRoom methos allows to add roooms to a specific House object. It takes the name and area of the room as 
    //parameteres, creates a new room and adds it to the rooms array. 
    addRoom(name, area){
        this.rooms.push(new Room(name, area));
    }
}

// Inside the class Room constructor two properties are initialized: 
//this.name, which stores the name of the room and this.area which stores the area of the room. 
class Room{
    constructor(name, area){
        this.name=name;
        this.area=area;
    }
}
//class HouseService is responsible for interacting with an external API to perform CRUD operations. (Create, Read, 
//Update, Delete).

class HouseService{
    static url = 'https://ancient-taiga-31359.herokuapp.com/api/houses';
  
    //getAllHouses() sends a GET request to the API URL to retrieve a list of all houses. 
    static getAllHouses(){
        return $.get(this.url);
      }
    //getHouse(id) sends a GET request to the API URL with specific id to retrieve details about a single house. 
      static getHouse(id){
        return $.get(this.url + `/${id}`);
      }

      //createHouse(house) sends a POST request to the API to create a new house by sending a house object as the 
      //request body.

      static createHouse(house){
        return $.post(this.url, house);
      }
    //updateHouse(house) sends a PUT request to the API with a specific house id to update an exiting house.
      static updateHouse(house){
        return $.ajax({
            url: this.url + `/${house._id}`,
            dataType: 'json',
            data: JSON.stringify(house),
            contentType: 'application/json',
            type: 'PUT',
        });
      }

      //deleteHouse sends a DELETE request to the API with a specific id to delete a house. 

      static deleteHouse(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE',
        });

      }
}

//class DOMManager is responsible for managing the user interface(UI) of the web application. It handles rendering
// and updating the UI elements to display information about houses and their rooms, as well as responding to user
//interactions.


class DOMManager{
    static houses; 

//getAllHouses method calls House.Service.getAllHouses() method to fetch a list of all houses from the API. Then it calls
// the render(houses) method to display the houses and their rooms on the UI.
    static getAllHouses(){
    HouseService.getAllHouses().then(houses => this.render(houses));
    }
    //createHouse(name) method creates a new house, calls the House.Service.createHouse() method to create the new house.
    //After creating the house, it fetches the updated list of houses and calls the render(houses) method to update the
    //UI with the latest list of houses. 
    static createHouse(name){
        HouseService.createHouse(new house(name))
        .then(() => {
            return HouseService.getAllHouses();
        })
        .then((houses) => this.render(houses));
    }
     

   //deletehouse(id) method deletes a house with the given ID via the API. After deleting the house. it fetches the 
   //updated list of houses  and calls the render(houses) method to update the UI.
   
    static deleteHouse(id){
        HouseService.deleteHouse(id).then(() =>{
            return HouseService.getAllHouses();

        })
        .then((houses) => this.render(houses));
    }

    //addRoom(id) method adds a new room to a house with the given ID. Retrieves the input values for the room's name
    // and area from the corresponding input fields. Calls the HouseService.updateHouse(house) method to update
    // the house with the new room information. Fetches the updated list of houses and after the update calls the render
    //(houses) method to update the UI.

    static addRoom(id){
        for (let house of this.houses){
            if(house._id==id){
                house.rooms.push(new Room($(`#${house._id}-room-name`).val(), $(`#${house._id}-room-area`).val()));
                HouseService.updateHouse(house)
                    .then(() => {
                    return HouseService.getAllHouses();
                    })
                    .then((houses) => this.render(houses));
            }
        }
    }
    //deleteRoom(houseId, roomId) method deletes a room with a given room ID from the house with the given ID using 
    // splice method. Calls the HouseService.updatehouse(house) method to update the house. Fetches the updated
    //list of houses. Calls the render method to update the UI. 

    static deleteRoom(houseId, roomId){
        for(let house of this.houses){
            if(house._id==houseId){
                for(let room of house.rooms){
                if(room._id==roomId){
                    house.rooms.splice(house.rooms.indexOf(room),1);
                    HouseService.updateHouse(house)
                    .then(() =>{
                        return HouseService.getAllHouses();
                    })
                    .then((houses) => this.render(houses));
                }
              }
            }
        }
    }

    //render method renders the UI based on the provided list of houses. Empties the content of the app element. For
    //each  house and each room, it generates HTML elements to display house information, input fields for adding rooms,
    //and buttons for deleting houses. 


    static render(houses){
        this.houses = houses; 
        $('#app').empty();
        for (let house of houses){
            $('#app').prepend(
                `<div id="${house._id}" class="card">
                <div class="card-header">
                <h2>${house.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
                </div>

                <div class ="card-body">
                <div class="card">
                <div class="row">
                <div class="col-sm">
                <input type = "text" id="${house._id}-room-name" class="form-control" placeholder="Room Name">
                </div>
                <div class="col-sm">
                <input type = "text" id="${house._id}-room-area" class="form-control" placeholder="Room Area">
                </div>
                </div>
                <button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" 
                class="btn btn-primary form-control">Add</button>
                </div>
                </div>
                </div><br>`



            );
            for(let room of house.rooms){
                $(`#${house._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${room._id}"><strong>Name: </strong>${room.name}</span>
                    <span id="area-${room._id}"><strong>Area: </strong>${room.area}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteRoom('${house._id}',
                     '${room._id}')">Delete Room</button>`

                );
            }
        }
    }
    
}

//Event Handling sets up an event handler for the Create New House button to call the createHouse method when clicked.

$('#create-new-house').click(() => {
    DOMManager.createHouse($('#new-house-name').val());
    $('#new-house-name').val('');
});

DOMManager.getAllHouses();

