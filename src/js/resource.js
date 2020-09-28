
class ResourcesBar{
    constructor(player = null){
        this.player = player;
        

        this.img = new Image();
        this.img_loaded = false;
        this.img.src = "img/res_bar.png";

        var bar = this
        this.img.onload = function() {
            bar.img_loaded = true;
            bar.draw();
        }
    }
    
    update(progress) {
        
    }

    draw(ctx){
        if(!this.img_loaded || ctx===undefined){
            return;
        }
        
        ctx.drawImage(this.img, 0, 0, game.canvas.width, this.img.height);
       
    }

   
}

