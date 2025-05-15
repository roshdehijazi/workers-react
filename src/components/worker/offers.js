import React, { useEffect, useState } from "react";
import WorkerSideBar from "./sideBar";
import axios from "axios";
import "../../styles/worker/offers.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Offers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [offers, setOffers] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedImageList, setSelectedImageList] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.id;

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8088/offers/forWorker?workerId=${username}`
        );
        console.log(response.data);
        setOffers(response.data);
      } catch (err) {
        console.log("Error: ", err);
        toast.error("Failed To Fetch Offers");
      }
    };
    if (username) fetchOffers();
  }, [username]);

  const handleViewIssue = async (issueId) => {
    try {
      const response = await axios.get(
        `http://localhost:8088/issues/${issueId}`
      );
      setSelectedIssue(response.data);
    } catch (err) {
      console.error("Failed to fetch issue:", err);
      toast.error("Failed to load issue.");
    }
  };

  const handleContactCustomer = async (customerId) => {
    try {
      const worker = JSON.parse(localStorage.getItem("user"));
      const senderId = worker.id;
      const response = await axios.post("http://localhost:8088/chat/rooms", {
        name: `Chat: ${senderId} - ${customerId}`,
        participantIds: [senderId, customerId],
        senderId: senderId,
        content: "Test Messages 2 ..",
        timestamp: new Date().toISOString(),
      });
      const data = response.data;
      console.log(data);
      toast.success("Message Sent Successfully!");
    } catch (e) {
      console.log("Error: ", e);
      toast.error("Failed To Send Message");
    }
  };

  return (
    <div className="worker-dashboard-offers">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`worker-offers-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <h2 className="worker-offers-title">My Offers</h2>
        <div className="worker-offers-list">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="worker-offer-card"
              style={{
                background: offer.accepted ? "rgb(215, 255, 215)" : "#FFFFFF",
              }}
            >
              <div className="worker-offer-title">{offer.title}</div>
              <div className="worker-offer-description">
                {`My description: ${offer.description}`}
              </div>
              <div className="worker-offer-price">
                {`Price : ${offer.price}`}
              </div>
              <div className="worker-offer-status">
                Status:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: offer.accepted ? "green" : "gray",
                  }}
                >
                  {offer.accepted ? "Accepted" : "Pending"}
                </span>
              </div>

              <div className="worker-price-section">
                <button
                  className="worker-view-button"
                  onClick={() => handleViewIssue(offer.issueId)}
                >
                  View Issue
                </button>
                <button
                  className="worker-contact-button"
                  onClick={() => handleContactCustomer(offer.customerId)}
                >
                  Message Customer
                </button>
              </div>
            </div>
          ))}
        </div>
        {selectedIssue && (
          <div className="worker-issue-details">
            <button
              className="worker-issue-close"
              onClick={() => setSelectedIssue(null)}
            >
              ✖
            </button>
            <h3>{selectedIssue.title}</h3>
            <p>
              <strong>Description:</strong> {selectedIssue.description}
            </p>
            <p>
              <strong>Category:</strong> {selectedIssue.category}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedIssue.accepted ? "Accepted" : "Pending"}
            </p>
            {selectedIssue.images && selectedIssue.images.length > 0 && (
              <div className="issue-images-grid">
                {selectedIssue.images.map((img, idx) => (
                  <img
                    key={idx}
                    className="issue-image"
                    src={img}
                    alt={`issue-${idx}`}
                    onClick={() => {
                      setSelectedImageList(selectedIssue.images);
                      setSelectedImageIndex(idx);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {selectedImageIndex !== null && (
        <div
          className="image-modal-overlay"
          onClick={() => setSelectedImageIndex(null)}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-nav left"
              onClick={() =>
                setSelectedImageIndex(
                  (prev) =>
                    (prev - 1 + selectedImageList.length) %
                    selectedImageList.length
                )
              }
            >
              ◀
            </button>

            <img
              src={selectedImageList[selectedImageIndex]}
              alt="Enlarged"
              className="modal-image"
            />

            <button
              className="modal-nav right"
              onClick={() =>
                setSelectedImageIndex(
                  (prev) => (prev + 1) % selectedImageList.length
                )
              }
            >
              ▶
            </button>

            <button
              className="close-modal"
              onClick={() => setSelectedImageIndex(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Offers;
