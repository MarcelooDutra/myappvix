'use client'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'
import Link from 'next/link'

// IMPORTAR O TOAST (Certifique-se que o caminho está correto)
import { Toast } from '@/app/components/Toast'

export default function Configuracoes() {
  const router = useRouter()
  
  // ESTADOS DE DADOS
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [uploading, setUploading] = useState(false)

  // ESTADOS DO FORMULÁRIO
  const [nomeSite, setNomeSite] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  // ESTADOS DE UI (Menu Mobile e Toast)
  const [menuAberto, setMenuAberto] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })

  // Função auxiliar para notificações
  const notificar = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  // 1. CARREGAR CONFIGURAÇÕES
  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('id', 1)
        .single()

      if (data) {
        setNomeSite(data.nome_site || '')
        setWhatsapp(data.whatsapp_numero || '')
        setLogoUrl(data.logo_url)
      }
      setLoading(false)
    }
    fetchConfig()
  }, [])

  // 2. UPLOAD DA LOGO (Estilo atualizado)
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    try {
        setUploading(true)
        const file = e.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `logo-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('loja-imagens')
            .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('loja-imagens').getPublicUrl(fileName)
        
        setLogoUrl(data.publicUrl)
        notificar('Logo enviada com sucesso!', 'success')

    } catch (error: any) {
        notificar('Erro no upload: ' + error.message, 'error')
    } finally {
        setUploading(false)
    }
  }

  // 3. SALVAR ALTERAÇÕES
  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault()
    setSalvando(true)

    const { error } = await supabase
      .from('configuracoes')
      .update({
        nome_site: nomeSite,
        whatsapp_numero: whatsapp,
        logo_url: logoUrl
      })
      .eq('id', 1)

    setSalvando(false)

    if (error) {
        notificar('Erro ao salvar as configurações.', 'error')
    } else {
        notificar('Configurações atualizadas! 🎉', 'success')
    }
  }

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#0b1120] relative">
      
      {/* === SIDEBAR RESPONSIVA === */}
      <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] border-r border-slate-800 transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:flex flex-col
          ${menuAberto ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
                MyApple<span className="text-cyan-500">Admin</span>
            </h1>
            <button onClick={() => setMenuAberto(false)} className="md:hidden text-slate-400 font-bold text-xl">✕</button>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition">
                📊 Dashboard
            </Link>
            <Link href="/admin/novo" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition">
                📱 Cadastrar Produto
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-cyan-500/10 text-cyan-400 rounded-xl font-bold">
                ⚙️ Configurações
            </a>
            <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition mt-10 border-t border-slate-800 pt-6">
                🌐 Ver Loja Online
            </Link>
        </nav>
        {/* Logout Mobile */}
        <div className="p-4 border-t border-slate-800 md:hidden">
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition font-bold">
                🚪 Sair
            </button>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {menuAberto && <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMenuAberto(false)} />}

      {/* === CONTEÚDO PRINCIPAL === */}
      <main className="flex-1 h-screen overflow-y-auto relative">
        
        {/* HEADER MOBILE */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] border-b border-slate-800 sticky top-0 z-20">
            <button onClick={() => setMenuAberto(true)} className="text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <span className="font-bold text-white">Configurações</span>
            <div className="w-8"></div>
        </div>

        {/* CONTAINER COM PADDING RESPONSIVO */}
        <div className="p-4 md:p-8 pb-20">
            
            <Toast isVisible={toast.show} message={toast.message} type={toast.type} />

            <header className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Configurações da Loja</h2>
                    <p className="text-slate-400 text-sm md:text-base">Personalize as informações principais do seu site.</p>
                </div>
                <Link href="/admin" className="text-slate-400 hover:text-white font-bold transition flex items-center gap-2">
                    ← Voltar
                </Link>
            </header>

            {/* FORMULÁRIO ESTILIZADO */}
            <div className="max-w-4xl mx-auto">
                {loading ? (
                    <div className="text-white text-center py-20 animate-pulse">Carregando dados...</div>
                ) : (
                    <form onSubmit={handleSalvar} className="bg-[#1e293b] p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl space-y-8">
                        
                        {/* 1. LOGO */}
                        <div>
                            <label className="block text-slate-400 text-sm font-bold mb-3 uppercase tracking-wider">Logo do Site</label>
                            
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                {/* Preview da Logo Atual */}
                                <div className="w-32 h-32 bg-[#0b1120] rounded-xl border-2 border-slate-700 flex items-center justify-center relative overflow-hidden shrink-0">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo Atual" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <span className="text-4xl">📷</span>
                                    )}
                                </div>

                                {/* Botão de Upload */}
                                <div className="flex-1 w-full">
                                    <label className={`
                                        flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all
                                        ${uploading 
                                            ? 'border-cyan-500/50 bg-cyan-500/10' 
                                            : 'border-slate-600 hover:border-cyan-500 hover:bg-slate-800'
                                        }
                                    `}>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {uploading ? (
                                                <div className="text-cyan-400 font-bold animate-pulse">Enviando...</div>
                                            ) : (
                                                <>
                                                    <span className="text-2xl mb-2">⬆️</span>
                                                    <p className="text-sm text-slate-400"><span className="font-bold text-white">Clique para alterar a logo</span></p>
                                                    <p className="text-xs text-slate-500 mt-1">Recomendado: PNG Transparente</p>
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-700/50"></div>

                        {/* 2. CAMPOS DE TEXTO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Nome do Site */}
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Nome da Loja</label>
                                <input 
                                    type="text" 
                                    value={nomeSite}
                                    onChange={e => setNomeSite(e.target.value)}
                                    className="w-full bg-[#0b1120] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600"
                                    placeholder="Ex: MyAppleVix"
                                />
                            </div>

                            {/* WhatsApp */}
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">WhatsApp (Apenas números)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-slate-500">📞</span>
                                    <input 
                                        type="text" 
                                        value={whatsapp}
                                        onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ''))} // Só aceita números
                                        className="w-full bg-[#0b1120] border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600"
                                        placeholder="5521999999999"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-2 ml-1">Use o formato internacional: 55 + DDD + Número.</p>
                            </div>
                        </div>

                        {/* 3. BOTÃO SALVAR */}
                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={salvando || uploading}
                                className="w-full md:w-auto bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {salvando ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>

                    </form>
                )}
            </div>

        </div>
      </main>
    </div>
  )
}