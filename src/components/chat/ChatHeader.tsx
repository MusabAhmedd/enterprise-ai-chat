import { motion } from 'framer-motion';
import { Menu, Bot, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  onMenuClick: () => void;
  documentCount: number;
}

export function ChatHeader({ onMenuClick, documentCount }: ChatHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dropzone">
            <Bot className="h-4 w-4 text-chat-user-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              RAG Assistant
            </h1>
            <p className="text-xs text-muted-foreground">
              {documentCount} document{documentCount !== 1 ? 's' : ''} loaded
            </p>
          </div>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Settings className="h-5 w-5 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </motion.header>
  );
}
