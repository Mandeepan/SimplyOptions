import { useEffect } from 'react'
import {useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import { getAUserThunk } from '../../redux/user';

import "./IssuerPanel.css"

export default function IssuerPanel() {
    const navigate =useNavigate()
    const dispatch =useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const userInfo = useSelector(state => state.currentUser.currentUser)

    useEffect(() => {
        dispatch(getAUserThunk(parseInt(sessionUser.id)))
    }, [dispatch, sessionUser]);
    
    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }


    const handleBecomeAnIssuer= ()=>{
        navigate('/createCompany')
    }

    const handleAddInstrument=()=>{
        navigate('/createInstrument')
    }

    return (
        <div className="issuer-panel-page-container">
        {userInfo.is_issuer?
        <div className="issuer-container">
            <h2> Welcome to SimplyOptions Issuer Panel, {sessionUser.first_name}!</h2>
            <div className="company-controller">
                <h3>Company</h3>
                <div className="company-info-box">----COMPANY INFO----</div>
                <div className="company-buttons">
                    <button className="update-company-button">Update Company Info</button>
                    <button className="delete-company-button">Delete Company Account</button>
                </div>
            </div>
            <div className="instrument-controller">
                <h3>Instruments</h3> 
                {/*If the length of instrument is empty, show label to ask user to add, meanwhile hidden the update and delete button */}
                <div className="instrument-info-box">----INSTRUMENT LOOP LIST WITH SELECT BOX----</div>
                <div className="instrument-buttons">
                    <button className="add-new-instrument-button" onClick={handleAddInstrument}>Add A New Instrument</button>
                    <button className="update-instrument-button">Update Selected Instrument</button>
                    <button className="delete-instrument-button">Delete Selected Instrument</button>
                </div>
            </div>
        </div>
        :
        <div className="non-issuer-container">
            <h3>Your current role is not an issuer, you can become an issuer by adding your company.</h3>
            <p>Note : Employer verification is under development and new feature is coming soon.</p>
            <button className="become-issuer-button" onClick={handleBecomeAnIssuer}>Add A Company To Become An Issuer</button>
        </div>
            
        }
        </div>
    )
}
