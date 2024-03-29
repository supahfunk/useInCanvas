import { useEffect, useState } from 'react'
import useThreeStore from '../store/three'
import useSize from '../hooks/useSize'

const WebGLImage = ({ className, src, title, id, aspect }) => {
  const [node, setNode] = useState()
  const setImage = useThreeStore((store) => store.setImage)

  const size = useSize(node)

  useEffect(() => {
    if (!size) return
    const { width, height } = size
    setImage({
      id,
      src,
      width,
      height,
      top: node.offsetTop,
      left: node.offsetLeft
    })
  }, [size])

  return (
    <div ref={setNode} className={`image ${className}`} style={{ '--aspectRatio': aspect }}>
      <img id={id} src={src} alt={title} />
      <span style={{ display: 'inline-block', padding: '30px', fontFamily: 'arial', color: '#fff', fontSize: 40 }}>{id}</span>
    </div>
  )
}

export default WebGLImage
