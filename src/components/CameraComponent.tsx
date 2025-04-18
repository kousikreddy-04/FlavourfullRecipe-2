
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, ImageIcon, Trash2, Upload, X } from 'lucide-react';

interface CameraComponentProps {
  onImageCapture: (image: File) => void;
  onClear: () => void;
  previewUrl?: string;
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  onImageCapture,
  onClear,
  previewUrl,
}) => {
  const [mode, setMode] = useState<'closed' | 'camera' | 'file'>('closed');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setMode('camera');
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access the camera. Please check permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setMode('closed');
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame on canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'recipe-image.jpg', { type: 'image/jpeg' });
            onImageCapture(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  }, [onImageCapture, stopCamera]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageCapture(files[0]);
      setMode('closed');
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {mode === 'closed' && !previewUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              Take a photo or upload an image of your delicious recipe
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                onClick={startCamera}
                variant="outline"
                className="flex items-center"
              >
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
              <Button 
                onClick={openFileDialog}
                variant="outline"
                className="flex items-center"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}

      {mode === 'camera' && (
        <div className="relative border border-gray-300 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <Button 
              onClick={captureImage}
              variant="default"
              className="bg-spice-dark hover:bg-spice"
            >
              Take Photo
            </Button>
            <Button 
              onClick={stopCamera}
              variant="outline"
              className="bg-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="relative border border-gray-300 rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Recipe preview"
            className="w-full h-64 object-cover"
          />
          <Button
            onClick={onClear}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
