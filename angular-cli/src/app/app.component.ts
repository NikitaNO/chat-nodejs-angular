import { Socket } from 'ng-socket-io';
import { Component, OnInit } from '@angular/core';

// tslint:disable-next-line
type User = { username: string, interest: string };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  userId: string;
  friends: any[];

  dialog = false;
  msg: string;
  selectedUser: any;
  onMessageReceived: any = [];
  openedChats: any[] = [];
  typingUser: String;

  constructor(private _socket: Socket) { }

  ngOnInit(): void {
    this.userId = window.localStorage.userId;

    if (this.userId) {
      this._socket.emit('join', { userId: this.userId });
    }

    this._socket.on('friendsListChanged', (friends: any[]) => {
      this.friends = friends.filter(friend => friend.id !== this.userId);
    });

    this._socket.on('writing', (write) => {
      console.log(write);
      this.typingUser = write.displayName;
      setTimeout(() => {
        this.typingUser = null;
      }, 2000);
    });
  }

  newUserHandler = (userId): void => {
    this.userId = userId;

    window.localStorage.userId = userId;

    this._socket.removeListener('newUser', this.newUserHandler);
  };

  joinRoom(value: User): void {
    this._socket.on('newUser', this.newUserHandler);

    const { username, interest } = value;

    window.localStorage.username = username;
    window.localStorage.interest = interest;

    this._socket.emit('join', value);
  }

  public send(): void {
    const message = {
      message: this.msg,
      fromId: this.userId,
      toId: this.selectedUser.id
    };
    this._socket.emit('sendMessage', message);
    this.msg = null;
  }


}
