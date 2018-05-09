let User = require("../model/user");

exports.createUser = (user, socketId) => {
    let info = {
        displayName: user.username,
        interest: user.interest,
        id: socketId,
        socketId: socketId
    };

    return new Promise((resolve, reject)=>{
        User.findOne({displayName: user.username}, (err, user) => {
            if(user === null){
                User.create(info)
                    .then(function(newUser)  {
                        newUser.id = newUser._id;
                        newUser.save();
                        resolve({new:true, user: newUser});
                    })
                    .catch(function(error){
                        reject(error);
                    });
            }
            else{
                user.id = user._id;
                user.status = 0;
                user.socketId = socketId;
                user.save();
                resolve({new:false, user: user});
            }

        });
    });
};

exports.updateUserInfo = (socketUser) => {

    return new Promise((resolve, reject)=>{
        User.findOneAndUpdate({socketId: socketUser}, {$set:{status: 1}})
            .then(function(users)  {
                resolve(true);
            })
            .catch(function(error){
                reject("error");
            });
    });
};

exports.getAll = () => {

    return new Promise((resolve, reject)=>{
        User.find()
            .then(function(users)  {
                resolve(users);
            })
            .catch(function(error){
                reject("error");
            });
    });
};
exports.find = (message) => {
    let users = [];
    return new Promise((resolve, reject)=>{
        User.find({id: message.fromId})
            .then(function(userFrom)  {
                users.push(userFrom);
                User.find({id: message.toId})
                    .then(function(userTo)  {
                        users.push(userTo);
                        resolve(users);
                    })
                    .catch(function(error){
                        reject("error");
                    });
            })
            .catch(function(error){
                reject("error");
            });
    });
};

exports.findOne = (user) => {
    return new Promise((resolve, reject)=>{
        User.findById(user)
            .then(function(user)  {
                resolve(user);
            })
            .catch(function(error){
                reject(error);
            });
    });
};
exports.findUserChat = (message) => {

    let users = [];
    return new Promise((resolve, reject)=>{
        User.find({id: message.fromId})
            .then(function(userFrom)  {
                users.push(userFrom);
                resolve(users);
            })
            .catch(function(error){
                reject("error");
            });
    });
};
