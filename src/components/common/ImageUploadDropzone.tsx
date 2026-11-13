import React, { useRef, useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Link2,
  Check,
  RefreshCw,
} from "lucide-react";

interface ImageUploadDropzoneProps {
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
  className?: string;
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value,
  onChange,
  label = "ছবি আপলোড করুন",
  helperText = "ডিভাইস থেকে ছবি ফাইল সিলেক্ট করুন বা ড্র্যাগ করে ছাড়ুন (JPG, PNG, WebP)",
  aspectRatio = "4:3",
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  // Compress & convert file to data URL
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("অনুগ্রহ করে একটি সঠিক ছবি ফাইল নির্বাচন করুন (JPEG, PNG, WebP)।");
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDimension = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // PNG/WebP হলে ট্রান্সপারেন্সি ধরে রাখার জন্য PNG-তেই আউটপুট দাও
          const isTransparent =
            file.type === "image/png" || file.type === "image/webp";

          if (!isTransparent) {
            // JPEG হলে সাদা ব্যাকগ্রাউন্ড দাও (কালো হবে না)
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          const compressed = isTransparent
            ? canvas.toDataURL("image/png") // PNG → PNG (ট্রান্সপারেন্সি অক্ষুণ্ণ)
            : canvas.toDataURL("image/jpeg", 0.85); // JPEG → JPEG (সাদা ব্যাকগ্রাউন্ড)

          onChange(compressed);
        } else {
          onChange(e.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-[16/9]";
      case "4:3":
        return "aspect-[4/3]";
      case "1:1":
        return "aspect-square";
      default:
        return "min-h-[160px]";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-800">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            <span>{showUrlInput ? "ফাইল আপলোডে ফিরুন" : "অথবা লিঙ্ক দিন"}</span>
          </button>
        </div>
      )}

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="ছবির সরাসরি লিঙ্ক (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim()) {
                onChange(urlInput.trim());
                setShowUrlInput(false);
                setUrlInput("");
              }
            }}
            className="px-3 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold"
          >
            যোগ করুন
          </button>
        </div>
      ) : null}

      {/* Main Upload / Preview Area */}
      {value ? (
        <div
          className={`relative rounded-2xl overflow-hidden border-2 border-emerald-700/40 bg-stone-100 ${getAspectClass()} group`}
        >
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-stone-900 rounded-lg text-xs font-bold shadow hover:bg-stone-100 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-800" />
              <span>ছবি পরিবর্তন</span>
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow hover:bg-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>মুছে ফেলুন</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${getAspectClass()} ${
            isDragging
              ? "border-emerald-600 bg-emerald-50/60 scale-[1.01]"
              : "border-stone-300 bg-stone-50/70 hover:border-emerald-700/60 hover:bg-emerald-50/30"
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 text-emerald-700 animate-spin" />
              <span className="text-xs font-bold text-stone-700">
                ছবি প্রসেসিং হচ্ছে...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-stone-200 text-emerald-800 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-stone-900">
                ছবি নির্বাচন করতে ক্লিক করুন
              </span>
              <p className="text-[11px] text-stone-500 max-w-xs">
                {helperText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
