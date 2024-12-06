import { useEffect, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { getAllTransactionsForACompanyThunk } from '../../redux/transaction';
import { MdOutlineCheck } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
import ConfirmApproveReject from './ConfirmApproveReject';



export default function PendingBox({currentCompany}){
    const dispatch = useDispatch()
    const companyPendingTransactions = useSelector((state)=>state.transactions.companyPendingTransactions)
    const { setModalContent, closeModal } = useModal();
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    useEffect(() => {
        if (currentCompany && currentCompany.id) {
            dispatch(getAllTransactionsForACompanyThunk(currentCompany.id));
        }
    }, [dispatch, currentCompany]);

    const handleSelectTransaction= (transactionId) => {
        setSelectedTransactionId(transactionId)
    };

    const handleApproveClick =()=>{
        setModalContent(
            <ConfirmApproveReject
                decision={"APPROVE"}
                onConfirm={()=> alert("This feature is coming soon...")}
                onCancel={closeModal}
            />
        );
    }

    const handleRejectClick =()=>{
        setModalContent(
            <ConfirmApproveReject
                decision={"REJECT"}
                onConfirm={()=> alert("This feature is coming soon...")}
                onCancel={closeModal}
            />
        );
    }


    return (
    <div className='company-controller'>
        <div className="company-controller-head-banner">
            <h3>DECISION PANEL</h3>
        </div>
        <div className="company-controller-body">
                <div className="company-info-box">
                    <h3>Total Pending Transactions : {companyPendingTransactions?.length}</h3>
                    {companyPendingTransactions && companyPendingTransactions.length > 0 && (
                    <div className="transaction-table-container">
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Decision</th>
                                <th>Instrument</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Value</th>
                                <th>Offered By</th>
                                <th>Listed By</th>
                                <th>Initialize On(ET)</th>                                
                            </tr>
                        </thead>
                        <tbody className="transaction-table-body">
                            {companyPendingTransactions.map((transaction, index) => (
                                <tr key={index} className="transaction-row">
                                    <td><input type="radio" 
                                                    className="instrument-radio"
                                                    name="selectedTransactionId"
                                                    checked={selectedTransactionId === transaction.id}
                                                    onChange={()=>handleSelectTransaction(transaction.id)} />
                                    </td>
                                    <td>
                                        <div className='decision-button-container'>
                                            <button className="transaction-approve-button"
                                                    onClick={(e)=>{e.preventDefault(); handleApproveClick();}}
                                                    disabled={selectedTransactionId !== transaction.id}
                                                    >
                                                    <MdOutlineCheck />
                                            </button>
                                            <button className="transaction-reject-button"
                                                    onClick={(e)=>{e.preventDefault();handleRejectClick()}}
                                                    disabled={selectedTransactionId !== transaction.id}
                                                    >
                                                    <MdOutlineClose />
                                            </button>
                                        </div>
                                    </td>
                                    <td>{transaction.instrument_name}</td>
                                    <td>$ {transaction.transaction_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{transaction.transaction_quantity.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                    <td>$ {(transaction.transaction_quantity*transaction.transaction_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td><a href={`mailto:${transaction.offer_user_email}`}>{transaction.offer_user_first_name} {transaction.offer_user_last_name}</a></td>
                                    <td><a href={`mailto:${transaction.listing_user_email}`}>{transaction.listing_user_first_name} {transaction.listing_user_last_name}</a></td>
                                    <td>{transaction.created_at_et}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                )}
                </div>
        </div>
    </div>
    )
}