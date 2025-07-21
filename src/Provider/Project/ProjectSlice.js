import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const initialState = {
  projects: [],
  recommendedCosts: [],
  selectedProjectDetails: null,
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
    createProject: (state, action) => {
      state.projects.push(action.payload);
    },
    setSelectedProjectDetails: (state, action) => {
      state.selectedProjectDetails = action.payload;
    },
  },
});

export const {
  setProjects,
  setRecommendedCosts,
  createProject,
  setSelectedProjectDetails,
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

export default projectSlice.reducer;
