
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAnOfferThunk } from "../../redux/offers";
import { motion } from "framer-motion";
import CustomAlert from "../CustomAlert/CustomAlert";
import { useModal } from '../../context/Modal';

export default function UpdateOfferModal({ offerId, closeModalFromPage}) {
    const dispatch = useDispatch();
    const [offeredPrice, setOfferedPrice] = useState("");
    const [remainingQuantity, setRemainingQuantity] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [alertMessage, setAlertMessage] = useState(null);
    const { setModalContent, closeModal } = useModal();

    const validateInputs = (value) => {
        setErrorMessage("")
        if (value <= 0 || isNaN(value)) {
            setErrorMessage("Offered price and quantity must be a positive number.");
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
            offered_price: parseFloat(offeredPrice),
            remaining_quantity: parseInt(remainingQuantity)
        };

        const response = await dispatch(updateAnOfferThunk(offerId, requestData));
        if (response.message) {
            handleShowAlert(response.message, "error");
        } else {
            handleShowAlert("Offer updated successfully!", "success");
        }
        setIsSubmitting(false);
    };

    return (
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
                    <h2>Update Offer</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="offeredPrice">Offered Price ($)</label>
                            <input
                                type="number"
                                id="offeredPrice"
                                value={offeredPrice}
                                onChange={(e) => {
                                    setOfferedPrice(e.target.value)
                                    validateInputs(e.target.value)
                                }}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="remainingQuantity">Updated Available Quantity</label>
                            <input
                                type="number"
                                id="remainingQuantity"
                                value={remainingQuantity}
                                onChange={(e) => {
                                    setRemainingQuantity(e.target.value)
                                    validateInputs(e.target.value)
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
                            Update Offer
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
        
    );
}