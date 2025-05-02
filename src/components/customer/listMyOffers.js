import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import SideBar from "./sideBar";
import "../../styles/customer/listMyOffers.css";

const mockOffers = [
  {
    id: "1",
    title: "Fixing kitchen leak",
    description:
      "I can fix the leak within 1 day using high-quality materials.",
    price: 250,
    customerName: "Ali Assadi",
  },
  {
    id: "2",
    title: "Repainting living room",
    description:
      "I'll repaint with your chosen color, clean finish guaranteed.",
    price: 500,
    customerName: "Dana Cohen",
  },
];

const ListMyOffers = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="worker-dashboard">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        className={`offers-container ${
          isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <Typography variant="h4" className="offers-title">
          My Offers
        </Typography>

        <Grid container spacing={3}>
          {mockOffers.map((offer) => (
            <Grid item xs={12} md={6} key={offer.id}>
              <Card className="offer-card">
                <CardContent>
                  <Typography variant="h6">{offer.title}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {offer.description}
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    Price: ${offer.price}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Sent to: {offer.customerName}
                  </Typography>
                </CardContent>
                <CardActions className="offer-actions">
                  <Button variant="contained" color="success">
                    Accept
                  </Button>
                  <Button variant="outlined" color="error">
                    Decline
                  </Button>
                  <Button variant="text" color="primary">
                    Message
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default ListMyOffers;
