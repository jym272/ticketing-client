import '@src/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@src/store';
import { ThemeProvider } from 'styled-components';

const theme = {
    colors: {
        primary: '#0070f3'
    },
    constants: {
        headerHeight: '64px'
    }
};

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </ThemeProvider>
    );
}
