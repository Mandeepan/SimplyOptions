export default function CompanyInfoBox({currentCompany}){
    // Ensure URL has a valid protocol
    const getValidURL = (url) => {
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
        }
        return url;
    };

    return (
        <div className="company-controller">
                <div className="company-controller-head-banner">
                    <h3>COMPANY</h3>
                </div>
                <div className="company-controller-body">
                <div className="company-info-box">
                    <h3><a href={getValidURL(currentCompany.website_url)}>{currentCompany.company_name}</a></h3>
                    <p>
                        <span className="company-info-heading">Founded In:</span>
                        <span className="company-info-content"> {currentCompany.founded_year}</span>
                    </p>
                    <p>
                        <span className="company-info-heading">Operating Status:</span>
                        <span className="company-info-content"> {currentCompany.ai_prompt ? currentCompany.ai_prompt : "Not Available."}</span>
                    </p>
                    <p>
                        <span className="company-info-heading">Category:</span>
                        <span className="company-info-content"> {currentCompany.ai_prompt ? currentCompany.ai_prompt : "Not Available."}</span>
                    </p>
                    <p>
                        <span className="company-info-heading">Location:</span>
                        <span className="company-info-content"> {currentCompany.ai_prompt ? currentCompany.ai_prompt : "Not Available."}</span>
                    </p>
                    <p>
                        <span className="company-info-heading">Revenue Range:</span>
                        <span className="company-info-content"> {currentCompany.ai_prompt ? currentCompany.ai_prompt : "Not Available."}</span>
                    </p>
                    <p>
                        <span className="company-info-heading">Employees:</span>
                        <span className="company-info-content"> {currentCompany.ai_prompt ? currentCompany.ai_prompt : "Not Available."}</span>
                    </p>
                    <p>
                        <span className="company-info-heading">Investors:</span>
                        <span className="company-info-content"> {currentCompany.ai_prompt ? currentCompany.ai_prompt : "Not Available."}</span>
                    </p>
                    <p>
                        <span className="company-info-heading">AI Prompt:</span>
                        <span className="company-info-content"> {currentCompany.ai_prompt ? currentCompany.ai_prompt : "Not Available."}</span>
                    </p>
                    <p>
                        <span className="company-info-heading">Description:</span>
                        <span className="company-info-content"> {currentCompany.short_description}</span>
                    </p>
                </div>

                <div className="company-buttons">
                    <button className="update-company-button">Update Company Profile</button>
                    <button className="delete-company-button">Delete Company Account</button>
                </div>
                </div>
        </div>
    )
}