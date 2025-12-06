'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// COMPONENTES
import { Toast } from '@/app/components/Toast'
import { ModalConfirm } from '@/app/components/ModalConfirm'

export default function AdminDashboard() {
    const router = useRouter()
    const [produtos, setProdutos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [resumo, setResumo] = useState({ total: 0, novos: 0, seminovos: 0, faturamento: 0 })

    // ESTADOS DE UI
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })
    const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null)
    
    // NOVO: Estado para abrir/fechar menu no celular
    const [menuAberto, setMenuAberto] = useState(false)

    useEffect(() => {
        fetchProdutos()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const notificar = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type })
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
    }

    async function fetchProdutos() {
        setLoading(true)
        const { data } = await supabase
            .from('produtos')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) {
            setProdutos(data)
            processarDadosVendas(data)
        }
        setLoading(false)
    }

    function processarDadosVendas(todosProdutos: any[]) {
        const vendidos = todosProdutos.filter(p => p.data_venda !== null)
        const totalNovos = vendidos.filter(p => p.condicao === 'novo').length
        const totalSeminovos = vendidos.filter(p => p.condicao === 'seminovo').length
        const faturamentoTotal = vendidos.reduce((acc, curr) => acc + (Number(curr.preco) || 0), 0)

        setResumo({
            total: vendidos.length,
            novos: totalNovos,
            seminovos: totalSeminovos,
            faturamento: faturamentoTotal
        })
    }

    const handleVender = async (id: string) => {
        const dataAgora = new Date().toISOString()
        const { error } = await supabase
            .from('produtos')
            .update({ ativo: false, data_venda: dataAgora })
            .eq('id', id)

        if (error) {
            notificar('Erro ao registrar venda.', 'error')
        } else {
            notificar('Venda registrada com sucesso! 💰', 'success')
            fetchProdutos()
        }
    }

    const handleBotaoExcluir = (id: string) => {
        setIdParaExcluir(id)
    }

    const confirmarExclusao = async () => {
        if (!idParaExcluir) return
        const { error } = await supabase.from('produtos').delete().eq('id', idParaExcluir)

        if (error) {
            notificar('Erro ao excluir produto.', 'error')
        } else {
            notificar('Produto removido.', 'success')
            fetchProdutos()
        }
        setIdParaExcluir(null)
    }

    const pctNovos = resumo.total > 0 ? (resumo.novos / resumo.total) * 100 : 0;
    const pctSeminovos = resumo.total > 0 ? (resumo.seminovos / resumo.total) * 100 : 0;

    return (
        <div className="flex min-h-screen bg-[#0b1120] relative">
            
            {/* === 1. SIDEBAR RESPONSIVA === */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-[#0f172a] border-r border-slate-800 transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:flex flex-col
                ${menuAberto ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        MyApple<span className="text-cyan-500">Admin</span>
                    </h1>
                    <button onClick={() => setMenuAberto(false)} className="md:hidden text-slate-400">✕</button>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-cyan-500/10 text-cyan-400 rounded-xl font-bold">
                        📊 Dashboard
                    </a>
                    <Link href="/admin/novo" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition">
                        📱 Cadastrar Produto
                    </Link>
                    <Link href="/admin/config" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition">
                        ⚙️ Configurações
                    </Link>
                    <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-white rounded-xl transition mt-6 border-t border-slate-800 pt-6">
                        🌐 Ver Loja Online
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition font-bold">
                        🚪 Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* OVERLAY MOBILE */}
            {menuAberto && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setMenuAberto(false)}
                />
            )}

            {/* === CONTEÚDO PRINCIPAL === */}
            <main className="flex-1 h-screen overflow-y-auto relative">
                
                {/* 2. HEADER MOBILE */}
                <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] border-b border-slate-800 sticky top-0 z-20">
                    <button onClick={() => setMenuAberto(true)} className="text-white p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <span className="font-bold text-white">Dashboard</span>
                    <div className="w-6"></div>
                </div>

                <div className="p-4 md:p-8 pb-24"> 

                    <Toast isVisible={toast.show} message={toast.message} type={toast.type} />
                    
                    <ModalConfirm
                        isOpen={!!idParaExcluir}
                        title="Excluir Produto?"
                        message="Tem certeza que deseja remover este item permanentemente?"
                        onConfirm={confirmarExclusao}
                        onCancel={() => setIdParaExcluir(null)}
                        confirmText="Sim, Excluir"
                        cancelText="Cancelar"
                    />

                    <header className="mb-6 md:mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Controle de Vendas</h2>
                            <p className="text-slate-400 text-sm md:text-base">Gerencie seu estoque e acompanhe o desempenho.</p>
                        </div>
                        <Link href="/admin/novo" className="hidden md:flex bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all items-center gap-2">
                            + Cadastrar iPhone
                        </Link>
                    </header>

                    {/* CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg">
                            <h3 className="text-slate-400 text-xs uppercase font-bold">Total Vendidos</h3>
                            <p className="text-3xl font-black text-white mt-2">{resumo.total}</p>
                        </div>
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-blue-900/50 shadow-lg relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-10 text-6xl">✨</div>
                            <h3 className="text-blue-400 text-xs uppercase font-bold">Novos Vendidos</h3>
                            <p className="text-3xl font-black text-white mt-2">{resumo.novos}</p>
                        </div>
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-cyan-900/50 shadow-lg relative overflow-hidden">
                            <div className="absolute right-0 top-0 p-4 opacity-10 text-6xl">📱</div>
                            <h3 className="text-cyan-400 text-xs uppercase font-bold">Seminovos Vendidos</h3>
                            <p className="text-3xl font-black text-white mt-2">{resumo.seminovos}</p>
                        </div>
                        <div className="bg-[#1e293b] p-6 rounded-2xl border border-green-900/50 shadow-lg">
                            <h3 className="text-green-400 text-xs uppercase font-bold">Faturamento Total</h3>
                            <p className="text-3xl font-black text-white mt-2">
                                R$ {resumo.faturamento.toLocaleString('pt-BR', { notation: "compact" })}
                            </p>
                        </div>
                    </div>

                    {/* COMPARATIVO */}
                    <div className="bg-[#1e293b] p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-xl mb-8">
                        <h3 className="text-xl font-bold text-white mb-8">🏆 Comparativo de Vendas</h3>
                        <div className="space-y-8">
                             {/* Novos */}
                             <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 p-2 shrink-0">
                                    <span className="text-2xl md:text-3xl">✨</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-white text-sm md:text-lg">Novos</span>
                                        <span className="font-bold text-blue-400 text-sm md:text-lg">{resumo.novos} un.</span>
                                    </div>
                                    <div className="w-full h-4 md:h-6 bg-slate-700 rounded-full overflow-hidden relative">
                                        {/* BARRA AZUL COM PORCENTAGEM RECOLOCADA */}
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-end pr-2 transition-all duration-1000 ease-out" 
                                            style={{ width: `${pctNovos}%` }}
                                        >
                                            {pctNovos > 10 && <span className="text-[10px] font-bold text-blue-900">{pctNovos.toFixed(0)}%</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Seminovos */}
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 p-2 shrink-0">
                                    <span className="text-2xl md:text-3xl">📱</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-white text-sm md:text-lg">Seminovos</span>
                                        <span className="font-bold text-cyan-400 text-sm md:text-lg">{resumo.seminovos} un.</span>
                                    </div>
                                    <div className="w-full h-4 md:h-6 bg-slate-700 rounded-full overflow-hidden relative">
                                        {/* BARRA CIANO COM PORCENTAGEM RECOLOCADA */}
                                        <div 
                                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full flex items-center justify-end pr-2 transition-all duration-1000 ease-out" 
                                            style={{ width: `${pctSeminovos}%` }}
                                        >
                                            {pctSeminovos > 10 && <span className="text-[10px] font-bold text-cyan-900">{pctSeminovos.toFixed(0)}%</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LISTA DE PRODUTOS */}
                    <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-700/50">
                            <h3 className="text-xl font-bold text-white">Gerenciar Estoque</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead className="bg-[#0f172a] text-slate-400 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">Produto</th>
                                        <th className="p-4">Preço</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                    {produtos.map((prod) => {
                                        const vendido = !!prod.data_venda;
                                        return (
                                            <tr key={prod.id} className={`transition ${vendido ? 'bg-slate-800/30 opacity-50' : 'hover:bg-slate-800/50'}`}>
                                                <td className="p-4 font-bold text-white flex items-center gap-3">
                                                    {prod.fotos?.[0] && <img src={prod.fotos[0]} className="w-10 h-10 rounded object-cover" />}
                                                    <div className="flex flex-col">
                                                        <span>{prod.titulo}</span>
                                                        {vendido && <span className="text-[10px] text-green-400">Vendido: {new Date(prod.data_venda).toLocaleDateString()}</span>}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-cyan-400 font-bold">R$ {prod.preco?.toLocaleString('pt-BR')}</td>
                                                <td className="p-4">
                                                    {vendido ? 
                                                        <span className="bg-green-900/30 text-green-400 border border-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Vendido</span> 
                                                        : 
                                                        <span className="bg-blue-900/30 text-blue-400 border border-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Em Estoque</span>
                                                    }
                                                </td>
                                                <td className="p-4 text-right">
                                                    {!vendido && (
                                                        <button onClick={() => handleVender(prod.id)} className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold transition mr-2">
                                                            $ Vender
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleBotaoExcluir(prod.id)} className="text-slate-500 hover:text-red-400 text-xs font-bold transition">
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* FAB */}
                <Link href="/admin/novo" className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50 text-white text-3xl z-40 hover:scale-110 transition active:scale-95">
                    +
                </Link>

            </main>
        </div>
    )
}