import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "./UserGuide.css";

const UserGuide = () => {
  const sessionUser = useSelector((state) => state.session.user);

  if (!sessionUser) {
    return <Navigate to='/' />;
  }

  return (
    <div className="rules-container">
      <h2>User Guide</h2>

      <section>

        <h4>Intuitive Platform Overview</h4>
        <p>Discover the platform's functionality through an engaging and informative home page.</p>
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Platform Overview" />

        <h4>Seamless Authentication</h4>
        <p>Log in with ease using our robust authentication system, complete with detailed error handling to guide you through any issues.</p>
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Login Error Example" />
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Login Success Example" />

        <h4>Dynamic Instrument Listing</h4>
        <p>Browse through all available instruments on the landing page. Use the dynamic search bar to find specific instruments quickly.</p>
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Instrument Listing" />
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Search Feature" />

        <h4>Comprehensive Instrument Details</h4>
        <p>Select an instrument to access a dedicated page with all its relevant details. Interact with SimpleBuddy, our AI chatbot, for personalized guidance, or manage your shares with ease.</p>
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Instrument Details" />
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="SimpleBuddy Chat" />
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Offer Placement" />
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="List Shares" />

        <h4>User-Friendly Platform Rules</h4>
        <p>Adhere to platform rules with guidance available in the user menu for streamlined operations.</p>
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Platform Rules" />

        <h4>Effortless Transactions</h4>
        <p>Accept offers from other users to initiate transactions. Pending transactions will await the issuer's decision for approval or rejection.</p>
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Transaction Pending" />

        <h4>Versatile User Dashboard</h4>
        <p>Manage your account effectively. Deposit or withdraw funds, update listings, and review your transaction history with ease.</p>
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="User Dashboard" />
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Update Listings" />

        <h4>Issuer-Specific Panel</h4>
        <p>Issuer users can manage company information, update or delete instruments, and handle transactions efficiently. The issuer dashboard provides a comprehensive view of company operations and transaction history.</p>
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Issuer Panel Overview" />
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Manage Instruments" />
        <img src="https://simplyoptionsbucket.s3.us-east-1.amazonaws.com/public/WebsiteScreenshots/Screenshot+2025-01-01+at+5.37.40%E2%80%AFPM.png" alt="Transaction Approval" />
      </section>
    </div>
  );
};

export default UserGuide;
