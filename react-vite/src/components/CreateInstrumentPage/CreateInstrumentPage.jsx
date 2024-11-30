import "./CreateInstrumentPage.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useSelector, useDispatch} from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import { addAnInstrumentThunk } from "../../redux/instrument";
import { getACompanyThunk } from "../../redux/company";

export default function CreateInstrumentPage() {
    const dispatch =useDispatch()
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);

    // Form data state
    const [formValue, setFormValue]=useState({
        instrumentName: "",
        issuedOnEt: "",
        instrumentType: "",
        instrumentClass:"",
        updatedPrice: "",
        updatedIssuedQuantity: "",
    })

    // Error state
    const [errors, setErrors] = useState({});
    // the mode to disable button 
    const [shouldDisable, setShouldDisable]=useState(false)
    // monitor if the form has been touched, if not ( first time landing this page), error message should not appear
    const [formTouched, setFormTouched]=useState(false)
    // to show the calculated market value
    const [issuedValue,setIssuedValue]=useState(0.00)
    // if it's demo data, even the form is not touched, button should not be disabled
    const [demoLinkClicked, setDemoLinkClicked]=useState(false)

    // monitor the user change on input fields in the form
    const handleChange = (e) => {
        setFormTouched(true); 
        const { name, value } = e.target;
        // Parse value for numeric fields
        const parsedValue = (name === 'updatedPrice' || name === 'updatedIssuedQuantity') ? parseFloat(value) : value;
        setFormValue({ ...formValue, [name]: parsedValue });
    };

    // Update issued value whenever price or quantity changes
    useEffect(() => {
        if (formValue.updatedPrice && formValue.updatedIssuedQuantity) {
            const calculatedValue = parseFloat(formValue.updatedPrice) * parseFloat(formValue.updatedIssuedQuantity);
            if (!isNaN(calculatedValue)) {
                setIssuedValue(calculatedValue);
            }
        }
    }, [formValue.updatedPrice, formValue.updatedIssuedQuantity]);

    // Validation Screening
    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formValue.instrumentName) newErrors.instrumentName = 'Instrument name is required.';
        if (!formValue.instrumentClass) newErrors.instrumentClass = 'Instrument class is required.';
        if (!formValue.instrumentType) newErrors.instrumentType = 'Instrument type is required.';
        if (!formValue.updatedIssuedQuantity) newErrors.updatedIssuedQuantity = 'Issued quantity is required.';
        if (formValue.updatedIssuedQuantity && formValue.updatedIssuedQuantity<=0) newErrors.updatedIssuedQuantity = 'Issued quantity should be a positive rounded number';
        if (!formValue.updatedPrice) newErrors.updatedPrice = 'Issued share price is required.';
        if (formValue.updatedPrice && formValue.updatedPrice<=0 ) newErrors.updatedPrice = 'Share price should be positive';
        return newErrors;
    }, [formValue]);

    // Error checking
    useEffect(() => {

        if (formTouched) {
            const newErrors = validateForm();
            setErrors(newErrors);
            setShouldDisable(Object.keys(newErrors).length > 0);
        }
    }, [formValue, formTouched, validateForm]);
    
    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    } else if (sessionUser && !sessionUser.company_id) {
        return <Navigate to='/issuerPanel'></Navigate>
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Parsing and formatting issued date
        const issuedOnDate = formValue.issuedOnEt
        ? new Date(formValue.issuedOnEt).toISOString().split('T')[0]  // This will give 'YYYY-MM-DD'
        : null;

        if (formTouched || demoLinkClicked){
            const newInstrument ={
                instrument_name: formValue.instrumentName,
                company_id: sessionUser.company_id,
                issuer_user_id: sessionUser.id,
                issued_on_et: issuedOnDate,
                instrument_type: formValue.instrumentType,
                instrument_class: formValue.instrumentClass,
                updated_issued_quantity:formValue.updatedIssuedQuantity,
                updated_price: formValue.updatedPrice,
                updated_value: issuedValue,

            }

            try{
                await dispatch(addAnInstrumentThunk(newInstrument));
                // after adding it refresh the currentCompany state so the newly-added instrument is included
                await dispatch(getACompanyThunk(sessionUser.company_id))
                // after  , direct to issuerPanel
                navigate('/issuerPanel')
            }catch (error) {
                console.error('Error adding instrument or getting updated company state:', error);
                setErrors({...errors, "Error":error.message})
            }


        } else {
            setErrors({...errors, "Error":"Please enter instrument information above."})
            setShouldDisable(true)
        }
        

    }

    const handleFillingDemoInstrumentData= ()=>{
        const demoInstrument = {
            instrumentName: "Demo Instrument 1",
            issuedOnEt: "2022-01-01",
            instrumentType: "Common Share",
            instrumentClass:"Class A",
            updatedPrice: "26.3",
            updatedIssuedQuantity: "10000",
        };
        setFormValue(demoInstrument);
        setDemoLinkClicked(true)
    }

    return(
        <div className="create-company-page">
            <div className="create-company-container">
                <h2>Instrument Information</h2>
                <button onClick={handleFillingDemoInstrumentData} className="demo-company-button"> * Click here to fill in sample company information</button>
                <form onSubmit={handleSubmit} className="create-company-form">
                    <div className="row1">
                        <div className='each-item'>
                            <label>Instrument Name *</label>
                            <input
                                type="text"
                                name="instrumentName"
                                value={formValue.instrumentName}
                                onChange={handleChange}
                                style={{ borderColor: errors.instrumentName ? 'rgb(223,49,49)' : 'white' }}
                            />
                            {errors.instrumentName && <p className="error">{errors.instrumentName}</p>}
                        </div>
                    </div>

                    <div className="row2">
                        <div className='each-item'>
                            <label>Issued Date</label>
                            <DatePicker
                                selected={formValue.issuedOnEt ? new Date(formValue.issuedOnEt) : null}
                                onChange={(date) => setFormValue({ ...formValue, issuedOnEt: date })}
                                dateFormat="yyyy-MM-dd"
                                className="custom-datepicker" 
                                calendarClassName="calendar-custom-style"
                            />
                            {errors.issuedOnEt && <p className="error">{errors.issuedOnEt}</p>}
                        </div>
                    </div>

                    <div className="row3">
                        <div className='each-item'>
                            <label>Instrument Type</label>
                            <select
                                name="instrumentType"
                                value={formValue.instrumentType}
                                onChange={handleChange}
                                style={{ borderColor: errors.instrumentType ? 'rgb(223,49,49)' : 'white' }}
                            >
                                <option value="">--</option>
                                <option value="Common Share">Common Share</option>
                                <option value="Preferred Share">Preferred Share</option>
                                <option value="Executive Share">Executive Share</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.instrumentType && <p className="error">{errors.instrumentType}</p>}
                        </div>
                    </div>

                    <div className="row4">
                        <div className='each-item'>
                            <label>Instrument Class</label>
                            <select
                                name="instrumentClass"
                                value={formValue.instrumentClass}
                                onChange={handleChange}
                                style={{ borderColor: errors.instrumentClass ? 'rgb(223,49,49)' : 'white' }}
                            >
                                <option value="">--</option>
                                <option value="Class A">Class A</option>
                                <option value="Class B">Class B</option>
                                <option value="Class C">Class C</option>
                                <option value="Class D">Class D</option>
                                <option value="Class E">Class E</option>
                                <option value="Beyond Class E">Beyond Class E</option>
                            </select>
                            {errors.instrumentClass && <p className="error">{errors.instrumentClass}</p>}
                        </div>
                    </div>

                    <div className="row5">
                        <div className='each-item'>
                            <label>Issued Quantity</label>
                            <input
                                type="number"
                                name="updatedIssuedQuantity"
                                value={formValue.updatedIssuedQuantity}
                                onChange={handleChange}
                                style={{ borderColor: errors.updatedIssuedQuantity ? 'rgb(223,49,49)' : 'white' }}
                                min="1" step="1"
                            />
                            {errors.updatedIssuedQuantity&& <p className="error">{errors.updatedIssuedQuantity}</p>}
                        </div>
                    </div>

                    <div className="row6">
                        <div className='each-item'>
                            <label>Share Price (USD)</label>
                            <input
                                type="number"
                                name="updatedPrice"
                                value={formValue.updatedPrice}
                                onChange={handleChange}
                                style={{ borderColor: errors.updatedPrice ? 'rgb(223,49,49)' : 'white' }}
                                min="0.01" step="0.01"
                            />
                            {errors.updatedPrice && <p className="error">{errors.updatedPrice}</p>}
                        </div>
                    </div>
                    {errors.Error && <p className="error">{errors.Error}</p>}
                    {!errors.length && formTouched && <p className="calculated-value">Estimated Instrument Value : $ {issuedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                    <button type="submit" disabled={shouldDisable} className="create-company-button">Add Instrument</button>
                </form>
            </div>
            <div className="create-company-image-container">
                <img className="create-instrument-cover" src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/cover4.jpg" alt="Cover" />
            </div>
        </div>
    )
}

