import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const store = (set, get) => ({
  images: [],
  setImage: (newImage) => {
    const { images } = get()
    const imageIndex = images.findIndex((image) => image.id === newImage.id)
    if (imageIndex !== -1) {
      set((state) => ({
        images: state.images.map((image, index) => (index === imageIndex ? newImage : image))
      }))
    } else {
      set((state) => ({ images: [...state.images, newImage] }))
    }
  }
})

const useThreeStore = create(devtools(store, { name: 'Three Store' }))

export default useThreeStore
