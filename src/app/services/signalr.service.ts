import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { chatMessage } from '../models/chatMessage';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack'
import * as signalR from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { UserLogged } from '../models/UserLogged';
import { Conversation } from '../models/conversation';


@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: any;

  public messages: chatMessage[] = [];
  public conversations: Conversation[] = [];
  public roomId: string = '';
  public usersLogged: UserLogged[] = [];
  public userLogged: UserLogged | null = null;
  private connectionUrl = 'https://localhost:7002/signalr';
  private apiUrl = 'https://localhost:7002/api/chat';
  private username: string | null = '';
  public contactedUserId: string = '';
  public contactedUser: any = ''

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  public connect = (username: string | null) => {
    this.username = username;

    this.startConnection();
    this.addListeners();
  }

  // public sendMessageToApi(message: string, loggedUser: UserLogged) {
  //   return this.http.post(this.apiUrl, this.buildChatMessage(message, this.roomId, loggedUser))
  //     .pipe(tap(_ => console.log("message sucessfully sent to api controller")));
  // }

  public sendMessageToHub(message: string, loggedUser: UserLogged) {
    var promise = this.hubConnection.invoke("BroadcastAsync", this.buildChatMessage(message, this.roomId, loggedUser))
      .then()
      .catch((err: any) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }


  private buildChatMessage(message: string, roomId: string, loggedUser: UserLogged): chatMessage {
    const data = {
      connectionId: this.hubConnection.connectionId ?? '',
      text: message,
      roomId: roomId,
      loggedUserId: loggedUser.id,
      userName: loggedUser.userName,
      contactedUserId: this.contactedUserId,
      dateTime: new Date()
    };

    console.log(data);
    return data;
   
  }

  public startConnection() {
    return new Promise((resolve, reject) => {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.connectionUrl, {skipNegotiation: true, transport: signalR.HttpTransportType.WebSockets}).build();
        
      this.hubConnection.start()
        .then(()=> {
          console.log("connection established");

           this.hubConnection.invoke("BroadcastAsyncNewUser", this.username)
          .then(() => { console.log(`hub is now informed about new user `); })
          .catch((err: any) => console.log('error while sending a message to hub: ' + err));
          
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
      this.messages.push({...data, fromLoggedUser: data.userName == this.username});

    })
    this.hubConnection.on("messageReceivedFromHub", (data: chatMessage, conversations: any) => {
      
      this.conversations  = conversations;

        this.usersLogged = this.usersLogged.map(user => {
          if (user.id == data.loggedUserId && data.loggedUserId != this.userLogged?.id) {
            return {
              ...user,
              notification: true
   
             }
          }

          return user;
          
        })
      
        console.log("message received from Hub")
     
        this.messages.push({...data, fromLoggedUser: data.userName == this.username});
  
        const conversationData = this.conversations.find((conversation) => conversation.id== data.roomId);
      
        for (let chatMessage of conversationData?.chatMessages || []) {
          this.messages.push({...chatMessage, fromLoggedUser: chatMessage.userName == this.username})
        }
      
     
    })
   
    this.hubConnection.on('MessageReceivedFromHubNewUser', (data: chatMessage, usersLogged: UserLogged[]) => {
      this.usersLogged = usersLogged;
      
      if (data.userName != this.username) {
        this.toastr.success(`${data.userName} has joined the chat`);
      } else {
        this.toastr.success(`You successfully joined the chat`);
        
        const userLoggedString = JSON.stringify(data);
        localStorage.setItem('user', userLoggedString);

        this.userLogged = JSON.parse(userLoggedString); 
      }
    })

    this.hubConnection.on('ConversationStarted', (conversation: Conversation) => {

      const loggedUser: UserLogged = JSON.parse(localStorage.getItem('user') as string); 
      
      let contactedUser = null;
      if (conversation.contactedUserId == loggedUser.id) {
        contactedUser = this.usersLogged.find(user => user.id == conversation.loggedUserId);
      } else {
        contactedUser = this.usersLogged.find(user => user.id == conversation.contactedUserId);
      }

      this.contactedUser = contactedUser;

      if (conversation.loggedUserId == loggedUser.id || conversation.contactedUserId == loggedUser.id) {
          console.log('conversation started');
          console.log(conversation);
          this.messages = [];
    
          for (let chatMessage of conversation.chatMessages) {
            this.messages.push({...chatMessage, fromLoggedUser: chatMessage.userName == this.username});
          }
      
          this.roomId = conversation.id;
        }
    });
  }

  public talkToUser(loggedUserId: string, contactedUserId: string) {
    if (contactedUserId != this.userLogged?.id && this.userLogged?.id == loggedUserId) {
      this.contactedUserId = contactedUserId;
      this.hubConnection.invoke("StartConversationAsync", {loggedUserId, contactedUserId})
      .catch((err: any) => console.log('error trying to talk to user: ' + err));
    }
  }
}