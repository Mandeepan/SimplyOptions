
import { useEffect, useState } from 'react'
import {useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import { getAUserThunk, updateAUserThunk, deleteAUserThunk } from '../../redux/user';
import { thunkLogout } from '../../redux/session';
import { getACompanyThunk } from '../../redux/company'
import { getAllTransactionsForAUserThunk, deleteATransactionThunk } from '../../redux/transaction';
import { deleteAListingThunk, getAllListingsForAUserThunk } from '../../redux/listings';
import { deleteAnOfferThunk, getAllOffersForAUserThunk } from '../../redux/offers';
import { useModal } from '../../context/Modal';
import FundingModal from './FundingModal';
import UpdateOfferModal from './UpdateOfferModal';
import UpdateListingModal from './UpdateListingModal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import CustomAlert from '../CustomAlert/CustomAlert';
import { RiPencilFill } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import "./Dashboard.css"

export default function Dashboard(){
    const navigate =useNavigate();
    const dispatch =useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const userInfo = useSelector(state => state.currentUser.currentUser);
    const currentCompany = useSelector(state => state.currentCompany.currentCompany);
    const userTransactions = useSelector((state)=>state.transactions.userTransactions);
    const userListings = useSelector((state)=> state.listings.userListings);
    const userOffers = useSelector((state)=> state.offers.userOffers);
    const { setModalContent, closeModal } = useModal();
    const [activeTab, setActiveTab]=useState('listings');
    const [selectedListingId, setSelectedListingId] = useState(null);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    

    useEffect(() => {
        if (sessionUser && sessionUser.id) {
            dispatch(getAUserThunk(parseInt(sessionUser.id)))
            dispatch( getAllTransactionsForAUserThunk(sessionUser.id))
            dispatch(getAllListingsForAUserThunk(sessionUser.id))
            dispatch(getAllOffersForAUserThunk(sessionUser.id))
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

    const handleShowAlert = (message, type) => {
        setModalContent(
            <CustomAlert
                message={message}
                onClose={() => {
                    closeModal();
                    if (type === "success") closeModal(); // Refresh parent content on success
                }}
            />
        );
    };

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

    const handleSelectListing= (listingId) => {
        setSelectedListingId(listingId)
    };

    const handleSelectOffer= (offerId) => {
        setSelectedOfferId(offerId)
    };

    const handleUpdateClick=(item, itemId)=>{
        if (item ==="listing"){
            setModalContent(
                <UpdateListingModal
                    listingId={itemId} 
                    closeModalFromPage={() => {
                        closeModal();
                        dispatch(getAllListingsForAUserThunk(sessionUser.id)); // Refresh offers after successful submission
                    }}
                />
            );
        } else {
            setModalContent(
                <UpdateOfferModal 
                    offerId={itemId} 
                    closeModalFromPage={() => {
                        closeModal();
                        dispatch(getAllOffersForAUserThunk(sessionUser.id)); // Refresh offers after successful submission
                    }}
                />
            );
        } 
    }

    const handleDeleteOfferProcess = async (offerId) =>{
        const response = await dispatch(deleteAnOfferThunk(offerId))
        if (response.message) {
            handleShowAlert(response.message, "error");
        } else {
            handleShowAlert("Offer deleted successfully!", "success");   
        }
        dispatch(getAllOffersForAUserThunk(sessionUser.id));
    }

    const handleDeleteListingProcess = async (listingId) =>{
        const response = await dispatch(deleteAListingThunk(listingId))
        if (response.message) {
            handleShowAlert(response.message, "error");
        } else {
            handleShowAlert("Listing deleted successfully!", "success");  
        }
        dispatch(getAllListingsForAUserThunk(sessionUser.id));
    }

    const handleCancelTransactionProcess = async (transactionId)=>{
        const response = await dispatch(deleteATransactionThunk(transactionId))
        if (response.message) {
            handleShowAlert(response.message, "error");
        } else {
            handleShowAlert("Transaction cancelled successfully!", "success");  
        }
        dispatch(getAllTransactionsForAUserThunk(sessionUser.id));
    }

    const handleCancelClick=(item, itemId)=>{
        if (item==="offer") {
            setModalContent(
                <ConfirmDeleteModal
                    itemToDelete={"OFFER"}
                    onConfirm={()=> handleDeleteOfferProcess(itemId)}
                    onCancel={closeModal}
                />
            )
        } else if (item==="listing") {
            setModalContent(
                <ConfirmDeleteModal
                    itemToDelete={"LISTING"}
                    onConfirm={()=> handleDeleteListingProcess(itemId)}
                    onCancel={closeModal}
                />
            )
        } else{
            setModalContent(
                <ConfirmDeleteModal
                    itemToDelete={"TRANSACTION"}
                    onConfirm={()=> handleCancelTransactionProcess(itemId)}
                    onCancel={closeModal}
                />
            )
        }
    }
    
    const handleToggleTab = (tab) => {
        setActiveTab(tab); // Set the active tab to either 'listings' or 'offers'
    };



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
                    <h3>LISTINGS & OFFERS</h3>
                </div>
                <div className="std-controller-body">
                <div className="std-info-box">
                    {/* Toggle Buttons for Listings and Offers */}
                    <div className="listings-offers-toggle">
                            <button
                                className={`toggle-button-${activeTab === 'listings' ? 'active' : ''}`} // Add 'active' class based on activeTab state
                                onClick={() => handleToggleTab('listings')} // Set active tab to 'listings'
                            >
                                Listings
                            </button>
                            <button
                                className={`toggle-button-${activeTab === 'offers' ? 'active' : ''}`} // Add 'active' class based on activeTab state
                                onClick={() => handleToggleTab('offers')} // Set active tab to 'offers'
                            >
                                Offers
                            </button>
                    </div>
                    {/* Listings & Offers Table */}
                    {activeTab === 'listings' && ( // Show listings table if activeTab is 'listings'
                            <div className="transaction-table1-container">
                                {userListings && userListings.length > 0 ? (
                                    <table className="transaction-table1">
                                        <thead>
                                            <tr>
                                                <th>Select</th>
                                                <th>Update</th>
                                                <th>Cancel</th>
                                                <th>ID</th>
                                                <th>Company Name</th>
                                                <th>Instrument Name</th>
                                                <th>Instrument Type</th>
                                                <th>Instrument Class</th>
                                                <th>Status</th>
                                                <th>Listed Price</th>
                                                <th>Initial Quantity</th>
                                                <th>Remaining Quantity</th>
                                                <th>Listed On (ET)</th>
                                                <th>Settled On (ET)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userListings.map((listing, index) => (
                                                <tr key={index}>
                                                    <td><input type="radio" 
                                                            className="instrument-radio"
                                                            name="selectedListingId"
                                                            checked={selectedListingId === listing.id}
                                                            onChange={()=>handleSelectListing(listing.id)} />
                                                    </td>
                                                    <td>
                                                        <div className='decision-button-container'>
                                                            <button className="transaction-update-button"
                                                                    onClick={(e)=>{e.preventDefault(); handleUpdateClick("listing", listing.id);}}
                                                                    disabled={selectedListingId !== listing.id}
                                                                    >
                                                                    <RiPencilFill />
                                                            </button>
                                                            </div>
                                                    </td>
                                                    <td>
                                                        <div className='decision-button-container'>
                                                            <button className="transaction-reject-button"
                                                                    onClick={(e)=>{e.preventDefault();handleCancelClick("listing", listing.id)}}
                                                                    disabled={selectedListingId !== listing.id}
                                                                    >
                                                                    <MdOutlineClose />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>{listing.id}</td>
                                                    <td>{listing.company_name}</td>
                                                    <td>{listing.instrument_name}</td>
                                                    <td>{listing.instrument_type}</td>
                                                    <td>{listing.instrument_class}</td>
                                                    <td>{listing.status}</td>
                                                    <td>$ {listing.listed_price.toFixed(2)}</td>
                                                    <td>{listing.initial_quantity}</td>
                                                    <td>{listing.remaining_quantity}</td>
                                                    <td>{listing.listed_on_et}</td>
                                                    <td>{listing.settled_on_et ? listing.settled_on_et : 'Not Settled'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No Listings Available</p>
                                )}
                            </div>
                        )}
                        {activeTab === 'offers' && ( // Show offers table if activeTab is 'offers'
                            <div className="transaction-table1-container">
                                {userOffers && userOffers.length > 0 ? (
                                    <table className="transaction-table1">
                                        <thead>
                                            <tr>
                                                <th>Select</th>
                                                <th>Update</th>
                                                <th>Cancel</th>
                                                <th>ID</th>
                                                <th>Company Name</th>
                                                <th>Instrument Name</th>
                                                <th>Instrument Type</th>
                                                <th>Instrument Class</th>
                                                <th>Status</th>
                                                <th>Offered Price</th>
                                                <th>Initial Quantity</th>
                                                <th>Remaining Quantity</th>
                                                <th>Offered On (ET)</th>
                                                <th>Settled On (ET)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userOffers.map((offer, index) => (
                                                <tr key={index}>
                                                    <td><input type="radio" 
                                                            className="instrument-radio"
                                                            name="selectedOfferId"
                                                            checked={selectedOfferId === offer.id}
                                                            onChange={()=>handleSelectOffer(offer.id)} />
                                                    </td>
                                                    <td>
                                                        <div className='decision-button-container'>
                                                            <button className="transaction-update-button"
                                                                    onClick={(e)=>{e.preventDefault(); handleUpdateClick("offer",offer.id);}}
                                                                    disabled={selectedOfferId !== offer.id}
                                                                    >
                                                                    <RiPencilFill />
                                                            </button>
                                                            </div>
                                                    </td>
                                                    <td>
                                                        <div className='decision-button-container'>
                                                            <button className="transaction-reject-button"
                                                                    onClick={(e)=>{e.preventDefault();handleCancelClick("offer", offer.id)}}
                                                                    disabled={selectedOfferId !== offer.id}
                                                                    >
                                                                    <MdOutlineClose />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>{offer.id}</td>
                                                    <td>{offer.company_name}</td>
                                                    <td>{offer.instrument_name}</td>
                                                    <td>{offer.instrument_type}</td>
                                                    <td>{offer.instrument_class}</td>
                                                    <td>{offer.status}</td>
                                                    <td>$ {offer.offered_price.toFixed(2)}</td>
                                                    <td>{offer.initial_quantity}</td>
                                                    <td>{offer.remaining_quantity}</td>
                                                    <td>{offer.offered_on_et}</td>
                                                    <td>{offer.settled_on_et ? offer.settled_on_et : 'Not Settled'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No Offers Available</p>
                                )}
                            </div>)}
                </div>
                </div>
            </div>



            <div className="std-controller">
                <div className="std-controller-head-banner">
                    <h3>TRANSACTIONS</h3>
                </div>
                    <div className="company-controller-body">
                    <div className="company-info-box">
                        <h3>Total Transactions : {userTransactions?.length}</h3>
                        {userTransactions && userTransactions.length > 0 && (
                        <div className="transaction-table-container">
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Company</th>
                                    <th>Instrument</th>
                                    <th>Position</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Value</th>
                                    <th>Fees</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                    <th>Settled On</th>  
                                    <th>Cancel</th>                              
                                </tr>
                            </thead>
                            <tbody className="transaction-table-body">
                                {userTransactions.map((transaction, index) => (
                                    <tr key={index} className="transaction-row">
                                        <td>{transaction.id}</td>
                                        <td>{transaction.company_name}</td>
                                        <td>{transaction.instrument_name}</td>
                                        <td>{transaction.position}</td>
                                        <td>$ {transaction.transaction_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>{transaction.transaction_quantity.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                        <td>$ {(transaction.transaction_quantity*transaction.transaction_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>$ {transaction.transaction_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td>{transaction.status}</td>
                                        <td>{transaction.created_at_et}</td>
                                        <td>{transaction.settled_on_et}</td>
                                        <td><button
                                                className="cancel-transaction-button"
                                                disabled={transaction.status!="Pending"}
                                                onClick={(e)=>{e.preventDefault();handleCancelClick("transaction", transaction.id)}}
                                            >
                                            Cancel</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    )}
                    </div>
            </div>
            </div>
        </div>
    )
}