'use client'
import { useState } from 'react'
import { supabase } from '@/src/lib/supabase' 
import { useRouter } from 'next/navigation'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Administrativo</h1>
        
        {msg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {msg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded focus:outline-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@loja.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
            <input
              type="password"
              className="w-full border p-2 rounded focus:outline-blue-500"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="******"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white py-2 rounded font-bold hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
            <a href="/" className="text-sm text-gray-500 hover:underline">← Voltar para a loja</a>
        </div>
      </div>
    </div>
  )
}