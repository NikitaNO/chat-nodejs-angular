import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PopupComponent } from './popup/popup.component'

import { NgChatModule } from 'ng-chat';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';
import { ImageUploadModule } from 'angular2-image-upload';
import { JoinComponent } from './join/join.component';
import { FriendsListComponent } from './friends-list/friends-list.component';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    FileDropDirective,
    FileSelectDirective,
    PopupComponent,
    JoinComponent,
    FriendsListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgChatModule,
    ImageUploadModule.forRoot(),
    SocketIoModule.forRoot(config),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
