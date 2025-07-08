import React, { useRef, useState } from 'react';

interface DndFileInputProps {
  onFile: (file: File) => void;
  accept?: string;
}

const DndFileInput: React.FC<DndFileInputProps> = ({
  onFile,
  accept = 'image/*,video/*',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`flex h-20 w-full cursor-pointer items-center justify-center rounded-md border border-dashed p-4 text-center transition-colors ${
        isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <div className="text-xs text-gray-500 select-none">
        파일을 드래그하거나 클릭해서 업로드
      </div>
    </div>
  );
};

export default DndFileInput;
