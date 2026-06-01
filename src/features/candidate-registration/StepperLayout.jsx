const steps = [
  "Personal Info",
  "Education",
  "Documents",
  "Review",
  "Submit",
];

function StepperLayout({ currentStep }) {
  return (
    <div className="stepper">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <div className="stepper-item" key={label}>
            <div className="stepper-top">
              <div
                className={
                  isComplete
                    ? "step-circle complete"
                    : isActive
                    ? "step-circle active"
                    : "step-circle upcoming"
                }
              >
                {isComplete ? "✓" : stepNumber}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={
                    isComplete ? "step-line complete-line" : "step-line"
                  }
                />
              )}
            </div>

            <span
              className={
                isActive
                  ? "step-label active-label"
                  : isComplete
                  ? "step-label complete-label"
                  : "step-label"
              }
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StepperLayout;