import { supabase } from '@/src/lib/supabase'
import Link from 'next/link'

type Props = {
  params: Promise<{ tipo: string }>
}

async function getData(tipo: string) {
  const condicaoDb = tipo === 'novos' ? 'novo' : 'seminovo'
  
  const [produtosRes, configRes] = await Promise.all([
    supabase.from('produtos').select('*').eq('ativo', true).eq('condicao', condicaoDb).order('preco', { ascending: true }),
    supabase.from('configuracoes').select('logo_url, whatsapp_numero').eq('id', 1).single()
  ])

  return {
    produtos: produtosRes.data || [],
    config: configRes.data
  }
}

export default async function CategoriaPage({ params }: Props) {
  const { tipo } = await params
  const { produtos, config } = await getData(tipo)

  const tituloParte1 = "iPhones"
  const tituloParte2 = tipo === 'novos' ? 'Novos' : 'Seminovos'
  const zapNumero = config?.whatsapp_numero || "5500000000000"

  return (
    <main className="min-h-screen bg-[#050f19] pb-20 relative"> 
      
      {/* CABEÇALHO (VOLTOU AO ORIGINAL - Logo Absoluta) */}
      <header className="relative max-w-6xl mx-auto pt-8 pb-6 px-4 flex items-end border-b border-cyan-900/30 min-h-[100px] mb-8">
        
        {/* Adicionei 'pr-20' no mobile para o texto não bater na logo que está absoluta */}
        <div className="z-10 relative pr-20 md:pr-0">
            <a href="/" className="text-cyan-600 hover:text-cyan-400 text-xs mb-1 block transition font-bold">← Voltar para Início</a>
            <h1 className="text-3xl md:text-4xl uppercase tracking-tighter leading-none">
                <span className="text-white font-light">{tituloParte1} </span>
                <span className="text-cyan-500 font-black">{tituloParte2}</span>
            </h1>
        </div>
        
        {/* Logo Flutuante (Absolute) - Não altera a altura do header */}
        <img 
            src="/logo.png" 
            alt="Logo" 
            // Ajustei apenas o tamanho mobile (h-16) para não ficar gigante
            className="absolute right-4 bottom-2 h-16 md:h-28 object-contain opacity-90" 
        />
      </header>

      {/* === GRID DE CARDS (Responsivo: 2 colunas mobile, 3 tablet, 4 desktop) === */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"> 
        
        {produtos && produtos.map((produto) => {
            const mensagem = `Olá, vi o anúncio do *${produto.titulo}* e queria saber mais detalhes.`
            const linkZapProduto = `https://wa.me/${zapNumero}?text=${encodeURIComponent(mensagem)}`

            return (
                <div key={produto.id} className="bg-[#0a1829] border border-cyan-900/40 rounded-2xl overflow-hidden flex flex-col hover:-translate-y-1 hover:border-cyan-500/50 transition-all duration-300 shadow-lg group">
                    
                    {/* FOTO */}
                    <Link href={`/produto/${produto.id}`} className="block relative h-40 md:h-48 bg-[#050f1e] overflow-hidden p-3 md:p-4">
                        {produto.fotos?.[0] ? (
                            <img 
                                src={produto.fotos[0]} 
                                className="w-full h-full object-contain group-hover:scale-110 transition duration-500" 
                                alt={produto.titulo}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">Sem foto</div>
                        )}
                        
                        {/* Etiqueta + Detalhes */}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] md:text-[10px] px-2 py-1 rounded">
                            + Detalhes
                        </div>
                    </Link>

                    {/* CONTEÚDO */}
                    <div className="p-3 md:p-4 flex flex-col flex-grow">
                        {/* Título */}
                        <Link href={`/produto/${produto.id}`}>
                            <h2 className="text-white font-bold text-sm md:text-lg mb-1 leading-tight group-hover:text-cyan-400 transition line-clamp-2">
                                {produto.titulo}
                            </h2>
                        </Link>

                        {/* Descrição Curta */}
                        <p className="text-slate-400 text-[10px] md:text-xs mb-3 line-clamp-2">
                            {produto.descricao}
                        </p>

                        {/* Preço */}
                        <div className="mt-auto mb-3 md:mb-4">
                            <p className="text-cyan-400 font-extrabold text-lg md:text-xl">
                                R$ {produto.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                            </p>
                            <p className="text-slate-500 text-[10px]">à vista</p>
                        </div>

                        {/* BOTÃO WHATSAPP */}
                        <a 
                            href={linkZapProduto}
                            target="_blank"
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 md:py-2.5 rounded-lg flex items-center justify-center gap-1.5 md:gap-2 transition-colors text-xs md:text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                            </svg>
                            Chamar no Zap
                        </a>
                    </div>
                </div>
            )
        })}
      </div>
      
      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 px-6 border-t border-cyan-900/30 pt-8 flex justify-end gap-4 opacity-60">
        <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center text-sm text-white"></div>
        <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center text-sm text-white">📷</div>
        <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center text-sm text-white">💬</div>
      </footer>

    </main>
  )
}