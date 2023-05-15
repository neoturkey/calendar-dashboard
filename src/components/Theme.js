import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    typography: {
        // fontFamily: ['Indie Flower'],
        // fontSize: 20,

        fontFamily: ['Handlee'],
        fontSize: 16,

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
    },
    components: {
        MuiList: {
            styleOverrides: {
                root: {
                    paddingTop: 0,
                    paddingBottom: 0,
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    paddingTop: 0,
                    paddingBottom: 0,
                },
            },
        },
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
