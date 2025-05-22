import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import WorkerSideBar from "./sideBar";
import "../../styles/worker/workerChatRoom.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkerChatRoom = ({ roomId: propRoomId, embedded = false }) => {
  const urlRoomId = useParams().roomId;
  const roomId = propRoomId || urlRoomId;
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

        res.data.forEach((msg) => {
          if (!msg.isRead && msg.senderId !== user.id) {
            axios.put(`http://localhost:8088/chat/markAsRead/${msg.id}`);
          }
        });
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    if (roomId) loadMessages();
  }, [roomId, user.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    try {
      const message = {
        chatRoomId: roomId,
        senderId: user.id,
        content: newMsg.trim(),
        timestamp: new Date().toISOString(),
      };

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

  const updateMessageStatus = async (messageId, status) => {
    try {
      await axios.put(
        `http://localhost:8088/chat/messages/${messageId}/meta-status`,
        { status }
      );
    } catch (err) {
      console.error("Failed to update message status", err);
    }
  };

  const notifyCustomer = async (customerId, price) => {
    try {
      await axios.post("http://localhost:8088/Notifications", {
        userId: customerId,
        message: `✅ The worker accepted your discount request. New price: $${price}`,
        read: false,
      });
    } catch (err) {
      console.error("Failed to notify customer", err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className={embedded ? "chat-room-embedded" : "worker-dashboard"}>
      {!embedded && (
        <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div
        className={`chat-room-wrapper ${
          embedded ? "" : isSidebarOpen ? "sidebar-open" : "sidebar-closed"
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
              <div className="chat-text">
                <p>{msg.content}</p>

                {msg.meta?.type === "discount_offer_request" && (
                  <div className="discount-action-buttons">
                    <button
                      className="accept-discount"
                      onClick={async () => {
                        try {
                          await axios.put(
                            `http://localhost:8088/offers/${msg.meta.offerId}/discount`
                          );

                          await axios.post(
                            "http://localhost:8088/chat/messages",
                            {
                              chatRoomId: msg.chatRoomId,
                              senderId: user.id,
                              content: `I accepted the discount. Price is now $${msg.meta.newPrice}.`,
                              timestamp: new Date().toISOString(),
                            }
                          );

                          await updateMessageStatus(msg.id, "accepted");
                          await notifyCustomer(msg.senderId, msg.meta.newPrice);

                          setMessages((prev) =>
                            prev.map((m) =>
                              m.id === msg.id
                                ? {
                                    ...m,
                                    meta: {
                                      ...m.meta,
                                      status: "accepted",
                                    },
                                  }
                                : m
                            )
                          );

                          toast.success(
                            "Discount accepted and customer notified."
                          );
                        } catch (err) {
                          toast.error("Failed to accept discount");
                        }
                      }}
                      disabled={msg.meta?.status}
                      style={{
                        backgroundColor:
                          msg.meta?.status === "accepted" ? "green" : undefined,
                        color:
                          msg.meta?.status === "accepted"
                            ? "#fffef5"
                            : undefined,
                      }}
                    >
                      {msg.meta?.status === "accepted"
                        ? "Accepted ✅"
                        : "Accept Discount"}
                    </button>

                    <button
                      className="decline-discount"
                      onClick={async () => {
                        try {
                          await axios.post(
                            "http://localhost:8088/chat/messages",
                            {
                              chatRoomId: msg.chatRoomId,
                              senderId: user.id,
                              content: "Sorry, I can't accept the discount.",
                              timestamp: new Date().toISOString(),
                            }
                          );

                          await updateMessageStatus(msg.id, "declined");

                          setMessages((prev) =>
                            prev.map((m) =>
                              m.id === msg.id
                                ? {
                                    ...m,
                                    meta: {
                                      ...m.meta,
                                      status: "declined",
                                    },
                                  }
                                : m
                            )
                          );

                          toast.success("Discount declined.");
                        } catch (err) {
                          toast.error("Failed to decline discount");
                        }
                      }}
                      disabled={msg.meta?.status}
                      style={{
                        backgroundColor:
                          msg.meta?.status === "declined"
                            ? "crimson"
                            : undefined,
                        color:
                          msg.meta?.status === "declined"
                            ? "#fffef5"
                            : undefined,
                      }}
                    >
                      {msg.meta?.status === "declined"
                        ? "Declined ❌"
                        : "Decline"}
                    </button>
                  </div>
                )}
              </div>

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
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default WorkerChatRoom;
