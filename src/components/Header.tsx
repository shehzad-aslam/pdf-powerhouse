import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-strong sticky top-0 z-50 border-b border-border/30"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/50 transition-colors" />
              <div className="relative bg-primary/20 p-2.5 rounded-xl border border-primary/30">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                PDF<span className="text-primary">Pro</span>
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Professional Editor</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tools
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <button className="btn-secondary text-sm py-2 px-4">
              Sign In
            </button>
            <button className="btn-primary text-sm py-2 px-4">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
