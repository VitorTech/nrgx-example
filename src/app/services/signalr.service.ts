import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { chatMessage } from '../models/chatMessage';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack'
import * as signalR from '@microsoft/signalr';


@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: any;

  public messages: chatMessage[] = [];
  private connectionUrl = 'https://localhost:7002/signalr';
  private apiUrl = 'https://localhost:7002/api/chat';

  constructor(private http: HttpClient) { }

  public connect = () => {
    this.startConnection();
    this.addListeners();
  }

  public sendMessageToApi(message: string) {
    return this.http.post(this.apiUrl, this.buildChatMessage(message))
      .pipe(tap(_ => console.log("message sucessfully sent to api controller")));
  }

  public sendMessageToHub(message: string) {
    var promise = this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message))
      .then(() => { console.log('message sent successfully to hub'); })
      .catch((err: any) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }


  private buildChatMessage(message: string): chatMessage {
    return {
      connectionId: this.hubConnection.connectionId ?? '',
      text: message,
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
      this.messages.push(data);
    })
    this.hubConnection.on("newUserConnected", (_:any) => {
      console.log("new user connected")
    })
  }
}