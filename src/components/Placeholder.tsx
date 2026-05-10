import React from 'react';
import { Card } from './UI';
import { motion } from 'motion/react';

export default function Placeholder({ title }: { title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[60vh] flex items-center justify-center"
    >
      <Card className="p-12 text-center max-w-md border-dashed border-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6 italic">This feature is currently being provisioned with secure, role-based access controls.</p>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </Card>
    </motion.div>
  );
}
