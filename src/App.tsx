import React, { useState, useRef, useEffect } from 'react';
import { Link2, Loader2, Copy } from 'lucide-react';
import axios from 'axios';

interface ExtractedLink {
  initial: string;
  final: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allLinksText, setAllLinksText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const API_URL = 'https://web-production-146f.up.railway.app';

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [allLinksText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(`Sending request to: ${API_URL}/extract`);
      const response = await axios.post(`${API_URL}/extract`, { url });
      const links = response.data.links;
      
      console.log('Response received:', response.data);
      
      const concatenatedLinks = links.map((link: ExtractedLink) => link.final).join('\n');
      setAllLinksText(concatenatedLinks);
    } catch (err: any) {
      console.error('Error during API call:', err);
      setError(err.response?.data?.error || 'Failed to extract links. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAllLinks = () => {
    navigator.clipboard.writeText(allLinksText).then(() => {
      alert('All links copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy links to clipboard.');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-white">
      <div className="max-w-4xl mx-auto p-6 pb-24">
        
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link2 className="w-8 h-8 text-sky-700" />
          <h1 className="text-3xl font-bold text-sky-800">Primewire Link Extractor</h1>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to extract links from..."
              className="flex-1 px-4 py-2 rounded-lg border border-sky-300 bg-white text-sky-800 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-sky-700 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-sky-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting...
                </span>
              ) : (
                'Extract Links'
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-300 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {allLinksText && (
          <div className="rounded-lg shadow-lg p-6 bg-transparent border border-sky-300">
            <h2 className="text-xl font-semibold text-sky-800 mb-4">
              Extracted Links
            </h2>
            
            <textarea
              ref={textareaRef}
              value={allLinksText}
              readOnly
              className="w-full p-2 rounded-lg border border-sky-300 bg-white text-sky-800 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 font-mono text-sm resize-none overflow-hidden"
              rows={1}
            />

            <button
              onClick={handleCopyAllLinks}
              className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-sky-100 transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy All Links
            </button>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 text-center p-4 text-sky-800 bg-transparent">
        <p>© {new Date().getFullYear()} Mohamed Elshoraky. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
