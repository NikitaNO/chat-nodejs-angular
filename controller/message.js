let Msg = require("../model/message");

exports.create = (message) => {
    return new Promise((resolve, reject) => {

        message.author = message.fromId;
                Msg.create(message)
                    .then(function(newMsg)  {
                        resolve(true);
                    })
                    .catch(function(error){
                        reject(error);
                    });
    });
};

exports.getUserMsg = (message) => {

    return new Promise((resolve, reject)=>{
        Msg.find( { $or: [ {fromId: message.fromId, toId: message.toId}, { fromId: message.toId, toId: message.fromId } ] })
          .populate('author')
            .then(function(msgs)  {
                resolve(msgs);
            })
            .catch(function(error){
                reject("error");
            });
    });
};
