'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Função para verificar a sessão atual
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Se não tem sessão, manda pro login
        router.replace('/login')
      } else {
        // Se tem sessão, libera o acesso
        setIsAuthorized(true)
      }
    }

    checkAuth()

    // Opcional: Ouvir mudanças na autenticação (ex: logout em outra aba)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
            router.replace('/login')
        }
    })

    return () => {
        subscription.unsubscribe()
    }
  }, [router])

  // Enquanto verifica, mostra um Loading (Tela preta com spinner)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
        <p className="text-slate-400 text-sm animate-pulse">Verificando credenciais...</p>
      </div>
    )
  }

  // Se autorizado, renderiza as páginas administrativas (Dashboard, Novo, etc.)
  return <>{children}</>
}