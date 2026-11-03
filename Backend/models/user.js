const mongoose = require("mongoose");

const ROLES = ["candidate", "recruiter", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: { type: String, trim: true, default: "" },
    pronouns: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    currentAddress: { type: String, trim: true, default: "" },
    permanentAddress: { type: String, trim: true, default: "" },
    headline: { type: String, trim: true, default: "" },
    professionalSummary: { type: String, trim: true, maxlength: 1000, default: "" },
    degree: { type: String, trim: true, default: "" },
    fieldOfStudy: { type: String, trim: true, default: "" },
    graduationYear: { type: String, trim: true, default: "" },
    currentTitle: { type: String, trim: true, default: "" },
    currentOrganization: { type: String, trim: true, default: "" },
    yearsExperience: { type: String, trim: true, default: "" },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
      default: "candidate",
    },
  },
  { timestamps: true }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    college: this.college,
    dob: this.dob,
    role: this.role,
    phone: this.phone || "",
    pronouns: this.pronouns || "",
    location: this.location || "",
    currentAddress: this.currentAddress || "",
    permanentAddress: this.permanentAddress || "",
    headline: this.headline || "",
    professionalSummary: this.professionalSummary || "",
    degree: this.degree || "",
    fieldOfStudy: this.fieldOfStudy || "",
    graduationYear: this.graduationYear || "",
    currentTitle: this.currentTitle || "",
    currentOrganization: this.currentOrganization || "",
    yearsExperience: this.yearsExperience || "",
  };
};

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
