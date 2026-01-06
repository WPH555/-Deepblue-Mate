
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { GroundingSource } from '../types';
import { Button, Input, Card } from './UI';

const MapsSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string; sources: GroundingSource[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMapsSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      let location = undefined;
      try {
        const pos = await new Promise<GeolocationPosition>((res, rej) => 
          navigator.geolocation.getCurrentPosition(res, rej)
        );
        location = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      } catch (e) {
        console.warn("Location permission denied or unavailable.");
      }
      
      const data = await geminiService.searchMaps(query, location);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("地图搜索失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <Card>
        <h2 className="text-xl font-bold text-[#00F0FF] mb-4">地理空间检索</h2>
        <div className="flex gap-2">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMapsSearch()}
            placeholder="检索周边设施或地理信息..."
          />
          <Button onClick={handleMapsSearch} loading={loading} variant="secondary">探测</Button>
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto space-y-4">
        {result && (
          <div className="space-y-4">
            <Card className="border-l-4 border-l-[#FF5722]">
              <div className="prose prose-invert max-w-none text-white/80">
                {result.text}
              </div>
            </Card>

            <div className="space-y-2">
              <h3 className="text-[10px] text-white/40 uppercase tracking-[0.2em] mono mb-2">地理坐标锚点</h3>
              {result.sources.map((src, i) => (
                <a 
                  key={i} 
                  href={src.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 glass hover:bg-white/10 transition-colors border border-white/5 rounded-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-[#FF5722]/10 text-[#FF5722]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-[#00F0FF]">{src.title}</div>
                      <div className="text-[10px] text-white/40 mono">{src.uri.substring(0, 40)}...</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapsSection;
