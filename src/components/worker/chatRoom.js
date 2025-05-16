import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import WorkerSideBar from "./sideBar";
import "../../styles/worker/chatRoom.css";

const WorkerChatRoom = () => {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8088/chat/messages/${roomId}`
        );
        setMessages(res.data);

        // Mark unread messages as read
        res.data.forEach((msg) => {
          if (!msg.isRead && msg.senderId !== user.id) {
            axios.put(`http://localhost:8088/chat/markAsRead/${msg.id}`);
          }
        });
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    loadMessages();
  }, [roomId, user.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const message = {
      chatRoomId: roomId,
      senderId: user.id,
      content: newMsg.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        "http://localhost:8088/chat/messages",
        message
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMsg("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="worker-dashboard">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`chat-room-wrapper ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="chat-room-header">Chat Room</div>

        <div className="chat-room-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${
                msg.senderId === user.id ? "sent" : "received"
              }`}
            >
              <p className="chat-text">{msg.content}</p>
              <span className="chat-time">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default WorkerChatRoom;
