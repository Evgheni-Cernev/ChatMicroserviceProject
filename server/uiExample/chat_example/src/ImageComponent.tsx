import React, { useEffect, useState } from 'react';
import './App.css'

interface ImageComponentProps {
  fileName: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ fileName }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:3003/messages/file/${fileName}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setImageSrc(url);
        } else {
          console.error('Error fetching image:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();

    // Cleanup URL object when component unmounts
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [fileName]);

  return imageSrc ? <img src={imageSrc} alt="Attached" style={{ maxWidth: '200px', maxHeight: '200px' }} /> : null;
};

export default ImageComponent;
