import { motion, AnimatePresence } from 'framer-motion';
import { X, Files } from 'lucide-react';
import { type Document } from '@/lib/api';
import { DropZone } from './DropZone';
import { DocumentCard } from './DocumentCard';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  onFileDrop: (files: File[]) => void;
  onDeleteDocument: (id: string) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  deletingId?: string | null;
}

export function ChatSidebar({
  isOpen,
  onClose,
  documents,
  onFileDrop,
  onDeleteDocument,
  isUploading,
  uploadProgress,
  deletingId,
}: ChatSidebarProps) {
  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed left-0 top-0 z-50 h-full w-72 border-r border-border bg-gradient-sidebar backdrop-blur-xl lg:static lg:translate-x-0"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <Files className="h-5 w-5 text-sidebar-foreground" />
              <h2 className="text-sm font-semibold text-sidebar-foreground">
                Knowledge Base
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 lg:hidden hover:bg-sidebar-accent"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Upload Zone */}
          <div className="p-4">
            <DropZone
              onFileDrop={onFileDrop}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>

          {/* Documents List */}
          <div className="flex-1 overflow-hidden px-4 pb-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Documents ({documents.length})
            </p>
            <ScrollArea className="h-full">
              <AnimatePresence mode="popLayout">
                {documents.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-muted-foreground text-center py-8"
                  >
                    No documents uploaded yet
                  </motion.p>
                ) : (
                  <div className="space-y-2 pr-3">
                    {documents.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onDelete={onDeleteDocument}
                        isDeleting={deletingId === doc.id}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
