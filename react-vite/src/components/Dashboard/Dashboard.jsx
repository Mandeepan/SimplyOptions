
import {useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import "./Dashboard.css"

export default function Dashboard(){
    const sessionUser = useSelector((state) => state.session.user);

    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }
    
    return (
        <div className="dashboard-container">
        <h1>Dashboard is coming soon...</h1>
        </div>
    )
}