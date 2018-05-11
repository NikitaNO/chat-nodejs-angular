import { Component, OnInit, Input } from '@angular/core';
import {forEach} from "@angular/router/src/utils/collection";
import { Socket } from 'ng-socket-io';
import * as _ from 'lodash';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {

  public openedChats: any[] = [];

  @Input() friends: any[] = [];
  @Input() userFrom: string;
  userTo: string;
    userToName: string;
    typingUser: string;

  constructor(private socket: Socket) {
      this.socket.on("writingMsg", (write) => {
          this.typingUser = write.id;
          setTimeout(() => {
              this.typingUser = null;
          }, 2000)
      });

  }

  ngOnInit() { }

  openChat(friend: any): void {

    if (!_.find(this.openedChats, {id: friend.id})) {
        if (this.openedChats.length === 3){
            this.openedChats.shift();
        }

        this.openedChats.push(friend);

        this.userTo = friend.id;
        this.userToName = friend.displayName;
    }
  }

}
