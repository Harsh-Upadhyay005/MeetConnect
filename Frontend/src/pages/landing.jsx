import React from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid, Typography, Container } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VideocamIcon from '@mui/icons-material/Videocam'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function LandingPage() {

    const router = useNavigate();

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
                        startIcon={<VideocamIcon />}
                        onClick={() => router("/aljk23")}
                        sx={{ 
                            color: '#ff6b6b',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.85rem', md: '1rem' },
                            display: { xs: 'none', sm: 'flex' },
                            '&:hover': { 
                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        Join as Guest
                    </Button>
                    <Button 
                        startIcon={<PersonAddIcon />}
                        onClick={() => router("/auth")}
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
                        Register
                    </Button>
                    <Button 
                        startIcon={<LoginIcon />}
                        onClick={() => router("/auth")}
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
                        Login
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
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        {/* Left Panel - Content */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                animation: 'slideInLeft 0.8s ease-out',
                                '@keyframes slideInLeft': {
                                    '0%': { opacity: 0, transform: 'translateX(-50px)' },
                                    '100%': { opacity: 1, transform: 'translateX(0)' }
                                }
                            }}>
                                <Typography variant="h2" sx={{ 
                                    fontWeight: 900,
                                    marginBottom: '1.5rem',
                                    color: '#fff',
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    lineHeight: 1.1,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                                }}>
                                    <span style={{ 
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: 900
                                    }}>Connect</span> with Your Loved Ones
                                </Typography>
                                
                                <Typography variant="h5" sx={{ 
                                    color: 'rgba(255, 255, 255, 0.95)',
                                    marginBottom: '3rem',
                                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                                    lineHeight: 1.6,
                                    fontWeight: 500,
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                                }}>
                                    Cover distance with high-quality video calls. Connect anytime, anywhere.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button 
                                        onClick={() => router("/auth")}
                                        variant='contained'
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            color: '#ff6b6b',
                                            padding: '1rem 2.5rem',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                            '&:hover': {
                                                background: '#ffffff',
                                                boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                                                transform: 'translateY(-3px)',
                                                transition: 'all 0.3s ease'
                                            }
                                        }}
                                    >
                                        Get Started
                                    </Button>

                                    <Button 
                                        onClick={() => router("/aljk23")}
                                        variant='outlined'
                                        size="large"
                                        startIcon={<VideocamIcon />}
                                        sx={{
                                            borderColor: 'rgba(255, 255, 255, 0.9)',
                                            color: '#ffffff',
                                            padding: '1rem 2.5rem',
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            borderRadius: '12px',
                                            textTransform: 'none',
                                            borderWidth: '2px',
                                            backdropFilter: 'blur(10px)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            '&:hover': {
                                                borderColor: '#ffffff',
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                borderWidth: '2px',
                                                transform: 'translateY(-3px)',
                                                transition: 'all 0.3s ease'
                                            }
                                        }}
                                    >
                                        Quick Join
                                    </Button>
                                </Box>

                                {/* Feature Highlights */}
                                <Grid container spacing={3} sx={{ marginTop: '3rem' }}>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ 
                                                fontSize: '2rem', 
                                                fontWeight: 800, 
                                                color: '#fff',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                HD
                                            </Typography>
                                            <Typography sx={{ 
                                                color: 'rgba(255, 255, 255, 0.9)', 
                                                fontSize: '0.9rem',
                                                fontWeight: 600 
                                            }}>
                                                Quality Video
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ 
                                                fontSize: '2rem', 
                                                fontWeight: 800, 
                                                color: '#fff',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                🔒
                                            </Typography>
                                            <Typography sx={{ 
                                                color: 'rgba(255, 255, 255, 0.9)', 
                                                fontSize: '0.9rem',
                                                fontWeight: 600 
                                            }}>
                                                Secure Calls
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography sx={{ 
                                                fontSize: '2rem', 
                                                fontWeight: 800, 
                                                color: '#fff',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                                            }}>
                                                ⚡
                                            </Typography>
                                            <Typography sx={{ 
                                                color: 'rgba(255, 255, 255, 0.9)', 
                                                fontSize: '0.9rem',
                                                fontWeight: 600 
                                            }}>
                                                Instant Connect
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
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
                                    src="/mobile.png" 
                                    alt="Video Call" 
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}