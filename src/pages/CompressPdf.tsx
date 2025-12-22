import { useState } from 'react';
import { toast } from 'sonner';
import { Download, FileText } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { compressPdf, downloadBlob, formatFileSize } from '@/lib/pdf-utils';

const CompressPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ originalSize: number; newSize: number } | null>(null);

  const handleFileAccepted = async (files: File[]) => {
    setFile(files[0]);
    setResult(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const compressedPdf = await compressPdf(file);
      const blob = new Blob([new Uint8Array(compressedPdf)], { type: 'application/pdf' });
      
      setResult({
        originalSize: file.size,
        newSize: blob.size,
      });
      
      downloadBlob(blob, `compressed_${file.name}`);
      toast.success('PDF compressed successfully!');
    } catch (error) {
      toast.error('Failed to compress PDF');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const compressionPercent = result
    ? Math.round((1 - result.newSize / result.originalSize) * 100)
    : 0;

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce your PDF file size while maintaining quality"
      color="organize"
    >
      {processing && <ProcessingOverlay message="Compressing your PDF..." />}

      <div className="max-w-2xl mx-auto">
        {!file ? (
          <FileDropzone
            onFilesAccepted={handleFileAccepted}
            label="Drop your PDF here"
            description="Select the PDF you want to compress"
          />
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-4 rounded-xl">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Original size: {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              {result && (
                <div className="bg-muted/30 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Before</p>
                      <p className="text-xl font-bold text-foreground">
                        {formatFileSize(result.originalSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">After</p>
                      <p className="text-xl font-bold text-primary">
                        {formatFileSize(result.newSize)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Saved</p>
                      <p className="text-xl font-bold text-tool-annotate">
                        {compressionPercent}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleCompress} className="btn-primary w-full py-4 text-lg">
                <Download className="w-5 h-5" />
                {result ? 'Compress Again' : 'Compress PDF'}
              </button>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              className="btn-secondary w-full"
            >
              Choose Different File
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default CompressPdf;
