
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { Button, Input, Card } from './UI';

const ImageGenSection: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const url = await geminiService.generateImage(prompt, size);
      setResult(url);
    } catch (error) {
      console.error(error);
      alert("图像生成失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-[#00F0FF] mb-4">视觉资产生成</h2>
        <div className="space-y-4">
          <Input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要生成的深蓝视界..."
          />
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 uppercase tracking-widest mono">分辨率控制:</span>
            <div className="flex bg-white/5 p-1 rounded-sm gap-1">
              {(["1K", "2K", "4K"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-1 text-xs mono rounded-sm transition-all ${size === s ? 'bg-[#00F0FF] text-black' : 'text-white/40 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={handleGenerate} loading={loading} variant="primary">
            启动渲染进程
          </Button>
        </div>
      </Card>

      {result && (
        <Card className="animate-in fade-in zoom-in duration-500">
          <div className="relative group overflow-hidden rounded-sm border border-white/10">
            <img src={result} alt="Generated" className="w-full h-auto" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a href={result} download="deepblue-asset.png" className="bg-[#00F0FF] text-black px-4 py-2 font-bold rounded-sm">
                下载原始资产
              </a>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center text-[10px] text-white/30 mono">
            <span>FILE: ASSET_GEN_ALPHA.PNG</span>
            <span>FORMAT: RGBA_8888</span>
          </div>
        </Card>
      )}

      {loading && !result && (
        <div className="flex flex-col items-center justify-center p-20 glass rounded-lg border border-[#00F0FF]/10 animate-pulse">
          <div className="w-12 h-12 border-2 border-[#00F0FF] border-t-transparent animate-spin rounded-full mb-4"></div>
          <p className="text-[#00F0FF] mono text-sm uppercase tracking-widest">量子叠加渲染中...</p>
        </div>
      )}
    </div>
  );
};

export default ImageGenSection;
