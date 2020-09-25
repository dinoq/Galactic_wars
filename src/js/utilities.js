//Other classess
function clog(str1, str2 = "", str3 = "", str4 = ""){
    str = str1;
    if(str2 != ""){
        str += (" " + str2);
    }
    if(str3 != ""){
        str += (" " + str3);
    }
    if(str4 != ""){
        str += (" " + str4);
    }
    
    console.log(str);
}


function prnt(str1, str2 = "", str3 = ""){
    str = str1;
    if(str2 != ""){
        str += (" " + str2);
    }
    if(str3 != ""){
        str += "(" + str3 + ")";
    }
    
    console.log(str);
}


class skeletonClass{
    constructor(){

    }
    
    update(progress) {
    
    }

    draw(){
    
    }
}