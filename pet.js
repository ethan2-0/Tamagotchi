PetRenderingEngine = function(page, pet) {
    thiz = this
    this.isForeground = false
    this.lastVisited = null

    this.getItem = function(name) {
        return petData[name]
    }

    this.setItem = function(name, value) {
        petData[name] = value
    }

    this.addItem = function(name, amount) {
        // TODO: set
        var old = petData[name]
        if (old == null) {
            old = 0
        }
        petData[name] = (old / 1) + amount
    }

    this.commit = function() {
        if (pet != null) {
            pet.update(petData)
        }
    }

    this.foreground = function() {
        this.isForeground = true
        var toTick = 1
        if (this.lastVisited != null) {
            toTick = (new Date().getTime() - this.lastVisited) / 1000
        }
        // Foregroundable
        setTimeout(renderingTick, 100);
        // Foregroundable
        setTimeout(function() {tick(toTick)}, 1000);
    }

    this.background = function() {
        this.isForeground = false
        this.setItem("lastVisited", new Date().getTime())
        this.commit()
    }

    var petData = {}
    var petListener = new function() {
        this.onProperty = function(src, pname, value, isNew) {
            petData[pname] = value
            if (pname == "petHealth") {
                $(page).find("#pet-image").attr({"class": "pet-image " + getHappiness()});
                updateProgressBar($(page).find("#health-bar")[0], value);
            } else if (pname == "petHunger") {
                updateProgressBar($(page).find("#hunger-bar")[0], value);
            } else if (pname == "petHappiness") {
                $(page).find("#pet-image").attr({"class": "pet-image " + getHappiness()});
                updateProgressBar($(page).find("#happiness-bar")[0], value);
            } else if (pname == "petWeight") {
                updateProgressBar($(page).find("#weight-bar")[0], value, "black");
            } else if (pname == "petAge") {
                $(page).find("#pet-age").innerHTML = value;
            } else if (pname == "lastVisited") {
                thiz.lastVisited = value;
            }
        }
        this.onDeleted = function(src) {
            // TODO
        }
    }()
    pet.addListener(petListener)

    danceEngine = new PetDanceEngine()

    //Define food items
    foodItems = new Object;
    foodItemList = new Array();


    foodItems.chocolateBar = new Object;
    foodItems.chocolateBar.happiness = 5;
    foodItems.chocolateBar.weight = 15;
    foodItems.chocolateBar.hunger = 8;
    foodItems.chocolateBar.image = "images/chocolateBar.png";
    foodItems.chocolateBar.displayName = "Chocolate Bar";
    foodItems.chocolateBar.name = "chocolateBar";
    foodItemList[0] = foodItems.chocolateBar;

    foodItems.steak = new Object;
    foodItems.steak.happiness = 0;
    foodItems.steak.weight = 4;
    foodItems.steak.hunger = 15;
    foodItems.steak.image = "images/steak.png";
    foodItems.steak.displayName = "Steak";
    foodItems.steak.name = "steak";
    foodItemList[1] = foodItems.steak;

    particleList = new Array();

    petDisplayNumber = 0;
    this.populateFoodImage = function(item) {
        var img = $("<img></img>")
            .attr({src: item.image})
            .attr({id: "food-item-" + item.name})
            .click(function() {
                selectFoodItem(item.name)
            })
        $(page).find("#food-section").append(img)
    }
    this.foodTimeout = 0;
    //Note that particles only work in the area above the bars, etc. This is to fix issue #1. See the docs for this page for more info.
    function Particle(color, size, gravity, x, y, type, permanent) {
        if(permanent == null) {
            permanent = false;
        }
        this.size = size;
        this.color = color;
        this.gravity = gravity;
        this.left = x;
        this.top = y;
        this.ticksLived = 0;
        this.permanent = permanent;
        this.type = type;
        //Add functions
        this.draw = function() {
            canvas = $(page).find("#pet-canvas")[0];
            context = canvas.getContext("2d");
            /*context.fillStyle = this.color;
            context.fillRect(this.left, this.top, this.size, size);*/
            context.beginPath();
            context.arc(this.left, this.top, this.size, 0, 2 * Math.PI, false);
            context.fillStyle = this.color;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = this.color;
            context.stroke();
        };
        this.update = function() {
            this.top += this.gravity;
            this.draw();
            this.ticksLived++;
            if(this.ticksLived > 20 && !this.permanent) {
                this.destroy();
            }
        };
        this.destroy = function() {
            index = particleList.indexOf(this);
            particleList.splice(index, 1);
        }
        //Add to the particle list
        particleList.push(this);
    }
    function createDropping() {
        //Select position
        x = randomInteger(window.innerWidth);
        y = randomInteger(250) + 50;
        p = new Particle("#a52a2a", 30, 0, x, y, "dropping", true);
    }
    function randomInteger(max) {
        return Math.floor(Math.random() * max)
    }
    function numDroppings() {
        num = 0;
        for(i = 0; i < particleList.length; i++) {
            if(particleList[i].type == "dropping") {
                num++;
            }
        }
        return num;
    }
    sick = false;
    this.getSick = function() {
        return sick;
    }
    this.setSick = function(value) {
        sick = value;
    }
    this.changeThePet = function(totalTicks) {
        if (this.getItem("petHealth") == 0) {
            return
        }
        if(this.getItem("petHealth") > 0) {
            this.addItem("petAge", 1);
            age = this.getItem("petAge");
            if (age % 500 == 0) {
                hunger = this.getItem("petHunger");
                if (hunger < 40) {
                    this.addItem("petHealth", -totalTicks);
                }
                if (hunger < 25) {
                    this.addItem("petHealth", -totalTicks);
                }
                if (hunger < 15) {
                    this.addItem("petHealth", -totalTicks);
                }
                if (hunger < 8) {
                    this.addItem("petHealth", -totalTicks);
                }
                if (hunger > 70) {
                    this.addItem("petHappiness", totalTicks * 2);
                }
                happiness = this.getItem("petHappiness");
                if (happiness < 40) {
                    this.addItem("petHealth", -totalTicks);
                }
                if (happiness < 20) {
                    this.addItem("petHealth", -totalTicks);
                }
                if (happiness < 10) {
                    this.addItem("petHealth", -totalTicks);
                }
                if (happiness < 5) {
                    this.addItem("petHealth", -totalTicks);
                }

                if (happiness > 70) {
                    this.addItem("petHealth", totalTicks * 2);
                }
                if (this.getItem("petHealth") / 1 > 100) {
                    this.setItem("petHealth", 100);
                }
                health = this.getItem("petHealth");
                if (health < 40) {
                    this.addItem("petHealth", -totalTicks);
                    this.addItem("petHappiness", -totalTicks * 2);
                }
                if (health < 15) {
                    this.addItem("petHealth", -totalTicks);
                    this.addItem("petHappiness", -totalTicks * 2);
                }
                if (health < 8) {
                    this.addItem("petHealth", -totalTicks);
                    this.addItem("petHappiness", -totalTicks * 2);
                }
                if (this.getItem("petHappiness") > 100) {
                    this.setItem("petHappiness", 100);
                }
                //Sickness
                //Edited on commit before overhaul, will cause conflict. --Ethan
                //if(randomInteger(500) <= numDroppings()) {
                if(true) {
                    sick = true;
                }
                if(sick) {
                    this.addItem("petHealth", -totalTicks);
                }
            }
            if (age % 1000 == 0) {
                this.addItem("petHappiness", -totalTicks);
                this.addItem("petHunger", -totalTicks);
            }
            this.commit()
        }
    }
    //Occurs when a food item is clicked on the page.
    function selectFoodItem(name) {
        var foodItemEl = $(page).find("#food-item-" + name)[0]
        if(foodItemEl.getAttribute("style") == "" || foodItemEl.getAttribute("style") == null) {
            if (thiz.foodTimeout <= 0) {
                foodItemEl.setAttribute("style", "background-color: black;");
            } else {
                foodItemEl.setAttribute("style", "background-color: red;");
                thiz.setPetError("Please wait " + thiz.foodTimeout + " seconds.");
                setTimeout(function() {
                    foodItemEl.setAttribute("style", "");
                }, 100);
                return;
            }
            foodItem = null;
            for(i = 0; i < foodItemList.length; i++) {
                if(foodItemList[i].name == name) {
                    foodItem = foodItemList[i];
                }
            }
            feedPet(foodItem);
            thiz.foodTimeout = 10;
            setTimeout(function() {
                foodItemEl.setAttribute("style", "");
            }, 100);
        }
    }
    //F_C feedPet
    function feedPet(item) {
        //throw ((getItem("petWeight") / 1) + item.weight);
        if((thiz.getItem("petWeight") / 1) + item.weight > 100) {
            thiz.setItem("petWeight", 100);
            thiz.addItem("petHealth", -(Math.floor(item.weight / 2)));
        } else {
            thiz.addItem("petWeight", item.weight + 0);
            thiz.addItem("petHealth", -(Math.floor(item.weight / 2)));
        }
        if((thiz.getItem("petHunger") / 1) + item.hunger > 100) {
            thiz.setItem("petHunger", 100);
        } else {
            thiz.addItem("petHunger", item.hunger);
        }
        if((thiz.getItem("petHappiness") / 1) + item.happiness > 100) {
            thiz.setItem("petHappiness", 100);
        } else {
            thiz.addItem("petHappiness", item.happiness);
        }
        thiz.commit()
    }
    errorWillBeCleared = false;
    this.setPetError = function(error) {
        $(page).find("#error-message-pet").innerHTML = error;
        errorWillBeCleared = true;
        setTimeout(function() {
            //Clear it after some time
            if(errorWillBeCleared) {
                $(page).find("#error-message-pet").innerHTML = "";
                errorWillBeCleared = false;
            } else {
                return;
            }
        }, 2000);
    }
    //Populate the food images
    // TODO: should only be called on pet page
    //populateFoodImage(foodItems.chocolateBar);
    //populateFoodImage(foodItems.steak);

    //Gets the class corresponding to the happiness "happiness" and health "health". Note that health is used just for the dead face.
    function getHappiness(happiness, health) {
        if(happiness == null) {
            happiness = thiz.getItem("petHappiness");
        }
        if(health == null) {
            health = thiz.getItem("petHealth");
        }
        if(health < 5) {
            return "dead";
        }
        if(happiness < 33) {
            return "unhappy"
        }
        if(happiness < 66) {
            return "undecided"
        }
        return "happy";
    }
    this.doDance = function() {
        $(page).find("#other-petpage-stuff").attr({"style": "visibility: hidden;"});
        danceEngine.dance($(page).find("#pet-wrapper"));
        setTimeout(function() {
            $(page).find("#other-petpage-stuff").attr({"style": ""});
        }, 241 * 20);
    }
    function populatePetDisplay(display, name, happiness, health) {
        if(health == null) {
            health = thiz.getItem("petHealth");
        }
        if(happiness == null) {
            happiness = thiz.getItem("petHappiness");
        }
        s =  '<table><tr>';
        s += '    <td class="pet-display-item"><div class="pet-image ' + getHappiness(happiness, health) + '"></div></td>\n'
        s += '    <td class="pet-display-item"><div class="pet-display-name title">' + name + '</div></td>';
        s += '</tr></table>';
        display.innerHTML = s;
    }
    this.resizeCanvas = function() {
        canvas = $(page).find("#pet-canvas")[0];
        canvas.width = window.innerWidth;
        //To fix issue #1, this has been changed from the following line to how it is now:
        //canvas.height = window.innerHeight;
        canvas.height = 325;
    }
    function tick(totalTicks) {
        if (!thiz.isForeground) {
            return
        }
        if (totalTicks == null) {
            totalTicks = 1
        }
        //alert(document.getElementById("health-bar"));
        //alert(App.getStack()[App.getStack().length - 1]);
        if(thiz.foodTimeout > 0) {
            thiz.foodTimeout--;
        }
        thiz.changeThePet(totalTicks);
        setTimeout(tick, 1000);
        if(randomInteger(1000) > 998) {
            createDropping();
        }
    }
    function renderingTick() {
        if (!thiz.isForeground) {
            return
        }
        setTimeout(renderingTick, 100);
        //Particles
        canvas = $(page).find("#pet-canvas")[0];
        if (canvas == null) {
            return
        }
        context = canvas.getContext("2d");
        context.clearRect("0", "0", "1920", "1080"); //1920X1080 is overkill, but it won't be in the future :)
        for(i = 0; i < particleList.length; i++) {
            particleList[i].update();
        }
        //Updating the exercise page
        if(getPageName() == "exercise-page") {
            $(page).find("#pet-image-exercise").attr({"class": "pet-image " + getHappiness()});
        }
    };
    petScratches = 0;
    this.scratchPet = function(evt) {
        petScratches++;
        touch = evt.originalEvent.changedTouches[0];
        for(i = 0; i < particleList.length; i++) {
            particle = particleList[i];
            if(particle.type == "dropping") {
                x = touch.clientX;
                y = touch.clientY;
                if((x > particle.left - particle.size) && (x - (particle.left - particle.size) < particle.size * 2)) {
                    if((y > particle.top - particle.size) && (y - (particle.top - particle.size) < particle.size * 2)) {
                        particle.destroy();
                    }
                }
            }
        }
        if(petScratches % 8 == 0) {
            boundingRect = $(page).find("#pet-image")[0].getBoundingClientRect();
            if((touch.clientX - boundingRect.left < 128 && touch.clientX - boundingRect.left > 0) &&
                (touch.clientY - boundingRect.top < 128 && touch.clientY - boundingRect.top > 0)) {
                p = new Particle("#464646", 2, 1, touch.clientX, touch.clientY, "scratch");
                if(petScratches % 32 == 0) {
                    var xx = this.getItem("petHappiness") / 1
                    if (xx < 100) {
                        this.addItem("petHappiness", 1);
                        this.commit()
                    }
                }
            }
        }
    }
    this.populateFoodImage(foodItems.chocolateBar);
    this.populateFoodImage(foodItems.steak);
}

PetExerciseEngine = function(page) {
    jumpMomentum = 0;
    jumpY = 100;
    this.doJump = function() {
        for(i = 0; i < 300; i++) {
            setTimeout(jumpOnce, 200 + (i * 20));
        }
        //EbyID("petname").innerHTML = "hi";
    }
    function jumpOnce() {
        //EbyID("petname").innerHTML = "hi2";
        //EbyID("petname").innerHTML = jumpY;
        jumpMomentum++;
        jumpY += jumpMomentum;
        if(jumpY >= 300) {
            jumpMomentum = -(Math.floor(Math.random() * 5) + 15);
        }
        $(page).find("#pet-wrapper-exercise").attr({"style": "padding-top: " + jumpY + "px;"});
        $(page).find("#ground-exercise").attr({"style": "margin-top: " + (300 - jumpY) + "px;"});
    }
}

PetDanceEngine = function() {
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

}