export interface chatMessage {
    text: string;
    connectionId: string;
    userName: string | null;
    dateTime: Date;
    fromLoggedUser?: boolean;
  }