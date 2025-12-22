import { useState } from 'react';
import { toast } from 'sonner';
import { Download, ImageIcon } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import PdfPreview from '@/components/PdfPreview';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { addImageToPdf, downloadBlob, getPdfPageCount } from '@/lib/pdf-utils';

const AddImage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 200, height: 200 });
  const [step, setStep] = useState<'pdf' | 'image' | 'place'>('pdf');

  const handlePdfAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
    try {
      const count = await getPdfPageCount(selectedFile);
      setPageCount(count);
      setStep('image');
      toast.success(`Loaded PDF with ${count} pages`);
    } catch (error) {
      toast.error('Failed to load PDF');
    }
  };

  const handleImageAccepted = (files: File[]) => {
    setImageFile(files[0]);
    setStep('place');
    toast.success('Image loaded! Click on PDF to place it.');
  };

  const handlePageClick = async (x: number, y: number) => {
    if (!file || !imageFile) return;

    setProcessing(true);
    try {
      const pdfBytes = await addImageToPdf(
        file,
        imageFile,
        currentPage,
        x,
        y,
        imageSize.width,
        imageSize.height
      );
      
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      downloadBlob(blob, `with_image_${file.name}`);
      toast.success('Image added successfully!');
    } catch (error) {
      toast.error('Failed to add image');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Add Image"
      description="Insert images into your PDF document"
      color="edit"
    >
      {processing && <ProcessingOverlay message="Adding image to PDF..." />}

      {step === 'pdf' && (
        <FileDropzone
          onFilesAccepted={handlePdfAccepted}
          label="Drop your PDF here"
          description="First, select the PDF you want to edit"
        />
      )}

      {step === 'image' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <FileDropzone
            onFilesAccepted={handleImageAccepted}
            accept={{
              'image/png': ['.png'],
              'image/jpeg': ['.jpg', '.jpeg'],
            }}
            label="Drop your image here"
            description="Select the image to add to your PDF"
          />
          <button
            onClick={() => setStep('pdf')}
            className="btn-secondary w-full"
          >
            Choose Different PDF
          </button>
        </div>
      )}

      {step === 'place' && file && (
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
                <ImageIcon className="w-5 h-5 text-primary" />
                Image Settings
              </h3>

              {imageFile && (
                <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium truncate">{imageFile.name}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={imageSize.width}
                    onChange={(e) =>
                      setImageSize((prev) => ({ ...prev, width: Number(e.target.value) }))
                    }
                    min={50}
                    max={800}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={imageSize.height}
                    onChange={(e) =>
                      setImageSize((prev) => ({ ...prev, height: Number(e.target.value) }))
                    }
                    min={50}
                    max={800}
                    className="input-field"
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Click on the PDF where you want to place the image.
              </p>
            </div>

            <button
              onClick={() => setStep('image')}
              className="btn-secondary w-full"
            >
              Choose Different Image
            </button>

            <button
              onClick={() => {
                setFile(null);
                setImageFile(null);
                setStep('pdf');
              }}
              className="btn-secondary w-full"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
};

export default AddImage;
