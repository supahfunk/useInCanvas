import { create } from 'zustand'
import { produce } from 'immer'
import { devtools } from 'zustand/middleware'

const store = (set, get) => ({
  lenis: null,
  setLenis: (instance) =>
    set(
      produce((st) => {
        st.lenis = instance
      }),
      false,
      'SCROLL/SET_INSTANCE'
    ),
  node: null,
  setNode: (instance) =>
    set(
      produce((st) => {
        st.node = instance
      }),
      false,
      'SCROLL/SET_NODE'
    ),
  scroll: 0,
  setScroll: (value) =>
    set(
      produce((st) => {
        st.scroll = value
      }),
      false,
      'SCROLL/SET_SCROLL_VALUE'
    ),
  limit: 0,
  setLimit: (value) =>
    set(
      produce((st) => {
        st.limit = value
      }),
      false,
      'SCROLL/SET_LIMIT_VALUE'
    ),
  direction: 'down',
  setDirection: (direction) => {
    let dir = 'up'
    if (Math.abs(get().scroll - direction) < 1) dir = get().direction
    else if (get().scroll < direction) dir = 'down'
    set(
      produce((st) => {
        st.direction = dir
      }),
      false,
      'SCROLL/SET_DIRECTION'
    )
  },
  velocity: 0,
  setVelocity: (value) =>
    set(
      produce((st) => {
        st.velocity = value
      }),
      false,
      'SCROLL/SET_VELOCITY_VALUE'
    )
})

const useScrollStore = create(devtools(store, { name: 'Scroll Store' }))

export default useScrollStore
