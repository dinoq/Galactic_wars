

class GameEventHandler{
    constructor(canvas){
        canvas.addEventListener("click", this.leftClick);
        canvas.addEventListener('contextmenu', this.rightClick);
        canvas.addEventListener('mousedown', this.mouseDown);
        canvas.addEventListener('mouseup', this.mouseUp);
        canvas.addEventListener('mousemove', this.mouseMove);
        document.body.addEventListener("keydown", this.keyDown);

        this.leftMouseBtnDown = false;
        this.rightMouseBtnDown = false;
        this.mouseDragged = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    leftClick(event) {
        //prnt(event.offsetX, event.offsetY);
        game.leftClick(event);
    }
    rightClick(event) {
        event.preventDefault();
        //console.log("right: "+event.offsetX);
        game.rightClick(event);
        return false;
    }
    mouseDown(event) {
        if(event.button == 0){
            game.eventHandler.leftMouseBtnDown = true;
        }
        if(event.button == 2){
            game.eventHandler.rightMouseBtnDown = true;
        }
        game.mouseDown(event);
    }
    mouseUp(event) {
        if(event.button == 0){
            game.eventHandler.leftMouseBtnDown = false;
        }
        if(event.button == 2){
            game.eventHandler.rightMouseBtnDown = false;
        }
        game.mouseUp(event);        
        game.showCursor = true;
        //game.eventHandler.mouseDragged = false;
    }
      
    mouseMove(event) {
        if(game.eventHandler.leftMouseBtnDown){
            game.eventHandler.mouseDragged = true;
            game.showCursor = false;
            game.mouseDrag(event);
        }else{
            game.mouseMove(event);
        }
    }
      
    keyDown(event) {
        if(event.code == "KeyA"){
            game.selectAll();
        }else{
            console.log(event.code);
        }
    }

    printMousePos(){
        clog("mouse_pos: ", this.mouseX, this.mouseY);
    }
}