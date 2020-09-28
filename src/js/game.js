const ARROW = 0;
const SWORD = 1;

lastRender = 0
game = null;


document.addEventListener("focus", this.onElementFocused, true);
function onElementFocused(e)
{
if (e && e.target)
    document.activeElement = e.target == document.body ? null : e.target;
    console.log("----");
    console.log(e.target);
    console.log(document.activeElement);
    console.log("....");
} 

function startGame() {
    game = new Game();
    game.start();
}

class Game{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.canvas.focus();
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext("2d");
        this.eventHandler = new GameEventHandler(canvas);
        this.selectionRect = new SelectionRectangle();
        this.fps = 0;
        this.player = new Player(ME);
        this.players = new Array();
        this.players.push(this.player);
        this.ships = new Array();
        this.selectedShips = new Array();
        this.cycleCounter = 0;
        this.zoom = 1;

        this.cursors = new Array();
        this.showCursor = true;
        this.cursorType = ARROW;
        this.imgsToLoad = 2;
        this.initImgs();

        this.fields = new Array();
        this.field_size = 100;
        this.fields_width = 20;
        this.fields_height = 200;
        this.initFields();

        this.resBar = new ResourcesBar(this.player);

    }

    initImgs(){
        let srcs = new Array("cursor.png", "sword.png");
        for(let i = 0; i < srcs.length; i++){
            let cursor = new Image();
            cursor.src = "img/" + srcs[i];
            cursor.onload = function(){
                game.imgsToLoad--;
            }
            this.cursors.push(cursor);
        }
        this.cursor = this.cursors[0];
    }
    
    initFields(){
        for(let i = 0; i < this.fields_width; i++){
            for(let j = 0; j < this.fields_height; j++){
                let x = i*this.field_size;
                let y = parseInt(j*this.field_size);
                let field = new Field(x, y, this.field_size);
                //clog(field);
                this.fields.push(field);
            }
        }
    }

    start(){
        let p2 = new Player(ENEMY);
        let p3 = new Player(FRIEND);
        this.players.push(p2);
        this.players.push(p3);
        this.ships.push(new Ship(250, 250, this.player));
        this.ships.push(new Ship(500, 50, this.player));
        this.ships.push(new Ship(400, 500, this.player));
        this.ships.push(new Ship(320, 300, p2));//a dal ma byt p2
        this.ships.push(new Ship(400, 100, p3));
        this.ships.push(new Ship(800, 400, this.player));
        window.requestAnimationFrame(this.loop);
    }

    update(progress) {
        if(this.cycleCounter % 10 == 0){
            this.fps = parseInt(1000/progress);
        }
        let i = 0;
        for(; i < this.ships.length; i++){
            this.ships[i].update(progress);
        }

        this.cycleCounter ++;
    }

    draw(){        
        if(this.imgsToLoad != 0){
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        for(let i = 0; i < this.fields.length; i++){
            this.fields[i].draw(this.ctx);
        }

        let f_size = 12;
        this.ctx.font=f_size + "px Verdana";        
        this.ctx.fillStyle = "red";
        this.ctx.fillText("FPS: " + parseInt(this.fps), 10, f_size);
        
        let i = 0;
        for(; i < this.ships.length; i++){
            this.ships[i].draw(this.ctx);
        }
        this.selectionRect.draw(this.ctx);
        
        if(this.showCursor){
            let curZoom = 2;    
            this.ctx.drawImage(this.cursors[this.cursorType], this.eventHandler.mouseX, this.eventHandler.mouseY, 80/curZoom, 80/curZoom); 
        }

        this.resBar.draw(this.ctx);
    }

    loop(timestamp) {
        var progress = timestamp - lastRender;
        
        game.update(progress);
        game.draw();
      
        lastRender = timestamp;
        window.requestAnimationFrame(game.loop);
    }
    getFieldFromPos(pos){   
        return this.getFieldFromXY(pos.x, pos.y);
    }

    getFieldFromXY(x,y){        
        //this.eventHandler.printMousePos();
        for(let i = 0; i < this.fields.length; i++){
            if(this.fields[i].boundaries.containsPoint(new Position(x,y))){
                return this.fields[i];
            }else{
                //this.fields[i].boundaries.printPos();
            }
        }
        return null;
    }

    selectAll(){
        for(let i = 0; i < this.ships.length; i++){
            if(this.ships[i].player.relation == ME){
                this.selectedShips.push(this.ships[i]);
            }
        }
        if(this.selectedShips.length > 0){
            for(let i = 0; i < this.selectedShips.length; i++ ){
                this.selectedShips[i].showHealth = true;
            }
        }
    }

    printSettledFieldsByMe(){
        for(let i = 0; i < this.fields.length; i++ ){
            if(this.fields[i].isSettled()){
                if(this.fields[i].settledByShip.player.relation != ME){
                    continue;
                }
                console.log("Ship: " + this.fields[i].settledByShip.id + ":");
                this.fields[i].printFieldShiftedXY();
            }
        }
    }
    //events
    rightClick(event) {
        let attackedTarget = null;
        //Are selected ships firing?
        for(let i = 0; i < this.ships.length; i++){
            if(this.ships[i].player.relation == ENEMY){
                if(this.selectedShips.length > 0 && this.ships[i].boundaries.containsPoint(new Position(this.eventHandler.mouseX, this.eventHandler.mouseY))){
                    attackedTarget = this.ships[i];
                }
            }
        }
        for(let i = 0; i < this.selectedShips.length; i++){
            //this.selectedShips[i].moveTo(this.getFieldFromXY(this.eventHandler.mouseX, this.eventHandler.mouseY));
            this.selectedShips[i].changeTargetAndMove(this.getFieldFromXY(this.eventHandler.mouseX, this.eventHandler.mouseY));
            if(this.cursorType == SWORD){
                this.selectedShips[i].attacking = true;
                this.selectedShips[i].attackedTarget = attackedTarget;
                attackedTarget.targetOfShipsArray.push(this.selectedShips[i]);
            }else{
                if(this.selectedShips[i].attackedTarget != null){
                    let index = this.selectedShips[i].attackedTarget.targetOfShipsArray.indexOf(this.selectedShips[i]);
                    if(index !== -1) {
                        this.selectedShips[i].attackedTarget.targetOfShipsArray.splice(index, 1);
                    }
                    this.selectedShips[i].attacking = false;
                    this.selectedShips[i].attackedTarget = null;
                }
            }
        }
    }

    leftClick(event) {      
        if(this.eventHandler.mouseDragged){
            this.eventHandler.mouseDragged = false;
            return;
        }  
        
        if(this.selectedShips.length > 0){
            this.selectedShips = [];
            for(let i = 0; i < this.ships.length; i++ ){
                this.ships[i].showHealth = false;
            }
        }
        for(let i = 0; i < this.ships.length; i++ ){
            if(this.ships[i].player.relation != ME){
                continue;
            }
            //this.selectedShips[i].moveTo(event.offsetX, event.offsetY);
            if(this.ships[i].boundaries.containsPoint(new Position(event.offsetX, event.offsetY))){
                if(this.selectedShips.length > 0){
                    return
                }else{
                    this.selectedShips.push(this.ships[i]);
                    this.ships[i].showHealth = true;
                }
            }
        }
    }

    mouseDown(event) {
        if(this.eventHandler.leftMouseBtnDown){
            this.selectedShips = [];
            for(let i = 0; i < this.ships.length; i++ ){
                this.ships[i].showHealth = false;
            }
            this.selectionRect.moveToXY(event.offsetX, event.offsetY);
            this.selectionRect.activate();
        }
    }
    
    mouseUp(event) {
        this.selectionRect.deactivate();
    }
    
    mouseDrag(event) {
        this.selectionRect.changeDimensions(event.offsetX, event.offsetY);
        if(this.selectedShips.length > 0){
            this.selectedShips = [];
            for(let i = 0; i < this.ships.length; i++ ){
                this.ships[i].showHealth = false;
            }
        }
        for(let i = 0; i < this.ships.length; i++ ){            
            if(this.ships[i].player.relation != ME){
                continue;
            }
            if(this.selectionRect.containsPoint(this.ships[i].pos, this.ships[i].dim)){
                if(!this.selectedShips.includes(this.ships[i])){
                    this.selectedShips.push(this.ships[i]);
                    this.ships[i].showHealth = true;
                }
            }
        }
    }
    
    mouseMove(event) {
        if(this.showCursor){
            this.eventHandler.mouseX = event.offsetX;
            this.eventHandler.mouseY = event.offsetY;
            this.cursorType = ARROW;
            for(let i = 0; i < this.ships.length; i++){
                if(this.ships[i].player.relation == ENEMY){
                    if(this.selectedShips.length > 0 && this.ships[i].boundaries.containsPoint(new Position(this.eventHandler.mouseX, this.eventHandler.mouseY))){
                        this.cursorType = SWORD;
                    }
                }
            }
        }else{

        }
    }
}

//TODO
/*
Zapojit do update progress
draw používat přes ctx (bez game.)

todo priority:
fullscreen btn
přesun po mapě

*/