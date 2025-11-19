const STORAGE_KEYS = {
  body: 'health_body_data',
  blood: 'health_blood_data',
  notes: 'health_notes_data'
};

let dataBody = JSON.parse(localStorage.getItem(STORAGE_KEYS.body) || '[]');
let dataBlood = JSON.parse(localStorage.getItem(STORAGE_KEYS.blood) || '[]');
let dataNotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.notes) || '[]');

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(tc => {
      tc.style.display = (tc.id === tab ? '' : 'none');
    });
    if (tab === 'notes') renderNotes();
    if (tab === 'body') renderBodyList();
    if (tab === 'blood') renderBloodList();
  });
});

// --------------- 表單提交 ---------------
document.getElementById('form-body').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const entry = {
    date: f.date.value,
    weight: parseFloat(f.weight.value) || null,
    bodyFat: parseFloat(f.bodyFat.value) || null,
    muscleMass: parseFloat(f.muscleMass.value) || null,
    visceralFat: parseFloat(f.visceralFat.value) || null,
    bmi: parseFloat(f.bmi.value) || null
  };
  dataBody.push(entry);
  localStorage.setItem(STORAGE_KEYS.body, JSON.stringify(dataBody));
  f.reset();
  renderBodyList();
  updateChartBody();
  updateChartCombined();
});

document.getElementById('form-blood').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const entry = {
    date: f.date.value,
    cholesterolTotal: parseFloat(f.cholesterolTotal.value) || null,
    triglycerides: parseFloat(f.triglycerides.value) || null,
    hdl: parseFloat(f.hdl.value) || null,
    ldl: parseFloat(f.ldl.value) || null,
    bloodGlucose: parseFloat(f.bloodGlucose.value) || null,
    hba1c: parseFloat(f.hba1c.value) || null,
    estimatedAvgGlucose: parseFloat(f.estimatedAvgGlucose.value) || null
  };
  dataBlood.push(entry);
  localStorage.setItem(STORAGE_KEYS.blood, JSON.stringify(dataBlood));
  f.reset();
  renderBloodList();
  updateChartBlood();
  updateChartCombined();
});

document.getElementById('form-notes').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const entry = {
    date: f.date.value,
    remark: f.remark.value.trim()
  };
  dataNotes.push(entry);
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(dataNotes));
  f.reset();
  renderNotes();
});

// --------------- 列表 + 刪除 ---------------
function renderBodyList() {
  const container = document.getElementById('body-list');
  container.innerHTML = '';
  const sorted = dataBody.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  sorted.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('note-item');
    div.innerHTML = `
      <strong>${item.date}</strong><br>
      體重: ${item.weight ?? '-'} kg, 體脂: ${item.bodyFat ?? '-'} %, 肌肉量: ${item.muscleMass ?? '-'} kg, 內臟脂肪: ${item.visceralFat ?? '-'}, BMI: ${item.bmi ?? '-'}
      <br><button data-index="${index}" class="delete-body-btn">刪除</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.delete-body-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = parseInt(e.target.dataset.index, 10);
      // 注意：sorted 是複製 array；這裡我們需要找到在原始 dataBody 中對應的那筆
      const itemToDelete = sorted[idx];
      dataBody = dataBody.filter(item => !(item.date === itemToDelete.date && item.weight === itemToDelete.weight && item.bodyFat === itemToDelete.bodyFat && item.muscleMass === itemToDelete.muscleMass && item.visceralFat === itemToDelete.visceralFat && item.bmi === itemToDelete.bmi));
      localStorage.setItem(STORAGE_KEYS.body, JSON.stringify(dataBody));
      renderBodyList();
      updateChartBody();
      updateChartCombined();
    });
  });
}

function renderBloodList() {
  const container = document.getElementById('blood-list');
  container.innerHTML = '';
  const sorted = dataBlood.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  sorted.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('note-item');
    div.innerHTML = `
      <strong>${item.date}</strong><br>
      總膽固醇: ${item.cholesterolTotal ?? '-'}, 三酸甘油酯: ${item.triglycerides ?? '-'}, HDL: ${item.hdl ?? '-'}, LDL: ${item.ldl ?? '-'}, 飯前血糖: ${item.bloodGlucose ?? '-'}, HbA1c: ${item.hba1c ?? '-'}, 推估平均血糖: ${item.estimatedAvgGlucose ?? '-'}
      <br><button data-index="${index}" class="delete-blood-btn">刪除</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.delete-blood-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = parseInt(e.target.dataset.index, 10);
      const itemToDelete = sorted[idx];
      dataBlood = dataBlood.filter(item => !(item.date === itemToDelete.date && item.cholesterolTotal === itemToDelete.cholesterolTotal && item.triglycerides === itemToDelete.triglycerides && item.hdl === itemToDelete.hdl && item.ldl === itemToDelete.ldl && item.bloodGlucose === itemToDelete.bloodGlucose && item.hba1c === itemToDelete.hba1c && item.estimatedAvgGlucose === itemToDelete.estimatedAvgGlucose));
      localStorage.setItem(STORAGE_KEYS.blood, JSON.stringify(dataBlood));
      renderBloodList();
      updateChartBlood();
      updateChartCombined();
    });
  });
}

function renderNotes() {
  const container = document.getElementById('notes-list');
  container.innerHTML = '';
  const sorted = dataNotes.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  sorted.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('note-item');
    div.innerHTML = `
      <strong>${item.date}</strong><br>
      ${item.remark}
      <br><button data-index="${index}" class="delete-note-btn">刪除</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.delete-note-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const idx = parseInt(e.target.dataset.index, 10);
      const itemToDelete = sorted[idx];
      dataNotes = dataNotes.filter(item => !(item.date === itemToDelete.date && item.remark === itemToDelete.remark));
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(dataNotes));
      renderNotes();
    });
  });
}

// --------------- 圖表設定 ---------------
const chartBody = new Chart(document.getElementById('chart-body'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: '體重', data: [], borderColor: '#ff6384', fill: false },
      { label: '體脂', data: [], borderColor: '#36a2eb', fill: false },
      { label: '肌肉量', data: [], borderColor: '#ff9f40', fill: false },
      { label: '內臟脂肪', data: [], borderColor: '#4bc0c0', fill: false },
      { label: 'BMI', data: [], borderColor: '#9966ff', fill: false }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: '日期' } },
      y: { beginAtZero: false, title: { display: true, text: '數值' } }
    },
    plugins: { legend: { position: 'top' } }
  }
});

const chartBlood = new Chart(document.getElementById('chart-blood'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: '總膽固醇', data: [], borderColor: '#ff6384', fill: false },
      { label: '三酸甘油酯', data: [], borderColor: '#36a2eb', fill: false },
      { label: 'HDL', data: [], borderColor: '#ff9f40', fill: false },
      { label: 'LDL', data: [], borderColor: '#4bc0c0', fill: false },
      { label: '飯前血糖', data: [], borderColor: '#9966ff', fill: false },
      { label: '糖化血色素', data: [], borderColor: '#c9cbcf', fill: false },
      { label: '推估平均血糖', data: [], borderColor: '#ffcd56', fill: false }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: '日期' } },
      y: { beginAtZero: false, title: { display: true, text: '數值' } }
    },
    plugins: { legend: { position: 'top' } }
  }
});

const chartCombined = new Chart(document.getElementById('chart-combined'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: '體重', borderColor: '#ff6384', data: [], fill: false },
      { label: '體脂', borderColor: '#36a2eb', data: [], fill: false },
      { label: '肌肉量', borderColor: '#ff9f40', data: [], fill: false },
      { label: '內臟脂肪', borderColor: '#4bc0c0', data: [], fill: false },
      { label: 'BMI', borderColor: '#9966ff', data: [], fill: false },
      { label: '總膽固醇', borderColor: '#e6194b', data: [], fill: false },
      { label: '三酸甘油酯', borderColor: '#3cb44b', data: [], fill: false },
      { label: 'HDL', borderColor: '#ffe119', data: [], fill: false },
      { label: 'LDL', borderColor: '#4363d8', data: [], fill: false },
      { label: '飯前血糖', borderColor: '#f58231', data: [], fill: false },
      { label: 'HbA1c', borderColor: '#911eb4', data: [], fill: false },
      { label: '推估平均血糖', borderColor: '#46f0f0', data: [], fill: false }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: '日期' } },
      y: { beginAtZero: false, title: { display: true, text: '數值' } }
    },
    plugins: { legend: { position: 'top' } }
  }
});

// --------------- 更新圖表函式 ---------------
function updateChartBody() {
  const sorted = dataBody.slice().sort((a,b)=> new Date(a.date) - new Date(b.date));
  const labels = sorted.map(e => e.date);
  chartBody.data.labels = labels;
  chartBody.data.datasets[0].data = sorted.map(e => e.weight);
  chartBody.data.datasets[1].data = sorted.map(e => e.bodyFat);
  chartBody.data.datasets[2].data = sorted.map(e => e.muscleMass);
  chartBody.data.datasets[3].data = sorted.map(e => e.visceralFat);
  chartBody.data.datasets[4].data = sorted.map(e => e.bmi);
  chartBody.update();
}

function updateChartBlood() {
  const sorted = dataBlood.slice().sort((a,b)=> new Date(a.date) - new Date(b.date));
  const labels = sorted.map(e => e.date);
  chartBlood.data.labels = labels;
  chartBlood.data.datasets[0].data = sorted.map(e => e.cholesterolTotal);
  chartBlood.data.datasets[1].data = sorted.map(e => e.triglycerides);
  chartBlood.data.datasets[2].data = sorted.map(e => e.hdl);
  chartBlood.data.datasets[3].data = sorted.map(e => e.ldl);
  chartBlood.data.datasets[4].data = sorted.map(e => e.bloodGlucose);
  chartBlood.data.datasets[5].data = sorted.map(e => e.hba1c);
  chartBlood.data.datasets[6].data = sorted.map(e => e.estimatedAvgGlucose);
  chartBlood.update();
}

function updateChartCombined() {
  const allDates = [...new Set([...dataBody.map(e => e.date), ...dataBlood.map(e => e.date)])].sort((a, b) => new Date(a) - new Date(b));
  chartCombined.data.labels = allDates;
  function mapData(dates, source, key) {
    const dict = Object.fromEntries(source.map(e => [e.date, e[key]]));
    return dates.map(d => dict[d] !== undefined ? dict[d] : null);
  }
  const keys = [
    { key: 'weight', i: 0 }, { key: 'bodyFat', i: 1 }, { key: 'muscleMass', i: 2 }, { key: 'visceralFat', i: 3 }, { key: 'bmi', i: 4 },
    { key: 'cholesterolTotal', i: 5 }, { key: 'triglycerides', i: 6 }, { key: 'hdl', i: 7 }, { key: 'ldl', i: 8 },
    { key: 'bloodGlucose', i: 9 }, { key: 'hba1c', i: 10 }, { key: 'estimatedAvgGlucose', i: 11 }
  ];
  keys.forEach(({ key, i }) => {
    const src = i <= 4 ? dataBody : dataBlood;
    chartCombined.data.datasets[i].data = mapData(allDates, src, key);
  });
  chartCombined.update();
}

// 初始載入
renderBodyList();
renderBloodList();
updateChartBody();
updateChartBlood();
updateChartCombined();
renderNotes();
// ---- 匯出備份 ----
document.getElementById("export-backup").addEventListener("click", () => {
  const backup = {
    body: dataBody,
    blood: dataBlood,
    notes: dataNotes
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `health_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();

  URL.revokeObjectURL(url);
  alert("備份已匯出！");
});

// ---- 匯入備份 ----
document.getElementById("import-backup").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const result = JSON.parse(e.target.result);

      // 覆蓋資料
      dataBody = result.body || [];
      dataBlood = result.blood || [];
      dataNotes = result.notes || [];

      // 寫回 localStorage
      localStorage.setItem(STORAGE_KEYS.body, JSON.stringify(dataBody));
      localStorage.setItem(STORAGE_KEYS.blood, JSON.stringify(dataBlood));
      localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(dataNotes));

      // 重繪畫面與圖表
      renderBodyList();
      renderBloodList();
      renderNotes();
      updateChartBody();
      updateChartBlood();
      updateChartCombined();

      alert("備份已成功匯入！");
    } catch (err) {
      alert("⚠️ 匯入失敗：檔案格式錯誤");
    }
  };
  reader.readAsText(file);
});