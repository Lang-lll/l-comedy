import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CountState {
  num: number
}

const initialState: CountState = {
  num: 0,
}

export const userSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    updateNum: (state, action: PayloadAction<number>) => {
      state.num = action.payload
    },
  },
})

export const { updateNum } = userSlice.actions
export default userSlice.reducer
