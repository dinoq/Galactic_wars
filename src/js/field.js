
class Field{
    constructor(x=0, y=0, size=100){
        this.pos = new Position(x, y);
        this.dim = new Dimension(size, size);
        this.centerPos = new Position(x + size/2, y + size/2);
        this.boundaries = new GameRectangle(this.pos, this.dim);
        this.settledByShip = null;
        this.size = size;
        
       //clog(this.pos.x, this.pos.y, y);
    }
    
    update(progress) {
       
    }

    draw(ctx){
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
    }

    isSettled(){
        return (this.settledByShip != null);
    }

    getShip(){
        return this.settledByShip;
    }

    removeTargetShip(){
        this.settledByShip = null;
    }

    findNearestFiedlPos(angle){
        let x = 0;
        let y = 0;
        
        if(angle < 45){
            x = 0;
            y = 1;
        }else if(angle < 90){
            x = -1;
            y = 1;
        }else if(angle < 135){
            x = -1;
            y = 0;
        }else if(angle < 180){
            x = -1;
            y = -1;
        }else if(angle < 225){
            x = 0;
            y = -1;
        }else if(angle < 270){
            x = 1;
            y = -1;
        }else if(angle < 315){
            x = 1;
            y = 0;
        }else if(angle <= 360){
            x = 1;
            y = 1;
        }
        
        return new Position(this.centerPos.x + x*this.size,this.centerPos.y + y*this.size);

    }

    shipStillOnField(ship){
        if(this.boundaries.containsPoint(ship.pos)){
            return true;
        }
        return false;
    }

    isNeighbor(field){
        let x = 0;
        let y = 0;
        //x
        if((this.centerPos.x - this.size) == field.centerPos.x){
            x = 1;
        }else if(this.centerPos.x == field.centerPos.x){
            x = 2;
        }else if((this.centerPos.x + this.size) == field.centerPos.x){
            x = 3;
        }else{
            x = 4;
        }
        //y
        if((this.centerPos.y - this.size) == field.centerPos.y){
            y = 1;
        }else if(this.centerPos.y == field.centerPos.y){
            y = 2;
        }else if((this.centerPos.y + this.size) == field.centerPos.y){
            y = 3;
        }else{
            y = 4;
        }
        
        if((x == 2 && y == 2) || (x == 4) || (y == 4)){
            return false;
        }
        return true;
    }

}

