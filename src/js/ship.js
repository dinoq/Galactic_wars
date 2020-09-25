
class Ship{
    constructor(x, y, player = null){
        this.imgPosition = new Position(x, y);
        this.dim = new Dimension(99, 98);
        this.pos = new Position(x + this.dim.w/2, y + this.dim.h/2);
        this.field = game.getFieldFromXY(this.pos.x, this.pos.y);        
        this.field.settledByShip = this;
        this.targetField = this.field;
        this.img = new Image();
        this.img_loaded = false;
        let img_src = "s3.png";//"ship.png";
        this.img.src = "img/" + img_src;
        this.angleTarget = 0;
        this.angle = 0;
        this.canFire = true;
        this.accelerationSpeed = 6;
        this.angleSpeed = 4;
        this.bulletSpeed = 10;
        this.health = 90;
        this.maxHealth = 100;
        this.showHealth = false;
        this.boundaries = new GameRectangle(this.imgPosition,this.dim);
        this.scope = 7;
        this.range = 300;
        this.attacking = false;
        this.attackedTarget = null;
        this.player = player;
        this.moving = false;
        var ship_object = this;
        this.missileArray = new Array();

        this.img.onload = function() {
            ship_object.img_loaded = true;
            ship_object.draw();
        }
    }
    
    update(progress) {
        if(this.angle != this.angleTarget){//First rotate
            let direction = -1;
            let fullangle = false;
            if(this.angleTarget > this.angle){
                if((this.angleTarget - this.angle) < (360 - this.angleTarget + this.angle)){
                    direction = 1;
                }else{
                    direction = -1;
                }
            }else{
                if((this.angle - this.angleTarget) < (360 - this.angle + this.angleTarget)){
                    direction = -1;
                }else{
                    direction = 1;
                }
            }

            if(direction == 1){
                if(this.angleTarget > this.angle){
                    if(this.angle + this.angleSpeed < this.angleTarget){
                        fullangle = true;
                    }
                }else{
                    if(-360 + this.angle + this.angleSpeed < this.angleTarget){
                        fullangle = true;
                    }
                }
            }else{
                if(this.angleTarget > this.angle){
                    if(360 + this.angle - this.angleSpeed > this.angleTarget){
                        fullangle = true;
                    }
                }else{
                    if(this.angle - this.angleSpeed > this.angleTarget){
                        fullangle = true;
                    }
                }
            }
            if(fullangle){
                this.angle += (direction * this.angleSpeed);
            }else{
                this.angle = this.angleTarget;
            }
            
            if(this.angle > 360){
                this.angle = this.angle % 360;
            }
        }else if(!this.pos.equal(this.targetField.centerPos)){
            if(this.attacking){
                this.fire(BULLET);
                this.attacking = false;
            }
            if(this.field.isNeighbor(this.targetField)){
                if(this.targetField.isSettled()){
                    this.moveTo(game.getFieldFromPos(this.targetField.findNearestFiedlPos(this.angle)));
                }
            }else{
                

            }
            this.pos = new Triangle(this.pos, this.targetField.centerPos).getNewPosBySpeed(this.accelerationSpeed);
            this.imgPosition = this.getImgPos();
            this.boundaries.moveToPos(this.imgPosition);
            if(!this.field.shipStillOnField(this)){
                this.field = game.getFieldFromXY(this.pos.x, this.pos.y);
                if(this.field == this.targetField){
                    this.moving=false;
                    this.field.settledByShip = this;
                }
            }
            
        }
        for(let i = 0; i < this.missileArray.length; i++){
            //if(!this.missileArray[i].update(progress)){
                //clog(this.missileArray);
                //this.missileArray.splice(i, 1);
            //}
            this.missileArray[i].update(progress);
        }
    }

    draw(){
        if(!this.img_loaded){
            return;
        }
        game.ctx.save();
        game.ctx.translate(this.pos.x,this.pos.y);
        game.ctx.rotate(this.angle * Math.PI/180);
        game.ctx.translate(-this.pos.x,-this.pos.y);
        game.ctx.drawImage(this.img, this.imgPosition.x, this.imgPosition.y, this.dim.w*game.zoom, this.dim.h*game.zoom);
     
        game.ctx.restore();

        /*
        //Img and boundaries
        game.ctx.strokeStyle = "yellow";
        game.ctx.strokeRect(this.imgPosition.x,this.imgPosition.y, this.dim.w*game.zoom, this.dim.h*game.zoom);
        game.ctx.strokeStyle = "black";
        game.ctx.strokeRect(this.boundaries.pos.x, this.boundaries.pos.y, this.dim.w*game.zoom, this.dim.h*game.zoom);
        */

        //scope draw
        if(this.player.relation == ME){
            game.ctx.strokeStyle = "blue";
            game.ctx.fillStyle = "blue";
        }else if(this.player.relation == FRIEND){
            game.ctx.strokeStyle = "yellow";
            game.ctx.fillStyle = "yellow";
        }else if(this.player.relation == ENEMY){
            game.ctx.strokeStyle = "red";
            game.ctx.fillStyle = "red";
        }
        
        game.ctx.beginPath();
        game.ctx.arc(this.pos.x, this.pos.y, this.scope, 0, 2 * Math.PI);
        game.ctx.fill();

        if(this.showHealth){
            let healthBarHeight = 5;
            let healthZoom = 0.5;
            game.ctx.fillStyle = "red";
            game.ctx.fillRect(this.pos.x-this.dim.w/(2/healthZoom),this.pos.y, this.maxHealth*healthZoom, healthBarHeight);
            game.ctx.fillStyle = "green";
            game.ctx.fillRect(this.pos.x-this.dim.w/(2/healthZoom),this.pos.y, this.health*healthZoom, healthBarHeight);
        }

        for(let i = 0; i < this.missileArray.length; i++){
            this.missileArray[i].draw(game.ctx);
            
        }
    }

    fire(missile_type){
        if(this.canFire){
            let missile = null;
            switch(missile_type){
                case BULLET:
                    missile = new Bullet(this.pos,this.angle, this.bulletSpeed,this.player, this.attackedTarget);
                    break;
                default:
                    missile = new Bullet(this.pos,this.angle, this.bulletSpeed,this.player, this.attackedTarget);
                    break;
            }
            
            this.missileArray.push(missile);
        }else{
            console.log("CANNOT FIRE!");
        }
        this.canFire = false;
        setTimeout(this.recharge, 2000, this);
    }

    recharge(ship){
        ship.canFire=true;
    }

    moveTo(field){
        if(field.isSettled()){//are we fighting??
            this.attackedTarget = field.settledByShip;
        }else{

        }
        this.targetField = field;
        let t = new Triangle(this.pos, this.targetField.centerPos);
        this.angleTarget = t.angleA;
        if(this.field != this.targetField){
            this.moving = true;
            this.field.removeTargetShip();
        }
    }

    getImgPos(){
        return new Position(parseInt(this.pos.x - this.dim.w/2),parseInt(this.pos.y - this.dim.h/2));
    }
}

