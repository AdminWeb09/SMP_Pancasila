import React from 'react';
import { FileAttachment } from '../types';
import { X, Download, FileText, FileImage, FileCode, ExternalLink } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

interface FileViewerModalProps {
  attachment: FileAttachment;
  onClose: () => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({ attachment, onClose }) => {
  const isImage = attachment.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(attachment.nama);
  const isPdf = attachment.type === 'application/pdf' || attachment.nama.toLowerCase().endsWith('.pdf');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate mr-4">
            {isImage ? (
              <FileImage className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : isPdf ? (
              <FileText className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <FileCode className="w-5 h-5 text-blue-400 shrink-0" />
            )}
            <div className="truncate">
              <h3 className="font-semibold text-sm truncate">{attachment.nama}</h3>
              <p className="text-[11px] text-slate-300">{formatFileSize(attachment.size)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={attachment.url}
              download={attachment.nama}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center min-h-[300px]">
          {isImage ? (
            <img
              src={attachment.url}
              alt={attachment.nama}
              className="max-h-[65vh] object-contain rounded-lg shadow-md border border-slate-200 bg-white"
            />
          ) : isPdf && attachment.url.startsWith('data:application/pdf') ? (
            <object
              data={attachment.url}
              type="application/pdf"
              className="w-full h-[65vh] rounded-lg shadow border border-slate-200"
            >
              <div className="p-8 text-center bg-white rounded-lg shadow text-slate-600">
                <FileText className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                <p className="font-medium text-sm mb-2">Pratinjau PDF siap untuk diunduh</p>
                <a
                  href={attachment.url}
                  download={attachment.nama}
                  className="inline-flex items-center space-x-2 text-xs bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh {attachment.nama}</span>
                </a>
              </div>
            </object>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl shadow-md max-w-md w-full">
              <FileText className="w-16 h-16 mx-auto text-emerald-600 mb-3" />
              <h4 className="font-bold text-slate-800 text-base mb-1">{attachment.nama}</h4>
              <p className="text-xs text-slate-500 mb-4">
                Dokumen ({formatFileSize(attachment.size)}). Klik tombol di bawah untuk membuka/mengunduh file.
              </p>
              <a
                href={attachment.url}
                download={attachment.nama}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center space-x-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka / Unduh Dokumen</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
