const MISSILE = 0;
const BULLET = 1;
const BOMB = 10;


class Missile{//střela
    constructor(pos,angle,speed, player, attackedTarget, src){
        this.pos = pos.getCopyOfPos();
        this.imgPosition = null;
        this.triangle = new Triangle(this.pos, attackedTarget.pos);
        this.angle = this.triangle.angleA;
        this.speed = speed;
        this.dim = null;
        this.player = player;
        this.deltaX = 0;
        this.deltaY = 0;
        this.attackedPos = new Position(attackedTarget.pos.x, attackedTarget.pos.y);
        console.log("UHEL TRIANGLE: " + new Triangle(this.pos, this.attackedPos).angleA);
        console.log("UHEL consturctor: " + angle);
        this.img = new Image();
        this.imgLoaded = false;
        this.img.src = "img/" + src;
        var missile = this;
        this.img.onload = function(){
            missile.imgLoaded = true;
            missile.dim = new Dimension(missile.img.width/2, missile.img.height/2);
            missile.imgPos = new Position(x - this.dim.w/2, y - this.dim.h/2);
        }

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
        
        //console.log("BUL222:"+this.angle);
        if(this.deltaX == 0 || this.deltaY == 0){
            this.updateDeltas();
        }
        //this.pos.x += (this.deltaX * progress/16);
        //this.pos.y += (this.deltaY* progress/16);
        this.pos = this.triangle.getNewPosBySpeed(this.speed);
        this.triangle.pos1 = this.pos;
        return;
        for(let i = 0; i < game.ships.length; i++){
            if(game.ships[i].player.relation == ENEMY){
                if(game.ships[i].boundaries.containsPoint(this.pos)){
                    game.ships.splice(i, 1);
                    return true;
                }
            }
        }
        return true;
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
    constructor(pos,angle,speed, player, attackedTarget){
        super(pos,angle,speed, player, attackedTarget, "bullet.png");
    }
    
    update(progress){
        super.update(progress);
    }

    draw(ctx){
        super.draw(ctx);
    }
}