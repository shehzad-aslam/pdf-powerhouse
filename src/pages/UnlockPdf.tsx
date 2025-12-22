import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Unlock as UnlockIcon } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { downloadBlob, loadPdfFromFile } from '@/lib/pdf-utils';
import { PDFDocument } from 'pdf-lib';

const UnlockPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFileAccepted = (files: File[]) => {
    setFile(files[0]);
  };

  const handleUnlock = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await loadPdfFromFile(file);
      const pdf = await PDFDocument.load(arrayBuffer, { password } as any);
      const pdfBytes = await pdf.save();
      
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      downloadBlob(blob, `unlocked_${file.name}`);
      toast.success('PDF unlocked successfully!');
    } catch (error: any) {
      if (error.message?.includes('password')) {
        toast.error('Incorrect password');
      } else {
        toast.error('Failed to unlock PDF');
      }
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Unlock PDF"
      description="Remove password protection from your PDF"
      color="security"
    >
      {processing && <ProcessingOverlay message="Unlocking your PDF..." />}

      {!file ? (
        <FileDropzone
          onFilesAccepted={handleFileAccepted}
          label="Drop your protected PDF here"
          description="Select the PDF you want to unlock"
        />
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-tool-security/10 p-4 rounded-xl">
                <UnlockIcon className="w-8 h-8 text-tool-security" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">Enter password to unlock</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">PDF Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter the PDF password"
                className="input-field"
              />
            </div>
          </div>

          <button
            onClick={handleUnlock}
            className="btn-primary w-full py-4 text-lg"
          >
            <Download className="w-5 h-5" />
            Unlock PDF
          </button>

          <button
            onClick={() => {
              setFile(null);
              setPassword('');
            }}
            className="btn-secondary w-full"
          >
            Choose Different File
          </button>
        </div>
      )}
    </ToolLayout>
  );
};

export default UnlockPdf;
