import React, { useState, useRef, useEffect } from 'react';
import './styles.css';

const ImageDropZone = ({ setImageVar}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const urlRegistryRef = useRef(new Set()); // Track all created URLs

  // Clean up all URLs on unmount
  useEffect(() => {
    return () => {
      urlRegistryRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
      urlRegistryRef.current.clear();
    };
  }, []);

  useEffect(() => {
    setImageVar(images);
  
}, [images]);

  // Handle file selection and conversion to blob
  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    const imagePromises = fileArray.map(async (file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.warn(`File ${file.name} is not an image`);
        return null;
      }

      // Convert file to blob
      const blob = new Blob([file], { type: file.type });
      
      // Create preview URL and register it
      const previewUrl = URL.createObjectURL(blob);
      urlRegistryRef.current.add(previewUrl);
      
      const imageData = {
        blob,
        file,
        previewUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        id: crypto.randomUUID() // Use crypto.randomUUID for better uniqueness
      };

      return imageData;
    });

    const processedImages = await Promise.all(imagePromises);
    const validImages = processedImages.filter(img => img !== null);
    

    images.forEach(img => {
    URL.revokeObjectURL(img.previewUrl);
    urlRegistryRef.current.delete(img.previewUrl);
    });
    setImages(validImages);
    

    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  // File input handler
  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  // Click to open file dialog
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Remove image with proper cleanup
  const removeImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        // Clean up object URL
        URL.revokeObjectURL(imageToRemove.previewUrl);
        urlRegistryRef.current.delete(imageToRemove.previewUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  };


  return (
    <div className="image-drop-zone-container">
      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="drop-zone-content">
          <div className="upload-icon">📁</div>
          <p className="drop-text">
            Drop images here or click to select
          </p>
          <p className="file-types">
            Supports: JPG, PNG, GIF, WebP, SVG
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </div>

    </div>
  );
};

export default ImageDropZone;
