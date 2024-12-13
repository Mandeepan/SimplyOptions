import "./AddOfferListingModal.css"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAnOfferThunk } from "../../redux/offers";
import { motion } from "framer-motion";
import CustomAlert from "../CustomAlert/CustomAlert";
import { useModal } from '../../context/Modal';

export default function AddOfferModal({ instrumentId, closeModalFromPage}) {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [offeredPrice, setOfferedPrice] = useState("");
    const [initialQuantity, setInitialQuantity] = useState("");
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
            initial_quantity: parseInt(initialQuantity),
            offer_user_id: sessionUser.id,
        };

        const response = await dispatch(addAnOfferThunk(instrumentId, requestData));

        if (response.message) {
            handleShowAlert(response.message, "error");
        } else {
            handleShowAlert("Offer placed successfully!", "success");
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
                    <h2>Place A New Offer</h2>
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
                            <label htmlFor="initialQuantity">Initial Quantity</label>
                            <input
                                type="number"
                                id="initialQuantity"
                                value={initialQuantity}
                                onChange={(e) => {
                                    setInitialQuantity(e.target.value)
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
                            Submit Offer
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