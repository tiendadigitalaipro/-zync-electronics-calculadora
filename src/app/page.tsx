'use client'
import { useState, useMemo, useCallback } from 'react'

const fmtUSD = (v: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2}).format(v)

const fmtVE = (v: number) => {
  const [i,d] = v.toFixed(2).split('.')
  return i.replace(/\B(?=(\d{3})+(?!\d))/g,'.') + ',' + d + ' Bs'
}

function Corner(props: {pos: string}) {
  const p = props.pos
  let s: React.CSSProperties = {position:'absolute',width:'18px',height:'18px'}
  if (p === 'tl') { s.top = 0; s.left = 0; s.borderTop = '2px solid #D4AF37'; s.borderLeft = '2px solid #D4AF37'; s.borderTopLeftRadius = '10px' }
  if (p === 'tr') { s.top = 0; s.right = 0; s.borderTop = '2px solid #D4AF37'; s.borderRight = '2px solid #D4AF37'; s.borderTopRightRadius = '10px' }
  if (p === 'bl') { s.bottom = 0; s.left = 0; s.borderBottom = '2px solid #D4AF37'; s.borderLeft = '2px solid #D4AF37'; s.borderBottomLeftRadius = '10px' }
  if (p === 'br') { s.bottom = 0; s.right = 0; s.borderBottom = '2px solid #D4AF37'; s.borderRight = '2px solid #D4AF37'; s.borderBottomRightRadius = '10px' }
  return <div style={s}/>
}

export default function Calc() {
  const [dark, setDark] = useState(true)
  const [bcv, setBcv] = useState(78)
  const [usdt, setUsdt] = useState(78.5)
  const [p2p, setP2p] = useState(681.69)
  const [costUSD, setCostUSD] = useState('')
  const [quantity, setQuantity] = useState('')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')

  const cbm = useMemo(() => {
    const l = parseFloat(length) || 0
    const w = parseFloat(width) || 0
    const h = parseFloat(height) || 0
    if (l === 0 || w === 0 || h === 0) return 0
    return (l * w * h) / 1000000
  }, [length, width, height])

  const calc = useMemo(() => {
    const c = parseFloat(costUSD) || 0
    const q = parseInt(quantity) || 0
    const cif = c * q
    const seg = cif * 0.015
    const ar = cif * 0.15
    const ice = cif * 0.10
    const iva = (cif + ar + ice) * 0.16
    const ti = seg + ar + ice + iva
    const cf = 15
    const total = cif + ti + cf
    const pv = total * 1.30
    const pvebs = pv * p2p
    return { cif, seg, ar, ice, iva, ti, cf, total, pv, pvebs, ok: c > 0 && q > 0 }
  }, [costUSD, quantity, p2p])

  const th = dark ? 'dark' : 'light'

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)',
    borderRadius: '8px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '15px',
    fontWeight: 600, outline: 'none', transition: 'border-color 0.2s'
  }
  const cardBg = 'var(--bg-secondary)'

  const rows = [
    { n: 1, lb: 'CIF (Costo \u00d7 Cantidad)', v: calc.cif, b: false },
    { n: 2, lb: 'Seguro (1.5%)', v: calc.seg, b: false },
    { n: 3, lb: 'Arancel (15%)', v: calc.ar, b: false },
    { n: 4, lb: 'ICE (10%)', v: calc.ice, b: false },
    { n: 5, lb: 'IVA 16%', v: calc.iva, b: false },
    { n: 6, lb: 'Total Impuestos', v: calc.ti, b: true },
    { n: 7, lb: 'Costos Fijos', v: calc.cf, b: false },
    { n: 8, lb: 'TOTAL GENERAL USD', v: calc.total, b: true },
  ]

  const numInp = (val: string, setter: (v: string) => void, extra: React.CSSProperties = {}) => (
    <input
      type="number"
      value={val}
      onChange={(e) => setter(e.target.value)}
      style={{ ...inputStyle, ...extra }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)' }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)' }}
    />
  )

  return (
    <div data-theme={th} style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '3px', color: 'var(--text-primary)', lineHeight: 1.1 }}>
              ZYNC ELECTRONICS
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1.5px', marginTop: '4px', textTransform: 'uppercase' }}>
              Calculadora de Importaci\u00f3n
            </p>
          </div>
          <button
            onClick={() => setDark(!dark)}
            style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: cardBg, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}
          >
            {dark ? '\u2600\ufe0f' : '\ud83c\udf19'}
          </button>
        </header>

        {/* Rate Cards */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {([
            ['BCV', 'Banco Central', bcv, setBcv],
            ['USDT', 'Tether', usdt, setUsdt],
            ['P2P', 'Efectivo', p2p, setP2p],
          ] as [string, string, number, (v: number) => void][]).map(([lb, sl, val, setter]) => (
            <div key={lb} style={{ background: cardBg, border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '1.2px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>{lb}</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px' }}>{sl}</div>
              <input
                type="number"
                value={val}
                onChange={(e) => { const n = parseFloat(e.target.value); if (!isNaN(n) && n >= 0) setter(n) }}
                style={{ ...inputStyle, padding: '6px 4px', color: 'var(--gold)', fontSize: '14px', textAlign: 'center' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)' }}
                step="0.01" min="0"
              />
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '3px' }}>Bs/USD</div>
            </div>
          ))}
        </section>

        {/* Product Form */}
        <section style={{ background: cardBg, border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
            Datos del Producto
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Costo USD</label>
              {numInp(costUSD, setCostUSD)}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Cantidad</label>
              {numInp(quantity, setQuantity)}
            </div>
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Dimensiones (cm)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '6px', alignItems: 'center' }}>
              {numInp(length, setLength, { padding: '10px 8px', fontSize: '14px', textAlign: 'center' })}
              <span style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 300 }}>\u00d7</span>
              {numInp(width, setWidth, { padding: '10px 8px', fontSize: '14px', textAlign: 'center' })}
              <span style={{ color: 'var(--text-muted)', fontSize: '16px', fontWeight: 300 }}>\u00d7</span>
              {numInp(height, setHeight, { padding: '10px 8px', fontSize: '14px', textAlign: 'center' })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>CBM</label>
              <div style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 12px', color: cbm > 0 ? 'var(--gold)' : 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>
                {cbm > 0 ? cbm.toFixed(6) : '0.000000'}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Peso (kg)</label>
              {numInp(weight, setWeight)}
            </div>
          </div>
        </section>

        {/* Receipt */}
        {calc.ok && (
          <section style={{ background: cardBg, border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)' }}>
              Desglose de Costos
            </h2>
            {rows.map((r) => (
              <div key={r.n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: r.n < 8 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: r.b ? 'rgba(212,175,55,0.15)' : 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: r.b ? 'var(--gold)' : 'var(--text-muted)' }}>{r.n}</span>
                  <span style={{ fontSize: '13px', fontWeight: r.b ? 700 : 500, color: r.b ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{r.lb}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: r.b ? 700 : 600, color: r.b ? 'var(--text-primary)' : 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{fmtUSD(r.v)}</span>
              </div>
            ))}
          </section>
        )}

        {/* PRECIO DE VENTA REC. */}
        {calc.ok && (
          <section style={{ position: 'relative', background: cardBg, borderRadius: '12px', padding: '28px 24px', marginBottom: '24px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '12px', padding: '2px', background: 'linear-gradient(160deg, #e8cc6e, #D4AF37, #b8962e)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none' }} />
            <Corner pos="tl" />
            <Corner pos="tr" />
            <Corner pos="bl" />
            <Corner pos="br" />
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                9. Precio de Venta Recomendado
              </div>
              <div style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.1, marginBottom: '10px', background: 'linear-gradient(160deg, #e8cc6e, #D4AF37, #b8962e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {fmtUSD(calc.pv)}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                {fmtVE(calc.pvebs)}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', letterSpacing: '0.5px' }}>
                * Tasa P2P Efectivo ({p2p.toFixed(2)} Bs/USD)
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '20px 0', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            ZYNC ELECTRONICS &copy; 2025
          </p>
        </footer>

      </div>
    </div>
  )
}
