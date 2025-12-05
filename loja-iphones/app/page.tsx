import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Container Largo (max-w-6xl) e com justify-between para separar os cards */}
      <div className="w-full max-w-[1200px] z-10 flex flex-col md:flex-row justify-between items-center gap-20 px-4 md:px-12">
        {/* Título removido para não atrapalhar a logo no meio */}

        {/* === CARD 1: SEMINOVOS (MÉDIO - ESQUERDA) === */}
        {/* w-[240px] h-[480px]: Tamanho ideal para ver a logo no meio */}
        <Link href="/categoria/seminovos" className="group relative w-[240px] h-[480px] bg-black rounded-[40px] border-[6px] border-[#0f2442] ring-2 ring-cyan-500/50 hover:ring-cyan-400 hover:scale-[1.02] transition-all shadow-[0_0_35px_rgba(0,200,255,0.2)] overflow-hidden">

          {/* Ilha Dinâmica */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 pointer-events-none"></div>

          {/* Fundo Cor */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f2442] to-[#000000] z-0" />

          {/* Fundo Imagem */}
          <img
            src="/SEGURANDO_IPHONE.jpeg"
            alt="Fundo Seminovos"
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition duration-500 z-0 mix-blend-overlay"
          />

          {/* Conteúdo Vertical */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 p-5 z-10 text-center">
            <div className="text-5xl mb-3 text-cyan-400 drop-shadow-lg group-hover:-translate-y-2 transition duration-500">
              📱
            </div>

            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider drop-shadow-md leading-none mb-2">
              iPhones <br /><span className="text-cyan-400">Seminovos</span>
            </h2>

            <div className="w-8 h-1 bg-cyan-500 rounded-full my-3"></div>

            <p className="text-slate-300 text-[10px] font-medium opacity-80 uppercase tracking-widest leading-tight">
              Revisados<br />Garantia
            </p>

            {/* Botão simulado */}
            <div className="mt-5 text-[10px] bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 px-5 py-2 rounded-full font-bold group-hover:bg-cyan-500 group-hover:text-black transition">
              VER ESTOQUE
            </div>
          </div>
        </Link>


        {/* === CARD 2: NOVOS (MÉDIO - DIREITA) === */}
        <Link href="/categoria/novos" className="group relative w-[240px] h-[480px] bg-black rounded-[40px] border-[6px] border-[#0a1525] ring-2 ring-blue-500/50 hover:ring-blue-400 hover:scale-[1.02] transition-all shadow-[0_0_35px_rgba(0,100,255,0.2)] overflow-hidden">

          {/* Ilha Dinâmica */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20 pointer-events-none"></div>

          {/* Fundo Cor */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1525] to-[#000000] z-0" />

          {/* Fundo Imagem */}
          <img
            src="/02_IPHONES.jpeg"
            alt="Fundo Novos"
            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition duration-500 z-0 mix-blend-overlay"
          />

          {/* Conteúdo Vertical */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 p-5 z-10 text-center">
            <div className="text-5xl mb-3 text-blue-500 drop-shadow-lg group-hover:-translate-y-2 transition duration-500">
              ✨
            </div>

            <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider drop-shadow-md leading-none mb-2">
              iPhones <br /><span className="text-blue-500">Novos</span>
            </h2>

            <div className="w-8 h-1 bg-blue-500 rounded-full my-3"></div>

            <p className="text-slate-300 text-[10px] font-medium opacity-80 uppercase tracking-widest leading-tight">
              Lacrados<br />1 Ano Apple
            </p>

            {/* Botão simulado */}
            <div className="mt-5 text-[10px] bg-blue-500/20 border border-blue-500/50 text-blue-300 px-5 py-2 rounded-full font-bold group-hover:bg-blue-500 group-hover:text-black transition">
              VER ESTOQUE
            </div>
          </div>
        </Link>

      </div>
    </main>
  )
}