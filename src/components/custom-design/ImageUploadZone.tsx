import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadZoneProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxFiles?: number;
}

const ImageUploadZone = ({ images, onChange, maxFiles = 5 }: ImageUploadZoneProps) => {
  const [dragOver, setDragOver] = useState(false);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      const remaining = maxFiles - images.length;
      if (remaining <= 0) return;

      const toAdd = list.slice(0, remaining).map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
      }));

      onChange([...images, ...toAdd]);
    },
    [images, maxFiles, onChange],
  );

  const removeImage = (id: string) => {
    const img = images.find((i) => i.id === id);
    if (img) URL.revokeObjectURL(img.preview);
    onChange(images.filter((i) => i.id !== id));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        animate={{
          borderColor: dragOver ? "rgba(126, 30, 30, 0.5)" : "rgba(126, 30, 30, 0.2)",
          scale: dragOver ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-colors",
          dragOver
            ? "bg-[#7E1E1E]/8 border-[#7E1E1E]/40"
            : "bg-gradient-to-br from-[#FFFCFA] to-[#F3EDE8]/80 border-[#7E1E1E]/20",
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
          disabled={images.length >= maxFiles}
        />
        <motion.div
          animate={{ y: dragOver ? -4 : 0 }}
          className="flex flex-col items-center pointer-events-none"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#7E1E1E]/10 flex items-center justify-center mb-4">
            {dragOver ? (
              <Upload className="w-8 h-8 text-[#7E1E1E]" />
            ) : (
              <ImagePlus className="w-8 h-8 text-[#7E1E1E]/60" />
            )}
          </div>
          <p className="font-body font-semibold text-[#4A2511] mb-1">
            Drag & drop your design here
          </p>
          <p className="text-sm text-[#7E1E1E]/50 font-body">
            or click to browse · PNG, JPG up to 5MB · max {maxFiles} files
          </p>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {images.map((img) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group aspect-square rounded-xl overflow-hidden border border-[#7E1E1E]/15 bg-[#F3EDE8]"
              >
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#2a1810]/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#7E1E1E]"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploadZone;
