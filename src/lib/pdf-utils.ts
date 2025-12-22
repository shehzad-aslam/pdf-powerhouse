import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export const loadPdfFromFile = async (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await loadPdfFromFile(file);
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }
  
  return mergedPdf.save();
};

export const splitPdf = async (file: File, ranges: { start: number; end: number }[]): Promise<Uint8Array[]> => {
  const arrayBuffer = await loadPdfFromFile(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const results: Uint8Array[] = [];
  
  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const pageIndices = [];
    for (let i = range.start - 1; i < range.end && i < pdf.getPageCount(); i++) {
      pageIndices.push(i);
    }
    const pages = await newPdf.copyPages(pdf, pageIndices);
    pages.forEach(page => newPdf.addPage(page));
    results.push(await newPdf.save());
  }
  
  return results;
};

export const compressPdf = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await loadPdfFromFile(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // Remove metadata to reduce size
  pdf.setTitle('');
  pdf.setAuthor('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setProducer('');
  pdf.setCreator('');
  
  return pdf.save({ 
    useObjectStreams: true,
    addDefaultPage: false,
  });
};

export const addTextToPdf = async (
  file: File, 
  text: string, 
  pageNum: number, 
  x: number, 
  y: number,
  fontSize: number = 16,
  color: { r: number; g: number; b: number } = { r: 0, g: 0, b: 0 }
): Promise<Uint8Array> => {
  const arrayBuffer = await loadPdfFromFile(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const page = pages[pageNum - 1];
  
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  
  page.drawText(text, {
    x,
    y: page.getHeight() - y,
    size: fontSize,
    font,
    color: rgb(color.r / 255, color.g / 255, color.b / 255),
  });
  
  return pdf.save();
};

export const addImageToPdf = async (
  file: File,
  imageFile: File,
  pageNum: number,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Uint8Array> => {
  const arrayBuffer = await loadPdfFromFile(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const page = pages[pageNum - 1];
  
  const imageBuffer = await loadPdfFromFile(imageFile);
  let image;
  
  if (imageFile.type === 'image/png') {
    image = await pdf.embedPng(imageBuffer);
  } else {
    image = await pdf.embedJpg(imageBuffer);
  }
  
  page.drawImage(image, {
    x,
    y: page.getHeight() - y - height,
    width,
    height,
  });
  
  return pdf.save();
};

export const addSignatureToPdf = async (
  file: File,
  signatureDataUrl: string,
  pageNum: number,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Uint8Array> => {
  const arrayBuffer = await loadPdfFromFile(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const page = pages[pageNum - 1];
  
  // Convert data URL to bytes
  const base64 = signatureDataUrl.split(',')[1];
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  
  const image = await pdf.embedPng(bytes);
  
  page.drawImage(image, {
    x,
    y: page.getHeight() - y - height,
    width,
    height,
  });
  
  return pdf.save();
};

export const lockPdf = async (file: File, password: string): Promise<Uint8Array> => {
  const arrayBuffer = await loadPdfFromFile(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // Note: pdf-lib doesn't support encryption directly
  // This is a placeholder - in production, you'd use a library like pdf-lib-crypto
  return pdf.save();
};

export const imagesToPdf = async (images: File[]): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create();
  
  for (const imageFile of images) {
    const imageBuffer = await loadPdfFromFile(imageFile);
    let image;
    
    if (imageFile.type === 'image/png') {
      image = await pdf.embedPng(imageBuffer);
    } else {
      image = await pdf.embedJpg(imageBuffer);
    }
    
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  
  return pdf.save();
};

export const getPdfPageCount = async (file: File): Promise<number> => {
  const arrayBuffer = await loadPdfFromFile(file);
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf.getPageCount();
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
