"use client";
import { useState, useEffect } from 'react';
import { File, CheckCircle, Upload, X } from 'lucide-react';
import { userService } from '@/api/userService';

export default function DocUploadCard({type, title, agentId, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showUploadUI, setShowUploadUI] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Load the upload status and documents when component mounts
  useEffect(() => {
    const fetchUserAndDocuments = async () => {
      try {
        const response = await userService.getCurrentUser();
        setCurrentUser(response.data);
        
        // Fetch documents after getting user
        if (response.data?.id) {
          const documentsResponse = await userService.getDocuments(response.data.id);
          const documentData = documentsResponse.data.data;
          
          // Transform document data into array format for rendering
          const documentArray = Object.entries(documentData).map(([type, details]) => ({
            type,
            name: details.file_path ? details.file_path.split('/').pop() : null,
            uploaded: details.uploaded,
            isVerified: details.is_verified,
            path: details.file_path
          })).filter(doc => doc.uploaded);
          
          setDocuments(documentArray);
        }
      } catch (error) {
        console.error('Error fetching user or documents:', error);
      }
    };

    fetchUserAndDocuments();

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
      "Piece d'identite": "identity_card",
      "Assurance": "insurance", 
      "Kibis ou registre de commerce": "business_registration",
      "URSSAF": "social_security",
      "Rib": "bank_details",
      "Diplome et certification": "diplomas"
    };
    return typeMap[title] || 'other';
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const formData = new FormData();
      formData.append('document', file);
      formData.append('agentId', agentId);
      formData.append('document_type', getDocumentType());
      
      const response = await userService.uploadDocument(currentUser.id, formData);
      
      // Get updated document list after successful upload
      const documentsResponse = await userService.getDocuments(currentUser.id);
      if (documentsResponse.data?.data) {
        const documentData = documentsResponse.data.data;
        
        // Transform document data into array format for rendering
        const documentArray = Object.entries(documentData).map(([type, details]) => ({
          type,
          name: details.file_path ? details.file_path.split('/').pop() : null,
          uploaded: details.uploaded,
          isVerified: details.is_verified,
          path: details.file_path
        })).filter(doc => doc.uploaded);
        
        setDocuments(documentArray);
      }

      const uploadData = {
        fileName: file.name,
        filePath: response.data.file_path
      };

      setUploadedFile(uploadData);
      setUploadComplete(true);
      setShowUploadUI(false);

      if (onUpload) {
        onUpload(uploadData);
      }

    } catch (error) {
      console.error('Upload failed:', error);
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

  if (uploadComplete) {
    return (
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-[#207DAB] mb-4 text-center">{title}</h3>
      
        <div 
          className="bg-white text-black h-48 w-full rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={() => uploadedFile?.filePath && window.open(uploadedFile.filePath, '_blank')}
        >
          <File className="w-8 h-8 text-sky-700 mb-2" />
          <span className="text-sm text-gray-500">{uploadedFile?.fileName || selectedFile?.name}</span>
          <div className="flex items-center space-x-2 mt-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-700 text-xs">Upload complete</span>
          </div>
          <span className="text-xs text-sky-700 mt-2">Click to view document</span>
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
