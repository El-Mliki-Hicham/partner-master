"use client";
import { useState, useEffect } from 'react';
import { File, CheckCircle, Upload, X } from 'lucide-react';
import { userService } from '@/api/userService';

export default function DocUploadCard({ title, agentId, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showUploadUI, setShowUploadUI] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [getUser, setUserData] = useState(null);

  // Load the upload status when component mounts
  useEffect(() => {
    const fetchUser = async ()=>{
       const userResult = await userService.getCurrentUser();
        if (userResult.status === 'success') {
          setUserData(userResult.data);
          console.log('user : ',userResult.data.role);
        }
    }
    fetchUser()
    if (agentId) {
      const storageKey = `${agentId}-${title}`;
      const savedUpload = localStorage.getItem(storageKey);
      if (savedUpload) {
        const uploadData = JSON.parse(savedUpload);
        setUploadComplete(true);
        setUploadedFile(uploadData);
      }
    }
  }, [agentId, title]);

  const getDocumentType = () => {
    const typeMap = {
      "Piece d'identite": "identity",
      "Assurance": "insurance",
      "Kibis ou registre de commerce": "kibis",
      "URSSAF": "urssaf",
      "Rib": "rib",
      "Diplome et certification": "diploma"
    };
    return typeMap[title] || 'other';
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document', file);
      formData.append('agentId', agentId);
      formData.append('document_type', getDocumentType());

      const response = await userService.uploadDocument(getUser.id, formData);

      if (response.status !== 'success') {
        throw new Error('Upload failed');
      }

      const data = response.data;
      
      // Save upload data to localStorage
      const uploadData = {
        fileName: file.name,
        filePath: data.path,
        documentType: getDocumentType(),
        agentId: agentId,
        uploadedAt: new Date().toISOString()
      };
      
      const storageKey = `${agentId}-${title}`;
      localStorage.setItem(storageKey, JSON.stringify(uploadData));
      
      setUploadedFile(uploadData);
      setUploadComplete(true);
      setShowUploadUI(false);

      onUpload(uploadData);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (!showUploadUI && !uploadComplete) {
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-[#207DAB] mb-4 text-center">{title}</h3>
        <button 
          onClick={() => setShowUploadUI(true)}
          className="bg-white text-black h-48 w-full rounded-lg shadow-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors duration-200"
        >
          <File className="w-8 h-8 text-sky-700 mb-2" />
          <span className="text-sm text-gray-500">Cliquer pour télécharger</span>
          <div className="flex space-x-2 mt-2">
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">PDF</span>
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">JPG</span>
            <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">PNG</span>
          </div>
        </button>
      </div>
    );
  }

  if (uploadComplete) {
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-[#207DAB] mb-4 text-center">{title}</h3>
        <div className="bg-white text-black h-48 w-full rounded-lg shadow-lg flex flex-col items-center justify-center">
          <File className="w-8 h-8 text-sky-700 mb-2" />
          <span className="text-sm text-gray-500">{uploadedFile?.fileName || selectedFile?.name}</span>
          <div className="flex items-center space-x-2 mt-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-700 text-xs">Upload complete</span>
          </div>
          <div className="flex space-x-4 mt-2">
            <a 
              href={uploadedFile?.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:text-sky-800 text-sm underline"
              data-testid="view-document-link"
            >
              View Document
            </a>
            <button
              onClick={() => window.open(uploadedFile?.filePath, '_blank')}
              className="text-sky-700 hover:text-sky-800 text-sm underline"
            >
              Open File
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#207DAB]">{title}</h3>
        <button 
          onClick={() => setShowUploadUI(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div 
        className="bg-white text-black h-48 w-full rounded-lg shadow-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-sky-700 transition-colors duration-200"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          id={`fileInput-${title}`}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label
          htmlFor={`fileInput-${title}`}
          className="cursor-pointer flex flex-col items-center"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-700" />
              <span className="text-sm text-gray-500 mt-2">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-sky-700 mb-2" />
              <span className="text-sm text-gray-500">Drag and drop or click to upload</span>
              <div className="flex space-x-2 mt-2">
                <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">PDF</span>
                <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">JPG</span>
                <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">PNG</span>
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
