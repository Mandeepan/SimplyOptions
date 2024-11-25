import {useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';

import "./IssuerPanel.css"

export default function IssuerPanel() {
    const navigate =useNavigate()
    const sessionUser = useSelector((state) => state.session.user);
    
    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }

    const handleBecomeAnIssuer= ()=>{
        navigate('/createInstrument')
    }

    return (
        <div className="issuer-panel-page-container">
        {sessionUser.is_issuer?
        <div className="issuer-container">
            <h1> Issuer Panel - ISSUER</h1>
        </div>
        :
        <div className="non-issuer-container">
            <h3>Your current role is non issuer, you can become issuer by listing a new instrument.</h3>
            <p>Note : Employer verification is under development and new feature is coming soon.</p>
            <button className="become-issuer-button" onClick={handleBecomeAnIssuer}>List A New Instrument</button>
        </div>
            
        }
        </div>
    )
}
