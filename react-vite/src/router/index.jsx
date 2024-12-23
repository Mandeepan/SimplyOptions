import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import Layout from './Layout';
import Home from '../components/Home';
import IssuerPanel from '../components/IssuerPanel';
import Dashboard from '../components/Dashboard';
import CreateInstrumentPage from '../components/CreateInstrumentPage';
import InstrumentDetailPage from '../components/InstrumentDetailPage';
import CreateCompanyPage from "../components/CreateCompanyPage";
import UpdateCompanyPage from '../components/UpdateCompanyPage/UpdateCompanyPage';
import UpdateInstrumentPage from '../components/UpdateInstrumentPage/UpdateInstrumentPage';
import GenericError from '../components/Error'
import Policies from '../components/Policies'
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
                path: 'instruments/:instrumentId',
                element: <InstrumentDetailPage />,
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
            },
            {
                path:'createCompany',
                element:<CreateCompanyPage />
            },
            {
                path:'updateCompany',
                element:<UpdateCompanyPage />
            },
            {
                path:'updateInstrument/:instrumentId',
                element:<UpdateInstrumentPage />
            },
            {
                path:'policies',
                element:<Policies />
            },
            {
                path:'404',
                element:<GenericError />
            },
            {
                path:'*',
                element:<GenericError />
            }
        ],
    },
]);
