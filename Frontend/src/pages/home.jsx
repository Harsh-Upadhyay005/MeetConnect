import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, TextField, Box, Grid, Typography, Snackbar, Alert } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AuthContext } from '../Contexts/AuthContext.jsx';

function HomeComponent() {

    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [error, setError] = useState("");

    const {addToUserHistory} = useContext(AuthContext);
    
    let handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) {
            setError("Please enter a meeting code");
            return;
        }
        try {
            await addToUserHistory(meetingCode);
            navigate(`/${meetingCode}`);
        } catch (err) {
            setError("Failed to join meeting. Please try again.");
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleJoinVideoCall();
        }
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Navigation Bar */}
            <Box sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: { xs: '1rem 1.5rem', md: '1.2rem 3rem' },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h5" sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '1.3rem', md: '1.8rem' },
                    letterSpacing: '-0.5px'
                }}>
                    Meet Connect
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                    <Button 
                        startIcon={<RestoreIcon />}
                        onClick={() => navigate("/history")}
                        sx={{ 
                            color: '#ff6b6b',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.85rem', md: '1rem' },
                            '&:hover': { 
                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        History
                    </Button>
                    <Button 
                        startIcon={<LogoutIcon />}
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/auth");
                        }}
                        variant="outlined"
                        sx={{ 
                            borderColor: '#ff6b6b',
                            color: '#ff6b6b',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.85rem', md: '1rem' },
                            borderWidth: '2px',
                            '&:hover': { 
                                borderColor: '#ee5a6f',
                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                borderWidth: '2px',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: { xs: '2rem 1rem', md: '3rem 2rem' }
            }}>
                <Grid container spacing={4} maxWidth="1200px" margin="0 auto" alignItems="center">
                    {/* Left Panel - Content */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            padding: { xs: '2rem', md: '3rem' },
                            borderRadius: '24px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                        }}>
                            <Typography variant="h3" sx={{ 
                                fontWeight: 800,
                                marginBottom: '1rem',
                                color: '#2d3436',
                                fontSize: { xs: '1.8rem', md: '2.5rem' },
                                lineHeight: 1.2
                            }}>
                                Connect with Anyone, Anytime
                            </Typography>
                            
                            <Typography variant="body1" sx={{ 
                                color: '#636e72',
                                marginBottom: '2.5rem',
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                lineHeight: 1.6
                            }}>
                                Enter a meeting code and start your video call instantly. No downloads, no hassle.
                            </Typography>

                            <Box sx={{ marginBottom: '1.5rem' }}>
                                <TextField 
                                    value={meetingCode}
                                    onChange={e => setMeetingCode(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter meeting code"
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            fontSize: '1.1rem',
                                            backgroundColor: '#fff',
                                            '& fieldset': {
                                                borderColor: '#dfe6e9',
                                                borderWidth: '2px'
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#ff6b6b',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#ff6b6b',
                                            },
                                        }
                                    }}
                                />
                            </Box>

                            <Button 
                                onClick={handleJoinVideoCall}
                                variant='contained'
                                fullWidth
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                                    padding: '1rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.35)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)',
                                        boxShadow: '0 12px 35px rgba(255, 107, 107, 0.5)',
                                        transform: 'translateY(-3px)',
                                        transition: 'all 0.3s ease'
                                    }
                                }}
                            >
                                Join Meeting
                            </Button>
                        </Box>
                    </Grid>

                    {/* Right Panel - Image */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            animation: 'float 3s ease-in-out infinite',
                            '@keyframes float': {
                                '0%, 100%': { transform: 'translateY(0px)' },
                                '50%': { transform: 'translateY(-20px)' }
                            }
                        }}>
                            <img 
                                src="/logo3.png" 
                                alt="Meet Connect" 
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.2))',
                                    borderRadius: '20px'
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={() => setError("")}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setError("")} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default withAuth(HomeComponent);
