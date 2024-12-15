import "./ConfirmApproveReject.css"

function approveTransactionProcess(onConfirm, onCancel){
    return (
        <div className="delete-modal-container" data-testid='delete-spot-modal'>
            <h1>Confirm Approval</h1>
            <div className="explanation-note">
                <p>Do you want to approve this transaction?</p>
                <p className="warning">Please note : Once confirmed, action cannot be able to revert.</p>
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
            <h1>Confirm Rejection</h1>
            <div className="explanation-note">
                <p>Do you want to reject this transaction?</p>
                <p className="warning">Please note: Once confirmed, action cannot be able to revert.</p>
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