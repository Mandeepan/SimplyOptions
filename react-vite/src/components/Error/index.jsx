import { useRouteError } from 'react-router-dom';

export default function GenericError() {
    const error = useRouteError();

    console.error('Error:', error);

    const errorMessage = error?.data || error?.message || "An unknown error occurred";

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1>Uh oh, something went wrong</h1>
            <h2>We are currently experiencing some technical issues. Please try again later.</h2>
            {errorMessage && (
                <p style={{ color: 'red', marginTop: '1rem' }}>
                    {`Error Details: ${errorMessage}`}
                </p>
            )}
        </div>
    );
}
