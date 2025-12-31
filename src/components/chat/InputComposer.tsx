import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface InputComposerProps {
  onSend: (message: string) => void;
  onFileClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function InputComposer({ onSend, onFileClick, isLoading, disabled }: InputComposerProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    
    onSend(trimmed);
    setValue('');
    textareaRef.current?.focus();
  }, [value, onSend, isLoading, disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background via-background to-transparent pb-6 pt-8 lg:left-72"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-composer">
          {/* Attach button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl hover:bg-muted"
                onClick={onFileClick}
              >
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach files</p>
            </TooltipContent>
          </Tooltip>

          {/* Textarea */}
          <TextareaAutosize
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your documents..."
            minRows={1}
            maxRows={5}
            className={cn(
              "flex-1 resize-none bg-transparent px-2 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none",
              "scrollbar-thin"
            )}
            disabled={disabled}
          />

          {/* Send button */}
          <motion.div
            animate={{ scale: canSend ? 1 : 0.9, opacity: canSend ? 1 : 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              size="icon"
              className={cn(
                "h-10 w-10 shrink-0 rounded-xl transition-all duration-200",
                canSend 
                  ? "bg-dropzone hover:bg-dropzone/90 text-chat-user-foreground" 
                  : "bg-muted text-muted-foreground"
              )}
              onClick={handleSend}
              disabled={!canSend}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to send, <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Shift + Enter</kbd> for new line
        </p>
      </div>
    </motion.div>
  );
}
