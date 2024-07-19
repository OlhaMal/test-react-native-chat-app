import { updateChat } from "./chatService";
import { store } from "./store";

const wsUrl = "wss://ws.postman-echo.com/raw";

class WebSocketService {
    private socket: WebSocket | null = null;
  
    connect() {
      this.socket = new WebSocket(wsUrl);
  
      this.socket.onopen = () => {
        console.log("WebSocket connection established.");
      };
  
      this.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        store.dispatch(updateChat(message));
      };
  
      this.socket.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(() => this.connect(), 1000); 
      };
  
      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    }
  
    sendMessage(chatId: string, message: string, senderId: string) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const messageData = {
          chatId,
          message: {
            senderId,
            message,
            timestamp: new Date().toISOString(),
          },
        };
        this.socket.send(JSON.stringify(messageData));
      } else {
        console.error("WebSocket is not open.");
      }
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  }
  
  const webSocketService = new WebSocketService();
  export default webSocketService;