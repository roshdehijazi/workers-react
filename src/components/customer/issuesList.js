import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const SimpleIssueList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch issues from API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get('http://localhost:8088/issues');
        setIssues(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load issues');
        setLoading(false);
        console.error('Error fetching issues:', err);
      }
    };

    fetchIssues();
  }, []);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'ELECTRICAL': return 'primary';
      case 'PLUMBING': return 'secondary';
      case 'FURNITURE': return 'success';
      case 'PAINTING': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Reported Issues
      </Typography>

      {issues.length > 0 ? (
        <Grid container spacing={3}>
          {issues.map((issue) => (
            <Grid item xs={12} sm={6} md={4} key={issue.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {issue.picture && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={issue.picture}
                    alt={issue.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {issue.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {issue.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      label={issue.category} 
                      color={getCategoryColor(issue.category)} 
                      size="small" 
                    />
                    <Chip 
                      label={issue.isFinished ? 'Completed' : 'Pending'} 
                      color={issue.isFinished ? 'success' : 'warning'} 
                      size="small" 
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" textAlign="center" sx={{ mt: 4 }}>
          No issues found
        </Typography>
      )}
    </Box>
  );
};

export default SimpleIssueList;