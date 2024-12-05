import { useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { getAllTransactionsForACompanyThunk } from '../../redux/transaction';


export default function PendingBox({currentCompany}){
    const dispatch = useDispatch()
    const companyPendingTransactions = useSelector((state)=>state.companyTransactions.companyPendingTransactions)
    

    useEffect(() => {
        if (currentCompany?.id) {
            dispatch(getAllTransactionsForACompanyThunk(currentCompany.id));
        }
    }, [dispatch, currentCompany]);


    return (
    <div className='company-controller'>
        <div className="company-controller-head-banner">
            <h3>DECISION PANEL</h3>
        </div>
        <div className="company-controller-body">
                <div className="company-info-box">
                    <h3>Total Pending Transactions : {companyPendingTransactions?.length}</h3>
                    {companyPendingTransactions && companyPendingTransactions.length > 0 && (
                    <table className="instrument-table">
                        <thead>
                            <tr>
                                <th>Actions</th>
                                <th>ID</th>
                                <th>Instrument</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Value</th>
                                <th>Offered By</th>
                                <th>Listed By</th>
                                <th>Initialize On(ET)</th>                                
                            </tr>
                        </thead>
                        <tbody>
                            {companyPendingTransactions.map((transaction, index) => (
                                <tr key={index} className="instrument-row">
                                    <td>
                                        <div className='decision-button-container'>
                                            <button className="transaction-approve-button">Approve</button>
                                            <button className="transaction-reject-button">Reject</button>
                                        </div>
                                    </td>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.instrument_name}</td>
                                    <td>{transaction.transaction_price}</td>
                                    <td>{transaction.transaction_quantity*transaction.transaction_price}</td>
                                    <td>{transaction.transaction_quantity}</td>
                                    <td>{transaction.offer_user_first_name} {transaction.offer_user_last_name}</td>
                                    <td>{transaction.listing_user_first_name} {transaction.listing_user_last_name}</td>
                                    <td>{transaction.created_at_et}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                </div>
        </div>
    </div>
    )
}