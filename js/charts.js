// Dashboard Charts Logic for LPJ PC ISNU Kota Surabaya

function initDashboardCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
  }

  const activities = LPJ_DATA.activities;
  const isMobile = window.innerWidth <= 640;

  // 1. Calculate Activities per Seksi (normalized string matching)
  const seksiKeys = [
    'ORGANISASI DAN KERJASAMA ANTAR LEMBAGA',
    'PEREKONOMIAN DAN PEMBERDAYAAN UMAT',
    'KESEHATAN MASYARAKAT DAN LINGKUNGAN HIDUP',
    'SAINS DAN TEKNOLOGI (SAINTEK)',
    'PENDIDIKAN DAN HUMANIORA',
    'PENGUATAN IDEOLOGI DAN DAKWAH DIGITAL'
  ];

  const seksiCounts = {};
  seksiKeys.forEach(k => seksiCounts[k] = 0);

  activities.forEach(act => {
    [act.seksi1, act.seksi2].forEach(s => {
      if (!s) return;
      let clean = s.trim().toUpperCase();
      if (clean.indexOf('SEKSI ') === 0) {
        clean = clean.replace('SEKSI ', '').trim();
      }
      if (clean in seksiCounts) {
        seksiCounts[clean]++;
      } else {
        seksiKeys.forEach(key => {
          if (clean.includes(key) || key.includes(clean)) {
            seksiCounts[key]++;
          }
        });
      }
    });
  });

  const seksiLabels = [
    'Organisasi & Kerjasama',
    'Perekonomian & Umat',
    'Kesehatan & Lingkungan',
    'Sains & Teknologi',
    'Pendidikan & Humaniora',
    'Ideologi & Dakwah Digital'
  ];
  const seksiValues = seksiKeys.map(k => seksiCounts[k]);

  // Chart 1: Bar Chart per Seksi (Horizontal on mobile for 100% vertical fit)
  const ctxSeksi = document.getElementById('chartSeksi');
  if (ctxSeksi) {
    if (window.chartSeksiInstance) {
      window.chartSeksiInstance.destroy();
    }
    window.chartSeksiInstance = new Chart(ctxSeksi, {
      type: 'bar',
      data: {
        labels: seksiLabels,
        datasets: [{
          label: 'Jumlah Kegiatan',
          data: seksiValues,
          backgroundColor: [
            '#006837',
            '#059669',
            '#0284c7',
            '#7c3aed',
            '#d97706',
            '#e11d48'
          ],
          borderRadius: 6,
          borderWidth: 0
        }]
      },
      options: {
        indexAxis: isMobile ? 'y' : 'x', // Horizontal bars on mobile screens
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 10,
            backgroundColor: '#0f172a',
            titleFont: { size: 13, weight: 'bold' }
          }
        },
        scales: isMobile ? {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 2, font: { family: 'Plus Jakarta Sans', size: 10 } },
            grid: { color: '#f1f5f9' }
          },
          y: {
            ticks: { font: { family: 'Plus Jakarta Sans', size: 9, weight: '600' } },
            grid: { display: false }
          }
        } : {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 2, font: { family: 'Plus Jakarta Sans' } },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, maxRotation: 45, minRotation: 0 },
            grid: { display: false }
          }
        }
      }
    });
  }

  // 2. Calculate Activities per Peran
  const peranCounts = {
    'Penyelenggara': 0,
    'Pembicara': 0,
    'Peserta': 0
  };

  activities.forEach(act => {
    if (act.peran in peranCounts) peranCounts[act.peran]++;
  });

  // Chart 2: Doughnut Chart Peran ISNU
  const ctxPeran = document.getElementById('chartPeran');
  if (ctxPeran) {
    if (window.chartPeranInstance) {
      window.chartPeranInstance.destroy();
    }
    window.chartPeranInstance = new Chart(ctxPeran, {
      type: 'doughnut',
      data: {
        labels: ['Penyelenggara', 'Pembicara', 'Peserta'],
        datasets: [{
          data: [peranCounts['Penyelenggara'], peranCounts['Pembicara'], peranCounts['Peserta']],
          backgroundColor: ['#166534', '#d97706', '#2563eb'],
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, padding: 12 }
          },
          tooltip: { padding: 10 }
        },
        cutout: '65%'
      }
    });
  }

  // Render the Seksi List on Card 3
  renderDashboardSeksiList(seksiKeys, seksiCounts);

  // 3. Calculate Activities per Year
  const yearCounts = { '2022': 0, '2023': 0, '2024': 0, '2025': 0, '2026': 0 };
  activities.forEach(act => {
    const yr = act.tgl.substring(0, 4);
    if (yr in yearCounts) yearCounts[yr]++;
  });

  // Chart 3: Line Chart Timeline
  const ctxTimeline = document.getElementById('chartTimeline');
  if (ctxTimeline) {
    if (window.chartTimelineInstance) {
      window.chartTimelineInstance.destroy();
    }
    window.chartTimelineInstance = new Chart(ctxTimeline, {
      type: 'line',
      data: {
        labels: Object.keys(yearCounts).map(y => `Tahun ${y}`),
        datasets: [{
          label: 'Jumlah Kegiatan Khidmah',
          data: Object.values(yearCounts),
          borderColor: '#006837',
          backgroundColor: 'rgba(0, 104, 55, 0.08)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#d97706',
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 2 },
            grid: { color: '#f1f5f9' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
}

// Render interactive Seksi List in Dashboard alongside Peran chart
function renderDashboardSeksiList(seksiKeys, seksiCounts) {
  const container = document.getElementById('dashboardSeksiList');
  if (!container) return;

  const icons = ['🤝', '💰', '🏥', '💻', '🎓', '📱'];
  const colors = ['#006837', '#059669', '#0284c7', '#7c3aed', '#d97706', '#e11d48'];

  container.innerHTML = seksiKeys.map((key, idx) => {
    const fullSeksiName = `SEKSI ${key}`;
    const count = seksiCounts[key] || 0;
    const color = colors[idx % colors.length];

    return `
      <div class="seksi-link-item" onclick="navigateToSeksi('${fullSeksiName}')">
        <div class="seksi-link-left">
          <span class="seksi-link-icon" style="background:${color}15; color:${color}">${icons[idx]}</span>
          <span class="seksi-link-title">${formatSeksiShort(key)}</span>
        </div>
        <span class="seksi-link-badge">${count} Kegiatan <i class="lucide-chevron-right"></i></span>
      </div>
    `;
  }).join('');
}

function formatSeksiShort(key) {
  const map = {
    'ORGANISASI DAN KERJASAMA ANTAR LEMBAGA': 'Organisasi & Kerjasama',
    'PEREKONOMIAN DAN PEMBERDAYAAN UMAT': 'Perekonomian & Umat',
    'KESEHATAN MASYARAKAT DAN LINGKUNGAN HIDUP': 'Kesehatan & Lingkungan',
    'SAINS DAN TEKNOLOGI (SAINTEK)': 'Sains & Teknologi (Saintek)',
    'PENDIDIKAN DAN HUMANIORA': 'Pendidikan & Humaniora',
    'PENGUATAN IDEOLOGI DAN DAKWAH DIGITAL': 'Ideologi & Dakwah Digital'
  };
  return map[key] || key;
}

// Debounced resize handler for orientation change
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const dashboardView = document.getElementById('view-dashboard');
    if (dashboardView && dashboardView.classList.contains('active')) {
      initDashboardCharts();
    }
  }, 250);
});
