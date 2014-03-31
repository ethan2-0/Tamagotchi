/*
 * Copyright (C) 2014 Shannon White and Ethan White
 */

try {
    var T_FireBase = function(userName, log) {
        this.log = log
        this.UserName = userName
        this.Id = null
        this.IsNew = false
        
        var userRef = null
        var thiz = this
        
        var userRoot = new Firebase('https://sweltering-fire-393.firebaseio.com/users/');
        if (userRoot == null) {
            throw "https://sweltering-fire-393.firebaseio.com/users/ not created"
        }
        var vpetRoot = new Firebase('https://sweltering-fire-393.firebaseio.com/vpet/');
        if (vpetRoot == null) {
            throw "https://sweltering-fire-393.firebaseio.com/vpet/ not created"
        }

        var hashed = MD5(userName)

        var store = new function() {
            this.getUserRoot = function() {
                return userRoot
            }
            this.getPetRoot = function() {
                return vpetRoot
            }
            this.log = log
        }()

        var userP = new T_UserP(store, hashed, true)

        this.getUser = function() {
            return userP
        }

        this.close = function() {
            // TODO
        }
    }

    /**
     * listener.onDeleted(this)
     * listener.onProperty(this, name, value, isNew)
     */
    var T_UserP = function(store, userId, isMe) {
        var thiz = this
        var listener = null
        var ref = store.getUserRoot().child(userId)
        var stable = new T_StableP(store, userId, isMe)
        var friends = isMe ? new T_FriendListP(store, userId) : null

        var onValue = function(snapshot) {
            if (listener == null) {
                return
            }
            if (snapshot.val() == null) {
                listener.onDeleted(thiz)
            }
        }

        var onChildAdded = function(snapshot) {
            if (listener == null) {
                return
            }
            var pname = snapshot.name()
            if (pname == "stable" || pname == "friemds") {
                return
            }
            listener.onProperty(thiz, pname, snapshot.val(), true)
        }

        var onChildRemoved = function(snapshot) {
            if (listener == null) {
                return
            }
            var pname = snapshot.name()
            if (pname == "stable" || pname == "friemds") {
                return
            }
            listener.onProperty(thiz, pname, null, false)
        }

        var onChildUpdated = function(snapshot) {
            if (listener == null) {
                return
            }
            var pname = snapshot.name()
            if (pname == "stable" || pname == "friemds") {
                return
            }
            listener.onProperty(thiz, pname, snapshot.val(), false)
        }

        this.setListener = function(l) {
            listener = l
            if (listener == null) {
                ref.off("value", onValue)
                ref.off("child_added", onChildAdded)
                ref.off("child_removed", onChildRemoved)
                ref.off("child_changed", onChildUpdated)
            } else {
                ref.on("value", onValue)
                ref.on("child_added", onChildAdded)
                ref.on("child_removed", onChildRemoved)
                ref.on("child_changed", onChildUpdated)
            }
        }

        this.getStable = function() {
            return stable
        }

        this.getFriends = function() {
            return friends
        }

        this.setProperty = function(pname, value) {
            ref.child(pname).set(value)
        }

        this.remove = function() {
            ref.remove()
        }

        this.isMe = function() {
            return isMe
        }
    }

    var T_FriendListP = function(store, userId) {
        var ref = store.getUserRoot().child(userId).child("friends")
        var thiz = this
        var listener = null

        var onFriendAdded = function(snapshot) {
            if (listener == null) {
                return
            }
            var pet = new T_UserP(store, snapshot.val(), false)
            listener.onFriendAdded(thiz, pet)
        }

        var onFriendRemoved = function(snapshot) {
            if (listener == null) {
                return
            }
            listener.onFriendRemoved(thiz, snapshot.val())
        }

        this.setListener = function(l) {
            listener = l
            if (listener == null) {
                ref.off("child_added", onFriendAdded)
                ref.off("child_removed", onFriendRemoved)
            } else {
                ref.on("child_added", onFriendAdded)
                ref.on("child_removed", onFriendRemoved)
            }
        }

        /**
         * Returns the generated pet id
         */
        this.add = function(username) {
            var id = guid()
            ref.push(id)
            return id
        }
    }

    /**
     * listener.onPetAdded(this, pet)
     * listener.onPetRemoved(this, petId)
     */
    var T_StableP = function(store, userId, isMyStable) {
        var ref = store.getUserRoot().child(userId).child("stable")
        var thiz = this
        var listener = null

        var onPetAdded = function(snapshot) {
            if (listener == null) {
                return
            }
            var pet = new T_VPetP(store, snapshot.val(), isMyStable)
            listener.onPetAdded(thiz, pet)
        }

        var onPetRemoved = function(snapshot) {
            if (listener == null) {
                return
            }
            listener.onPetRemoved(thiz, snapshot.val())
        }

        this.setListener = function(l) {
            listener = l
            if (listener == null) {
                ref.off("child_added", onPetAdded)
                ref.off("child_removed", onPetRemoved)
            } else {
                ref.on("child_added", onPetAdded)
                ref.on("child_removed", onPetRemoved)
            }
        }

        /**
         * Returns the generated pet id
         */
        this.add = function(petInfo) {
            var id = guid()
            petInfo.id = id
            var newPetRef = ref.push(id)
            store.getPetRoot().child(id).set(petInfo)
            return id
        }

        this.isMyStable = function() {
            return isMyStable
        }
    }

    /**
     * listener.onDeleted(this)
     * listener.onProperty(this, name, value, isNew)
     */
    var T_VPetP = function(store, petId, isMyPet) {
        var ref = store.getPetRoot().child(petId)
        var thiz = this
        var listeners = []

        var onValue = function(snapshot) {
            if (listeners.length == 0) {
                return
            }
            if (snapshot.val() == null) {
                for (index in listeners) {
                    listeners[index].onDeleted(thiz)
                }
            }
        }

        var onChildAdded = function(snapshot) {
            if (listeners.length == 0) {
                return
            }
            for (var index in listeners) {
                listeners[index].onProperty(thiz, snapshot.name(), snapshot.val(), true)
            }
        }

        var onChildRemoved = function(snapshot) {
            if (listeners.length == 0) {
                return
            }
            for (var index in listeners) {
                listeners[index].onProperty(thiz, snapshot.name(), null, false)
            }
        }

        var onChildUpdated = function(snapshot) {
            if (listeners.length == 0) {
                return
            }
            for (var index in listeners) {
                listeners[index].onProperty(thiz, snapshot.name(), snapshot.val(), false)
            }
        }

        this.addListener = function(l) {
            for (var index in listeners) {
                if (listeners[index] == l) {
                    throw "Attempt to add listener twice"
                }
            }
            if (listeners.length > 0) {
                ref.off("value", onValue)
                ref.off("child_added", onChildAdded)
                ref.off("child_removed", onChildRemoved)
                ref.off("child_changed", onChildUpdated)
            }
            listeners.push(l)
            ref.on("value", onValue)
            ref.on("child_added", onChildAdded)
            ref.on("child_removed", onChildRemoved)
            ref.on("child_changed", onChildUpdated)
        }

        this.removeListener = function(l) {
            if (listeners.length == 0) {
                return
            }
            for (var index in listeners) {
                if (listeners[index] == l) {
                    listeners.splice(index, 1)
                    break
                }
            }
            if (listeners.length == 0) {
                ref.off("value", onValue)
                ref.off("child_added", onChildAdded)
                ref.off("child_removed", onChildRemoved)
                ref.off("child_changed", onChildUpdated)
            }
        }

        this.update = function(petInfo) {
            ref.set(petInfo)
        }

        this.remove = function() {
            ref.remove()
        }

        this.getId = function() {
            return petId
        }

        this.isMyPet = function() {
            return isMyPet
        }
    }

    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }
} catch (e) {
    window.alert("Problem in store.js " + e)
}
