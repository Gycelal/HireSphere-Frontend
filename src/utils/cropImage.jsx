import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";

// ── Canvas helper ─────────────────────────────────────────────────────────────
// Draws the cropped region onto a canvas and returns a data URL.
export async function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

// ── CropModal ─────────────────────────────────────────────────────────────────
// Props:
//   imageSrc  – data URL or object URL of the raw selected image
//   onApply   – called with the cropped data URL when user clicks "Apply"
//   onCancel  – called when user cancels without applying
export default function CropModal({ imageSrc, onApply, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [applying, setApplying] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setApplying(true);
    try {
      const croppedDataUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      onApply(croppedDataUrl);
    } catch (err) {
      console.error("Crop failed:", err);
    } finally {
      setApplying(false);
    }
  };

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      {/* ── Modal card ── */}
      <div className="relative w-full max-w-md sm:max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/60 border border-gray-200 dark:border-gray-700/60 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 dark:border-gray-700/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[1rem] text-violet-500 dark:text-violet-400">crop</span>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Adjust Photo</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="w-7 h-7 flex items-center justify-center rounded-lg
              text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[1rem]">close</span>
          </button>
        </div>

        {/* Cropper area — fixed height so the card stays compact */}
        <div className="relative h-64 sm:h-80 bg-gray-100 dark:bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="px-5 py-4 flex flex-col gap-4 shrink-0">

          {/* Zoom slider */}
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[1rem] text-gray-500 dark:text-gray-400">zoom_out</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-violet-500 bg-gray-200 dark:bg-gray-700"
            />
            <span className="material-symbols-outlined text-[1rem] text-gray-500 dark:text-gray-400">zoom_in</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Hint */}
          <p className="text-xs text-gray-500 text-center -mt-1">
            Drag to reposition · scroll or slide to zoom
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl text-sm font-semibold
                text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 
                hover:bg-gray-200 dark:hover:bg-gray-700
                border border-gray-200 dark:border-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={applying}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white
                bg-violet-600 hover:bg-violet-700 active:bg-violet-800
                disabled:opacity-60 disabled:cursor-not-allowed
                shadow-md shadow-violet-200 dark:shadow-violet-900/40 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[1rem]">
                {applying ? "autorenew" : "check"}
              </span>
              {applying ? "Applying…" : "Apply Crop"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}