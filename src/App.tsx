import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MergePdf from "./pages/MergePdf";
import SplitPdf from "./pages/SplitPdf";
import CompressPdf from "./pages/CompressPdf";
import ImageToPdf from "./pages/ImageToPdf";
import PdfToImage from "./pages/PdfToImage";
import AddText from "./pages/AddText";
import AddImage from "./pages/AddImage";
import Signature from "./pages/Signature";
import LockPdf from "./pages/LockPdf";
import UnlockPdf from "./pages/UnlockPdf";
import EditPdf from "./pages/EditPdf";
import AnnotatePdf from "./pages/AnnotatePdf";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/merge" element={<MergePdf />} />
          <Route path="/split" element={<SplitPdf />} />
          <Route path="/compress" element={<CompressPdf />} />
          <Route path="/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/pdf-to-image" element={<PdfToImage />} />
          <Route path="/add-text" element={<AddText />} />
          <Route path="/add-image" element={<AddImage />} />
          <Route path="/signature" element={<Signature />} />
          <Route path="/lock" element={<LockPdf />} />
          <Route path="/unlock" element={<UnlockPdf />} />
          <Route path="/edit" element={<EditPdf />} />
          <Route path="/annotate" element={<AnnotatePdf />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
