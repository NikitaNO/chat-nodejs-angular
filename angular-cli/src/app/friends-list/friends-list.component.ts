import {Component, OnInit, Input} from '@angular/core';
import {forEach} from "@angular/router/src/utils/collection";
import {Socket} from 'ng-socket-io';
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
    countPopup: number;

    constructor(private socket: Socket) {
        this.socket.on("writingMsg", (write) => {
            this.typingUser = write.id;
            setTimeout(() => {
                this.typingUser = null;
            }, 2000)
        });
        window.addEventListener("resize", this.countPopups);
        window.addEventListener("load", this.countPopups);
    }

    ngOnInit() {
        this.countPopups();
    }


    countPopups = () =>  {
        let width = +window.innerWidth;
        if (width < 540) {
            this.countPopup  = 0;
        }
        else {
            let widthDialogs = width - 330;
            this.countPopup = Math.floor(widthDialogs / 330);
        }
        if (this.openedChats && this.openedChats.length > this.countPopup) {
            this.openedChats.splice(0, this.openedChats.length-this.countPopup);
        }
    }

    openChat(friend: any): void {
        this.countPopups();
        if (!_.find(this.openedChats, {id: friend.id})) {
            if (this.openedChats.length === this.countPopup) {
                this.openedChats.shift();
            }

            this.openedChats.push(friend);

            this.userTo = friend.id;
            this.userToName = friend.displayName;
        }
    }

}
