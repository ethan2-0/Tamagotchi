/*
    Petengine.js: Handles pet updating and animation.
*/
PetEngine = function(user) {
    var stable = user.getStable()
    var activePetId = null
    var activePet = null
    var activePetData = {}

    var petListener = new function() {
        this.onProperty = function(src, pname, value, isNew) {
            try {
                activePetData[pname] = value
            } catch (e) {
                window.alert("PetEngine.petListener.onProperty " + e)
            }
        }
        this.onDeleted = function(src) {
            // TODO
        }
    }()
    var stableListener = new function() {
        this.onPetAdded = function(src, pet) {
            if (pet.getId() == activePetId) {
                if (activePet != null) {
                    activePet.removeListener(petListener)
                }
                activePet = pet
                pet.addListener(petListener)
            }
        }
        this.onPetRemoved = function(src, petId) {
        }
    }()
    var userListener = new function() {
        this.onProperty = function(src, pname, value, isNew) {
            try {
                if (pname == "activePet") {
                    activePetId = value
                    stable.removeListener(stableListener)
                    stable.addListener(stableListener)
                }
            } catch (e) {
                window.alert("PetEngine.userListener.onProperty " + e)
            }
        }
        this.onDeleted = function(src) {
            // TODO
        }
    }()
    user.addListener(userListener)

    sick = false;
    this.getSick = function() {
        return sick;
    }
    this.setSick = function(value) {
        sick = value;
    }
    this.changeThePet = function() {
        if (this.getItem("petHealth") == 0) {
            return
        }
    if(getItem("petHealth") > 0) {
        this.addItem("petAge", 1);
        age = this.getItem("petAge");
        if (age % 500 == 0) {
            hunger = this.getItem("petHunger");
            if (hunger < 40) {
                this.addItem("petHealth", -1);
            }
            if (hunger < 25) {
                this.addItem("petHealth", -1);
            }
            if (hunger < 15) {
                this.addItem("petHealth", -1);
            }
            if (hunger < 8) {
                this.addItem("petHealth", -1);
            }
            if (hunger > 70) {
                this.addItem("petHappiness", 2);
            }
            happiness = this.getItem("petHappiness");
            if (happiness < 40) {
                this.addItem("petHealth", -1);
            }
            if (happiness < 20) {
                this.addItem("petHealth", -1);
            }
            if (happiness < 10) {
                this.addItem("petHealth", -1);
            }
            if (happiness < 5) {
                this.addItem("petHealth", -1);
            }

            if (happiness > 70) {
                this.addItem("petHealth", 2);
            }
            if (this.getItem("petHealth") / 1 > 100) {
                activePetData["petHealth"] = 100;
            }
            health = this.getItem("petHealth");
            if (health < 40) {
                this.addItem("petHealth", -1);
                this.addItem("petHappiness", -2);
            }
            if (health < 15) {
                this.addItem("petHealth", -1);
                this.addItem("petHappiness", -2);
            }
            if (health < 8) {
                this.addItem("petHealth", -1);
                this.addItem("petHappiness", -2);
            }
            if (this.getItem("petHappiness") > 100) {
                activePetData["petHappiness"] = 100;
            }
            //Sickness
            //Edited on commit before overhaul, will cause conflict. --Ethan
            if(true/*randomInteger(500) <= numDroppings()*/) {
                sick = true;
            }
            if(sick) {
                this.addItem("petHealth", -1);
            }
        }
        if (age % 1000 == 0) {
            this.addItem("petHappiness", -1);
            this.addItem("petHunger", -1);
        }
        this.commit()
    }
    danceImage = null;
    x = 0;
    y = 0;
    direction = "left";
    directionTime = 5;
    speed = 2;
    this.dance = function(image) {
        danceImage = image;
        for(i = 0; i < 240; i++) {
            setTimeout(this.danceOnce, i * 20);
        }
        setTimeout(function() {
            danceImage.attr({style: ""});
            x = 0;
            y = 0;
        }, 241 * 20);
    }
    this.danceOnce = function() {
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
        danceImage.attr({style: s});
    }

    this.setItem = function(name, value) {
        activePetData[name] = value
    }

    this.addItem = function(name, amount) {
        // TODO: set
        activePetData[name] = (activePetData[name] / 1) + amount
    }

    this.commit = function() {
        if (activePet != null && activePetData != null) {
            activePet.update(activePetData)
        }
    }

    this.getItem = function(name) {
        return activePetData[name]
    }
}