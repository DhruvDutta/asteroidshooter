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

let game = new Phaser.Game(config)
let ship;
let asteroids=[];
let group;
let ic;
let shipmovement;
let missile=[];
let btn;
let aspeed = 1;
let mspeed = 10;
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
    let W = game.config.width;
    let H = game.config.height;
    this.back = this.add.sprite(W/2,H/2,'back');
    let scaleX = this.cameras.main.width / this.back.width;
    let scaleY = this.cameras.main.height / this.back.height;
    let scale = Math.max(scaleX, scaleY);
    this.back.setScale(scale)
    if(W>H){//desktop
        ship = this.add.sprite(H/10,H/2,'ship').setScale(H/5000).setInteractive();
        ship.angle = 90;
        this.ic = this.add.sprite(-500,H/2,'ic').setInteractive();
        shipmovement = H/10;
        ship.depth = 3;
        this.input.setDraggable(ship);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        if(dragX<W/2 && dragX>0){
            gameObject.x = dragX;
        }
        if(dragY<game.config.height && dragY>0){
            gameObject.y = dragY;

        }

    });

    }else{
        //mobile
        ship = this.add.sprite(W/2,H-70,'ship').setScale(H/5000).setInteractive()
        ic = this.add.sprite(W/2,H+200,'ic').setScale(.5);
        ic.angle = -90;
        shipmovement = H/1.2;
        ship.depth = 4;
        this.input.setDraggable(ship);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            if(dragX<game.config.width && dragX>0){
                gameObject.x = dragX;
            }
            if(dragY<game.config.height && dragY>shipmovement){
                gameObject.y = dragY;
    
            }
    
        });
        this.btn = this.add.sprite(W-60,60,'fire').setScale(.2).setInteractive();
        this.btn.alpha = .5;
        this.btn.depth = 3;
        this.btn.on('pointerdown',
        function(){
            let b =this.physics.add.sprite(ship.x,ship.y,'missile').setScale(.07);

            b.angle = -90;
            b.depth = 3;
            missile.push(b);
            this.physics.add.overlap(ship, b, contact);


        },this);
    }

    setInterval(function(g){
        num = Math.random();
        if(num<0.9){
            num='a1';
        }else{
            num='a2';
        }
        
        if(num=='a2'){
            asteroids.push(g.add.sprite(Phaser.Math.Between(50,game.config.width-50),-10,num).setScale(.5));
        }else{
            asteroids.push(g.add.sprite(Phaser.Math.Between(50,game.config.width-50),-10,num).setScale(.2));
        }
    },2000,this)

    
    setInterval(function(){
        if(aspeed<=6){
            aspeed+=.5
        }
        if(aspeed==3){
            mspeed+=2;
        }
    },12000)
    
}
function update(){
    for(i=0;i<asteroids.length;i++){
        let a = asteroids[i]
        a.angle+=2;
        a.y+=aspeed;
        if(a.y>shipmovement-45){
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


function contact(obj1, obj2) {
    var distX = Math.abs(obj1.x - obj2.x);
    var distY = Math.abs(obj1.y - obj2.y);
    if (distX < obj1.width / 15) {
        if (distY < obj1.height / 15) {
            return true;
        }
    }
    return false;
}