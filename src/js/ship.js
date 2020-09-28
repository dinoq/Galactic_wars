
class Ship{
    constructor(x, y, player = null){
        this.id = game.ships.length;
        this.showId = true;
        this.imgPos = new Position(x, y);
        this.dim = new Dimension(99, 98);
        this.pos = new Position(x + this.dim.w/2, y + this.dim.h/2);
        this.field = game.getFieldFromXY(this.pos.x, this.pos.y);        
        this.field.settledByShip = this;
        this.temporaryTargetField = this.field;
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
        this.boundaries = new GameRectangle(this.imgPos,this.dim);
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
        //console.log(this.angle+" desiredA: "+this.angleTarget);
        
        if(this.angle == this.angleTarget && this.attacking){
            this.fire(BULLET);
        }
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
                //console.log(fullangle);
            }
            
            if(this.angle > 360){
                this.angle = this.angle % 360;
            }
        }else if(!this.pos.equal(this.temporaryTargetField.centerPos)){//If not on right position...
            //console.log("this.field.getFieldX"+this.field.getFieldX() + " "+this.field.getFieldY());
            if(this.field.isNeighbor(this.temporaryTargetField)){//If close to right position
                //console.log("nejbrrrrrrr??????");
                if(this.temporaryTargetField.isSettled()){
                    //this.moveTo(game.getFieldFromPos(this.targetField.findNearestFiedlPos(this.angle)));
                    this.moveTo(this.targetField.findNearestField(this.field));
                    //console.log("presmerovavam(" + this.id + "): ");
                    //this.targetField.printFieldShiftedXY();
                    //console.log("NEW : this.field.getFieldX"+this.targetField.getFieldX() + " "+this.targetField.getFieldY());
                }
            }else{
                

            }
            this.pos = new Triangle(this.pos, this.temporaryTargetField.centerPos).getNewPosBySpeed(this.accelerationSpeed);
            this.imgPos = this.getImgPos();
            this.boundaries.moveToPos(this.imgPos);
            if(!this.field.shipStillOnField(this)){
                this.field = game.getFieldFromXY(this.pos.x, this.pos.y);
                //console.log(this.field.settledByShip);
                if(this.field == this.temporaryTargetField){
                    //console.log("hotovo" + this.field.pos.x + " "+this.field.pos.y+ " B" + this.field.settledByShip);
                    this.moving=false;
                    //console.log("settld?" + this.field.settledByShip);
                    this.field.settledByShip = this;
                    console.log("obsazeno na:");
                    this.field.printFieldShiftedXY();
                }
            }
            
        }else{
            if(this.id == 0){//only for testing
            }
            if(this.field.isSettled() && this.field.settledByShip != this){
                this.moveTo(this.targetField.findNearestField(this.field));
                console.log("jsem na obsazenem a proto presmerovavam(" + this.id + "): ");
                this.targetField.printFieldShiftedXY();
            }else if(this.field.isEmpty()){
                this.moving=false;
                this.field.settledByShip = this;
            }
        }
        for(let i = 0; i < this.missileArray.length; i++){
            //if(!this.missileArray[i].update(progress)){
                //clog(this.missileArray);
                //this.missileArray.splice(i, 1);
            //}
            this.missileArray[i].update(progress);
            if(this.attackedTarget.boundaries.containsPoint(this.missileArray[i].pos)){
                console.log("truuuuuuu" + this.attackedTarget.id);
            }
        }
    }

    draw(ctx){
        if(!this.img_loaded || ctx===undefined){
            return;
        }
        
        ctx.save();
        ctx.translate(this.pos.x,this.pos.y);
        ctx.rotate(this.angle * Math.PI/180);
        ctx.translate(-this.pos.x,-this.pos.y);
        ctx.drawImage(this.img, this.imgPos.x, this.imgPos.y, this.dim.w*game.zoom, this.dim.h*game.zoom);
     
        ctx.restore();

        /*
        //Img and boundaries
        game.ctx.strokeStyle = "yellow";
        game.ctx.strokeRect(this.imgPosition.x,this.imgPosition.y, this.dim.w*game.zoom, this.dim.h*game.zoom);
        game.ctx.strokeStyle = "black";
        game.ctx.strokeRect(this.boundaries.pos.x, this.boundaries.pos.y, this.dim.w*game.zoom, this.dim.h*game.zoom);
        */

        //scope draw
        if(this.player.relation == ME){
            ctx.strokeStyle = "blue";
            ctx.fillStyle = "blue";
        }else if(this.player.relation == FRIEND){
            ctx.strokeStyle = "yellow";
            ctx.fillStyle = "yellow";
        }else if(this.player.relation == ENEMY){
            ctx.strokeStyle = "red";
            ctx.fillStyle = "red";
        }
        
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.scope, 0, 2 * Math.PI);
        ctx.fill();

        if(this.showHealth){
            let healthBarHeight = 5;
            let healthZoom = 0.5;
            ctx.fillStyle = "red";
            ctx.fillRect(this.pos.x-this.dim.w/(2/healthZoom),this.pos.y, this.maxHealth*healthZoom, healthBarHeight);
            ctx.fillStyle = "green";
            ctx.fillRect(this.pos.x-this.dim.w/(2/healthZoom),this.pos.y, this.health*healthZoom, healthBarHeight);
        }

        for(let i = 0; i < this.missileArray.length; i++){
            this.missileArray[i].draw(game.ctx);
            
        }

        if(this.showId){
            ctx.fillStyle = "rgb(50,255,50)";
            ctx.font = "20px Arial";
            ctx.fillText("ID: " + this.id, this.pos.x, this.pos.y);
        }
    }

    fire(missile_type){
        if(this.canFire){
            console.log("FIRING!");
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
            this.canFire = false;
            setTimeout(this.recharge, 2000, this);
        }else{
            console.log("CANNOT FIRE!");
        }
    }

    recharge(ship){
        ship.canFire=true;
    }

    moveTo(field){
        if(field.isSettled()){//are we fighting??
            //this.attackedTarget = field.settledByShip; // <-TOHLE JE BLBOST!
        }else{

        }
        this.temporaryTargetField = field;
        let t = new Triangle(this.pos, this.temporaryTargetField.centerPos);
        if(this.temporaryTargetField != this.field){
            this.angleTarget = t.angleA;
        }
        if(this.field != this.temporaryTargetField && this.field.settledByShip == this){
            this.moving = true;
            this.field.removeTargetShip();
        }
    }

    changeTargetAndMove(field){
        this.targetField = field;
        this.moveTo(field);

    }

    getImgPos(){
        return new Position(parseInt(this.pos.x - this.dim.w/2),parseInt(this.pos.y - this.dim.h/2));
    }
}

