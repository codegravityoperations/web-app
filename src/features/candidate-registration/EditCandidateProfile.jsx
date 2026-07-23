import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { API, apiFetch, getBusinessIdFromToken } from "../../apiClient";
import "./EditCandidateProfile.css";

const buildInitialFormData = (authData) => ({
  candidateId: getBusinessIdFromToken() || "",
  email: authData?.email || "",
  phoneNumber: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
});

export default function EditCandidateProfile({ onBack }) {
  const { authData } = useAuth();
  const [formData, setFormData] = useState(() => buildInitialFormData(authData));
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.phoneNumber || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      alert("Please fill all required fields.");
      return;
    }

    if (!formData.candidateId) {
      setErrorMessage("Unable to determine candidate ID. Please log in again.");
      return;
    }

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    // NOTE: resume / eadDocument / drivingLicense are intentionally NOT
    // sent here. Uploading files requires the separate presign/confirm
    // upload endpoints — that's a different feature, not wired yet.
    const payload = {
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
    };

    try {
      await apiFetch(`${API.candidates}/${formData.candidateId}/profile`, {
        method: "PUT",
        auth: true,
        body: payload,
      });

      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setErrorMessage(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="candidate-form-container">

        <button
        type="button"
        onClick={onBack}
        style={{
            marginBottom: "20px",
            padding: "10px 16px",
            cursor: "pointer"
        }}
        >
        Back to Dashboard
        </button>

        <h2>Edit Candidate Profile</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSave} className="candidate-form">
        <label>Candidate ID</label>
        <input name="candidateId" value={formData.candidateId} disabled />

        <label>Email</label>
        <input name="email" value={formData.email} disabled />

        <label>Phone Number</label>
        <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

        <label>Address</label>
        <input name="address" value={formData.address} onChange={handleChange} required />

        <label>City</label>
        <input name="city" value={formData.city} onChange={handleChange} required />

        <label>State</label>
        <input name="state" value={formData.state} onChange={handleChange} required />

        <label>Zip Code</label>
        <input name="zipCode" value={formData.zipCode} onChange={handleChange} required />

        <label>Country</label>
        <input name="country" value={formData.country} onChange={handleChange} required />

        <label>Replace Resume</label>
        <input name="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

        <label>Replace EAD Document</label>
        <input name="eadDocument" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />

        <label>Replace Driving License</label>
        <input name="drivingLicense" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />

        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Profile"}</button>
      </form>
    </div>
  );
}