import React, { useState, useRef } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const RED        = '#C0392B';
const DARK       = '#1A1A18';
const MUTED      = '#6B6B65';
const LIGHT      = '#F7F7F5';
const BORDER     = '#DDDDDD';
const RED_LIGHT  = '#FAEAE8';
const GREEN_LIGHT= '#E8F5E9';

const styles = {
  '*': { boxSizing: 'border-box' },
  body: { margin: 0, fontFamily: 'Arial, sans-serif', background: '#FAFAF8', color: DARK },
};

const S = {
  app: { minHeight: '100vh', background: '#FAFAF8', fontFamily: 'Arial, sans-serif', color: DARK },

  header: { background: DARK, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontFamily: 'Georgia, serif', fontSize: 20, color: '#fff', margin: 0 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 },
  headerBadge: { fontSize: 11, color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: 20 },

  body: { maxWidth: 800, margin: '0 auto', padding: '36px 24px 80px' },

  tabs: { display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: 32 },
  tab: (active) => ({
    padding: '10px 20px', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase',
    color: active ? RED : MUTED, borderBottom: active ? `2px solid ${RED}` : '2px solid transparent',
    marginBottom: -1, cursor: 'default', fontWeight: active ? 600 : 400, background: 'none', border: 'none',
    borderBottom: active ? `2px solid ${RED}` : '2px solid transparent',
  }),

  card: { background: '#fff', border: `0.5px solid ${BORDER}`, borderRadius: 10, padding: 24, marginBottom: 20 },
  cardTitle: { fontFamily: 'Georgia, serif', fontSize: 18, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.6 },

  dropZone: (drag) => ({
    border: `1.5px dashed ${drag ? RED : BORDER}`, borderRadius: 8, padding: '36px 24px',
    textAlign: 'center', cursor: 'pointer', background: drag ? RED_LIGHT : LIGHT,
    position: 'relative', transition: 'all 0.2s',
  }),
  dropInput: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' },
  dropTitle: { fontSize: 14, fontWeight: 600, marginBottom: 4 },
  dropHint: { fontSize: 12, color: MUTED },

  fileList: { marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  fileItem: { display: 'flex', alignItems: 'center', gap: 10, background: RED_LIGHT, border: `0.5px solid rgba(192,57,43,0.2)`, borderRadius: 6, padding: '8px 14px', fontSize: 13 },
  fileName: { flex: 1, fontWeight: 600, color: RED },
  fileSize: { color: MUTED, fontSize: 12 },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 18, lineHeight: 1, padding: '0 4px' },

  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
  formGroupFull: { display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1 / -1' },
  label: { fontSize: 12, fontWeight: 600, color: MUTED, letterSpacing: '0.04em' },
  input: { border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: '9px 12px', fontFamily: 'Arial', fontSize: 13, color: DARK, outline: 'none' },
  select: { border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: '9px 12px', fontFamily: 'Arial', fontSize: 13, color: DARK, outline: 'none', background: '#fff' },
  textarea: { border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: '9px 12px', fontFamily: 'Arial', fontSize: 13, color: DARK, outline: 'none', resize: 'vertical' },

  scoreGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 },
  scoreItem: { background: LIGHT, border: `0.5px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px' },
  scorePillar: { fontSize: 11, fontWeight: 600, color: MUTED, letterSpacing: '0.05em', marginBottom: 6 },
  scoreLabel: { fontSize: 12, color: MUTED, marginBottom: 8, lineHeight: 1.4 },
  scoreValue: { fontFamily: 'Georgia, serif', fontSize: 22, color: RED, fontWeight: 600 },
  scoreHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  slider: { width: '100%', accentColor: RED },

  verdictBar: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '12px 16px', background: LIGHT, border: `0.5px solid ${BORDER}`, borderRadius: 8 },
  verdictLabel: { fontSize: 12, color: MUTED },
  verdictScore: { marginLeft: 'auto', fontFamily: 'Georgia, serif', fontSize: 18, color: DARK },

  infoNote: { background: '#EBF5FB', border: `0.5px solid #85C1E9`, borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#1A5276', marginBottom: 20, lineHeight: 1.6 },
  warnNote: { background: '#FEF9ED', border: `0.5px solid #E8C840`, borderRadius: 8, padding: '12px 16px', fontSize: 12, color: '#7A6000', marginBottom: 20, lineHeight: 1.6 },
  errorNote: { background: '#FDEDEC', border: `0.5px solid #F1948A`, borderRadius: 8, padding: '12px 16px', fontSize: 13, color: RED, marginBottom: 20 },

  btnRow: { display: 'flex', gap: 10, marginTop: 24 },
  btnPrimary: { background: DARK, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Arial' },
  btnPrimaryDisabled: { background: BORDER, color: MUTED, border: 'none', borderRadius: 6, padding: '10px 22px', fontSize: 13, fontWeight: 600, cursor: 'not-allowed', fontFamily: 'Arial' },
  btnOutline: { background: 'transparent', border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: '10px 22px', fontSize: 13, color: MUTED, cursor: 'pointer', fontFamily: 'Arial' },
  btnRed: { background: RED, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 22px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Arial' },

  genView: { textAlign: 'center', padding: '60px 24px' },
  spinner: { width: 36, height: 36, border: `2px solid ${BORDER}`, borderTopColor: RED, borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 0.8s linear infinite' },
  genTitle: { fontFamily: 'Georgia, serif', fontSize: 22, marginBottom: 8 },
  genStatus: { fontSize: 13, color: MUTED, marginBottom: 28 },
  progressSteps: { display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '0 auto', textAlign: 'left' },
  progressStep: (active, done) => ({ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: active ? RED : done ? MUTED : BORDER }),
  stepDot: (active, done) => ({ width: 6, height: 6, borderRadius: '50%', background: active ? RED : done ? MUTED : BORDER, flexShrink: 0 }),

  successView: { textAlign: 'center', padding: '60px 24px' },
  successIcon: { fontSize: 48, marginBottom: 16 },
  successTitle: { fontFamily: 'Georgia, serif', fontSize: 22, marginBottom: 8 },
  successDesc: { fontSize: 13, color: MUTED, marginBottom: 28 },
};

const PILLARS = [
  { id:'p1a', pillar:'Pillar 1', label:'1A — Sector Trajectory' },
  { id:'p1b', pillar:'Pillar 1', label:'1B — Sector Resilience' },
  { id:'p2a', pillar:'Pillar 2 ×2', label:'2A — Management Team' },
  { id:'p2b', pillar:'Pillar 2 ×2', label:'2B — Fund Size Track Record' },
  { id:'p2c', pillar:'Pillar 2 ×2', label:'2C — Investment Track Record' },
  { id:'p2d', pillar:'Pillar 2 ×2', label:'2D — Operational Value-Add' },
  { id:'p3a', pillar:'Pillar 3 ×2', label:'3A — Fund Strategy' },
  { id:'p3b', pillar:'Pillar 3 ×2', label:'3B — Fundraising & LP Quality' },
  { id:'p3c', pillar:'Pillar 3 ×2', label:'3C — IC Process & Structure' },
  { id:'p3d', pillar:'Pillar 3 ×2', label:'3D — Deal Sourcing' },
  { id:'p4a', pillar:'Pillar 4', label:'4A — Fund Terms' },
  { id:'p4b', pillar:'Pillar 4', label:'4B — LP Protections' },
];

const STEPS = ['Upload', 'Details', 'Scoring', 'Generate'];
const GEN_STEPS = [
  'Extracting PDF content',
  'Analysing fund structure & strategy',
  'Drafting Executive Summary',
  'Writing full body (Sections 1–8)',
  'Generating Word document',
];

function getVerdict(scores) {
  const p1 = (scores.p1a + scores.p1b) / 2;
  const p2 = (scores.p2a + scores.p2b + scores.p2c + scores.p2d) / 4;
  const p3 = (scores.p3a + scores.p3b + scores.p3c + scores.p3d) / 4;
  const p4 = (scores.p4a + scores.p4b) / 2;
  const final = (p1 + p2*2 + p3*2 + p4) / 6;
  const label = final<=2?'Pass':final<=3?'Needs Work':final<=4?'Conditional':'Recommend';
  const color = final<=2?'#C0392B':final<=3?'#E67E22':final<=4?'#2980B9':'#27AE60';
  return { final: final.toFixed(2), label, color };
}

export default function App() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const [meta, setMeta] = useState({ fundName:'', allocation:'', currency:'USD', writtenBy:'', endorsedBy:'', submissionDate:'', additionalContext:'' });
  const [scores, setScores] = useState({ p1a:3,p1b:3,p2a:3,p2b:3,p2c:3,p2d:3,p3a:3,p3b:3,p3c:3,p3d:3,p4a:3,p4b:3 });
  const [genStep, setGenStep] = useState(0);
  const [genStatus, setGenStatus] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef();

  const verdict = getVerdict(scores);

  function handleFiles(newFiles) {
    const pdfs = [...newFiles].filter(f => f.type === 'application/pdf');
    setFiles(prev => {
      const names = prev.map(f => f.name);
      return [...prev, ...pdfs.filter(f => !names.includes(f.name))];
    });
  }

  function removeFile(name) { setFiles(prev => prev.filter(f => f.name !== name)); }

  function fmt(bytes) {
    return bytes > 1024*1024 ? (bytes/1024/1024).toFixed(1)+' MB' : (bytes/1024).toFixed(0)+' KB';
  }

  async function generate() {
    setError('');
    setGenStep(1);
    setGenStatus(GEN_STEPS[0]);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));
      formData.append('meta', JSON.stringify(meta));
      formData.append('scores', JSON.stringify(scores));

      // Simulate progress steps while waiting
      let s = 1;
      const interval = setInterval(() => {
        s = Math.min(s + 1, GEN_STEPS.length);
        setGenStep(s);
        setGenStatus(GEN_STEPS[s - 1]);
      }, 18000); // ~18s per step

      const resp = await fetch(`${BACKEND_URL}/generate`, { method: 'POST', body: formData });

      clearInterval(interval);
      setGenStep(GEN_STEPS.length);
      setGenStatus('Finalising...');

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.detail || 'Generation failed');
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const fn = (meta.fundName || 'IC_Paper').replace(/[^a-z0-9]/gi,'_').slice(0,40) + '_IC_Paper.docx';
      setDownloadUrl(url);
      setFileName(fn);

      await new Promise(r => setTimeout(r, 800));
      setDone(true);

    } catch(e) {
      setError(e.message);
      setGenStep(0);
    }
  }

  function reset() {
    setStep(0); setFiles([]); setMeta({ fundName:'', allocation:'', currency:'USD', writtenBy:'', endorsedBy:'', submissionDate:'', additionalContext:'' });
    setScores({ p1a:3,p1b:3,p2a:3,p2b:3,p2c:3,p2d:3,p3a:3,p3b:3,p3c:3,p3d:3,p4a:3,p4b:3 });
    setGenStep(0); setError(''); setDone(false); setDownloadUrl(''); setFileName('');
  }

  return (
    <div style={S.app}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input:focus,select:focus,textarea:focus{border-color:${RED}!important;} input[type=range]{accent-color:${RED}}`}</style>

      <div style={S.header}>
        <div>
          <div style={S.headerTitle}>KK39 Ventures</div>
          <div style={S.headerSub}>IC Paper Generator</div>
        </div>
        <div style={S.headerBadge}>Internal Use Only</div>
      </div>

      <div style={S.body}>

        {/* Step tabs */}
        <div style={S.tabs}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ ...S.tab(i === step), borderBottom: i === step ? `2px solid ${RED}` : '2px solid transparent', marginBottom: -1 }}>
              {i+1} — {label}
            </div>
          ))}
        </div>

        {/* STEP 0: Upload */}
        {step === 0 && (
          <>
            <div style={S.card}>
              <div style={S.cardTitle}>Upload Fund Documents</div>
              <div style={S.cardDesc}>Upload the fund's pitch deck, PPM, LPA, or any due diligence materials. Multiple PDFs supported — there is no size limit.</div>
              <div
                style={S.dropZone(drag)}
                onDragOver={e=>{e.preventDefault();setDrag(true)}}
                onDragLeave={()=>setDrag(false)}
                onDrop={e=>{e.preventDefault();setDrag(false);handleFiles(e.dataTransfer.files)}}
                onClick={()=>fileInputRef.current.click()}
              >
                <input ref={fileInputRef} type="file" multiple accept=".pdf" style={S.dropInput} onChange={e=>handleFiles(e.target.files)} />
                <div style={{fontSize:28,marginBottom:10}}>📄</div>
                <div style={S.dropTitle}>Drop PDFs here or click to browse</div>
                <div style={S.dropHint}>PDF files only</div>
              </div>
              {files.length > 0 && (
                <div style={S.fileList}>
                  {files.map(f => (
                    <div key={f.name} style={S.fileItem}>
                      <span style={{color:RED}}>📄</span>
                      <span style={S.fileName}>{f.name}</span>
                      <span style={S.fileSize}>{fmt(f.size)}</span>
                      <button style={S.removeBtn} onClick={e=>{e.stopPropagation();removeFile(f.name)}}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={S.btnRow}>
              <button style={files.length>0?S.btnPrimary:S.btnPrimaryDisabled} disabled={files.length===0} onClick={()=>setStep(1)}>Continue →</button>
            </div>
          </>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <>
            <div style={S.card}>
              <div style={S.cardTitle}>Fund & Investment Details</div>
              <div style={S.cardDesc}>These details cannot be extracted from the documents — they will be inserted directly into the paper.</div>
              <div style={S.grid2}>
                <div style={S.formGroupFull}>
                  <label style={S.label}>Fund Name</label>
                  <input style={S.input} value={meta.fundName} onChange={e=>setMeta({...meta,fundName:e.target.value})} placeholder="e.g. Grafton Street Partners Fund, LP" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Proposed Allocation</label>
                  <input style={S.input} value={meta.allocation} onChange={e=>setMeta({...meta,allocation:e.target.value})} placeholder="e.g. US$ 5,000,000" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Currency</label>
                  <select style={S.select} value={meta.currency} onChange={e=>setMeta({...meta,currency:e.target.value})}>
                    <option value="USD">USD — US Dollar</option>
                    <option value="SGD">SGD — Singapore Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                  </select>
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Written By</label>
                  <input style={S.input} value={meta.writtenBy} onChange={e=>setMeta({...meta,writtenBy:e.target.value})} placeholder="e.g. Jason Tan" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Endorsed By</label>
                  <input style={S.input} value={meta.endorsedBy} onChange={e=>setMeta({...meta,endorsedBy:e.target.value})} placeholder="e.g. Sean Teo, Goh Wee Ping" />
                </div>
                <div style={S.formGroup}>
                  <label style={S.label}>Submission Date</label>
                  <input style={S.input} value={meta.submissionDate} onChange={e=>setMeta({...meta,submissionDate:e.target.value})} placeholder="e.g. 17th April 2026" />
                </div>
                <div style={S.formGroupFull}>
                  <label style={S.label}>Additional Context <span style={{color:MUTED,fontWeight:400}}>(optional)</span></label>
                  <textarea style={S.textarea} rows={3} value={meta.additionalContext} onChange={e=>setMeta({...meta,additionalContext:e.target.value})} placeholder="Any specific angles, concerns, or context you want the paper to address..." />
                </div>
              </div>
            </div>
            <div style={S.btnRow}>
              <button style={S.btnOutline} onClick={()=>setStep(0)}>← Back</button>
              <button style={S.btnPrimary} onClick={()=>setStep(2)}>Continue →</button>
            </div>
          </>
        )}

        {/* STEP 2: Scoring */}
        {step === 2 && (
          <>
            <div style={S.infoNote}>
              Scores are pre-set to 3.0 as a neutral baseline. Adjust any score before generating — the AI will incorporate your scores into the paper's scoring table and analytical commentary.
            </div>
            <div style={S.card}>
              <div style={S.cardTitle}>KK39 Scoring Framework</div>
              <div style={S.cardDesc}>4-pillar evaluation. Pillars 2 and 3 are double-weighted in the final score.</div>
              <div style={S.scoreGrid}>
                {PILLARS.map(p => (
                  <div key={p.id} style={S.scoreItem}>
                    <div style={S.scoreHeader}>
                      <span style={S.scorePillar}>{p.pillar}</span>
                      <span style={S.scoreValue}>{scores[p.id].toFixed(1)}</span>
                    </div>
                    <div style={S.scoreLabel}>{p.label}</div>
                    <input type="range" min="1" max="5" step="0.5" value={scores[p.id]}
                      onChange={e=>setScores({...scores,[p.id]:parseFloat(e.target.value)})} style={S.slider} />
                  </div>
                ))}
              </div>
              <div style={S.verdictBar}>
                <span style={S.verdictLabel}>Weighted Score</span>
                <span style={{fontSize:13,fontWeight:600,padding:'3px 12px',borderRadius:20,background:verdict.color+'20',color:verdict.color}}>{verdict.label}</span>
                <span style={S.verdictScore}>{verdict.final} / 5.00</span>
              </div>
            </div>
            <div style={S.btnRow}>
              <button style={S.btnOutline} onClick={()=>setStep(1)}>← Back</button>
              <button style={S.btnPrimary} onClick={()=>{setStep(3);generate()}}>Generate Paper →</button>
            </div>
          </>
        )}

        {/* STEP 3: Generating / Done */}
        {step === 3 && !done && (
          <div style={S.genView}>
            {error ? (
              <>
                <div style={{...S.errorNote, textAlign:'left'}}>⚠ {error}</div>
                <div style={S.btnRow} onClick={reset} style={{justifyContent:'center'}}>
                  <button style={S.btnOutline} onClick={reset}>← Start Over</button>
                </div>
              </>
            ) : (
              <>
                <div style={S.spinner} />
                <div style={S.genTitle}>Generating your IC paper</div>
                <div style={S.genStatus}>{genStatus}</div>
                <div style={S.progressSteps}>
                  {GEN_STEPS.map((label, i) => {
                    const active = genStep === i+1;
                    const done   = genStep > i+1;
                    return (
                      <div key={i} style={S.progressStep(active, done)}>
                        <div style={S.stepDot(active, done)} />
                        {label}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {step === 3 && done && (
          <div style={S.successView}>
            <div style={S.successIcon}>✅</div>
            <div style={S.successTitle}>Your IC paper is ready</div>
            <div style={S.successDesc}>
              The Word document includes the full paper with images extracted from your PDFs,<br />
              scoring table, EXCO approval blocks, and all 8 sections.
            </div>
            <div style={{display:'flex',gap:12,justifyContent:'center'}}>
              <a href={downloadUrl} download={fileName}>
                <button style={S.btnRed}>⬇ Download Word Doc</button>
              </a>
              <button style={S.btnOutline} onClick={reset}>Generate Another</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
