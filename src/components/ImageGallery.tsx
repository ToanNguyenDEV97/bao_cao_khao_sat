
import React, { useRef } from 'react';
import { Camera, UploadCloud } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  onImageUpload: (newImages: string[]) => void;
  isReadOnly?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageUpload, isReadOnly = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImageUrls: string[] = [];
      let filesProcessed = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newImageUrls.push(e.target.result as string);
          }
          filesProcessed++;
          if (filesProcessed === files.length) {
            onImageUpload([...images, ...newImageUrls]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="break-inside-avoid">
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={isReadOnly}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[0, 1, 2, 3].map(index => (
          <div key={index} className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
            {images[index] ? (
              <img src={images[index]} alt={`Uploaded preview ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500">
                <Camera size={48} className="mx-auto" />
                <p>Khung ảnh {index + 1}</p>
              </div>
            )}
          </div>
        ))}
      </div>
       {!isReadOnly && (
        <div className="mt-4 text-center print:hidden">
            <button
            onClick={triggerFileInput}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg inline-flex items-center transition duration-300"
            >
            <UploadCloud className="mr-2" size={20} />
            Tải ảnh lên
            </button>
        </div>
       )}
    </div>
  );
};

export default ImageGallery;