let config = {
    height:window.innerHeight -8,
    width:window.innerWidth -8,
    physics: { default: 'arcade' },
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
function preload(){
    this.load.image('back','script/back.jpg');
    this.load.image('ship','script/ship.png');
    this.load.image('ic','script/ic.jpg');
    this.load.image('a1','script/a1.png');
    this.load.image('a2','script/a2.png');
    this.load.image('missile','script/missile.png');
    this.load.image('fire','script/fire.png');
}
function create(){
    game.input.addPointer();
    let W = game.config.width;
    let H = game.config.height;
    this.back = this.add.sprite(W/2,H/2,'back');
    let scaleX = this.cameras.main.width / this.back.width;
    let scaleY = this.cameras.main.height / this.back.height;
    let scale = Math.max(scaleX, scaleY);
    this.back.setScale(.2)
    ship = this.add.sprite(W/2,H-70,'ship').setScale(H/5000).setInteractive();
    ship.depth = 4;
    ic = this.add.sprite(W/2,H+200,'ic').setScale(.5);
    ic.angle = -90;
    this.btn = this.add.sprite(W-60,60,'fire').setScale(.2).setInteractive();
    this.btn.alpha = .5;
    this.btn.depth = 3;
    style = { font: `20px Arial`, fill: '#fff' };

    gamebest = this.add.text(10, 120, 'Best: ' + localStorage.getItem('gamebest'), style);
    
    gamebest.angle = -90;
    gamebest.depth = 5;
    this.input.on('pointerdown',run,this)
    this.name = this.add.text((W*1.35)/3, H-150, 'Asteroid Shooter ', { font:'40px algerian'  ,align:'center' ,color:'white' });
    this.name.angle=-90;
    this.txt = this.add.text((W*1.35)/3 +50,H-190,`Drag the Ship to Aim\nTap on the Red Button to 🔥`,{align:'center'})
    this.txt.angle = -90;
    this.txt1 = this.add.text(30,H-200,`Time is of the Essence`,{font:'18px ',align:'center'})
    this.txt1.angle = -90;

    function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

    
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
            m="";
        }
        for(k=0;k<asteroids.length;k++){
            if(contact(m,asteroids[k])){
                m.setActive(false);
                m.setVisible(false);
                missile.splice(j,1);
                asteroids[k].setActive(false);
                asteroids[k].setVisible(false);
                asteroids.splice(k,1);
            }
        }

    }

}

function run(){
    let W = game.config.width;
    let H = game.config.height;
    scoreText = this.add.text(35, 120, 'Time: ' + score, style);
    scoreText.angle = -90;
    scoreText.depth = 5;
    shipmovement = H/1.2;
    this.name.setText("");
    this.txt.setText("");
    this.txt1.setText("");

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


    },this);


    setInterval(function(g){
        num = Math.random();
        if(num<0.9){
            num='a1';
            asteroids.push(g.add.sprite(Phaser.Math.Between(50,game.config.width-50),-10,num).setScale(.07));

        }else{
            num='a2';
            asteroids.push(g.add.sprite(Phaser.Math.Between(50,game.config.width-50),-10,num).setScale(.07));

        }

    },700,this)

    
    setInterval(function(){
        if(aspeed<=6){
            aspeed+=.5;
        }
        if(aspeed==5){
            mspeed+=2;
        }
    },12000)
    setInterval(function(){
        score+=.01;
        scoreText.setText('score: ' +score.toFixed(2));
        if(localStorage.getItem('gamebest')<score){
            localStorage.setItem('gamebest',score.toFixed(2))
            gamebest.setText('gamebest:'+score.toFixed(2))
    }
    },10)
    
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
            return true;
        }
    }
    return false;
}
