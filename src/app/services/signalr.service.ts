import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { chatMessage } from '../models/chatMessage';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack'
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: any;

  public messages: chatMessage[] = [];
  private connectionUrl = 'https://localhost:7002/signalr';
  private apiUrl = 'https://localhost:7002/api/chat';
  private username: string | null = '';

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  public connect = (username: string | null) => {
    this.username = username;

    this.startConnection();
    this.addListeners();
  }

  public sendMessageToApi(message: string, username: string | null) {
    return this.http.post(this.apiUrl, this.buildChatMessage(message, username))
      .pipe(tap(_ => console.log("message sucessfully sent to api controller")));
  }

  public sendMessageToHub(message: string, username: string | null) {
    var promise = this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message, username))
      .then(() => { console.log(`message sent successfully to hub by ${username}`); })
      .catch((err: any) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }


  private buildChatMessage(message: string, username: string | null): chatMessage {
    return {
      connectionId: this.hubConnection.connectionId ?? '',
      text: message,
      userName: username,
      dateTime: new Date()
    };
  }

  public startConnection() {
    return new Promise((resolve, reject) => {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.connectionUrl, {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets}).build();
        
      this.hubConnection.start()
        .then(() => {
          console.log("connection established");
          return resolve(true);
        })
        .catch((err: any) => {
          console.log("error occured" + err);
          reject(err);
        });
    });
  }

  private addListeners() {
    this.hubConnection.on("messageReceivedFromApi", (data: chatMessage) => {
      console.log("message received from API Controller")
      this.messages.push(data);
    })
    this.hubConnection.on("messageReceivedFromHub", (data: chatMessage) => {
      console.log("message received from Hub")
      this.messages.push({...data, fromLoggedUser: data.userName == this.username});
    })
    this.hubConnection.on("newUserConnected", (_:any) => {
      console.log(_);
      console.log(`new user connected: ${this.username}`)
      
      this.toastr.success(`${this.username} has joined the chat`);
     
      localStorage.setItem('user', this.username as string);
    })
  }
}