import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Image, X, AlertCircle } from 'lucide-react';

const ACCEPTED_TYPES = {
  'application/pdf': { label: 'PDF', icon: FileText },
  'image/jpeg': { label: 'JPG', icon: Image },
  'image/png': { label: 'PNG', icon: Image },
};

const MAX_SIZE = 5 * 1024 * 1024; 

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUploader({ id, label, value, onChange, error: externalError, className = '' }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const validate = useCallback((file) => {
    if (!ACCEPTED_TYPES[file.type]) {
      setError('Format file tidak didukung. Gunakan PDF, JPG, atau PNG.');
      return false;
    }
    if (file.size > MAX_SIZE) {
      setError(`Ukuran file terlalu besar. Maksimum 5MB (file Anda: ${formatSize(file.size)}).`);
      return false;
    }
    setError('');
    return true;
  }, []);

  const handleFile = useCallback((file) => {
    if (validate(file)) {
      onChange(file);
    }
  }, [validate, onChange]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback((e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const removeFile = useCallback(() => {
    onChange(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }, [onChange]);

  const displayError = externalError || error;
  const typeInfo = value ? ACCEPTED_TYPES[value.type] : null;
  const FileIcon = typeInfo?.icon || FileText;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground/80">
          {label}
        </label>
      )}

      {!value ? (
        
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative group cursor-pointer rounded-xl border-2 border-dashed
            transition-all duration-300 ease-out
            ${dragActive
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : displayError
                ? 'border-red-300 bg-red-50/50 hover:border-red-400'
                : 'border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/[0.03]'
            }
          `}
        >
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-3
                transition-all duration-300
                ${dragActive
                  ? 'bg-primary/15 text-primary scale-110'
                  : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }
              `}
            >
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-foreground/70 mb-1">
              {dragActive ? 'Lepas file di sini...' : 'Seret & lepas file, atau klik untuk memilih'}
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, JPG, PNG • Maks. 5MB
            </p>
          </div>
          <input
            ref={inputRef}
            id={id}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      ) : (
        
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-primary/20 bg-primary/[0.03]">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <FileIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {typeInfo?.label} • {formatSize(value.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            aria-label="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
