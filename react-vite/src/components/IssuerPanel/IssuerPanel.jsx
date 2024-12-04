import { useEffect } from 'react'
import {useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import { getAUserThunk } from '../../redux/user';
import { getACompanyThunk } from '../../redux/company'
import CompanyInfoBox from './CompanyInfoBox';
import InstrumentBox from './InstrumentBox';
import "./IssuerPanel.css"

export default function IssuerPanel() {
    const navigate =useNavigate()
    const dispatch =useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const userInfo = useSelector(state => state.currentUser.currentUser);
    const currentCompany = useSelector(state => state.currentCompany.currentCompany)

    useEffect(() => {
        if (sessionUser && sessionUser.id) {
            dispatch(getAUserThunk(parseInt(sessionUser.id)))
        }
    }, [dispatch, sessionUser]);

    useEffect(() => {
        if (userInfo?.is_issuer && userInfo.company_id) {
            dispatch(getACompanyThunk(userInfo.company_id));
        }
    }, [dispatch, userInfo]);
    
    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }

    const handleBecomeAnIssuer= ()=>{
        navigate('/createCompany')
    }



    return (
        <div className="issuer-panel-page-container">
        {userInfo.is_issuer && userInfo.company_id?
        <div className="issuer-container">
            <h2> Welcome to SimplyOptions Issuer Panel, {sessionUser.first_name}!</h2>
            {currentCompany && (
                        <>
                            <CompanyInfoBox currentCompany={currentCompany} userId={sessionUser.id} />
                            <InstrumentBox />
                        </>
                    )}  
        </div>
        :
        <div className="non-issuer-container">
            <h3>Your current role is not an issuer or you signed up as an issuer but have not added a company profile yet.</h3>
            <p>Note : Employer verification is under development and new feature is coming soon.</p>
            <button className="become-issuer-button" onClick={handleBecomeAnIssuer}>Add A Company To Become An Issuer</button>
        </div>
        }
        </div>
    )
}
