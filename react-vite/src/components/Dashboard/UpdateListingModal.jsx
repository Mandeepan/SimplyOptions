
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAListingThunk } from "../../redux/listings";
import { motion } from "framer-motion";
import CustomAlert from "../CustomAlert/CustomAlert";
import { useModal } from '../../context/Modal';

export default function UpdateListingModal({ listingId, closeModalFromPage}) {
    const dispatch = useDispatch();
    const [listedPrice, setListedPrice] = useState("");
    const [remainingQuantity, setRemainingQuantity] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [alertMessage, setAlertMessage] = useState(null);
    const { setModalContent, closeModal } = useModal();

    const validateInputs = (value) => {
        setErrorMessage("")
        if (value <= 0 || isNaN(value)) {
            setErrorMessage("Listed price and quantity must be a positive number.");
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
            listed_price: parseFloat(listedPrice),
            remaining_quantity: parseInt(remainingQuantity)
        };

        const response = await dispatch(updateAListingThunk(listingId, requestData));
        if (response.message) {
            handleShowAlert(response.message, "error");
        } else {
            handleShowAlert("Listing updated successfully!", "success");
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
                    <h2>Update Listing</h2>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="listedPrice">Listed Price ($)</label>
                            <input
                                type="number"
                                id="listedPrice"
                                value={listedPrice}
                                onChange={(e) => {
                                    setListedPrice(e.target.value)
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
                            Update Listing
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