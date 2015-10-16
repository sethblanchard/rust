import THREE from 'three'
import assign from 'object-assign'

export default function(videoCanvas, opt={}) {
  return new Promise((resolve, reject) => {

    const videoTexture = new THREE.Texture( videoCanvas );
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    resolve(videoTexture)
    //Should have reject('some error message');
  })
}