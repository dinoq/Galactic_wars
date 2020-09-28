
class Ship{
    constructor(x, y, player = null){
        this.player = player;
        this.id = game.ships.length;
        this.showId = true;
        this.imgPos = new Position(x, y);
        this.dim = new Dimension(99, 98);
        this.pos = new Position(x + this.dim.w/2, y + this.dim.h/2);
        this.field = game.getFieldFromXY(this.pos.x, this.pos.y);        
        this.field.settledByShip = this;
        this.temporaryFieldTarget = this.field;
        this.fieldTarget = this.field;

        this.img = new Image();
        this.img_loaded = false;
        let img_src = "s3.png";//"ship.png";
        this.img.src = "img/" + img_src;

        this.angleTarget = 0;
        this.angle = 0;
        this.accelerationSpeed = 6;
        this.angleSpeed = 4;

        this.health = 90;
        this.maxHealth = 100;
        this.showHealth = false;
        this.boundaries = new GameRectangle(this.imgPos,this.dim);
        this.canFire = true;
        this.scope = 7;
        this.range = 300;
        this.attacking = false;
        this.attackedTarget = null;
        this.missileSpeed = 10;
        this.missileStrength = 5;
        
        this.moving = false;
        var ship_object = this;
        this.missileArray = new Array();

        this.targetOfShipsArray = new Array();

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
            this.rotateToTargetAngle(this.angleTarget, progress);
        }else if(!this.pos.equal(this.temporaryFieldTarget.centerPos)){//If not on right position...
            if(this.field.isNeighbor(this.temporaryFieldTarget)){//If close to right position
                if(this.temporaryFieldTarget.isSettled()){
                    this.moveTo(this.fieldTarget.findNearestField(this.field));
                }
            }
            
            this.pos = new Triangle(this.pos, this.temporaryFieldTarget.centerPos).getNewPosBySpeed(this.accelerationSpeed);
            this.imgPos = this.getImgPos();
            this.boundaries.moveToPos(this.imgPos);
            if(!this.field.shipStillOnField(this)){
                this.field = game.getFieldFromXY(this.pos.x, this.pos.y);
                //console.log(this.field.settledByShip);
                if(this.field == this.temporaryFieldTarget){
                    //console.log("hotovo" + this.field.pos.x + " "+this.field.pos.y+ " B" + this.field.settledByShip);
                    this.moving=false;
                    //console.log("settld?" + this.field.settledByShip);
                    this.field.settledByShip = this;
                    //asd
                }
            }

            if(this.pos.equal(this.temporaryFieldTarget.centerPos)){//position updated - so on exactly right position                        
                if(this.temporaryFieldTarget != this.fieldTarget){//set final rotation to target...
                    this.angleTarget = new Triangle(this.pos, this.fieldTarget.centerPos).angleA; 
                }

            }
            
        }else{
            if(this.id == 0){//only for testing
            }
            if(this.field.isSettled() && this.field.settledByShip != this){
                this.moveTo(this.fieldTarget.findNearestField(this.field));
                console.log("jsem na obsazenem a proto presmerovavam(" + this.id + "): ");
                this.fieldTarget.printFieldShiftedXY();
            }else{
                if(this.field.isEmpty()){
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
            if(this.attackedTarget != null && this.attackedTarget.boundaries.containsPoint(this.missileArray[i].pos)){
                this.attackedTarget.reduceHealth(this.missileArray[i].strength);
                this.missileArray.splice(i,1);
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

        if(this.showHealth || this.targetOfShipsArray.length > 0){
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

    reduceHealth(amount){
        this.health -= amount;
        if(this.health <= 0){
            game.ships.splice(this.id, 1);
            for(let i = 0; i < this.targetOfShipsArray.length; i++){
                this.targetOfShipsArray[i].attackedTarget = null;
                this.targetOfShipsArray[i].attacking = false;
            }
        }
    }

    fire(missile_type){
        if(this.canFire){
            //console.log("FIRING!");
            let missile = null;
            switch(missile_type){
                case BULLET:
                    missile = new Bullet(this.pos, this.missileSpeed,this.player, this.attackedTarget, this.missileStrength);
                    break;
                default:
                    missile = new Bullet(this.pos, this.missileSpeed,this.player, this.attackedTarget, this.missileStrength);
                    break;
            }
            
            this.missileArray.push(missile);
            this.canFire = false;
            setTimeout(this.recharge, 2000, this);
        }else{
            //console.log("CANNOT FIRE!");
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
        this.temporaryFieldTarget = field;
        let t = new Triangle(this.pos, this.temporaryFieldTarget.centerPos);
        if(this.temporaryFieldTarget != this.field){
            this.angleTarget = t.angleA;
        }else{//otaceni na miste pokud se zastavi a klikne se na vedlejsi obsazene misto
        }
        if(this.field != this.temporaryFieldTarget && this.field.settledByShip == this){
            this.moving = true;
            this.field.removeTargetShip();
        }
    }

    changeTargetAndMove(field){
        this.fieldTarget = field;
        this.moveTo(field);

    }

    rotateToTargetAngle(angleTarg, progress){
        let direction = -1;
        let fullangle = false;
        if(angleTarg > this.angle){  
            if((angleTarg - this.angle) < (360 - angleTarg + this.angle)){
                direction = 1;
            }else{
                direction = -1;
            }
        }else{
            if((this.angle - angleTarg) < (360 - this.angle + angleTarg)){
                direction = -1;
            }else{
                direction = 1;
            }
        }

        if(direction == 1){
            if(angleTarg > this.angle){
                if(this.angle + this.angleSpeed < angleTarg){
                    fullangle = true;
                }
            }else{
                if(-360 + this.angle + this.angleSpeed < angleTarg){
                    fullangle = true;
                }
            }
        }else{
            if(angleTarg > this.angle){
                if(360 + this.angle - this.angleSpeed > angleTarg){
                    fullangle = true;
                }
            }else{
                if(this.angle - this.angleSpeed > angleTarg){
                    fullangle = true;
                }
            }
        }
        if(fullangle){
            this.angle += (direction * this.angleSpeed);
        }else{
            this.angle = angleTarg;
            //console.log("NOTfull angle");
        }
        
        if(this.angle > 360){
            this.angle = this.angle % 360;
        }

    }
    
    getImgPos(){
        return new Position(parseInt(this.pos.x - this.dim.w/2),parseInt(this.pos.y - this.dim.h/2));
    }
}

