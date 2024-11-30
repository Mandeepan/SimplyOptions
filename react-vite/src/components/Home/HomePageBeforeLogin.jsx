import './HomePageBeforeLogin.css';
import { useNavigate } from "react-router-dom";

export default function HomePageBeforeLogin() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/login");
      };

      const handleSignUpClick = () => {
        navigate("/signup");
      };
      

    return (
        <div className="home-before-login-container">
            <div className="video-background">
                <video autoPlay loop muted className="fullscreen-video">
                    <source src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/cover.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="content-overlay">
                <h1 className='company-name'>SimplyOptions</h1>
                <div className='login-signup-container'>
                    <button onClick={handleLoginClick}>Log In</button>
                    <button onClick={handleSignUpClick}>Sign Up</button>
                </div>
                <div className="company-description">
                    <h2>Your Platform for Private Share Liquidity</h2>
                    <p>
                        SimplyOptions is the marketplace for trading private company shares. The platform provides a seamless
                        experience for investors, issuers, and shareholders looking for simplified yet efficient liquidity solutions within
                        private markets.
                    </p>
                </div>
               
                <div className="user-roles-container">
                    <div className="user-role-box">
                        <h2>Investors</h2>
                        <ul>
                            <li>Gain transparency and access to a live order book for private shares.</li>
                            <li>Maintain control over investments with complete anonymity until you&apos;re ready to transact.</li>
                            <li>Effortlessly execute transactions with direct negotiations and standardized agreements.</li>
                            <li>Expand your investment opportunities in pre-IPO companies, all with transparent fees.</li>
                        </ul>
                    </div>
                    <div className="user-role-box">
                        <h2>Issuers</h2>
                        <ul>
                            <li>Offer your shareholders liquidity with reduced transaction fees.</li>
                            <li>Manage and approve transactions, from who buys to how much is traded, effortlessly.</li>
                            <li>Pre-approve trading windows and price ranges, maintaining full control over your cap table.</li>
                            <li>Partner with SimplyOptions for seamless transaction execution and compliance checks.</li>
                        </ul>
                    </div>
                    <div className="user-role-box">
                        <h2>Shareholders</h2>
                        <ul>
                            <li>Sell shares easily: search prices, connect with buyers, and complete transactions in just a few steps.</li>
                            <li>Access a deep pool of buyers while staying anonymous until ready to proceed.</li>
                            <li>Enjoy transparent and fixed transaction fees, with no hidden surprises.</li>
                            <li>Let us handle the details so you can focus on what matters—getting liquidity for your shares.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
} 
