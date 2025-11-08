async function loadData(){
  const res = await fetch('data/contabilidad.json');
  if(!res.ok){throw new Error('No se pudo cargar contabilidad.json');}
  return res.json();
}

function fillSelect(select, items){
  select.innerHTML='';
  items.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;select.appendChild(o);});
}

function detectNumericColumns(rows){
  if(!rows||rows.length===0) return [];
  const sample=rows[0];
  return Object.keys(sample).filter(k=>typeof sample[k]==='number');
}

function detectCategoricalColumns(rows){
  if(!rows||rows.length===0) return [];
  const sample=rows[0];
  return Object.keys(sample).filter(k=>typeof sample[k]==='string');
}

function computeStats(rows, valueKey){
  if(!rows||rows.length===0) return {count:0,sum:0,avg:0,max:0};
  const values=rows.map(r=>Number(r[valueKey])||0).filter(v=>!isNaN(v));
  const sum=values.reduce((a,b)=>a+b,0);
  const avg=values.length>0?sum/values.length:0;
  const max=Math.max(...values);
  return {count:rows.length,sum:Math.round(sum),avg:Math.round(avg*100)/100,max:Math.round(max)};
}

function buildTable(rows){
  const container=document.getElementById('tableContainer');
  container.innerHTML='';
  const wrapper=document.createElement('div');
  const table=document.createElement('table');
  const thead=document.createElement('thead');
  const tbody=document.createElement('tbody');
  if(rows.length===0){container.innerHTML='<p style="padding:16px">Sin registros</p>';return;}
  const headers=Object.keys(rows[0]);
  const htr=document.createElement('tr');
  headers.forEach(h=>{const th=document.createElement('th');th.textContent=h;htr.appendChild(th);});
  thead.appendChild(htr);
  rows.forEach(r=>{
    const tr=document.createElement('tr');
    headers.forEach(h=>{const td=document.createElement('td');td.textContent=r[h];tr.appendChild(td);});
    tbody.appendChild(tr);
  });
  table.appendChild(thead);
  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.appendChild(wrapper);
}

function buildSummary(data, categoryKey){
  const summary=document.getElementById('summary');
  summary.innerHTML='';
  const keys=Object.keys(data).slice(0,10);
  if(keys.length===0){summary.innerHTML='<p>Sin datos</p>';return;}
  keys.forEach(k=>{
    const div=document.createElement('div');
    div.innerHTML=`<strong>${k}:</strong> ${data[k]}`;
    summary.appendChild(div);
  });
}

function aggregate(rows, categoryKey, valueKey){
  const acc={};
  rows.forEach(r=>{const cat=String(r[categoryKey]||'Sin categoría');const val=Number(r[valueKey])||0;acc[cat]=(acc[cat]||0)+val;});
  const labels=Object.keys(acc);
  const values=labels.map(l=>acc[l]);
  return {labels,values};
}

let chartInstance=null;
function renderChart(data, categoryKey, valueKey, chartType='bar'){
  if(chartInstance){chartInstance.destroy();}
  const ctx=document.getElementById('chart');
  const colors=['#0284c7','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6'];
  const bgColor=chartType==='doughnut'?colors:['#0284c7'];
  chartInstance=new Chart(ctx,{
    type:chartType,
    data:{
      labels:data.labels,
      datasets:[{
        label:`${valueKey}`,
        data:data.values,
        backgroundColor:chartType==='doughnut'?colors:bgColor,
        borderColor:chartType==='doughnut'?'white':'#0284c7',
        borderWidth:chartType==='doughnut'?2:1,
        fill:false
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:true,
      plugins:{legend:{display:true,position:chartType==='doughnut'?'right':'top'}},
      scales:chartType==='doughnut'?{}:{y:{beginAtZero:true}}
    }
  });
}

function exportCSV(rows){
  if(rows.length===0) return;
  const headers=Object.keys(rows[0]);
  const lines=[headers.join(',')].concat(rows.map(r=>headers.map(h=>JSON.stringify(r[h]??'')).join(',')));
  const blob=new Blob([lines.join('\n')],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`export_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

(async function init(){
  try{
    const fullData=await loadData();
    document.getElementById('fuente').textContent='Fuente: '+fullData.fuente;
    document.getElementById('generado').textContent='Actualizado: '+new Date(fullData.generado).toLocaleString('es-CL');
    document.getElementById('syncTime').textContent=new Date(fullData.generado).toLocaleString('es-CL');

    const sheetSelect=document.getElementById('sheetSelect');
    const categorySelect=document.getElementById('categorySelect');
    const valueSelect=document.getElementById('valueSelect');
    const chartTypeSelect=document.getElementById('chartType');
    const quickFilter=document.getElementById('quickFilter');
    const btnExport=document.getElementById('btnExport');
    const btnRefresh=document.getElementById('btnRefresh');

    const sheetNames=Object.keys(fullData.hojas);
    fillSelect(sheetSelect,sheetNames);

    let currentRows=fullData.hojas[sheetNames[0]]||[];
    const numericCols=detectNumericColumns(currentRows);
    const catCols=detectCategoricalColumns(currentRows);
    fillSelect(categorySelect,catCols);
    fillSelect(valueSelect,numericCols);

    function refresh(){
      const sheet=sheetSelect.value;
      currentRows=fullData.hojas[sheet]||[];
      const filt=quickFilter.value.trim().toLowerCase();
      let filtered=currentRows;
      if(filt){
        filtered=currentRows.filter(r=>Object.values(r).some(v=>String(v).toLowerCase().includes(filt)));
      }
      buildTable(filtered);

      const catCol=categorySelect.value;
      const valCol=valueSelect.value;
      if(catCol&&valCol){
        const agg=aggregate(filtered,catCol,valCol);
        renderChart(agg,catCol,valCol,chartTypeSelect.value);
        buildSummary(agg.labels.reduce((acc,l,i)=>{acc[l]=agg.values[i];return acc},{}),catCol);
      }

      const stats=computeStats(filtered,valCol);
      document.getElementById('statRecords').textContent=stats.count.toLocaleString();
      document.getElementById('statSum').textContent=stats.sum.toLocaleString();
      document.getElementById('statAvg').textContent=stats.avg.toLocaleString();
      document.getElementById('statMax').textContent=stats.max.toLocaleString();
    }

    sheetSelect.addEventListener('change',()=>{
      currentRows=fullData.hojas[sheetSelect.value]||[];
      fillSelect(categorySelect,detectCategoricalColumns(currentRows));
      fillSelect(valueSelect,detectNumericColumns(currentRows));
      refresh();
    });
    categorySelect.addEventListener('change',refresh);
    valueSelect.addEventListener('change',refresh);
    chartTypeSelect.addEventListener('change',refresh);
    quickFilter.addEventListener('input',refresh);
    btnExport.addEventListener('click',()=>exportCSV(currentRows));
    btnRefresh.addEventListener('click',refresh);

    refresh();
  }catch(err){
    document.body.innerHTML='<div style="padding:20px;color:#dc2626"><h2>⚠️ Error cargando datos</h2><pre>'+err.message+'</pre></div>';
  }
})();
