import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { getAnInstrumentThunk } from "../../redux/instrument";
import { getAllOffersForAnInstrumentThunk, getAllOffersForAUserThunk } from "../../redux/offers";
import { getAllListingsForAnInstrumentThunk, getAllListingsForAUserThunk} from "../../redux/listings";
import { useModal } from '../../context/Modal';
import { SlGhost } from "react-icons/sl";

import AddOfferModal from "./AddOfferModal";
import AddListingModal from "./AddListingModal";
import ChatModal from "./ChatModal";
import TakeOfferModal from "./TakeOfferModal";
import BidListingModal from "./BidListingModal";




import "./InstrumentDetailPage.css";

export function InstrumentDetailPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const { instrumentId } = useParams();
    const instrument = useSelector((state) => state.instruments.currentInstrument); 
    const offers = useSelector((state => state.offers.instrumentOffers));
    const listings = useSelector(state => state.listings.instrumentListings)
    const userOffers = useSelector(state => state.offers.userOffers)
    const userListings = useSelector(state => state.listings.userListings)
    const { setModalContent, closeModal } = useModal();
    const [currentUserListing, setCurrentUserListing]=useState({})
    const [currentUserOffer, setCurrentUserOffer]=useState({})
    
    

    useEffect(() => {
        if (instrumentId) {
            dispatch(getAnInstrumentThunk(instrumentId)); 
            dispatch(getAllOffersForAnInstrumentThunk(instrumentId))
            dispatch(getAllListingsForAnInstrumentThunk(instrumentId))
        }
        if (sessionUser){
            dispatch(getAllOffersForAUserThunk(sessionUser.id))
            dispatch( getAllListingsForAUserThunk(sessionUser.id))
        }
    }, [dispatch, instrumentId, sessionUser]);

    //check if any of the offers / listing belong to current user is for the current instrument
    useEffect(()=>{
        if (userListings) {
            userListings.map(listing => {
                if (listing.instrument_id ==instrumentId){
                    setCurrentUserListing(listing)
                }
            })
        }
        if (userOffers){
            userOffers.map(offer => {
                if (offer.instrument_id ==instrumentId){
                    setCurrentUserOffer(offer)
                }
            })
        }
    },[userListings,userOffers, instrumentId])


    if (!sessionUser) {
        return <Navigate to='/' />;
    }

    if (!instrument || Object.keys(instrument).length === 0) {
        return <div>Loading instrument details...</div>; // Show loading message while instrument details are being fetched
    }

    

    
    


    const handleGhostButtonClick = () => {
        setModalContent(
            <ChatModal 
            closeModalFromPage={closeModal}
            />
        )
    };
    // for adding offer / listing offer
    const handleOpenAddOfferModal=()=>{
        setModalContent(
            <AddOfferModal 
                instrumentId={instrumentId} 
                closeModalFromPage={() => {
                    closeModal();
                    dispatch(getAllOffersForAnInstrumentThunk(instrumentId)); // Refresh offers after successful submission
                    dispatch(getAllOffersForAUserThunk(sessionUser.id))
                    
                }}
            />
        );
    }
    const handleOpenAddListingModal=()=>{
        setModalContent(
            <AddListingModal 
                instrumentId={instrumentId} 
                closeModalFromPage={() => {
                    closeModal();
                    dispatch(getAllListingsForAnInstrumentThunk(instrumentId)); // Refresh listings after successful submission
                    dispatch( getAllListingsForAUserThunk(sessionUser.id))
                }}
            />
        );
    }

    const handleOpenTakeOfferModal=(offer)=>{
        setModalContent(
            <TakeOfferModal
                offer={offer}
                listing={currentUserListing}
                closeModalFromPage={() => {
                    closeModal();
                    dispatch(getAllListingsForAnInstrumentThunk(instrumentId)); // Refresh listings after successful submission
                    dispatch( getAllListingsForAUserThunk(sessionUser.id))
                    dispatch(getAllOffersForAnInstrumentThunk(instrumentId)); 
                    dispatch(getAllOffersForAUserThunk(sessionUser.id))
                }}
            />
        );
    }

    const handleOpenBidListingModal=(listing) =>{
        setModalContent(
            <BidListingModal
                offer={currentUserOffer}
                listing={listing}
                closeModalFromPage={() => {
                    closeModal();
                    dispatch(getAllListingsForAnInstrumentThunk(instrumentId)); // Refresh listings after successful submission
                    dispatch( getAllListingsForAUserThunk(sessionUser.id))
                    dispatch(getAllOffersForAnInstrumentThunk(instrumentId)); 
                    dispatch(getAllOffersForAUserThunk(sessionUser.id))
                }}
            />
        );
    }



    return (
        <div className="instrument-detail-page">
            <div className="detail-page-header">
                <h1>{instrument.instrument_name}</h1>
                <button className="simple-buddy-button" onClick={handleGhostButtonClick}><SlGhost /></button>
                
            </div>
            
            <div className={`instrument-details`}>
                <h2>Instrument Information</h2>
                <table className="instrument-details-table">
                    <tbody>
                        <tr>
                            <td><strong>Type:</strong></td>
                            <td>{instrument.instrument_type}</td>
                        </tr>
                        <tr>
                            <td><strong>Class:</strong></td>
                            <td>{instrument.instrument_class}</td>
                        </tr>
                        <tr>
                            <td><strong>Issued On:</strong></td>
                            <td>{new Date(instrument.issued_on_et).toLocaleDateString('en-US', {
                                                                    month: 'long', 
                                                                    day: '2-digit', 
                                                                    year: 'numeric',
                                                                })}</td>
                        </tr>
                        <tr>
                            <td><strong>Updated Value:</strong></td>
                            <td>${instrument.updated_value ? instrument.updated_value.toLocaleString() : "N/A"}</td>
                        </tr>
                        <tr>
                            <td><strong>Issued Quantity:</strong></td>
                            <td>{instrument.updated_issued_quantity ? instrument.updated_issued_quantity.toLocaleString() : "N/A"}</td>
                        </tr>
                        <tr>
                            <td><strong>Updated Price:</strong></td>
                            <td>${instrument.updated_price ? instrument.updated_price.toFixed(2) : "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Company Information</h2>
                <table className="company-details-table">
                    <tbody>
                        <tr>
                            <td><strong>Company Name:</strong></td>
                            <td id="company_name_logo_container">
                                <img src={instrument.company?.logo_url} className="company_logo"></img>
                                {instrument.company?.company_name || "N/A"}
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Description:</strong></td>
                            <td>{instrument.company?.short_description || "N/A"}</td>
                        </tr>
                        <tr>
                            <td><strong>Founded Year:</strong></td>
                            <td>{instrument.company?.founded_year || "N/A"}</td>
                        </tr>
                        <tr>
                            <td><strong>Operating Status:</strong></td>
                            <td>{instrument.company?.operating_status || "N/A"}</td>
                        </tr>
                        <tr>
                            <td><strong>Website:</strong></td>
                            <td>{instrument.company?.website_url ? <a href={instrument.company.website_url} target="_blank" rel="noopener noreferrer">{instrument.company.website_url}</a> : "N/A"}</td>
                        </tr>
                    </tbody>
                </table>
                <h2>Price History</h2>
                <div className="price-summary">
                    <span><strong>Highest Bid Price:</strong> ${instrument.highest_bid_price ? instrument.highest_bid_price.toFixed(2) : "N/A"}</span>
                    <span><strong>Lowest Ask Price:</strong> ${instrument.lowest_ask_price ? instrument.lowest_ask_price.toFixed(2) : "N/A"}</span>
                    <span><strong>Last Transaction Price:</strong> ${instrument.last_transaction_price ? instrument.last_transaction_price.toFixed(2) : "N/A"}</span>
                </div>

                <ul>
                    {instrument.instrument_prices && instrument.instrument_prices.length > 0 ? (
                        instrument.instrument_prices.map((price, index) => (
                            <li key={index}>{price.recorded_on_et}: ${price.recorded_price ? price.recorded_price.toFixed(2) : "N/A"}</li>
                        ))
                    ) : (
                        <p>* No price history available yet</p>
                    )}
                </ul>
            </div>
            
            <div className='transaction-panel'>
                <div className="current-user-listing-offer">
                    {sessionUser&&currentUserListing && currentUserListing.listed_price && (
                        <h3>{sessionUser.first_name}, you are currently listing {currentUserListing.remaining_quantity} shares @ ${currentUserListing.listed_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    )}
                    {sessionUser&&currentUserOffer && currentUserOffer.offered_price && (
                        <h3>{sessionUser.first_name}, you are currently offering {currentUserOffer.remaining_quantity} shares @ ${currentUserOffer.offered_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    )}
                    
                    </div>
                <div className="action-buttons">
                    <button className="offer-button" onClick={handleOpenAddOfferModal}>Place An Offer</button>
                    <button className="list-button" onClick={handleOpenAddListingModal}>List Your Shares</button>
                </div>
                <div className="offer-listing-outer-container">
                    <div className="offers-listing-table-container">
                        {offers && offers.length>0?(
                            <table className="offer-or-listing-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Remaining/Original Qty</th>
                                        <th>Offered Price</th>
                                        {currentUserListing && Object.keys(currentUserListing).length > 0 && ( 
                                            <th>Action</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers && offers.length>0 && offers.map((offer, index) => (
                                        <tr key={index}>
                                            <td>{offer.offered_on_et || "N/A"}</td>
                                            <td>{offer.remaining_quantity || "N/A"} / {offer.initial_quantity || "N/A"}</td>
                                            <td>${offer.offered_price ? offer.offered_price.toFixed(2) : "N/A"}</td>
                                            {currentUserListing && Object.keys(currentUserListing).length > 0 && ( 
                                                <td className="enter-deal-button-offer-side-wrapper"><button className="enter-deal-button-offer-side" onClick={()=> handleOpenTakeOfferModal(offer)}>Enter Deal</button></td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <h3>No offers yet.</h3>  
                        )}
                    </div>

                    <div className="offers-listing-table-container">
                        {listings && listings.length>0?(
                            <table className="offer-or-listing-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Remaining/Original Qty</th>
                                        <th>Listed Price</th>
                                        {currentUserOffer && Object.keys(currentUserOffer).length > 0 && (
                                            <th>Action</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {listings && listings.length>0 && listings.map((listing, index) => (
                                        <tr key={index}>
                                            <td>{listing.listed_on_et || "N/A"}</td>
                                            <td>{listing.remaining_quantity || "N/A"} / {listing.initial_quantity || "N/A"}</td>
                                            <td>${listing.listed_price ? listing.listed_price.toFixed(2) : "N/A"}</td>
                                            {currentUserOffer && Object.keys(currentUserOffer).length > 0 && ( 
                                                <td className="enter-deal-button-listing-side-wrapper"><button className="enter-deal-button-listing-side" onClick={()=> handleOpenBidListingModal(listing)}>Enter Deal</button></td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <h3>No shares listed yet.</h3>  
                        )}
                    </div>
                </div>
            </div>
        </div>

    
    );
}
