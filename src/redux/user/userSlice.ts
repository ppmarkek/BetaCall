import { userAppwriteSignIn, userSignIn } from '@/app/api/auth/route';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface UserInterface {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  appwriteId: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserState extends UserInterface {
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  _id: '',
  email: '',
  firstName: '',
  lastName: '',
  role: '',
  appwriteId: '',
  verified: false,
  createdAt: '',
  updatedAt: '',
  loading: false,
  error: null,
};

export const signInUser = createAsyncThunk(
  'user/signIn',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userSignIn(credentials);

      if (response.status === 200) {
        document.cookie = `accessToken=${response.data.accessToken}; path=/; Secure; SameSite=Strict;`;
        document.cookie = `refreshToken=${response.data.refreshToken}; path=/; Secure; SameSite=Strict;`;
        return response.data.user;
      } else if (response.status === 403) {
        return rejectWithValue({
          verificationRequired: true,
          email: credentials.email,
        });
      } else {
        return rejectWithValue({ message: 'Incorrect email or password' });
      }
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const signInUserAppwrite = createAsyncThunk(
  'user/signInAppwrite',
  async (
    data: { email: string; appwriteId: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userAppwriteSignIn({
        email: data.email,
        appwriteId: data.appwriteId,
      });

      if (response.status === 200) {
        document.cookie = `accessToken=${response.data.accessToken}; path=/; Secure; SameSite=Strict;`;
        document.cookie = `refreshToken=${response.data.refreshToken}; path=/; Secure; SameSite=Strict;`;
        return response.data.user;
      } else if (response.status === 403) {
        return rejectWithValue({
          verificationRequired: true,
          email: data.email,
        });
      } else if (response.status === 404) {
        const [firstName, lastName] = data.name.split(' ');
        const signUpUrl = `/signUp?socialMedia=true&step=2&email=${encodeURIComponent(
          data.email
        )}&appwriteId=${encodeURIComponent(
          data.appwriteId
        )}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(
          lastName
        )}`;
        return rejectWithValue({ redirectToSignUp: true, signUpUrl });
      }
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const signUpUserAppwrite = createAsyncThunk(
  'user/signUpAppwrite',
  async (
    data: { email: string; appwriteId: string; name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userAppwriteSignIn({
        email: data.email,
        appwriteId: data.appwriteId,
      });

      if (response.status === 200) {
        document.cookie = `accessToken=${response.data.accessToken}; path=/; Secure; SameSite=Strict;`;
        document.cookie = `refreshToken=${response.data.refreshToken}; path=/; Secure; SameSite=Strict;`;
        return response.data.user;
      } else if (response.status === 403) {
        return rejectWithValue({
          verificationRequired: true,
          email: data.email,
        });
      } else if (response.status === 404) {
        return rejectWithValue({
          isNotRegistr: true,
        });
      }
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }
      return rejectWithValue({ message: 'An unknown error occurred' });
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeUserInfo: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        console.log(':::user', action.payload);
        Object.assign(state, action.payload);
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message: string })?.message ||
          'An error occurred';
      });

    builder
      .addCase(signInUserAppwrite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUserAppwrite.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(signInUserAppwrite.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message: string })?.message ||
          'An error occurred';
      });

    builder
      .addCase(signUpUserAppwrite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUserAppwrite.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(signUpUserAppwrite.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message: string })?.message ||
          'An error occurred';
      });
  },
});

export const { removeUserInfo } = userSlice.actions;
export default userSlice.reducer;
