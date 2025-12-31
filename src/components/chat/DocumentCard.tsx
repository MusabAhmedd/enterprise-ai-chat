import { motion } from 'framer-motion';
import { FileText, FileType, Trash2 } from 'lucide-react';
import { type Document, formatFileSize } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const FileIcon = ({ type }: { type: Document['type'] }) => {
  switch (type) {
    case 'pdf':
      return <FileType className="h-4 w-4 text-red-500" />;
    default:
      return <FileText className="h-4 w-4 text-blue-500" />;
  }
};

export function DocumentCard({ document, onDelete, isDeleting }: DocumentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      className="group relative flex items-center gap-3 rounded-xl bg-card p-3 border border-border transition-all duration-200 hover:border-sidebar-ring/30 hover:shadow-card-hover"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <FileIcon type={document.type} />
      </div>
      
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {document.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(document.size)}
        </p>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(document.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Delete document</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
