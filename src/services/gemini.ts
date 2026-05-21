export async function callGemini(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) throw new Error('Chưa nhập Gemini API Key');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1000, temperature: 0.3 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? 'Lỗi Gemini API');
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text.trim() as string;
}