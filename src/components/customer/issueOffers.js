import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/customer/issueOffers.css";
import SideBar from "./sideBar";

const IssueOffers = () => {
  const { issueId } = useParams();
  const [offers, setOffers] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleAccept = (offerId) => {
    alert(`Accepting offer ID: ${offerId}`);
    // Implement actual POST or PUT logic later
  };

  const handleDecline = (offerId) => {
    alert(`Declining offer ID: ${offerId}`);
    // Implement actual POST or PUT logic later
  };

  const handleMessage = (workerId) => {
    alert(`Messaging worker ID: ${workerId}`);
    // Redirect to chat or message component if implemented
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8088/offers/forIssue?issueId=${issueId}`
        );
        setOffers(res.data);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
      }
    };
    fetchOffers();
  }, [issueId]);

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
            {offers.map((offer) => (
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
                <div className="offer-actions">
                  <button onClick={() => handleMessage(offer.workerId)}>
                    Message
                  </button>
                  <button
                    className="offer-accept"
                    onClick={() => handleAccept(offer.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="offer-decline"
                    onClick={() => handleDecline(offer.id)}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueOffers;
