import "./UpdateCompanyPage.css"
import { useEffect, useState, useCallback } from "react";
import {useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate} from 'react-router-dom';
import { getAUserThunk } from '../../redux/user';
import { getACompanyThunk, updateACompanyThunk } from '../../redux/company'
import { usCities, industrySectors, revenueRanges, employeeRanges } from "../CreateCompanyPage/selectOptionList"

export default function UpdateCompanyPage(){
    const navigate =useNavigate()
    const dispatch =useDispatch()
    const sessionUser = useSelector((state) => state.session.user);
    const userInfo = useSelector(state => state.currentUser.currentUser);
    const currentCompany = useSelector(state => state.currentCompany.currentCompany)
    
    // Form data state
    let initialCompanyValue ={
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
    }
    const [formValue, setFormValue]=useState({initialCompanyValue})
    // Error state
    const [errors, setErrors] = useState({});
    // the mode to disable button 
    const [shouldDisable, setShouldDisable]=useState(false)
    // monitor if the form has been touched, if not ( first time landing this page), error message should not appear
    const [formTouched, setFormTouched]=useState(false)



    
    // task 1 : get current log in user info
    useEffect(() => {
        if (sessionUser) {
            dispatch(getAUserThunk(parseInt(sessionUser.id)));
        }
    }, [dispatch, sessionUser]);
    
    // task 2: get current company info for pre-filling the form
    useEffect(() => {
        if (userInfo?.company_id) {
            dispatch(getACompanyThunk(userInfo.company_id));
        }
    }, [dispatch, userInfo]);

    //task 3 : prefilling company info
    useEffect(() => {
        if (currentCompany) {
            setFormValue({
                companyName: currentCompany.company_name || "",
                shortDescription: currentCompany.short_description || "",
                aiPrompt: currentCompany.ai_prompt || "",
                foundedYear: currentCompany.founded_year || "",
                apiIdentifier: currentCompany.api_identifier || "",
                locationIdentifiers: currentCompany.location_identifiers || "",
                categories: currentCompany.categories || "",
                numEmployeesEnum: currentCompany.num_employees_enum || "",
                revenueRange: currentCompany.revenue_range || "",
                operatingStatus: currentCompany.operating_status || "",
                websiteUrl: currentCompany.website_url || "",
                logoUrl: currentCompany.logo_url || "",
                investors: currentCompany.investors || ""
            });
        }
    }, [currentCompany]);
    
    

     // Validation Screening Helper Function
    const validateForm = useCallback(() => {
        const newErrors = {};
        if (!formValue.companyName) newErrors.companyName = 'Company name cannot be empty.';
        if (formValue.shortDescription.length < 10) newErrors.shortDescription = 'Short description should be at least 10 characters long.';
        if (formValue.foundedYear < 1900 || formValue.foundedYear > new Date().getFullYear()) {
            newErrors.foundedYear = 'Founded year must be between 1900 and the current year.';
        }
        return newErrors;
    }, [formValue]);

    // task 4: Error checking
    useEffect(() => {
        if (formTouched) {
            const newErrors = validateForm();
            setErrors(newErrors);
            setShouldDisable(Object.keys(newErrors).length > 0);
        }
    }, [formValue, formTouched, validateForm]);
    
    if (!sessionUser) {
        return <Navigate to='/'></Navigate>
    }   
    else if(sessionUser & sessionUser.is_issuer){
        //if a user has already marked as issuer(representing a company), direct him back to issuer panel
        navigate('/issuerPanel')
        return
    }

    

    if (currentCompany){
        initialCompanyValue ={
            companyName: currentCompany.company_name,
            shortDescription: currentCompany.short_description,
            aiPrompt: currentCompany.ai_prompt,
            foundedYear:currentCompany.founded_year,
            apiIdentifier: currentCompany.api_identifier,
            locationIdentifiers: currentCompany.location_identifiers,
            categories: currentCompany.categories,
            numEmployeesEnum: currentCompany.num_employees_enum,
            revenueRange: currentCompany.revenue_range,
            operatingStatus: currentCompany.operating_status,
            websiteUrl: currentCompany.website_url,
            logoUrl:currentCompany.logo_url,
            investors: currentCompany.investors
        }
    }

    // monitor the user change on input fields in the form
    const handleChange = (e) => {
        setFormTouched(true); 
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formTouched){
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
                // Dispatch the thunk to update the company
                await dispatch(updateACompanyThunk(currentCompany.id, newCompany));
                // direct to issuerPanel after
                navigate('/issuerPanel')
            } catch (error) {
                console.error('Error updating company', error);
                setErrors({...errors, "Error":error})
            }
        } else {
            setErrors({...errors, "Error":"Please enter company information above."})
            setShouldDisable(true)
        }
    };

    return (
        <div className="create-company-page">
            <div className="create-company-image-container">
                <img src="/cover2.jpg" alt="Cover" />
            </div>
            <div className="create-company-container">
            <h2>Update Company Profile</h2>
            <form onSubmit={handleSubmit} className="create-company-form">
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
                <button type="submit" disabled={shouldDisable} className="create-company-button">Update Company Profile</button>
            </form>
            </div>


        </div>
    )
}