'use client'
import { useState, ChangeEvent } from 'react'
import { supabase } from '@/src/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// 1. IMPORTAR O COMPONENTE TOAST
import { Toast } from '@/app/components/Toast'

export default function NovoProduto() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // --- NOVO: ESTADO PARA O MENU MOBILE ---
  const [menuAberto, setMenuAberto] = useState(false)

  // 2. ESTADO PARA CONTROLAR O TOAST
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })

  const [form, setForm] = useState({
    titulo: '',
    preco: '',
    condicao: 'seminovo', 
    url_foto: '', 
    descricao: ''
  })

  // Função auxiliar para mostrar notificações
  const notificar = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  // --- MÁSCARA DE MOEDA ---
  const handlePrecoChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/\D/g, "")
    const numero = Number(value) / 100
    const valorFormatado = numero.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    setForm({ ...form, preco: valorFormatado })
  }

  // --- FUNÇÃO DE UPLOAD ---
  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('loja-imagens') 
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('loja-imagens') 
        .getPublicUrl(filePath)

      setForm({ ...form, url_foto: data.publicUrl })
      notificar('Upload concluído!', 'success') 
      
    } catch (error: any) {
      notificar('Erro no upload: ' + error.message, 'error')
    } finally {
      setUploading(false)
    }
  }

  // --- SALVAR ---
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!form.titulo || !form.preco) {
        notificar('Preencha Título e Preço.', 'error')
        setLoading(false)
        return
    }

    if (!form.url_foto) {
        notificar('Faça o upload de uma foto.', 'error')
        setLoading(false)
        return
    }

    const precoLimpo = form.preco.replace(/\./g, '').replace(',', '.')
    const precoFloat = parseFloat(precoLimpo)

    const payload = {
        titulo: form.titulo,
        preco: precoFloat,
        condicao: form.condicao,
        descricao: form.descricao,
        fotos: [form.url_foto],
        ativo: true,
        data_venda: null
    }

    const { error } = await supabase
        .from('produtos')
        .insert([payload])

    if (error) {
        console.error(error)
        notificar('Erro ao cadastrar: ' + error.message, 'error')
        setLoading(false)
    } else {
        notificar('Produto cadastrado com sucesso! 🚀', 'success')
        
        setTimeout(() => {
            router.push('/admin')
        }, 2000)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0b1120] relative">
      
      {/* === SIDEBAR RESPONSIVA (Slide-in no Mobile) === */}
      <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] border-r border-slate-800 transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex flex-col
          ${menuAberto ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
                MyApple<span className="text-cyan-500">Admin</span>
            </h1>
            {/* Botão X para fechar no celular */}
            <button onClick={() => setMenuAberto(false)} className="md:hidden text-slate-400 font-bold text-xl">✕</button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition">
                📊 Dashboard
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-cyan-500/10 text-cyan-400 rounded-xl font-bold">
                📱 Cadastrar Produto
            </a>
            <Link href="/admin/config" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition">
                ⚙️ Configurações
            </Link>
            <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition mt-10 border-t border-slate-800 pt-6">
                🌐 Ver Loja Online
            </Link>
        </nav>
      </aside>

      {/* OVERLAY ESCURO (Fundo preto quando menu abre no celular) */}
      {menuAberto && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMenuAberto(false)} />
      )}

      <main className="flex-1 h-screen overflow-y-auto relative">
        
        {/* === HEADER MOBILE (Hambúrguer) === */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] border-b border-slate-800 sticky top-0 z-20">
            <button onClick={() => setMenuAberto(true)} className="text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <span className="font-bold text-white">Novo Produto</span>
            <div className="w-8"></div> {/* Espaço para centralizar */}
        </div>

        {/* CONTEÚDO COM PADDING AJUSTADO (p-4 mobile, p-8 desktop) */}
        <div className="p-4 md:p-8 pb-20">
            
            {/* 3. INSERIR O COMPONENTE AQUI */}
            <Toast 
                isVisible={toast.show} 
                message={toast.message} 
                type={toast.type} 
            />
            
            <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Cadastrar iPhone</h2>
                    <p className="text-slate-400 text-sm md:text-base">Adicione novos itens ao seu estoque.</p>
                </div>
                <Link href="/admin" className="text-slate-400 hover:text-white font-bold transition flex items-center gap-2">
                    ← Voltar
                </Link>
            </header>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSalvar} className="bg-[#1e293b] p-5 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl space-y-6">
                    
                    {/* 1. SELEÇÃO DE CONDIÇÃO */}
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-3 uppercase tracking-wider">Condição do Aparelho</label>
                        {/* Grid ajustado: 1 coluna em telas muito pequenas, 2 em maiores */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div 
                                onClick={() => setForm({...form, condicao: 'novo'})}
                                className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex items-center gap-4
                                    ${form.condicao === 'novo' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                                    ${form.condicao === 'novo' ? 'border-blue-500' : 'border-slate-500'}`}>
                                    {form.condicao === 'novo' && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                                </div>
                                <div>
                                    <span className={`font-bold block ${form.condicao === 'novo' ? 'text-blue-400' : 'text-slate-300'}`}>Novo (Lacrado)</span>
                                    <span className="text-xs text-slate-500">Nunca usado, na caixa.</span>
                                </div>
                            </div>

                            <div 
                                onClick={() => setForm({...form, condicao: 'seminovo'})}
                                className={`cursor-pointer rounded-xl p-4 border-2 transition-all flex items-center gap-4
                                    ${form.condicao === 'seminovo' ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'}`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                                    ${form.condicao === 'seminovo' ? 'border-cyan-500' : 'border-slate-500'}`}>
                                    {form.condicao === 'seminovo' && <div className="w-3 h-3 bg-cyan-500 rounded-full" />}
                                </div>
                                <div>
                                    <span className={`font-bold block ${form.condicao === 'seminovo' ? 'text-cyan-400' : 'text-slate-300'}`}>Seminovo (Usado)</span>
                                    <span className="text-xs text-slate-500">Aparelho revisado.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inputs empilhados no mobile, lado a lado no PC */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Título */}
                        <div>
                            <label className="block text-slate-400 text-sm font-bold mb-2">Modelo / Título</label>
                            <input 
                                type="text" 
                                placeholder="Ex: iPhone 13 Pro 128GB"
                                className="w-full bg-[#0b1120] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600"
                                value={form.titulo}
                                onChange={e => setForm({...form, titulo: e.target.value})}
                            />
                        </div>

                        {/* Preço */}
                        <div>
                            <label className="block text-slate-400 text-sm font-bold mb-2">Preço de Venda (R$)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-500 font-bold">R$</span>
                                <input 
                                    type="text" 
                                    inputMode="numeric"
                                    placeholder="0,00"
                                    className="w-full bg-[#0b1120] border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600"
                                    value={form.preco}
                                    onChange={handlePrecoChange} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- ÁREA DE UPLOAD --- */}
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Foto do Aparelho</label>
                        
                        {/* Flex-col no mobile para imagem não esmagar o input */}
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="w-full md:flex-1">
                                <label className={`
                                    flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all
                                    ${uploading 
                                        ? 'border-cyan-500/50 bg-cyan-500/10' 
                                        : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-800'
                                    }
                                `}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {uploading ? (
                                            <div className="text-cyan-400 font-bold animate-pulse">Enviando imagem...</div>
                                        ) : (
                                            <>
                                                <span className="text-3xl mb-2">📷</span>
                                                <p className="text-sm text-slate-400"><span className="font-bold text-white">Clique para enviar</span></p>
                                            </>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>

                            {/* PREVIEW */}
                            {form.url_foto && (
                                <div className="w-full md:w-32 h-32 bg-black rounded-xl border-2 border-green-500/50 overflow-hidden relative group shrink-0">
                                    <img src={form.url_foto} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 w-full bg-green-600 text-white text-[10px] text-center font-bold py-1">
                                        UPLOAD OK
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Descrição (Opcional)</label>
                        <textarea 
                            rows={3}
                            placeholder="Ex: Saúde da bateria 92%, sem marcas de uso..."
                            className="w-full bg-[#0b1120] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600 resize-none"
                            value={form.descricao}
                            onChange={e => setForm({...form, descricao: e.target.value})}
                        />
                    </div>

                    {/* Botões - Stack no mobile (col-reverse) */}
                    <div className="pt-4 border-t border-slate-700/50 flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
                          <Link href="/admin" className="px-6 py-3 rounded-xl text-slate-400 hover:bg-slate-800 font-bold transition text-center border border-slate-700 md:border-transparent">
                            Cancelar
                        </Link>
                        <button 
                            type="submit" 
                            disabled={loading || uploading}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : 'Salvar Produto'}
                        </button>
                    </div>

                </form>
            </div>

        </div>
      </main>
    </div>
  )
}