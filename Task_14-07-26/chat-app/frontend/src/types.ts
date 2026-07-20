export interface Message {
  id: string;
  room: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface TypingUpdate {
  room: string;
  username: string;
  isTyping: boolean;
}

export interface ReadReceipt {
  room: string;
  messageId: string;
  username: string;
}

export interface PresenceUpdate {
  room: string;
  onlineUsers: string[];
}

export type Ack<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface ServerToClientEvents {
  room_history: (messages: Message[]) => void;
  new_message: (message: Message) => void;
  presence_update: (data: PresenceUpdate) => void;
  typing_update: (data: TypingUpdate) => void;
  read_receipt: (data: ReadReceipt) => void;
  error_message: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (room: string, callback: (res: Ack) => void) => void;
  leave_room: (room: string) => void;
  send_message: (
    data: { room: string; text: string },
    callback: (res: Ack<Message>) => void
  ) => void;
  typing: (data: { room: string; isTyping: boolean }) => void;
  mark_read: (data: { room: string; messageId: string }) => void;
}
