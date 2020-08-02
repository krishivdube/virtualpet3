var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var garden , bedRoom , livingRoom;
var washRoom , lazy , dogVac , dogVacc;
var sadDog;
var Hungry , Playing , Sleeping , Bathing;

function preload(){

sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
garden=loadImage("Garden.png");
bedRoom=loadImage("Bed Room.png");
livingRoom=loadImage("Living Room.png");
washRoom=loadImage("Wash Room.png");
dogVacc=loadImage("dogVaccination.png");
sadDog=loadImage("deadDog.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  dogVac=createButton("Check Vaccination Chart")
  dogVac.position(300,95);
  dogVac.mousePressed()
  

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
//if(dogVac.mousePressed()){
 //   dog.visibility = false
  //  feed.visibility =false  
   // addFood.visibility = false
  
  //}

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  if (gameState != "Hungry"){
    feed.hide()
    addFood.hide()
    dog.remove()
  }
  else{
    feed.show()
    addFood.show()
    dog.addImage(sadDog);
}  
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
   currentTime=hour();
   if (currentTime ==(lastFed+1)){
     update("Playing")
     foodObj.garden();
   }
   else if(currentTime ==(lastFed+2)){
  update("Sleeping")
  foodObj.bedRoom();
   }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing")
    foodObj.washRoom();
  }
  else{
    update("Hungry")
    foodObj.display();
    }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}