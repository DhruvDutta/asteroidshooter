let config = {
    height:window.innerHeight -8,
    width:window.innerWidth -8,
    physics: { default: 'arcade' },
    parent:'page',
    dom:{
        createContainer:true
    },
    scene:{
        preload:preload,
        create:create,
        update:update
    }
}
let gamebest;

if(localStorage.getItem('gamebest')==null){
    localStorage.setItem('gamebest',0)
}else{
    gamebest = localStorage.getItem('gamebest')
}



let game = new Phaser.Game(config)
let ship;
let asteroids=[];
let group;
let ic;
let shipmovement;
let missile=[];
let btn;
let aspeed = 3;
let mspeed = 10;
let head;
let score=0;
let scoreText;
let style;
let point = 10;
let play;
let div;
function preload(){
    div = document.createElement('div');
    div.setAttribute('class','loading');
    div = this.add.dom(game.config.width/2, game.config.height/2,div);
    div.alpha=10;
    this.load.image('back','script/back1.jpg');
    this.load.image('ship','script/ship.png');
    this.load.image('ic','script/ic.jpg');
    this.load.image('a1','script/a1.png');
    this.load.image('a2','script/a2.png');
    this.load.image('missile','script/missile.png');
    this.load.image('fire','script/fire.png');
    this.load.audio('missilefire','script/missile.mp3')
    this.load.audio('exp1','script/explosion1.mp3')


}
function create(){
    game.input.addPointer();
    let W = game.config.width;
    let H = game.config.height;
    this.back = this.add.sprite(W/2,H/2,'back');
    this.back.setScale(.8)
    this.back.angle=90;
    ship = this.add.sprite(W/2,H-70,'ship').setScale(H/5000).setInteractive();
    ship.depth = 4;
    ic = this.add.sprite(W/2,H+200,'ic').setScale(.5);
    ic.angle = -90;
    this.btn = this.add.sprite(W-60,60,'fire').setScale(.2).setInteractive();
    this.btn.alpha = .5;
    this.btn.depth = 3;
    style = { font: `20px Arial`, fill: '#fff' };

    gamebest = this.add.text(10, 170, 'Best: ' + localStorage.getItem('gamebest'), style);
    
    gamebest.angle = -90;
    gamebest.depth = 5;
    this.input.on('pointerdown',run,this)
    this.name = this.add.text((W*1.35)/3, H-150, 'Asteroid Shooter ', { font:'40px algerian'  ,align:'center' ,color:'white' });
    this.name.angle=-90;
    this.txt = this.add.text((W*1.35)/3 +50,H-190,`Drag the Ship to Aim\nTap on the Red Button to 🔥`,{align:'center'})
    this.txt.angle = -90;


    this.sound.add('missilefire')
    this.sound.add('exp1');
    play = this.add.text(W/2+70,H/2 +35,'Play',{font:'70px Arial',fill:'#fff',align:'center'})
    play.alpha=0;
    play.depth=2;
    play.angle = -90;
    this.tweens.add({
        targets:[play],
        alpha:1,
        duration:700,
        ease:'Sine.easeInOut',
        loop:-1,
        yoyo:true
    })
    
    div.setActive(false);
    div.setVisible(false);

    
}
function update(){
    for(i=0;i<asteroids.length;i++){
        let a = asteroids[i]
        a.angle+=2;
        a.y+=aspeed;
        if(a.y>shipmovement-45){
            document.write('<center><h2 style="margin-top:50vh;">Game Over</h2><hr><a href="https://dhruvdutta.github.io/MYWebsite/">View More</a><hr></center>');
            throw new Error('game over')
        }
    }
    for(j=0;j<missile.length;j++){
        let m = missile[j];
        m.y-=mspeed;
        if(m.y<-50){
            m.setActive(false);
            m.setVisible(false);
            missile.splice(j,1);
            score-=parseInt(score/20);
            scoreText.setText('score: ' +score);
        }
        for(k=0;k<asteroids.length;k++){
            if(contact(m,asteroids[k])){
                m.setActive(false);
                m.setVisible(false);
                missile.splice(j,1);
                asteroids[k].setActive(false);
                asteroids[k].setVisible(false);
                asteroids.splice(k,1);
                score+=point;
                scoreText.setText('score: ' +score);
                if(localStorage.getItem('gamebest')<score){
                    localStorage.setItem('gamebest',score)
                    gamebest.setText('gamebest:'+score)}
            }
        }

    }

}

function run(){
    let W = game.config.width;
    let H = game.config.height;
    scoreText = this.add.text(35, 170, 'Time: ' + score, style);
    scoreText.angle = -90;
    scoreText.depth = 5;
    shipmovement = H/1.2;
    this.name.setText("");
    this.txt.setText("");
    play.setText("");
    this.input.setDraggable(ship);
    this.input.on('drag', drag);
    this.input.off('pointerdown');
    this.btn.on('pointerdown',
    function(){
        let b =this.physics.add.sprite(ship.x,ship.y,'missile').setScale(.05);
        b.angle = -90;
        b.depth = 3;
        missile.push(b);
        this.physics.add.overlap(ship, b, contact);
        this.sound.play('missilefire')

    },this);


    setInterval(function(g){
        num = Math.random();
        if(num<0.9){
            num='a1';
            asteroids.push(g.add.sprite(Phaser.Math.Between(50,game.config.width-50),-10,num).setScale(.1));

        }else{
            num='a2';
            asteroids.push(g.add.sprite(Phaser.Math.Between(50,game.config.width-50),-10,num).setScale(.09));

        }

    },700,this)

    
    setInterval(function(){
        if(aspeed<=6){
            aspeed+=.5;
            point+=10;
        }
        if(aspeed%2==0){
            mspeed+=2;
        }
    },12000)
    
    
}


function drag(pointer, gameObject, dragX, dragY) {
    if(dragX<game.config.width && dragX>0){
        gameObject.x = dragX;
    }
    if(dragY<game.config.height && dragY>shipmovement){
        gameObject.y = dragY;

    }

}


function contact(obj1, obj2) {
    var distX = Math.abs(obj1.x - obj2.x);
    var distY = Math.abs(obj1.y - obj2.y);
    if (distX < obj1.width / 50) {
        if (distY < obj1.height / 50) {
            game.sound.play('exp1')
            return true;
        }
    }
    return false;
}
