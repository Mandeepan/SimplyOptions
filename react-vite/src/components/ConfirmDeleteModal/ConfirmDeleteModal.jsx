import "./ConfirmDeleteModal.css"

function deleteCompanyProcess(onConfirm, onCancel){
    return (
        <div className="delete-modal-container" data-testid='delete-spot-modal'>
            <h1>Confirm Delete</h1>
            <div className="explanation-note">
                <p>Do you want to remove the company profile?</p>
                <p className="warning">Please note : your user role will NOT be an issuer.All instruments related to the company will also be deleted. </p>
            </div>

            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={onConfirm} >Yes</button>
                <button className="delete-no" onClick={onCancel} >No</button>
            </div>
            
        </div>
    )
}

function deleteInstrumentProcess(onConfirm, onCancel){
    return (
        <div className="delete-modal-container" data-testid='delete-spot-modal'>
            <h1>Confirm Delete</h1>
            <div className="explanation-note">
                <p>Do you want to remove the selected instrument?</p>
                <p className="warning"></p>
            </div>

            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={onConfirm} >Yes</button>
                <button className="delete-no" onClick={onCancel} >No</button>
            </div>
            
        </div>
    )
}

export default  function ConfirmDeleteModal({itemToDelete,onConfirm, onCancel}) {
    let response;
    itemToDelete==="COMPANY" ? response = deleteCompanyProcess( onConfirm, onCancel )
    : response=deleteInstrumentProcess( onConfirm, onCancel );
    return response;
}