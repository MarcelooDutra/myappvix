interface ToastProps {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error';
}

export function Toast({ isVisible, message, type }: ToastProps) {
  return (
    <div 
      className={`fixed top-6 right-6 z-50 transition-all duration-500 transform 
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border 
        ${type === 'success' 
            ? 'bg-green-900/90 border-green-500 text-green-100' 
            : 'bg-red-900/90 border-red-500 text-red-100'
        }`}
      >
        <span className="text-2xl">{type === 'success' ? '✅' : '❌'}</span>
        <div className="flex flex-col">
            <span className="font-bold">{type === 'success' ? 'Sucesso' : 'Erro'}</span>
            <span className="text-sm opacity-90">{message}</span>
        </div>
      </div>
    </div>
  )
}