import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const fetchUniqueInfrastrukturProyek = createAsyncThunk(
  'projects/fetchUniqueInfrastrukturProyek',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/unit-prices/unique-infrastruktur-proyek`,
        { headers: getAuthHeaders() }
      );
      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: toggle project approval (true/false)
export const updateProjectApproval = createAsyncThunk(
  'projects/updateProjectApproval',
  async ({ projectId, approval }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API}/projects/${projectId}/approval`,
        { approval },
        { headers: getAuthHeaders() }
      );
      return res.data?.data; // { id, name, approval }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: fetch dropdown filter options
export const fetchProjectFilters = createAsyncThunk(
  'projects/fetchProjectFilters',
  async ({ infrastruktur } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (infrastruktur) params.infrastruktur = infrastruktur;
      const res = await axios.get(`${process.env.REACT_APP_API}/projects/filters`, {
        params,
        headers: getAuthHeaders(),
      });
      // Normalisasi agar selalu { infrastruktur: [], volume: [] }
      const d = res.data?.data || {};
      return {
        infrastruktur: Array.isArray(d.infrastruktur) ? d.infrastruktur : [],
        volume: Array.isArray(d.volume) ? d.volume : [],
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// NEW: fetch paginated projects (supports /, /manual, /auto)
export const fetchProjectsPaged = createAsyncThunk(
  'projects/fetchProjectsPaged',
  async (args = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState().projects || {};
      const {
        variant = 'manual', // 'manual' | 'auto' | 'all' (default manual)
        page = state.pagination?.page || 1,
        limit = state.pagination?.limit || 10,
        sort = state.filters?.sort || 'createdAt',
        order = state.filters?.order || 'desc',
        infrastruktur = state.filters?.infrastruktur || '',
        volume = state.filters?.volume || '',
      } = args;

      const params = { page, limit, sort, order };
      if (infrastruktur) params.infrastruktur = infrastruktur;
      if (volume) params.volume = volume;

      const suffix =
        variant === 'auto' ? '/auto' : variant === 'manual' ? '/manual' : '';
      const res = await axios.get(`${process.env.REACT_APP_API}/projects${suffix}`, {
        params,
        headers: getAuthHeaders(),
      });

      const payload = res.data || {};
      const data = payload.data || [];
      const pg = payload.pagination || {};

      // FIX: avoid mixing ?? with || by normalizing first
      const totalVal = pg.totalData ?? pg.total ?? data.length ?? 0;
      const limitVal = (pg.limit ?? limit) ?? 10;

      return {
        data,
        pagination: {
          page: pg.currentPage ?? pg.page ?? page,
          limit: limitVal,
          total: totalVal,
          totalPages: pg.totalPages ?? Math.max(1, Math.ceil(totalVal / limitVal)),
        },
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  projects: [],
  // NEW: list filters/pagination/loading/options
  filters: {
    infrastruktur: '',
    volume: '',
    sort: 'createdAt',
    order: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  loading: false,
  filterOptions: {
    infrastruktur: [],
    volume: [],
  },
  recommendedCosts: [],
  selectedProjectDetails: null,
  loadingRecommendedCosts: false,
  detailCache: {}, // NEW: cache project details by id
  uniqueInfrastrukturProyek: {}, // NEW: hasil fetch unique infrastruktur & proyek
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    // NEW: set filters for list
    setProjectFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // NEW: set pagination for list
    setProjectPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setRecommendedCosts: (state, action) => {
      state.recommendedCosts = action.payload;
    },
    setLoadingRecommendedCosts: (state, action) => {
      state.loadingRecommendedCosts = action.payload; // Add reducer for loading state
    },
    createProject: (state, action) => {
      state.projects.push(action.payload);
      // optional: update pagination.total
      state.pagination.total += 1;
      state.pagination.totalPages = Math.max(
        1,
        Math.ceil(state.pagination.total / (state.pagination.limit || 10))
      );
    },
    setSelectedProjectDetails: (state, action) => {
      state.selectedProjectDetails = action.payload;
    },
    setProjectDetailCache: (state, action) => { // NEW
      const { id, data } = action.payload;
      state.detailCache[id] = data;
    },
    deleteProjectById: (state, action) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
      if (state.selectedProjectDetails && state.selectedProjectDetails.id === action.payload) {
        state.selectedProjectDetails = null;
      }
      delete state.detailCache[action.payload]; // NEW: remove from cache
      // NEW: adjust pagination counters
      const p = state.pagination;
      const newTotal = Math.max(0, Number(p.total || 0) - 1);
      const newTotalPages = Math.max(1, Math.ceil(newTotal / (p.limit || 10)));
      state.pagination = { ...p, total: newTotal, totalPages: newTotalPages };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniqueInfrastrukturProyek.fulfilled, (state, action) => {
        state.uniqueInfrastrukturProyek = action.payload;
      })
      .addCase(fetchUniqueInfrastrukturProyek.rejected, (state, action) => {
        state.uniqueInfrastrukturProyek = {};
      })
      // NEW: approval toggle handlers
      .addCase(updateProjectApproval.fulfilled, (state, action) => {
        const updated = action.payload;
        if (!updated?.id) return;
        // update list
        const idx = state.projects.findIndex((p) => String(p.id) === String(updated.id));
        if (idx !== -1) {
          state.projects[idx] = { ...state.projects[idx], approval: updated.approval };
        }
        // update selected details if open
        if (state.selectedProjectDetails && String(state.selectedProjectDetails.id) === String(updated.id)) {
          state.selectedProjectDetails = {
            ...state.selectedProjectDetails,
            approval: updated.approval,
          };
        }
      })
      // NEW: filters options
      .addCase(fetchProjectFilters.fulfilled, (state, action) => {
        const payload = action.payload || { infrastruktur: [], volume: [] };
        // Jika memanggil tanpa infrastruktur: isi keduanya
        // Jika memanggil dengan infrastruktur: biasanya hanya volume yang berubah
        if (payload.infrastruktur?.length) state.filterOptions.infrastruktur = payload.infrastruktur;
        state.filterOptions.volume = payload.volume || [];
      })
      // NEW: paged list handlers
      .addCase(fetchProjectsPaged.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectsPaged.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload?.data || [];
        const p = action.payload?.pagination || {};
        state.pagination = {
          page: p.page || 1,
          limit: p.limit || 10,
          total: p.total || 0,
          totalPages: p.totalPages || 1,
        };
      })
      .addCase(fetchProjectsPaged.rejected, (state) => {
        state.loading = false;
      });
      // (optional) you can add pending/rejected for UI flags if needed
  },
});

export const {
  setProjects,
  // NEW
  setProjectFilters,
  setProjectPagination,
  setRecommendedCosts,
  setLoadingRecommendedCosts,
  createProject,
  setSelectedProjectDetails,
  setProjectDetailCache,
  deleteProjectById,
} = projectSlice.actions;

const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

// NEW: explicit manual projects fetch using paged thunk
export const fetchManualProjects = () => async (dispatch, getState) => {
  const { filters, pagination } = getState().projects || {};
  await dispatch(
    fetchProjectsPaged({
      variant: 'manual',
      page: pagination?.page,
      limit: pagination?.limit,
      sort: filters?.sort,
      order: filters?.order,
      infrastruktur: filters?.infrastruktur,
      volume: filters?.volume,
    })
  );
};

// NEW: explicit auto projects fetch using paged thunk
export const fetchAutoProjects = () => async (dispatch, getState) => {
  const { filters, pagination } = getState().projects || {};
  await dispatch(
    fetchProjectsPaged({
      variant: 'auto',
      page: pagination?.page,
      limit: pagination?.limit,
      sort: filters?.sort,
      order: filters?.order,
      infrastruktur: filters?.infrastruktur,
      volume: filters?.volume,
    })
  );
};

export const fetchProjects = () => async (dispatch, getState) => {
  try {
    const role = getState()?.auth?.user?.role;
    const isAdmin = typeof role === 'string' && role.toLowerCase() === 'admin';
    const endpoint = isAdmin ? `${process.env.REACT_APP_API}/projects` : `${process.env.REACT_APP_API}/projects/manual`;
    const response = await axios.get(endpoint, {
      headers: getAuthHeaders(),
    });
    dispatch(setProjects(response.data.data));
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

export const fetchRecommendedCosts = (projectData) => async (dispatch) => {
  dispatch(setLoadingRecommendedCosts(true)); // Set loading to true
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/projects/recommend`,
      projectData,
      { headers: getAuthHeaders() }
    );
    const data = response.data?.data || [];
    dispatch(setRecommendedCosts(data));
    return data;
  } catch (error) {
    console.error('Error fetching recommended costs:', error);
    return [];
  } finally {
    dispatch(setLoadingRecommendedCosts(false)); // Set loading to false
  }
};

export const fetchProjectById = (projectId) => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/projects/${projectId}`, {
      headers: getAuthHeaders(),
    });
    dispatch(setSelectedProjectDetails(response.data.data));
  } catch (error) {
    console.error('Error fetching project details:', error);
    dispatch(setSelectedProjectDetails(null));
  }
};

export const saveProjectWithCosts = (projectData) => async () => {
  try {
    await axios.post(`${process.env.REACT_APP_API}/projects`, {
      ...projectData,
      inflasi: projectData?.inflasi === undefined ? null : Number(projectData.inflasi), // ensure inflasi included
    }, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Error saving project:', error);
  }
};

export const deleteProject = (projectId) => async (dispatch) => {
  try {
    await axios.delete(`${process.env.REACT_APP_API}/projects/${projectId}`, {
      headers: getAuthHeaders(),
    });
    dispatch(deleteProjectById(projectId));
  } catch (error) {
    console.error('Error deleting project:', error);
  }
};

export const updateProject = (projectId, projectData) => async (dispatch, getState) => {
  try {
    const existing = getState()?.projects?.selectedProjectDetails || {};
    const normalized = (() => {
      const pd = projectData || {};
      const tahunHeader = Number(pd.tahun ?? new Date().getFullYear());
      const volumeHeader = Number(pd.volume ?? 0);
      const lokasiHeader = pd.lokasi ?? '';
      const infraHeader = pd.infrastruktur ?? '';
      const tipeHeader = pd.kategori ?? ''; // keep for project-level category only
      const inflasiHeader = pd.inflasi === null || pd.inflasi === undefined ? null : Number(pd.inflasi);

      const normalizeNumber = (v, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
      };
      const normalizeString = (v, fallback = '') => (v ?? '') !== '' ? v : fallback;

      const costs = Array.isArray(pd.constructionCosts) ? pd.constructionCosts : [];
      const normalizedCosts = costs.map((c) => ({
        id: c.id,
        workcode: normalizeString(c.workcode),
        uraian: normalizeString(c.uraian),
        specification: normalizeString(c.specification),
        qty: normalizeNumber(c.qty),
        satuan: normalizeString(c.satuan),
        hargaSatuan: normalizeNumber(c.hargaSatuan),
        totalHarga: normalizeNumber(c.totalHarga),
        aaceClass: normalizeNumber(c.aaceClass),
        accuracyLow: normalizeNumber(c.accuracyLow, 0),
        accuracyHigh: normalizeNumber(c.accuracyHigh, 0),
        tahun: normalizeNumber(c.tahun ?? tahunHeader, tahunHeader),
        infrastruktur: normalizeString(c.infrastruktur ?? infraHeader, infraHeader),
        volume: normalizeNumber(c.volume ?? volumeHeader, volumeHeader),
        satuanVolume: normalizeString(c.satuanVolume),
        kelompok: normalizeString(c.kelompok),
        kelompokDetail: normalizeString(c.kelompokDetail),
        lokasi: normalizeString(c.lokasi ?? lokasiHeader, lokasiHeader),
        tipe: normalizeString(c.tipe),
        projectId: Number(projectId),
      }));

      return {
        id: Number(projectId),
        name: normalizeString(pd.name, existing?.name || ''),
        tahun: tahunHeader,
        volume: volumeHeader,
        infrastruktur: infraHeader,
        lokasi: lokasiHeader,
        kategori: tipeHeader, // project-level category unchanged
        inflasi: inflasiHeader,
        levelAACE: pd.levelAACE === undefined || pd.levelAACE === '' ? existing.levelAACE : Number(pd.levelAACE),
        harga: pd.harga === undefined || pd.harga === '' ? existing.harga : Number(pd.harga),
        satuan: pd.satuan === undefined ? existing.satuan : normalizeString(pd.satuan, existing.satuan || ''),
        constructionCosts: normalizedCosts,
      };
    })();

    const finalPayload = { ...existing, ...normalized };

    // DEBUG
    if (typeof window !== 'undefined') {
      console.log('[updateProject] projectId:', projectId);
      console.log('[updateProject] final payload (merged):', finalPayload);
    }

    const res = await axios.put(
      `${process.env.REACT_APP_API}/projects/${projectId}`,
      finalPayload,
      { headers: getAuthHeaders() }
    );

    console.log('[updateProject] response:', res?.data);

    await dispatch(fetchProjects());
    await dispatch(fetchProjectById(projectId));
    return res.data?.data;
  } catch (error) {
    console.error('[updateProject] error:', error?.response?.data || error?.message || error);
    throw error;
  }
};

// FIX: complete the truncated function and return cached/fetched detail
export const fetchProjectDetailCache = (projectId) => async (dispatch, getState) => {
  try {
    const cached = getState()?.projects?.detailCache?.[projectId];
    if (cached) return cached;

    const res = await axios.get(`${process.env.REACT_APP_API}/projects/${projectId}`, {
      headers: getAuthHeaders(),
    });
    const data = res.data?.data;
    if (data) dispatch(setProjectDetailCache({ id: projectId, data }));
    return data;
  } catch (e) {
    console.error('Error caching project detail:', e);
    return null;
  }
};

// NEW: Export Project Detail to Excel (styled HTML, grouped by 'kelompok')
export function generateProjectDetailExcel({ project, columns: passedColumns } = {}) {
  const p = project || {};
  const costs = Array.isArray(p.constructionCosts) ? p.constructionCosts : [];

  // Columns default (same as UI)
  const columns = passedColumns && Array.isArray(passedColumns) && passedColumns.length
    ? passedColumns
    : [
        { key: 'workcode', label: 'Workcode' },
        { key: 'uraian', label: 'Uraian' },
        { key: 'specification', label: 'Specification' },
        { key: 'qty', label: 'Qty', className: 'text-right' },
        { key: 'satuan', label: 'Satuan' },
        { key: 'hargaSatuan', label: 'Harga Satuan', className: 'text-right', isCurrency: true },
        { key: 'totalHarga', label: 'Total Harga', className: 'text-right', isCurrency: true },
        { key: 'aaceClass', label: 'AACE Class' },
        { key: 'accuracyLow', label: 'Accuracy Low', className: 'text-right' },
        { key: 'accuracyHigh', label: 'Accuracy High', className: 'text-right' },
        { key: 'tahun', label: 'Tahun', className: 'text-center' },
        { key: 'lokasi', label: 'Lokasi' },
        { key: 'satuanVolume', label: 'Satuan Volume' },
        { key: 'tipe', label: 'Tipe' },
      ];

  // Group by kelompok only (mirror UI)
  const groupsMap = {};
  costs.forEach((it) => {
    const g = it.kelompok || 'Lainnya';
    if (!groupsMap[g]) groupsMap[g] = [];
    groupsMap[g].push(it);
  });

  const groups = Object.keys(groupsMap)
    .sort((a, b) => a.localeCompare(b))
    .map((g) => {
      const items = groupsMap[g].slice().sort((a, b) => {
        const ak = a.workcode || a.kode || '';
        const bk = b.workcode || b.kode || '';
        if (ak && bk) {
          const lc = ak.localeCompare(bk, undefined, { numeric: true });
          if (lc !== 0) return lc;
        }
        return (a.uraian || '').localeCompare(b.uraian || '');
      });
      const total = items.reduce((s, it) => s + (Number(it.totalHarga) || 0), 0);
      return { name: g, items, total };
    });

  const overallTotal = groups.reduce((s, g) => s + g.total, 0);

  const headerInfo = [
    ['Project', p?.name || ''],
    ['Infrastruktur', p?.infrastruktur || ''],
    ['Lokasi', p?.lokasi || ''],
    ['Tahun', p?.tahun || ''],
    ['Inflasi', p?.inflasi ?? '-'],
  ];

  const th = columns
    .map((c) => {
      const align = c.className?.includes('text-right')
        ? 'right'
        : c.className?.includes('text-center')
        ? 'center'
        : 'left';
      return `<th style="border:1px solid #e5e7eb;padding:6px 8px;background:#f9fafb;color:#374151;text-align:${align};font-weight:600;">${c.label}</th>`;
    })
    .join('');

  const groupsHtml = groups
    .map((g) => {
      const header = `
        <tr>
          <td colspan="${columns.length}" style="background:#dbeafe;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-transform:uppercase;">
            ${g.name}
          </td>
        </tr>`;
      const rows = g.items
        .map(
          (item) => `
        <tr>
          ${columns
            .map((c) => {
              const align = c.className?.includes('text-right')
                ? 'right'
                : c.className?.includes('text-center')
                ? 'center'
                : 'left';
              const valRaw = item[c.key];
              const v = c.isCurrency
                ? valRaw
                  ? `Rp${Number(valRaw).toLocaleString()}`
                  : '-'
                : valRaw ?? '-';
              return `<td style="border:1px solid #e5e7eb;padding:6px 8px;color:#111827;text-align:${align};">${v}</td>`;
            })
            .join('')}
        </tr>`
        )
        .join('');
      const total = `
        <tr>
          <td colspan="${columns.length - 1}" style="background:#fef3c7;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-align:right;">Total ${g.name}</td>
          <td style="background:#fef3c7;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-align:right;">Rp${Number(g.total).toLocaleString()}</td>
        </tr>`;
      return header + rows + total;
    })
    .join('');

  const overallRow = `
    <tr>
      <td colspan="${columns.length - 1}" style="background:#fed7aa;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-align:right;">TOTAL</td>
      <td style="background:#fed7aa;color:#111827;padding:8px 10px;font-weight:700;border:1px solid #e5e7eb;text-align:right;">Rp${Number(overallTotal).toLocaleString()}</td>
    </tr>`;

  const summaryTable = `
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:12px;">
      ${headerInfo
        .map(
          (r) => `
        <tr>
          <td style="padding:4px 8px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:600;color:#374151;">${r[0]}</td>
          <td style="padding:4px 8px;border:1px solid #e5e7eb;color:#111827;">${r[1]}</td>
        </tr>`
        )
        .join('')}
    </table>`;

  const table = `
    <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
      <thead><tr>${th}</tr></thead>
      <tbody>
        ${groupsHtml}
        ${overallRow}
      </tbody>
    </table>`;

  const title = `Construction Costs — ${p?.name || ''}`;
  const html = `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"><title>${title}</title></head>
    <body>
      <h2 style="font-family:Arial,Helvetica,sans-serif;color:#111827;">${title}</h2>
      ${summaryTable}
      ${table}
    </body></html>`;

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(p?.name || 'project').replace(/\s+/g, '_')}_construction_costs.xls`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export default projectSlice.reducer;
