import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit() { }

  openChat(friend: any): void {
      this.openedChats.push(friend);
    this.userTo = friend.id;
  }

}
