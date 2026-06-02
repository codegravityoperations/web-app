import {z} from "zod";

export const personalInfoSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    personalEmail: z.string().email("Valid personal email is required"),
    mobile: z.string().min(10, "Mobile number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    currentAddress: z.string().min(1, "Current address is required"),
    referralSource: z.string().min(1, "Referral source is required"),
});

export const educationalInfoSchema = z
  .object({
    highestDegreeInUs: z.string().min(1, "Degree selection is required"),
    degreeOtherNotes: z.string().optional(),
    major: z.string().min(1, "Major is required"),
    universityName: z.string().min(1, "University name is required"),
    City: z.string().min(1, "City is required"),
    State: z.string().min(1, "State are required"),
    graduationDate: z.string().min(1, "Graduation date is required"),
  })
  .superRefine((data, ctx) => {
    if (data.degreeInUs === "Other" && !data.degreeOtherNotes?.trim()) {
      ctx.addIssue({
        path: ["degreeOtherNotes"],
        code: z.ZodIssueCode.custom,
        message: "Please specify other degree details",
      });
    }
  });

  export const fullSchema = personalInfoSchema.merge(educationalInfoSchema);