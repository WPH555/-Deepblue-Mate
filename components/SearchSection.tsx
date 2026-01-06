
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { GroundingSource } from '../types';
import { Button, Input, Card } from './UI';

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data = await geminiService.search(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-t-2 border-t-[#FF5722]">
        <h2 className="text-lg font-bold text-white mb-2">合规与准则检索</h2>
        <p className="text-xs text-white/40 mb-4 mono">Protocol: GLOBAL_COMPLIANCE_SYNC</p>
        <div className="flex gap-2">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="输入作业规范或法律条文查询..."
          />
          <Button onClick={handleSearch} loading={loading} variant="secondary">查询</Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <Card className="bg-[#00F0FF]/5">
            <div className="prose prose-invert max-w-none text-xs text-white/80 leading-relaxed">
              {result.text}
            </div>
          </Card>
          <div className="grid grid-cols-1 gap-2">
            {result.sources.map((src, i) => (
              <a 
                key={i} 
                href={src.uri} 
                target="_blank" 
                className="glass p-3 rounded-sm flex items-center justify-between group"
              >
                <span className="text-[10px] text-white/60 truncate mr-4">{src.title}</span>
                <svg className="w-3 h-3 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-b-2 border-[#FF5722] animate-spin rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
