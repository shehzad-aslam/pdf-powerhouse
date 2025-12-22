import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Plus, Trash2 } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import PdfPreview from '@/components/PdfPreview';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { splitPdf, downloadBlob, getPdfPageCount } from '@/lib/pdf-utils';
import JSZip from 'jszip';

interface SplitRange {
  id: string;
  start: number;
  end: number;
}

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState<SplitRange[]>([{ id: '1', start: 1, end: 1 }]);
  const [processing, setProcessing] = useState(false);

  const handleFileAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
    try {
      const count = await getPdfPageCount(selectedFile);
      setPageCount(count);
      setRanges([{ id: '1', start: 1, end: count }]);
      toast.success(`Loaded PDF with ${count} pages`);
    } catch (error) {
      toast.error('Failed to load PDF');
    }
  };

  const addRange = () => {
    setRanges((prev) => [
      ...prev,
      { id: Date.now().toString(), start: 1, end: pageCount },
    ]);
  };

  const removeRange = (id: string) => {
    setRanges((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRange = (id: string, field: 'start' | 'end', value: number) => {
    setRanges((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSplit = async () => {
    if (!file) return;

    const validRanges = ranges.filter(
      (r) => r.start >= 1 && r.end <= pageCount && r.start <= r.end
    );

    if (validRanges.length === 0) {
      toast.error('Please specify valid page ranges');
      return;
    }

    setProcessing(true);
    try {
      const splitPdfs = await splitPdf(file, validRanges);
      
      if (splitPdfs.length === 1) {
        const blob = new Blob([new Uint8Array(splitPdfs[0])], { type: 'application/pdf' });
        downloadBlob(blob, `split_${validRanges[0].start}-${validRanges[0].end}.pdf`);
      } else {
        const zip = new JSZip();
        splitPdfs.forEach((pdfBytes, index) => {
          const range = validRanges[index];
          zip.file(`pages_${range.start}-${range.end}.pdf`, pdfBytes);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, 'split_pdfs.zip');
      }
      
      toast.success('PDF split successfully!');
    } catch (error) {
      toast.error('Failed to split PDF');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract pages or split your PDF into multiple documents"
      color="organize"
    >
      {processing && <ProcessingOverlay message="Splitting your PDF..." />}

      {!file ? (
        <FileDropzone
          onFilesAccepted={handleFileAccepted}
          label="Drop your PDF here"
          description="Select the PDF you want to split"
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <PdfPreview file={file} />

          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Page Ranges</h3>
                <span className="text-sm text-muted-foreground">
                  Total: {pageCount} pages
                </span>
              </div>

              <div className="space-y-4">
                {ranges.map((range, index) => (
                  <div
                    key={range.id}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl"
                  >
                    <span className="text-sm text-muted-foreground w-20">
                      Range {index + 1}
                    </span>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={range.start}
                        onChange={(e) =>
                          updateRange(range.id, 'start', parseInt(e.target.value) || 1)
                        }
                        className="input-field w-20 text-center"
                      />
                      <span className="text-muted-foreground">to</span>
                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={range.end}
                        onChange={(e) =>
                          updateRange(range.id, 'end', parseInt(e.target.value) || 1)
                        }
                        className="input-field w-20 text-center"
                      />
                    </div>
                    {ranges.length > 1 && (
                      <button
                        onClick={() => removeRange(range.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addRange}
                className="btn-secondary w-full mt-4"
              >
                <Plus className="w-4 h-4" />
                Add Another Range
              </button>
            </div>

            <button onClick={handleSplit} className="btn-primary w-full py-4 text-lg">
              <Download className="w-5 h-5" />
              Split PDF
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

export default SplitPdf;
