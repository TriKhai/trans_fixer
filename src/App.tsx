import { useState } from 'react';
import type { Tab, Lang } from './types';
import { useAI } from './hooks/useAI';
import { ResultCard } from './components/ResultCard';

export default function App() {
  const [tab, setTab] = useState<Tab>('spell');
  const [lang, setLang] = useState<Lang>('vi-en');
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');

  const { geminiResult, run, reset } = useAI();

  const handleTabChange = (t: Tab) => { setTab(t); reset(); };
  const handleLangChange = (l: Lang) => { setLang(l); reset(); };

  const handleRun = async () => {
    if (!input.trim()) return;
    await run(input, tab, lang, apiKey);
  };

  const placeholder = tab === 'spell'
    ? 'Nhập văn bản tiếng Việt cần kiểm tra chính tả...'
    : lang === 'vi-en' ? 'Nhập văn bản tiếng Việt cần dịch...' : 'Enter English text to translate...';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white px-8 py-4 flex items-center gap-3">
        <span className="text-xl"></span>
        <h1 className="text-lg font-semibold">TextCheck AI</h1>
        <span className="ml-auto text-xs text-gray-400"></span>
      </header>

      <main className="max-w-2xl mx-auto py-8 px-4 flex flex-col gap-5">
        {/* API Key */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">API Key (Groq)</p>
          <input
            type="password"
            placeholder="AIza..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono bg-gray-50 focus:outline-none focus:border-blue-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => handleTabChange('spell')}
            className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all ${
              tab === 'spell' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            Kiểm tra chính tả
          </button>
          <button
            onClick={() => handleTabChange('translate')}
            className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all ${
              tab === 'translate' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            Dịch thuật
          </button>
        </div>

        {/* Input Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          {/* Lang toggle */}
          {tab === 'translate' && (
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => handleLangChange('vi-en')}
                className={`px-4 py-1.5 rounded-lg text-sm border transition-all ${
                  lang === 'vi-en' ? 'bg-blue-50 text-blue-600 border-blue-400' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                Tiếng Việt
              </button>
              <button
                onClick={() => setLang(prev => prev === 'vi-en' ? 'en-vi' : 'vi-en')}
                className="text-gray-400 hover:text-blue-500 text-lg px-1"
              >
                ⇄
              </button>
              <button
                onClick={() => handleLangChange('en-vi')}
                className={`px-4 py-1.5 rounded-lg text-sm border transition-all ${
                  lang === 'en-vi' ? 'bg-blue-50 text-blue-600 border-blue-400' : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                English
              </button>
              <span className="text-xs text-gray-400 ml-1">
                → {lang === 'vi-en' ? 'Tiếng Anh' : 'Tiếng Việt'}
              </span>
            </div>
          )}

          <textarea
            rows={6}
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 resize-none focus:outline-none focus:border-blue-400"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">{input.length} ký tự</span>
            <button
              onClick={handleRun}
              disabled={geminiResult.status === 'loading' || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
            >
              {geminiResult.status === 'loading' ? (
                <><span className="animate-spin"></span> Đang xử lý...</>
              ) : (
                <>Chạy</>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        <ResultCard result={geminiResult} />
      </main>
    </div>
  );
}