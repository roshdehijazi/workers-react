import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Card, CardContent } from "@mui/material";
import WorkerSideBar from "./sideBar";
import "../../styles/worker/offers.css";

const Offers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [offers, setOffers] = useState([]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    // 🛠️ MOCK Data - later replace with API call
    const mockOffers = [
      {
        id: 1,
        title: "Fix Living Room Light",
        description: "Need an electrician to fix light problem.",
        category: "Electric",
        customerName: "John Doe"
      },
      {
        id: 2,
        title: "Paint Bedroom Walls",
        description: "Need help painting a small bedroom.",
        category: "Painting",
        customerName: "Jane Smith"
      }
    ];

    setOffers(mockOffers);
  }, []);

  const [priceInputs, setPriceInputs] = useState({});

  const handlePriceChange = (id, value) => {
    setPriceInputs({ ...priceInputs, [id]: value });
  };

  const handleSendOffer = (id) => {
    const price = priceInputs[id];
    if (!price) {
      alert("Please enter a price before sending the offer.");
      return;
    }
    console.log(`Offer sent for issue ID ${id} with price: $${price}`);
    alert(`Offer sent successfully for $${price}!`);
    // 🔥 Later: API call to backend
  };

  const handleContactCustomer = (customerName) => {
    console.log(`Opening chat with ${customerName}`);
    alert(`Open chat with ${customerName} (build later)`);
  };

  return (
    <div className="worker-dashboard">
      <WorkerSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box className={`offers-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Typography variant="h4" className="page-title">Available Offers</Typography>

        <Box className="offers-list">
          {offers.map((offer) => (
            <Card key={offer.id} className="offer-card">
              <CardContent>
                <Typography variant="h6" className="offer-title">{offer.title}</Typography>
                <Typography className="offer-description">{offer.description}</Typography>
                <Typography className="offer-category">Category: {offer.category}</Typography>

                <Box className="price-section">
                  <TextField
                    label="Your Price ($)"
                    type="number"
                    value={priceInputs[offer.id] || ""}
                    onChange={(e) => handlePriceChange(offer.id, e.target.value)}
                    fullWidth
                    className="price-input"
                  />
                  <Button
                    variant="contained"
                    className="send-button"
                    onClick={() => handleSendOffer(offer.id)}
                  >
                    Send Offer
                  </Button>
                  <Button
                    variant="outlined"
                    className="contact-button"
                    onClick={() => handleContactCustomer(offer.customerName)}
                  >
                    Contact Customer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Offers;
