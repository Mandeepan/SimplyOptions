import {useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import {deleteAnInstrumentThunk} from '../../redux/instrument';
import { getACompanyThunk } from '../../redux/company';

export default function InstrumentBox({currentCompany}){
    const navigate =useNavigate()
    const dispatch = useDispatch()
    const { setModalContent, closeModal } = useModal();
    const [selectedInstrumentId, setSelectedInstrumentId] = useState(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);


    const handleAddInstrument=()=>{
        navigate('/createInstrument')
    }

    const handleUpdateInstrument=()=>{
        if (selectedInstrumentId) {
            navigate(`/updateInstrument/${selectedInstrumentId}`); 
        } else {
            alert("Please select an instrument to update.");
        }
    }

    const handleSelectInstrument = (instrumentId, companyId) => {
        setSelectedInstrumentId(instrumentId);
        setSelectedCompanyId (companyId)
    };

    const handleDeleteInstrumentProcess= async (selectedInstrumentId, selectedCompanyId)=>{
        try{
            await dispatch(deleteAnInstrumentThunk(selectedInstrumentId))
            
        } catch (error) {
            console.error('Error deleting instrument', error);
            alert("Can not delete this instrument record, please reach out to help@simplyoptions.com")
            navigate('/issuerPanel')
        }
        try{
            currentCompany = await dispatch(getACompanyThunk(parseInt(selectedCompanyId)))
            closeModal();
        } catch (error) {
            console.error('Error getting updated company profile:', error);
            alert("Can not get updated company record, please reach out to help@simplyoptions.com")
            navigate('/issuerPanel')
        }
    }

    const handleDeleteInstrumentClick=(selectedInstrumentId, selectedCompanyId)=>{
        if (selectedInstrumentId){
            setModalContent(
                <ConfirmDeleteModal
                itemToDelete={"INSTRUMENT"}
                    onConfirm={()=> handleDeleteInstrumentProcess(parseInt(selectedInstrumentId), parseInt(selectedCompanyId))}
                    onCancel={closeModal}
                />
            );
        }else{
            alert("Please select an instrument before proceeding")
        }        
    }

    const dateFormatter=(dateString)=>{
        const dateObject = new Date(dateString);
        const options = {  year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = dateObject.toLocaleDateString('en-US', options);
        return formattedDate

    }


    const shouldInstrumentTableHidden = currentCompany.instruments && currentCompany.instruments.length > 0 ? "instruments-list-container" : "instruments-list-container-hidden"

    return (
        <div className="company-controller">
            <div className="company-controller-head-banner">
                <h3>INSTRUMENTS</h3>
            </div>
            <div className="company-controller-body">
                <div className="company-info-box">
                    <h3>Total Instruments : {currentCompany.instruments?.length}</h3>
                    <div className={shouldInstrumentTableHidden} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {currentCompany.instruments && currentCompany.instruments.length > 0 ? (
                        <table className="instrument-table">
                            <thead>
                                <tr className="instrument-table-header">
                                    <th></th>
                                    <th>Instrument Name</th>
                                    <th>Issued On</th>
                                    <th>Type</th>
                                    <th>Class</th>
                                    <th>Value</th>
                                    <th>Issued Qty</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCompany.instruments.map((instrument, index) => (
                                    <tr key={index} className="instrument-row">
                                        <td><input type="radio" 
                                                    className="instrument-radio"
                                                    name="selectedInstrument"
                                                    checked={selectedInstrumentId === instrument.id}
                                                    onChange={()=>handleSelectInstrument(instrument.id, currentCompany.id)} /></td>
                                        <td>{instrument.instrument_name}</td>
                                        <td>{dateFormatter(instrument.issued_on_et)}</td>
                                        <td>{instrument.instrument_type}</td>
                                        <td>{instrument.instrument_class}</td>
                                        <td>{instrument.updated_value}</td>
                                        <td>{instrument.updated_issued_quantity.toLocaleString('en-US')}</td>
                                        <td>$ {instrument.updated_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-instrument-label">Start the journey to list your company instruments by clicking button below.</p>
                    )}
                </div>
                </div>
                <div className="company-buttons">
                    <button className="add-new-instrument-button" onClick={handleAddInstrument}>Add A New Instrument</button>
                    {currentCompany.instruments && currentCompany.instruments.length > 0 && (
                        <>
                            <button className="update-instrument-button" onClick={handleUpdateInstrument}>
                                Update Selected Instrument
                            </button>
                            <button
                                className="delete-instrument-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteInstrumentClick(selectedInstrumentId, selectedCompanyId);
                                }}
                            >
                                Delete Selected Instrument
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}