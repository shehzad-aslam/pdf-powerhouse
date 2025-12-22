import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Type } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import PdfPreview from '@/components/PdfPreview';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { addTextToPdf, downloadBlob, getPdfPageCount } from '@/lib/pdf-utils';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  page: number;
  fontSize: number;
  color: string;
}

const AddText = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [newText, setNewText] = useState('');
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

  const handlePageClick = (x: number, y: number) => {
    if (!newText.trim()) {
      toast.error('Please enter text first');
      return;
    }

    const element: TextElement = {
      id: Date.now().toString(),
      text: newText,
      x,
      y,
      page: currentPage,
      fontSize,
      color: textColor,
    };

    setTextElements((prev) => [...prev, element]);
    setNewText('');
    toast.success('Text added! Click on PDF to add more.');
  };

  const removeTextElement = (id: string) => {
    setTextElements((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApply = async () => {
    if (!file || textElements.length === 0) {
      toast.error('Please add at least one text element');
      return;
    }

    setProcessing(true);
    try {
      let currentFile = file;
      
      for (const element of textElements) {
        const color = {
          r: parseInt(element.color.slice(1, 3), 16),
          g: parseInt(element.color.slice(3, 5), 16),
          b: parseInt(element.color.slice(5, 7), 16),
        };
        
        const pdfBytes = await addTextToPdf(
          currentFile,
          element.text,
          element.page,
          element.x,
          element.y,
          element.fontSize,
          color
        );
        
        currentFile = new File([new Uint8Array(pdfBytes)], file.name, { type: 'application/pdf' });
      }
      
      const arrayBuffer = await currentFile.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      downloadBlob(blob, `edited_${file.name}`);
      toast.success('Text added successfully!');
    } catch (error) {
      toast.error('Failed to add text');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Add Text"
      description="Insert text anywhere on your PDF pages"
      color="edit"
    >
      {processing && <ProcessingOverlay message="Adding text to PDF..." />}

      {!file ? (
        <FileDropzone
          onFilesAccepted={handleFileAccepted}
          label="Drop your PDF here"
          description="Click on the PDF to add text"
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
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                Add Text
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Text Content</label>
                  <textarea
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    placeholder="Enter your text here..."
                    className="input-field min-h-[100px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Size</label>
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
                  Enter text above, then click on the PDF where you want to place it.
                </p>
              </div>
            </div>

            {textElements.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Added Text ({textElements.length})</h3>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {textElements.map((element) => (
                    <div
                      key={element.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <span className="text-sm truncate flex-1">{element.text}</span>
                      <button
                        onClick={() => removeTextElement(element.id)}
                        className="text-xs text-destructive hover:underline ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleApply}
              disabled={textElements.length === 0}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>

            <button
              onClick={() => {
                setFile(null);
                setTextElements([]);
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

export default AddText;
