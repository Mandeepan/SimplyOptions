import { useEffect , useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { getAnInstrumentThunk } from "../../redux/instrument";
import { SlGhost } from "react-icons/sl";
import { ImExit } from "react-icons/im";

import { AnimatePresence, motion } from "framer-motion";

import "./InstrumentDetailPage.css";

export function InstrumentDetailPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const { instrumentId } = useParams();
    const instrument = useSelector((state) => state.instruments.currentInstrument); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (instrumentId) {
            dispatch(getAnInstrumentThunk(instrumentId)); 
        }
    }, [dispatch, instrumentId]);

    if (!sessionUser) {
        return <Navigate to='/' />;
    }

    if (!instrument || Object.keys(instrument).length === 0) {
        return <div>Loading instrument details...</div>; // Show loading message while instrument details are being fetched
    }

    const handleGhostButtonClick = () => {
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="instrument-detail-page">
            <div className="detail-page-header">
                <h1>{instrument.instrument_name}</h1>
                <button className="simple-buddy-button" onClick={handleGhostButtonClick}><SlGhost /></button>
                
            </div>
            
            <div className={`instrument-details ${isModalOpen ? 'blurred' : ''}`}>
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
                        <tr>
                            <td><strong>Highest Bid Price:</strong></td>
                            <td>${instrument.highest_bid_price ? instrument.highest_bid_price.toFixed(2) : "N/A"}</td>
                        </tr>
                        <tr>
                            <td><strong>Lowest Ask Price:</strong></td>
                            <td>${instrument.lowest_ask_price ? instrument.lowest_ask_price.toFixed(2) : "N/A"}</td>
                        </tr>
                        <tr>
                            <td><strong>Last Transaction Price:</strong></td>
                            <td>${instrument.last_transaction_price ? instrument.last_transaction_price.toFixed(2) : "N/A"}</td>
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
                <ul>
                    {instrument.instrument_prices && instrument.instrument_prices.length > 0 ? (
                        instrument.instrument_prices.map((price, index) => (
                            <li key={index}>{price.recorded_on_et}: ${price.recorded_price ? price.recorded_price.toFixed(2) : "N/A"}</li>
                        ))
                    ) : (
                        <p>No price history available</p>
                    )}
                </ul>
            </div>
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        className="side-modal"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="side-modal-content">
                            <button className="close-modal-button" onClick={handleCloseModal}><ImExit />                            </button>
                            <p className="typing-content">Hi, I am SimpleBuddy, here&apos;s what I think about {instrument.company?.company_name}:</p>
                            <p className="typing-content">{instrument.company?.ai_prompt}. Let me know if you have any questions.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
