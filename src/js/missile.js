const MISSILE = 0;
const BULLET = 1;
const BOMB = 10;


class Missile{//střela
    constructor(pos,speed, player, attackedTarget, strength, src){
        this.pos = pos.getCopyOfPos();
        this.imgPos = null;
        this.triangle = new Triangle(this.pos, attackedTarget.pos);
        this.angle = this.triangle.angleA;
        this.speed = speed;
        this.dim = null;
        this.player = player;
        this.deltaX = 0;
        this.deltaY = 0;
        this.attackedPos = new Position(attackedTarget.pos.x, attackedTarget.pos.y);
        this.img = new Image();
        this.imgLoaded = false;
        this.img.src = "img/" + src;
        var missile = this;
        this.lifeTime = 0;
        this.strength = strength;
        this.img.onload = function(){
            missile.imgLoaded = true;
            missile.dim = new Dimension(missile.img.width/2, missile.img.height/2);
            missile.imgPos = new Position(missile.pos.x - missile.dim.w/2, missile.pos.y - missile.dim.h/2);
        }

    }

    updateImgPos(){
        this.imgPos.x = this.pos.x - this.dim.w/2;
        this.imgPos.y = this.pos.y - this.dim.h/2;
    }

    updateDeltas(){
        this.deltaX = Math.cos(this.angle*Math.PI/180) * this.speed;
        this.deltaY = -Math.sin(this.angle*Math.PI/180) * this.speed;

        if(this.angle < 90){

        }else if(this.angle < 180){
            this.deltaX = -this.deltaX;
            this.deltaY = -this.deltaY;
        }
    }
    update(progress){        
        if(!this.imgLoaded){
            return;
        }
        //return;
        //console.log("BUL222:"+this.angle);
        if(this.deltaX == 0 || this.deltaY == 0){
            this.updateDeltas();
        }
        //this.pos.x += (this.deltaX * progress/16);
        //this.pos.y += (this.deltaY* progress/16);
        this.pos = this.triangle.getNewPosBySpeed(this.speed);
        this.updateImgPos();
        this.triangle.pos1 = this.pos;
        
        this.lifeTime += progress;
        if(this.lifeTime > 1000){//every second
            this.lifeTime = 0;
            this.strength *= 0.9;
        }
    }

    draw(ctx){
        if(!this.imgLoaded){
            return;
        }
        ctx.drawImage(this.img, this.imgPos.x, this.imgPos.y, this.dim.w, this.dim.h);

        //this.triangle.draw(ctx);
    }
}

class Bullet extends Missile{//kulka
    constructor(pos,speed, player, attackedTarget, strength){
        super(pos,speed, player, attackedTarget, strength, "bullet.png");
    }
    
    update(progress){
        super.update(progress);
    }

    draw(ctx){
        super.draw(ctx);
    }
}