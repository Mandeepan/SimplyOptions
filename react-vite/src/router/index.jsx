import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home';
import IssuerPanel from '../components/IssuerPanel';
import Dashboard from '../components/Dashboard';
import CreateInstrumentPage from '../components/CreateInstrumentPage';
// import GenericError from '../components/Error';
// import * as api from './api';

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: 'login',
                element: <LoginFormPage />,
            },
            {
                path: 'signup',
                element: <SignupFormPage />,
            },
            {
                path: 'issuerPanel',
                element: <IssuerPanel />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path:'createInstrument',
                element:<CreateInstrumentPage />
            }
        ],
    },
]);
