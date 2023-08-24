import { chatMessage } from "./chatMessage";

export interface Conversation {
    chatMessages: chatMessage[];
    contactedUserId: string;
    loggedUserId: string;
    id: string;
}