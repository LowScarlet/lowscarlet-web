import React from "react";

export interface AtsCvProfile {
  fullName: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  github: string;
  linkedin: string;
  whatsapp?: string;
  photoPro?: string;
  photoPas?: string;
}

export interface AtsEducationItem {
  id: string;
  institution: string;
  location: string | null;
  degree: string;
  gpa: string | null;
  dateRange: string;
  thesis: string | null;
  relevantCoursework: string[] | null;
}

export interface AtsExperienceItem {
  id: string;
  company: string;
  location: string | null;
  role: string;
  dateRange: string;
  highlights: string[];
}

export interface AtsProjectItem {
  id: string;
  title: string;
  location: string | null;
  cvSubtitle: string | null;
  category: string;
  dateRange: string;
  cvHighlights: string[] | null;
  description: string;
}

export interface AtsCertificationItem {
  id: string;
  title: string;
  issuer: string;
  location: string | null;
  issueDateFormatted: string | null;
}

export interface AtsSkillItem {
  id: string;
  category: string;
  items: string[];
}

interface AtsCvContentProps {
  profile?: AtsCvProfile;
  educations: AtsEducationItem[];
  experiences: AtsExperienceItem[];
  projects: AtsProjectItem[];
  certifications: AtsCertificationItem[];
  skills: AtsSkillItem[];
}

const getFullUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

const getDisplayUrl = (url: string) => {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
};

export default function AtsCvContent({
  profile,
  educations,
  experiences,
  projects,
  certifications,
  skills,
}: AtsCvContentProps) {
  const whatsappUrl = profile?.whatsapp ? getFullUrl(profile.whatsapp) : null;

  return (
    <div className="w-full max-w-[210mm] aspect-[210/297] print:aspect-auto print:w-full mx-auto space-y-5 text-gray-900 font-sans overflow-y-auto">
      {/* Inline ATS Header */}
      {profile && (
        <header className="text-center mb-6 border-b border-gray-200 pb-4 print:border-b-0 print:pb-2">
          <h1 className="text-2xl font-bold tracking-wide uppercase text-gray-900 mb-1">
            {profile.fullName}
          </h1>
          <div className="text-xs text-gray-700 space-x-1.5 flex flex-wrap justify-center items-center gap-y-1">
            <span>{profile.location}</span>
            <span>•</span>
            {whatsappUrl ? (
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:underline text-gray-800">
                {profile.phone}
              </a>
            ) : (
              <span>{profile.phone}</span>
            )}
            <span>•</span>
            <a href={`mailto:${profile.email}`} className="hover:underline text-gray-800">
              {profile.email}
            </a>
            <span>•</span>
            <a href={getFullUrl(profile.website)} target="_blank" rel="noreferrer" className="hover:underline text-gray-800">
              {getDisplayUrl(profile.website)}
            </a>
          </div>
          <div className="text-xs text-gray-700 space-x-1.5 flex justify-center items-center mt-1">
            <a href={getFullUrl(profile.github)} target="_blank" rel="noreferrer" className="hover:underline text-gray-800">
              {getDisplayUrl(profile.github)}
            </a>
            <span>•</span>
            <a href={getFullUrl(profile.linkedin)} target="_blank" rel="noreferrer" className="hover:underline text-gray-800">
              {getDisplayUrl(profile.linkedin)}
            </a>
          </div>
        </header>
      )}

      {/* Education Section */}
      {educations.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-center uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
            Education
          </h2>
          <div className="space-y-3">
            {educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline text-xs font-bold text-gray-900">
                  <span>{edu.institution}</span>
                  <span>{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-gray-800 font-medium">
                  <span>
                    {edu.degree}{edu.gpa ? `, GPA: ${edu.gpa}` : ""}
                  </span>
                  <span>{edu.dateRange}</span>
                </div>
                {edu.thesis && (
                  <p className="text-[11px] text-gray-700 mt-1 italic">
                    {edu.thesis}
                  </p>
                )}
                {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                  <p className="text-[11px] text-gray-700 mt-0.5">
                    <span className="font-semibold">Relevant Coursework:</span>{" "}
                    {edu.relevantCoursework.join(", ")}.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-center uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs font-bold text-gray-900">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-gray-800 font-semibold mb-1">
                  <span>{exp.role}</span>
                  <span>{exp.dateRange}</span>
                </div>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-[11px] text-gray-800 space-y-1 leading-normal">
                    {exp.highlights.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Project Experience Section */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-center uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
            Project Experience
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline text-xs font-bold text-gray-900">
                  <span>{proj.title}</span>
                  <span>{proj.location || "Online"}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-gray-800 font-semibold mb-1">
                  <span>{proj.cvSubtitle || proj.category}</span>
                  <span>{proj.dateRange}</span>
                </div>
                {proj.cvHighlights && proj.cvHighlights.length > 0 ? (
                  <ul className="list-disc list-outside ml-4 text-[11px] text-gray-800 space-y-1 leading-normal">
                    {proj.cvHighlights.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-gray-700 ml-4">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Training Section */}
      {certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold text-center uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
            Certifications & Training
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-gray-900">{cert.title}</span>
                  <span className="text-gray-700 ml-2 font-medium">({cert.issuer})</span>
                </div>
                <div className="text-right text-gray-800 font-medium ml-4 shrink-0">
                  <span>{cert.location ? `${cert.location} ` : ""}</span>
                  <span className="ml-1">{cert.issueDateFormatted}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skill & Interests Section */}
      {skills.length > 0 && (
        <section className="mb-2">
          <h2 className="text-sm font-bold text-center uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-0.5 mb-2">
            Skill & Interests
          </h2>
          <div className="space-y-1 text-xs">
            {skills.map((skill) => (
              <div key={skill.id} className="text-[11px] text-gray-800">
                <span className="font-bold text-gray-900">{skill.category}: </span>
                <span>{skill.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
