import React, { useRef } from 'react';
import { LoadedFile } from '../../types/tree';

interface FileManagerProps {
  files: LoadedFile[];
  selectedFileId: string;
  isDragging: boolean;
  error: string | null;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  setSelectedFileId: (id: string) => void;
  setError: (err: string | null) => void;
  deleteFile: (id: string, e: React.MouseEvent) => void;
}

export default function FileManager({
  files,
  selectedFileId,
  isDragging,
  error,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  setSelectedFileId,
  setError,
  deleteFile,
}: FileManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Uploader Section */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-transparent">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-3">
          LOAD PRELUDE JSON
        </div>

        {/* Drop Zone Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileClick}
          className={`border border-dashed p-6 text-center cursor-pointer transition-all rounded-none flex flex-col justify-center items-center min-h-[120px] ${
            isDragging
              ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-white"
              : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#0c0c0e] hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          <span className="text-sm font-bold uppercase tracking-wider mb-2">
            Drag & Drop JSON File
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            Or click to browse system
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Performance Tip */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-[#0a1526] border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs leading-relaxed rounded-none font-sans">
          <span className="font-bold mr-1">TIP:</span>
          If your JSON tree is very large, consider reducing the maximum <b>Tree Depth</b> in the Tools tab to prevent long rendering times.
        </div>

        {/* Visual Validation Error Alert */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-sm break-all leading-relaxed rounded-none font-sans font-medium">
            <div className="font-bold tracking-wide uppercase mb-1.5 text-red-500 dark:text-red-400">[!] FILE FORMAT ERROR</div>
            <div>{error}</div>
          </div>
        )}
      </div>

      {/* Files List / Switcher */}
      <div className="p-5 flex-1 overflow-y-auto bg-white dark:bg-transparent">
        <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mb-3">
          ACTIVE TREES ({files.length})
        </div>
        <div className="flex flex-col gap-1.5 pr-1">
          {files.length === 0 ? (
            <div className="text-sm text-zinc-400 dark:text-zinc-500 italic py-2">
              No trees loaded. Drop a JSON file above.
            </div>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  setSelectedFileId(file.id);
                  setError(null);
                }}
                className={`flex items-center justify-between border p-3 cursor-pointer transition-all rounded-none ${
                  selectedFileId === file.id
                    ? "border-orange-500/50 bg-orange-50 dark:bg-[#1a0f0a] text-orange-700 dark:text-orange-100 font-bold"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <span className="text-sm truncate font-mono select-none pr-2 font-medium">
                  {file.name}
                </span>
                <button
                  onClick={(e) => deleteFile(file.id, e)}
                  title="Unload tree"
                  className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 px-2 py-1 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent hover:border-red-200 dark:hover:border-red-900/60 rounded-none transition-all font-sans"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
