//TODO:
//Use this video: https://vimeo.com/channels/thenewlocalism/140346003
//IN a bear like the promo image... 

import { polyfill } from 'es6-promise'
polyfill()

import THREE from 'three'
import domready from 'domready'
import viewer from './src/viewer'
import loadGeometry from './src/load-json-model'
import loadTexture from './src/load-texture'
import loadVideoTexture from './src/load-video-texture'
import assign from 'object-assign'

import addMesh from './src/add-mesh'
import addBackground from './src/add-background'

domready(() => { 
  const app = viewer({
    alpha: false,
    preserveDrawingBuffer: false,
    antialias: true
  })
  document.body.appendChild(app.canvas)
  assign(document.body.style, {
    background: '#000',
    overflow: 'hidden'
  })

  //INLIINE WHAT I DONT UNDERSTANT!

  const video = document.createElement( 'video' );
  video.id = 'video';
  video.src = "assets/mvTimelapse.webm"; //Check safari/chrome...
  video.load(); // must call after setting/changing source
  //video.volume(0);
  video.play();

  const videoCanvas = document.createElement( 'canvas' );
     //Should be a ratio..
  videoCanvas.width = 640;
  videoCanvas.height = 360;

  let vcCTX = videoCanvas.getContext( '2d' );
  vcCTX = videoCanvas.getContext( '2d' );

  let videoTexture

  const texOpt = { 
    minFilter: THREE.LinearFilter,
    generateMipmaps: false,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping
  }

  const loadTextures = Promise.all([
    loadTexture('assets/factory.jpg', texOpt),
    loadTexture('assets/road.jpg', texOpt)
  ])


  Promise.all([
    loadGeometry('assets/elk.json'),
    loadVideoTexture(videoCanvas), //would be fun to load 2 videos like he does with images
    loadTexture('assets/lut.png', {
      minFilter: THREE.LinearFilter,
      flipY: false,
      generateMipmaps: false
    })
  ])
    .then(result => {
      let [ geo, vidText, lut ] = result
      videoTexture = vidText
      addMesh(app, assign({}, geo, {
        vidText, lut
      }))
    })
    .then(null, (err) => {
      console.error("Got error")
      console.error(err.stack)
    })

  addBackground(app)
  app.controls.enabled = true






  app.start()
  app.on('render', ()=>{
    if ( video.readyState === video.HAVE_ENOUGH_DATA ) 
    {
      vcCTX.drawImage( video, 0, 0 );
      if ( videoTexture )
        videoTexture.needsUpdate = true;
    }
  })
})

