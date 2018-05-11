import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Socket } from 'ng-socket-io';
import  { environment } from '../../environments/environment'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  onMessageReceived: any = [];
  msg: string;
    apiUrl = environment.apiBaseUrl;

  @Input() userTo: string;
  @Input() userFrom: string;
  @Input() userToName: string;
  @Input() openedChats: any[];
  @Input() chat: any;

  constructor(private socket: Socket) {
      this.socket.on('messageReceived', (messageWrapper) => {
          messageWrapper = messageWrapper.filter(elm => elm.toId === this.chat.id);

          messageWrapper.forEach((elem, i, all) => {
              if (elem.message.indexOf('.base64') != -1 || elem.message.indexOf('.jpg') != -1 || elem.message.indexOf('.png') != -1 || elem.message.indexOf('.jpeg') != -1) {
                  elem.type = 'img';
              }
              if (i == messageWrapper.length - 1) {
                  this.onMessageReceived = messageWrapper;
              }
          })
      });
  }

  ngOnInit() {
    let chat = {
      fromId: this.userFrom,
      toId: this.chat.id
    };
    this.socket.emit("getChats", chat);
  }

    onUploadFinished(file: any) {
        this.msg = file.file.name;
        this.send();
    }

    public writeMsg(msg): void {
        let message = {
            message: this.msg,
            fromId: this.userFrom,
            toId: this.chat.id
        };
        this.socket.emit("writing", message)
    }

    public send(): void {
        let message = {
            message: this.msg,
            fromId: this.userFrom,
            toId: this.chat.id
        };
        this.socket.emit("sendMessage", message);
        this.msg = null;
    }


    public closeDialog(): void {
        for(let i=0; i<this.openedChats.length; i++){
            if(this.openedChats[i].id === this.chat.id){
                this.openedChats.splice(i, 1);
            }
        }
    }

    public sendSmile(smile): void {
        let message = {
            message: smile,
            fromId: this.userFrom,
            toId: this.chat.id
        };
        this.socket.emit("sendMessage", message);
        this.msg = null;
    }
}
