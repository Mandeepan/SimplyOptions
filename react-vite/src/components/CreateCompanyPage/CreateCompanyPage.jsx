import "./CreateCompanyPage.css"
import {useSelector, useDispatch} from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import { addACompanyThunk, getACompanyThunk } from "../../redux/company";
import { updateAUserThunk} from "../../redux/user";
import { usCities, industrySectors, revenueRanges, employeeRanges } from "./selectOptionList"
// import coverImage from '../../../public/cover1.jpg';

export default function CreateCompanyPage(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);

    // Form data state
    const [formValue, setFormValue]=useState({
        companyName: "",
        shortDescription: "",
        aiPrompt: "",
        foundedYear:"",
        apiIdentifier: "",
        locationIdentifiers: "",
        categories: "",
        numEmployeesEnum: "",
        revenueRange: "",
        operatingStatus: "",
        websiteUrl: "",
        logoUrl:"",
        investors: ""
    })
    // Error state
    const [errors, setErrors] = useState({});
    // the mode to disable button 
    const [shouldDisable, setShouldDisable]=useState(false)
    // monitor if the form has been touched, if not ( first time landing this page), error message should not appear
    const [formTouched, setFormTouched]=useState(false)
    // if it's demo data, even the form is not touched, button should not be disabled
    const [demoLinkClicked, setDemoLinkClicked]=useState(false)

    // monitor the user change on input fields in the form
    const handleChange = (e) => {
        setFormTouched(true); 
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    // Validation Screening
    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formValue.companyName) newErrors.companyName = 'Company name cannot be empty.';
        if (formValue.shortDescription.length < 10) newErrors.shortDescription = 'Short description should be at least 10 characters long.';
        if (formValue.foundedYear < 1900 || formValue.foundedYear > new Date().getFullYear()) {
            newErrors.foundedYear = 'Founded year must be between 1900 and the current year.';
        }
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
    
    //if a user hasn't been login, redirect back to home page
    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }
    else if(sessionUser & sessionUser.is_issuer){
        //if a user has already marked as issuer(representing a company), direct him back to issuer panel
        navigate('/issuerPanel')
        return
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formTouched || demoLinkClicked){
            // Dispatch thunk to add the company
            const newCompany = {
                company_name: formValue.companyName,
                short_description: formValue.shortDescription,
                ai_prompt: formValue.aiPrompt,
                founded_year: formValue.foundedYear,
                api_identifier: formValue.apiIdentifier,
                location_identifiers: formValue.locationIdentifiers,
                categories: formValue.categories,
                num_employees_enum: formValue.numEmployeesEnum,
                revenue_range: formValue.revenueRange,
                operating_status: formValue.operatingStatus,
                website_url: formValue.websiteUrl,
                logo_url: formValue.logoUrl,
                investors: formValue.investors,
            };

            try {
                // Dispatch the thunk to add a company, if successful, update user info
                const addedCompany = await dispatch(addACompanyThunk(newCompany));
                if (addedCompany && addedCompany.id) {
                    const newUserInfo = {
                        is_issuer: true,
                        company_id: addedCompany.id,
                    };
                    // Dispatch the thunk to update the user with the new company info
                    await dispatch(updateAUserThunk(parseInt(sessionUser.id), newUserInfo));
                    //get updated company info
                    await dispatch(getACompanyThunk(addedCompany.id))
                }
                // after the user info is updated , direct to issuerPanel
                navigate('/issuerPanel')
            } catch (error) {
                console.error('Error adding company or updating user:', error);
                setErrors({...errors, "Error":error})
            }
        } else {
            setErrors({...errors, "Error":"Please enter company information above."})
            setShouldDisable(true)
        }

    };

    const handleFillingDemoCompanyData= ()=>{
        const demoCompany = {
            companyName: "Demo Company",
            shortDescription: "This company profile was created for demonstration purpose",
            aiPrompt: "",
            foundedYear:1999,
            apiIdentifier: "",
            locationIdentifiers: "",
            categories: "",
            numEmployeesEnum: "",
            revenueRange: "",
            operatingStatus: "",
            websiteUrl: "",
            logoUrl:"",
            investors: ""
        };
        setFormValue(demoCompany);
        setDemoLinkClicked(true)
    }

    return (
        <div className="create-company-page">
        <div className="create-company-container">
        <h2>Create Company Profile</h2>
        <button onClick={handleFillingDemoCompanyData} className="demo-company-button"> * Click here to fill in sample company information</button>
        <form onSubmit={handleSubmit} className="create-company-form">
            <div className="each-item">
                <p style={{ textAlign: 'left', fontStyle:'italic' }}>All fields with * are required.</p>
            </div>
            <div className="row1">
                <div className='each-item'>
                <label>Company Name *</label>
                <input
                    type="text"
                    name="companyName"
                    value={formValue.companyName}
                    onChange={handleChange}
                    style={{ borderColor: errors.companyName ? 'rgb(223,49,49)' : 'white' }}
                />
                {errors.companyName && <p className="error">{errors.companyName}</p>}
                </div>

                <div className='each-item'>
                <label>Founded Year *</label>
                <input
                    type="number"
                    name="foundedYear"
                    value={formValue.foundedYear}
                    onChange={handleChange}
                    style={{ borderColor: errors.foundedYear ? 'rgb(223,49,49)' : 'white' }}
                />
                {errors.foundedYear && <p className="error">{errors.foundedYear}</p>}
                </div>
            </div>
            
            <div className="row2">
                <div className='each-item'>
                <label className='each-item'>Short Description *</label>
                <textarea
                    type="text"
                    name="shortDescription"
                    value={formValue.shortDescription}
                    onChange={handleChange}
                    style={{ borderColor: errors.shortDescription ? 'rgb(223,49,49)' : 'white' }}
                />
                {errors.shortDescription && <p className="error">{errors.shortDescription}</p>}
                </div>

                <div className='each-item'>
                <label className='each-item'>AI Prompt</label>
                <textarea
                    type="text"
                    name="aiPrompt"
                    value={formValue.aiPrompt}
                    onChange={handleChange}
                    style={{ borderColor: errors.aiPrompt ? 'rgb(223,49,49)' : 'white' }}
                />
                </div>
            </div>


            {/* <div>
            <label>API Identifier</label>
            <input
                type="text"
                name="apiIdentifier"
                value={formValue.apiIdentifier}
                onChange={handleChange}
                style={{ borderColor: errors.apiIdentifier ? 'rgb(223,49,49)' : 'white' }}
            />
            </div> */}

            <div className="row3">
                <div className='each-item'>
                    <label>Location</label>
                    <select
                        name="locationIdentifiers"
                        value={formValue.locationIdentifiers}
                        onChange={handleChange}
                        style={{ borderColor: errors.locationIdentifiers ? 'rgb(223,49,49)' : 'white' }}
                    >
                        <option value="">--</option>
                        {usCities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div className='each-item'>
                    <label>Category</label>
                    <select
                        name="categories"
                        value={formValue.categories}
                        onChange={handleChange}
                        style={{ borderColor: errors.categories ? 'rgb(223,49,49)' : 'white' }}
                    >
                        <option value="">--</option>
                        {industrySectors.map((sector, index) => (
                            <option key={index} value={sector}>{sector}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="row4">
                <div className='each-item'>
                    <label>Number of Employees</label>
                    <select
                        name="numEmployeesEnum"
                        value={formValue.numEmployeesEnum}
                        onChange={handleChange}
                        style={{ borderColor: errors.numEmployeesEnum ? 'rgb(223,49,49)' : 'white' }}
                    >
                        <option value="">--</option>
                        {employeeRanges.map((sector, index) => (
                            <option key={index} value={sector}>{sector}</option>
                        ))}
                    </select>
                </div>

                <div className='each-item'>
                <label>Revenue Range</label>
                <select
                    type="text"
                        name="revenueRange"
                        value={formValue.revenueRange}
                        onChange={handleChange}
                        style={{ borderColor: errors.revenueRange ? 'rgb(223,49,49)' : 'white' }}
                >
                    <option value="">--</option>
                            {revenueRanges.map((sector, index) => (
                                <option key={index} value={sector}>{sector}</option>
                            ))}
                    </select>
                </div>
            </div>

            <div className="row5">
                <div className='each-item'>
                    <label>Operating Status</label>
                    <select
                        name="operatingStatus"
                        value={formValue.operatingStatus}
                        onChange={handleChange}
                        style={{ borderColor: errors.operatingStatus ? 'rgb(223,49,49)' : 'white' }}
                    >
                        <option value="">--</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                <div className='each-item'>
                <label>Website URL</label>
                <input
                    type="text"
                    name="websiteUrl"
                    value={formValue.websiteUrl}
                    onChange={handleChange}
                    style={{ borderColor: errors.websiteUrl ? 'rgb(223,49,49)' : 'white' }}
                />
                </div>
            </div>

            <div className="row6">
                <div className='each-item'>
                <label>Logo URL</label>
                <input
                    type="text"
                    name="logoUrl"
                    value={formValue.logoUrl}
                    onChange={handleChange}
                    style={{ borderColor: errors.logoUrl ? 'rgb(223,49,49)' : 'white' }}
                />
                </div>

                <div className='each-item'>
                <label>Investors</label>
                <input
                    type="text"
                    name="investors"
                    value={formValue.investors}
                    onChange={handleChange}
                    style={{ borderColor: errors.investors ? 'rgb(223,49,49)' : 'white' }}
                />
                </div>
            </div>
            {errors.Error && <p className="error">{errors.Error}</p>}
            <button type="submit" disabled={shouldDisable} className="create-company-button">Add Company</button>
        </form>
        </div>

        <div className="create-company-image-container">
            <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/cover1.jpg" alt="Cover" />
        </div>
        </div>
    );
} 

