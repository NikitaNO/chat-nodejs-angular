import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {PopupComponent} from './popup/popup.component'

import { NgChatModule } from 'ng-chat';

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { FileDropDirective, FileSelectDirective } from 'ng2-file-upload';
import { ImageUploadModule } from 'angular2-image-upload';


const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
      FileDropDirective,
      FileSelectDirective,
      PopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgChatModule,
    ImageUploadModule.forRoot(),
    SocketIoModule.forRoot(config) 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
