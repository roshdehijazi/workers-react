import { useState, useEffect } from "react";
import WorkerSideBar from "./sideBar";
import "../../styles/worker/issues.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AvailableIssues = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [issues, setIssues] = useState([]);
  const [filteredCategory, setFilteredCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("newer");
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerData, setOfferData] = useState({ price: "", description: "" });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedImageList, setSelectedImageList] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const openOfferDialog = (issue) => {
    setSelectedIssue(issue);
    setOfferData({ price: "", description: "" });
    setShowOfferDialog(true);
  };

  const closeOfferDialog = () => {
    setShowOfferDialog(false);
    setSelectedIssue(null);
  };

  const handleOfferChange = (e) => {
    setOfferData({ ...offerData, [e.target.name]: e.target.value });
  };

  const submitOffer = async () => {
    try {
      if (!offerData.description || offerData.description.trim() === "") {
        toast.error("Description is required.");
        return;
      }
      if (!offerData.price || isNaN(offerData.price) || offerData.price <= 0) {
        toast.error("Price must be a positive number.");
        return;
      }
      const worker = JSON.parse(localStorage.getItem("user"));
      const offerLoad = {
        ...offerData,
        workerId: worker.id,
        customerId: selectedIssue.customerId,
        issueId: selectedIssue.id,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:8088/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerLoad),
      });
      if (!res.ok) {
        const msg = await res.text();
        toast.error(msg || "Server rejected offer");
        return;
      }
      toast.success("Offer Send successfully", { autoClose: 2000 });
      closeOfferDialog();
    } catch (err) {
      console.error("Error sending offer:", err);
      toast.error("Failed to send offer");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchIssues = async () => {
      let url = "";

      if (filteredCategory && sortOrder) {
        url = `http://localhost:8088/issues/category/${sortOrder}?category=${filteredCategory}`;
      } else if (filteredCategory && !sortOrder) {
        url = `http://localhost:8088/issues/category/${filteredCategory}`;
      } else {
        url = `http://localhost:8088/issues/${sortOrder}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (Array.isArray(data)) {
          setIssues(data);
        } else {
          console.error("Unexpected response format:", data);
          setIssues([]); // fallback to empty
        }
      } catch (error) {
        console.error("Error fetching issues: ", error);
        setIssues([]);
      }
    };

    fetchIssues();
  }, [filteredCategory, sortOrder]);

  return (
    <div className="worker-dashboard">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`issues-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <h2 className="page-title">Available Issues</h2>

        <div className="filters">
          <div className="dropdown">
            <label>Category:</label>
            <select
              value={filteredCategory}
              onChange={(e) => setFilteredCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="Electrical">Electric</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Furniture">Furniture</option>
              <option value="Painting">Painting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="dropdown">
            <label>Sort:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newer">Newest First</option>
              <option value="older">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="issues-list">
          {Array.isArray(issues) && issues.length === 0 ? (
            <p className="no-issues-message">No issues found.</p>
          ) : (
            Array.isArray(issues) &&
            issues.map((issue) => (
              <div className="issue-card" key={issue.id}>
                {issue.images && issue.images.length > 0 && (
                  <div className="issue-images-grid">
                    {issue.images.map((img, index) => (
                      <img
                        key={index}
                        className="issue-image"
                        src={img}
                        alt={`issue-${index}`}
                        onClick={() => {
                          setSelectedImageList(issue.images);
                          setSelectedImageIndex(index);
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="issue-content">
                  <h3>{issue.title}</h3>
                  <p>{issue.description}</p>
                  <span className="category-tag">{issue.category}</span>
                  <button
                    className="send-offer-button"
                    onClick={() => openOfferDialog(issue)}
                  >
                    Send Offer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {showOfferDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Send Offer for: {selectedIssue.title}</h3>
              <button onClick={closeOfferDialog}>×</button>
            </div>
            <input
              type="number"
              name="price"
              placeholder="Offer Price"
              value={offerData.price}
              onChange={handleOfferChange}
              required
            />
            <textarea
              name="description"
              placeholder="Offer Description"
              rows="4"
              value={offerData.description}
              onChange={handleOfferChange}
              required
            />
            <div className="dialog-actions">
              <button onClick={closeOfferDialog}>Cancel</button>
              <button onClick={submitOffer}>Submit Offer</button>
            </div>
          </div>
        </div>
      )}
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

      <ToastContainer position="top-right" />
    </div>
  );
};

export default AvailableIssues;
