import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "./Policies.css";

const rulesContent = `
## Transaction Rules and Guidelines

### 1. Placing an Offer
- **Issuers** cannot place offers. However, a company can register two accounts: one as an issuer (to approve offers) and another as a non-issuer (to place offers or buy back shares).
- Ensure your **available balance** is at least **1.1%** of the offer value.
- You cannot place multiple offers for the **same instrument**. Update your existing offer instead.
- Users with an **active listing** cannot place offers.

### 2. Placing a Listing
- **Issuers** are not allowed to place listings.
- You can only have one active listing at a time. Update your existing listing if needed.
- Users with a **not fully filled offer** cannot place a new listing.

### 3. Updating an Offer
- If your offer is tied to **pending transactions**, you cannot update it. You can either **cancel the transaction** or **wait for approval**.
- If increasing the offer quantity, ensure your **available balance** is at least **1.1%** of the new offer value.

### 4. Updating a Listing
- If your listing is linked to **pending transactions**, you cannot update it. You can either **cancel the transaction** or **wait for approval**.

### 5. Deleting an Offer or Listing
- If your offer or listing is linked to **pending transactions**, you cannot delete it. You must **cancel the transaction** or **wait for approval**.

### 6. Starting a New Transaction
- **For Buyers**: Your available balance must cover the **transaction value** plus the **transaction fee**.
- **For Sellers**: Your available balance must cover the **transaction fee**.
- After a transaction is created, both users' **available balances** and the **remaining quantity** of the offer and listing will be updated, even if the transaction is not yet approved or rejected.

### 7. Updating a Transaction
- If the **issuer approves**, the transaction status is updated, and both users' balances are adjusted.
- If the **issuer rejects** or the **user cancels**, the remaining quantities of the offer and listing will increase, and both users' balances will be updated.
`;

const Policies = () => {
  const sessionUser = useSelector((state) => state.session.user);
  
  if (!sessionUser) {
    return <Navigate to='/' />;
}

  return (
    <div className="rules-container">
      <ReactMarkdown>{rulesContent}</ReactMarkdown>
    </div>
  );
};

export default Policies;

