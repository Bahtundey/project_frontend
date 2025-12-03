import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pollsAPI } from '../services/api';

export const fetchAllPolls = createAsyncThunk(
  'polls/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await pollsAPI.getAllPolls();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch polls');
    }
  }
);

export const fetchPollById = createAsyncThunk(
  'polls/fetchById',
  async (pollId, { rejectWithValue }) => {
    try {
      const response = await pollsAPI.getPollById(pollId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch poll');
    }
  }
);

export const createNewPoll = createAsyncThunk(
  'polls/create',
  async (pollData, { rejectWithValue }) => {
    try {
      const response = await pollsAPI.createPoll(pollData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create poll');
    }
  }
);

export const submitVote = createAsyncThunk(
  'polls/vote',
  async ({ pollId, optionId }, { rejectWithValue }) => {
    try {
      const response = await pollsAPI.vote(pollId, { optionId });
      return { pollId, optionId, poll: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit vote');
    }
  }
);

export const updatePollStatus = createAsyncThunk(
  'polls/updateStatus',
  async ({ pollId, status }, { rejectWithValue }) => {
    try {
      const response = await pollsAPI.updatePollStatus(pollId, status);
      return { pollId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update poll status');
    }
  }
);

const pollsSlice = createSlice({
  name: 'polls',
  initialState: {
    polls: [],
    selectedPoll: null,
    userVotes: JSON.parse(localStorage.getItem('userVotes')) || {},
    loading: false,
    error: null,
  },
  reducers: {
    selectPoll: (state, action) => {
      state.selectedPoll = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = Array.isArray(action.payload)
          ? action.payload
          : action.payload.polls || [];
      })
      .addCase(fetchAllPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPollById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPollById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPoll = action.payload;
      })
      .addCase(fetchPollById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNewPoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewPoll.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.polls = action.payload;
        } else if (action.payload.polls) {
          state.polls = action.payload.polls;
        } else if (action.payload.id || action.payload._id) {
          state.polls.push(action.payload);
        }
      })
      .addCase(createNewPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitVote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitVote.fulfilled, (state, action) => {
        state.loading = false;
        const { pollId, optionId, poll } = action.payload;
        state.userVotes[pollId] = optionId;
        localStorage.setItem('userVotes', JSON.stringify(state.userVotes));
        const pollIndex = state.polls.findIndex(p => p._id === pollId);
        if (pollIndex !== -1) {
          state.polls[pollIndex] = poll;
        }
        if (state.selectedPoll?._id === pollId) {
          state.selectedPoll = poll;
        }
      })
      .addCase(submitVote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePollStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePollStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { pollId, status } = action.payload;
        const poll = state.polls.find(p => p._id === pollId || p.id === pollId);
        if (poll) {
          poll.status = status;
        }
      })
      .addCase(updatePollStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectPoll, clearError } = pollsSlice.actions;
export default pollsSlice.reducer;
