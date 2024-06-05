import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"

import Loader from "../components/Loader";
import { PointLight } from "three";
import { Sky } from "../models/Sky";
import { Bird } from "../models/Bird";
import { Plane } from "../models/Plane";
import HomeInfo from "../components/HomeInfo";
import {Island} from "../models/Island";
import sakura from "../assets/sakura.mp3"
import { soundoff, soundon } from "../assets/icons";


const Home = () => {
  const audioRef = useRef(new Audio(sakura))
  audioRef.current.volume=0.4
  audioRef.current.loop = true
  const [  isRotating, setIsRotating,] = useState(false)
  const [currentStage, setCurrentStage] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    if(isPlaying){
      audioRef.current.play()
    }
  
    return () => {
      audioRef.current.pause()
    }
  }, [isPlaying]),

  setTimeout(() => {
    setBlink(!blink)
  }, 1000);
  

  const adjustIslandForScreenSize = () => {

    let screenScale=null
    let screenPosition = [0, -6.5, -43];
    let rotation=[0.1,4.7, 0]

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
      
    } else {
      screenScale = [1, 1, 1];
       }

    return [screenScale, screenPosition,rotation];
  };

  
  const adjustBiplaneForScreenSize = () => {
    let screenScale, screenPosition;

    // If screen width is less than 768px, adjust the scale and position
    if (window.innerWidth < 768) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }

    return [screenScale, screenPosition];
  };

  const [islandScale, islandPosition,islandRotation] = adjustIslandForScreenSize();
  
  const [biplaneScale, biplanePosition] = adjustBiplaneForScreenSize();


  
  return (
  <section className='w-full h-screen relative'>
   {blink &&  <div className='absolute top-16 left-0 right-0 z-10 flex items-center
      justify-center'>
        <p className=" text-red-500">Please use arrow right or left key to scroll/navigate</p>
      </div>
   }  <div className='absolute top-28 left-0 right-0 z-10 flex items-center
      justify-center'>
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent 
        ${islandRotation? "cursor-grabbing": "cursor-grab"}
        `
      }
        camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader/>}>
          <directionalLight 
          position={[1,1,1]} 
          intensity={2} 
          />
          <ambientLight intensity={0.5}/>
          {/* <spotLight/> */}
          {/* <PointLight/> */}
          <hemisphereLight skyColor="#b1e1ff" 
          groundColor="#000000" 
          intensity={1}/>
          <Bird/>
          <Sky isRotating={isRotating}/>
         <Island
        rotation={islandRotation}
        position={islandPosition} 
        scale ={islandScale}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        setCurrentStage={setCurrentStage}
        />
        <Plane 
        isRotating={isRotating}
        position={biplanePosition}
        rotation={[0, 20.1, 0]}
        scale={biplaneScale}
        />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-2 left-2">
        <img src={!isPlaying ?soundoff : soundon}
        alt="Sound" 
        className="w-10 h-10 cursor-pointer object-contain"
        onClick={()=>setIsPlaying(!isPlaying)}/>
      </div>
    </section>
  )
}

export default Home