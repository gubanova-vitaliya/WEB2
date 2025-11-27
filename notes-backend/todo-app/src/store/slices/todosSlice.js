import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTodos, postTodos, deleteTodos, putTodos } from '../../api';

// Асинхронные действия
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTodos();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todo, { rejectWithValue }) => {
    try {
      const response = await postTodos(todo);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeTodo = createAsyncThunk(
  'todos/removeTodo',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTodos(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todo, { rejectWithValue }) => {
    try {
      const response = await putTodos(todo);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all', // all, completed, active
    searchQuery: '',
    loading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add todo
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove todo
      .addCase(removeTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(todo => todo.id !== action.payload);
      })
      .addCase(removeTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update todo
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilter, setSearchQuery, clearError } = todosSlice.actions;

// Селекторы
export const selectTodos = (state) => state.todos.items;
export const selectFilter = (state) => state.todos.filter;
export const selectSearchQuery = (state) => state.todos.searchQuery;
export const selectLoading = (state) => state.todos.loading;
export const selectError = (state) => state.todos.error;

export const selectFilteredTodos = (state) => {
  const todos = selectTodos(state);
  const filter = selectFilter(state);
  const searchQuery = selectSearchQuery(state);

  let filteredTodos = todos;

  // Фильтрация по поисковому запросу
  if (searchQuery) {
    filteredTodos = filteredTodos.filter(todo =>
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Фильтрация по статусу (для будущего расширения)
  switch (filter) {
    case 'completed':
      return filteredTodos.filter(todo => todo.completed);
    case 'active':
      return filteredTodos.filter(todo => !todo.completed);
    default:
      return filteredTodos;
  }
};

export default todosSlice.reducer;
