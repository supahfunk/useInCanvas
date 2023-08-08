import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const store = (set) => ({
  lenis: null,
  setLenis: (instance) => set(
    (st) => {
      st.lenis = instance
    },
    false,
    'SCROLL/SET_INSTANCE',
  ),
  node: null,
  setNode: (instance) => set(
    (st) => {
      st.node = instance
    },
    false,
    'SCROLL/SET_NODE',
  ),
  store: {
    scroll: 0,
    limit: 0,
    direction: 1,
    velocity: 0,
  },
})

const useScrollStore = create(devtools(store, { name: 'Scroll Store' }))

export default useScrollStore
