import { motion } from 'framer-motion';
import { FileText, X, GripVertical } from 'lucide-react';
import { formatFileSize } from '@/lib/pdf-utils';

interface FileListProps {
  files: File[];
  onRemove?: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  showReorder?: boolean;
}

const FileList = ({ files, onRemove, onReorder, showReorder = false }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      {files.map((file, index) => (
        <motion.div
          key={`${file.name}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="glass rounded-xl p-4 flex items-center gap-4"
        >
          {showReorder && (
            <div className="cursor-grab text-muted-foreground hover:text-foreground">
              <GripVertical className="w-5 h-5" />
            </div>
          )}
          
          <div className="bg-primary/10 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{file.name}</p>
            <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          
          {onRemove && (
            <button
              onClick={() => onRemove(index)}
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FileList;
