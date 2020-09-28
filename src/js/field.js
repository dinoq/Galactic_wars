
class Field{
    constructor(x=0, y=0, size=100){
        this.pos = new Position(x, y);
        this.dim = new Dimension(size, size);
        this.centerPos = new Position(x + size/2, y + size/2);
        this.boundaries = new GameRectangle(this.pos, this.dim);
        this.settledByShip = null;
        this.size = size;
        this.showXY = true;
        
       //clog(this.pos.x, this.pos.y, y);
    }
    
    update(progress) {
       
    }

    draw(ctx){
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(this.pos.x, this.pos.y, this.dim.w, this.dim.h);
        if(this.showXY){
            ctx.fillStyle = "rgb(80,80,80)";
            ctx.fillText(this.getFieldShiftedX() + ", " + this.getFieldShiftedY(),this.centerPos.x, this.centerPos.y);
        }
    }

    isSettled(){
        return (this.settledByShip != null);
    }

    isEmpty(){
        return !this.isSettled();
    }

    getShip(){
        return this.settledByShip;
    }

    removeTargetShip(){
        this.settledByShip = null;
    }

    getFieldDistance(field){
        let a = this.pos.x - field.pos.x;
        let b = this.pos.y - field.pos.y;
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    }
    findNearestField(fromField){//ZEFEKTIVNIT!! Ted se prepocitava znovu pri zvetseni okruhu (prvniho for)
        let emptyFieldsArray = new Array();
        let nearestField = null;
        let minDistance = -1;
        for(let size = 3; nearestField == null; size +=2){
            //console.log("cyclus size: " + size);
            for(let i = 0; i < size; i++){
                for(let j = 0; j < size; j++){
                    let tmp_field = game.getFieldFromXY(this.centerPos.x+(1-i)*this.size, this.centerPos.y+(1-j)*this.size);
                    if((i == (size-1)/2 && j == (size-1)/2) || tmp_field == null){
                        continue;
                    }
                    if(tmp_field.isEmpty()){
                        emptyFieldsArray.push(tmp_field)
                        let dist = tmp_field.getFieldDistance(fromField);
                        if(minDistance == -1 || dist < minDistance){
                            minDistance = dist;
                            nearestField = tmp_field;
                        }
                        //console.log(minDistance);
                    }
                }
            }
        }
        //console.log(emptyFieldsArray.length);
        //console.log("null?:" + nearestField);
        return nearestField;
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

    getFieldX(){
        return this.pos.x / this.size;
    }

    getFieldY(){
        return this.pos.y / this.size;
    }

    printFieldXY(){
        console.log("FIELD X,Y: " + this.getFieldX() + ", " + this.getFieldY());
    }

    getFieldShiftedX(){
        return (this.pos.x / this.size) + 1;
    }

    getFieldShiftedY(){
        return (this.pos.y / this.size) + 1;
    }

    printFieldShiftedXY(){
        console.log("FIELD SHIFTED X,Y: " + this.getFieldShiftedX() + ", " + this.getFieldShiftedY());
    }
}

