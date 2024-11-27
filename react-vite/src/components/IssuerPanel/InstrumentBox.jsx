import {useNavigate } from 'react-router-dom';

export default function InstrumentBox({currentCompany}){
    const navigate =useNavigate()

    const handleAddInstrument=()=>{
        navigate('/createInstrument')
    }

    const handleUpdateInstrument=()=>{
        navigate('/updateInstrument')
    }

    const dateFormatter=(dateString)=>{
        const dateObject = new Date(dateString);
        const options = {  year: 'numeric', month: 'short', day: '2-digit' };
        const formattedDate = dateObject.toLocaleDateString('en-US', options);
        return formattedDate

    }

    const shouldUpdateButtonDisable = currentCompany.instruments && currentCompany.instruments.length > 0 ? "update-instrument-button" :"update-instrument-button-hidden"
    const shouldDeleteButtonDisable = currentCompany.instruments && currentCompany.instruments.length > 0 ? "delete-instrument-button" :"delete-instrument-button-hidden"
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
                                    <th>Issued Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCompany.instruments.map((instrument, index) => (
                                    <tr key={index} className="instrument-row">
                                        <td><input type="checkbox" className="instrument-checkbox" /></td>
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
                    <button className={shouldUpdateButtonDisable} onClick={handleUpdateInstrument}>Update Selected Instrument</button>
                    <button className={shouldDeleteButtonDisable}>Delete Selected Instrument</button>
                </div>
            </div>
        </div>
    )
}