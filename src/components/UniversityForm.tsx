import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage, getIn } from "formik";
import * as Yup from "yup";
import { 
  Plus, 
  Trash2, 
  Mail, 
  User, 
  GraduationCap, 
  School, 
  Calendar, 
  Award, 
  Info, 
  CheckCircle, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FormValues, University } from "../types";
import Tooltip from "./Tooltip";

// Inline sub-component for auto-focusing inputs when added
interface FocusInputProps {
  shouldFocus: boolean;
  [key: string]: any;
}

function FocusInput({ shouldFocus, ...props }: FocusInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      // Small timeout ensures element is fully rendered and layout settled
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        // Softly scroll the element into view if offscreen
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [shouldFocus]);

  return <input ref={inputRef} {...props} />;
}

interface UniversityFormProps {
  onSubmitSuccess: (data: FormValues) => void;
}

// Yup Validation Schema
const validationSchema = Yup.object().shape({
  applicant: Yup.object().shape({
    fullName: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email address is required"),
  }),
  universities: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .min(2, "University name is too short")
          .max(60, "University name cannot exceed 60 characters")
          .required("University name is required"),
        major: Yup.string()
          .min(2, "Field of study is too short")
          .max(50, "Field of study cannot exceed 50 characters")
          .required("Field of study is required"),
        graduationYear: Yup.string()
          .matches(/^(19|20)\d{2}$/, "Must be a valid 4-digit year (e.g., 2026)")
          .required("Graduation year is required"),
      })
    )
    .min(1, "You must list at least one university profile"),
});

const initialValues: FormValues = {
  applicant: {
    fullName: "",
    email: "",
  },
  universities: [
    {
      id: "init-uni-1",
      name: "",
      major: "",
      graduationYear: "",
    },
  ],
};

export default function UniversityForm({ onSubmitSuccess }: UniversityFormProps) {
  // Track the most recently added university ID to trigger autofocus
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const generateUniqueId = () => `uni-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        // Structured console logging as mandated by requirements
        console.log("=== SUBMITTED UNIVERSITY LIST PAYLOAD ===");
        console.log(JSON.stringify(values, null, 2));
        
        // Notify parent to append to interactive log visualizer
        onSubmitSuccess(values);
        
        // Clean state
        setLastAddedId(null);
      }}
    >
      {({ values, errors, touched, isValid, dirty, isSubmitting, setFieldValue }) => {
        // Simple function to see if a field has an error to style boundaries
        const getFieldErrorClass = (fieldName: string) => {
          const isTouched = getIn(touched, fieldName);
          const errorMsg = getIn(errors, fieldName);
          if (isTouched && errorMsg) {
            return "border-red-300 focus:ring-red-500/20 focus:border-red-500 dark:border-red-500/80 bg-red-50/20 dark:bg-red-950/10";
          }
          if (isTouched && !errorMsg) {
            return "border-emerald-300 focus:ring-emerald-500/20 focus:border-emerald-500 dark:border-emerald-500/80 bg-emerald-50/10 dark:bg-emerald-950/5";
          }
          return "border-slate-300 dark:border-zinc-700 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-zinc-900";
        };

        return (
          <Form className="space-y-6" id="university-profile-form">
            
            {/* Applicant Profile Information Box */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 md:p-8 border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-zinc-50 text-base">
                    Applicant Information
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Primary details for nested profile creation
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label htmlFor="applicant.fullName" className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Full Name <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Field
                      id="applicant.fullName"
                      name="applicant.fullName"
                      placeholder="Jane Doe"
                      className={`w-full pl-9 pr-4 py-2 text-sm rounded border outline-none transition-all ${getFieldErrorClass(
                        "applicant.fullName"
                      )}`}
                    />
                  </div>
                  <ErrorMessage name="applicant.fullName">
                    {(msg) => (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 text-xs text-red-600 font-medium px-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{msg}</span>
                      </motion.div>
                    )}
                  </ErrorMessage>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="applicant.email" className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                    Email Address <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Field
                      id="applicant.email"
                      name="applicant.email"
                      type="email"
                      placeholder="jane.doe@example.com"
                      className={`w-full pl-9 pr-4 py-2 text-sm rounded border outline-none transition-all ${getFieldErrorClass(
                        "applicant.email"
                      )}`}
                    />
                  </div>
                  <ErrorMessage name="applicant.email">
                    {(msg) => (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 text-xs text-red-600 font-medium px-1"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{msg}</span>
                      </motion.div>
                    )}
                  </ErrorMessage>
                </div>
              </div>
            </div>

            {/* Universities List using Formik FieldArray */}
            <div className="space-y-4">
              <FieldArray name="universities">
                {(arrayHelpers) => (
                  <div>
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-5 px-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-zinc-50 text-base">
                            Academic Credentials
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-zinc-400">
                            Add the universities where you have completed your higher education
                          </p>
                        </div>
                      </div>

                      {/* Add Button */}
                      <Tooltip content="Add another university field" position="left">
                        <button
                          type="button"
                          onClick={() => {
                            const newId = generateUniqueId();
                            arrayHelpers.push({
                              id: newId,
                              name: "",
                              major: "",
                              graduationYear: "",
                            });
                            setLastAddedId(newId);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded transition-all shadow-sm cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <Plus className="w-4 h-4" />
                          Add University
                        </button>
                      </Tooltip>
                    </div>

                    {/* Universities Cards Container */}
                    <div className="space-y-4">
                      <AnimatePresence initial={false}>
                        {values.universities.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-800 text-center space-y-4 bg-slate-50/50 dark:bg-zinc-900/30"
                          >
                            <div className="p-3 bg-slate-100 dark:bg-zinc-800 text-slate-400 rounded-full">
                              <School className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-medium text-slate-800 dark:text-zinc-200 text-sm">
                                No Universities Added
                              </h4>
                              <p className="text-xs text-slate-500 max-w-xs">
                                At least one university profile must be filled to submit. Click the button below to add one.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newId = generateUniqueId();
                                arrayHelpers.push({
                                  id: newId,
                                  name: "",
                                  major: "",
                                  graduationYear: "",
                                });
                                setLastAddedId(newId);
                              }}
                              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded transition-colors cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              Add First University
                            </button>
                          </motion.div>
                        ) : (
                          values.universities.map((uni, index) => {
                            const isNew = uni.id === lastAddedId;
                            const hasError = getIn(errors, `universities.${index}`) ? true : false;
                            
                            return (
                              <motion.div
                                key={uni.id}
                                initial={{ opacity: 0, height: 0, y: 15 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -15 }}
                                transition={{ duration: 0.25, ease: "easeInOut" }}
                                className={`relative rounded-xl border transition-all overflow-hidden ${
                                  hasError 
                                    ? "bg-red-50/30 border-red-200 dark:bg-red-950/10 dark:border-red-900/60" 
                                    : isNew 
                                    ? "bg-blue-50/30 border-blue-200 ring-1 ring-blue-500/20 dark:bg-blue-950/10 dark:border-blue-900/60" 
                                    : "bg-slate-50/50 dark:bg-zinc-900/30 border-slate-200 dark:border-zinc-800"
                                }`}
                              >
                                {/* Header Panel for each card */}
                                <div className="flex items-center justify-between px-6 py-2.5 bg-white dark:bg-zinc-900 border-b border-slate-200/60 dark:border-zinc-800/60">
                                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-2">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      hasError 
                                        ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400" 
                                        : isNew 
                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400" 
                                        : "bg-slate-200 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300"
                                    }`}>
                                      {index + 1}
                                    </span>
                                    UNIVERSITY PROFILE
                                  </span>

                                  {/* Remove Button */}
                                  <Tooltip content="Delete university entry" position="left">
                                    <button
                                      type="button"
                                      onClick={() => arrayHelpers.remove(index)}
                                      className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                                      aria-label={`Remove university ${index + 1}`}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </Tooltip>
                                </div>

                                {/* Form Inputs Container */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-start bg-white/40 dark:bg-transparent">
                                  {/* University Name (Spans 6) */}
                                  <div className="space-y-1.5 md:col-span-6">
                                    <label 
                                      htmlFor={`universities.${index}.name`} 
                                      className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
                                    >
                                      University Name <span className="text-rose-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                      <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      {/* Autofocus custom input wrapper for newly added fields */}
                                      <FocusInput
                                        shouldFocus={isNew}
                                        id={`universities.${index}.name`}
                                        name={`universities.${index}.name`}
                                        value={values.universities[index].name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                          setFieldValue(`universities.${index}.name`, e.target.value)
                                        }
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                          setFieldValue(`universities.${index}.name`, e.target.value.trim());
                                        }}
                                        placeholder="e.g., Stanford University"
                                        className={`w-full pl-9 pr-4 py-2 text-sm rounded border outline-none transition-all ${getFieldErrorClass(
                                          `universities.${index}.name`
                                        )}`}
                                      />
                                    </div>
                                    <ErrorMessage name={`universities.${index}.name`}>
                                      {(msg) => (
                                        <motion.div
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex items-center gap-1.5 text-xs text-red-600 font-medium px-1"
                                        >
                                          <AlertCircle className="w-3.5 h-3.5" />
                                          <span>{msg}</span>
                                        </motion.div>
                                      )}
                                    </ErrorMessage>
                                  </div>

                                  {/* Major/Field of study (Spans 4) */}
                                  <div className="space-y-1.5 md:col-span-4">
                                    <label 
                                      htmlFor={`universities.${index}.major`} 
                                      className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider"
                                    >
                                      Major / Degree <span className="text-rose-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <Field
                                        id={`universities.${index}.major`}
                                        name={`universities.${index}.major`}
                                        placeholder="e.g., Computer Science"
                                        className={`w-full pl-9 pr-4 py-2 text-sm rounded border outline-none transition-all ${getFieldErrorClass(
                                          `universities.${index}.major`
                                        )}`}
                                      />
                                    </div>
                                    <ErrorMessage name={`universities.${index}.major`}>
                                      {(msg) => (
                                        <motion.div
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex items-center gap-1.5 text-xs text-red-600 font-medium px-1"
                                        >
                                          <AlertCircle className="w-3.5 h-3.5" />
                                          <span>{msg}</span>
                                        </motion.div>
                                      )}
                                    </ErrorMessage>
                                  </div>

                                  {/* Graduation Year (Spans 2) */}
                                  <div className="space-y-1.5 md:col-span-2">
                                    <label 
                                      htmlFor={`universities.${index}.graduationYear`} 
                                      className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                                    >
                                      Grad Year <span className="text-rose-500 ml-0.5">*</span>
                                    </label>
                                    <div className="relative">
                                      <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                      <Field
                                        id={`universities.${index}.graduationYear`}
                                        name={`universities.${index}.graduationYear`}
                                        placeholder="2026"
                                        maxLength={4}
                                        className={`w-full pl-8 pr-2.5 py-2 text-sm rounded border outline-none transition-all ${getFieldErrorClass(
                                          `universities.${index}.graduationYear`
                                        )}`}
                                      />
                                    </div>
                                    <ErrorMessage name={`universities.${index}.graduationYear`}>
                                      {(msg) => (
                                        <motion.div
                                          initial={{ opacity: 0, y: -5 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex items-center gap-1 text-[11px] text-red-600 font-medium leading-tight"
                                        >
                                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                          <span>{msg}</span>
                                        </motion.div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Array Global Error (e.g. Min 1 requirement) */}
                    {typeof errors.universities === "string" && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400 mt-4"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{errors.universities}</span>
                      </motion.div>
                    )}
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Validation Banner Indicator (Disable Submit Bonus Feature) */}
            <div className="p-4 rounded border flex items-start gap-3 bg-slate-50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 text-xs">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 dark:text-zinc-300">
                  Form Validation Checklist
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle className={`w-3.5 h-3.5 ${values.applicant.fullName.trim().length >= 3 ? "text-emerald-500" : "text-slate-400"}`} />
                    Full Name (≥3 chars)
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className={`w-3.5 h-3.5 ${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.applicant.email) ? "text-emerald-500" : "text-slate-400"}`} />
                    Valid Email
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className={`w-3.5 h-3.5 ${values.universities.length >= 1 ? "text-emerald-500" : "text-slate-400"}`} />
                    At least 1 University
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className={`w-3.5 h-3.5 ${
                      values.universities.length > 0 && values.universities.every(u => u.name && u.major && /^(19|20)\d{2}$/.test(u.graduationYear))
                        ? "text-emerald-500"
                        : "text-slate-400"
                    }`} />
                    All list inputs filled correctly
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Control Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFieldValue("applicant.fullName", "");
                  setFieldValue("applicant.email", "");
                  setFieldValue("universities", [
                    {
                      id: `uni-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`,
                      name: "",
                      major: "",
                      graduationYear: "",
                    }
                  ]);
                }}
                className="px-4 py-2 border border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 rounded text-sm font-medium bg-white hover:bg-slate-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
              >
                Reset Form
              </button>

              <Tooltip
                content={
                  !dirty
                    ? "Form is pristine (fill in details)"
                    : !isValid
                    ? "Please fix all validation errors before submitting"
                    : "Ready to submit university background"
                }
                position="top"
              >
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className={`px-6 py-2 rounded text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center gap-2 ${
                    isSubmitting || !isValid || !dirty
                      ? "bg-slate-300 text-white dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white"
                  }`}
                >
                  Submit Profile
                </button>
              </Tooltip>
            </div>

          </Form>
        );
      }}
    </Formik>
  );
}
