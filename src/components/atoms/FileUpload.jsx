import React, { useState, useRef } from 'react';
import { Upload, X, File, Image } from 'lucide-react';
import Button from './Button';

const FileUpload = ({ 
  label, 
  value = [], 
  onChange, 
  error,
  accept = "*/*",
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "",
  ...props 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (newFiles) => {
    if (value.length + newFiles.length > maxFiles) {
      return;
    }

    setUploading(true);
    
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        return false;
      }
      return true;
    });

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fileObjects = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));

    onChange([...value, ...fileObjects]);
    setUploading(false);
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = value.filter(f => f.id !== fileId);
    onChange(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = (type) => type.startsWith('image/');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragOver ? 'border-primary bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-300' : ''}
          hover:border-primary hover:bg-gray-50
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <div>
            <p className="text-sm text-gray-600">
              Drop files here or{' '}
              <span className="text-primary font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-500">
              Max {maxFiles} files, {formatFileSize(maxSize)} each
            </p>
          </div>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Attached Files ({value.length})
          </p>
          <div className="space-y-2">
            {value.map((fileObj) => (
              <div
                key={fileObj.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  {isImage(fileObj.type) ? (
                    <div className="flex-shrink-0">
                      <img
                        src={fileObj.url}
                        alt={fileObj.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </div>
                  ) : (
                    <File className="w-8 h-8 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileObj.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(fileObj.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(fileObj.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;