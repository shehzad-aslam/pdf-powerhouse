import { motion } from 'framer-motion';
import Header from '@/components/Header';
import ToolCard from '@/components/ToolCard';
import { pdfTools } from '@/data/tools';
import { Sparkles, Zap, Shield, Globe } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-hero-pattern pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-tool-convert/5 rounded-full blur-3xl pointer-events-none" />
      
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Professional PDF Tools</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Edit, Convert & Manage
              <br />
              <span className="text-gradient">PDF Files Effortlessly</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The most powerful PDF editor with all the tools you need. 
              Merge, split, compress, convert, add signatures and more — all in your browser.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Editing Now
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary text-lg px-8 py-4"
              >
                View All Tools
              </motion.button>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {[
              { icon: Zap, label: 'Fast Processing', value: '< 5 sec' },
              { icon: Shield, label: 'Secure & Private', value: '100%' },
              { icon: Globe, label: 'Works Offline', value: 'Yes' },
              { icon: Sparkles, label: 'AI-Powered', value: 'Smart' },
            ].map((stat, index) => (
              <div key={stat.label} className="glass rounded-xl p-4 text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>
        
        {/* Tools Grid */}
        <section className="container mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              All PDF Tools You Need
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose from our collection of powerful PDF tools
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pdfTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Choose <span className="text-gradient">PDFPro</span>?
                </h2>
                <ul className="space-y-4">
                  {[
                    'No file size limits for uploads',
                    'All processing happens in your browser',
                    'Your files are never stored on servers',
                    'Works offline after first load',
                    'No registration required',
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-tool-convert/20 blur-3xl rounded-full" />
                <div className="relative bg-secondary/50 rounded-2xl p-8 border border-border/50">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded-full w-3/4" />
                    <div className="h-4 bg-muted rounded-full w-full" />
                    <div className="h-4 bg-muted rounded-full w-2/3" />
                    <div className="h-32 bg-muted/50 rounded-xl mt-6 flex items-center justify-center">
                      <div className="text-4xl">📄</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg">
                PDF<span className="text-primary">Pro</span>
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2024 PDFPro. All rights reserved. Built with ❤️
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
