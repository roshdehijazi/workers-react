import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/customer/customerChats.css";
import { FaComments } from "react-icons/fa";
import SideBar from "./sideBar";
import CustomerChatRoom from "./customerChatRoom";
import photo from "../../assets/customer/chats/photo-chat.png";
const CustomerChats = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8088/chat/rooms/${user.id}`
        );
        const rooms = res.data;

        const enriched = await Promise.all(
          rooms.map(async (room) => {
            const msgRes = await axios.get(
              `http://localhost:8088/chat/messages/${room.id}`
            );
            const messages = msgRes.data;
            const lastMessage = messages[messages.length - 1];

            const otherUserId = room.participantIds.find(
              (id) => id !== user.id
            );
            const userRes = await axios.get(
              `http://localhost:8088/users/${otherUserId}`
            );
            const worker = userRes.data;

            return {
              ...room,
              lastMessage,
              workerName: worker.username || "Unknown",
            };
          })
        );

        setChats(enriched);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };

    fetchChats();
  }, [user.id]);

  return (
    <div className="customer-chats-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`split-chat-wrapper ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        {/* Left column: chat list */}
        <div className="chat-list-pane">
          <input
            type="text"
            className="chat-search"
            placeholder="Search by worker name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="chat-list">
            {chats.length === 0 ? (
              <p className="no-chats">No chats found</p>
            ) : (
              chats
                .filter((chat) =>
                  chat.workerName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-card ${
                      selectedRoomId === chat.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedRoomId(chat.id)}
                  >
                    <FaComments className="chat-icon" />
                    <div className="chat-info">
                      <div className="chat-header">
                        <span className="chat-name">{chat.workerName}</span>
                        {chat.lastMessage?.timestamp && (
                          <span className="chat-time">
                            {new Date(
                              chat.lastMessage.timestamp
                            ).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      <p className="chat-preview">
                        {chat.lastMessage
                          ? chat.lastMessage.content
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Right column: selected chat */}
        <div className="chat-display-pane">
          {selectedRoomId ? (
            <CustomerChatRoom roomId={selectedRoomId} embedded={true} />
          ) : (
            <div className="customer-chat-placeholder">
              <img src={photo} alt="Select a chat" />
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerChats;
