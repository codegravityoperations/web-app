import { useState } from "react";

const dummyCandidate = {
  candidateId: "CG1001",
  firstName: "Anjal",
  lastName: "Bhattarai",
  email: "anjal@test.com",
  phoneNumber: "6155551234",
  address: "123 Main St",
  city: "Clarksville",
  state: "TN",
  zipCode: "37040",
  country: "USA",
  status: "SUBMITTED",
  updatedAt: "2026-06-15T10:00:00Z",
};

export default function EditCandidateProfile({onBack}) {
  const [formData, setFormData] = useState(dummyCandidate);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.phoneNumber || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      ...formData,
      status: "UPDATED",
      updatedAt: new Date().toISOString(),
    };

    console.log(`PUT /api/candidates/${formData.candidateId}/profile`, payload);

    setFormData(payload);
    setSuccessMessage("Profile updated successfully.");
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

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}