import { useState, useCallback, useEffect } from 'react';
import { 
  type Message, 
  type Document, 
  getSessionId, 
  streamChat, 
  uploadDocument,
  deleteDocument,
  getDocuments,
  getFileType
} from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function useChat() {
  const [sessionId] = useState(() => getSessionId());
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load documents on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const docs = await getDocuments(sessionId);
        setDocuments(docs);
      } catch (error) {
        // Backend might not be available, that's ok
        console.log('Could not load documents:', error);
      }
    };
    loadDocuments();
  }, [sessionId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isStreaming) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Create placeholder for assistant message
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsStreaming(true);

    try {
      let fullContent = '';
      for await (const chunk of streamChat(sessionId, content)) {
        fullContent += chunk;
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: fullContent }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id));
    } finally {
      setIsStreaming(false);
    }
  }, [sessionId, isStreaming]);

  const handleFileDrop = useCallback(async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    const totalFiles = files.length;
    let uploaded = 0;

    for (const file of files) {
      try {
        const doc = await uploadDocument(file, sessionId);
        setDocuments((prev) => [...prev, doc]);
        uploaded++;
        setUploadProgress((uploaded / totalFiles) * 100);
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }

    if (uploaded > 0) {
      toast({
        title: "Upload Complete",
        description: `${uploaded} file${uploaded > 1 ? 's' : ''} uploaded successfully`,
      });
    }

    setIsUploading(false);
    setUploadProgress(0);
  }, [sessionId]);

  const handleDeleteDocument = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDocument(id, sessionId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      toast({
        title: "Document Deleted",
        description: "The document has been removed from your knowledge base",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the document",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  }, [sessionId]);

  return {
    sessionId,
    messages,
    documents,
    isStreaming,
    isUploading,
    uploadProgress,
    deletingId,
    sendMessage,
    handleFileDrop,
    handleDeleteDocument,
  };
}
