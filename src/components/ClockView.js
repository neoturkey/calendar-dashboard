import { Paper, Typography } from '@mui/material';
import { useTimeManager } from './TimeManager';

export default function ClockView({ sx }) {
    const { currentTime } = useTimeManager();

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                ...sx,
            }}
        >
            <Typography sx={{ fontSize: '3rem' }} variant="clock">
                {currentTime.format('HH:mm:ss')}
            </Typography>
            <Typography sx={{ fontSize: '2rem' }} variant="clock">
                {currentTime.format('dddd D MMMM, YYYY')}
            </Typography>
        </Paper>
    );
}
