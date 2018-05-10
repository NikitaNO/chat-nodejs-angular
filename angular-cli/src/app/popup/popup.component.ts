import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import {Socket} from 'ng-socket-io';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  private form: any;
  private error: string;
  private loading: boolean = false;

  onMessageReceived: any = [];

  @Input() userTo: string;
  @Input() userFrom: string;

  constructor( private socket: Socket) {
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
  }

  ngOnInit() {
      let chat = {
          fromId: this.userFrom,
          toId: this.userTo
      };
      this.socket.emit("getChats", chat);
    console.log(this.userTo);
    console.log(this.userFrom);
  }

}
