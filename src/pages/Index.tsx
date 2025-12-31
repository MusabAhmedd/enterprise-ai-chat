import { useState, useCallback } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatArea } from '@/components/chat/ChatArea';
import { InputComposer } from '@/components/chat/InputComposer';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    messages,
    documents,
    isStreaming,
    isUploading,
    uploadProgress,
    deletingId,
    sendMessage,
    handleFileDrop,
    handleDeleteDocument,
  } = useChat();

  const handleSuggestionClick = useCallback((suggestion: string) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  const handleFileClick = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-page bg-noise">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        documents={documents}
        onFileDrop={handleFileDrop}
        onDeleteDocument={handleDeleteDocument}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        deletingId={deletingId}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <ChatHeader
          onMenuClick={() => setSidebarOpen(true)}
          documentCount={documents.length}
        />

        <ChatArea
          messages={messages}
          isStreaming={isStreaming}
          onSuggestionClick={handleSuggestionClick}
        />

        <InputComposer
          onSend={sendMessage}
          onFileClick={handleFileClick}
          isLoading={isStreaming}
        />
      </div>
    </div>
  );
};

export default Index;
