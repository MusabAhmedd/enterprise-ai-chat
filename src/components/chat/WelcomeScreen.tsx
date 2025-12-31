import { motion } from 'framer-motion';
import { Brain, FileSearch, Lightbulb, MessageSquare } from 'lucide-react';

interface WelcomeScreenProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    icon: FileSearch,
    title: "Summarize documents",
    query: "Can you summarize the key points from my uploaded documents?",
  },
  {
    icon: Brain,
    title: "Find insights",
    query: "What are the main themes and insights across my documents?",
  },
  {
    icon: Lightbulb,
    title: "Ask questions",
    query: "What are the most important takeaways I should know about?",
  },
  {
    icon: MessageSquare,
    title: "Compare content",
    query: "Can you compare and contrast the different viewpoints in my documents?",
  },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-6"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-dropzone to-dropzone/70 shadow-lg"
      >
        <Brain className="h-8 w-8 text-chat-user-foreground" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-3 text-2xl font-semibold tracking-tight text-foreground"
      >
        Welcome to RAG Assistant
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-10 max-w-md text-center text-muted-foreground"
      >
        Upload your documents to the sidebar, then ask questions about their content. 
        I'll help you find insights and answers.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid w-full max-w-2xl gap-3 sm:grid-cols-2"
      >
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:border-dropzone/40 hover:shadow-card-hover"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-dropzone/10">
              <suggestion.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-dropzone" />
            </div>
            <div>
              <p className="font-medium text-foreground">{suggestion.title}</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {suggestion.query}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
