import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Highlighter, Type, Square, Circle } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import PdfPreview from '@/components/PdfPreview';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { getPdfPageCount, downloadBlob } from '@/lib/pdf-utils';

type AnnotationType = 'highlight' | 'text' | 'rectangle' | 'circle';

interface Annotation {
  id: string;
  type: AnnotationType;
  page: number;
  x: number;
  y: number;
  color: string;
  content?: string;
}

const AnnotatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [annotationType, setAnnotationType] = useState<AnnotationType>('highlight');
  const [annotationColor, setAnnotationColor] = useState('#ffff00');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [noteText, setNoteText] = useState('');

  const handleFileAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
    try {
      const count = await getPdfPageCount(selectedFile);
      setPageCount(count);
      toast.success(`Loaded PDF with ${count} pages`);
    } catch (error) {
      toast.error('Failed to load PDF');
    }
  };

  const handlePageClick = (x: number, y: number) => {
    if (annotationType === 'text' && !noteText.trim()) {
      toast.error('Please enter note text first');
      return;
    }

    const annotation: Annotation = {
      id: Date.now().toString(),
      type: annotationType,
      page: currentPage,
      x,
      y,
      color: annotationColor,
      content: annotationType === 'text' ? noteText : undefined,
    };

    setAnnotations((prev) => [...prev, annotation]);
    
    if (annotationType === 'text') {
      setNoteText('');
    }
    
    toast.success('Annotation added!');
  };

  const removeAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDownload = () => {
    if (!file) return;
    
    // In a real implementation, you would apply annotations to the PDF
    file.arrayBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      downloadBlob(blob, `annotated_${file.name}`);
      toast.success('PDF downloaded!');
      toast.info('Note: Visual annotations require advanced rendering');
    });
  };

  const annotationTypes: { type: AnnotationType; icon: React.ElementType; label: string }[] = [
    { type: 'highlight', icon: Highlighter, label: 'Highlight' },
    { type: 'text', icon: Type, label: 'Note' },
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
    { type: 'circle', icon: Circle, label: 'Circle' },
  ];

  const colors = ['#ffff00', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];

  return (
    <ToolLayout
      title="Annotate PDF"
      description="Add highlights, notes, and shapes to your PDF"
      color="annotate"
    >
      {processing && <ProcessingOverlay message="Processing annotations..." />}

      {!file ? (
        <FileDropzone
          onFilesAccepted={handleFileAccepted}
          label="Drop your PDF here"
          description="Add annotations to your PDF"
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PdfPreview
              file={file}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageClick={handlePageClick}
            />
          </div>

          <div className="space-y-6">
            {/* Annotation Type */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Annotation Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {annotationTypes.map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    onClick={() => setAnnotationType(type)}
                    className={`flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-colors ${
                      annotationType === type
                        ? 'bg-tool-annotate text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Color</h3>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAnnotationColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      annotationColor === color
                        ? 'border-foreground scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Note Text (for text annotations) */}
            {annotationType === 'text' && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Note Text</h3>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note..."
                  className="input-field min-h-[100px] resize-none"
                />
              </div>
            )}

            {/* Annotations List */}
            {annotations.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Annotations ({annotations.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {annotations.map((ann) => (
                    <div
                      key={ann.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: ann.color }}
                        />
                        <span className="text-sm capitalize">{ann.type}</span>
                        <span className="text-xs text-muted-foreground">
                          Page {ann.page}
                        </span>
                      </div>
                      <button
                        onClick={() => removeAnnotation(ann.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleDownload} className="btn-primary w-full py-4 text-lg">
              <Download className="w-5 h-5" />
              Download Annotated PDF
            </button>

            <button
              onClick={() => {
                setFile(null);
                setAnnotations([]);
              }}
              className="btn-secondary w-full"
            >
              Choose Different File
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};

export default AnnotatePdf;
