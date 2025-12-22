import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Edit3 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import PdfPreview from '@/components/PdfPreview';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { getPdfPageCount, downloadBlob, addTextToPdf, addImageToPdf } from '@/lib/pdf-utils';

type EditMode = 'text' | 'image' | 'draw';

const EditPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>('text');
  
  // Text settings
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#000000');

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

  const handlePageClick = async (x: number, y: number) => {
    if (!file) return;
    
    if (editMode === 'text') {
      if (!text.trim()) {
        toast.error('Please enter text first');
        return;
      }
      
      setProcessing(true);
      try {
        const color = {
          r: parseInt(textColor.slice(1, 3), 16),
          g: parseInt(textColor.slice(3, 5), 16),
          b: parseInt(textColor.slice(5, 7), 16),
        };
        
        const pdfBytes = await addTextToPdf(file, text, currentPage, x, y, fontSize, color);
        const newFile = new File([new Uint8Array(pdfBytes)], file.name, { type: 'application/pdf' });
        setFile(newFile);
        setText('');
        toast.success('Text added!');
      } catch (error) {
        toast.error('Failed to add text');
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleDownload = () => {
    if (!file) return;
    
    file.arrayBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      downloadBlob(blob, `edited_${file.name}`);
      toast.success('PDF downloaded!');
    });
  };

  return (
    <ToolLayout
      title="Edit PDF"
      description="Add text, images, and shapes to your PDF"
      color="edit"
    >
      {processing && <ProcessingOverlay message="Editing your PDF..." />}

      {!file ? (
        <FileDropzone
          onFilesAccepted={handleFileAccepted}
          label="Drop your PDF here"
          description="Edit your PDF directly in the browser"
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
            {/* Mode Selector */}
            <div className="glass rounded-2xl p-4">
              <div className="grid grid-cols-3 gap-2">
                {(['text', 'image', 'draw'] as EditMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setEditMode(mode)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                      editMode === mode
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Tools */}
            {editMode === 'text' && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-primary" />
                  Text Tool
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Text Content</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text to add..."
                      className="input-field min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Size</label>
                      <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        min={8}
                        max={72}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Color</label>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full h-[46px] rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Enter text, then click on PDF to place it.
                  </p>
                </div>
              </div>
            )}

            {/* Image Tools */}
            {editMode === 'image' && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Image Tool</h3>
                <p className="text-sm text-muted-foreground">
                  Use the "Add Image" tool for a better experience with image placement.
                </p>
              </div>
            )}

            {/* Draw Tools */}
            {editMode === 'draw' && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Draw Tool</h3>
                <p className="text-sm text-muted-foreground">
                  Drawing tools coming soon! Use "Add Signature" for freehand drawing.
                </p>
              </div>
            )}

            <button onClick={handleDownload} className="btn-primary w-full py-4 text-lg">
              <Download className="w-5 h-5" />
              Download Edited PDF
            </button>

            <button
              onClick={() => setFile(null)}
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

export default EditPdf;
