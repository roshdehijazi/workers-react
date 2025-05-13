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
      setSelectedIssue(response.data); // ✅ Set state instead of toast
    } catch (err) {
      console.error("Failed to fetch issue:", err);
      toast.error("Failed to load issue.");
    }
  };

  const handleContactCustomer = (customerName) => {
    toast.info(`Open chat with ${customerName} (build later)`);
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
                {offer.description}
              </div>
              <div className="worker-offer-category">
                Category: {offer.category}
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
                  onClick={() => handleContactCustomer(offer.customerName)}
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
            {selectedIssue.image && (
              <img
                src={`../../assets/customer/issuePictures/${selectedIssue.picture}`}
                alt="Issue"
                className="worker-issue-image"
              />
            )}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Offers;
