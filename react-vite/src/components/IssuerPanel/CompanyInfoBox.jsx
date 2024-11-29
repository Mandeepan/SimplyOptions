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
                    <table className="company-info-table">
                        <tbody>
                            <tr>
                                <td className="company-info-heading">Founded In:</td>
                                <td className="company-info-content">{currentCompany.founded_year}</td>
                            </tr>
                            <tr>
                                <td className="company-info-heading">Operating Status:</td>
                                <td className="company-info-content">{currentCompany.operating_status ? currentCompany.operating_status : "Not Available."}</td>
                            </tr>
                            <tr>
                                <td className="company-info-heading">Category:</td>
                                <td className="company-info-content">{currentCompany.categories ? currentCompany.categories : "Not Available."}</td>
                            </tr>
                            <tr>
                                <td className="company-info-heading">Location:</td>
                                <td className="company-info-content">{currentCompany.location_identifiers ? currentCompany.location_identifiers : "Not Available."}</td>
                            </tr>
                            <tr>
                                <td className="company-info-heading">Revenue Range:</td>
                                <td className="company-info-content">{currentCompany.revenue_range ? currentCompany.revenue_range : "Not Available."}</td>
                            </tr>
                            <tr>
                                <td className="company-info-heading">Employees:</td>
                                <td className="company-info-content">{currentCompany.num_employees_enum ? currentCompany.num_employees_enum : "Not Available."}</td>
                            </tr>
                            <tr>
                                <td className="company-info-heading">Investors:</td>
                                <td className="company-info-content">{currentCompany.investors ? currentCompany.investors : "Not Available."}</td>
                            </tr>
                            <tr>
                                <td className="company-info-heading">AI Prompt:</td>
                                <td className="company-info-content">{currentCompany.ai_prompt ? currentCompany.ai_prompt : "Not Available."}</td>
                            </tr>
                            <tr>
                                <td className="company-info-heading">Description:</td>
                                <td className="company-info-content">{currentCompany.short_description}</td>
                            </tr>
                        </tbody>
                    </table>
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