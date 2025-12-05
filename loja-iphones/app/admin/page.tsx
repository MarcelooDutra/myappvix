'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/src/lib/supabase'
import Link from 'next/link'

// 1. IMPORTAR SEUS NOVOS COMPONENTES
import { Toast } from '@/app/components/Toast'
import { ModalConfirm } from '@/app/components/ModalConfirm'

import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const router = useRouter()
    const [produtos, setProdutos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [resumo, setResumo] = useState({ total: 0, novos: 0, seminovos: 0, faturamento: 0 })

    // 2. ESTADOS PARA CONTROLAR OS COMPONENTES
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })
    const [idParaExcluir, setIdParaExcluir] = useState<string | null>(null) // Se tiver ID, o modal abre

    useEffect(() => {
        fetchProdutos()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut() // Desloga do Supabase
        router.push('/login')         // Redireciona para a tela de login
    }

    // Função auxiliar para mostrar o Toast
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

    // --- AÇÃO 1: VENDER (Com Toast em vez de Alert) ---
    const handleVender = async (id: string) => {
        // Aqui removi o confirm nativo para ser mais rápido, 
        // mas você pode usar um ModalConfirm aqui também se quiser.
        const dataAgora = new Date().toISOString()

        const { error } = await supabase
            .from('produtos')
            .update({
                ativo: false,
                data_venda: dataAgora
            })
            .eq('id', id)

        if (error) {
            notificar('Erro ao registrar venda.', 'error')
        } else {
            notificar('Venda registrada com sucesso! 💰', 'success')
            fetchProdutos()
        }
    }

    // --- AÇÃO 2: EXCLUIR (Usando o Modal) ---

    // Passo A: Usuário clica em excluir -> Abre o Modal
    const handleBotaoExcluir = (id: string) => {
        setIdParaExcluir(id)
    }

    // Passo B: Usuário confirma no Modal -> Executa a exclusão
    const confirmarExclusao = async () => {
        if (!idParaExcluir) return

        const { error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', idParaExcluir)

        if (error) {
            notificar('Erro ao excluir produto.', 'error')
        } else {
            notificar('Produto removido do estoque.', 'success')
            fetchProdutos()
        }
        setIdParaExcluir(null) // Fecha o modal
    }

    // Cálculo das barras
    const pctNovos = resumo.total > 0 ? (resumo.novos / resumo.total) * 100 : 0;
    const pctSeminovos = resumo.total > 0 ? (resumo.seminovos / resumo.total) * 100 : 0;

    const Sidebar = () => (
        <aside className="w-64 bg-[#0f172a] border-r border-slate-800 hidden md:flex flex-col fixed h-full z-20">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    MyApple<span className="text-cyan-500">Admin</span>
                </h1>
            </div>

            {/* Menu Principal */}
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

            {/* --- BOTÃO DE SAIR NO RODAPÉ DA SIDEBAR --- */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition font-bold"
                >
                    🚪 Sair do Sistema
                </button>
            </div>
        </aside>
    )
    return (
        <div className="flex min-h-screen bg-[#0b1120]">
            <Sidebar />

            <main className="flex-1 p-8 md:ml-64 overflow-y-auto relative">

                {/* 3. INSERIR OS COMPONENTES AQUI (Pode ser em qualquer lugar dentro do main) */}

                <Toast
                    isVisible={toast.show}
                    message={toast.message}
                    type={toast.type}
                />

                <ModalConfirm
                    isOpen={!!idParaExcluir} // Converte a string ID em boolean (true se tiver ID)
                    title="Excluir Produto?"
                    message="Tem certeza que deseja remover este item permanentemente? Esta ação não pode ser desfeita."
                    onConfirm={confirmarExclusao}
                    onCancel={() => setIdParaExcluir(null)}
                    confirmText="Sim, Excluir"
                    cancelText="Cancelar"
                />

                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Controle de Vendas</h2>
                        <p className="text-slate-400">Gerencie seu estoque e acompanhe o desempenho.</p>
                    </div>
                    <Link href="/admin/novo" className="hidden md:flex bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all items-center gap-2">
                        + Cadastrar iPhone
                    </Link>
                </header>

                {/* --- CARDS DE RESUMO --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

                {/* --- COMPARATIVO VISUAL --- */}
                <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700/50 shadow-xl mb-8">
                    <h3 className="text-xl font-bold text-white mb-8">🏆 Comparativo de Vendas</h3>
                    <div className="space-y-8">
                        {/* Novos */}
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 p-2 shrink-0">
                                {/* Use sua tag <img src="..." /> aqui se tiver a imagem */}
                                <span className="text-3xl">✨</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-white text-lg">iPhones Novos</span>
                                    <span className="font-bold text-blue-400 text-lg">{resumo.novos} vendidos</span>
                                </div>
                                <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                                        style={{ width: `${pctNovos}%` }}
                                    >
                                        {pctNovos > 10 && <span className="text-[10px] font-bold text-blue-900">{pctNovos.toFixed(0)}%</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Seminovos */}
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 p-2 shrink-0">
                                {/* Use sua tag <img src="..." /> aqui se tiver a imagem */}
                                <span className="text-3xl">📱</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <span className="font-bold text-white text-lg">iPhones Seminovos</span>
                                    <span className="font-bold text-cyan-400 text-lg">{resumo.seminovos} vendidos</span>
                                </div>
                                <div className="w-full h-6 bg-slate-700 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                                        style={{ width: `${pctSeminovos}%` }}
                                    >
                                        {pctSeminovos > 10 && <span className="text-[10px] font-bold text-cyan-900">{pctSeminovos.toFixed(0)}%</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- LISTA DE PRODUTOS --- */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold text-white">Gerenciar Estoque</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
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
                                                    {vendido && <span className="text-[10px] text-green-400">Vendido em: {new Date(prod.data_venda).toLocaleDateString()}</span>}
                                                </div>
                                            </td>
                                            <td className="p-4 text-cyan-400 font-bold">R$ {prod.preco?.toLocaleString('pt-BR')}</td>
                                            <td className="p-4">
                                                {vendido ? (
                                                    <span className="bg-green-900/30 text-green-400 border border-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                                        Vendido
                                                    </span>
                                                ) : (
                                                    <span className="bg-blue-900/30 text-blue-400 border border-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                                        Em Estoque
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {!vendido && (
                                                    <button
                                                        onClick={() => handleVender(prod.id)}
                                                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-bold transition mr-2"
                                                    >
                                                        $ Vender
                                                    </button>
                                                )}
                                                {/* 4. BOTÃO EXCLUIR AGORA ABRE O MODAL */}
                                                <button
                                                    onClick={() => handleBotaoExcluir(prod.id)}
                                                    className="text-slate-500 hover:text-red-400 text-xs font-bold transition"
                                                >
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

            </main>
        </div>
    )
}