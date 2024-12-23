import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ModalProvider, Modal } from '../context/Modal';
import { thunkAuthenticate } from '../redux/session';
import Navigation from '../components/Navigation/Navigation';

export default function Layout() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <>
            <ModalProvider>
                <Navigation />
                {isLoaded && <Outlet />}
                <Modal />
                {/* Footer */}
                <footer className="footer">
                    <p>© {new Date().getFullYear()} SimplyOptions. All rights reserved. Designed and built by 
                        <a 
                            href="https://mandypan.io/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ marginLeft: "5px", color: "rgb(126, 85, 246)" }}
                        >
                            Mandy Pan.
                        </a></p>

                </footer>
            </ModalProvider>
        </>
    );
}
