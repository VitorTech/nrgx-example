export interface chatMessage {
    text: string;
    connectionId: string;
    userName: string | null;
    loggedUserId: string;
    contactedUserId: string;
    dateTime: Date;
    fromLoggedUser?: boolean;
    roomId: string;
  }