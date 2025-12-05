interface ModalConfirmProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ModalConfirm({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  confirmText = "Sim, confirmar",
  cancelText = "Cancelar"
}: ModalConfirmProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animation-fade-in">
        <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full relative animation-scale-up">
            <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🗑️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 mb-8">
                    {message}
                </p>
                
                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={onCancel}
                        className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition border border-slate-600"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition shadow-lg shadow-red-500/20"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}