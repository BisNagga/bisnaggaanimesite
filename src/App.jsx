import React, { useEffect, useMemo, useState } from 'react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYdHwJbTvkL6Y0Hvb5Ya1v8zltDer2Whk62yNs9-IGt4PZlYn9jJY6yavN3budQFqR/exec';

const initialState = {
  config: {
    appsScriptUrl: APPS_SCRIPT_URL,
    backendMode: 'apps-script',
    formsSheetName: 'IMPORTACAO_FORMULARIO_MEDICOS',
    shiftsSheetName: 'PLANTOES',
    hospitalsSheetName: 'HOSPITAIS',
    payoutsSheetName: 'PAGAMENTOS',
    calendarEnabled: true,
  },
  doctors: [],
  hospitals: [],
  shifts: [],
  payments: [],
};

const money = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0));
const uid = () => crypto?.randomUUID?.() || Math.random().toString(36).slice(2);

async function apiRequest(action, payload = {}) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload }),
  });
  const json = await res.json();
  if (!res.ok || json.ok === false) throw new Error(json.message || 'Erro de integração');
  return json;
}

function App() {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState('Conectando ao backend...');
  const [tab, setTab] = useState('dashboard');
  const [doctorForm, setDoctorForm] = useState({ nome_completo: '', crm: '', uf_crm: 'SP', especialidade: '', telefone: '', email: '', cpf: '', banco: '', agencia: '', conta: '', tipo_conta: 'Corrente', chave_pix: '', favorecido: '', forma_pagamento_preferida: 'PIX', observacoes: '' });
  const [hospitalForm, setHospitalForm] = useState({ nome_hospital: '', cidade: '', estado: 'SP', prazo_padrao_dias: 15, forma_fechamento: '', contato_financeiro: '', email_financeiro: '', telefone_financeiro: '', observacoes: '' });
  const [shiftForm, setShiftForm] = useState({ medico_id: '', hospital_id: '', data_plantao: '', hora_inicio: '07:00', hora_fim: '19:00', turno: 'Diurno', setor: '', valor_base: '', observacoes: '' });

  const refresh = async () => {
    try {
      const data = await apiRequest('getBootstrapData');
      setState((s) => ({ ...s, ...data, config: { ...s.config, ...data.config, appsScriptUrl: APPS_SCRIPT_URL } }));
      setStatus('Conectado ao Apps Script.');
    } catch (e) {
      setStatus(`Falha ao carregar dados: ${e.message}`);
    }
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (!shiftForm.medico_id && state.doctors[0]) setShiftForm((f) => ({ ...f, medico_id: state.doctors[0].medico_id }));
    if (!shiftForm.hospital_id && state.hospitals[0]) setShiftForm((f) => ({ ...f, hospital_id: state.hospitals[0].hospital_id }));
  }, [state.doctors, state.hospitals]);

  const stats = useMemo(() => {
    const totalAPagar = state.shifts.filter((s) => s.status_servico === 'cumprido' && s.status_pagamento !== 'pago').reduce((acc, s) => acc + Number(s.saldo_liquido || 0), 0);
    const totalPago = state.payments.reduce((acc, p) => acc + Number(p.valor_pago || 0), 0);
    return { totalAPagar, totalPago };
  }, [state.shifts, state.payments]);

  const saveDoctor = async () => {
    await apiRequest('upsertDoctor', { ...doctorForm, ativo: true, origem_cadastro: 'manual' });
    setDoctorForm({ nome_completo: '', crm: '', uf_crm: 'SP', especialidade: '', telefone: '', email: '', cpf: '', banco: '', agencia: '', conta: '', tipo_conta: 'Corrente', chave_pix: '', favorecido: '', forma_pagamento_preferida: 'PIX', observacoes: '' });
    await refresh();
  };

  const saveHospital = async () => {
    await apiRequest('upsertHospital', { ...hospitalForm, ativo: true });
    setHospitalForm({ nome_hospital: '', cidade: '', estado: 'SP', prazo_padrao_dias: 15, forma_fechamento: '', contato_financeiro: '', email_financeiro: '', telefone_financeiro: '', observacoes: '' });
    await refresh();
  };

  const saveShift = async () => {
    const plantao_id = uid();
    await apiRequest('upsertShift', { ...shiftForm, plantao_id, valor_base: Number(shiftForm.valor_base), status_servico: 'pendente' });
    await apiRequest('createCalendarEvent', { ...shiftForm, plantao_id, valor_base: Number(shiftForm.valor_base) });
    setShiftForm({ medico_id: state.doctors[0]?.medico_id || '', hospital_id: state.hospitals[0]?.hospital_id || '', data_plantao: '', hora_inicio: '07:00', hora_fim: '19:00', turno: 'Diurno', setor: '', valor_base: '', observacoes: '' });
    await refresh();
  };

  const importDoctors = async () => {
    await apiRequest('importDoctorsFromForms', { sheetName: 'IMPORTACAO_FORMULARIO_MEDICOS' });
    await refresh();
  };

  const markCumprido = async (plantao_id) => {
    await apiRequest('toggleShiftServiceStatus', { plantao_id, status_servico: 'cumprido' });
    await refresh();
  };

  const registrarPagamento = async (shift) => {
    await apiRequest('registerPayment', {
      plantao_id: shift.plantao_id,
      medico_id: shift.medico_id,
      valor_pago: shift.saldo_liquido,
      forma_pagamento: shift.medico?.forma_pagamento_preferida || 'PIX',
    });
    await refresh();
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <h1>Escalas Médicas</h1>
          <p>PWA pronta para Cloudflare Pages com integração ao Apps Script.</p>
        </div>
        <div className="badge-group">
          <span className="badge">Cloudflare Pages</span>
          <span className="badge">Google Sheets</span>
          <span className="badge">Google Calendar</span>
        </div>
      </header>

      <div className="status">{status}</div>

      <section className="stats-grid">
        <article className="card stat"><h3>Médicos</h3><strong>{state.doctors.length}</strong></article>
        <article className="card stat"><h3>Hospitais</h3><strong>{state.hospitals.length}</strong></article>
        <article className="card stat"><h3>A pagar</h3><strong>{money(stats.totalAPagar)}</strong></article>
        <article className="card stat"><h3>Pago</h3><strong>{money(stats.totalPago)}</strong></article>
      </section>

      <nav className="tabs">
        {['dashboard','medicos','hospitais','plantoes','pagamentos','integracoes'].map((name) => (
          <button key={name} className={tab === name ? 'active' : ''} onClick={() => setTab(name)}>{name}</button>
        ))}
      </nav>

      {tab === 'dashboard' && (
        <section className="grid two">
          <div className="card">
            <h2>Próximos vencimentos</h2>
            {state.shifts.filter((s) => s.status_servico === 'cumprido' && s.status_pagamento !== 'pago').map((s) => (
              <div className="row-item" key={s.plantao_id}>
                <div>
                  <strong>{s.medico?.nome_completo || s.medico_id}</strong>
                  <div>{s.hospital?.nome_hospital || s.hospital_id} • {s.data_plantao} • {s.vencimento_pagamento}</div>
                </div>
                <strong>{money(s.saldo_liquido)}</strong>
              </div>
            ))}
          </div>
          <div className="card">
            <h2>Ações rápidas</h2>
            <div className="action-list">
              <button onClick={importDoctors}>Importar médicos do Google Forms</button>
              <button onClick={refresh}>Atualizar dados</button>
              <a href={APPS_SCRIPT_URL} target="_blank" rel="noreferrer">Abrir endpoint do Apps Script</a>
            </div>
          </div>
        </section>
      )}

      {tab === 'medicos' && (
        <section className="grid two">
          <div className="card form-grid">
            <h2>Novo médico</h2>
            {Object.entries(doctorForm).map(([k,v]) => (
              <label key={k}><span>{k}</span><input value={v} onChange={(e) => setDoctorForm({ ...doctorForm, [k]: e.target.value })} /></label>
            ))}
            <button onClick={saveDoctor}>Salvar médico</button>
          </div>
          <div className="card list">
            <h2>Médicos cadastrados</h2>
            {state.doctors.map((d) => (
              <div className="row-item" key={d.medico_id}>
                <div>
                  <strong>{d.nome_completo}</strong>
                  <div>{d.especialidade} • CRM {d.crm}/{d.uf_crm}</div>
                  <div>{d.banco} • {d.agencia}/{d.conta} • PIX {d.chave_pix}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'hospitais' && (
        <section className="grid two">
          <div className="card form-grid">
            <h2>Novo hospital</h2>
            {Object.entries(hospitalForm).map(([k,v]) => (
              <label key={k}><span>{k}</span><input value={v} onChange={(e) => setHospitalForm({ ...hospitalForm, [k]: e.target.value })} /></label>
            ))}
            <button onClick={saveHospital}>Salvar hospital</button>
          </div>
          <div className="card list">
            <h2>Hospitais</h2>
            {state.hospitals.map((h) => (
              <div className="row-item" key={h.hospital_id}>
                <div>
                  <strong>{h.nome_hospital}</strong>
                  <div>{h.cidade}/{h.estado} • prazo {h.prazo_padrao_dias} dias</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'plantoes' && (
        <section className="grid two">
          <div className="card form-grid">
            <h2>Novo plantão</h2>
            <label><span>medico_id</span><select value={shiftForm.medico_id} onChange={(e) => setShiftForm({ ...shiftForm, medico_id: e.target.value })}>{state.doctors.map((d) => <option key={d.medico_id} value={d.medico_id}>{d.nome_completo}</option>)}</select></label>
            <label><span>hospital_id</span><select value={shiftForm.hospital_id} onChange={(e) => setShiftForm({ ...shiftForm, hospital_id: e.target.value })}>{state.hospitals.map((h) => <option key={h.hospital_id} value={h.hospital_id}>{h.nome_hospital}</option>)}</select></label>
            {['data_plantao','hora_inicio','hora_fim','turno','setor','valor_base','observacoes'].map((k) => (
              <label key={k}><span>{k}</span><input value={shiftForm[k]} onChange={(e) => setShiftForm({ ...shiftForm, [k]: e.target.value })} /></label>
            ))}
            <button onClick={saveShift}>Salvar plantão</button>
          </div>
          <div className="card list">
            <h2>Plantões</h2>
            {state.shifts.map((s) => (
              <div className="row-item" key={s.plantao_id}>
                <div>
                  <strong>{s.medico?.nome_completo || s.medico_id}</strong>
                  <div>{s.hospital?.nome_hospital || s.hospital_id} • {s.data_plantao} {s.hora_inicio}-{s.hora_fim}</div>
                  <div>Status: {s.status_servico} • Pagamento: {s.status_pagamento}</div>
                  <div>Saldo: {money(s.saldo_liquido)}</div>
                </div>
                {s.status_servico !== 'cumprido' && <button onClick={() => markCumprido(s.plantao_id)}>Marcar cumprido</button>}
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'pagamentos' && (
        <section className="card list">
          <h2>Fila de pagamento</h2>
          {state.shifts.filter((s) => s.status_servico === 'cumprido').map((s) => (
            <div className="row-item" key={s.plantao_id}>
              <div>
                <strong>{s.medico?.nome_completo || s.medico_id}</strong>
                <div>{s.hospital?.nome_hospital || s.hospital_id} • vencimento {s.vencimento_pagamento}</div>
                <div>{s.medico?.banco} • {s.medico?.agencia}/{s.medico?.conta} • {s.medico?.forma_pagamento_preferida}</div>
              </div>
              <div className="actions-right">
                <strong>{money(s.saldo_liquido)}</strong>
                {s.status_pagamento !== 'pago' ? <button onClick={() => registrarPagamento(s)}>Marcar pago</button> : <span className="badge">Pago</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === 'integracoes' && (
        <section className="grid two">
          <div className="card list">
            <h2>Configuração ativa</h2>
            <div className="kv"><span>Apps Script</span><code>{APPS_SCRIPT_URL}</code></div>
            <div className="kv"><span>Aba formulário</span><code>{state.config.forms_sheetName || 'IMPORTACAO_FORMULARIO_MEDICOS'}</code></div>
            <div className="kv"><span>Backend</span><code>apps-script</code></div>
          </div>
          <div className="card list">
            <h2>Deploy Cloudflare Pages</h2>
            <ol>
              <li>Enviar este projeto para um repositório Git.</li>
              <li>Conectar o repositório na Cloudflare Pages.</li>
              <li>Build command: <code>npm run build</code></li>
              <li>Output directory: <code>dist</code></li>
            </ol>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;
