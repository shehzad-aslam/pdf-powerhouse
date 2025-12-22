import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Header from './Header';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  color?: 'edit' | 'convert' | 'organize' | 'security' | 'annotate' | 'signature';
}

const ToolLayout = ({ title, description, children, color = 'edit' }: ToolLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tools</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {title}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </motion.div>
        
        {children}
      </main>
    </div>
  );
};

export default ToolLayout;
