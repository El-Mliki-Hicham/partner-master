"use client";
import { useState } from 'react';
import { X, Upload } from 'lucide-react';

export default function DocumentUpload({ isOpen, onClose, agentId, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Create the directory if it doesn't exist
      const directoryPath = `/public/uploads/${agentId}`;
      
      // Save file to the directory
      const filePath = `${directoryPath}/${selectedFile.name}`;
      
      // In a real app, you'd send this to an API
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      onUpload({
        fileName: selectedFile.name,
        filePath: filePath,
        uploadedAt: new Date().toISOString(),
      });

      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h2>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="fileInput"
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-blue-500 mb-4" />
              <span className="text-lg font-medium text-gray-900 mb-2">
                {selectedFile ? selectedFile.name : 'Choose a file'}
              </span>
              <span className="text-sm text-gray-500">
                or drag and drop it here
              </span>
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`w-full py-3 px-4 rounded-lg text-white text-lg font-semibold transition-colors duration-200 
              ${!selectedFile || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </div>
    </div>
  );
}
