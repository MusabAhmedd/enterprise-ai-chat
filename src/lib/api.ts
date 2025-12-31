const API_BASE = 'http://localhost:8000';

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'txt' | 'md' | 'doc';
  size: number;
  uploadedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  session_id: string;
  message: string;
}

// Get or create session ID
export function getSessionId(): string {
  let sessionId = localStorage.getItem('rag_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('rag_session_id', sessionId);
  }
  return sessionId;
}

// Upload document
export async function uploadDocument(file: File, sessionId: string): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('session_id', sessionId);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to upload document');
  }

  return response.json();
}

// Delete document
export async function deleteDocument(documentId: string, sessionId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/documents/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id: sessionId }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
}

// Get documents
export async function getDocuments(sessionId: string): Promise<Document[]> {
  const response = await fetch(`${API_BASE}/documents?session_id=${sessionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  return response.json();
}

// Stream chat response
export async function* streamChat(
  sessionId: string,
  message: string
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Chat request failed');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    yield chunk;
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Get file type icon
export function getFileType(filename: string): Document['type'] {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'pdf';
    case 'txt':
      return 'txt';
    case 'md':
    case 'markdown':
      return 'md';
    case 'doc':
    case 'docx':
      return 'doc';
    default:
      return 'txt';
  }
}
