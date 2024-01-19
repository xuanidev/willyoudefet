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
  const [loading, setLoading] = useState(true);

  const handleChildSelect = (value: boolean) => {
    setSelected(value);
  };
  const scrollToBottom = () => {
    setTimeout(() => {
      const element = document.getElementById('bottom');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }, 600);
  };

  return (
  <>
    <header></header>
    <main className="main">
      <div className='bg-man__left ' style={{backgroundImage: `url(${left.src})`,}}></div>
      <div className='bg-man__right' style={{backgroundImage: `url(${rigth.src})`}}></div>
      <div className='bg-man' style={{backgroundImage: `url(${bg.src})`}}></div>
      <div className='bg-main' style={{backgroundImage: `url(${granite.src})`, backgroundPosition: 'center', backgroundSize: 'auto', position: 'fixed'}}></div>
        <div className='subcontainer' style={{gap: !selected ? '16px' : '0px'}}>
          <div className={`vs absolute ${!selected ? 'vs--marginTop' : ''}`} style={{marginTop: !selected ? '5%' : ''}} ><h1 className={`${myFont.className} `}>MAN VS</h1></div>
          <Quiz onSelect={handleChildSelect} loading={loading} setLoading={setLoading}/>
          <div id='bottom' style={{bottom: 0}}></div>
        {/*<div className={`bg-granite`} style={{backgroundImage: `url(${granite.src})`}}></div>*/}
      </div>
      <div className="loader" style={{display: loading ? 'block' : 'none'}}></div>
    </main>
  </>
  )
}
