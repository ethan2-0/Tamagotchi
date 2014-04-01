/*try {*/
    clicked = false;
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
    function populateFoodImage(item, container) {
        if(container == null) {
            container = EbyID("food-section");
        }
        html  = '<img class="food-image" src="';
        html += item.image;
        html += '" id="food-item-' + item.name;
        html += '" onclick="selectFoodItem(\'' + item.name + '\')"></img>';
        container.innerHTML += html;
    }
    foodTimeout = 0;
    //Note that particles only work in the area above the bars, etc. This is to fix issue #1. See the docs for this page for more info.
    function Particle(color, size, gravity, x, y) {
        this.size = size;
        this.color = color;
        this.gravity = gravity;
        this.left = x;
        this.top = y;
        this.ticksLived = 0;
        //Actually create the element
        this.draw = function() {
            canvas = EbyID("pet-canvas");
            context = canvas.getContext("2d");
            context.fillStyle = this.color;
            context.fillRect(this.left, this.top, this.size, size);
        };
        this.update = function() {
            this.top += this.gravity;
            this.draw();
            this.ticksLived++;
            if(this.ticksLived > 20) {
                index = particleList.indexOf(this);
                particleList.splice(index, 1);
            }
        };
        particleList.push(this);
    }
    //Occurs when a food item is clicked on the page.
    function selectFoodItem(name) {
        if(EbyID("food-item-" + name).getAttribute("style") == "" || EbyID("food-item-" + name).getAttribute("style") == null) {
            if(foodTimeout <= 0) {
                EbyID("food-item-" + name).setAttribute("style", "background-color: black;");
            } else {
                EbyID("food-item-" + name).setAttribute("style", "background-color: red;");
                setPetError("Please wait " + foodTimeout + " seconds.");
                setTimeout(function() {
                    EbyID("food-item-" + name).setAttribute("style", "");
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
            foodTimeout = 10;
            setTimeout(function() {
                EbyID("food-item-" + name).setAttribute("style", "");
            }, 100);
        }
    }
    //F_C feedPet
    function feedPet(item) {
        //throw ((getItem("petWeight") / 1) + item.weight);
        if((getItem("petWeight") / 1) + item.weight > 100) {
            localStorage.setItem("petWeight", 100);
            addItem("petHealth", -(Math.floor(item.weight / 2)));
        } else {
            addItem("petWeight", item.weight);
            addItem("petHealth", -(Math.floor(item.weight / 2)));
        }
        if((getItem("petHunger") / 1) + item.hunger > 100) {
            localStorage.setItem("petHunger", 100);
        } else {
            addItem("petHunger", item.hunger);
        }
        if((getItem("petHappiness") / 1) + item.happiness > 100) {
            localStorage.setItem("petHappiness", 100);
        } else {
            addItem("petHappiness", item.happiness);
        }
        updateRendering();
    }
    errorWillBeCleared = false;
    function setPetError(error) {
        EbyID("error-message-pet").innerHTML = error;
        errorWillBeCleared = true;
        setTimeout(function() {
            //Clear it after some time
            if(errorWillBeCleared) {
                EbyID("error-message-pet").innerHTML = "";
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
            happiness = localStorage.getItem("petHappiness");
        }
        if(health == null) {
            health = localStorage.getItem("petHealth");
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
    jumpMomentum = 0;
    jumpY = 100;
    function doJump() {
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
        EbyID("pet-wrapper-exercise").setAttribute("style", "padding-top: " + jumpY + "px;");
        EbyID("ground-exercise").setAttribute("style", "margin-top: " + (300 - jumpY) + "px;");
    }
    function doDance() {
        EbyID("other-petpage-stuff").setAttribute("style", "visibility: hidden;");
        dance(EbyID("pet-wrapper"));
        setTimeout(function() {
            EbyID("other-petpage-stuff").setAttribute("style", "");
        }, 241 * 20);
    }
    function creatorLater() {
        loadPage("creator");
    }
    function populatePetDisplay(display, name, happiness, health) {
        if(health == null) {
            health = localStorage.getItem("petHealth");
        }
        if(happiness == null) {
            happiness = localStorage.getItem("petHappiness");
        }
        s =  '<table><tr>';
        s += '    <td class="pet-display-item"><div class="pet-image ' + getHappiness(happiness, health) + '"></div></td>\n'
        s += '    <td class="pet-display-item"><div class="pet-display-name title">' + name + '</div></td>';
        s += '</tr></table>';
        display.innerHTML = s;
    }
    //Happens slowly
    function updateRendering() {
        setTimeout(updateRendering, 100);
    }
    setTimeout(renderingTick, 50);
    function resizeCanvas() {
        canvas = EbyID("pet-canvas");
        canvas.width = window.innerWidth;
        //To fix issue #1, this has been changed from the following line to how it is now:
        //canvas.height = window.innerHeight;
        canvas.height = 325;
    }
    function tick() {
        //alert(document.getElementById("health-bar"));
        //alert(App.getStack()[App.getStack().length - 1]);
        if(foodTimeout > 0) {
            foodTimeout--;
        }
        changeThePet();
        setTimeout(tick, 1000);
    }
    setTimeout(tick, 1000);
    function renderingTick() {
        setTimeout(renderingTick, 50);
        //Particles
        canvas = EbyID("pet-canvas");
        if (canvas == null) {
            return
        }
        context = canvas.getContext("2d");
        context.clearRect("0", "0", "1920", "1080"); //1920X1080 is overkill, but it won't be in the future :)
        for(i = 0; i < particleList.length; i++) {
            particleList[i].update();
        }
        //Updating the pet page
        if(getPageName() == "Pet") {
            updateProgressBar(document.getElementById("health-bar"), localStorage.getItem("petHealth"));
            updateProgressBar(document.getElementById("hunger-bar"), localStorage.getItem("petHunger"));
            updateProgressBar(document.getElementById("happiness-bar"), localStorage.getItem("petHappiness"));
            updateProgressBar(document.getElementById("weight-bar"), localStorage.getItem("petWeight"), "black");
            EbyID("pet-age").innerHTML = localStorage.getItem("petAge");//Math.floor((new Date().getTime() - localStorage.getItem("petBirthday").getTime()) / 60) + " minutes";
            EbyID("pet-image").setAttribute("class", "pet-image " + getHappiness());
        }
        //Updating the exercise page
        if(getPageName() == "exercise-page") {
            EbyID("pet-image-exercise").setAttribute("class", "pet-image " + getHappiness());
        }
    };
    setTimeout(renderingTick, 50);
    function setClick(value) {
        clicked = value;
    }
    petScratches = 0;
    function scratchPet(evt) {
        petScratches++;
        if(petScratches % 6 == 0) {
            touch = evt.changedTouches[0];
            boundingRect = EbyID("pet-image").getBoundingClientRect();
            if((touch.clientX - boundingRect.left < 128 && touch.clientX - boundingRect.left > 0) &&
                (touch.clientY - boundingRect.top < 128 && touch.clientY - boundingRect.top > 0)) {
                p = new Particle("#464646", 5, 1, touch.clientX, touch.clientY);
                if(petScratches % 16 == 0 && getItem("petHappiness") / 1 < 100) {
                    addItem("petHappiness", 1);
                }
            }
        }
    }
    /*
} catch (e) {
    window.alert("Problem loading pet.js " + e)
}*/