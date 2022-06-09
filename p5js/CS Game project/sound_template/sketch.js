/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var game_score;
var lives;

var flagpole; 




var trees_x;
var treePos_y;
var clouds;
var mountains;
var canyons;
var collectables;
var platforms;


var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isReached;
var isContact;


var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    
    jumpSound = loadSound('assets/jump.wav');0
    jumpSound.setVolume(0.1);
}


function setup()
{
    lives = 3;
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    startGame();
    

}

function draw()
{	

    console.log(lives);
    
    
    background(100, 155, 255); // fill the sky blue

    noStroke();
    fill(0,155,0);
    rect(0, floorPos_y, width, height/4); // draw some green ground

    push();   
    translate(scrollPos, 0);

    // Draw clouds.

    drawClouds();

    // Draw mountains.

    drawMountains();

    // Draw trees.

    drawTrees();

    // Draw canyons.

    for(var i = 0; i < canyons.length; i++)
    {    
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);  
    }


    // Draw collectable items.

    for(var i = 0; i < collectables.length; i++)
    {
        if(collectables[i].isFound == false)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);    
        }        
    }

    for(var i = 0; i < platforms.length;i++){
            platforms[i].draw();
        }
    
   
    renderFlagpole();


    pop();



    //Game Score Count. Incremented in function checkCollectable  

   
    fill(255);
    textSize(20);
    text("Game Score" +" "+ game_score, width - 1000, 47);


    //Lives. Decremented in function checkPlayerDie  

    stroke(255);
    strokeWeight(3);

    for(var i = 0; i < lives; i++) 
    { 
        line(width - 150 + i * 10 ,30,width - 150 + i * 10  , 47);
    }

    strokeWeight(0.1);
    textSize(20);


    if((lives > 1) || (lives == 0))
    {
        text("Lives Left!" +" ", width - 120, 47);
    }

    else 
    {
        text("Life Left!" +" ", width - 120, 47);        
    }



    // Draw game character.

    drawGameChar();
    checkPlayerDie();  

    if(lives < 1)
    {
        push();
        textSize(30);
        fill(0);
        noStroke();
        text("GAME OVER! Press space to continue",200, floorPos_y - 200);
        pop();

    }


    if(flagpole.isReached)
    {
        push();
        textSize(30);
        fill(0);
        noStroke();
        text("LEVEL COMPLETE! Press space to continue",200, floorPos_y - 200);

    }

    if(keyCode == 32 && flagpole.isReached == true && isFalling == false)
    {
        lives =3;
        startGame();    
    }

    // Logic to make the game character move or the background scroll.
    

    
    
    
    
    if(isLeft)
    {
        if(gameChar_x > width * 0.2)
        {
            gameChar_x -= 5;
        }
        else
        {
            scrollPos += 5;
        }
    }

    if(isRight)
    {
        if(gameChar_x < width * 0.8)
        {
            gameChar_x  += 5;
        }
        else
        {
            scrollPos -= 5; // negative for moving against the background
        }
    }


    // Logic to make the game character rise and fall.


    if(gameChar_y < floorPos_y)
    {   
//        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                isFalling = false;
                break;
            }
            isContact = false;
        }
        
        if(isContact == false)
        {
            gameChar_y += 2; 
            isFalling = true;
        }

    }
    else
    {   
        (isFalling = false)
    }   

    if(isPlummeting)
    {
        gameChar_y += 5  
        
    }


    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;


    //Check for cross finish 

    if(flagpole.isReached == false)
    {
        checkFlagpole() ;
    }
}


function keyPressed()

{

    // if statements to control the animation of the character when
    // keys are pressed.

    //Walk Left     
    if(keyCode == 37)
    {
        isLeft = true;  
    }

    //Walk Right   
    if(keyCode == 39)
    {
        isRight = true;   
    }

    
    //Jump    
    if(keyCode == 32 && flagpole.isReached == false && lives > 0)
            {
            if(gameChar_y == floorPos_y || isContact == true)
                {
                    isFalling = true; 
                    jumpSound.play();
                    gameChar_y += -150;
                }
            }
    

}

function keyReleased()
{

    // if statements to control the animation of the character when
    // keys are released.

    if(keyCode == 37 )
    {
        isLeft = false;  
    }

    if(keyCode == 39)
    {
        isRight = false;   
    }

    if(keyCode == 32)
    {
        isFalling = false;  
    }

}



// Function to draw the game character.

function drawGameChar()
{
    //the game character
    if(isLeft && isFalling)
    {
        //head
        fill(194,99,78);
        ellipse(gameChar_x,
        gameChar_y - 64, 
        15,
        20);

        //body
        fill(0,0,255);
        rect(gameChar_x - 7, 
         gameChar_y - 55,
         15,
         30);

        //Right Arm
        stroke(255,255,255);
        rect(gameChar_x -5, 
         gameChar_y - 55,
         10,
         15);

        //Left Hand
        fill(194,99,78);
        rect(gameChar_x - 10, 
         gameChar_y - 45,
         8,
         8);

        //Left Leg
        fill(0,0,0);
        rect(gameChar_x - 1, 
         gameChar_y - 35,
         22,
         10);

        //Right Leg
        fill(0,0,0);
        rect(gameChar_x - 21, 
         gameChar_y - 35,
         22,
         10);

        //Left Foot 
        fill(0,10,0,100);
        rect(gameChar_x - 24, 
         gameChar_y - 25,
         + 8,
         -15);

        //Right Foot 
        fill(0,10,0,100);
        rect(gameChar_x + 24, 
         gameChar_y - 35,
         -8,
         15);  

    }
    else if(isRight && isFalling)
    {

        //head
        fill(194,99,78);
        ellipse(gameChar_x,
            gameChar_y - 64, 
            15,
            20);

        //body
        fill(0,0,255);
        rect(gameChar_x - 7, 
         gameChar_y - 55,
         15,
         30);

        //Right Arm
        stroke(255,255,255);
        rect(gameChar_x -5, 
         gameChar_y - 55,
         10,
         15);

        //Right Hand
        fill(194,99,78);
        rect(gameChar_x + 3, 
         gameChar_y - 45,
         8,
         8);

        //Right Leg
        fill(0,0,0);
        rect(gameChar_x - 1, 
         gameChar_y - 35,
         22,
         10);

        //Left Leg
        fill(0,0,0);
        rect(gameChar_x - 21, 
         gameChar_y - 35,
         22,
         10);


        //Right Foot 
        fill(0,10,0,100);
        rect(gameChar_x + 16, 
         gameChar_y - 25,
         + 8,
         -15);

        //Left Foot 
        fill(0,10,0,100);
        rect(gameChar_x - 16, 
         gameChar_y - 35,
         -8,
         15);

    }

    else if(isLeft)
    {
        //head
        fill(194,99,78);
        ellipse(gameChar_x,
            gameChar_y - 64, 
            15,
            20);
        //body
        fill(0,0,255);
        rect(gameChar_x - 7, 
         gameChar_y - 55,
         15,
         30);

        //Left Arm
        stroke(255,255,255);
        rect(gameChar_x -5, 
         gameChar_y - 55,
         10,
         22);

        //Left Hand
        fill(194,99,78);
        rect(gameChar_x - 5, 
         gameChar_y - 33,
         8,
         8);

        //Left Leg
        fill(0,0,0);
        rect(gameChar_x - 5, 
         gameChar_y - 25,
         10,
         22);    

        //Left Foot 
        fill(0,10,0,100);
        rect(gameChar_x + 5, 
         gameChar_y - 6,
         - 15,
         8);
    }

    else if(isRight)
    {
        //head
        fill(194,99,78);
        ellipse(gameChar_x,
        gameChar_y - 64, 
        15,
        20);
        //body
        fill(0,0,255);
        rect(gameChar_x - 7, 
        gameChar_y - 55,
        15,
        30);

        //Right Arm
        stroke(255,255,255);
        rect(gameChar_x -5, 
        gameChar_y - 55,
        10,
        22);

        //Right Hand
        fill(194,99,78);
        rect(gameChar_x - 3, 
        gameChar_y - 33,
        8,
        8);

        //Right Leg
        fill(0,0,0);
        rect(gameChar_x - 5, 
        gameChar_y - 25,
        10,
        22);    

        //Right Foot 
        fill(0,10,0,100);
        rect(gameChar_x + 10, 
        gameChar_y - 6,
        - 15,
        8);

    }

    else if(isFalling || isPlummeting)
    {
        //head
        fill(194,99,78);
        ellipse(gameChar_x,
        gameChar_y - 64, 
        15, 
        20);
        //body
        fill(0,0,255); 
        rect(gameChar_x - 10, 
        gameChar_y - 55,
        20,
        30);

        //Arms
        fill(0,0,255);
        stroke(255,255,255);
        rect(gameChar_x - 20, 
        gameChar_y - 55,
        10,
        22);
        rect(gameChar_x + 10, 
        gameChar_y - 55,
        10,
        22);

        //Hands
        fill(194,99,78);
        stroke(255,255,255);
        rect(gameChar_x - 21, 
        gameChar_y - 40,
        8,
        8);
        rect(gameChar_x + 11, 
        gameChar_y - 33,
        8,
        8);

        //legs
        fill(0,0,0);
        stroke(255,255,255);
        rect(gameChar_x - 11, 
        gameChar_y - 40,
        10,
        22);
        rect(gameChar_x, 
        gameChar_y - 35,
        10,
        22);    

        //Feet
        fill(0,10,0,100);
        stroke(255,255,255);
        rect(gameChar_x - 11, 
        gameChar_y - 21,
        8,
        8);
        rect(gameChar_x + 2, 
        gameChar_y - 16,
        8,
        8);

    }
    else 
    {

        //head
        fill(194,99,78);
        ellipse(gameChar_x,
        gameChar_y - 64, 
        15,
        20);

        //body
        fill(0,0,255);
        rect(gameChar_x - 10, 
        gameChar_y - 55,
        20,
        30);

        //Arms
        fill(0,0,255);
        stroke(255,255,255);
        rect(gameChar_x - 20, 
        gameChar_y - 55,
        10,
        22);
        rect(gameChar_x + 10, 
        gameChar_y - 55,
        10,
        22);

        //Hands
        fill(194,99,78);
        stroke(255,255,255);
        rect(gameChar_x - 21, 
        gameChar_y - 33,
        8,
        8);
        rect(gameChar_x + 11, 
        gameChar_y - 33,
        8,
        8);

        //legs
        fill(0,0,0);
        stroke(255,255,255);
        rect(gameChar_x - 11, 
        gameChar_y - 25,
        10,
        22);
        rect(gameChar_x, 
        gameChar_y - 25,
        10,
        22);    

        //Feet
        fill(0,10,0,100);
        stroke(255,255,255);
        rect(gameChar_x - 11, 
        gameChar_y - 6,
        8,
        8);
        rect(gameChar_x + 2, 
        gameChar_y - 6,
        8,
        8);
    }
    
}


// Function to draw cloud objects.

function drawClouds()

{
    for(var i = 0; i < clouds.length; i++)
    {
        fill(255);
        triangle(clouds[i].x_pos + clouds[i].width + 490,
        clouds[i].y_pos + clouds[i].height + 90,
        clouds[i].x_pos - clouds[i].width + 220,
        clouds[i].y_pos - clouds[i].height + 90,
        clouds[i].x_pos + clouds[i].width + 290,
        clouds[i].y_pos + clouds[i].height + 70);

        triangle(clouds[i].x_pos + clouds[i].width + 470,
        clouds[i].y_pos + clouds[i].height + 90, 
        clouds[i].x_pos - clouds[i].width + 220, 
        clouds[i].y_pos - clouds[i].height + 90, 
        clouds[i].x_pos + clouds[i].width + 390, 
        clouds[i].y_pos + clouds[i].height + 70);

        fill(255);
        triangle(clouds[i].x_pos + clouds[i].width + 490,
        clouds[i].y_pos + clouds[i].height + 90,
        clouds[i].x_pos - clouds[i].width + 220,
        clouds[i].y_pos - clouds[i].height + 90,
        clouds[i].x_pos + clouds[i].width + 290,
        clouds[i].y_pos + clouds[i].height + 70);

        triangle(clouds[i].x_pos + clouds[i].width + 470,
        clouds[i].y_pos + clouds[i].height + 90, 
        clouds[i].x_pos - clouds[i].width + 220, 
        clouds[i].y_pos - clouds[i].height + 90, 
        clouds[i].x_pos + clouds[i].width + 390, 
        clouds[i].y_pos + clouds[i].height + 70);

        fill(255);
        triangle(clouds[i].x_pos + clouds[i].width + 490,
        clouds[i].y_pos + clouds[i].height + 90,
        clouds[i].x_pos - clouds[i].width + 220,
        clouds[i].y_pos - clouds[i].height + 90,
        clouds[i].x_pos + clouds[i].width + 290,
        clouds[i].y_pos + clouds[i].height + 70);

        triangle(clouds[i].x_pos + clouds[i].width + 470,
        clouds[i].y_pos + clouds[i].height + 90, 
        clouds[i].x_pos - clouds[i].width + 220, 
        clouds[i].y_pos - clouds[i].height + 90, 
        clouds[i].x_pos + clouds[i].width + 390, 
        clouds[i].y_pos + clouds[i].height + 70);
    }   
}

// Function to draw mountains objects.

function drawMountains()

{
for(var i = 0; i < mountains.length; i++)
{

    triangle(mountains[i].x_pos - mountains[i].width  +390,
         mountains[i].y_pos - mountains[i].height +200,
         mountains[i].x_pos - mountains[i].width +289,
         mountains[i].y_pos + 412,
         mountains[i].x_pos + mountains[i].width +565,
         mountains[i].y_pos + 412);


    triangle(mountains[i].x_pos - mountains[i].width  +390,
         mountains[i].y_pos - mountains[i].height +200,
         mountains[i].x_pos - mountains[i].width +289,
         mountains[i].y_pos + 412,
         mountains[i].x_pos + mountains[i].width +565,
         mountains[i].y_pos + 412);

    fill(155);
    triangle(mountains[i].x_pos - mountains[i].width  +390,
         mountains[i].y_pos - mountains[i].height +200,
         mountains[i].x_pos - mountains[i].width +289,
         mountains[i].y_pos + 412,
         mountains[i].x_pos + mountains[i].width +565,
         mountains[i].y_pos + 412);   
    }    
}

// Function to draw trees objects.

function drawTrees()
{
    for(var i = 0; i < trees_x.length ; i++)
    {
        fill(0, 155, 0);
        noStroke();
        triangle(trees_x[i] - 154, treePos_y + 126,
             trees_x[i] - 139, treePos_y + 66,
             trees_x[i] - 124, treePos_y + 126);

        triangle(trees_x[i] - 154, treePos_y + 106,
             trees_x[i] - 139, treePos_y + 56,
             trees_x[i] - 124, treePos_y + 106);

        triangle(trees_x[i] - 164, treePos_y + 156,
             trees_x[i] - 139, treePos_y + 106, 
             trees_x[i] - 114, treePos_y + 156);

        triangle(trees_x[i] - 154, treePos_y + 126,
             trees_x[i] - 139, treePos_y + 66,
             trees_x[i] - 124, treePos_y + 126);

        triangle(trees_x[i] - 154, treePos_y + 106,
             trees_x[i] - 139, treePos_y + 56,
             trees_x[i] - 124, treePos_y + 106);

        triangle(trees_x[i] - 164, treePos_y + 156,
             trees_x[i] - 139, treePos_y + 106, 
             trees_x[i] - 114, treePos_y + 156);

        triangle(trees_x[i] - 154, treePos_y + 126,
             trees_x[i] - 139, treePos_y + 66,
             trees_x[i] - 124, treePos_y + 126);

        triangle(trees_x[i] - 154, treePos_y + 106,
             trees_x[i] - 139, treePos_y + 56,
             trees_x[i] - 124, treePos_y + 106);

        triangle(trees_x[i] - 164, treePos_y + 156,
             trees_x[i] - 139, treePos_y + 106, 
             trees_x[i] - 114, treePos_y + 156);

        triangle(trees_x[i] - 154, treePos_y + 126,
             trees_x[i] - 139, treePos_y + 66,
             trees_x[i] - 124, treePos_y + 126);

        triangle(trees_x[i] - 154, treePos_y + 106,
             trees_x[i] - 139, treePos_y + 56,
             trees_x[i] - 124, treePos_y + 106);

        triangle(trees_x[i] - 164, treePos_y + 156,
             trees_x[i] - 139, treePos_y + 106, 
             trees_x[i] - 114, treePos_y + 156);    
    }
}

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    push();
//    strokeWeight(2);
//    fill(210,80,30)
//    stroke(100,200,0);
    fill(210,80,30);
    rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.w ,t_canyon.h);
    pop();
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{

    if((gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.w && gameChar_y >= floorPos_y) && (gameChar_y < height + 203))   
        {
            isPlummeting = true;
        }   
}


function checkPlayerDie()
{
    var d = height + 200 
    if(gameChar_y > d && gameChar_y < d + 2)    
    {
        lives -= 1;
        
        if(lives > 0)
        {
            
            startGame(); 
        }
      
        
    }
      if(lives === 0 && keyCode === 32)
        {
            lives =3;
            startGame();        
        }
}


// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    stroke(1);
    fill(255,215,0);
    ellipse(t_collectable.x_pos,
        t_collectable.y_pos,
        t_collectable.size + 5,t_collectable.size);
    ellipse(t_collectable.x_pos + 20,
        t_collectable.y_pos,
        t_collectable.size + 5,t_collectable.size);    
    ellipse(t_collectable.x_pos + 10,
        t_collectable.y_pos - 15,
        t_collectable.size + 5,t_collectable.size);
}


// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 20)
    {
        t_collectable.isFound =true;
        game_score += 20;
    }
}

//function to draw your flagpole in two states. One for when `isReached` is false,
//and one for when it is true

function renderFlagpole()
{
    strokeWeight(5);
    stroke(150,0,250);
    line(flagpole.x_pos,floorPos_y , flagpole.x_pos, floorPos_y -200);
    noStroke();

    if(flagpole.isReached)
    {
        rect(flagpole.x_pos,floorPos_y -200, 50, 50); 
    }

    else
    {
        rect(flagpole.x_pos,floorPos_y -50, 50, 50); 
    }
}


// Function to check character has reached flagpole

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 15 )
    {
        flagpole.isReached = true;
    }
}

function startGame()
{
    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    isContact = false;
    
    gameChar_x = width/2 + 400;
    gameChar_y = floorPos_y;
    treePos_y = height/2;
    game_score = 0;


    flagpole = { x_pos: 2600,isReached: false};

    // Variable to control the background scrolling.
    scrollPos = 0;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    //	gameChar_world_x = gameChar_x - scrollPos;

//    // Boolean variables to control the movement of the game character.
//    isLeft = false;
//    isRight = false;
//    isFalling = false;
//    isPlummeting = false;
//    isContact = false;

    // Initialise arrays of scenery objects.

    trees_x = [-400, -150, 150, 220, 350, 400, 500, 750, 800, 1050,1280,1400, 1630, 1920, 2300,-1900,-1320,-1920];


    clouds = [
    {x_pos: -90,y_pos: 30,width: 50,height: 2},
    {x_pos: 200,y_pos: 130,width: 50,height: 2},
    {x_pos: 450,y_pos: 50,width: 50,height: 2},
    {x_pos: 1350,y_pos: 50,width: 50,height: 2},
    {x_pos: 1550,y_pos: 150,width: 20,height: 2},
    {x_pos: 1850,y_pos: 50,width: 50,height: 2},
    {x_pos: -1350,y_pos: 50,width: 50,height: 2},
    {x_pos: -1750,y_pos: 150,width: 20,height: 2},
    ]


    mountains = [

    {x_pos: 10,y_pos: 20,width: 0.5,height: 60},
    {x_pos: 200,y_pos: 20,width: 1,height: 20},
    {x_pos: 600,y_pos: 20,width: 2,height: 10},
    {x_pos: 1000,y_pos: 20,width: 0.2,height: 5},
    {x_pos: 1500,y_pos: 20,width: 3,height: 200},
    {x_pos: -800,y_pos: 20,width: 1,height: 100},
    {x_pos: -1800,y_pos: 20,width: 0.2,height: 7},
    {x_pos: -2200,y_pos: 20,width: 3,height: 300},
    {x_pos: -1400,y_pos: 20,width: 1,height: 100},
    ]

    canyons = [
    {x_pos: -400, y_pos: floorPos_y, w: 150, h: height - floorPos_y},    
    {x_pos: -150, y_pos: floorPos_y, w: 150, h: height - floorPos_y},    
    {x_pos: 150, y_pos: floorPos_y, w: 150, h: height - floorPos_y},
    {x_pos: 450, y_pos: floorPos_y, w: 100, h: height - floorPos_y},
    {x_pos: 800, y_pos: floorPos_y, w: 50, h: height - floorPos_y},
    {x_pos: 1150, y_pos: floorPos_y, w: 150, h: height - floorPos_y},
    {x_pos: 1450, y_pos: floorPos_y, w: 100, h: height - floorPos_y},
    {x_pos: -1800, y_pos: floorPos_y, w: 50, h: height - floorPos_y},
    {x_pos: -2150, y_pos: floorPos_y, w: 150, h: height - floorPos_y},
    {x_pos: 1750, y_pos: floorPos_y, w: 100, h: height - floorPos_y},
    {x_pos: 2200, y_pos: floorPos_y, w: 50, h: height - floorPos_y},
    ]

    collectables = [
    {x_pos: -200, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: 870, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: 350, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: -450, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: 1600, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: -900, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: 1870, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: 1350, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: -1950, y_pos: floorPos_y -10, size: 20, isFound: false},
    {x_pos: 2100, y_pos: floorPos_y -10, size: 20, isFound: false},
    ];  

    platforms = [];
    
    platforms.push(createPlatforms(-400,floorPos_y - 140,100));
    platforms.push(createPlatforms(-200,floorPos_y - 140,200));
    platforms.push(createPlatforms(200,floorPos_y - 100,200));
    platforms.push(createPlatforms(800,floorPos_y - 100,200));
    platforms.push(createPlatforms(1700,floorPos_y - 140,150));
    platforms.push(createPlatforms(2100,floorPos_y - 140,150));
}

function createPlatforms(x,y,length)
{
    
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            strokeWeight(2);
            fill(210,80,30)
            stroke(100,200,0);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y){
                
        if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5)
                {
                    return true;
                }
                
            }
            return false;
        }   
    }
    
    return p;
}


