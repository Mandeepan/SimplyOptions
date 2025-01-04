import { useRouteError } from 'react-router-dom';

export default function GenericError() {
    const error = useRouteError();

    console.error('Error:', error);

    const errorMessage = error?.data || error?.message || "Page does not exist.";

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1 style={{fontSize: '1.5rem'}}>Uh oh, something went wrong</h1>
            {errorMessage && (
                <p className="error" style={{marginTop: '1rem', fontSize: '1rem' }}>
                    {`${errorMessage}`}
                </p>
            )}
        </div>
    );
}
