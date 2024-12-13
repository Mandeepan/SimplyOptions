import { motion } from "framer-motion";
import "./CustomAlert.css";


const CustomAlert = ({ message, onClose }) => {
    return (
        <motion.div
            className="custom-alert"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <p>{message}</p>
            <button onClick={onClose}>OK</button>
        </motion.div>
    );
};

export default CustomAlert;

