import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Download, Image as ImageIcon } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { getPdfPageCount, downloadBlob } from '@/lib/pdf-utils';
import { pdfjs } from 'react-pdf';
import JSZip from 'jszip';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfToImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(2);

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

  const handleConvert = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      const zip = new JSZip();
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: quality });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        } as any).promise;
        
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => resolve(blob!),
            `image/${format}`,
            format === 'jpeg' ? 0.9 : undefined
          );
        });
        
        zip.file(`page_${i}.${format}`, blob);
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `pdf_images.zip`);
      toast.success('PDF converted to images successfully!');
    } catch (error) {
      toast.error('Failed to convert PDF');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert PDF pages to high-quality images"
      color="convert"
    >
      {processing && <ProcessingOverlay message="Converting PDF to images..." />}

      {!file ? (
        <FileDropzone
          onFilesAccepted={handleFileAccepted}
          label="Drop your PDF here"
          description="Convert each page to an image"
        />
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-tool-convert/10 p-4 rounded-xl">
                <ImageIcon className="w-8 h-8 text-tool-convert" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">{pageCount} pages will be converted</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
                  className="input-field"
                >
                  <option value="png">PNG (Higher Quality)</option>
                  <option value="jpeg">JPEG (Smaller Size)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Quality Scale
                </label>
                <select
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="input-field"
                >
                  <option value={1}>1x (Fast)</option>
                  <option value={2}>2x (Recommended)</option>
                  <option value={3}>3x (High Quality)</option>
                </select>
              </div>
            </div>

            <button onClick={handleConvert} className="btn-primary w-full py-4 text-lg">
              <Download className="w-5 h-5" />
              Convert to Images
            </button>
          </div>

          <button
            onClick={() => setFile(null)}
            className="btn-secondary w-full"
          >
            Choose Different File
          </button>
        </div>
      )}
    </ToolLayout>
  );
};

export default PdfToImage;
