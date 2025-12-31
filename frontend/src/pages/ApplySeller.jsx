import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ApplySeller() {
  const [storeName, setStoreName] = useState("");
  const navigate = useNavigate();

  const applySeller = async () => {
    if (!storeName) return alert("Store name required");

    await api.post("/sellers/apply", { storeName });

    navigate("/seller-pending");
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Become a Seller</h3>
      <input
        type="text"
        placeholder="Store Name"
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
        className="border px-3 py-2 w-full mb-3"
      />
      <button
        onClick={applySeller}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Apply for Seller
      </button>
    </div>
  );
}
