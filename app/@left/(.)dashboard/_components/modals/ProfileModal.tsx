/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from "react";
import { FaUserEdit, FaSpinner, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "@/components/utils/Modal";
import { cn } from "@/libs/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCvDataUpdated: () => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  onCvDataUpdated,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "educations" | "experiences" | "certifications" | "skills">("profile");

  // CV / Profile Full Data state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Tab 1: Profile State
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  // Tab 2: Educations State
  const [educationsList, setEducationsList] = useState<any[]>([]);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduLocation, setEduLocation] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduGpa, setEduGpa] = useState("");
  const [eduStartDate, setEduStartDate] = useState("");
  const [eduEndDate, setEduEndDate] = useState("");
  const [eduThesis, setEduThesis] = useState("");
  const [eduCourseworkText, setEduCourseworkText] = useState("");

  // Tab 3: Experiences State
  const [experiencesList, setExperiencesList] = useState<any[]>([]);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [expCompany, setExpCompany] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expRole, setExpRole] = useState("");
  const [expStartDate, setExpStartDate] = useState("");
  const [expEndDate, setExpEndDate] = useState("");
  const [expIsCurrent, setExpIsCurrent] = useState(false);
  const [expHighlightsText, setExpHighlightsText] = useState("");

  // Tab 4: Certifications State
  const [certificationsList, setCertificationsList] = useState<any[]>([]);
  const [editingCert, setEditingCert] = useState<any | null>(null);
  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certLocation, setCertLocation] = useState("");
  const [certIssueDate, setCertIssueDate] = useState("");
  const [certCredentialUrl, setCertCredentialUrl] = useState("");

  // Tab 5: Skills State
  const [skillsList, setSkillsList] = useState<any[]>([]);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [skillCategory, setSkillCategory] = useState("");
  const [skillItemsText, setSkillItemsText] = useState("");

  // Fetch full CV data when modal opens
  const fetchCvData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cv");
      if (!res.ok) throw new Error("Failed to load profile & CV data");
      const json = await res.json();
      if (json.success) {
        const { profile, educations, experiences, certifications, skills } = json.data;
        setFullName(profile.fullName || "");
        setLocation(profile.location || "");
        setPhone(profile.phone || "");
        setEmail(profile.email || "");
        setWebsite(profile.website || "");
        setGithub(profile.github || "");
        setLinkedin(profile.linkedin || "");
        setWhatsapp(profile.whatsapp || "");

        setEducationsList(educations || []);
        setExperiencesList(experiences || []);
        setCertificationsList(certifications || []);
        setSkillsList(skills || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCvData();
      setError("");
      setSuccess("");
      resetEduForm();
      resetExpForm();
      resetCertForm();
      resetSkillForm();
    }
  }, [isOpen]);

  // Form Resets
  const resetEduForm = () => {
    setEditingEdu(null);
    setEduInstitution("");
    setEduLocation("");
    setEduDegree("");
    setEduGpa("");
    setEduStartDate("");
    setEduEndDate("");
    setEduThesis("");
    setEduCourseworkText("");
  };

  const resetExpForm = () => {
    setEditingExp(null);
    setExpCompany("");
    setExpLocation("");
    setExpRole("");
    setExpStartDate("");
    setExpEndDate("");
    setExpIsCurrent(false);
    setExpHighlightsText("");
  };

  const resetCertForm = () => {
    setEditingCert(null);
    setCertTitle("");
    setCertIssuer("");
    setCertLocation("");
    setCertIssueDate("");
    setCertCredentialUrl("");
  };

  const resetSkillForm = () => {
    setEditingSkill(null);
    setSkillCategory("");
    setSkillItemsText("");
  };

  // --- SAVE PROFILE (TAB 1) ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updates = [
        { key: "PROFILE_FULL_NAME", value: fullName },
        { key: "PROFILE_LOCATION", value: location },
        { key: "PROFILE_PHONE", value: phone },
        { key: "SOCIAL_EMAIL", value: email },
        { key: "PROFILE_WEBSITE", value: website },
        { key: "SOCIAL_GITHUB", value: github },
        { key: "SOCIAL_LINKEDIN", value: linkedin },
        { key: "SOCIAL_WHATSAPP", value: whatsapp },
      ];

      for (const item of updates) {
        await fetch(`/api/config/${item.key}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: item.value }),
        });
      }

      setSuccess("Profile information saved successfully!");
      onCvDataUpdated();
    } catch (err: any) {
      console.error(err);
      setError("Failed to save profile information");
    } finally {
      setSaving(false);
    }
  };

  // --- SAVE EDUCATION (TAB 2) ---
  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const courseworkArray = eduCourseworkText
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const payload = {
      institution: eduInstitution,
      location: eduLocation || null,
      degree: eduDegree,
      gpa: eduGpa || null,
      startDate: eduStartDate || null,
      endDate: eduEndDate || null,
      thesis: eduThesis || null,
      relevantCoursework: courseworkArray,
    };

    try {
      const url = editingEdu ? `/api/educations/${editingEdu.id}` : "/api/educations";
      const method = editingEdu ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(editingEdu ? "Education updated!" : "Education added!");
        resetEduForm();
        await fetchCvData();
        onCvDataUpdated();
      } else {
        throw new Error("Failed to save education");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      const res = await fetch(`/api/educations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Education deleted!");
        await fetchCvData();
        onCvDataUpdated();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // --- SAVE EXPERIENCE (TAB 3) ---
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const highlightsArray = expHighlightsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload = {
      company: expCompany,
      location: expLocation || null,
      role: expRole,
      startDate: expStartDate || null,
      endDate: expIsCurrent ? null : (expEndDate || null),
      isCurrent: expIsCurrent,
      highlights: highlightsArray,
    };

    try {
      const url = editingExp ? `/api/experiences/${editingExp.id}` : "/api/experiences";
      const method = editingExp ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(editingExp ? "Experience updated!" : "Experience added!");
        resetExpForm();
        await fetchCvData();
        onCvDataUpdated();
      } else {
        throw new Error("Failed to save experience");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Experience deleted!");
        await fetchCvData();
        onCvDataUpdated();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // --- SAVE CERTIFICATION (TAB 4) ---
  const handleSaveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: certTitle,
      issuer: certIssuer,
      location: certLocation || null,
      issueDate: certIssueDate || null,
      credentialUrl: certCredentialUrl || null,
    };

    try {
      const url = editingCert ? `/api/certifications/${editingCert.id}` : "/api/certifications";
      const method = editingCert ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(editingCert ? "Certification updated!" : "Certification added!");
        resetCertForm();
        await fetchCvData();
        onCvDataUpdated();
      } else {
        throw new Error("Failed to save certification");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Certification deleted!");
        await fetchCvData();
        onCvDataUpdated();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // --- SAVE SKILL (TAB 5) ---
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const itemsArray = skillItemsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      category: skillCategory,
      items: itemsArray,
    };

    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const method = editingSkill ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(editingSkill ? "Skill category updated!" : "Skill category added!");
        resetSkillForm();
        await fetchCvData();
        onCvDataUpdated();
      } else {
        throw new Error("Failed to save skill category");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save skill category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill category?")) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("Skill category deleted!");
        await fetchCvData();
        onCvDataUpdated();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center space-x-2">
          <FaUserEdit className="text-cyan-400 text-lg" />
          <span className="font-bold text-white text-base">Manage Profile & CV Data</span>
        </div>
      }
    >
      <div className="space-y-4 max-h-[75vh] flex flex-col text-left">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 shrink-0 gap-1 overflow-x-auto pb-1 text-xs">
          {[
            { id: "profile", label: "1. Profil" },
            { id: "educations", label: "2. Pendidikan" },
            { id: "experiences", label: "3. Pengalaman" },
            { id: "certifications", label: "4. Sertifikasi" },
            { id: "skills", label: "5. Skill Set" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                setError("");
                setSuccess("");
              }}
              className={cn(
                "px-3 py-2 rounded-t-lg font-semibold transition cursor-pointer shrink-0 whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-neutral-800 text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white hover:bg-neutral-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-2.5 rounded-lg text-xs font-semibold shrink-0">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-xs font-semibold shrink-0">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center gap-2 p-8">
            <FaSpinner className="animate-spin text-cyan-400 text-xl" />
            <span className="text-xs text-gray-400">Loading Profile Data...</span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {/* TAB 1: PROFIL */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Nama Lengkap</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Lokasi</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Pekanbaru, Riau, Indonesia"
                      className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Nomor Telepon</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+62 812 7063 4992"
                      className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">Website URL</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="lowscarlet.my.id"
                      className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">GitHub URL</label>
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/LowScarlet"
                      className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">LinkedIn URL</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://www.linkedin.com/in/..."
                      className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1 uppercase tracking-wider">WhatsApp URL / Number</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="https://wa.me/6281270634992"
                      className="w-full bg-neutral-950 border border-neutral-855 rounded-lg px-3 py-2 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-linear-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold py-2 rounded-lg text-xs transition cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {saving ? "Simpan..." : "Simpan Data Profil"}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: PENDIDIKAN */}
            {activeTab === "educations" && (
              <div className="space-y-4">
                {/* List Educations */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Daftar Pendidikan ({educationsList.length})</span>
                    {editingEdu && (
                      <button
                        type="button"
                        onClick={resetEduForm}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        + Tambah Baru
                      </button>
                    )}
                  </div>
                  {educationsList.map((item) => (
                    <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
                      <div>
                        <div className="font-bold text-white">{item.institution} ({item.location})</div>
                        <div className="text-gray-400">{item.degree} {item.gpa ? `• GPA: ${item.gpa}` : ""}</div>
                        <div className="text-[10px] text-gray-500">{item.dateRange}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEdu(item);
                            setEduInstitution(item.institution || "");
                            setEduLocation(item.location || "");
                            setEduDegree(item.degree || "");
                            setEduGpa(item.gpa || "");
                            setEduStartDate(item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : "");
                            setEduEndDate(item.endDate ? new Date(item.endDate).toISOString().split("T")[0] : "");
                            setEduThesis(item.thesis || "");
                            setEduCourseworkText((item.relevantCoursework || []).join(", "));
                          }}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEducation(item.id)}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Add/Edit Education */}
                <form onSubmit={handleSaveEducation} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
                  <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
                    {editingEdu ? "Edit Data Pendidikan" : "+ Tambah Pendidikan Baru"}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Institusi *</label>
                      <input type="text" value={eduInstitution} onChange={(e) => setEduInstitution(e.target.value)} required placeholder="Universitas ..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Lokasi</label>
                      <input type="text" value={eduLocation} onChange={(e) => setEduLocation(e.target.value)} placeholder="Pekanbaru, Indonesia" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Gelar / Degree *</label>
                      <input type="text" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} required placeholder="Bachelor of Informatics Engineering" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">IPK / GPA</label>
                      <input type="text" value={eduGpa} onChange={(e) => setEduGpa(e.target.value)} placeholder="3.73/4.00" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Mulai</label>
                      <input type="date" value={eduStartDate} onChange={(e) => setEduStartDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Selesai</label>
                      <input type="date" value={eduEndDate} onChange={(e) => setEduEndDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block uppercase">Judul Skripsi / Thesis</label>
                    <input type="text" value={eduThesis} onChange={(e) => setEduThesis(e.target.value)} placeholder="Thesis: Cloud-Native..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block uppercase">Coursework (Pisahkan Koma)</label>
                    <input type="text" value={eduCourseworkText} onChange={(e) => setEduCourseworkText(e.target.value)} placeholder="Software Engineering, Cloud Computing, Web Development" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                  </div>
                  <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
                    {saving ? "Simpan..." : editingEdu ? "Update Pendidikan" : "Simpan Pendidikan"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: PENGALAMAN */}
            {activeTab === "experiences" && (
              <div className="space-y-4">
                {/* List Experiences */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Daftar Pengalaman Kerja ({experiencesList.length})</span>
                    {editingExp && (
                      <button type="button" onClick={resetExpForm} className="text-[10px] text-cyan-400 hover:underline">
                        + Tambah Baru
                      </button>
                    )}
                  </div>
                  {experiencesList.map((item) => (
                    <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
                      <div>
                        <div className="font-bold text-white">{item.company} ({item.location})</div>
                        <div className="text-gray-400 font-semibold">{item.role}</div>
                        <div className="text-[10px] text-gray-500">{item.dateRange}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExp(item);
                            setExpCompany(item.company || "");
                            setExpLocation(item.location || "");
                            setExpRole(item.role || "");
                            setExpStartDate(item.startDate ? new Date(item.startDate).toISOString().split("T")[0] : "");
                            setExpEndDate(item.endDate ? new Date(item.endDate).toISOString().split("T")[0] : "");
                            setExpIsCurrent(Boolean(item.isCurrent));
                            setExpHighlightsText((item.highlights || []).join("\n"));
                          }}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(item.id)}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Add/Edit Experience */}
                <form onSubmit={handleSaveExperience} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
                  <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
                    {editingExp ? "Edit Pengalaman Kerja" : "+ Tambah Pengalaman Kerja Baru"}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Perusahaan / Instansi *</label>
                      <input type="text" value={expCompany} onChange={(e) => setExpCompany(e.target.value)} required placeholder="Company Name" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Lokasi</label>
                      <input type="text" value={expLocation} onChange={(e) => setExpLocation(e.target.value)} placeholder="Pekanbaru, Indonesia" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Posisi / Role *</label>
                      <input type="text" value={expRole} onChange={(e) => setExpRole(e.target.value)} required placeholder="Web Design Instructor" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div className="flex items-center gap-2 pt-4">
                      <input type="checkbox" id="expIsCurrent" checked={expIsCurrent} onChange={(e) => setExpIsCurrent(e.target.checked)} className="rounded bg-neutral-950 border-neutral-855" />
                      <label htmlFor="expIsCurrent" className="text-xs text-gray-300 cursor-pointer">Masih Bekerja Saat Ini (Present)</label>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Mulai</label>
                      <input type="date" value={expStartDate} onChange={(e) => setExpStartDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    {!expIsCurrent && (
                      <div>
                        <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Selesai</label>
                        <input type="date" value={expEndDate} onChange={(e) => setExpEndDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block uppercase">Bullet Points / Achievements (1 poin per baris)</label>
                    <textarea value={expHighlightsText} onChange={(e) => setExpHighlightsText(e.target.value)} rows={3} placeholder={`Mentored 20+ students...\nGuided beginner students...`} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                  </div>
                  <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
                    {saving ? "Simpan..." : editingExp ? "Update Pengalaman" : "Simpan Pengalaman"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: SERTIFIKASI */}
            {activeTab === "certifications" && (
              <div className="space-y-4">
                {/* List Certifications */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Daftar Sertifikasi ({certificationsList.length})</span>
                    {editingCert && (
                      <button type="button" onClick={resetCertForm} className="text-[10px] text-cyan-400 hover:underline">
                        + Tambah Baru
                      </button>
                    )}
                  </div>
                  {certificationsList.map((item) => (
                    <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
                      <div>
                        <div className="font-bold text-white">{item.title}</div>
                        <div className="text-gray-400">{item.issuer} {item.location ? `• ${item.location}` : ""}</div>
                        <div className="text-[10px] text-gray-500">{item.issueDateFormatted}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCert(item);
                            setCertTitle(item.title || "");
                            setCertIssuer(item.issuer || "");
                            setCertLocation(item.location || "");
                            setCertIssueDate(item.issueDate ? new Date(item.issueDate).toISOString().split("T")[0] : "");
                            setCertCredentialUrl(item.credentialUrl || "");
                          }}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCertification(item.id)}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Add/Edit Certification */}
                <form onSubmit={handleSaveCertification} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
                  <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
                    {editingCert ? "Edit Sertifikasi" : "+ Tambah Sertifikasi Baru"}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Nama Sertifikasi / Course *</label>
                      <input type="text" value={certTitle} onChange={(e) => setCertTitle(e.target.value)} required placeholder="AWS DevOps Engineer..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Penyelenggara / Issuer *</label>
                      <input type="text" value={certIssuer} onChange={(e) => setCertIssuer(e.target.value)} required placeholder="AWS Training & Certification" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Lokasi / Mode</label>
                      <input type="text" value={certLocation} onChange={(e) => setCertLocation(e.target.value)} placeholder="Online" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-semibold block uppercase">Tanggal Terbit</label>
                      <input type="date" value={certIssueDate} onChange={(e) => setCertIssueDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block uppercase">Credential / Certificate URL</label>
                    <input type="url" value={certCredentialUrl} onChange={(e) => setCertCredentialUrl(e.target.value)} placeholder="https://..." className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                  </div>
                  <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
                    {saving ? "Simpan..." : editingCert ? "Update Sertifikasi" : "Simpan Sertifikasi"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 5: SKILL SET */}
            {activeTab === "skills" && (
              <div className="space-y-4">
                {/* List Skills */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Kategori Skill ({skillsList.length})</span>
                    {editingSkill && (
                      <button type="button" onClick={resetSkillForm} className="text-[10px] text-cyan-400 hover:underline">
                        + Tambah Baru
                      </button>
                    )}
                  </div>
                  {skillsList.map((item) => (
                    <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-850 rounded-lg flex justify-between items-start text-xs">
                      <div>
                        <div className="font-bold text-white">{item.category}</div>
                        <div className="text-gray-400 mt-0.5">{(item.items || []).join(", ")}</div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkill(item);
                            setSkillCategory(item.category || "");
                            setSkillItemsText((item.items || []).join(", "));
                          }}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-cyan-400 rounded cursor-pointer"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(item.id)}
                          className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-red-400 rounded cursor-pointer"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Add/Edit Skill */}
                <form onSubmit={handleSaveSkill} className="p-3 bg-neutral-950/60 border border-neutral-850 rounded-xl space-y-3 pt-3">
                  <div className="text-xs font-bold text-cyan-400 border-b border-neutral-800 pb-1">
                    {editingSkill ? "Edit Kategori Skill" : "+ Tambah Kategori Skill Baru"}
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block uppercase">Nama Kategori *</label>
                    <input type="text" value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} required placeholder="Technical / Tools / Concepts / Soft Skills" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-semibold block uppercase">Daftar Skill (Pisahkan Koma) *</label>
                    <textarea value={skillItemsText} onChange={(e) => setSkillItemsText(e.target.value)} required rows={3} placeholder="JavaScript, TypeScript, Next.js, React.js, PostgreSQL" className="w-full bg-neutral-950 border border-neutral-855 rounded px-2.5 py-1.5 text-white text-xs" />
                  </div>
                  <button type="submit" disabled={saving} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer">
                    {saving ? "Simpan..." : editingSkill ? "Update Kategori Skill" : "Simpan Kategori Skill"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-neutral-800 pt-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-neutral-900 hover:bg-neutral-855 border border-neutral-800 text-gray-400 font-semibold py-2 rounded-lg hover:text-white active:scale-98 transition text-xs cursor-pointer font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
