import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/customer/issueOffers.css";
import SideBar from "./sideBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const IssueOffers = () => {
  const { issueId } = useParams();
  const [offers, setOffers] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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

  const handleAccept = async (offerId) => {
    try {
      await axios.put(`http://localhost:8088/offers/${offerId}/isAccepted`);
      toast.success("Offer accepted successfully.");
      refreshOffers();
    } catch (err) {
      console.error("Failed to accept offer:", err);
      toast.error("Failed to accept offer.");
    }
  };

  const handleMarkFinished = async (offerId) => {
    try {
      await axios.put(`http://localhost:8088/offers/${offerId}/isFinished`);
      toast.success("Offer marked as finished.");
      refreshOffers();
    } catch (err) {
      console.error("Failed to mark offer as finished:", err);
      toast.error("Failed to mark offer as finished.");
    }
  };

  const handleDelete = (offerId) => {
    toast.info(
      <div>
        Are you sure you want to delete this offer?
        <div style={{ marginTop: "10px" }}>
          <button
            style={{ marginRight: "10px" }}
            onClick={async () => {
              try {
                await axios.delete(`http://localhost:8088/offers/${offerId}`);
                toast.dismiss();
                toast.success("Offer deleted.");
                refreshOffers();
              } catch (err) {
                console.error("Failed to delete offer:", err);
                toast.error("Failed to delete offer.");
              }
            }}
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
    toast.success("MESSAGE COMING SOON !!");
    // TODO: Implement chat redirect
  };

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
                <p>
                  <strong>Status:</strong>
                  {offer.finished
                    ? " Finished"
                    : offer.accepted
                    ? " Accepted"
                    : " Pending"}
                </p>
                <div className="offer-actions">
                  <button onClick={() => handleMessage(offer.workerId)}>
                    Message
                  </button>

                  {offer.accepted ? (
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
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default IssueOffers;
