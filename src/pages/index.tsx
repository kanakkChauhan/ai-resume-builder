import { useState } from "react";
import jsPDF from "jspdf";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from 'next/head';

<>
<Head>
<title>AI Resume Builder - Create Your Resume with AI</title>
<meta name="description" content="Easily generate a professional resume using AI. Free and fast AI resume builder." />
<meta name="viewport" content="width=device-width, initial-scale=1" />

{/* Open Graph / Facebook */}
<meta property="og:title" content="AI Resume Builder - Create Your Resume with AI" />
<meta property="og:description" content="Easily generate a professional resume using AI. Free and fast AI resume builder." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://ai-resume-builder-93xtbn25k-kanaks-projects-20f76d01.vercel.app/" />
<meta property="og:image" content="https://your-vercel-domain.vercel.app/og-image.png" />

{/* Twitter */}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AI Resume Builder - Create Your Resume with AI" />
<meta name="twitter:description" content="Easily generate a professional resume using AI. Free and fast AI resume builder." />
<meta name="twitter:image" content="https://your-vercel-domain.vercel.app/og-image.png" />
</Head>

{/* Your existing JSX here */}
<main className="max-w-3xl mx-auto p-6">
{/* ... your form and content */}
</main>
</>

function downloadPDF(text: string) {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text(text, 10, 10);
  doc.save("resume.pdf");
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
};

export default function Home() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [resumeOutput, setResumeOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResumeOutput(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate resume");
      }

      const data = await res.json();
      setResumeOutput(data.output);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <main className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold mb-6">AI Resume Builder</h1>
        <p className="mb-4">Please sign in to use the app.</p>
        <button
          onClick={() => signIn("github")}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Sign in with GitHub
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">AI Resume Builder</h1>
        <button
          onClick={() => signOut()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md shadow-md">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-semibold mb-1 text-black">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-black rounded px-3 py-2 text-black"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-semibold mb-1 text-black">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-black rounded px-3 py-2 text-black"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block font-semibold mb-1 text-black">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-black rounded px-3 py-2 text-black"
          />
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block font-semibold mb-1 text-black">
            Professional Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            required
            rows={3}
            value={formData.summary}
            onChange={handleChange}
            className="w-full border border-black rounded px-3 py-2 text-black"
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block font-semibold mb-1 text-black">
            Work Experience
          </label>
          <textarea
            id="experience"
            name="experience"
            required
            rows={4}
            value={formData.experience}
            onChange={handleChange}
            className="w-full border border-black rounded px-3 py-2 text-black"
          />
        </div>

        {/* Education */}
        <div>
          <label htmlFor="education" className="block font-semibold mb-1 text-black">
            Education
          </label>
          <textarea
            id="education"
            name="education"
            required
            rows={3}
            value={formData.education}
            onChange={handleChange}
            className="w-full border border-black rounded px-3 py-2 text-black"
          />
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block font-semibold mb-1 text-black">
            Skills (comma separated)
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            required
            value={formData.skills}
            onChange={handleChange}
            className="w-full border border-black rounded px-3 py-2 text-black"
            placeholder="e.g. JavaScript, React, Node.js"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Resume"}
        </button>
      </form>

      {/* Output / Error */}
      <section className="mt-8 p-6 bg-gray-50 rounded-md shadow-inner min-h-[200px] whitespace-pre-wrap font-mono text-gray-800">
        {error && <p className="text-red-600">{error}</p>}
        {resumeOutput && <pre>{resumeOutput}</pre>}
        {!error && !resumeOutput && <p className="text-gray-500">Your generated resume will appear here.</p>}

        {resumeOutput && (
          <button
            onClick={() => downloadPDF(resumeOutput)}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
          >

 {resumeOutput && (
  <div className="mt-4">
    <button
      onClick={() => downloadPDF(resumeOutput)}
      className="mr-4 bg-green-600 text-white py-2 px-4 rounded"
    >
      Download PDF
    </button>
    <a
      href={`https://twitter.com/intent/tweet?text=Check%20out%20this%20AI%20Resume%20Builder%20I%20used!%20Generate%20your%20resume%20fast%20and%20free.%20${encodeURIComponent('https://ai-resume-builder-93xtbn25k-kanaks-projects-20f76d01.vercel.app/')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
    >
      Share on Twitter
    </a>
  </div>
)}

            Download PDF
          </button>
        )}
      </section>
    </main>
  );
}


