class Position{
    constructor(x = 0, y = 0, position = null){
        if(position == null){
            this.x = x;
            this.y = y;
        }else{                
            this.x = position.x;
            this.y = position.y;
        }
    }

    moveX(amount){
        this.x += amount;
    }

    moveY(amount){
        this.y += amount;
    }

    printPos(){
        console.log("PosXY: " + this.x + ", " + this.y)
    }

    equal(pos){
        if(this.x == pos.x && this.y == pos.y){
            return true;
        }
        return false;
    }

    getCopyOfPos(){
        return new Position(this.x, this.y);
    }
}


class Dimension{
    constructor(w = 0, h = 0, dimension = null){
        if(dimension == null){
            this.w = w;
            this.h = h;
        }else{                
            this.w = dimension.w;
            this.h = dimension.h;
        }
    }
}

class Triangle{
    constructor(pos1, pos2){
        this.pos1 = pos1;
        this.pos2 = pos2;
        this.slope = -(pos2.y-pos1.y)/(pos2.x-pos1.x);
        //clog("slope: ", this.slope);
        this.sideA = pos1.y - pos2.y;
        this.sideC = pos2.x - pos1.x;
        if(this.sideC == 0){
            this.sideB = 0;
            this.cosA = 0;
        }else{
            this.sideB = Math.sqrt(Math.pow(this.sideA, 2) + Math.pow(this.sideC, 2));
            this.cosA = (Math.pow(this.sideB, 2) + Math.pow(this.sideC, 2) - Math.pow(this.sideA, 2))/(2 * this.sideB * this.sideC); 
        }

        let start = 0;
        this.angleA = 0;

        if(this.sideA == 0 || this.sideC == 0){
            if(this.sideA == 0 && this.sideC>0){
                this.angleA = 90;
            }else if(this.sideA == 0 && this.sideC<0){
                this.angleA = 270;
            }else if(this.sideC == 0 && this.sideA>0){
                this.angleA = 0;
                this.sideB = this.sideA;
            }else if(this.sideC == 0 && this.sideA<0){
                this.angleA = 180;
                this.sideB = this.sideA;
            }else{
                //console.log("sideA(0): " + this.sideA + ", sideC(0): " + this.sideC);
            }
            
        }else if(this.sideA > 0 && this.sideC > 0){
            this.angleA = 90 - parseInt(Math.acos(this.cosA) * 180/Math.PI);
        }else if(this.sideA < 0 && this.sideC > 0){
            this.angleA = 180- (90 - parseInt(Math.acos(this.cosA) * 180/Math.PI));   
        }else if(this.sideA < 0 && this.sideC < 0){
            this.angleA = 180 - (90 - parseInt(Math.acos(this.cosA) * 180/Math.PI));
        }else if(this.sideA > 0 && this.sideC < 0){
            this.angleA = 180+ 180 + (90 - parseInt(Math.acos(this.cosA) * 180/Math.PI));
        }else{
            console.log("?!?!?!?!?!?!?!?!?!?!?!?!?!?!?!?");
        }
        
    }

    distanceBetweenPositions(){
        return this.sideB;
    }

    goDown(){
        return (this.angleA == 180);
    }

    getNewPosBySpeed(speed){
        if((this.sideB > speed) || (this.angleA == 180 && this.sideB < speed)){
            let newPos = null;
            let newX = 0;
            let newY = 0;
            
            if(this.sideA > 0 && this.sideC > 0){
                newX = this.pos1.x+speed * (this.sideC/this.sideB);
                newY = this.pos1.y - (this.slope * (newX-this.pos1.x));
                newPos = new Position(newX,newY); //y:this.pos1.y-speed * this.slope
            }else if(this.sideA < 0 && this.sideC > 0){
                newX = this.pos1.x+speed * (this.sideC/this.sideB);
                newY = this.pos1.y - (this.slope * (newX-this.pos1.x));
            }else{
                newX = this.pos1.x+speed * (this.sideC/this.sideB);
                if(isFinite(this.slope)){
                    newY = this.pos1.y - (this.slope * (newX-this.pos1.x));
                }else{
                    if(this.angleA == 180){//when going down, strange behaviour
                        newY = this.pos1.y + speed;
                    }else{
                        newY = this.pos1.y - speed;
                    }
                }
                //newPos = new Position(this.pos1.x+speed * (this.sideC/this.sideB),this.pos1.y+speed * this.slope);
            }            
            newPos = new Position(newX,newY);
            return newPos;
        }else{
            return this.pos2;
        }
    }

    draw(ctx){        
        ctx.beginPath();
        ctx.moveTo(this.pos1.x, this.pos1.y);
        ctx.lineTo(this.pos2.x, this.pos2.y);
        ctx.lineTo(this.pos2.x, this.pos1.y);
        ctx.lineTo(this.pos1.x, this.pos1.y);
        ctx.stroke();
    }
}

class GameRectangle{
    constructor(pos, dim){
        this.pos = pos;
        this.dimension = dim;
    }

    printPos(){
        clog("rect_pos:", this.pos.x, this.pos.y);
    }
    
    moveToXY(x,y){
        this.pos = new Position(x,y);
    }

    moveToPos(pos){
        this.pos = pos;
    }

    changeDimensions(x, y){
        this.dimension = new Dimension(x-this.pos.x, y-this.pos.y);
    }

    containsXY(x,y){

    }

    containsPoint(pos){
        //clog(this.pos.x,this.pos.y,pos.x,pos.y);
        let tmp_pos = null;
        let tmp_dim = null;
        if(this.dimension.w == 0 || this.dimension.h == 0){
            return false;
        }
        if(this.dimension.w > 0 && this.dimension.h > 0){
            tmp_pos = this.pos;
            tmp_dim = this.dimension;
        }
        if(this.dimension.w < 0 && this.dimension.h > 0){
            tmp_pos = new Position(this.pos.x + this.dimension.w, this.pos.y);
            tmp_dim = new Dimension(Math.abs(this.dimension.w),Math.abs(this.dimension.h));
        }
        if(this.dimension.w > 0 && this.dimension.h < 0){
            tmp_pos = new Position(this.pos.x, this.pos.y + this.dimension.h);
            tmp_dim = new Dimension(Math.abs(this.dimension.w),Math.abs(this.dimension.h));
        }
        if(this.dimension.w < 0 && this.dimension.h < 0){
            tmp_pos = new Position(this.pos.x + this.dimension.w, this.pos.y + this.dimension.h);
            tmp_dim = new Dimension(Math.abs(this.dimension.w),Math.abs(this.dimension.h));
        }

        if((pos.x >= tmp_pos.x && pos.x <= tmp_pos.x + tmp_dim.w)
        && (pos.y >= tmp_pos.y && pos.y <= tmp_pos.y + tmp_dim.h)){
            return true;
        }
    }
}

class SelectionRectangle extends GameRectangle{
    constructor(){
        super(new Position(0,0), new Dimension(0,0));
        this.stroke = new DrawedRectangle("rgb(250,250,250)", "stroke");
        this.fill = new DrawedRectangle("rgba(50,250,50, 0.1)", "fill");
        this.active = false;
    }

    draw(ctx){
        if(!this.active){
            return;
        }
        this.fill.drawRect(ctx);
        this.stroke.drawRect(ctx);
    }

    moveToXY(x,y){
        super.moveToXY(x,y);
        this.stroke.pos = this.pos;
        this.fill.pos = this.pos;
    }

    changeDimensions(x, y){
        super.changeDimensions(x, y);
        this.stroke.dimension = this.dimension;
        this.fill.dimension = this.dimension;
    }

    activate(){
        this.active = true;
    }

    deactivate(){
        this.active = false;
        this.stroke.pos = new Position(0,0);
        this.fill.pos = this.stroke.pos;
        this.stroke.dimension = new Dimension(0,0);
        this.fill.dimension = new Dimension(0,0);
    }
}


class DrawedRectangle{
    constructor(color, type){
        this.pos = new Position(0, 0);
        this.dimension = new Dimension(0, 0);
        this.color = color;
        this.type = type;
    }

    drawRect(ctx){
        if(this.type == "stroke"){ 
            //clog(this.pos.x, this.pos.y, this.dimension.w, this.dimension.h);           
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.pos.x, this.pos.y, this.dimension.w, this.dimension.h);
        }else{
            ctx.fillStyle = this.color;
            ctx.fillRect(this.pos.x, this.pos.y, this.dimension.w, this.dimension.h);
        }
    }
}


/*
x1 = 2;
y1 = 8;
x2=8;
y2=10;
c=0;
c=0-((y1-y2)*x2+(x2-x1)*y2);
document.write(c+"<br>");
vysl = (y2-y1)/(x2-x1);

document.write(vysl+"x+"+(-c/(x2-x1)));*/