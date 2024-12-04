import "./FundingModal.css"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function DepositFundProcess({onConfirm, onCancel}){
    const [amount,setAmount]=useState(0)
    const [errors,setErrors]=useState({});

    useEffect(() => {
        const newErrors = {};
        if (amount && amount < 0) {
            newErrors.amountError = "Please enter a valid deposit amount.";
        }
        setErrors(newErrors);
    }, [amount]);

    const handleConfirm = () => {
        if (Object.keys(errors).length === 0 && amount > 0) {
            onConfirm(parseFloat(amount)); // Pass the deposit amount back to Dashboard Page
        }
    };


    return (
        <div className="delete-modal-container">
            <h1>Confirm Deposit Fund</h1>
            <div className="explanation-note">
                <p>How much do you want to deposit to your SimplyOptions Account?</p>
                <p className="warning">Real time payment feature is coming soon... </p>
            </div>
            <div className="funding-amount-input-container">
                <label>Deposit Amount: $</label>
                <input type="number"  
                        value={amount}
                        min="1.00" step="0.01" 
                        onChange={(e) => setAmount(e.target.value)}></input>
                {errors?.amountError && <p className='error'>{errors.amountError}</p>}
            </div>
            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={handleConfirm} >Confirm Deposit</button>
                <button className="delete-no" onClick={onCancel} >Cancel</button>
            </div>
            
        </div>
    )
}

function WithdrawFundProcess({onConfirm, onCancel}){
    const [amount,setAmount]=useState(0)
    const [errors,setErrors]=useState({})
    const userInfo = useSelector(state => state.currentUser.currentUser);

    useEffect(() => {
        const newErrors = {};
        if (amount && amount < 0) {
            newErrors.amountError = "Please enter a valid deposit amount.";
        }else if (amount>userInfo.user_available_balance){
            newErrors.notEnoughFundError=`Enter an amount less than the available balance ($ ${userInfo.user_available_balance})`
        }
        setErrors(newErrors);
    }, [amount, userInfo]);

    const handleConfirm = () => {
        if (Object.keys(errors).length === 0 && amount > 0) {
            onConfirm(parseFloat(amount)); // Pass the deposit amount back to Dashboard Page
        }
    };


    return (
        <div className="delete-modal-container" >
            <h1>Confirm Withdraw Fund</h1>
            <div className="explanation-note">
                <p>How much do you want to deposit to your SimplyOptions Account?</p>
                <p className="warning">Real time payment feature is coming soon... </p>
            </div>
            <div className="funding-amount-input-container">
                <label>Withdraw Amount: $ - </label>
                <input type="number"  
                        value={amount}
                        min="1.00" step="0.01" 
                        onChange={(e) => setAmount(e.target.value)}></input>
                {errors?.amountError && <p className='error'>{errors.amountError}</p>}
                {errors?.notEnoughFundError && <p className='error'>{errors.notEnoughFundError}</p>}
            </div>

            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={handleConfirm} disabled={errors.amountError || errors.notEnoughFundError}>Confirm Withdrawal</button>
                <button className="delete-no" onClick={onCancel} >Cancel</button>
            </div>
            
        </div>
    )
}

function LiquidateFundProcess({onConfirm, onCancel}){
    return (
        <div className="delete-modal-container" >
            <h1>Confirm Deactivation</h1>
            <div className="explanation-note">
                <p>Do you want to liquidate all available fund and deactivate the account?</p>
                <p className="warning">Real time payment feature is coming soon...</p>
            </div>

            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={onConfirm} >Deactivate</button>
                <button className="delete-no" onClick={onCancel} >Cancel</button>
            </div>
            
        </div>
    )
}

export default  function FundingModal({itemToProceed,onConfirm, onCancel}) {
    let response;
    itemToProceed==="DEPOSIT" ? response = <DepositFundProcess onConfirm={onConfirm} onCancel={onCancel} />
    : itemToProceed==="WITHDRAW" ? response = <WithdrawFundProcess onConfirm={onConfirm} onCancel={onCancel} />
    :response=<LiquidateFundProcess onConfirm={onConfirm} onCancel={onCancel} />;
    return response;
}