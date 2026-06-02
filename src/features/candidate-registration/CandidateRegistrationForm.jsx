import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StepperLayout from "./StepperLayout";
import { fullSchema } from "./schemas";
import "./CandidateRegistrationForm.css";

const stepFields = {
  1: [
    "firstName",
    "lastName",
    "personalEmail",
    "mobile",
    "dateOfBirth",
    "currentAddress",
    "referralSource",
  ],
  2: [
    "degreeInUs",
    "degreeOtherNotes",
    "major",
    "universityName",
    "city",
    "state",
    "graduationDate",
  ],
};

function CandidateRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      personalEmail: "",
      mobile: "",
      dateOfBirth: "",
      currentAddress: "",
      referralSource: "",

      degreeInUs: "",
      degreeOtherNotes: "",
      major: "",
      universityName: "",
      city: "",
      state: "",
      graduationDate: "",
    },
  });

  const degreeInUs = watch("degreeInUs");
  const watchedValues = watch();

  const isCurrentStepValid = useMemo(() => {
    const fields = stepFields[currentStep] || [];

    return fields.every((field) => {
      if (field === "degreeOtherNotes" && degreeInUs !== "Other") {
        return true;
      }

      return watchedValues[field]?.toString().trim();
    });
  }, [watchedValues, currentStep, degreeInUs]);

 const handleNext = async () => {
  const fieldsToValidate = stepFields[currentStep] || [];

  const isValid =
    fieldsToValidate.length === 0 ? true : await trigger(fieldsToValidate);

  if (isValid) {
    setCurrentStep((prev) => prev + 1);
  }
};

const handleBack = () => {
  setCurrentStep((prev) => prev - 1);
};

const onSubmit = (data) => {
  console.log("Candidate registration data:", data);
};

  return (
    <div className="candidate-registration-page">
      <div className="candidate-form-card">
        <div className="form-header">
          <h1>Candidate Registration</h1>
          <p>Complete your registration one section at a time.</p>
        </div>

        <StepperLayout currentStep={currentStep} />

        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 1 && (
            <section className="form-section">
              <h2>Step 1: Personal Information</h2>

              <div className="form-grid">
                <div className="form-field">
                  <label>
                    First Name <span>*</span>
                  </label>
                  <input type="text" {...register("firstName")} />
                  <p className="error-message">{errors.firstName?.message}</p>
                </div>

                <div className="form-field">
                  <label>
                    Last Name <span>*</span>
                  </label>
                  <input type="text" {...register("lastName")} />
                  <p className="error-message">{errors.lastName?.message}</p>
                </div>

                <div className="form-field">
                  <label>
                    Personal Email <span>*</span>
                  </label>
                  <input type="email" {...register("personalEmail")} />
                  <p className="error-message">
                    {errors.personalEmail?.message}
                  </p>
                </div>

                <div className="form-field">
                  <label>
                    Mobile <span>*</span>
                  </label>
                  <input type="text" {...register("mobile")} />
                  <p className="error-message">{errors.mobile?.message}</p>
                </div>

                <div className="form-field">
                  <label>
                    Date of Birth <span>*</span>
                  </label>
                  <input type="date" {...register("dateOfBirth")} />
                  <p className="error-message">
                    {errors.dateOfBirth?.message}
                  </p>
                </div>

                <div className="form-field">
                  <label>
                    Referral Source <span>*</span>
                  </label>
                  <select {...register("referralSource")}>
                    <option value="">Select source</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Friend">Friend</option>
                    <option value="Company Website">Company Website</option>
                    <option value="Other">Other</option>
                  </select>
                  <p className="error-message">
                    {errors.referralSource?.message}
                  </p>
                </div>

                <div className="form-field full-width">
                  <label>
                    Current Address <span>*</span>
                  </label>
                  <textarea {...register("currentAddress")} />
                  <p className="error-message">
                    {errors.currentAddress?.message}
                  </p>
                </div>
              </div>
            </section>
          )}

          {currentStep === 2 && (
            <section className="form-section">
              <h2>Step 2: Education</h2>

              <div className="form-grid">
                <div className="form-field">
                  <label>
                    Highest Degree in US <span>*</span>
                  </label>
                  <select {...register("degreeInUs")}>
                    <option value="">Select degree</option>
                    <option value="Associate">Associate</option>
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                  <p className="error-message">{errors.degreeInUs?.message}</p>
                </div>

                <div className="form-field">
                  <label>
                    Major <span>*</span>
                  </label>
                  <input type="text" {...register("major")} />
                  <p className="error-message">{errors.major?.message}</p>
                </div>

                {degreeInUs === "Other" && (
                  <div className="form-field full-width">
                    <label>
                      Other Degree Notes <span>*</span>
                    </label>
                    <input type="text" {...register("degreeOtherNotes")} />
                    <p className="error-message">
                      {errors.degreeOtherNotes?.message}
                    </p>
                  </div>
                )}

                <div className="form-field">
                  <label>
                    University Name <span>*</span>
                  </label>
                  <input type="text" {...register("universityName")} />
                  <p className="error-message">
                    {errors.universityName?.message}
                  </p>
                </div>

                <div className="form-field">
                  <label>
                    City <span>*</span>
                  </label>
                  <input type="text" {...register("city")} />
                  <p className="error-message">{errors.city?.message}</p>
                </div>

                <div className="form-field">
                  <label>
                    State <span>*</span>
                  </label>
                  <input type="text" {...register("state")} />
                  <p className="error-message">{errors.state?.message}</p>
                </div>

                <div className="form-field">
                  <label>
                    Graduation Date <span>*</span>
                  </label>
                  <input type="date" {...register("graduationDate")} />
                  <p className="error-message">
                    {errors.graduationDate?.message}
                  </p>
                </div>
              </div>
            </section>
          )}

          {currentStep === 3 && (
            <section className="form-section">
                <h2>Step 3: Documents</h2>
                <p className="empty-step-message">
                    Document upload section will be added here.
                </p>
            </section>
          )}

          
          <div className="button-row">
            {currentStep > 1 && (
              <button type="button" className="secondary-button" onClick={handleBack}>
                Back
              </button>
            )}

            {currentStep < 2 && (
              <button
                type="button"
                className="primary-button"
                onClick={handleNext}
                disabled={!isCurrentStepValid}
              >
                Next <span>→</span>
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                className="primary-button"
                onClick={handleNext}
                disabled={!isCurrentStepValid}
              >
                Save Education
              </button>
            )}

            {currentStep === 3 && (
                <button type="button" className="primary-button" disbaled>
                Next
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default CandidateRegistrationForm;