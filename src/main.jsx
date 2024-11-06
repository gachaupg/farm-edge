import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { KycProvider } from './utils/context/KycContext.jsx';
import { useState, useEffect } from 'react';
import Loader from './components/loader.jsx';


const Main = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
        <BrowserRouter>
          <KycProvider>
            {loading ? <Loader /> : <App />}
          </KycProvider>
        </BrowserRouter>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);
