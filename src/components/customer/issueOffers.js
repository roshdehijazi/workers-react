import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/customer/issueOffers.css";
import SideBar from "./sideBar";
import { toast, ToastContainer } from "react-toastify";
import { FaStar } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const IssueOffers = () => {
  const { issueId } = useParams();
  const [offers, setOffers] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatWorkerId, setChatWorkerId] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const [ratingMap, setRatingMap] = useState({});
  const [hoverMap, setHoverMap] = useState({});

  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("user"));

  const handleRatingChange = (offerId, value) => {
    setRatingMap((prev) => ({ ...prev, [offerId]: value }));
  };

  const handleRatingSubmit = async (offer) => {
    const rating = ratingMap[offer.id];
    if (!rating) return;
    try {
      await axios.put("http://localhost:8088/users/addRating", {
        workerId: offer.workerId,
        rating,
        description: "Rated via finished offer",
      });

      await axios.put(`http://localhost:8088/offers/${offer.id}/markRated`);
      toast.success("Rating submitted and notification sent.");
      await axios.post("http://localhost:8088/Notifications", {
        userId: offer.workerId,
        message: `${customer.username} Rated you ${rating} stars for solving his issue ${issueId}.`,
        isRead: false,
        issueId: issueId,
      });
      refreshOffers();
    } catch (err) {
      toast.error("Failed to submit rating.");
    }
  };

  const renderStars = (offerId) => {
    const rating = ratingMap[offerId] || 0;
    const hover = hoverMap[offerId] || 0;

    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <label key={value}>
            <input
              type="radio"
              name={`rating-${offerId}`}
              value={value}
              onClick={() => handleRatingChange(offerId, value)}
              style={{ display: "none" }}
            />
            <FaStar
              className="star"
              size={20}
              color={value <= (hover || rating) ? "#ffc107" : "#ccc"}
              onMouseEnter={() =>
                setHoverMap({ ...hoverMap, [offerId]: value })
              }
              onMouseLeave={() => setHoverMap({ ...hoverMap, [offerId]: 0 })}
            />
          </label>
        ))}
      </div>
    );
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const readyMessages = [
    "Hi! I saw your offer and I have a few questions.",
    "Can you explain the price breakdown?",
    "When would you be available to start?",
    "Is this price final or negotiable?",
    "Thank you for your offer. I'm considering it.",
  ];

  const refreshOffers = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8088/offers/forIssue?issueId=${issueId}`
      );
      setOffers(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
    }
  }, [issueId]);

  useEffect(() => {
    refreshOffers();
  }, [refreshOffers]);

  const openChatAndSend = async (workerId, messageContent, meta = null) => {
    try {
      const customer = JSON.parse(localStorage.getItem("user"));
      const res = await axios.get(
        `http://localhost:8088/chat/rooms/${customer.id}`
      );
      const allRooms = res.data;

      let chatRoom = allRooms.find(
        (room) =>
          room.participantIds.includes(customer.id) &&
          room.participantIds.includes(workerId)
      );

      if (!chatRoom) {
        const roomRes = await axios.post("http://localhost:8088/chat/rooms", {
          name: `Chat: ${customer.id} - ${workerId}`,
          participantIds: [customer.id, workerId],
        });
        chatRoom = roomRes.data;
      }

      await axios.post("http://localhost:8088/chat/messages", {
        chatRoomId: chatRoom.id,
        senderId: customer.id,
        content: messageContent,
        timestamp: new Date().toISOString(),
        meta,
      });

      toast.success("Message sent");
      setShowChatBox(false);
      setCustomMessage("");
      setTimeout(() => navigate("/customer/customer-chats"), 1000);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message");
    }
  };

  const handleDiscountRequest = async (offer) => {
    await axios.post("http://localhost:8088/Notifications", {
      userId: offer.workerId,
      message: `${customer.username} requested a discount on your offer for issue ${issueId}.`,
      isRead: false,
    });

    const customer = JSON.parse(localStorage.getItem("user"));
    const discountedPrice = Math.round(offer.price * 0.9);

    const message = `Hi, I’d like to request a 10% discount on your offer. Would you accept $${discountedPrice} instead of $${offer.price}?`;

    await openChatAndSend(offer.workerId, message, {
      type: "discount_offer_request",
      offerId: offer.id,
      newPrice: discountedPrice,
    });
  };

  const handleAccept = async (offerId) => {
    try {
      const offer = offers.find((o) => o.id === offerId);
      if (!offer) {
        toast.error("Offer not found.");
        return;
      }

      await axios.put(`http://localhost:8088/offers/${offerId}/isAccepted`);

      await axios.post("http://localhost:8088/Notifications", {
        userId: offer.workerId,
        message: `${customer.username} accepted your offer for issue ${issueId}.`,
        isRead: false,
        issueId: issueId,
      });

      toast.success("Offer accepted successfully.");
      refreshOffers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept offer.");
    }
  };

  const handleMarkFinished = async (offerId) => {
    try {
      await axios.put(`http://localhost:8088/offers/${offerId}/isFinished`);
      await axios.put(`http://localhost:8088/issues/${issueId}/finish`);
      toast.success("Offer marked as finished.");
      refreshOffers();
    } catch (err) {
      toast.error("Failed to mark offer as finished.");
    }
  };

  const handleDelete = (offerId) => {
    toast.info(
      <div>
        Are you sure you want to delete this offer?
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:8088/offers/${offerId}`);
                toast.dismiss();
                toast.success("Offer deleted.");
                refreshOffers();
              } catch (err) {
                toast.error("Failed to delete offer.");
              }
            }}
            style={{ marginRight: "10px" }}
          >
            Yes
          </button>
          <button onClick={() => toast.dismiss()}>No</button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const handleMessage = (workerId) => {
    setChatWorkerId(workerId);
    setShowChatBox(true);
  };

  const displayedOffers = offers.some((o) => o.accepted)
    ? offers.filter((o) => o.accepted)
    : offers;

  return (
    <div className="offers-page">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`offers-content ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <h2>Offers for Issue</h2>
        {offers.length === 0 ? (
          <p>No offers available for this issue.</p>
        ) : (
          <div className="offers-list">
            {displayedOffers.map((offer) => (
              <div key={offer.id} className="offer-box">
                <p>
                  <strong>Description:</strong> {offer.description}
                </p>
                <p>
                  <strong>Price:</strong> ${offer.price}
                </p>
                <p>
                  <strong>Worker ID:</strong> {offer.workerId}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {offer.finished
                    ? "Finished"
                    : offer.accepted
                    ? "Accepted"
                    : "Pending"}
                </p>
                <div className="offer-actions">
                  <button onClick={() => handleMessage(offer.workerId)}>
                    Message
                  </button>
                  {offer.finished && !offer.rated ? (
                    <div className="rating-section">
                      {renderStars(offer.id)}
                      <button onClick={() => handleRatingSubmit(offer)}>
                        Send Rating
                      </button>
                    </div>
                  ) : offer.accepted ? (
                    <button
                      onClick={() => handleMarkFinished(offer.id)}
                      disabled={offer.finished}
                    >
                      {offer.finished ? "Finished" : "Mark as Finished"}
                    </button>
                  ) : (
                    <>
                      <button
                        className="offer-accept"
                        onClick={() => handleAccept(offer.id)}
                      >
                        Accept
                      </button>
                      <button
                        className="offer-decline"
                        onClick={() => handleDelete(offer.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="offer-discount"
                        onClick={() => handleDiscountRequest(offer)}
                      >
                        Request 10% Discount
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showChatBox && (
        <div className="chat-box-modal">
          <div className="chat-box">
            <h3>Send a message</h3>
            <div className="ready-messages">
              {readyMessages.map((msg, i) => (
                <button
                  key={i}
                  className="ready-msg-button"
                  onClick={() => openChatAndSend(chatWorkerId, msg)}
                >
                  {msg}
                </button>
              ))}
            </div>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your own message..."
              rows="3"
            />
            <div className="chat-box-actions">
              <button
                onClick={() => openChatAndSend(chatWorkerId, customMessage)}
                disabled={!customMessage.trim()}
              >
                Send
              </button>
              <button onClick={() => setShowChatBox(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default IssueOffers;
