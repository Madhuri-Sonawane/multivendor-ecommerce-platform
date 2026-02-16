import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function SellerPending() {
  const { refreshUser, user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshUser();
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Seller Approval Pending</h2>
      <p>
        Your seller account is under review. You will be able to add products
        once approved by admin.
      </p>
    </div>
  );
}
