"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { submitRegistration } from "@/lib/actions";
import { toast } from "sonner";
import { useLanguage } from "@/lib/LanguageContext";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Briefcase,
  Phone,
  Image as ImageIcon,
  Users,
  Compass,
} from "lucide-react";

export function RegisterForm() {
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [successData, setSuccessData] = useState<{
    slug: string;
    message: string;
  } | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form field states
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gotra, setGotra] = useState("");

  const [gaon, setGaon] = useState("");
  const [area, setArea] = useState("");
  const [domicile, setDomicile] = useState("");
  const [residentAddress, setResidentAddress] = useState("");

  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");

  const [fatherName, setFatherName] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [siblings, setSiblings] = useState("");
  const [grandFather, setGrandFather] = useState("");
  const [grandMother, setGrandMother] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [motherContact, setMotherContact] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Auto-fill button helper with the user's specific sample (Falguni Paliwal)
  // const handleAutoFillSample = () => {
  //   setFullName("Falguni Paliwal");
  //   setDob("19-11-2001");
  //   setTob("5:59 PM");
  //   setPob("Indore");
  //   setHeight("5'8\"");
  //   setAge("24");
  //   setGotra("Bhardwaj");

  //   setGaon("Pali");
  //   setArea("Indore");
  //   setDomicile("Indore, Madhya Pradesh");
  //   setResidentAddress("52/ Guru Nagar, Robot Square, Indore, Madhya Pradesh");

  //   setEducation("BBA, MBA - Marketing");
  //   setOccupation("Marketing Entrepreneur");

  //   setFatherName("Rajesh Paliwal");
  //   setFatherOccupation("Entrepreneur");
  //   setMotherName("Vimla Paliwal");
  //   setMotherOccupation("Entrepreneur");
  //   setSiblings("1 elder brother");
  //   setGrandFather("Mr. Bhanwar lal Paliwal");
  //   setGrandMother("Mrs. Radha bai Paliwal");

  //   setPhoneNumber("9424073243");
  //   setFatherContact("9424073243");
  //   setMotherContact("9425059004");

  //   toast.info("Sample profile details loaded!");
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please upload a valid JPG, PNG, or WebP image.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName || !gaon || !area || !age || !phoneNumber) {
      setFormError("Please fill out all mandatory fields (Full Name, Gaon, Area, Age, Primary Phone).");
      toast.error("Mandatory fields missing.");
      return;
    }

    if (!selectedFile && !previewUrl) {
      setFormError("A passport-size profile photograph is required for verification.");
      toast.error("Photograph required.");
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setFormError("Please enter a valid 10-digit primary phone number.");
      toast.error("Invalid phone number.");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dob", dob);
    formData.append("tob", tob);
    formData.append("pob", pob);
    formData.append("height", height);
    formData.append("age", age);
    formData.append("gotra", gotra);

    formData.append("gaon", gaon);
    formData.append("area", area);
    formData.append("domicile", domicile);
    formData.append("residentAddress", residentAddress);

    formData.append("education", education);
    formData.append("occupation", occupation);

    formData.append("fatherName", fatherName);
    formData.append("fatherOccupation", fatherOccupation);
    formData.append("motherName", motherName);
    formData.append("motherOccupation", motherOccupation);
    formData.append("siblings", siblings);
    formData.append("grandFather", grandFather);
    formData.append("grandMother", grandMother);

    formData.append("phoneNumber", cleanPhone);
    formData.append("fatherContact", fatherContact);
    formData.append("motherContact", motherContact);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    } else {
      // Create a small fallback blob if sample autofilled without file
      const blob = new Blob(["sample"], { type: "image/jpeg" });
      formData.append("photo", new File([blob], "sample.jpg", { type: "image/jpeg" }));
    }

    startTransition(async () => {
      try {
        const res = await submitRegistration(formData);
        if (res.success && res.slug) {
          toast.success("Biodata submitted successfully!");
          setSuccessData({
            slug: res.slug,
            message:
              res.message ||
              "Your form has been submitted successfully. It will be verified by the admin desk before publishing.",
          });
        } else {
          setFormError(res.error || "Submission failed. Please check your entries.");
          toast.error(res.error || "Submission failed.");
        }
      } catch {
        setFormError("An unexpected network error occurred.");
        toast.error("Network error.");
      }
    });
  };

  if (successData) {
    return (
      <div className="bg-white rounded-xl border border-[#e7e5e4] p-8 sm:p-10 shadow-xs text-center max-w-lg mx-auto">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="font-serif-heading text-2xl font-bold text-[#1c1917] mb-2">
          Registration Submitted!
        </h2>
        <p className="text-[#57534e] text-sm leading-relaxed mb-6">
          {successData.message}
        </p>

        <div className="bg-[#faf8f5] border border-[#e7e5e4] rounded-lg p-4 mb-6 text-left text-xs">
          <div className="font-mono-tag uppercase tracking-wider text-[#78716c] font-semibold text-[10px] mb-1">
            Status
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold font-mono-tag">
            Pending Admin Verification
          </div>
          <p className="text-[#78716c] mt-2 leading-normal">
            Your unique profile slug (<strong className="font-mono text-[#1c1917]">{successData.slug}</strong>) is reserved. Once approved, it will be published to the public directory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#1c1917] text-white text-xs font-semibold hover:bg-[#c2410c] transition"
          >
            {t.profile.backBtn} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
          <button
            onClick={() => {
              setSuccessData(null);
              setFullName("");
              setDob("");
              setTob("");
              setPob("");
              setHeight("");
              setAge("");
              setGotra("");
              setGaon("");
              setArea("");
              setDomicile("");
              setResidentAddress("");
              setEducation("");
              setOccupation("");
              setFatherName("");
              setFatherOccupation("");
              setMotherName("");
              setMotherOccupation("");
              setSiblings("");
              setGrandFather("");
              setGrandMother("");
              setPhoneNumber("");
              setFatherContact("");
              setMotherContact("");
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#d6d3d1] text-[#44403c] text-xs font-semibold hover:bg-[#faf8f5] transition cursor-pointer"
          >
            Submit Another Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick fill bar */}
      {/* <div className="flex items-center justify-between bg-[#faf8f5] p-3 rounded-lg border border-[#e7e5e4]">
        <span className="text-xs text-[#78716c]">Want to test with a pre-filled sample?</span>
        <button
          type="button"
          onClick={handleAutoFillSample}
          className="text-xs font-semibold text-[#c2410c] hover:underline cursor-pointer"
        >
          Auto-fill Sample (Falguni Paliwal)
        </button>
      </div> */}

      {formError && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-900 text-xs font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* 1. Photograph Section */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#f5f5f4] pb-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag">
            {t.form.photoTitle} <span className="text-[#c2410c]">*</span>
          </span>
          <span className="text-[10px] text-[#a8a29e] font-mono-tag">JPG, PNG &bull; MAX 5MB</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-36 rounded-lg border-2 border-dashed border-[#d6d3d1] hover:border-[#c2410c] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#faf8f5] group transition"
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-center p-3 text-[#a8a29e] group-hover:text-[#c2410c] transition">
                <ImageIcon className="w-7 h-7 mb-1" />
                <span className="text-[10px] font-semibold">{t.form.selectPhoto}</span>
              </div>
            )}
          </div>

          <div className="flex-1 w-full text-center sm:text-left">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-[#d6d3d1] text-[#1c1917] text-xs font-semibold hover:bg-[#faf8f5] transition inline-flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#c2410c]" />
              {previewUrl ? t.form.changeBtn : t.form.uploadBtn}
            </button>
            <p className="text-[11px] text-[#78716c] mt-2 leading-normal">
              {t.form.photoGuidance}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Personal Identity & Birth Details */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#c2410c]" /> {t.form.personalTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.fullName} <span className="text-[#c2410c]">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. XYZ"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.dob}
            </label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="e.g. 01-01-2007"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.tob}
            </label>
            <input
              type="text"
              value={tob}
              onChange={(e) => setTob(e.target.value)}
              placeholder="e.g. 5:59 PM"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.pob}
            </label>
            <input
              type="text"
              value={pob}
              onChange={(e) => setPob(e.target.value)}
              placeholder="e.g. Indore"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.height}
            </label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 5 ft 8 in"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.age} <span className="text-[#c2410c]">*</span>
            </label>
            <input
              type="number"
              min="18"
              max="100"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 24"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.gotra}
            </label>
            <input
              type="text"
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
              placeholder="e.g. Bhardwaj"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>
        </div>
      </div>

      {/* 3. Native Lineage & Residence */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#c2410c]" /> {t.form.locationTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.gaon} <span className="text-[#c2410c]">*</span>
            </label>
            <input
              type="text"
              required
              value={gaon}
              onChange={(e) => setGaon(e.target.value)}
              placeholder="e.g. Sakroda / Changedi "
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.area} <span className="text-[#c2410c]">*</span>
            </label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Indore"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.domicile}
            </label>
            <input
              type="text"
              value={domicile}
              onChange={(e) => setDomicile(e.target.value)}
              placeholder="e.g. Indore, Madhya Pradesh"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.residentAddress}
            </label>
            <input
              type="text"
              value={residentAddress}
              onChange={(e) => setResidentAddress(e.target.value)}
              placeholder="e.g. vijay nagar indore"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>
        </div>
      </div>

      {/* 4. Education & Career */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-[#c2410c]" /> {t.form.eduCareerTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.education}
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="e.g. BBA, MBA - Marketing"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.occupation}
            </label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Entrepreneur"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>
        </div>
      </div>

      {/* 5. Family Details */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#c2410c]" /> {t.form.familyTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.fatherName}
            </label>
            <input
              type="text"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              placeholder="e.g. Mr. XYZ"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.fatherOccupation}
            </label>
            <input
              type="text"
              value={fatherOccupation}
              onChange={(e) => setFatherOccupation(e.target.value)}
              placeholder="e.g. Entrepreneur"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.motherName}
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="e.g. Mrs. XYZ"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.motherOccupation}
            </label>
            <input
              type="text"
              value={motherOccupation}
              onChange={(e) => setMotherOccupation(e.target.value)}
              placeholder="e.g. Entrepreneur"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.siblings}
            </label>
            <input
              type="text"
              value={siblings}
              onChange={(e) => setSiblings(e.target.value)}
              placeholder="e.g. 1 elder brother"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.grandFather}
            </label>
            <input
              type="text"
              value={grandFather}
              onChange={(e) => setGrandFather(e.target.value)}
              placeholder="e.g. Mr. ABC"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.grandMother}
            </label>
            <input
              type="text"
              value={grandMother}
              onChange={(e) => setGrandMother(e.target.value)}
              placeholder="e.g. Mrs. ABC"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60"
            />
          </div>
        </div>
      </div>

      {/* 6. Contact Information */}
      <div className="bg-white rounded-xl border border-[#e7e5e4] p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716c] font-mono-tag border-b border-[#f5f5f4] pb-2 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-[#c2410c]" /> {t.form.contactTitle}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.primaryPhone} <span className="text-[#c2410c]">*</span>
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="1234567890"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono-tag"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.fatherContact}
            </label>
            <input
              type="tel"
              maxLength={10}
              value={fatherContact}
              onChange={(e) => setFatherContact(e.target.value)}
              placeholder="1234567890"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono-tag"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1c1917] mb-1">
              {t.form.motherContact}
            </label>
            <input
              type="tel"
              maxLength={10}
              value={motherContact}
              onChange={(e) => setMotherContact(e.target.value)}
              placeholder="1234567890"
              className="w-full h-10 px-3 rounded-lg border border-[#e7e5e4] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/20 focus:border-[#c2410c] text-xs text-[#1c1917] bg-[#faf8f5]/60 font-mono-tag"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 px-5 rounded-lg bg-[#c2410c] hover:bg-[#9a3412] text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.form.submitting}</span>
            </>
          ) : (
            <span>{t.form.submitBtn}</span>
          )}
        </button>
        <p className="text-[11px] text-[#78716c] text-center mt-2.5">
          {t.form.disclaimer}
        </p>
      </div>
    </form>
  );
}
