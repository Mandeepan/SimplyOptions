
import {useDispatch, useSelector} from 'react-redux'
import { getAllInstrumentsThunk } from "../../redux/instrument"
// import { useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react'
import{getAUserThunk} from "../../redux/user";
import "./HomePageAfterLogin.css"

export default function HomePageAfterLogin(){
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const instrumentsObject = useSelector((state) => state.instruments.allInstruments);
    const instruments = Object.values(instrumentsObject);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(instruments.length / rowsPerPage);


    useEffect(() => {
        dispatch(getAllInstrumentsThunk());
        dispatch(getAUserThunk(parseInt(sessionUser.id)))
    }, [dispatch, sessionUser]);

    
    // Get current page instruments
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentInstruments = instruments.slice(indexOfFirstRow, indexOfLastRow);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    return (
    <div className="homepage-container">
        <h1>Explore Instruments</h1>
        <table className="instruments-table">
        <thead>
            <tr>
            <th>Company Name</th>
            <th>Instrument Name</th>
            <th>Instrument Type</th>
            <th>Instrument Class</th>
            <th>Updated Price</th>
            </tr>
        </thead>
        <tbody>
            {currentInstruments.map((instrument) => (
            <tr key={instrument.id}>
                <td>
                <a href={`/instruments/${instrument.id}`} target="_blank" rel="noopener noreferrer">
                    {instrument.company_name}
                </a>
                </td>
                <td>{instrument.instrument_name}</td>
                <td>{instrument.instrument_type}</td>
                <td>{instrument.instrument_class}</td>
                <td>$ {instrument.updated_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            ))}
        </tbody>
        </table>

        <div className="pagination">
        <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
        >
            Next
        </button>
        </div>
    </div>
    );
}