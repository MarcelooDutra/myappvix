'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/src/lib/supabase'

export default function Configuracoes() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)

  // Campos
  const [nomeSite, setNomeSite] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  // 1. Carrega as configurações atuais (ID 1)
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

  // 2. Upload da Logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    const file = e.target.files[0]
    const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`

    const { error } = await supabase.storage
        .from('loja-imagens')
        .upload(fileName, file)

    if (!error) {
        const { data } = supabase.storage.from('loja-imagens').getPublicUrl(fileName)
        setLogoUrl(data.publicUrl)
    } else {
        alert('Erro no upload da logo')
    }
  }

  // 3. Salvar alterações
  const handleSalvar = async (e: React.FormEvent) => {
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
    if (error) alert('Erro ao salvar')
    else alert('Configurações atualizadas com sucesso!')
  }

  if (loading) return <p className="p-10">Carregando...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Configurações da Loja</h1>
            <button onClick={() => router.push('/admin')} className="text-sm text-gray-500 hover:underline">
                Voltar
            </button>
        </div>

        <form onSubmit={handleSalvar} className="flex flex-col gap-6">
            
            {/* Logo */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Logo do Site</label>
                <div className="flex items-center gap-4">
                    {logoUrl && (
                        <img src={logoUrl} alt="Logo" className="w-20 h-20 object-contain border rounded p-1" />
                    )}
                    <input type="file" onChange={handleLogoUpload} accept="image/*" />
                </div>
            </div>

            {/* Nome do Site */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Loja</label>
                <input 
                    type="text" 
                    value={nomeSite} 
                    onChange={e => setNomeSite(e.target.value)}
                    className="w-full border p-3 rounded"
                />
            </div>

            {/* WhatsApp */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Número do WhatsApp (apenas números)</label>
                <input 
                    type="text" 
                    value={whatsapp} 
                    onChange={e => setWhatsapp(e.target.value)}
                    placeholder="5521999999999"
                    className="w-full border p-3 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">Coloque o código do país (55) e o DDD.</p>
            </div>

            <button 
                type="submit" 
                disabled={salvando}
                className="bg-black text-white py-3 rounded font-bold hover:bg-gray-800"
            >
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </form>
      </div>
    </div>
  )
}