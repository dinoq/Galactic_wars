

lastRender = 0
game = null;


function startGame() {
    game = new Game();
    game.start();
}

class Game{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.fps = 0;
    }

    start(){
        window.requestAnimationFrame(this.loop);
    }

    update(progress) {
        this.fps = 1000/progress;

    }

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(50,50,80,150);

        let f_size = 12;
        this.ctx.font=f_size + "px Verdana";
        this.ctx.fillText("FPS: " + parseInt(this.fps), 10, f_size);

    }
    loop(timestamp) {
        var progress = timestamp - lastRender;
        
        game.update(progress);
        game.draw();
      
        lastRender = timestamp;
        window.requestAnimationFrame(game.loop);
      }
}


class soldier{
    constructor(){

    }
    
    update(progress) {
    
    }

    draw(){
    
    }
}




class skeletonClass{
    constructor(){

    }
    
    update(progress) {
    
    }

    draw(){
    
    }
}