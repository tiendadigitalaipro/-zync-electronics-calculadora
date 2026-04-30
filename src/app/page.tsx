'use client';
import { useState, useEffect } from 'react';

function fmtVE(n) {
  if (!isFinite(n) || isNaN(n)) return '0,00';
  var f = Math.abs(n).toFixed(2).split('.');
  return (n < 0 ? '-' : '') + f[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + f[1];
}

function fmtUSD(n) {
  if (!isFinite(n) || isNaN(n)) return '$0.00';
  return '$' + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function Home() {
  const [dark, setDark] = useState(true);
  const [rates, setRates] = useState({ bcv: 570.75, usdt: 630, efectiva: 681.69 });
  const [mode, setMode] = useState('efectiva');
  const [prod, setProd] = useState({ nombre: '', costo: 0, peso: 0, largo: 0, ancho: 0, alto: 0, cant: 1 });
  const [margen, setMargen] = useState(30);
  const [fCBM, setFCBM] = useState(85);

  useEffect(() => { var s = localStorage.getItem('zync_dark'); if (s !== null) setDark(s === 'true'); }, []);
  useEffect(() => { localStorage.setItem('zync_dark', String(dark)); }, [dark]);

  var tasa = rates[mode];
  var tasaNombre = mode === 'bcv' ? 'BCV Oficial' : mode === 'usdt' ? 'USDT' : 'P2P Efectiva';
  var cbm = (prod.largo > 0 && prod.ancho > 0 && prod.alto > 0) ? (prod.largo * prod.ancho * prod.alto) / 1e6 : 0;
  var cbmTotal = cbm * prod.cant;
  var fleteUSD = cbmTotal * fCBM;
  var costoUSD = prod.costo * prod.cant;
  var cif = costoUSD + fleteUSD;
  var seguro = cif * 0.015;
  var arancel = cif * 0.15;
  var ice = cif * 0.10;
  var iva = (cif + arancel + ice) * 0.16;
  var gastosAdv = 35, almacenaje = 15, transporte = 25;
  var totalUSD = costoUSD + fleteUSD + seguro + arancel + ice + iva + gastosAdv + almacenaje + transporte;
  var precioVenta = totalUSD * (1 + margen / 100);
  var mostrar = costoUSD > 0 || fleteUSD > 0;

  var bg = dark ? '#0c0e18' : '#f2f3f7';
  var card = dark ? 'rgba(18,22,38,0.97)' : 'rgba(255,255,255,0.98)';
  var border = dark ? 'rgba(212,175,55,0.10)' : 'rgba(212,175,55,0.20)';
  var tp = dark ? '#eae8e4' : '#18182e';
  var ts = dark ? '#7e8088' : '#6b7280';
  var inputBg = dark ? '#121628' : '#ffffff';
  var inputBrd = dark ? '#282d44' : '#d1d5db';
  var gold = '#D4AF37', goldL = '#e8cc6e', goldD = '#b8962e';
  var subBg = dark ? '#161a2c' : '#f8f9fb';
  var divColor = dark ? 'rgba(212,175,55,0.07)' : 'rgba(212,175,55,0.13)';
  var shadow = dark ? '0 4px 32px rgba(0,0,0,0.25)' : '0 2px 16px rgba(0,0,0,0.06)';
  var cardStyle = { background: card, border: '1px solid ' + border, borderRadius: 16, padding: 24, marginBottom: 20, backdropFilter: 'blur(12px)', boxShadow: shadow };
  var inputStyle = { width: '100%', background: inputBg, border: '1px solid ' + inputBrd, borderRadius: 10, padding: '11px 14px', fontSize: 14, color: tp, outline: 'none', boxSizing: 'border-box' };
  var labelStyle = { display: 'block', fontSize: 11, fontWeight: 500, color: ts, marginBottom: 6 };

  function Linea({ n, d, u, s }) {
    return (
      <div style={{ padding: '7px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 12, color: tp }}>
            <span style={{ color: ts, fontSize: 10, marginRight: 8 }}>{n}.</span>{d}
          </span>
          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: tp }}>{fmtUSD(u)}</span>
            <span style={{ fontSize: 11, color: ts, marginLeft: 8 }}>Bs {fmtVE(u * tasa)}</span>
          </div>
        </div>
        {s && <div style={{ fontSize: 10, color: ts, paddingLeft: 26, marginTop: 1, opacity: 0.7 }}>{s}</div>}
      </div>
    );
  }

  return (
    <div style={{ background: bg, color: tp, minHeight: '100vh', fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <header style={{ background: dark ? 'linear-gradient(180deg,rgba(12,14,24,0.98),rgba(12,14,24,0.92))' : 'linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,243,247,0.95))', borderBottom: '1px solid ' + border, padding: '16px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(145deg,' + goldL + ',' + gold + ',' + goldD + ')', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#0c0e18', boxShadow: '0 0 24px rgba(212,175,55,0.25)' }}>Z</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '1.5px', color: gold }}>ZYNC ELECTRONICS</div>
              <div style={{ fontSize: 9, color: ts, letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: 1 }}>Calculadora de Importaciones</div>
            </div>
          </div>
          <button onClick={() => setDark(!dark)} style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: '1px solid ' + border, borderRadius: 10, color: ts, cursor: 'pointer', padding: '8px 14px', fontSize: 12 }}>
            {dark ? '\u2600\uFE0F Claro' : '\uD83C\uDF19 Oscuro'}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: '0 auto', padding: '24px 20px 60px' }}>
        <section style={cardStyle}>
          <h2 style={{ fontSize: 11, fontWeight: 600, color: ts, textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 18 }}>\u2699\uFE0F Tasas de Cambio</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[{ k: 'bcv', l: 'BCV Oficial', i: '\uD83C\uDFE6' }, { k: 'usdt', l: 'USDT', i: '\uD83D\uDCB1' }, { k: 'efectiva', l: 'P2P Efectiva', i: '\uD83E\uDD1D' }].map(r => (
              <div key={r.k} style={{ background: mode === r.k ? 'linear-gradient(145deg,rgba(212,175,55,0.14),rgba(212,175,55,0.04))' : subBg, border: mode === r.k ? '1.5px solid ' + gold : '1px solid ' + inputBrd, borderRadius: 12, padding: '16px 16px 12px', cursor: 'pointer' }} onClick={() => setMode(r.k)}>
                <div style={{ fontSize: 10, color: ts, marginBottom: 6 }}>{r.i} {r.l}</div>
                <input type="number" value={rates[r.k]} onChange={e => setRates({ ...rates, [r.k]: parseFloat(e.target.value) || 0 })} onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: tp, fontSize: 22, fontWeight: 700 }} step="0.01" />
                <div style={{ fontSize: 9, color: ts, marginTop: 2 }}>Bs / USD</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '8px 12px', borderRadius: 8, background: subBg, fontSize: 11, color: ts, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: gold }} />
            Tasa activa: <b style={{ color: gold }}>{tasaNombre}</b> — {fmtVE(tasa)} Bs/$           </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ fontSize: 11, fontWeight: 600, color: ts, textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 18 }}>\uD83D\uDCE6 Datos del Producto</h2>
          <input placeholder="Nombre del producto" value={prod.nombre} onChange={e => setProd({ ...prod, nombre: e.target.value })} style={{ ...inputStyle, marginBottom: 14 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><label style={labelStyle}>Costo Unitario (USD)</label><input type="number" value={prod.costo || ''} onChange={e => setProd({ ...prod, costo: parseFloat(e.target.value) || 0 })} placeholder="0.00" style={inputStyle} step="0.01" /></div>
            <div><label style={labelStyle}>Cantidad</label><input type="number" value={prod.cant || ''} onChange={e => setProd({ ...prod, cant: parseInt(e.target.value) || 0 })} placeholder="1" style={inputStyle} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div><label style={labelStyle}>Peso Unitario (kg)</label><input type="number" value={prod.peso || ''} onChange={e => setProd({ ...prod, peso: parseFloat(e.target.value) || 0 })} placeholder="0.00" style={inputStyle} step="0.01" /></div>
            <div><label style={labelStyle}>Volumen (CBM)</label><div style={{ ...inputStyle, display: 'flex', alignItems: 'center', color: cbmTotal > 0 ? gold : ts, fontWeight: cbmTotal > 0 ? 600 : 400 }}>{cbmTotal > 0 ? cbmTotal.toFixed(4) + ' m\u00B3' : '\u2014'}</div></div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Dimensiones unitarias (cm)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <input type="number" value={prod.largo || ''} onChange={e => setProd({ ...prod, largo: parseFloat(e.target.value) || 0 })} placeholder="Largo" style={inputStyle} step="0.1" />
              <input type="number" value={prod.ancho || ''} onChange={e => setProd({ ...prod, ancho: parseFloat(e.target.value) || 0 })} placeholder="Ancho" style={inputStyle} step="0.1" />
              <input type="number" value={prod.alto || ''} onChange={e => setProd({ ...prod, alto: parseFloat(e.target.value) || 0 })} placeholder="Alto" style={inputStyle} step="0.1" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>Flete mar\u00EDtimo (USD/CBM)</label><input type="number" value={fCBM || ''} onChange={e => setFCBM(parseFloat(e.target.value) || 0)} placeholder="85" style={inputStyle} /></div>
            <div><label style={labelStyle}>Margen de ganancia (%)</label><input type="number" value={margen || ''} onChange={e => setMargen(parseFloat(e.target.value) || 0 })} placeholder="30" style={inputStyle} /></div>
          </div>
        </section>

        {!mostrar ? (
          <div style={{ ...cardStyle, textAlign: 'center', padding: '50px 24px' }}>
            <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.8 }}>\uD83D\uDCE6</div>
            <div style={{ fontSize: 14, color: ts, fontWeight: 500 }}>Ingresa el costo del producto para ver el recibo</div>
          </div>
        ) : (
          <section style={{ background: card, border: '1px solid ' + border, borderRadius: 16, overflow: 'hidden', boxShadow: shadow }}>
            <div style={{ background: 'linear-gradient(145deg,rgba(212,175,55,0.10),rgba(212,175,55,0.03))', borderBottom: '1px solid ' + divColor, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 11, fontWeight: 600, color: ts, textTransform: 'uppercase', letterSpacing: '2.5px' }}>\uD83D\uDCCB Recibo de Importaci\u00F3n</h2>
                <span style={{ fontSize: 9, padding: '5px 12px', borderRadius: 20, fontWeight: 700, background: 'linear-gradient(145deg,' + goldL + ',' + gold + ',' + goldD + ')', color: '#0c0e18' }}>{tasaNombre} \u00B7 {fmtVE(tasa)} Bs/$</span>
              </div>
              {prod.nombre && <div style={{ marginTop: 10, fontSize: 15, fontWeight: 600 }}>{prod.nombre}{prod.cant > 1 ? ' (\u00D7' + prod.cant + ' uds)' : ''}</div>}
            </div>
            <div style={{ padding: '16px 24px 24px' }}>
              <Linea n={1} d="Costo del Producto" u={costoUSD} />
              <Linea n={2} d="Flete Mar\u00EDtimo" u={fleteUSD} s={cbmTotal > 0 ? cbmTotal.toFixed(4) + ' CBM' : undefined} />
              <Linea n={3} d="Seguro (1.5% CIF)" u={seguro} />
              <div style={{ height: 1, background: divColor, margin: '6px 0' }} />
              <Linea n={4} d="Arancel Aduanero (15% CIF)" u={arancel} />
              <Linea n={5} d="ICE (10% CIF)" u={ice} />
              <Linea n={6} d="IVA (16%)" u={iva} s="sobre CIF + Arancel + ICE" />
              <div style={{ height: 1, background: divColor, margin: '6px 0' }} />
              <Linea n={7} d="Gastos Aduanales (fijo)" u={gastosAdv} />
              <Linea n={8} d="Almacenaje (fijo)" u={almacenaje} />
              <Linea n={9} d="Transporte Terrestre (fijo)" u={transporte} />
              <div style={{ height: 1, background: divColor, margin: '6px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>COSTO TOTAL NACIONALIZADO</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{fmtUSD(totalUSD)}</div>
                  <div style={{ fontSize: 11, color: ts }}>Bs {fmtVE(totalUSD * tasa)}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, borderRadius: 16, background: 'linear-gradient(160deg,rgba(212,175,55,0.12),rgba(184,150,46,0.06))', border: '1.5px solid rgba(212,175,55,0.22)', padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 8, left: 8, width: 28, height: 28, borderTop: '2px solid ' + gold, borderLeft: '2px solid ' + gold, borderRadius: '4px 0 0 0', opacity: 0.35 }} />
                <div style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderTop: '2px solid ' + gold, borderRight: '2px solid ' + gold, borderRadius: '0 4px 0 0', opacity: 0.35 }} />
                <div style={{ position: 'absolute', bottom: 8, left: 8, width: 28, height: 28, borderBottom: '2px solid ' + gold, borderLeft: '2px solid ' + gold, borderRadius: '0 0 0 4px', opacity: 0.35 }} />
                <div style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderBottom: '2px solid ' + gold, borderRight: '2px solid ' + gold, borderRadius: '0 0 4px 0', opacity: 0.35 }} />
                <div style={{ fontSize: 9, fontWeight: 700, color: goldD, textTransform: 'uppercase', letterSpacing: '3.5px', marginBottom: 10 }}>\u2726 Precio de Venta Recomendado \u2726</div>
                <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.1, marginBottom: 6, background: 'linear-gradient(160deg,' + goldL + ' 0%,' + gold + ' 40%,' + goldD + ' 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontVariantNumeric: 'tabular-nums', filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.2))' }}>{fmtUSD(precioVenta)}</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: ts, fontVariantNumeric: 'tabular-nums', marginBottom: 14 }}>Bs {fmtVE(precioVenta * tasa)}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10, color: ts, background: subBg, padding: '5px 14px', borderRadius: 20, border: '1px solid ' + divColor }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: gold }} />
                  Tasa {tasaNombre}: {fmtVE(tasa)} Bs/$ \u00B7 Margen: {margen}%
                </div>
              </div>
            </div>
          </section>
        )}
        <footer style={{ textAlign: 'center', padding: '32px 0', fontSize: 9, color: ts, opacity: 0.4, letterSpacing: '1.5px' }}>ZYNC ELECTRONICS \u00A9 {new Date().getFullYear()}</footer>
      </main>
    </div>
  );
}
