import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Parcel } from '@/types/GlobalTypeDefinitions';
import { receiverApiService } from '@/pages/receiver/services/receiverApi';

export interface ReceiverState {
  parcels: Parcel[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;
  stats: Record<string, any> | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  filters: { filter?: string; searchTerm?: string; sortBy?: string; sortOrder?: string };
}

const initialState: ReceiverState = {
  parcels: [],
  pagination: null,
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,
  filters: { filter: 'all', searchTerm: '', sortBy: 'createdAt', sortOrder: 'desc' },
};

export const fetchReceiverParcels = createAsyncThunk(
  'receiver/fetchParcels',
  async ({ email, page = 1, limit = 5, status, search }: { email: string; page?: number; limit?: number; status?: string; search?: string }) => {
    const result = await receiverApiService.fetchParcels(email, page, limit, status, search);
    return { result, page };
  }
);

const receiverSlice = createSlice({
  name: 'receiver',
  initialState,
  reducers: {
    setParcels(state, action: PayloadAction<Parcel[]>) {
      state.parcels = action.payload;
      state.lastUpdated = Date.now();
    },
    addParcel(state, action: PayloadAction<Parcel>) {
      state.parcels.unshift(action.payload);
      state.lastUpdated = Date.now();
    },
    updateParcel(state, action: PayloadAction<Parcel>) {
      const idx = state.parcels.findIndex(p => p._id === action.payload._id);
      if (idx !== -1) state.parcels[idx] = action.payload;
      state.lastUpdated = Date.now();
    },
    removeParcel(state, action: PayloadAction<string>) {
      state.parcels = state.parcels.filter(p => p._id !== action.payload);
      state.lastUpdated = Date.now();
    },
    setPagination(state, action: PayloadAction<any>) {
      state.pagination = action.payload;
    },
    setStats(state, action: PayloadAction<any>) {
      state.stats = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearReceiverState(state) {
      state.parcels = [];
      state.pagination = null;
      state.stats = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
    setFilters(state, action: PayloadAction<any>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      if (!state.pagination) state.pagination = { currentPage: action.payload, totalPages: 1, totalItems: 0, itemsPerPage: 5, hasNextPage: false, hasPrevPage: false };
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceiverParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceiverParcels.fulfilled, (state, action) => {
        state.loading = false;
        const { result, page } = action.payload as any;
        state.parcels = result.parcels || [];
        state.pagination = result.pagination || state.pagination;
        state.stats = result.stats || state.stats;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchReceiverParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error && action.error.message) || 'Failed to fetch parcels';
      });
  }
});

export const { setParcels, addParcel, updateParcel, removeParcel, setPagination, setStats, setLoading, clearReceiverState, setFilters, setCurrentPage } = receiverSlice.actions;

export default receiverSlice.reducer;

export const selectReceiverParcels = (state: any) => {
  try {
    return state?.receiver?.parcels ?? [];
  } catch {
    return [];
  }
};

export const selectReceiverPagination = (state: any) => {
  try {
    return state?.receiver?.pagination ?? null;
  } catch {
    return null;
  }
};

export const selectReceiverStats = (state: any) => {
  try {
    return state?.receiver?.stats ?? null;
  } catch {
    return null;
  }
};

export const selectReceiverLoading = (state: any) => {
  try {
    return state?.receiver?.loading ?? false;
  } catch {
    return false;
  }
};
