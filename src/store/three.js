import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const store = (set, get) => ({
  images: [],
  setImage: (newImage) => {
    set((state) => {
      const imageIndex = state.images.findIndex((image) => image.id === newImage.id)
  
      // Se l'immagine esiste, aggiorna altrimenti, aggiungi.
      const updatedImages = imageIndex !== -1
        ? state.images.map((image, index) => index === imageIndex ? newImage : image)
        : [...state.images, newImage]
  
      return { images: updatedImages }
    });
  }
})

const useThreeStore = create(devtools(store, { name: 'Three Store' }))

export default useThreeStore
