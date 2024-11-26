import "./CreateInstrumentPage.css"
import {useSelector} from 'react-redux'

import { Navigate } from 'react-router-dom';


export default function CreateInstrumentPage() {
    const sessionUser = useSelector((state) => state.session.user);
    
    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }

    return(
        <>
            <h1>Create An Instrument</h1>
        </>
    )
}