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


function deleteOfferProcess(onConfirm, onCancel){
    return (
        <div className="delete-modal-container" data-testid='delete-spot-modal'>
            <h1>Confirm Delete</h1>
            <div className="explanation-note">
                <p>Do you want to remove the selected offer?</p>
                <p className="warning"></p>
            </div>

            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={onConfirm} >Yes</button>
                <button className="delete-no" onClick={onCancel} >No</button>
            </div>
            
        </div>
    )
}

function deleteListingProcess(onConfirm, onCancel){
    return (
        <div className="delete-modal-container" data-testid='delete-spot-modal'>
            <h1>Confirm Delete</h1>
            <div className="explanation-note">
                <p>Do you want to remove the selected listing?</p>
                <p className="warning"></p>
            </div>

            <div className="yes-or-no-buttons">
                <button className="delete-yes" onClick={onConfirm} >Yes</button>
                <button className="delete-no" onClick={onCancel} >No</button>
            </div>
            
        </div>
    )
}

function deleteTransactionProcess(onConfirm, onCancel){
    return (
        <div className="delete-modal-container" data-testid='delete-spot-modal'>
            <h1>Confirm Cancel</h1>
            <div className="explanation-note">
                <p>Do you want to cancel the selected transaction?</p>
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
    switch (itemToDelete) {
        case "COMPANY":
            return deleteCompanyProcess(onConfirm, onCancel);
        case "INSTRUMENT":
            return deleteInstrumentProcess(onConfirm, onCancel);
        case "OFFER":
            return deleteOfferProcess(onConfirm,onCancel);
        case "LISTING":
            return deleteListingProcess(onConfirm,onCancel)
        case "TRANSACTION":
            return  deleteTransactionProcess(onConfirm,onCancel)
        default:
            throw new Error(`Unknown itemToDelete: ${itemToDelete}`);
    }
}