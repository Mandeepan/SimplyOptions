import {useNavigate} from 'react-router-dom';
import {useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import { deleteACompanyThunk } from '../../redux/company';
import { updateAUserThunk } from '../../redux/user';

export default function CompanyInfoBox({currentCompany, userId}){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { setModalContent, closeModal } = useModal();
    // Ensure URL has a valid protocol
    const getValidURL = (url) => {
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
        }
        return url;
    };

    const handleUpdateCompanyClick=()=>{
        navigate('/updateCompany')
    }

    const handleDeleteCompanyProcess= async (companyId, userId)=>{
        try{
            await dispatch(deleteACompanyThunk(companyId))
        } catch (error) {
            console.error('Error deleting company', error);
            alert("Can not delete this company record, please reach out to help@simplyoptions.com")
            navigate('/issuerPanel')
        }
        try{
            const newUserInfo = {
                is_issuer: false,
                company_id: null,
            };
            await dispatch(updateAUserThunk(userId, newUserInfo))

            closeModal();
        } catch (error) {
            console.error('Error updating user profile:', error);
            alert("Can not update user record, please reach out to help@simplyoptions.com")
            navigate('/issuerPanel')
        }
    }

    const handleDeleteCompanyClick=(companyId, userId)=>{
        setModalContent(
			<ConfirmDeleteModal
            itemToDelete={"COMPANY"}
				onConfirm={()=> handleDeleteCompanyProcess(companyId,userId)}
				onCancel={closeModal}
			/>
		);
    }

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
                    <button className="update-company-button" onClick={handleUpdateCompanyClick}>Update Company Profile</button>
                    <button className="delete-company-button" onClick={(e)=>{
                            e.preventDefault();
                            handleDeleteCompanyClick(currentCompany.id, userId)
                    }}>Delete Company Account</button>
                </div>
                </div>
        </div>
    )
}