var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var PLAY=1;
var END=0;
var gameState=PLAY;
var gameOver,restart;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstacle

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  trex_standing = loadImage("trex1.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  if(frameCount % 60 === 0) {
  obstacle = createSprite(650,165,10,40);
  }
  obstacle.visible = false;
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  
  ground = createSprite(200,150,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.y = 180 ;
  
  
  gameOver = createSprite(camera.x,100)
  gameOver.addImage("gameOver",gameOverImage)
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(camera.x,180)
  restart.addImage("restart",restartImage)
  restart.scale = 0.5;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  camera.position.y = 100
  fill("red")
  textSize(21)
  text("Score: "+ score, 200,50);
  camera.position.x = trex.x;
  if (gameState === PLAY){
    trex.x = 50;

    spawnClouds();
    spawnObstacles();

  if(keyDown("RIGHT_ARROW")){
    score = score + Math.round(getFrameRate()/60);
  }
  if(keyDown("RIGHT_ARROW")) {
  ground.velocityX = -(6+3*score/100);
  camera.position.x = trex.x;
  trex.x = 50;
  trex.changeAnimation("running",trex_running);
  }

  if(keyWentUp("RIGHT_ARROW")) {
    ground.velocityX = 0
    camera.position.x = trex.x;
    trex.addImage("standing",trex_standing)
    obstacle.velocityX = 0
    }
  
  if(keyDown("space")&&trex.y>150) {
    trex.velocityY = -12;
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/3;
  }
  
  if (obstaclesGroup.isTouching(trex)){
  gameState = END;
  }
  }
  trex.collide(invisibleGround);
  if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(650,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    if(keyDown("RIGHT_ARROW")){
      cloud.velocityX = obstacle.velocityX;
    }
    if(keyWentUp("RIGHT_ARROW")){
      cloud.velocityX = obstacle.velocityX;
    }
    
    
     //assign lifetime to the variable
    cloud.lifetime = 250;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
 
    if(obstacle.x<camera.x-300){
    obstacle.x = 670;
    }
 
     obstacle.visible = true;
    
    if(keyDown("RIGHT_ARROW")){
      obstacle.velocityX = -(6+3*score/100);
    }
    if(keyWentUp("RIGHT_ARROW")){
      obstacle.velocityX = 0
    }

    
    
    //generate random obstacles
    if(frameCount%1===0&&obstacle.x>600){
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
  }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }


function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstacle.x = 670;
  cloudsGroup.destroyEach();
  
  
  
  score = 0;
  
}