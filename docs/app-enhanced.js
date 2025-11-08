// Estado global de la aplicación
const appState = {
  data: null,
  currentSheet: null,
  currentRows: [],
  filteredRows: [],
  chartInstance: null,
  historialAcciones: JSON.parse(localStorage.getItem('historialAcciones') || '[]'),
  excepcionesAprobadas: JSON.parse(localStorage.getItem('excepcionesAprobadas') || '[]')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadDataFromJSON();
});

// Configurar event listeners
function setupEventListeners() {
  // Controles
  document.getElementById('sheetSelect').addEventListener('change', onSheetChange);
  document.getElementById('categorySelect').addEventListener('change', renderVisualization);
  document.getElementById('valueSelect').addEventListener('change', renderVisualization);
  document.getElementById('chartType').addEventListener('change', renderVisualization);
  document.getElementById('quickFilter').addEventListener('input', onFilterChange);
  
  // Botones
  document.getElementById('btnExport').addEventListener('click', exportCSV);
  document.getElementById('btnExportPDF').addEventListener('click', exportPDF);
  document.getElementById('btnRefresh').addEventListener('click', refreshData);
  document.getElementById('btnPivot').addEventListener('click', togglePivot);
  document.getElementById('btnClosePivot').addEventListener('click', closePivot);
  document.getElementById('btnTogglePivot').addEventListener('click', togglePivotCollapse);

  // Pivot
  document.getElementById('pivotRows').addEventListener('change', renderPivotTable);
  document.getElementById('pivotCols').addEventListener('change', renderPivotTable);
  document.getElementById('pivotVals').addEventListener('change', renderPivotTable);
}

// Cargar datos desde JSON local
async function loadDataFromJSON() {
  
  try {
    const response = await fetch('data/contabilidad.json');
    if (!response.ok) throw new Error('Error al cargar JSON');
    
    appState.data = await response.json();
    initializeDashboard();
  } catch (error) {
    console.error('Error cargando JSON:', error);
    alert('Error al cargar datos');
  }
}

// Inicializar dashboard
function initializeDashboard() {
  const { fuente, generado, hojas } = appState.data;
  
  document.getElementById('fuente').textContent = `Fuente: ${fuente || 'N/A'}`;
  document.getElementById('generado').textContent = `Actualizado: ${new Date(generado).toLocaleString()}`;
  document.getElementById('syncTime').textContent = new Date(generado).toLocaleString();
  
  populateSheetSelector(hojas);
  loadFirstSheet(hojas);
}

// Poblar selector de hojas
function populateSheetSelector(hojas) {
  const select = document.getElementById('sheetSelect');
  select.innerHTML = '';
  
  Object.keys(hojas).forEach(sheet => {
    const option = document.createElement('option');
    option.value = sheet;
    option.textContent = sheet;
    select.appendChild(option);
  });
}

// Cargar primera hoja
function loadFirstSheet(hojas) {
  const firstSheet = Object.keys(hojas)[0];
  appState.currentSheet = firstSheet;
  appState.currentRows = hojas[firstSheet] || [];
  appState.filteredRows = [...appState.currentRows];
  
  populateColumnSelectors(appState.currentRows);
  populatePivotSelectors(appState.currentRows);
  renderVisualization();
  buildTable(appState.currentRows);
}

// Cambio de hoja
function onSheetChange(e) {
  const sheet = e.target.value;
  appState.currentSheet = sheet;
  appState.currentRows = appState.data.hojas[sheet] || [];
  appState.filteredRows = [...appState.currentRows];
  
  populateColumnSelectors(appState.currentRows);
  populatePivotSelectors(appState.currentRows);
  renderVisualization();
  buildTable(appState.currentRows);
}

// Poblar selectores de columnas
function populateColumnSelectors(rows) {
  if (!rows.length) return;
  
  const keys = Object.keys(rows[0]);
  const categorySelect = document.getElementById('categorySelect');
  const valueSelect = document.getElementById('valueSelect');
  
  categorySelect.innerHTML = '';
  valueSelect.innerHTML = '';
  
  keys.forEach(key => {
    const catOption = document.createElement('option');
    catOption.value = key;
    catOption.textContent = key;
    categorySelect.appendChild(catOption);
    
    if (typeof rows[0][key] === 'number') {
      const valOption = document.createElement('option');
      valOption.value = key;
      valOption.textContent = key;
      valueSelect.appendChild(valOption);
    }
  });
}

// Poblar selectores de pivot
function populatePivotSelectors(rows) {
  if (!rows.length) return;
  
  const keys = Object.keys(rows[0]);
  const selectors = ['pivotRows', 'pivotCols', 'pivotVals'];
  
  selectors.forEach(id => {
    const select = document.getElementById(id);
    select.innerHTML = '<option value="">Seleccionar...</option>';
    
    keys.forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      select.appendChild(option);
    });
  });
}

// Renderizar visualización
function renderVisualization() {
  const categoryKey = document.getElementById('categorySelect').value;
  const valueKey = document.getElementById('valueSelect').value;
  const chartType = document.getElementById('chartType').value;
  
  if (!categoryKey || !valueKey) return;
  
  const stats = computeStats(appState.filteredRows, valueKey);
  updateStatsUI(stats);
  
  const aggregated = aggregate(appState.filteredRows, categoryKey, valueKey);
  renderChart(aggregated, categoryKey, valueKey, chartType);
  renderSummary(aggregated, categoryKey, valueKey);
}

// Calcular estadísticas
function computeStats(rows, valueKey) {
  const values = rows.map(r => r[valueKey]).filter(v => typeof v === 'number');
  
  return {
    count: values.length,
    sum: values.reduce((a, b) => a + b, 0),
    avg: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
    max: values.length ? Math.max(...values) : 0
  };
}

// Actualizar UI de estadísticas
function updateStatsUI(stats) {
  document.getElementById('statRecords').textContent = stats.count.toLocaleString();
  document.getElementById('statSum').textContent = '$' + stats.sum.toLocaleString();
  document.getElementById('statAvg').textContent = '$' + Math.round(stats.avg).toLocaleString();
  document.getElementById('statMax').textContent = '$' + stats.max.toLocaleString();
}

// Agregar datos
function aggregate(rows, categoryKey, valueKey) {
  const map = {};
  
  rows.forEach(row => {
    const cat = row[categoryKey] || 'Sin categoría';
    const val = typeof row[valueKey] === 'number' ? row[valueKey] : 0;
    
    if (!map[cat]) map[cat] = 0;
    map[cat] += val;
  });
  
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);
}

// Renderizar gráfico
function renderChart(data, categoryKey, valueKey, chartType) {
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');
  
  if (appState.chartInstance) {
    appState.chartInstance.destroy();
  }
  
  appState.chartInstance = new Chart(ctx, {
    type: chartType,
    data: {
      labels: data.map(d => d.label),
      datasets: [{
        label: valueKey,
        data: data.map(d => d.value),
        backgroundColor: chartType === 'doughnut' 
          ? generateColors(data.length)
          : 'rgba(2, 132, 199, 0.7)',
        borderColor: 'rgba(2, 132, 199, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: chartType === 'doughnut' }
      }
    }
  });
}

// Generar colores para gráfico
function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360 / count) % 360;
    colors.push(`hsla(${hue}, 70%, 60%, 0.7)`);
  }
  return colors;
}

// Renderizar resumen
function renderSummary(data, categoryKey, valueKey) {
  const summary = document.getElementById('summary');
  summary.innerHTML = data.slice(0, 10).map(d => `
    <div>
      <strong>${d.label}</strong>: $${d.value.toLocaleString()}
    </div>
  `).join('');
}

// Construir tabla
function buildTable(rows) {
  const container = document.getElementById('tableContainer');
  
  if (!rows.length) {
    container.innerHTML = '<p>No hay datos</p>';
    return;
  }
  
  const keys = Object.keys(rows[0]);
  const table = document.createElement('table');
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  keys.forEach(key => {
    const th = document.createElement('th');
    th.textContent = key;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  rows.forEach(row => {
    const tr = document.createElement('tr');
    keys.forEach(key => {
      const td = document.createElement('td');
      td.textContent = row[key] ?? '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  container.innerHTML = '';
  container.appendChild(table);
  
  // Análisis de riesgos
  analizarRiesgos();
}

// Filtro rápido
function onFilterChange(e) {
  const term = e.target.value.toLowerCase();
  
  if (!term) {
    appState.filteredRows = [...appState.currentRows];
  } else {
    appState.filteredRows = appState.currentRows.filter(row => 
      Object.values(row).some(val => 
        String(val).toLowerCase().includes(term)
      )
    );
  }
  
  renderVisualization();
  buildTable(appState.filteredRows);
}

// Exportar CSV
function exportCSV() {
  if (!appState.filteredRows.length) {
    alert('No hay datos para exportar');
    return;
  }
  
  const keys = Object.keys(appState.filteredRows[0]);
  const csv = [
    keys.join(','),
    ...appState.filteredRows.map(row => 
      keys.map(key => `"${row[key] ?? ''}"`).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `contabilidad_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Exportar PDF
async function exportPDF() {
  const { jsPDF } = window.jspdf;
  const chartPanel = document.getElementById('chartPanel');
  
  try {
    const canvas = await html2canvas(chartPanel, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`dashboard_${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar PDF');
  }
}

// Refrescar datos
function refreshData() {
  if (appState.token) {
    loadDataFromAPI();
  } else {
    loadDataFromJSON();
  }
}

// Toggle pivot table
function togglePivot() {
  const pivotSection = document.getElementById('pivotSection');
  pivotSection.classList.toggle('hidden');
  
  if (!pivotSection.classList.contains('hidden')) {
    renderPivotTable();
  }
}

// Cerrar pivot
function closePivot() {
  document.getElementById('pivotSection').classList.add('hidden');
}

// Toggle collapse/expand de tabla pivote
function togglePivotCollapse() {
  const content = document.getElementById('pivotContent');
  const btn = document.getElementById('btnTogglePivot');
  
  content.classList.toggle('collapsed');
  
  // Cambiar icono
  if (content.classList.contains('collapsed')) {
    btn.textContent = '▶';
    btn.title = 'Expandir tabla pivote';
  } else {
    btn.textContent = '▼';
    btn.title = 'Contraer tabla pivote';
  }
}

// Renderizar tabla pivote
function renderPivotTable() {
  const rowKey = document.getElementById('pivotRows').value;
  const colKey = document.getElementById('pivotCols').value;
  const valKey = document.getElementById('pivotVals').value;
  
  const container = document.getElementById('pivotTable');
  
  if (!rowKey || !colKey || !valKey) {
    container.innerHTML = '<p>Selecciona filas, columnas y valores</p>';
    return;
  }
  
  const pivot = {};
  const cols = new Set();
  
  appState.filteredRows.forEach(row => {
    const rowVal = row[rowKey] || 'N/A';
    const colVal = row[colKey] || 'N/A';
    const dataVal = typeof row[valKey] === 'number' ? row[valKey] : 0;
    
    if (!pivot[rowVal]) pivot[rowVal] = {};
    if (!pivot[rowVal][colVal]) pivot[rowVal][colVal] = 0;
    
    pivot[rowVal][colVal] += dataVal;
    cols.add(colVal);
  });
  
  const colsArray = Array.from(cols).sort();
  
  let html = '<table><thead><tr><th>' + rowKey + '</th>';
  colsArray.forEach(col => {
    html += '<th>' + col + '</th>';
  });
  html += '<th>Total</th></tr></thead><tbody>';
  
  Object.entries(pivot).forEach(([row, data]) => {
    html += '<tr><td><strong>' + row + '</strong></td>';
    let rowTotal = 0;
    
    colsArray.forEach(col => {
      const val = data[col] || 0;
      rowTotal += val;
      html += '<td>$' + val.toLocaleString() + '</td>';
    });
    
    html += '<td><strong>$' + rowTotal.toLocaleString() + '</strong></td></tr>';
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

// ====== ANÁLISIS DE RIESGOS ======
function analizarRiesgos() {
  const rows = appState.filteredRows;
  if (!rows.length) return;
  
  // Verificar si la hoja es "Hoja1" (datos contables con campos de DTE)
  const tieneCAmpoDTE = rows[0].hasOwnProperty('RUT_Emisor');
  
  if (!tieneCAmpoDTE) {
    document.getElementById('riskAnalysisSection').style.display = 'none';
    return;
  }
  
  // Mostrar sección
  document.getElementById('riskAnalysisSection').style.display = 'block';
  
  const container = document.getElementById('riskAnalysisContainer');
  
  // Enriquecer datos con análisis
  const rowsConAnalisis = rows.map((row, idx) => ({
    id: idx + 1,
    ...row,
    analisis: realizarAnalisisRiesgo(row, rows)
  }));
  
  // Renderizar cards de riesgo
  container.innerHTML = rowsConAnalisis.map(row => renderRiskCard(row)).join('');
  
  // Agregar listener para hacer los cards colapsibles
  document.querySelectorAll('.risk-card-header').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', function() {
      const card = this.closest('.risk-card');
      const content = card.querySelector('.risk-card-content');
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
  });
}

function realizarAnalisisRiesgo(dte, historico) {
  const alertas = [];
  let riesgoScore = 0;
  let nivel = 'BAJO';

  // Proveedores conocidos
  const proveedoresConocidos = new Set(historico.map(r => r.RUT_Emisor));
  
  // 1. Emisor nuevo
  if (!proveedoresConocidos.has(dte.RUT_Emisor)) {
    alertas.push({ icono: '🆕', regla: 'EMISOR_NUEVO', texto: 'Emisor nuevo sin historial', puntos: 30 });
    riesgoScore += 30;
  }

  // 2. Región sospechosa
  const regionesPermitidas = ['Metropolitana', 'Valparaíso', "O'Higgins"];
  if (!regionesPermitidas.includes(dte.Region_Emisor)) {
    alertas.push({ icono: '🌍', regla: 'REGIÓN_SOSPECHOSA', texto: `Región inusual: ${dte.Region_Emisor}`, puntos: 20 });
    riesgoScore += 20;
  }

  // 3. Monto anormal
  if (dte.Monto_Total > 15000000) {
    alertas.push({ icono: '💰', regla: 'MONTO_ANORMAL', texto: `Monto muy alto: $${dte.Monto_Total.toLocaleString()}`, puntos: 40 });
    riesgoScore += 40;
  }

  // 4. Recepción inmediata
  const fechaEmision = new Date(dte.Fecha_Emision);
  const fechaRecepcion = new Date(dte.Fecha_Recepcion);
  const difDias = Math.floor((fechaRecepcion - fechaEmision) / (1000 * 60 * 60 * 24));
  if (difDias === 0) {
    alertas.push({ icono: '⚡', regla: 'RECEPCIÓN_INMEDIATA', texto: 'Recepción el mismo día de emisión', puntos: 10 });
    riesgoScore += 10;
  }

  // 5. Folio sospechoso
  if (dte.Folio_DTE === '9999' || dte.Folio_DTE === '0000') {
    alertas.push({ icono: '🔢', regla: 'FOLIO_SOSPECHOSO', texto: `Folio sospechoso: ${dte.Folio_DTE}`, puntos: 15 });
    riesgoScore += 15;
  }

  // 6. Pendiente + alto monto
  if (dte.Estado_RCV === 'Pendiente' && dte.Monto_Total > 10000000) {
    alertas.push({ icono: '⚠️', regla: 'PENDIENTE_ALTO_MONTO', texto: 'Estado pendiente con monto elevado', puntos: 25 });
    riesgoScore += 25;
  }

  // 7. IVA incorrecto
  const ivaEsperado = Math.round(dte.Monto_Neto * 0.19);
  if (dte.Monto_IVA && Math.abs(dte.Monto_IVA - ivaEsperado) > 1000) {
    alertas.push({ icono: '📊', regla: 'IVA_INCORRECTO', texto: `IVA inconsistente`, puntos: 30 });
    riesgoScore += 30;
  }

  // 8. Razón social sospechosa
  const palabrasSospechosas = ['Fantasma', 'Dudoso', 'Temporal', 'S.A.S.', 'XX'];
  if (palabrasSospechosas.some(p => dte.Razon_Social_Emisor.includes(p))) {
    alertas.push({ icono: '🚩', regla: 'RAZÓN_SOCIAL_SOSPECHOSA', texto: `Razón social sospechosa`, puntos: 20 });
    riesgoScore += 20;
  }

  // Determinar nivel
  if (riesgoScore >= 51) nivel = 'CRÍTICO';
  else if (riesgoScore >= 21) nivel = 'MEDIO';
  else nivel = 'BAJO';

  return { alertas, riesgoScore, nivel };
}

function renderRiskCard(row) {
  const analisis = row.analisis;
  const estadoHist = appState.historialAcciones.find(a => a.dteId === row.id);
  const estadoExc = appState.excepcionesAprobadas.find(e => e.dteId === row.id);
  
  let estadoHTML = '';
  if (estadoExc) {
    estadoHTML = '<span class="risk-approval-status risk-exception">⚠️ EXCEPCIÓN APROBADA</span>';
  } else if (estadoHist) {
    const claseEstado = `risk-${estadoHist.accion}`;
    const textoEstado = { 'aprobado': '✅ APROBADO', 'rechazado': '❌ RECHAZADO' }[estadoHist.accion] || '?';
    estadoHTML = `<span class="risk-approval-status ${claseEstado}">${textoEstado}</span>`;
  } else {
    estadoHTML = '<span class="risk-approval-status risk-pending">⏳ PENDIENTE</span>';
  }

  const colorBorde = {
    'BAJO': '#10b981',
    'MEDIO': '#f59e0b',
    'CRÍTICO': '#dc2626'
  }[analisis.nivel];

  const colorScore = {
    'BAJO': 'risk-score-low',
    'MEDIO': 'risk-score-medium',
    'CRÍTICO': 'risk-score-high'
  }[analisis.nivel];

  return `
    <div class="risk-card" style="border-left-color: ${colorBorde};">
      <div class="risk-card-header" title="Click para expandir/contraer">
        <div>
          <h4 style="margin: 0;">DTE #${row.id} - ${row.Razon_Social_Emisor}</h4>
          <small style="color: #64748b;">RUT: ${row.RUT_Emisor} | Folio: ${row.Folio_DTE} | Monto: $${row.Monto_Total.toLocaleString()}</small>
        </div>
        <div class="risk-score ${colorScore}">
          ${analisis.riesgoScore}/100
        </div>
      </div>
      <div class="risk-card-content">
        <div style="margin-bottom: 0.75rem;">
          <strong style="color: #0f172a;">Nivel de Riesgo:</strong>
          <span style="color: ${colorBorde}; font-weight: 600; font-size: 1.1rem;">${analisis.nivel}</span>
        </div>
        
        ${analisis.alertas.length > 0 ? `
          <div>
            <strong style="color: #0f172a; display: block; margin-bottom: 0.5rem;">Alertas Detectadas:</strong>
            <div class="risk-rules">
              ${analisis.alertas.map(alert => `
                <div class="risk-rule-item">
                  <div class="risk-rule-icon">${alert.icono}</div>
                  <div>
                    <div style="font-weight: 600; color: #1e293b;">${alert.regla}</div>
                    <div class="risk-rule-text">${alert.texto} (+${alert.puntos})</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : '<p style="color: #64748b; margin: 0;">No se detectaron alertas</p>'}
        
        <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e2e8f0;">
          <strong style="color: #0f172a;">Estado de Aprobación:</strong><br>
          ${estadoHTML}
          ${estadoHist && estadoHist.comentario ? `
            <div style="margin-top: 0.5rem; padding: 0.5rem; background: #f9fafb; border-radius: 4px; font-size: 0.9rem;">
              <strong>Comentario:</strong> ${estadoHist.comentario}
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

