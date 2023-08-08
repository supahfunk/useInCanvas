import Image from '../three/Image'

const data = [
  {
    src: 'https://images.unsplash.com/photo-1691030133693-84d7bbec65a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60',
    aspect: '4/3'
  },
  { src: 'https://plus.unsplash.com/premium_photo-1690440799957-38f180ab63c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60', aspect: '16/9' },
  { src: 'https://plus.unsplash.com/premium_photo-1690267599168-16e08f4aafe4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', aspect: '4/5' },
  { src: 'https://images.unsplash.com/photo-1690442604217-aa441f1ac21e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzMnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60', aspect: '2/3' }
]

const Home = () => {
  return (
    <>
    <Image className="big-image" src='./supah.png' alt="" id={`supah`} aspect={'1960/754'} />
    <div className="grid">
      {[...data, ...data, ...data, ...data].map((img, i) => (
        <Image key={i.toString()} src={img.src} alt="" id={`image-${i}`} aspect={img.aspect} />
      ))}
    </div>
    </>
  )
}

export default Home
