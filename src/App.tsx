import { useState } from 'react'
import { jsPDF } from 'jspdf'
import './App.css'
import reactLogoUrl from './assets/recipe1.jpg'

type FormState = {
  name: string
  company: string
  department: string
  title: string
}

export default function App() {
  const [form, setForm] = useState<FormState>({ name: '', company: '', department: '', title: '' })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const doc = new jsPDF()
    try {
      const dataUrl = await toDataUrl(reactLogoUrl, 'image/jpeg')
      doc.addImage(dataUrl, 'JPEG', 0, 0, 210, 297)
    } catch {}
    doc.setFontSize(26)
    doc.setTextColor(92, 76, 76)
    doc.text(form.name || '', 23, 81)
    doc.text(form.company || '', 23, 122)
    doc.text(form.department || '', 23, 162)
    doc.text(form.title || '', 23, 202)
    doc.save('test.pdf')
  }

  async function toDataUrl(url: string, mime: 'image/png' | 'image/jpeg' = 'image/png') {
    const img = await loadImage(url)
    const width = img.naturalWidth || 256
    const height = img.naturalHeight || 256
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context not available')
    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL(mime)
  }

  function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image: ' + url))
      img.src = url
    })
  }

  return (
    <div className="card">
      <h1>jsPDF Tutorial - Form Filling</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, minWidth: 280 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} />
        <input name="company" placeholder="Company" value={form.company} onChange={onChange} />
        <input name="department" placeholder="Department" value={form.department} onChange={onChange} />
        <input name="title" placeholder="Job Title" value={form.title} onChange={onChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}
