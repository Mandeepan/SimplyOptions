import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { getAnInstrumentThunk } from "../../redux/instrument";
import { getAllOffersForAnInstrumentThunk, getAllOffersForAUserThunk } from "../../redux/offers";
import { getAllListingsForAnInstrumentThunk, getAllListingsForAUserThunk} from "../../redux/listings";
import { useModal } from '../../context/Modal';
import { SlGhost } from "react-icons/sl";
import { IoExit } from "react-icons/io5";
import { CiCircleQuestion } from "react-icons/ci";


import { AnimatePresence, motion } from "framer-motion";

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

    if (!sessionUser) {
        return <Navigate to='/' />;
    }

    if (!instrument || Object.keys(instrument).length === 0) {
        return <div>Loading instrument details...</div>; // Show loading message while instrument details are being fetched
    }

    //check if any of the offers / listing belong to current user is for the current instrument
    let currentUserListing={}
    let currentUserOffer={}
    userListings.map(listing => {
        if (listing.instrument_id ==instrumentId){
            currentUserListing=listing
        }
    })
    userOffers.map(offer => {
        if (offer.instrument_id ==instrumentId){
            currentUserOffer=offer
        }
    })



    const handleGhostButtonClick = () => {
        setModalContent(
            <AnimatePresence>
                {(
                    <motion.div 
                    className="backdrop"
                    onClick={handleBackdropClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                        <motion.div 
                            className="side-modal"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="side-modal-content">
                                <button className="close-modal-button" onClick={handleCloseModal}><IoExit /></button>
                                <p className="typing-content">Hi, I am SimpleBuddy, here&apos;s what I think about {instrument.company?.company_name}:</p>
                                <p className="typing-content">{instrument.company?.ai_prompt}. Let me know if you have any questions.</p>
                            </div>
                            <div><input className="buddy_input" placeholder="Enter your question here..."></input></div>
                            <div className="openAI-logo-container">
                                <div className="tooltip-wrapper">
                                    <div className="ai-tooltip">AI answer may be inaccurate. Use it cautiously.</div>
                                    <CiCircleQuestion />
                                </div>
                                <p>Powered by</p>
                                <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/OpenAI_Logo.svg.png" alt="Powered by OpenAI"></img>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        )
    };

    const handleCloseModal = () => {
        closeModal();
    };


    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('backdrop')) {
            handleCloseModal();
        }
    };

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
                            <td>{instrument.issued_on_et}</td>
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
                        <h3>{sessionUser.first_name}, you listed {currentUserListing.remaining_quantity} shares @ ${currentUserListing.listed_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    )}
                    {sessionUser&&currentUserOffer && currentUserOffer.offered_price && (
                        <h3>{sessionUser.first_name}, you offered {currentUserOffer.remaining_quantity} shares @ ${currentUserOffer.offered_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    )}
                    
                    </div>
                <div className="action-buttons">
                    <button className="offer-button">Place An Offer</button>
                    <button className="list-button">List Your Shares</button>
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {offers.map((offer, index) => (
                                        <tr key={index}>
                                            <td>{offer.offered_on_et || "N/A"}</td>
                                            <td>{offer.remaining_quantity || "N/A"} / {offer.initial_quantity || "N/A"}</td>
                                            <td>${offer.offered_price ? offer.offered_price.toFixed(2) : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <p>No offers yet.</p>  
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {listings.map((listing, index) => (
                                        <tr key={index}>
                                            <td>{listing.listed_on_et || "N/A"}</td>
                                            <td>{listing.remaining_quantity || "N/A"} / {listing.initial_quantity || "N/A"}</td>
                                            <td>${listing.listed_price ? listing.listed_price.toFixed(2) : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ):(
                            <p>No shares listed yet.</p>  
                        )}
                    </div>
                </div>
            </div>
        </div>

    
    );
}
