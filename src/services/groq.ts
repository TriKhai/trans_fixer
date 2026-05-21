export async function callGroq(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) throw new Error('Chưa nhập Groq API Key');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message ?? 'Lỗi Groq API');
  }

  const data = await res.json();
  return data.choices[0].message.content.trim() as string;
}