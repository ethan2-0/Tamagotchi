/*
    Petengine.js: Handles pet updating and animation.
*/
sick = false;
function getSick() {
    return sick;
}
function setSick(value) {
    sick = value;
}
function changeThePet() {
    if(getItem("petHealth") > 0) {
        addItem("petAge", 1);
        age = getItem("petAge");
        if(age % 500 == 0) {
            /*weight = getItem("weight");
            if(Math.abs(weight - 50) >= 10) {
                alert("weight");
                addItem("petHealth", -1);
            }
            if(Math.abs(weight - 50) >= 40) {
                addItem("petHealth", -1);
            }
            if(Math.abs(weight - 50) >= 25) {
                addItem("petHealth", -1);
            }*/
            hunger = getItem("petHunger");
            if(hunger < 40) {
                addItem("petHealth", -1);
            }
            if(hunger < 25) {
                addItem("petHealth", -1);
            }
            if(hunger < 15) {
                addItem("petHealth", -1);
            }
            if(hunger < 8) {
                addItem("petHealth", -1);
            }
            if(hunger > 70) {
                addItem("petHappiness", 2);
            }
            happiness = getItem("petHappiness");
            if(happiness < 40) {
                addItem("petHealth", -1);
            }
            if(happiness < 20) {
                addItem("petHealth", -1);
            }
            if(happiness < 10) {
                addItem("petHealth", -1);
            }
            if(happiness < 5) {
                addItem("petHealth", -1);
            }

            if(happiness > 70) {
                addItem("petHealth", 2);
            }
            if(getItem("petHealth") / 1 > 100) {
                localStorage.setItem("petHealth", 100);
            }
            health = getItem("petHealth");
            if(health < 40) {
                addItem("petHealth", -1);
                addItem("petHappiness", -2);
            }
            if(health < 15) {
                addItem("petHealth", -1);
                addItem("petHappiness", -2);
            }
            if(health < 8) {
                addItem("petHealth", -1);
                addItem("petHappiness", -2);
            }
            if(getItem("petHappiness") > 100) {
                localStorage.setItem("petHappiness", 100);
            }
            //Sickness
            //Edited on commit before overhaul, will cause conflict. --Ethan
            if(true/*randomInteger(500) <= numDroppings()*/) {
                sick = true;
            }
            if(sick) {
                addItem("petHealth", -1);
            }
        }
        if(age % 1000 == 0) {
            addItem("petHappiness", -1);
            addItem("petHunger", -1);
        }
    }
}
danceImage = null;
x = 0;
y = 0;
direction = "left";
directionTime = 5;
speed = 2;
function dance(image) {
    danceImage = image;
    for(i = 0; i < 240; i++) {
        setTimeout(danceOnce, i * 20);
    }
    setTimeout(function() {
        danceImage.setAttribute("style", "");
        x = 0;
        y = 0;
    }, 241 * 20);
}
function danceOnce() {
    directionTime--;
    if(directionTime <= 0) {
        r = Math.floor(Math.random() * 5);
        if(r == 1) {
            direction = "left";
        } else if(r == 2) {
            direction = "right";
        } else if(r == 3) {
            direction = "up";
        } else {
            direction = "down";
        }
        directionTime = Math.floor(Math.random() * 20);
        speed = Math.floor(directionTime / 4);
    }
    if(directionTime % 5 == 0) {
        speed--;
    }
    if(direction == "left") {
        x -= speed;
    } else if(direction == "right") {
        x += speed;
    } else if(direction == "up") {
        y -= speed;
    } else if(direction == "down") {
        y += speed;
    }
    s = "padding-";
    if(x <= 0) {
        s += "right";
    } else {
        s += "left";
    }
    s += ": " + Math.abs(x) + "px; padding-";
    if(y <= 0) {
        s += "bottom";
    } else {
        s += "top";
    }
    s += ": " + Math.abs(y) + "px;";
    danceImage.setAttribute("style", s);
}
//Add the specified amount to an item in localStorage.
function addItem(name, amount) {
    localStorage.setItem(name, (localStorage.getItem(name) / 1) + amount)
}
//Add the specified amount to an item in localStorage.
function getItem(name) {
    return localStorage.getItem(name);
}