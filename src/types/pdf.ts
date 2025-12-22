export interface PDFFile {
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  dataUrl?: string;
}

export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: 'edit' | 'convert' | 'organize' | 'security' | 'annotate' | 'signature';
  path: string;
}

export interface SignatureData {
  dataUrl: string;
  width: number;
  height: number;
}

export interface Annotation {
  id: string;
  type: 'text' | 'highlight' | 'underline' | 'strikethrough' | 'rectangle' | 'circle';
  page: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  color: string;
}
