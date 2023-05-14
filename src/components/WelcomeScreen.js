import { Box, Button, Typography } from '@mui/material';
import { useGapi } from './GAPI';

function WelcomeScreen() {
    const { gapiSignIn } = useGapi();

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Typography>Welcome to Calendar Dashboard</Typography>
            <Button onClick={gapiSignIn}>Login</Button>
        </Box>
    );
}

export default WelcomeScreen;
