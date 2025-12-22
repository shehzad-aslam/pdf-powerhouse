import { useState } from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import FileList from '@/components/FileList';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { imagesToPdf, downloadBlob } from '@/lib/pdf-utils';

const ImageToPdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    toast.success(`Added ${acceptedFiles.length} image(s)`);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setProcessing(true);
    try {
      const pdfBytes = await imagesToPdf(files);
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      downloadBlob(blob, 'images_to_pdf.pdf');
      toast.success('Images converted to PDF successfully!');
    } catch (error) {
      toast.error('Failed to convert images');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert your images to a PDF document"
      color="convert"
    >
      {processing && <ProcessingOverlay message="Converting images to PDF..." />}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FileDropzone
            onFilesAccepted={handleFilesAccepted}
            accept={{
              'image/png': ['.png'],
              'image/jpeg': ['.jpg', '.jpeg'],
            }}
            multiple={true}
            maxFiles={50}
            label="Drop images here"
            description="JPG, PNG files supported"
          />

          {files.length > 0 && (
            <button
              onClick={handleConvert}
              className="btn-primary w-full py-4 text-lg"
            >
              <Download className="w-5 h-5" />
              Convert to PDF
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Images ({files.length})</h3>
          <p className="text-sm text-muted-foreground">
            Each image will become a page in the PDF
          </p>
          <FileList files={files} onRemove={handleRemove} showReorder />
        </div>
      </div>
    </ToolLayout>
  );
};

export default ImageToPdf;
