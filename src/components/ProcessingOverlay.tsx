import { motion } from 'framer-motion';

interface ProcessingOverlayProps {
  message?: string;
}

const ProcessingOverlay = ({ message = 'Processing your PDF...' }: ProcessingOverlayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="glass rounded-2xl p-8 flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">{message}</h3>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProcessingOverlay;
