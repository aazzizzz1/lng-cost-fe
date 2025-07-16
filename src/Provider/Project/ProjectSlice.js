import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  projects: [],
  recommendedCosts: [],
  selectedProjectDetails: null, // Store details of the selected project
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

export const fetchProjects = () => async (dispatch) => {
  try {
    const response = await axios.get('http://localhost:5000/api/projects');
    dispatch(setProjects(response.data.data));
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

export const fetchRecommendedCosts = (projectData) => async (dispatch) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/projects/recommend',
      projectData
    );
    const data = response.data?.data || []; // Extract data from response
    dispatch(setRecommendedCosts(data));
    return data; // Return the payload for further use
  } catch (error) {
    console.error('Error fetching recommended costs:', error);
    return []; // Fallback to an empty array in case of error
  }
};

export const fetchProjectById = (projectId) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/projects/${projectId}`);
    dispatch(setSelectedProjectDetails(response.data.data));
  } catch (error) {
    console.error('Error fetching project details:', error);
    dispatch(setSelectedProjectDetails(null));
  }
};

export const saveProjectWithCosts = (projectData) => async () => {
  try {
    await axios.post('http://localhost:5000/api/projects', projectData);
  } catch (error) {
    console.error('Error saving project:', error);
  }
};

export default projectSlice.reducer;
