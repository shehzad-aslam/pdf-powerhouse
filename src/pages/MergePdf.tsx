import { useState } from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import FileDropzone from '@/components/FileDropzone';
import FileList from '@/components/FileList';
import ProcessingOverlay from '@/components/ProcessingOverlay';
import { mergePdfs, downloadBlob } from '@/lib/pdf-utils';

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    toast.success(`Added ${acceptedFiles.length} file(s)`);
  };

  const handleRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please add at least 2 PDF files to merge');
      return;
    }

    setProcessing(true);
    try {
      const mergedPdf = await mergePdfs(files);
      const blob = new Blob([new Uint8Array(mergedPdf)], { type: 'application/pdf' });
      downloadBlob(blob, 'merged.pdf');
      toast.success('PDFs merged successfully!');
    } catch (error) {
      toast.error('Failed to merge PDFs');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document"
      color="organize"
    >
      {processing && <ProcessingOverlay message="Merging your PDFs..." />}

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FileDropzone
            onFilesAccepted={handleFilesAccepted}
            multiple={true}
            maxFiles={20}
            label="Drop PDF files here"
            description="or click to select multiple files"
          />

          {files.length > 0 && (
            <button
              onClick={handleMerge}
              className="btn-primary w-full py-4 text-lg"
            >
              <Download className="w-5 h-5" />
              Merge {files.length} PDFs
            </button>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
          <p className="text-sm text-muted-foreground">
            Drag files to reorder them. The first file will be at the beginning.
          </p>
          <FileList files={files} onRemove={handleRemove} showReorder />
        </div>
      </div>
    </ToolLayout>
  );
};

export default MergePdf;
