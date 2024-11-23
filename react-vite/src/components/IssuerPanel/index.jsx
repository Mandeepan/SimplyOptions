import {useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

export default function Profile() {
    const sessionUser = useSelector((state) => state.session.user);

    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }
    return (
        <>
        <h1> Issuer Panel</h1>
        </>
    )
}
