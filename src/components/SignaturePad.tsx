import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import SignatureCanvas from 'react-signature-canvas';
import { Trash2, Check, Undo } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel: () => void;
}

const SignaturePad = ({ onSave, onCancel }: SignaturePadProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [penColor, setPenColor] = useState('#000000');

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      return;
    }
    const dataUrl = sigCanvas.current?.toDataURL('image/png');
    if (dataUrl) {
      onSave(dataUrl);
    }
  };

  const colors = ['#000000', '#1a1a2e', '#0066cc', '#cc0000', '#006600'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Draw Your Signature</h3>
      
      {/* Color picker */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-muted-foreground">Pen Color:</span>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setPenColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                penColor === color ? 'border-primary scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      {/* Canvas */}
      <div className="bg-white rounded-xl overflow-hidden mb-4">
        <SignatureCanvas
          ref={sigCanvas}
          penColor={penColor}
          canvasProps={{
            width: 500,
            height: 200,
            className: 'w-full cursor-crosshair',
          }}
        />
      </div>
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={clear}
          className="btn-secondary"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
        
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button onClick={save} className="btn-primary">
            <Check className="w-4 h-4" />
            Apply Signature
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SignaturePad;
