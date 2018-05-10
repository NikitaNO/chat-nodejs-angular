let http = require("http");
let express = require("express");
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let Fs = require('fs');
let pathFile = require("path");
let fse = require('fs-extra');
let busboy = require('connect-busboy');

let app = express();

app.use(bodyParser.urlencoded({ extended: false }))


app.use(bodyParser.json());
app.use(busboy());
let env = require('./config/env');

require('./config/db')(mongoose, env);

let userCtrl = require('./controller/user');
let msgCtrl = require('./controller/message');

// Express CORS setup
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

let server = app.listen(3000);

let io = require('socket.io').listen(server);

let path = __dirname + '/views/';
app.use(express.static(pathFile.join(__dirname, 'shared')));

let usersCollection = [];

// Express routes
app.set("view engine", "vash");

app.get("*", (req, res) => {
  res.render("index");
});

app.post("/listFriends", (req, res) => {
  let clonedArray = usersCollection.slice();
  let i = usersCollection.findIndex(x => x.id == req.body.userId);

  clonedArray.splice(i, 1);

  res.json(clonedArray);
});
app.post("/upload", (req, res) => {
  let folder = pathFile.join(__dirname, "./shared");

  fse.mkdirsSync(folder, { mode: 0o775 });

  req.busboy.on("file", (fieldname, file, filename) => {
    let fstream = Fs.createWriteStream(pathFile.join(folder, filename), { mode: 0o775 });

    file.pipe(fstream);

    fstream.on("close", function() {
      return res.status(200).json(filename);
    });
  });

  req.pipe(req.busboy);
});

// Socket.io operations
io.on('connection', (socket) => {
  userCtrl.getAll()
    .then((users) => {
      usersCollection = users;
      socket.on('join', (data) => {
        const { userId, username } = data;

        if (userId) {
          userCtrl.findOne(userId)
            .then(loginUser => {
              usersCollection.forEach(function(one, i, all) {
                if (one.displayName == loginUser.displayName) {
                  usersCollection[i].id = loginUser._id;
                  usersCollection[i].socketId = socket.id;
                  usersCollection[i].status = 0;
                }
              });

              socket.emit("generatedUserId", loginUser._id);
              socket.emit("friendsListChanged", usersCollection);
              socket.broadcast.emit("friendsListChanged", usersCollection);
            })
        }
        else {
          userCtrl.createUser(data, socket.id)
            .then((newUser) => {
              if (newUser.new) {
                usersCollection.push({
                  id: newUser.user._id, // Assigning the socket ID as the user ID in this example
                  displayName: username,
                  status: 0, // ng-chat UserStatus.Online,
                  avatar: null,
                  _id: newUser.user._id,
                  socketId: socket.id,
                  interest: newUser.user.interest
                });
                socket.emit("newUser", newUser.user._id);
                socket.emit("friendsListChanged", usersCollection);
                socket.broadcast.emit("friendsListChanged", usersCollection);
              }
              else {
                usersCollection.forEach(function(one, i, all) {
                  if (one.displayName == username) {
                    usersCollection[i].id = newUser.user._id;
                    usersCollection[i].socketId = socket.id;
                    usersCollection[i].status = 0;
                  }
                });

                socket.emit("newUser", newUser.user._id);
                socket.emit("friendsListChanged", usersCollection);
                socket.broadcast.emit("friendsListChanged", usersCollection);
              }
            })
        }

        socket.on('disconnect', () => {
          userCtrl.updateUserInfo(socket.id)
            .then((userOffline) => {
              userCtrl.getAll()
                .then((users) => {
                  usersCollection = users;
                  socket.emit("friendsListChanged", usersCollection);
                  socket.broadcast.emit("friendsListChanged", usersCollection);
                })
            });

        });
      });
    });


  socket.on("sendMessage", (message) => {

    msgCtrl.create(message);
    userCtrl.find(message)
      .then((users) => {
        msgCtrl.getUserMsg(message)
          .then((chats) => {
            io.to(users[0][0].socketId).emit("messageReceived", chats);
            io.to(users[1][0].socketId).emit("messageReceived", chats);
          })
      });
  });
  socket.on("writeMessage", (message) => {
    userCtrl.find(message)
      .then((users) => {
        io.to(users[1][0].socketId).emit('writing', users[0][0]);
      });
  });

  socket.on("getChats", (message) => {
      console.log("message");
      userCtrl.find(message)
      .then((users) => {
        msgCtrl.getUserMsg(message)
          .then((chats) => {
            io.to(users[0][0].socketId).emit("messageReceived", chats);
            io.to(users[1][0].socketId).emit("messageReceived", chats);
          })
      });
  });
});
