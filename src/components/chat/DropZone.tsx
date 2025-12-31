import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFileDrop: (files: File[]) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export function DropZone({ onFileDrop, isUploading, uploadProgress }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileDrop(files);
    }
  }, [onFileDrop]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileDrop(files);
    }
  }, [onFileDrop]);

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={{
        scale: isDragging ? 1.02 : 1,
        borderColor: isDragging ? 'hsl(var(--dropzone))' : 'hsl(var(--dropzone-muted))',
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer",
        isDragging ? "bg-dropzone/5" : "bg-transparent hover:bg-muted/50"
      )}
    >
      <input
        type="file"
        multiple
        accept=".pdf,.txt,.md,.doc,.docx"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      
      <AnimatePresence mode="wait">
        {isUploading ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FileUp className="h-8 w-8 text-dropzone" />
            </motion.div>
            <div className="w-full max-w-[120px]">
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-dropzone rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress || 0}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Uploading...</p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <Upload className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-dropzone" : "text-muted-foreground"
            )} />
            <p className="text-sm font-medium text-foreground">
              {isDragging ? "Drop files here" : "Drop files or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, TXT, MD, DOC supported
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
