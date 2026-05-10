import React, { useState } from 'react';
import { Card, Button, Textarea, Badge } from './UI';
import { Sparkles, Send, Loader2, Bot } from 'lucide-react';
import { askAiTutor } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';

export default function AITutor() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    try {
      const aiResponse = await askAiTutor(prompt);
      setResponse(aiResponse || "I'm sorry, I couldn't process that.");
    } catch (err: any) {
      setError(err.message || "Failed to connect to AI. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 h-full flex flex-col bg-slate-900 border-slate-800 text-white overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-32 h-32 text-indigo-400" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-black text-white tracking-tight uppercase text-xs tracking-widest">Smart Study Buddy</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Powered by Gemini AI</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[200px] scrollbar-hide">
          {response ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10"
            >
              <p className="text-xs leading-relaxed text-slate-200 font-medium whitespace-pre-wrap">{response}</p>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40 py-8">
              <Sparkles className="w-8 h-8 mb-4 text-indigo-400" />
              <p className="text-[10px] font-black uppercase tracking-widest">Ask me anything about your studies</p>
            </div>
          )}
          
          {loading && (
            <div className="flex items-center gap-3 bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20 italic">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Studying...</span>
            </div>
          )}
          
          {error ? (
            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-tight">{error}</p>
              <button 
                onClick={() => window.location.hash = '/settings'}
                className="text-[10px] text-white underline mt-2 font-black uppercase"
              >
                Go to Settings
              </button>
            </div>
          ) : null}
        </div>

        {!getGeminiApiKey() && !error && (
          <div className="mb-4 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl">
            <p className="text-[10px] font-bold text-indigo-300">AI Key not set. Please visit settings to configure your Gemini API key.</p>
            <button 
              onClick={() => window.location.hash = '/settings'}
              className="text-[10px] text-white underline mt-1 font-black uppercase"
            >
              Configure Now
            </button>
          </div>
        )}

        <div className="space-y-4">
          <Textarea
            placeholder="Type your question..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-slate-600"
            rows={2}
          />
          <Button 
            onClick={handleAsk} 
            disabled={loading || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 py-3"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="uppercase tracking-widest text-[10px] font-black">Get AI Help</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
