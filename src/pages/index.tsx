import { useState } from 'react';
import jsPDF from 'jspdf';

function downloadPDF(text: string) {
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text(text, 10, 10);
  doc.save('resume.pdf');
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
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
  });

  const [loading, setLoading] = useState(false);
  const [resumeOutput, setResumeOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Submit form to API
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResumeOutput(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate resume');
      }

      const data = await res.json();
      setResumeOutput(data.output);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">AI Resume Builder</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-md shadow-md">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block font-semibold mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="block font-semibold mb-1">
            Professional Summary
          </label>
          <textarea
            id="summary"
            name="summary"
            required
            rows={3}
            value={formData.summary}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block font-semibold mb-1">
            Work Experience
          </label>
          <textarea
            id="experience"
            name="experience"
            required
            rows={4}
            value={formData.experience}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Education */}
        <div>
          <label htmlFor="education" className="block font-semibold mb-1">
            Education
          </label>
          <textarea
            id="education"
            name="education"
            required
            rows={3}
            value={formData.education}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Skills */}
        <div>
          <label htmlFor="skills" className="block font-semibold mb-1">
            Skills (comma separated)
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            required
            value={formData.skills}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="e.g. JavaScript, React, Node.js"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Generating...' : 'Generate Resume'}
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
    Download PDF
  </button>
)}
      </section>
    </main>
  );
}


