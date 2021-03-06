// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var score=0;
var labelScore;
var player;
var pipes = [];
var kermits = [];
var redkermits = [];
var width = 800;
var height = 600;
var speed = 200;
var gravity = 300;
var jump = 300;
var pipeInterval = 2;
var gapSize = 350;
var gapMargin = 50;
var bigflower;
var blockHeight = 50;
var balloons = [];
var weights = [];
var splashDisplay ;
var background1;
var background2;
var backgrounds = [];
var enemys = [];
var backgroundspeed = 100;
var music;



// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    jQuery("#greeting-form").on("submit", function(event_details) {
        //var greeting = "Yo ";
        var name = jQuery("#fullName").val();
        //var email = jQuery("#email").val();
        var score = jQuery("#score").val();
        var greeting_message = greeting + name +"     score"  +score ;
        //jQuery("#greeting-form").hide();
        //jQuery("#greeting-form").fadeOut( 1000);
        //jQuery("#greeting").append("<p>" + greeting_message + "</p>");
        //event_details.preventDefault();
        //jQuery("#greeting-form").hide();
        jQuery ("#greeting").fadeIn(5000,restart )

    });


    //game.load.image("playerImg", "../assets/jamesBond.gif");
    game.load.image("kermit", "../assets/kermit.gif");
    game.load.image("heart", "../assets/heart.jpg");
    game.load.image("backgroundImg", "../assets/background2.gif");
    //game.load.audio("score", "../assets/point.ogg");
    game.load.audio("arkona", "../assets/arkona.mp3");
    game.load.audio("scream", "../assets/scream.mp3");
    game.load.audio("boom", "../assets/boom.mp3");
    game.load.image("kitten", "../assets/kitten.gif");
    game.load.image("flower","../assets/flower.jpg" );
    game.load.image("redkermit","../assets/redkermit.gif" );
    game.load.image("pipetop","../assets/pipetop.gif" );
    game.load.image("pipebottom","../assets/pipebottom.gif" );
    game.load.image("balloon","../assets/balloons.png" );
    game.load.image("weight","../assets/weight.png");
    game.load.image("bigflower","../assets/bigflower.gif");
    game.load.image("enemy1","../assets/enemy2.png");
    $("#greeting").hide();
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.stage.setBackgroundColor("#FFFF00");
    //game.add.image(0, 0, "backgroundImg");
    background1 = game.add.sprite(0,0,"backgroundImg");
    background2 = game.add.sprite(3802,0,"backgroundImg");
    game.physics.arcade.enable(background1);
    game.physics.arcade.enable(background2);
    //backgroundroll(0)
    //backgroundroll(3802)
    game.add.text(-13, 300, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
        "AAAAAAAAAAAAAAAA",
        {font: "100px Giddyup Std", fill: "#FF0000"});
    labelScore = game.add.text(400, 100, "0",
        {font: "300px Comic Sans MS", fill: "#FFFF00"});
    player = game.add.sprite(100, 200, "kitten");
    game.physics.arcade.enable(player);
    KermitGlide(0,200,100);
    KermitGlide(-100,200,100);
    KermitGlide(-200,200,100);
    KermitGlide(-300,200,100);
//    player.body.velocity.x = 100;
    //player.body.velocity.x=100;
    //game.input
    //    .keyboard.addKey(Phaser.Keyboard.RIGHT)
    //    .onDown.add(moveRight);
    //game.input
    //    .keyboard.addKey(Phaser.Keyboard.LEFT)
    //    .onDown.add(moveLeft);
    //game.input
    //    .keyboard.addKey(Phaser.Keyboard.UP)
    //    .onDown.add(moveUp);
    //game.input
    //    .keyboard.addKey(Phaser.Keyboard.DOWN)
    //    .onDown.add(moveDown);
    heart();
    //("#greeting").fadeOut(1000);

    bigflower = game.add.sprite(width/2, height/2, "bigflower");
    game.physics.arcade.enable(bigflower);
    bigflower.anchor.setTo(0.5, 0.5);


    splashDisplay = game.add.text(10,50,
        "enter to start, spacebar to jump",
        {font: "30px Comic Sans MS", fill: "#00FF00" });
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
}

function start(){
    music = game.add.audio('arkona',0.5,true);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.input
    //    .onDown
    //    .add(clickHandler);
    player.body.gravity.y = gravity;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);
    generatePipe();
    game.time.events.loop(pipeInterval*Phaser.Timer.SECOND,generate);
    game.time.events.loop(pipeInterval*Phaser.Timer.SECOND,changeScore);

    background1.body.velocity.x = -backgroundspeed;
    background2.body.velocity.x = -backgroundspeed;

    RedKermitGlide(5000,150,-1000);
    splashDisplay.destroy();
    bigflower.destroy();
    //background.autoScroll(-backgroungVelocity,0);
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
}

function update() {

    game.physics.arcade
        .overlap(player,
                  pipes,
                  function(){
                      console.log("cause of death: pipes");
                      game.sound.play("boom");
                      gameOver();
                  });

    game.physics.arcade
        .overlap(player,
        enemys,
        function(){
            console.log("cause of death: KERMIT");
            game.sound.play("scream");
            gameOver();
        });


    for(var index=0;index<kermits.length;index++) {
        if (kermits[index].x > 800) {
            kermits[index].x = -180;
        }
    }
    for(var index=0;index<redkermits.length;index++) {
        if (redkermits[index].x < -1000) {
            redkermits[index].x = 5000
        }
        redkermits[index].rotation += 0.1;
    }

    if (background1.x < -3802){
        background1.x = 3801;
    }

    if (background2.x < -3802){
        background2.x = 3801;
    }

    for(var index=0;index<enemys.length;index++) {
        enemys[index].body.velocity.y += getRandomInt(-10,10);
        enemys[index].body.velocity.x += getRandomInt(-10,10);
    }

    bigflower.rotation += 0.075;

    if (
            player.y > 600 ||
            player.y < 0 ) {
        console.log("cause of death: you escaped");
        gameOver();
    }

    player.rotation = Math.atan(player.body.velocity.y / 300);

    for(var i=balloons.length - 1; i >= 0; i--){
        game.physics.arcade.overlap(player,balloons[i], function(){
            changeGravity(-50);
            balloons[i].destroy();
            balloons.splice(i,1);
        });
    }

    for(var i=weights.length - 1; i >= 0; i--){
        game.physics.arcade.overlap(player,weights[i], function(){
            changeGravity(+50);
            weights[i].destroy();
            weights.splice(i,1);
        });
    }
}

function restart() {
    score = 0;
    game.paused = false;
    gravity = 300;
    game.state.restart();
}


function clickHandler(event) {
    game.add.sprite(event.x-35, event.y, "kermit");
    //game.sound.play("score");
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//function spaceHandler() {
////    game.sound.play("score");
//}

function changeScore() {
    score = score+1;
    labelScore.setText(score.toString());
}

function addPipeTopEnd(x,y){
    var pipetop = game.add.sprite(x,y,"pipetop");
    pipes.push(pipetop);
    game.physics.arcade.enable(pipetop);
    pipetop.body.velocity.x = -speed;
}

function addPipeBottomEnd(x,y){
    var pipebot = game.add.sprite(x,y,"pipebottom");
    pipes.push(pipebot);
    game.physics.arcade.enable(pipebot);
    pipebot.body.velocity.x = -speed;
}

function addPipeBlock(x,y){
    var pipeBlock = game.add.sprite(x,y,"flower");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -speed;
}

function heart() {

    for(var count=0; count<15; count+=1){
        if (count!=5 && count != 6)  {
            game.add.sprite(50*count, 50*count, "heart");
            game.add.sprite((50*count), 550-(50*count), "heart");
            // game.add.sprite(count-position), (count-position)*(count-position), "flower";
        }
    }}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height- gapSize-gapMargin);
    for (var topy=gapStart; topy>-50; topy -= blockHeight ){
        addPipeBlock(width,topy);
    } //top of pipe
    for (var bottomy=gapStart + gapSize ; bottomy<height+50 ; bottomy += blockHeight) {
        addPipeBlock(width,bottomy)
    } //bottom of pipe
    addPipeTopEnd(width,gapStart+50);
    addPipeBottomEnd(width,gapStart + gapSize-17);
}

//function generatePipe() {
//    var gapStart = game.rnd.integerInRange(0, 7);
//    for(var count=0; count<12; count+=1){
//       // if (count!=5 && count != 6)  {
//       //     game.add.sprite(50*count, 50*count, "flower");
//       //     game.add.sprite((50*count), 550-(50*count), "flower");
//         // game.add.sprite(count-position), (count-position)*(count-position), "flower";
//         //  }
//        if(count != gapStart &&
//            count != gapStart + 1&&
//            count != gapStart + 2&&
//            count != gapStart + 3&&
//              count != gapStart + 4&&
//           count != gapStart + 5)
//        {
//            addPipeBlock(800, count*50);}
//        }
//    //changeScore();
//}

function changeGravity(g) {
    gravity += g;
    player.body.gravity.y = gravity;
}

function gameOver(){
    this.music.stop();
    game.add.text(0, 100, "YOU DIED LOL",
        {font: "100px Arial", fill: "#FF69B4"});

    setTimeout(function(){
        game.paused = true;
    },1);
    $("#score").val(score.toString());
    $("#greeting").fadeIn(2000);
}

//function gameOvertwo(){
//    game.add.text(0, 100, "KERMIT GOT U LOLOLOLOLOLOLLOL",
//        {font: "100px Arial", fill: "#00FF00"});
//    //setTimeout(function(){
//    //    game.destroy();
//    //},1);
//    setTimeout(function(){
//        game.paused = true;
//    },1);
//    //game.paused(true);
//    $("#score").val(score.toString());
//    $("#greeting").fadeIn(2000);
//    //$("#greeting").show();
//}


function KermitGlide(x,y,v) {
    var kermit = game.add.sprite(x, y, "kermit");
    game.physics.arcade.enable(kermit);
    kermit.body.velocity.x=v;
    kermits.push(kermit);
}

function RedKermitGlide(x,y,v) {
    var redkermit = game.add.sprite(x, y, "redkermit");
    game.physics.arcade.enable(redkermit);
    redkermit.body.velocity.x=v;
    redkermit.anchor.setTo(0.5, 0.5);
    redkermits.push(redkermit);
}

function playerJump() {
    player.body.velocity.y = -jump;
}

function moveRight() {
    player.body.velocity.x = 100;
}

function moveLeft() {
    player.body.velocity.x = -100;
}

function moveUp() {
    player.body.velocity.y = -100;
}

function moveDown() {
    player.body.velocity.y = 100;
}

function enemy () {
    var enemy = game.add.sprite(width,height/2,"enemy1");
    enemys.push(enemy);
    game.physics.arcade.enable(enemy);
    enemy.body.velocity.x=-200;
}

function generate(){
    var diceRoll = game.rnd.integerInRange(1, 15);
    if(diceRoll==1) {
        generateBalloons();
        generatePipe();
    }
    else if(diceRoll==2) {
        generateWeight();
        generatePipe();

    }
    else if(diceRoll>12){
        enemy();
    }
    else {
        generatePipe();
    }
}

function generateBalloons(){
    var bonus = game.add.sprite(width, height/2, "balloon");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 100;
    bonus.body.velocity.y = game.rnd.integerInRange(-50,50);
}

function generateWeight(){
    var bonus = game.add.sprite(width, height/2, "weight");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 100;
    bonus.body.velocity.y = - game.rnd.integerInRange(-50,50);
}

//$.get("/score", function(scores){
//    console.log("Data: ",scores);
//});

$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });

    for (var i = 0; i < 4; i++) {
        $("#scoreBoard").append(
            "<li id=a"+i+">" + scores[i].name + ": " + scores[i].score + "</li>");
      }
});
