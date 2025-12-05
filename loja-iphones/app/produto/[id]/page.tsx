import { supabase } from '@/src/lib/supabase'
import Link from 'next/link' // Importando Link para navegação interna

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProdutoDetalhe({ params }: Props) {
  const { id } = await params

  // 1. Busca o Produto e as Configurações (para Logo e Zap)
  const [produtoRes, configRes] = await Promise.all([
    supabase.from('produtos').select('*').eq('id', id).single(),
    supabase.from('configuracoes').select('logo_url, whatsapp_numero').eq('id', 1).single()
  ])

  const produto = produtoRes.data
  const config = configRes.data

  // Se não achar o produto
  if (!produto) {
    return (
      <div className="min-h-screen bg-[#050f19] flex flex-col items-center justify-center text-slate-400">
        <h1 className="text-2xl font-bold mb-2 text-white">Produto não encontrado 😕</h1>
        <Link href="/" className="mt-4 text-cyan-400 hover:underline">Voltar para a Loja</Link>
      </div>
    )
  }

  // --- LÓGICA DO BOTÃO VOLTAR (ADICIONADA) ---
  const isNovo = produto.condicao === 'novo'
  const linkVoltar = isNovo ? '/categoria/novos' : '/categoria/seminovos'
  const textoVoltar = isNovo ? '← Voltar para Novos' : '← Voltar para Seminovos'

  // 2. Configura o Link do WhatsApp
  const zapNumero = config?.whatsapp_numero || "5500000000000"
  const msg = `Olá, estou vendo o *${produto.titulo}* no site e tenho interesse.`
  const linkZap = `https://wa.me/${zapNumero}?text=${encodeURIComponent(msg)}`

  return (
    <main className="min-h-screen bg-[#050f19] pb-20">
      
      {/* === CABEÇALHO === */}
      <header className="relative max-w-5xl mx-auto pt-8 pb-6 px-4 flex items-end border-b border-cyan-900/30 min-h-[90px] mb-8">
        <div className="z-10 relative">
            {/* BOTÃO VOLTAR COM LÓGICA DINÂMICA */}
            <Link href={linkVoltar} className="text-cyan-600 hover:text-cyan-400 text-[10px] md:text-xs mb-1 block transition font-bold uppercase tracking-wider">
                {textoVoltar}
            </Link>
            {/* TÍTULO DA PÁGINA AUMENTADO */}
            <h1 className="text-3xl md:text-4xl uppercase tracking-tighter leading-none text-white">
                Detalhes do <span className="text-cyan-500 font-black">Aparelho</span>
            </h1>
        </div>
        
        {/* Logo Flutuante na Direita */}
        <img 
            src="/logo.png" 
            alt="Logo" 
            className="absolute right-4 bottom-2 h-14 md:h-20 object-contain opacity-90" 
        />
      </header>

      {/* === CONTEÚDO DO PRODUTO (Tamanhos Reduzidos) === */}
      <div className="max-w-6xl mx-auto px-4 md:flex gap-8 items-start">
        
        {/* LADO ESQUERDO: FOTO GRANDE (LARGURA REDUZIDA PARA 5/12) */}
        <div className="md:w-5/12 w-full mb-6 md:mb-0">
            <div className="aspect-square bg-[#0a1829] border border-cyan-900/40 rounded-2xl relative flex items-center justify-center p-6 overflow-hidden shadow-xl">
                {/* Fundo Glow Atrás do Celular */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50"></div>
                
                {produto.fotos?.[0] ? (
                    <img 
                        src={produto.fotos[0]} 
                        alt={produto.titulo} 
                        className="relative z-10 w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform hover:scale-105 transition duration-500"
                    />
                ) : (
                    <span className="text-slate-600">Sem Foto</span>
                )}

                {/* Badge de Condição */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full">
                    {produto.condicao === 'novo' ? '✨ Novo / Lacrado' : '📱 Seminovo'}
                </div>
            </div>
        </div>

        {/* LADO DIREITO: INFORMAÇÕES (LARGURA AUMENTADA PARA 7/12) */}
        <div className="md:w-7/12 w-full flex flex-col">
            
            {/* Título Principal (DIMINUÍDO) */}
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none mb-2">
                {produto.titulo}
            </h1>

            {/* Divisor Neon */}
            <div className="w-20 h-1 bg-cyan-500 rounded-full my-4 shadow-[0_0_10px_rgba(0,200,255,0.6)]"></div>

            {/* Preço Grande (DIMINUÍDO MAIS) */}
            <div className="mb-6">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Valor à vista</p>
                <p className="text-3xl md:text-4xl text-cyan-400 font-extrabold tracking-tighter">
                    R$ {produto.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
                <p className="text-slate-500 text-[10px] mt-1">ou consulte condições de parcelamento</p>
            </div>

            {/* Caixa de Descrição Técnica */}
            <div className="bg-[#0b1a2e] border-l-4 border-cyan-600 p-5 rounded-r-lg mb-5">
                <h3 className="text-cyan-500 font-bold uppercase text-[10px] tracking-widest mb-2">
                    Ficha Técnica / Detalhes
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {produto.descricao}
                </p>
            </div>

            {/* Observações (Se tiver) */}
            {produto.observacoes && (
                <div className="bg-yellow-900/10 border border-yellow-700/30 p-3 rounded-lg mb-6">
                    <p className="text-yellow-500 font-bold text-[10px] uppercase mb-1">Observação Importante:</p>
                    <p className="text-yellow-200/80 text-xs">{produto.observacoes}</p>
                </div>
            )}

            {/* Botão de Ação (WhatsApp) */}
            <a 
                href={linkZap}
                target="_blank"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,0,0.15)] hover:shadow-[0_0_30px_rgba(0,255,0,0.3)] transition-all transform hover:-translate-y-1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                </svg>
                Quero Comprar Agora
            </a>

            <p className="text-center text-slate-600 text-[10px] mt-3">
                Negocie diretamente com o vendedor • Transação Segura
            </p>

        </div>
      </div>
      
    </main>
  )
}