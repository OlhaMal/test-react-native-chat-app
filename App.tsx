import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./src/core/store";
import WebSocketService from "./src/core/websocketService";
import Routes from "./src/static/Routes";

export default function App() {
  useEffect(() => {
    WebSocketService.connect();

    return () => {
      WebSocketService.disconnect(); 
    };
  }, []);

  return (
    <Provider store={store}>
      <Routes />
    </Provider>
  );
}
