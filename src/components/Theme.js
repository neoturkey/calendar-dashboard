import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        badge: {
            main: '#ffffff',
        },
    },
    typography: {
        // fontFamily: ['Indie Flower'],
        fontSize: 20,

        fontFamily: ['Handlee'],
        // fontSize: 16,

        h5: {
            fontFamily: ['Permanent Marker'],
            // fontWeight: 'bold',
            fontSize: 24,
        },
        h6: {
            fontFamily: ['Amatic SC'],
            fontWeight: 'bold',
            fontSize: 20,
        },
        clock: {
            fontFamily: 'Righteous',
        },
    },
    components: {
        MuiListItemText: {
            styleOverrides: {
                secondary: {
                    color: '#888',
                },
            },
        },
    },
});

export const withTheme = (InnerComponent) => {
    const ThemeHOC = (props) => (
        <ThemeProvider theme={theme}>
            <InnerComponent {...props} />
        </ThemeProvider>
    );
    return ThemeHOC;
};
