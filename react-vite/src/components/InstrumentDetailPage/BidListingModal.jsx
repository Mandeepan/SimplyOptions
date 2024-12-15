import "./AddOfferListingModal.css"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addATransactionThunk } from "../../redux/transaction";
import { motion } from "framer-motion";
import CustomAlert from "../CustomAlert/CustomAlert";
import { useModal } from '../../context/Modal';


export default function BidListingModal({offer,listing, closeModalFromPage}){
    const dispatch = useDispatch();
    const [transactionQuantity, setTransactionQuantity] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setModalContent, closeModal } = useModal();


    const availableTransactionQuantity = Math.min(offer.remaining_quantity, listing.remaining_quantity)
    const validateInputs = (e) => {
        setErrorMessage("")
        const value = e.target.value
        if (value <= 0 || isNaN(value)) {
            setErrorMessage(`Quantity must be a positive number.`);
        }
        if (value>availableTransactionQuantity){
            setErrorMessage(`Quantity cannot exceed offer remaining quantity or listing remaining quantity.`);
        }
    };

    const handleShowAlert = (message, type) => {
        setModalContent(
            <CustomAlert
                message={message}
                onClose={() => {
                    closeModal();
                    if (type === "success") closeModalFromPage(); // Refresh parent content on success
                }}
            />
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const requestData = {
            instrument_id: parseFloat(listing.instrument_id),
            offer_id: parseInt(offer.id),
            listing_id: parseInt(listing.id),
            transaction_price: listing.listed_price,
            transaction_quantity: parseInt(transactionQuantity)
        };

        const response = await dispatch(addATransactionThunk(requestData));

        if (response.message) {
            handleShowAlert(response.message, "error");
        } else {
            handleShowAlert("Transaction placed successfully! Issuer admin will review it.", "success");
        }
        setIsSubmitting(false);
    };

    return(
        <>
            <motion.div 
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="modal-content"
                    initial={{ y: "-50%", opacity: 0 }}
                    animate={{ y: "0", opacity: 1 }}
                    exit={{ y: "-50%", opacity: 0 }}
                >
                    <h2>Transaction Confirmation</h2>
                    <p>* Transaction price is fixed to the listed offered price.</p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="transactionPrice">Transaction Price ($)</label>
                            <input
                                type="number"
                                id="transactionPrice"
                                value={listing.listed_price}
                                disabled={true}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="transactionQuantity">Transaction Quantity</label>
                            <input
                                type="number"
                                id="transactionQuantity"
                                value={transactionQuantity}
                                onChange={(e) => {
                                    setTransactionQuantity(e.target.value)
                                    validateInputs(e)
                                }}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isSubmitting || errorMessage}
                            >
                            Confirm
                            </button>
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </>
        
    )
}