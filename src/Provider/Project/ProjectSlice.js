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

const initialState = {
  projects: [],
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
    setRecommendedCosts: (state, action) => {
      state.recommendedCosts = action.payload;
    },
    setLoadingRecommendedCosts: (state, action) => {
      state.loadingRecommendedCosts = action.payload; // Add reducer for loading state
    },
    createProject: (state, action) => {
      state.projects.push(action.payload);
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUniqueInfrastrukturProyek.fulfilled, (state, action) => {
        state.uniqueInfrastrukturProyek = action.payload;
      })
      .addCase(fetchUniqueInfrastrukturProyek.rejected, (state, action) => {
        state.uniqueInfrastrukturProyek = {};
      });
  },
});

export const {
  setProjects,
  setRecommendedCosts,
  setLoadingRecommendedCosts,
  createProject,
  setSelectedProjectDetails,
  setProjectDetailCache, // NEW
  deleteProjectById,
} = projectSlice.actions;

const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  return { Authorization: `Bearer ${token}` };
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

export const updateProject = (projectId, projectData) => async (dispatch) => {
  try {
    // Build a normalized payload to avoid null/undefined fields
    const normalized = (() => {
      const pd = projectData || {};
      const tahunHeader = Number(pd.tahun ?? new Date().getFullYear());
      const volumeHeader = Number(pd.volume ?? 0);
      const lokasiHeader = pd.lokasi ?? '';
      const infraHeader = pd.infrastruktur ?? '';
      const tipeHeader = pd.kategori ?? '';
      const inflasiHeader = pd.inflasi === null || pd.inflasi === undefined ? null : Number(pd.inflasi); // NEW

      const normalizeNumber = (v, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
      };
      const normalizeString = (v, fallback = '') => (v ?? '') !== '' ? v : fallback;

      const costs = Array.isArray(pd.constructionCosts) ? pd.constructionCosts : [];
      const normalizedCosts = costs.map((c) => ({
        id: c.id, // keep id if present
        workcode: normalizeString(c.workcode), // NEW
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
        tipe: normalizeString(tipeHeader || c.tipe, tipeHeader),
        projectId: Number(projectId), // NEW: bind each cost to current project id
      }));

      return {
        ...pd,
        tahun: tahunHeader,
        volume: volumeHeader,
        infrastruktur: infraHeader,
        lokasi: lokasiHeader,
        kategori: tipeHeader,
        inflasi: inflasiHeader, // NEW
        constructionCosts: normalizedCosts,
      };
    })();

    // DEBUG: log normalized payload and check missing fields
    if (typeof window !== 'undefined') {
      console.log('[updateProject] projectId:', projectId);
      console.log('[updateProject] normalized payload:', normalized);
      if (Array.isArray(normalized.constructionCosts)) {
        const required = [
          'uraian',
          'specification',
          'qty',
          'satuan',
          'hargaSatuan',
          'totalHarga',
          'aaceClass',
          'tahun',
          'infrastruktur',
          'volume',
          'satuanVolume',
          'kelompok',
          'kelompokDetail',
          'lokasi',
          'tipe',
        ];
        const missingReport = normalized.constructionCosts
          .map((c, idx) => {
            const missing = required.filter((k) => c[k] === undefined || c[k] === null || c[k] === '');
            return missing.length ? { idx, id: c.id, missing } : null;
          })
          .filter(Boolean);
        if (missingReport.length) console.warn('[updateProject] Missing fields per item:', missingReport);
      }
    }

    const res = await axios.put(
      `${process.env.REACT_APP_API}/projects/${projectId}`,
      normalized,
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

export const fetchProjectDetailCache = (projectId) => async (dispatch, getState) => { // NEW
  try {
    if (getState().projects.detailCache[projectId]) return getState().projects.detailCache[projectId];
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

export default projectSlice.reducer;
