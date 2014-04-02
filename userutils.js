userUtils = new function() {
    this.onActivePet = function(user, callback) {
        var stable = user.getStable()
        var activePetId = null
        var stableListener = new function() {
            this.onPetAdded = function(src, pet) {
                if (pet.getId() == activePetId) {
                    callback(user, pet)
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
    }
}()