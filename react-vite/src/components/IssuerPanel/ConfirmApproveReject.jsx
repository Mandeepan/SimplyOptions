import "./ConfirmApproveReject.css"

function approveTransactionProcess(onConfirm, onCancel){
    return (
        <div className="delete-modal-container" data-testid='delete-spot-modal'>
            <h1>Confirm Approving Transaction</h1>
            <p className='error'>***Feature is currently being developed***</p>
            <div className="explanation-note">
                <p>Do you want to approve this transaction?</p>
                <p className="warning">Please note : Once confirmed,transaction will be settled and you will not be able to revert.</p>
            </div>

            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={onConfirm} >Yes</button>
                <button className="delete-no" onClick={onCancel} >No</button>
            </div>
            
        </div>
    )
}

function rejectTransactionProcess(onConfirm, onCancel){
    return (
        <div className="delete-modal-container" data-testid='delete-spot-modal'>
            <h1>Confirm Rejecting Transaction</h1>
            <p className='error'>***Feature is currently being developed***</p>
            <div className="explanation-note">
                <p>Do you want to reject this transaction?</p>
                <p className="warning">Please note: Once confirmed, this transaction record will be removed from your transaction records.</p>
            </div>

            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={onConfirm} >Yes</button>
                <button className="delete-no" onClick={onCancel} >No</button>
            </div>
            
        </div>
    )
}

export default  function ConfirmApproveReject({decision,onConfirm, onCancel}) {
    let response;
    decision==="APPROVE" ? response = approveTransactionProcess( onConfirm, onCancel )
    : response=rejectTransactionProcess( onConfirm, onCancel );
    return response;
}