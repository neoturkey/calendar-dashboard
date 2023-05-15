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
            <Typography>{currentTime.format('HH:mm:ss')}</Typography>
            <Typography>{currentTime.format('dddd D MMMM, YYYY')}</Typography>
        </Paper>
    );
}
