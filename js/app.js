// Main Application Logic for LPJ PC ISNU Kota Surabaya

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initDashboard();
  initSKandStructure();
  initRoadmapAndSOP();
  initJOSHNU();
  initKegiatanSection();
  initKeuanganSection();
});

// 1. Navigation & Tab Switching
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabViews = document.querySelectorAll('.tab-view');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(n => n.classList.remove('active'));
      tabViews.forEach(v => v.classList.remove('active'));

      item.classList.add('active');
      const activeView = document.getElementById(`view-${targetTab}`);
      if (activeView) {
        activeView.classList.add('active');
      }

      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
      }

      // Scroll top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

// Global Helper to navigate directly to a Seksi in Kegiatan tab
function navigateToSeksi(seksiName) {
  const kegiatanBtn = document.querySelector('.nav-item[data-tab="kegiatan"]');
  if (kegiatanBtn) {
    kegiatanBtn.click();
  }

  const seksiTabBtns = document.querySelectorAll('.seksi-tab-btn');
  let targetBtn = null;

  seksiTabBtns.forEach(btn => {
    const btnSeksi = btn.getAttribute('data-seksi');
    if (btnSeksi === seksiName || seksiName.includes(btnSeksi) || btnSeksi.includes(seksiName)) {
      targetBtn = btn;
    }
  });

  if (targetBtn) {
    targetBtn.click();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Dashboard Init
function initDashboard() {
  initDashboardCharts();
}

// 3. SK & Structure Init
function initSKandStructure() {
  const skGrid = document.getElementById('skGridContainer');
  if (!skGrid) return;

  skGrid.innerHTML = LPJ_DATA.skFiles.map(sk => `
    <div class="doc-card">
      <div>
        <span class="doc-badge">${sk.category}</span>
        <h3 class="doc-title">${sk.title}</h3>
        <p class="doc-number">Nomor: ${sk.number}</p>
        <p class="doc-desc">${sk.desc}</p>
      </div>
      <div class="btn-group">
        <a href="${sk.file}" target="_blank" class="btn btn-primary">
          <i class="lucide-file-text"></i> Buka File SK (PDF)
        </a>
      </div>
    </div>
  `).join('');
}

// 4. Roadmap & SOP Init
function initRoadmapAndSOP() {
  const pillarsGrid = document.getElementById('roadmapPillars');
  if (pillarsGrid) {
    pillarsGrid.innerHTML = LPJ_DATA.roadmap.pillars.map(p => `
      <div class="scope-card">
        <h4>${p.title}</h4>
        <p>${p.desc}</p>
      </div>
    `).join('');
  }

  const sopGrid = document.getElementById('sopGridContainer');
  if (sopGrid) {
    sopGrid.innerHTML = LPJ_DATA.sopFiles.map(sop => `
      <div class="doc-card">
        <div>
          <span class="doc-badge">Standard Operating Procedure</span>
          <h3 class="doc-title">${sop.title}</h3>
          <p class="doc-desc" style="margin-top:0.5rem">${sop.desc}</p>
          <ul class="sop-list-items">
            ${sop.procedures.map(pr => `<li>${pr}</li>`).join('')}
          </ul>
        </div>
        <div class="btn-group" style="margin-top:1rem">
          <a href="${sop.file}" target="_blank" class="btn btn-primary">
            <i class="lucide-file-check"></i> Unduh SOP Ber-TTD (PDF)
          </a>
        </div>
      </div>
    `).join('');
  }
}

// 5. JOSHNU Init
function initJOSHNU() {
  const scopesGrid = document.getElementById('joshnuScopesGrid');
  if (scopesGrid) {
    scopesGrid.innerHTML = LPJ_DATA.joshnu.scopes.map(s => `
      <div class="scope-card">
        <h4>${s.title}</h4>
        <p>${s.desc}</p>
      </div>
    `).join('');
  }
}

// 6. Kegiatan Section & Sub-tabs
let currentSeksiFilter = 'ALL';
let currentSearchQuery = '';
let currentRoleFilter = 'ALL';
let currentYearFilter = 'ALL';

function initKegiatanSection() {
  const seksiTabBtns = document.querySelectorAll('.seksi-tab-btn');
  const searchInput = document.getElementById('searchKegiatan');
  const roleSelect = document.getElementById('filterRole');
  const yearSelect = document.getElementById('filterYear');

  seksiTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      seksiTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSeksiFilter = btn.getAttribute('data-seksi');
      renderKegiatanGrid();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.toLowerCase().trim();
      renderKegiatanGrid();
    });
  }

  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      currentRoleFilter = e.target.value;
      renderKegiatanGrid();
    });
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', (e) => {
      currentYearFilter = e.target.value;
      renderKegiatanGrid();
    });
  }

  renderKegiatanGrid();
}

function renderKegiatanGrid() {
  const container = document.getElementById('kegiatanGridContainer');
  const counterText = document.getElementById('kegiatanCounter');
  if (!container) return;

  let filtered = LPJ_DATA.activities.filter(act => {
    if (currentSeksiFilter !== 'ALL') {
      const targetFilter = currentSeksiFilter.trim().toUpperCase().replace('SEKSI ', '');
      const s1 = act.seksi1.trim().toUpperCase().replace('SEKSI ', '');
      const s2 = act.seksi2.trim().toUpperCase().replace('SEKSI ', '');
      if (s1 !== targetFilter && s2 !== targetFilter && !s1.includes(targetFilter) && !s2.includes(targetFilter)) {
        return false;
      }
    }

    if (currentRoleFilter !== 'ALL' && act.peran.toLowerCase() !== currentRoleFilter.toLowerCase()) {
      return false;
    }

    if (currentYearFilter !== 'ALL') {
      const year = act.tgl.substring(0, 4);
      if (year !== currentYearFilter) return false;
    }

    if (currentSearchQuery) {
      const matchTitle = act.kegiatan.toLowerCase().includes(currentSearchQuery);
      const matchLoc = act.lokasi.toLowerCase().includes(currentSearchQuery);
      const matchOut = act.output.toLowerCase().includes(currentSearchQuery);
      const matchOutcome = act.outcome.toLowerCase().includes(currentSearchQuery);
      if (!matchTitle && !matchLoc && !matchOut && !matchOutcome) return false;
    }

    return true;
  });

  if (counterText) {
    counterText.textContent = `Menampilkan ${filtered.length} dari ${LPJ_DATA.activities.length} Kegiatan`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background:#fff; border-radius:12px; border:1px solid #e2e8f0;">
        <p style="font-size:1.1rem; font-weight:700; color:#64748b;">Tidak ada kegiatan yang cocok dengan kriteria pencarian/filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(act => {
    const roleClass = act.peran.toLowerCase();
    const hasImages = act.images.length > 0;
    const hasDocs = act.docs.length > 0;

    return `
      <div class="activity-card" onclick="openActivityDetail(${act.id})">
        <div class="card-header-bar">
          <span class="role-badge ${roleClass}">${act.peran}</span>
          <span class="act-date">📅 ${formatDateIndo(act.tgl)}</span>
        </div>
        <div class="card-body">
          <h3 class="act-title">#${act.no}. ${escapeHtml(act.kegiatan)}</h3>
          <p class="act-location">📍 ${escapeHtml(act.lokasi)}</p>
          <div class="seksi-tags">
            ${act.seksi1 ? `<span class="tag">${escapeHtml(act.seksi1)}</span>` : ''}
            ${act.seksi2 ? `<span class="tag" style="background:#fff7ed; border-color:#fed7aa">${escapeHtml(act.seksi2)}</span>` : ''}
          </div>
          <div class="output-preview">
            <strong>Output:</strong> ${escapeHtml(act.output)}
          </div>
        </div>
        <div class="card-footer-bar">
          <div class="media-count">
            ${hasImages ? `<span>🖼️ ${act.images.length} Foto</span>` : '<span style="opacity:0.5">🖼️ Tanpa Foto</span>'}
            ${hasDocs ? `<span>📄 ${act.docs.length} Dokumen</span>` : ''}
          </div>
          <button class="btn btn-outline" style="padding:0.35rem 0.75rem; font-size:0.8rem">Detail <i class="lucide-chevron-right"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

// 7. Laporan Keuangan Section Init
function initKeuanganSection() {
  const fin = LPJ_DATA.keuangan;
  if (!fin) return;

  const summaryTextElem = document.getElementById('keuanganSummaryText');
  if (summaryTextElem) {
    summaryTextElem.textContent = fin.summary;
  }

  const statPemasukan = document.getElementById('finStatPemasukan');
  const statPengeluaran = document.getElementById('finStatPengeluaran');
  const statSaldo = document.getElementById('finStatSaldo');

  if (statPemasukan) statPemasukan.textContent = formatRupiah(fin.totals.pemasukan);
  if (statPengeluaran) statPengeluaran.textContent = formatRupiah(fin.totals.pengeluaran);
  if (statSaldo) statSaldo.textContent = formatRupiah(fin.totals.saldo);

  // Render Financial Table
  const tableContainer = document.getElementById('keuanganTableContainer');
  if (tableContainer) {
    let tableHtml = `
      <table class="keuangan-table">
        <thead>
          <tr>
            <th style="width:60px; text-align:center">No</th>
            <th style="width:120px">Tanggal</th>
            <th>Uraian Transaksi Keuangan</th>
            <th style="width:140px; text-align:center">Jenis Kas</th>
            <th style="width:160px; text-align:right">Pemasukan (Rp)</th>
            <th style="width:160px; text-align:right">Pengeluaran (Rp)</th>
          </tr>
        </thead>
        <tbody>
    `;

    fin.items.forEach((item, index) => {
      const isPemasukan = item.pemasukan > 0;
      const badgeHtml = isPemasukan 
        ? `<span class="trans-badge masuk">📥 Pemasukan</span>`
        : `<span class="trans-badge keluar">📤 Pengeluaran</span>`;

      tableHtml += `
        <tr>
          <td style="text-align:center; font-weight:600">${index + 1}</td>
          <td style="font-weight:600; color:#64748b">${item.tgl}</td>
          <td style="font-weight:600; color:#0f172a">${escapeHtml(item.uraian)}</td>
          <td style="text-align:center">${badgeHtml}</td>
          <td style="text-align:right; font-weight:700; color:${isPemasukan ? '#166534' : '#94a3b8'}">
            ${item.pemasukan > 0 ? formatRupiah(item.pemasukan) : '-'}
          </td>
          <td style="text-align:right; font-weight:700; color:${!isPemasukan ? '#dc2626' : '#94a3b8'}">
            ${item.pengeluaran > 0 ? formatRupiah(item.pengeluaran) : '-'}
          </td>
        </tr>
      `;
    });

    tableHtml += `
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="4" style="text-align:right; font-weight:800; font-size:0.95rem">TOTAL REKAPITULASI DANA:</td>
            <td style="text-align:right; font-weight:800; color:#166534; font-size:1rem">${formatRupiah(fin.totals.pemasukan)}</td>
            <td style="text-align:right; font-weight:800; color:#dc2626; font-size:1rem">${formatRupiah(fin.totals.pengeluaran)}</td>
          </tr>
          <tr class="saldo-row">
            <td colspan="4" style="text-align:right; font-weight:800; font-size:1.05rem; color:#004d28">SALDO KAS AKHIR BERSIH:</td>
            <td colspan="2" style="text-align:right; font-weight:900; color:#006837; font-size:1.15rem">${formatRupiah(fin.totals.saldo)}</td>
          </tr>
        </tfoot>
      </table>
    `;

    tableContainer.innerHTML = tableHtml;
  }
}

// 8. Modal Activity Detail
function openActivityDetail(id) {
  const act = LPJ_DATA.activities.find(a => a.id === id);
  if (!act) return;

  const modal = document.getElementById('activityModal');
  const modalBody = document.getElementById('modalBodyContent');
  if (!modal || !modalBody) return;

  const imagesHtml = act.images.length > 0 ? `
    <div style="margin-top:1.5rem">
      <h4 style="font-size:1rem; font-weight:700; color:#004d28; margin-bottom:0.75rem">🖼️ Dokumentasi Foto (${act.images.length} Berkas)</h4>
      <div class="modal-gallery-grid">
        ${act.images.map(img => `
          <div class="modal-gallery-item" onclick="openLightbox('${img}')">
            <img src="${img}" alt="Dokumentasi ${escapeHtml(act.kegiatan)}" loading="lazy" />
          </div>
        `).join('')}
      </div>
    </div>
  ` : `
    <div style="margin-top:1.5rem; background:#f8fafc; padding:1rem; border-radius:8px; border:1px solid #e2e8f0; text-align:center; color:#64748b;">
      <em>Belum ada lampiran foto dokumentasi fisik untuk kegiatan ini.</em>
    </div>
  `;

  const docsHtml = act.docs.length > 0 ? `
    <div style="margin-top:1.5rem">
      <h4 style="font-size:1rem; font-weight:700; color:#004d28; margin-bottom:0.75rem">📄 Berkas & Surat Tugas (${act.docs.length})</h4>
      <div style="display:flex; flex-direction:column; gap:0.5rem">
        ${act.docs.map(d => `
          <a href="${d.path}" target="_blank" class="btn btn-outline" style="justify-content:flex-start; font-weight:600">
            📑 ${escapeHtml(d.name)}
          </a>
        `).join('')}
      </div>
    </div>
  ` : '';

  modalBody.innerHTML = `
    <div>
      <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.75rem">
        <span class="role-badge ${act.peran.toLowerCase()}">${act.peran}</span>
        <span style="font-size:0.85rem; font-weight:600; color:#64748b">📅 ${formatDateIndo(act.tgl)}</span>
        <span style="font-size:0.85rem; font-weight:600; color:#64748b">📍 ${escapeHtml(act.lokasi)}</span>
      </div>
      <h2 style="font-family:'Outfit',sans-serif; font-size:1.5rem; font-weight:800; color:#004d28; margin-bottom:1rem">
        #${act.no}. ${escapeHtml(act.kegiatan)}
      </h2>

      <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.5rem">
        ${act.seksi1 ? `<span class="tag" style="background:#e6f4ed; color:#006837; font-size:0.8rem; padding:0.3rem 0.75rem">${escapeHtml(act.seksi1)}</span>` : ''}
        ${act.seksi2 ? `<span class="tag" style="background:#fff7ed; color:#c2410c; font-size:0.8rem; padding:0.3rem 0.75rem">${escapeHtml(act.seksi2)}</span>` : ''}
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:1.25rem; margin-bottom:1rem">
        <h4 style="color:#006837; font-weight:700; font-size:0.95rem; margin-bottom:0.4rem">📌 OUTPUT (Hasil Langsung Kegiatan):</h4>
        <p style="font-size:0.95rem; color:#0f172a; line-height:1.6">${escapeHtml(act.output)}</p>
      </div>

      <div style="background:#fefce8; border:1px solid #fef08a; border-radius:12px; padding:1.25rem; margin-bottom:1rem">
        <h4 style="color:#b45309; font-weight:700; font-size:0.95rem; margin-bottom:0.4rem">🌟 OUTCOME (Dampak Jangka Panjang):</h4>
        <p style="font-size:0.95rem; color:#0f172a; line-height:1.6">${escapeHtml(act.outcome)}</p>
      </div>

      ${imagesHtml}
      ${docsHtml}
    </div>
  `;

  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('activityModal');
  if (modal) modal.classList.remove('active');
}

function openLightbox(imgSrc) {
  const lightbox = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  if (lightbox && img) {
    img.src = imgSrc;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  if (lightbox) lightbox.classList.remove('active');
}

// Helpers
function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const y = parts[0];
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return `${d} ${months[m] || ''} ${y}`;
}

function formatRupiah(number) {
  if (!number && number !== 0) return 'Rp 0';
  return 'Rp ' + number.toLocaleString('id-ID');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}
