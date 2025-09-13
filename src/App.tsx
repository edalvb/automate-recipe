import { useState } from 'react'
import { jsPDF } from 'jspdf'
import './App.css'

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const doc = new jsPDF()
    const lines = [
      `Name: ${form.name}`,
      `Company: ${form.company}`,
      `Department: ${form.department}`,
      `Job Title: ${form.title}`
    ]
    let y = 20
    doc.setFontSize(14)
    doc.text('Form Data', 20, y)
    y += 12
    doc.setFontSize(12)
    lines.forEach(line => {
      doc.text(line, 20, y)
      y += 8
    })
    doc.save('form.pdf')
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
