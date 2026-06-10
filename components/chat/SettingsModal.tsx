import React from 'react';
import { Button, Card, Input } from 'shadcn/ui';
import { motion } from 'framer-motion';

const SettingsModal = ({ isOpen, onClose }) => {
  return (
        <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex justify-center items-center"
        >
          <motion.div
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: '0%', opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        className="bg-white dark:bg-gray-950 rounded-lg p-6 shadow-lg w-full max-w-md"
          >
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="mb-4">
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
          <select id="theme" name="theme" className="form-select form-select-lg bg-white dark:bg-gray-950 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
              </div>
        <div className="mb-4">
          <label htmlFor="notifications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notifications</label>
          <Input id="notifications" type="checkbox" className="form-checkbox form-checkbox-lg bg-white dark:bg-gray-950 rounded-md border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-2" />
              </div>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
          </motion.div>
        </motion.div>
  );
};

export default SettingsModal;

