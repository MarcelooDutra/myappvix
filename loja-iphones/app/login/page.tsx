'use client'
import { useState } from 'react'
import { supabase } from '@/src/lib/supabase' 
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      })

      if (error) {
        setMsg('Erro: ' + error.message)
      } else {
        // Login sucesso -> Vai para o painel
        router.push('/admin')
      }
    } catch (err) {
      setMsg('Ocorreu um erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] p-4 relative overflow-hidden">
      
      {/* Elementos de Fundo (Decoração) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-[#1e293b] border border-slate-700/50 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                MyApple<span className="text-cyan-500">Admin</span>
            </h1>
            <p className="text-slate-400 text-sm">Entre para gerenciar seu estoque</p>
        </div>
        
        {msg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {msg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              className="w-full bg-[#0b1120] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@loja.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Senha</label>
            <input
              type="password"
              className="w-full bg-[#0b1120] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 transition placeholder-slate-600"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Entrando...' : 'Acessar Painel'}
          </button>
        </form>
        
        <div className="mt-8 text-center pt-6 border-t border-slate-700/50">
            <Link href="/" className="text-sm text-cyan-500 hover:text-cyan-400 font-bold transition flex items-center justify-center gap-2">
                ← Voltar para a Loja
            </Link>
        </div>
      </div>
    </div>
  )
}