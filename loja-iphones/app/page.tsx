import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b1120] pb-20 relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      
      {/* =========================================
          1. HEADER FIXO
         ========================================= */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1120]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
            
            {/* 1. ESQUERDA: Ícone + Nome da Marca */}
            <div className="flex items-center gap-2 h-full z-20">
                {/* Ícone (Levemente menor no mobile para equilíbrio) */}
                <div className="text-cyan-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 md:w-8 md:h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>

                {/* Texto: text-xl no celular, text-2xl no PC */}
                <span className="font-bold text-xl md:text-2xl tracking-tight text-white block whitespace-nowrap">
                    MyApple<span className="text-cyan-500">Vix</span>
                </span>
            </div>

            {/* 2. CENTRO: Links (Apenas Desktop) */}
            <div className="hidden md:flex items-center gap-8 text-base font-medium text-slate-400 absolute left-1/2 -translate-x-1/2">
                <Link href="#" className="hover:text-cyan-400 transition">Início</Link>
                <Link href="#categorias" className="hover:text-cyan-400 transition">Modelos</Link>
                <Link href="#garantia" className="hover:text-cyan-400 transition">Garantia</Link>
            </div>

            {/* 3. DIREITA: Logo Imagem */}
            <div className="h-full flex items-center z-20">
                <img 
                  src="/imagens/logo_sem_fundo.png" 
                  alt="Logo MyAppleVix" 
                  className="h-28 w-auto object-contain" 
                />
            </div>

        </div>
      </nav>

      {/* =========================================
          2. CONTEÚDO DA PÁGINA
         ========================================= */}
      
      {/* SEÇÃO HERO */}
      <section className="relative w-full pt-40 pb-10 px-4 flex flex-col items-center text-center space-y-4">
        <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-fade-in">
          🚀 O melhor preço do Brasil
        </span>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
          Sua nova experiência <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Apple começa aqui.
          </span>
        </h1>

        <p className="text-slate-400 max-w-xl text-base md:text-lg font-light">
          Especialistas em iPhones Novos e Seminovos com garantia total e procedência verificada.
        </p>
      </section>

      {/* DASHBOARD DE STATUS (Grid vira coluna no mobile) */}
      <div id="garantia" className="max-w-5xl mx-auto px-6 mb-12 scroll-mt-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card Status 1 */}
          <div className="bg-[#1e293b]/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl flex items-center gap-4 hover:bg-[#1e293b] transition cursor-default">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl">🛡️</div>
            <div>
              <h3 className="text-white font-bold text-sm">Garantia Total</h3>
              <p className="text-slate-400 text-[10px]">Suporte especializado</p>
            </div>
          </div>
          {/* Card Status 2 */}
          <div className="bg-[#1e293b]/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl flex items-center gap-4 hover:bg-[#1e293b] transition cursor-default">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">🚚</div>
            <div>
              <h3 className="text-white font-bold text-sm">Envio Imediato</h3>
              <p className="text-slate-400 text-[10px]">Para todo o Brasil</p>
            </div>
          </div>
          {/* Card Status 3 */}
          <div className="bg-[#1e293b]/50 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl flex items-center gap-4 hover:bg-[#1e293b] transition cursor-default">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">💳</div>
            <div>
              <h3 className="text-white font-bold text-sm">Facilidade</h3>
              <p className="text-slate-400 text-[10px]">Parcele em até 12x</p>
            </div>
          </div>
        </div>
      </div>

      {/* AVISO ANIMADO */}
      <div className="w-full flex justify-center mb-8 relative z-20 px-4">
        <div className="bg-cyan-950/40 backdrop-blur-md border border-cyan-500/30 rounded-full p-1 pl-2 pr-6 flex items-center gap-3 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-cyan-500/30 transition-all cursor-default animate-pulse">
            <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg animate-bounce leading-none pt-1">
            👇
            </div>
            <p className="text-cyan-200 font-bold text-sm md:text-base tracking-tight">
            Clique em um dos cards e escolha seu modelo!
            </p>
        </div>
      </div>

      {/* ÁREA DE ESCOLHA (Flex-col no mobile) */}
      <main id="categorias" className="w-full max-w-[1000px] mx-auto flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 px-4 relative z-10 scroll-mt-32">
        
        {/* === CARD 1: SEMINOVOS === */}
        <Link href="/categoria/seminovos" className="group relative w-[250px] h-[420px] bg-black rounded-[40px] border-[6px] border-[#1e293b] ring-1 ring-white/10 hover:ring-cyan-400 hover:-translate-y-2 transition-all duration-500 shadow-2xl shadow-cyan-900/20 overflow-hidden">
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 pointer-events-none flex items-center justify-center">
             <div className="w-12 h-1.5 bg-slate-900 rounded-full"></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0" />

          <img
            src="/SEGURANDO_IPHONE.jpeg"
            alt="Fundo Seminovos"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition duration-700 z-0 mix-blend-overlay"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 p-5 z-10 text-center bg-gradient-to-t from-black via-transparent to-transparent">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">
              Semi<span className="text-cyan-400">Novos</span>
            </h2>
            <p className="text-slate-400 text-[10px] mb-4 px-2">Revisados com rigoroso padrão de qualidade.</p>
            
            <span className="bg-cyan-500 text-black text-[10px] font-bold px-5 py-2.5 rounded-xl transform group-hover:scale-105 transition shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              VER ESTOQUE
            </span>
          </div>
        </Link>

        {/* Elemento decorativo central (Some no mobile) */}
        <div className="hidden md:flex flex-col items-center justify-center opacity-20">
            <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
            <span className="my-3 font-mono text-lg">OU</span>
            <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>

        {/* === CARD 2: NOVOS === */}
        <Link href="/categoria/novos" className="group relative w-[250px] h-[420px] bg-black rounded-[40px] border-[6px] border-[#1e293b] ring-1 ring-white/10 hover:ring-blue-500 hover:-translate-y-2 transition-all duration-500 shadow-2xl shadow-blue-900/20 overflow-hidden">
          
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 pointer-events-none flex items-center justify-center">
            <div className="w-12 h-1.5 bg-slate-900 rounded-full"></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black z-0" />

          <img
            src="/02_IPHONES.jpeg"
            alt="Fundo Novos"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition duration-700 z-0 mix-blend-overlay"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 p-5 z-10 text-center bg-gradient-to-t from-black via-transparent to-transparent">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1">
              Lacra<span className="text-blue-500">dos</span>
            </h2>
            <p className="text-slate-400 text-[10px] mb-4 px-2">Experiência completa Apple. Garantia Mundial.</p>
            
            <span className="bg-blue-600 text-white text-[10px] font-bold px-5 py-2.5 rounded-xl transform group-hover:scale-105 transition shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              VER MODELOS
            </span>
          </div>
        </Link>

      </main>

      {/* RODAPÉ RÁPIDO */}
      <footer className="mt-12 text-center">
        <p className="text-slate-600 text-xs">
           © 2025 MyAppleVix. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}