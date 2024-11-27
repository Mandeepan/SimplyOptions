import {useNavigate } from 'react-router-dom';

export default function InstrumentBox({currentCompany}){
    const navigate =useNavigate()

    const handleAddInstrument=()=>{
        navigate('/createInstrument')
    }

    const instruments =currentCompany.instruments;
    if (!instruments.length) {
        return (
            <div className="company-controller">
                <div className="company-controller-head-banner">
                    <h3>INSURANCE</h3>
                </div>
                <div className="company-controller-body">
                <div className="company-info-box">
                    <h3>Total Instruments : {instruments.length}</h3>
                    <p>
                        <span className="company-info-content">There is no instrument linked to this company yet.</span>
                    </p>
                </div>
                <div className="company-buttons">
                    <button className="add-new-instrument-button" onClick={handleAddInstrument}>Add A New Instrument</button>
                </div>
            </div>
            </div>
        )
    }
    return (
        <div className="company-controller">
            <div className="company-controller-head-banner">
                <h3>INSURANCE</h3>
            </div>
            <div className="company-controller-body">
                <div className="company-info-box">
                    <h3>Total Instruments : {currentCompany.instruments?.length}</h3>
                    <div className="instruments-list-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                                        <td>{instrument.issued_on_et}</td>
                                        <td>{instrument.instrument_type}</td>
                                        <td>{instrument.instrument_class}</td>
                                        <td>{instrument.updated_value}</td>
                                        <td>{instrument.updated_issued_quantity}</td>
                                        <td>{instrument.updated_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No instruments available.</p>
                    )}
                </div>
                </div>
                <div className="company-buttons">
                    <button className="add-new-instrument-button" onClick={handleAddInstrument}>Add A New Instrument</button>
                    <button className="update-instrument-button">Update Selected Instrument</button>
                    <button className="delete-instrument-button">Delete Selected Instrument</button>
                </div>
            </div>
        </div>
    )
}