import {Component} from '@angular/core';
import {ChatAdapter, User} from 'ng-chat';
import {SocketIOAdapter} from './socketio-adapter'
import {Socket} from 'ng-socket-io';
import {Http} from '@angular/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app';
    userId: string;
    username: string;
    interest: string;
    onFriendsListChanged: any;
    dialog: boolean = false;
    msg: string;
    selectedUser: any;
    onMessageReceived: any = [];
    popups: any = [];
    typingUser: String;
    API: string = 'http://localhost:3000/';

    //arrays of popups ids


    public adapter: ChatAdapter;


    constructor(private socket: Socket, private http: Http) {
        this.InitializeSocketListerners();
        if (window.localStorage.userId) {
            this.username = window.localStorage.username;
            this.joinRoom();
        }

        this.socket.on("friendsListChanged", (usersCollection: Array<User>) => {
            this.onFriendsListChanged = usersCollection.filter(x => x.id != this.userId);
        });
        this.socket.on("messageReceived", (messageWrapper) => {
            let self = this;
            messageWrapper.forEach(function (elem, i, all) {
                if (elem.message.indexOf('.base64') != -1 || elem.message.indexOf('.jpg') != -1 || elem.message.indexOf('.png') != -1 || elem.message.indexOf('.jpeg') != -1) {
                    elem.type = 'img';
                }
                if (i == messageWrapper.length - 1) {
                    self.onMessageReceived = messageWrapper;
                }
            })

        });
        this.socket.on("userWriteMsg", (write) => {
            this.typingUser = write.displayName;
            setTimeout(() => {
                this.typingUser = null;
            }, 2000)
        });

    }

    public joinRoom(): void {
        let user = {
            username: this.username,
            interest: this.interest
        };
        this.socket.emit("join", user);
    }

    public InitializeSocketListerners(): void {
        this.socket.on("generatedUserId", (userId) => {
            this.adapter = new SocketIOAdapter(userId, this.socket, this.http);
            this.userId = userId;
            window.localStorage.userId = userId;
            window.localStorage.username = this.username;
        });
    }

    public selectUser(user): void {
        this.popups.push(user)
        // this.dialog = true;
        // this.selectedUser = user;
        // this.onMessageReceived = [];
        // let chat = {
        //     fromId: this.userId,
        //     toId: this.selectedUser.id
        // };
        // this.socket.emit("getChats", chat);
    }

    onUploadFinished(file: any) {
        this.msg = file.file.name;
        this.send();
    }

    public writeMsg(msg): void {
        console.log(msg);
        let message = {
            message: this.msg,
            fromId: this.userId,
            toId: this.selectedUser.id
        };
        this.socket.emit("writeMessage", message)
    }

    public send(): void {
        let message = {
            message: this.msg,
            fromId: this.userId,
            toId: this.selectedUser.id
        };
        this.socket.emit("sendMessage", message);
        this.msg = null;
    }

    public sendSmile(smile): void {
        let message = {
            message: smile,
            fromId: this.userId,
            toId: this.selectedUser.id
        };
        this.socket.emit("sendMessage", message);
        this.msg = null;
    }

    // public addPopup(id, name): void {
    //
    // }
}