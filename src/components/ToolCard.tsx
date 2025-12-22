import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Edit3, Type, Image, PenTool, Highlighter, 
  GitMerge, Scissors, Archive, FileImage, 
  Lock, Unlock, ImageIcon
} from 'lucide-react';
import { ToolConfig } from '@/types/pdf';

const iconMap: Record<string, React.ElementType> = {
  'edit': Edit3,
  'type': Type,
  'image': Image,
  'pen-tool': PenTool,
  'highlighter': Highlighter,
  'git-merge': GitMerge,
  'scissors': Scissors,
  'archive': Archive,
  'file-image': FileImage,
  'lock': Lock,
  'unlock': Unlock,
};

const colorClasses: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  edit: {
    bg: 'bg-tool-edit/10',
    border: 'border-tool-edit/30',
    icon: 'text-tool-edit',
    glow: 'group-hover:shadow-[0_0_40px_-10px_hsl(var(--tool-edit))]',
  },
  convert: {
    bg: 'bg-tool-convert/10',
    border: 'border-tool-convert/30',
    icon: 'text-tool-convert',
    glow: 'group-hover:shadow-[0_0_40px_-10px_hsl(var(--tool-convert))]',
  },
  organize: {
    bg: 'bg-tool-organize/10',
    border: 'border-tool-organize/30',
    icon: 'text-tool-organize',
    glow: 'group-hover:shadow-[0_0_40px_-10px_hsl(var(--tool-organize))]',
  },
  security: {
    bg: 'bg-tool-security/10',
    border: 'border-tool-security/30',
    icon: 'text-tool-security',
    glow: 'group-hover:shadow-[0_0_40px_-10px_hsl(var(--tool-security))]',
  },
  annotate: {
    bg: 'bg-tool-annotate/10',
    border: 'border-tool-annotate/30',
    icon: 'text-tool-annotate',
    glow: 'group-hover:shadow-[0_0_40px_-10px_hsl(var(--tool-annotate))]',
  },
  signature: {
    bg: 'bg-tool-signature/10',
    border: 'border-tool-signature/30',
    icon: 'text-tool-signature',
    glow: 'group-hover:shadow-[0_0_40px_-10px_hsl(var(--tool-signature))]',
  },
};

interface ToolCardProps {
  tool: ToolConfig;
  index: number;
}

const ToolCard = ({ tool, index }: ToolCardProps) => {
  const Icon = iconMap[tool.icon] || Edit3;
  const colors = colorClasses[tool.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={tool.path} className="group block">
        <div className={`tool-card glass border ${colors.border} ${colors.glow} transition-shadow duration-300`}>
          <div className={`${colors.bg} w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
            <Icon className={`w-7 h-7 ${colors.icon}`} />
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tool.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ToolCard;
