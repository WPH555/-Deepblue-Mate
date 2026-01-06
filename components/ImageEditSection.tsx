
import React, { useState } from 'react';
import { geminiService } from '../services/gemini';
import { Button, Input, Card } from './UI';

const ImageEditSection: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    try {
      const result = await geminiService.editImage(image, prompt);
      setEditedImage(result);
    } catch (error) {
      console.error(error);
      alert("编辑失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-bold text-[#00F0FF] mb-4">影像后期处理</h2>
        <div className="space-y-4">
          {!image ? (
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/10 hover:border-[#00F0FF]/50 transition-colors cursor-pointer rounded-lg bg-white/5">
              <div className="text-[#00F0FF] mb-2">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-white/40 text-sm mono">上传原始数据影像</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          ) : (
            <div className="relative h-48 w-full group overflow-hidden rounded-lg">
              <img src={image} className="w-full h-full object-cover" alt="Original" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white/70 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <Input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如: '添加科幻蓝色滤镜' 或 '移除背景干扰'..."
            disabled={!image}
          />
          <Button className="w-full" onClick={handleEdit} loading={loading} variant="primary" disabled={!image}>
            应用算法修改
          </Button>
        </div>
      </Card>

      {editedImage && (
        <Card className="animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-sm font-bold text-[#FF5722] mb-4 uppercase tracking-[0.2em]">修改后的影像数据</h3>
          <img src={editedImage} className="w-full rounded-sm border border-[#FF5722]/30 shadow-[0_0_20px_rgba(255,87,34,0.1)]" alt="Edited" />
          <div className="mt-4 flex gap-4">
            <Button className="flex-1" onClick={() => setEditedImage(null)} variant="ghost">废弃</Button>
            <a href={editedImage} download="deepblue-edit.png" className="flex-1">
              <Button className="w-full">保存至数据库</Button>
            </a>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageEditSection;
