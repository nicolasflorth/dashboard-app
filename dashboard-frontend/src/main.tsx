import React from 'react';
import ReactDOM from 'react-dom/client'; // for React 18
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.scss'; // Global styles
import './styles/theme.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';

const queryClient = new QueryClient();

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
	<ThemeProvider>
		<React.StrictMode>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
					{/* <ReactQueryDevtools initialIsOpen={false} />*/}
				</QueryClientProvider>
			</Provider>
		</React.StrictMode>
	</ThemeProvider>
);

