
import { useEffect } from 'react'
import {useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import { getAUserThunk, updateAUserThunk, deleteAUserThunk } from '../../redux/user';
import { thunkLogout } from '../../redux/session';
import { getACompanyThunk } from '../../redux/company'
import { useModal } from '../../context/Modal';
import FundingModal from './FundingModal';

import "./Dashboard.css"

export default function Dashboard(){
    const navigate =useNavigate()
    const dispatch =useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const userInfo = useSelector(state => state.currentUser.currentUser);
    const currentCompany = useSelector(state => state.currentCompany.currentCompany)
    const { setModalContent, closeModal } = useModal();

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
        navigate('/issuerPanel')
    }

    const handleUpdateBalanceProcess=async (userId, amount)=>{
            const updatedUserInfo = {
                user_cash_balance: userInfo.user_cash_balance+parseFloat(amount),
                user_available_balance: userInfo.user_available_balance+parseFloat(amount)
            };
            try {
                await dispatch(updateAUserThunk(userId, updatedUserInfo));
                await dispatch(getAUserThunk(userId));
                closeModal(); 
            } catch (error) {
                console.error('Error updating user balance:', error);
                alert("Failed to update balance. Please try again.");
            }
    };

    const handleAddFundClick =(userId)=>{
        setModalContent(
            <FundingModal
                itemToProceed={"DEPOSIT"}
                onConfirm={(amount) => handleUpdateBalanceProcess(userId, amount)}
                onCancel={closeModal}
            />
        );
    }

    const handleWithdrawFundClick=(userId)=>{
        setModalContent(
            <FundingModal
                itemToProceed={"WITHDRAW"}
                onConfirm={(amount) => handleUpdateBalanceProcess(userId, -amount)}
                onCancel={closeModal}
            />
        );
    }

    const handleLiquidateDeactivateProcess=async (userId)=>{
        if (userId) {
            try{
                await dispatch(deleteAUserThunk(parseInt(userId)))
                await dispatch(thunkLogout())
                closeModal()
                navigate('/')
            }catch (error) {
                console.error('Error deleting user', error);
                alert("Can not delete this user record, please reach out to help@simplyoptions.com")
                closeModal()
                navigate('/dashboard')
            }
        } else {
            console.log(`**** user id is ${userId}`)
            alert("Can not delete this user record, please reach out to help@simplyoptions.com")
            closeModal()
            navigate('/dashboard')
        }
        
    }

    const handleLiquidateFundClick=(userId)=>{
        setModalContent(
            <FundingModal
                itemToProceed={"LIQUIDATE"}
                onConfirm={() => handleLiquidateDeactivateProcess(userId)}
                onCancel={closeModal}
            />
        );
    }
    
    return (
        <div className="dashboard-container">
            <h1>SimplyOptions User Dashboard</h1>
            <div className="std-controller">
                <div className="std-controller-head-banner">
                    <h3>USER PROFILE</h3>
                </div>
                <div className="std-controller-body">
                    <div className="std-info-box">
                            <table className="std-info-table">
                                <tbody>
                                    <tr>
                                        <td className="std-info-heading">Full Name:</td>
                                        <td className="std-info-content">{userInfo.first_name} {userInfo.last_name}</td>
                                    </tr>
                                    <tr>
                                        <td className="std-info-heading">Email:</td>
                                        <td className="std-info-content">{userInfo.email ? userInfo.email : "Not Available."}</td>
                                    </tr>
                                    <tr>
                                        <td className="std-info-heading">Role:</td>
                                        <td className="std-info-content">{userInfo.is_issuer ? "Issuer" : "Non-issuer"}</td>
                                    </tr>
                                    <tr>
                                        <td className="std-info-heading">Company:</td>
                                        <td className="std-info-content">{userInfo.company_id && currentCompany? currentCompany.company_name : <a onClick={handleBecomeAnIssuer}>Click here to become an issuer today!</a>}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>  
                </div>

            <div className="std-controller">
                <div className="std-controller-head-banner">
                    <h3>FUNDING</h3>
                </div>
                <div className="std-controller-body">
                <div className="std-info-box">
                            <table className="std-info-table">
                                <tbody>
                                    <tr>
                                        <td className="std-info-heading">Cash Balance:</td>
                                        <td className="std-info-content">$ {userInfo.user_cash_balance? userInfo.user_cash_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="std-info-heading">Amount Payable:</td>
                                        <td className="std-info-content">$ ({userInfo.amount_to_be_debited? userInfo.amount_to_be_debited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"})</td>
                                    </tr>
                                    <tr>
                                        <td className="std-info-heading">Amount Receivable:</td>
                                        <td className="std-info-content">$ {userInfo.amount_to_be_credited? userInfo.amount_to_be_credited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="std-info-heading">Available Balance</td>
                                        <td className="std-info-content"> $ {userInfo.user_available_balance? userInfo.user_available_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    <div className="funding-buttons">
                        <button className="add-fund-button" onClick={(e)=>{
                            e.preventDefault();
                            handleAddFundClick(sessionUser.id)}}>Deposit Fund</button>
                        <button className="withdraw-fund-button" onClick={(e)=>{
                            e.preventDefault();
                            handleWithdrawFundClick(sessionUser.id)
                        }}>Withdraw Fund</button>
                        <button className="deactivate-account-button" onClick={(e)=>{
                            e.preventDefault();
                            handleLiquidateFundClick(sessionUser.id)
                        }}>*Click here to deactivate account</button>
                    </div>
                </div>
            </div>

            <div className="std-controller">
                <div className="std-controller-head-banner">
                    <h3>TRANSACTIONS</h3>
                </div>
                <div className="std-controller-body">
                    <div className="std-info-box">
                        <h3>Transaction history is coming soon...</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}