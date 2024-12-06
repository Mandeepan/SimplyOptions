import { useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { getAllTransactionsForACompanyThunk } from '../../redux/transaction';

export default function NonPendingBox({currentCompany}){
    const dispatch = useDispatch()
    const companyNonPendingTransactions = useSelector((state)=>state.transactions.companyNonPendingTransactions)


    useEffect(() => {
        if (currentCompany && currentCompany.id) {
            dispatch(getAllTransactionsForACompanyThunk(currentCompany.id));
        }
    }, [dispatch, currentCompany]);
    

    return(
        <div className='company-controller'>
            <div className="company-controller-head-banner">
                <h3>DEAL HISTORY</h3>
            </div>
            <div className="company-controller-body">
                <div className="company-info-box">
                    <h3>Total Settled Transactions : {companyNonPendingTransactions?.length}</h3>
                    {companyNonPendingTransactions && companyNonPendingTransactions.length > 0 && (
                    <div className="transaction-table-container">
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Instrument</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Value</th>
                                <th>Fees</th>
                                <th>Offered By</th>
                                <th>Listed By</th>
                                <th>Created At</th>
                                <th>Settled On</th>                                
                            </tr>
                        </thead>
                        <tbody className="transaction-table-body">
                            {companyNonPendingTransactions.map((transaction, index) => (
                                <tr key={index} className="transaction-row">
                                    <td>{transaction.id}</td>
                                    <td>{transaction.instrument_name}</td>
                                    <td>$ {transaction.transaction_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>{transaction.transaction_quantity.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                    <td>$ {(transaction.transaction_quantity*transaction.transaction_price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td>$ {transaction.transaction_fee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td><a href={`mailto:${transaction.offer_user_email}`}>{transaction.offer_user_first_name} {transaction.offer_user_last_name}</a></td>
                                    <td><a href={`mailto:${transaction.listing_user_email}`}>{transaction.listing_user_first_name} {transaction.listing_user_last_name}</a></td>
                                    <td>{transaction.created_at_et}</td>
                                    <td>{transaction.settled_on_et}</td>
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