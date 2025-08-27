
import React from 'react';
import ImageGallery from './ImageGallery';

interface Step3ImagesProps {
  images: string[];
  onImageUpload: (newImages: string[]) => void;
}

const Step3Images: React.FC<Step3ImagesProps> = ({ images, onImageUpload }) => {
  return (
    <div className="py-4 font-serif">
        <h2 className="text-lg font-bold mb-3">III. HÌNH ẢNH</h2>
        <ImageGallery images={images} onImageUpload={onImageUpload} />
    </div>
  );
};

export default Step3Images;
