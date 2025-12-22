import { useState } from 'react';
import { toast } from 'sonner';
import { Download, PenTool } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import PdfPreview from '@/components/PdfPreview';
import SignaturePad from '@/components/SignaturePad';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { addSignatureToPdf, downloadBlob, getPdfPageCount } from '@/lib/pdf-utils';

const Signature = () => {
  const [file, setFile] = useState<File | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureSize, setSignatureSize] = useState({ width: 200, height: 80 });
  const [step, setStep] = useState<'pdf' | 'signature' | 'place'>('pdf');

  const handleFileAccepted = async (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    
    try {
      const count = await getPdfPageCount(selectedFile);
      setPageCount(count);
      setStep('signature');
      toast.success(`Loaded PDF with ${count} pages`);
    } catch (error) {
      toast.error('Failed to load PDF');
    }
  };

  const handleSignatureSave = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
    setShowSignaturePad(false);
    setStep('place');
    toast.success('Signature captured! Click on PDF to place it.');
  };

  const handlePageClick = async (x: number, y: number) => {
    if (!file || !signatureDataUrl) return;

    setProcessing(true);
    try {
      const pdfBytes = await addSignatureToPdf(
        file,
        signatureDataUrl,
        currentPage,
        x,
        y,
        signatureSize.width,
        signatureSize.height
      );
      
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      downloadBlob(blob, `signed_${file.name}`);
      toast.success('Signature added successfully!');
    } catch (error) {
      toast.error('Failed to add signature');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Add Signature"
      description="Sign your PDF with an electronic signature"
      color="signature"
    >
      {processing && <ProcessingOverlay message="Adding signature to PDF..." />}

      {step === 'pdf' && (
        <FileDropzone
          onFilesAccepted={handleFileAccepted}
          label="Drop your PDF here"
          description="First, select the PDF you want to sign"
        />
      )}

      {step === 'signature' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {showSignaturePad ? (
            <SignaturePad
              onSave={handleSignatureSave}
              onCancel={() => setShowSignaturePad(false)}
            />
          ) : (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="bg-tool-signature/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-10 h-10 text-tool-signature" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Create Your Signature</h3>
              <p className="text-muted-foreground mb-6">
                Draw your signature or upload an image
              </p>
              
              <button
                onClick={() => setShowSignaturePad(true)}
                className="btn-primary"
              >
                <PenTool className="w-5 h-5" />
                Draw Signature
              </button>
            </div>
          )}
          
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
                <PenTool className="w-5 h-5 text-tool-signature" />
                Your Signature
              </h3>

              {signatureDataUrl && (
                <div className="bg-white rounded-xl p-4 mb-4">
                  <img
                    src={signatureDataUrl}
                    alt="Your signature"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxHeight: '100px' }}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={signatureSize.width}
                    onChange={(e) =>
                      setSignatureSize((prev) => ({ ...prev, width: Number(e.target.value) }))
                    }
                    min={50}
                    max={400}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={signatureSize.height}
                    onChange={(e) =>
                      setSignatureSize((prev) => ({ ...prev, height: Number(e.target.value) }))
                    }
                    min={30}
                    max={200}
                    className="input-field"
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Click on the PDF where you want to place your signature.
              </p>
            </div>

            <button
              onClick={() => {
                setSignatureDataUrl(null);
                setStep('signature');
              }}
              className="btn-secondary w-full"
            >
              Draw New Signature
            </button>

            <button
              onClick={() => {
                setFile(null);
                setSignatureDataUrl(null);
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

export default Signature;
