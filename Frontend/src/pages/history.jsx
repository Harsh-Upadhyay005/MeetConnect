import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../Contexts/AuthContext.jsx'
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, IconButton, Container, CircularProgress } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';

export default function History() {

    const { getHistoryOfUser } = useContext(AuthContext);
    const [meetings, setMeetings] = useState([])
    const [loading, setLoading] = useState(true)
    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getHistoryOfUser();
                console.log('History data:', history);
                setMeetings(history);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [getHistoryOfUser])

    let formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${day}/${month}/${year} at ${hours}:${minutes}`
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
            padding: '2rem 0'
        }}>
            {/* Navigation */}
            <Container maxWidth="md">
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    marginBottom: '2rem'
                }}>
                    <IconButton 
                        onClick={() => routeTo("/home")}
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            '&:hover': {
                                backgroundColor: '#fff',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        <ArrowBackIcon sx={{ color: '#ff6b6b' }} />
                    </IconButton>
                    <Typography variant="h4" sx={{ 
                        fontWeight: 800,
                        color: '#fff',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        Meeting History
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <CircularProgress sx={{ color: '#fff' }} />
                    </Box>
                ) : meetings.length !== 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {meetings.map((meeting, index) => (
                            <Card 
                                key={index} 
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                <CardContent sx={{ padding: '1.5rem !important' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{
                                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                                            borderRadius: '12px',
                                            padding: '0.75rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <HistoryIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ 
                                                fontWeight: 700,
                                                color: '#2d3436',
                                                marginBottom: '0.25rem'
                                            }}>
                                                Meeting Code: {meeting.activity}
                                            </Typography>
                                            <Typography variant="body2" sx={{ 
                                                color: '#636e72',
                                                fontSize: '0.9rem'
                                            }}>
                                                {formatDate(meeting.timestamp)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        padding: '4rem 2rem',
                        textAlign: 'center'
                    }}>
                        <HistoryIcon sx={{ fontSize: '4rem', color: '#dfe6e9', marginBottom: '1rem' }} />
                        <Typography variant="h5" sx={{ 
                            fontWeight: 700,
                            color: '#2d3436',
                            marginBottom: '0.5rem'
                        }}>
                            No Meeting History
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#636e72' }}>
                            Your meeting history will appear here once you join or create meetings.
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    )
}