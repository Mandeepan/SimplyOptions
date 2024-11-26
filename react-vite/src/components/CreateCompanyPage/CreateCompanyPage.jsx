import "./CreateCompanyPage.css"
import {useSelector, useDispatch} from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import { addACompanyThunk } from "../../redux/company";
import { updateAUserThunk} from "../../redux/user";

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
            }
            // after the user info is updated , direct to issuerPanel
            navigate('/issuerPanel')
        } catch (error) {
            console.error('Error adding company or updating user:', error);
            setErrors({...errors, "Error":error})
        }

        
    };

    return (
        <div className="create-company-container">
        <h2>Create a New Company</h2>
        <form onSubmit={handleSubmit} className="create-company-form">
            <div>
            <label>Company Name</label>
            <input
                type="text"
                name="companyName"
                value={formValue.companyName}
                onChange={handleChange}
            />
            {errors.companyName && <p className="error">{errors.companyName}</p>}
            </div>

            <div>
            <label>Short Description</label>
            <textarea
                type="text"
                name="shortDescription"
                value={formValue.shortDescription}
                onChange={handleChange}
            />
            {errors.shortDescription && <p className="error">{errors.shortDescription}</p>}
            </div>

            <div>
            <label>AI Prompt</label>
            <input
                type="text"
                name="aiPrompt"
                value={formValue.aiPrompt}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Founded Year</label>
            <input
                type="number"
                name="foundedYear"
                value={formValue.foundedYear}
                onChange={handleChange}
            />
            {errors.foundedYear && <p className="error">{errors.foundedYear}</p>}
            </div>

            <div>
            <label>API Identifier</label>
            <input
                type="text"
                name="apiIdentifier"
                value={formValue.apiIdentifier}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Location Identifiers</label>
            <input
                type="text"
                name="locationIdentifiers"
                value={formValue.locationIdentifiers}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Categories</label>
            <input
                type="text"
                name="categories"
                value={formValue.categories}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Number of Employees Enum</label>
            <input
                type="text"
                name="numEmployeesEnum"
                value={formValue.numEmployeesEnum}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Revenue Range</label>
            <input
                type="text"
                name="revenueRange"
                value={formValue.revenueRange}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Operating Status</label>
            <input
                type="text"
                name="operatingStatus"
                value={formValue.operatingStatus}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Website URL</label>
            <input
                type="text"
                name="websiteUrl"
                value={formValue.websiteUrl}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Logo URL</label>
            <input
                type="text"
                name="logoUrl"
                value={formValue.logoUrl}
                onChange={handleChange}
            />
            </div>

            <div>
            <label>Investors</label>
            <input
                type="text"
                name="investors"
                value={formValue.investors}
                onChange={handleChange}
            />
            </div>
            {errors.Error && <p className="error">{errors.Error}</p>}
            <button type="submit" disabled={shouldDisable}>Add Company</button>
        </form>
        </div>
    );
} 

