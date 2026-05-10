import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, Input, Button, Badge } from './UI';
import { Key, Shield, Info, CheckCircle2 } from 'lucide-react';
import { getGeminiApiKey, saveGeminiApiKey } from '../services/aiService';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Settings() {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setApiKey(getGeminiApiKey());
  }, []);

  const handleSave = () => {
    saveGeminiApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-4xl">
      <header>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Configure your personal EduPulse environment</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <motion.div variants={item}>
            <Card className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight">AI Configuration</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage your Gemini API access</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="Gemini API Key"
                  type="password"
                  placeholder="Enter your API key here..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                
                <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-100/50">
                  <div className="flex gap-4">
                    <div className="mt-1">
                      <Info className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">How it works</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Your key is stored locally in your browser's <strong>Local Storage</strong>. It is used to power the AI Tutor and other smart features. If left blank, the system will try to use the environment's default key.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Never share your API Key
                  </p>
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    {saved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Settings Saved
                      </>
                    ) : (
                      'Save Configuration'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div variants={item}>
            <Card className="p-8 bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-500/20">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-80">Security Notice</h4>
              <p className="text-xs font-medium leading-relaxed mb-6">
                EduPulse ensures that your API keys are never included in the source code or committed to GitHub. 
              </p>
              <Badge variant="success" className="bg-white/20 text-white">Encrypted Storage</Badge>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
