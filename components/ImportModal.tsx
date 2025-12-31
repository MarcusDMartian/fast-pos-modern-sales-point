
import React, { useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ImportModalProps {
  entityName: string;
  templateHeaders: string[];
  onImport: (data: any[]) => void;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ entityName, templateHeaders, onImport, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + templateHeaders.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${entityName.toLowerCase()}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      const headers = rows[0].map(h => h.trim());
      
      const data = rows.slice(1).filter(row => row.length === headers.length).map(row => {
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = row[index].trim();
        });
        return obj;
      });

      onImport(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-[#333984]/30 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#333984]">Import {entityName}</h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Bulk Data Ingestion</p>
          </div>
          <button onClick={onClose} className="p-3 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-[2rem] flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl text-[#2A46FF] shadow-sm">
              <AlertCircle size={20} />
            </div>
            <p className="text-xs font-bold text-blue-700 leading-relaxed">
              Ensure your CSV file matches our template headers exactly. Mandatory fields are marked in the template.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={downloadTemplate}
              className="w-full p-8 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center gap-3 hover:border-[#2A46FF] hover:bg-blue-50/20 transition-all group"
            >
              <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-white group-hover:text-[#2A46FF] transition-all">
                <Download size={24} strokeWidth={2.5} />
              </div>
              <span className="font-black text-[#333984] text-sm uppercase tracking-widest">1. Download Template</span>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 bg-[#333984] rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-[#2A46FF] transition-all group shadow-xl shadow-blue-50"
            >
              <div className="p-4 bg-white/10 text-white rounded-2xl group-hover:scale-110 transition-all">
                <Upload size={24} strokeWidth={2.5} />
              </div>
              <span className="font-black text-white text-sm uppercase tracking-widest">2. Upload & Import CSV</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".csv"
              />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Supported format: .CSV only</p>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
