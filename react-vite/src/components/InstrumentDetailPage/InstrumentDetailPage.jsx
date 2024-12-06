import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

import "./InstrumentDetailPage.css"

export function InstrumentDetailPage(){
    const sessionUser = useSelector((state) => state.session.user);

    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }  

    return(
        <div className="instrument-detail-page">
        <h1>Detail Instrument Page is coming soon...</h1>
        </div>
    )
}