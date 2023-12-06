'use client' 
import { useState} from 'react'
import Quiz from '@/components/quiz'
import bg from '../../public/bg-v.png'
import left from '../../public/leftbg2.png'
import rigth from '../../public/rigthbg2.png'
import granite from '../../public/subtle-grunge.png'
import localFont from 'next/font/local'

const myFont = localFont({ src: '../../public/fonts/ZTRavigsfen-Regular.otf' })

export default function Home() {
  const [selected, setSelected] = useState(false);

  const handleChildSelect = (value: boolean) => {
    setSelected(value);
  };

  return (
  <>
    <header></header>
    <main className="main">
      <div className='bg-man__left ' style={{backgroundImage: `url(${left.src})`,}}></div>
      <div className='bg-man__right' style={{backgroundImage: `url(${rigth.src})`}}></div>
      <div className='bg-man' style={{backgroundImage: `url(${bg.src})`}}></div>
      <div className="container">

        <div className='subcontainer' style={{backgroundImage: `url(${granite.src})`, backgroundPosition: 'center', backgroundSize: 'auto',gap: !selected ? '16px' : '0px'}}>
          <div className={`vs absolute ${!selected ? 'vs--marginTop' : '' }`} ><h1 className={`${myFont.className} `}>MAN VS</h1></div>
          <Quiz onSelect={handleChildSelect}/>
        </div>
        {/*<div className={`bg-granite`} style={{backgroundImage: `url(${granite.src})`}}></div>*/}
      </div>
    </main>
  </>
  )
}
