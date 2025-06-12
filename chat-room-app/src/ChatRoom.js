import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { UserContext } from "./UserContext";

const SOCKET_SERVER_URL = "https://rolesphere-web-int.onrender.com";

export default function ChatRoom() {
  const { user } = useContext(UserContext);
  const { id: roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    socketRef.current.emit("joinRoom", roomId);

    socketRef.current.on("chatMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const messageData = {
      roomId,
      message: inputMessage,
      user: user?.name || "Anonymous",
      id: socketRef.current.id,
    };

    socketRef.current.emit("chatMessage", messageData);
    setInputMessage("");
  };

  return (
    <div style={styles.container}>
      <h2>Chat Room ID: {roomId}</h2>
      <Link to="/" style={styles.backLink}>← Back to Main Page</Link>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.id === socketRef.current.id ? "flex-end" : "flex-start",
              backgroundColor: msg.id === socketRef.current.id ? "#007bff" : "#e5e5ea",
              color: msg.id === socketRef.current.id ? "white" : "black",
            }}
          >
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "20px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
  },
  backLink: {
    marginBottom: 10,
    textDecoration: "none",
    color: "#007bff",
    cursor: "pointer",
  },
  chatBox: {
    flex: 1,
    height: 400,
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
  },
  message: {
    maxWidth: "70%",
    padding: "8px 12px",
    borderRadius: 12,
    marginBottom: 6,
  },
  form: {
    display: "flex",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  button: {
    marginLeft: 10,
    padding: "10px 20px",
    fontSize: 16,
    borderRadius: 4,
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
