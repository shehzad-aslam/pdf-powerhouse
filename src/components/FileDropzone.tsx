import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, Image } from 'lucide-react';

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  description?: string;
}

const FileDropzone = ({
  onFilesAccepted,
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  maxFiles = 10,
  label = 'Drop your PDF here',
  description = 'or click to browse',
}: FileDropzoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  const isImageAccept = accept['image/*'] || accept['image/png'] || accept['image/jpeg'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        
        <motion.div 
          className="flex flex-col items-center gap-6"
          animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative bg-primary/10 p-6 rounded-2xl border border-primary/20">
              {isImageAccept ? (
                <Image className="w-12 h-12 text-primary" />
              ) : (
                <FileText className="w-12 h-12 text-primary" />
              )}
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {isDragActive ? 'Drop files here' : label}
            </h3>
            <p className="text-muted-foreground">
              {description}
            </p>
            {multiple && (
              <p className="text-sm text-muted-foreground mt-2">
                Up to {maxFiles} files supported
              </p>
            )}
          </div>
          
          <motion.div 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium">Select File</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FileDropzone;
