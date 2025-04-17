export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

export interface Room {
  id: string;
  users: User[];
  messages: Message[];
  code: string;
  language: string;
}

export interface CodeExecutionRequest {
  code: string;
  language: string;
}

export interface CodeExecutionResponse {
  output: string;
  error?: string;
} 