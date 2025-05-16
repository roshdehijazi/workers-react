import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/worker/chats.css";
import { FaComments } from "react-icons/fa";
import WorkerSideBar from "../worker/sideBar";
const WorkerChats = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8088/chat/rooms/${user.id}`
        );
        const rooms = res.data;

        const enrichedRooms = await Promise.all(
          rooms.map(async (room) => {
            const msgRes = await axios.get(
              `http://localhost:8088/chat/messages/${room.id}`
            );
            const messages = msgRes.data;
            const lastMessage = messages[messages.length - 1];
            return { ...room, lastMessage };
          })
        );
        console.log(rooms);
        setChats(enrichedRooms);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [user.id]);

  return (
    <div className="worker-dashboard">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`chat-list-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <h2>My Chats</h2>
        {chats.length === 0 ? (
          <p>No chats found</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => navigate(`/worker/chatRoom/${chat.id}`)}
            >
              <FaComments className="chat-icon" />
              <div className="chat-details">
                <h4>{chat.name}</h4>
                {chat.lastMessage ? (
                  <>
                    <p className="last-msg">{chat.lastMessage.content}</p>
                    <span className="timestamp">
                      {new Date(
                        chat.lastMessage.timestamp
                      ).toLocaleTimeString()}
                    </span>
                  </>
                ) : (
                  <p className="last-msg muted">No messages yet</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerChats;
