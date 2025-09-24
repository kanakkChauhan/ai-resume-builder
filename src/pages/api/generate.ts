import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Data = {
  output?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formData } = req.body;

  if (!formData) {
    return res.status(400).json({ error: 'Missing form data' });
  }

  const prompt = `
Create a professional resume based on the following details:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Summary: ${formData.summary}
Experience: ${formData.experience}
Education: ${formData.education}
Skills: ${formData.skills}

Format the resume clearly.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
    });

    const output = completion.choices[0].message?.content ?? '';

    res.status(200).json({ output });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'OpenAI request failed' });
  }
}

