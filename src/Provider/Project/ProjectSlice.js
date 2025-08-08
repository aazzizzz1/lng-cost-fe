import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const initialState = {
  projects: [],
  recommendedCosts: [],
  selectedProjectDetails: null,
  loadingRecommendedCosts: false, // Add loading state
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
    deleteProjectById: (state, action) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
      if (state.selectedProjectDetails && state.selectedProjectDetails.id === action.payload) {
        state.selectedProjectDetails = null;
      }
    },
  },
});

export const {
  setProjects,
  setRecommendedCosts,
  setLoadingRecommendedCosts, // Export the new action
  createProject,
  setSelectedProjectDetails,
  deleteProjectById, // Export the new action
} = projectSlice.actions;

const getAuthHeaders = () => {
  const token = Cookies.get('accessToken');
  return { Authorization: `Bearer ${token}` };
};

export const fetchProjects = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/projects`, {
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
    await axios.post(`${process.env.REACT_APP_API}/projects`, projectData, {
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
      const tipeHeader = pd.kategori ?? ''; // enforce tipe from kategori (e.g., CAPEX/OPEX)

      const normalizeNumber = (v, fallback = 0) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
      };
      const normalizeString = (v, fallback = '') => (v ?? '') !== '' ? v : fallback;

      const costs = Array.isArray(pd.constructionCosts) ? pd.constructionCosts : [];
      const normalizedCosts = costs.map((c) => ({
        id: c.id, // keep id if present
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
        kapasitasRegasifikasi: normalizeNumber(c.kapasitasRegasifikasi ?? volumeHeader, volumeHeader),
        satuanKapasitas: normalizeString(c.satuanKapasitas),
        kelompok: normalizeString(c.kelompok),
        kelompokDetail: normalizeString(c.kelompokDetail),
        lokasi: normalizeString(c.lokasi ?? lokasiHeader, lokasiHeader),
        // IMPORTANT: tipe comes from project kategori to satisfy backend
        tipe: normalizeString(tipeHeader || c.tipe, tipeHeader),
      }));

      return {
        ...pd,
        tahun: tahunHeader,
        volume: volumeHeader,
        infrastruktur: infraHeader,
        lokasi: lokasiHeader,
        kategori: tipeHeader,
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
          'kapasitasRegasifikasi',
          'satuanKapasitas',
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

export default projectSlice.reducer;
