import { GoogleGenAI } from "@google/genai";
import { getFullCvData } from "@/db/queries/cv";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

interface CoverLetterRequest {
  rawJobListing: string;       // Required — raw text from job listing page
  companyName?: string;        // Optional override
  companyAddress?: string;     // Optional override
  position?: string;           // Optional override
  type: "kerja" | "magang";
  language: "id" | "en";
  additionalNotes?: string;
}

export interface CoverLetterResponse {
  // Extracted metadata from raw text
  extracted_company: string;
  extracted_position: string;
  extracted_type: string;
  extracted_location: string;
  // Profile overrides & translations derived from user instructions and language preference
  profile_override?: {
    location?: string;
    education?: string;
  };
  // Concise AI highlight paragraph for the letter body
  body_highlight: string;
}

function buildPrompt(
  cvData: Awaited<ReturnType<typeof getFullCvData>>,
  input: CoverLetterRequest
): string {
  const { profile, educations, experiences, projects, skills } = cvData;

  const langInstruction = input.language === "en"
    ? "Write the body highlight entirely in formal English."
    : "Tulis ringkasan kualifikasi seluruhnya dalam Bahasa Indonesia formal.";

  const typeLabel = input.type === "magang" ? "Magang (Internship)" : "Pekerjaan (Full-time Job)";

  const latestEdu = educations[0];
  const defaultEduStr = latestEdu ? `${latestEdu.degree} - ${latestEdu.institution}` : "";

  // Serialize all CV data as plain text context
  const profileText = `
PROFILE:
- Full Name: ${profile.fullName}
- Location: ${profile.location}
- Phone: ${profile.phone}
- Email: ${profile.email}
- Website: ${profile.website}
- GitHub: ${profile.github}
- LinkedIn: ${profile.linkedin}
- Summary: ${profile.summary}
- Latest Education: ${defaultEduStr}
`.trim();

  const experienceText = experiences.length > 0
    ? `WORK EXPERIENCE:\n${experiences.map(e =>
      `- ${e.role} at ${e.company}${e.location ? ` (${e.location})` : ""}${e.dateRange ? `, ${e.dateRange}` : ""}${e.highlights?.length ? `\n  Highlights: ${e.highlights.join("; ")}` : ""}`
    ).join("\n")}`
    : "";

  const projectText = projects.length > 0
    ? `PROJECTS:\n${projects.map(p =>
      `- ${p.title}: ${p.description}${p.techs?.length ? ` [Tech: ${p.techs.join(", ")}]` : ""}`
    ).join("\n")}`
    : "";

  const skillText = skills.length > 0
    ? `SKILLS:\n${skills.map(s => `- ${s.category}: ${s.items.join(", ")}`).join("\n")}`
    : "";

  const cvContext = [profileText, experienceText, projectText, skillText]
    .filter(Boolean)
    .join("\n\n");

  const overrides: string[] = [];
  if (input.companyName?.trim()) overrides.push(`- Company Name Override: ${input.companyName.trim()}`);
  if (input.companyAddress?.trim()) overrides.push(`- Company Address Override: ${input.companyAddress.trim()}`);
  if (input.position?.trim()) overrides.push(`- Position Override: ${input.position.trim()}`);

  const overrideSection = overrides.length > 0
    ? `\nMANUAL OVERRIDES:\n${overrides.join("\n")}`
    : "";

  return `You are a concise, professional cover letter writer and job listing analyzer.

Your goal is to:
1. Extract company name, position, type, and location from the raw job listing.
2. Check if the applicant provided custom instructions in "Additional Notes" to override their profile data (e.g. changing address to "Tenayan Raya, Pekanbaru, Riau, Indonesia").
3. Format or translate the applicant's latest degree into Indonesian if language is "id" (e.g., translate "Bachelor of Informatics Engineering" -> "S1 Teknik Informatika").
4. Write 1 SHORT, CONCISE, PUNCHY HIGHLIGHT (2-3 sentences max) connecting the applicant's experience to the target position.

CRITICAL CONSTRAINT: Keep it dense, direct, and non-fluffy ("padat tanpa bertele-tele") so the entire cover letter easily fits onto a single page.

${langInstruction}

RAW JOB LISTING:
---
${input.rawJobListing}
---
${overrideSection}

APPLICATION PREFERENCES:
- Target Language: ${input.language === "en" ? "English" : "Bahasa Indonesia"}
- Type: ${typeLabel}
${input.additionalNotes?.trim() ? `- Additional Notes / User Instructions: ${input.additionalNotes.trim()}` : ""}

APPLICANT'S CV DATA:
${cvContext}

INSTRUCTIONS FOR JSON OUTPUT:
- "extracted_company": Company name extracted from job listing (or override if specified)
- "extracted_position": Position title extracted from job listing (or override if specified)
- "extracted_type": Employment type (e.g. Full-time, Contract, Internship)
- "extracted_location": Job location
- "profile_override": Object with:
    - "location": Updated address if user requested change in Additional Notes, otherwise keep "${profile.location}"
    - "education": Translated or formatted education string (e.g. "S1 Teknik Informatika - ${latestEdu?.institution || ""}" for Indonesian, or "Bachelor of Informatics Engineering - ${latestEdu?.institution || ""}" for English)
- "body_highlight": 2-3 concise sentences highlighting relevant qualifications matching the target role.

Return ONLY a valid JSON object with these fields (no markdown code blocks):
{
  "extracted_company": "...",
  "extracted_position": "...",
  "extracted_type": "...",
  "extracted_location": "...",
  "profile_override": {
    "location": "...",
    "education": "..."
  },
  "body_highlight": "..."
}`;
}

export async function POST(request: NextRequest) {
  if (!GOOGLE_AI_API_KEY) {
    return NextResponse.json(
      { success: false, error: "Google AI API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const body: CoverLetterRequest = await request.json();

    if (!body.rawJobListing?.trim()) {
      return NextResponse.json(
        { success: false, error: "Raw job listing text is required." },
        { status: 400 }
      );
    }

    const cvData = await getFullCvData();
    const prompt = buildPrompt(cvData, body);

    const ai = new GoogleGenAI({ apiKey: GOOGLE_AI_API_KEY });

    // Fallback model candidates list
    const modelCandidates = ["gemini-3.1-flash-lite", "gemini-2.0-flash", "gemini-2.5-flash"];
    if (body && typeof (body as any).model === "string") {
      modelCandidates.unshift((body as any).model);
    }

    let rawText = "";
    let lastError: any = null;

    for (const modelName of modelCandidates) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });
        if (response.text?.trim()) {
          rawText = response.text.trim();
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Cover Letter API] Model ${modelName} failed, trying fallback...`, err);
      }
    }

    if (!rawText) {
      throw lastError || new Error("AI returned an empty response.");
    }

    let cleanText = rawText;
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.slice(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.slice(0, -3);
    }
    cleanText = cleanText.trim();

    const parsed: CoverLetterResponse = JSON.parse(cleanText);

    return NextResponse.json({
      success: true,
      data: {
        extracted_company: parsed.extracted_company || "",
        extracted_position: parsed.extracted_position || "",
        extracted_type: parsed.extracted_type || "",
        extracted_location: parsed.extracted_location || "",
        profile_override: parsed.profile_override || {},
        body_highlight: parsed.body_highlight || (parsed as any).paragraf_pengalaman || "",
      },
    });
  } catch (error: unknown) {
    console.error("[API POST /api/cover-letter] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate cover letter";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
