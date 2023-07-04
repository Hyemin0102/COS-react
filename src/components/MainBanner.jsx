import React from 'react'

const MainBanner = () => {
  return (
    <section className='relative w-full bg-slate-700 h-96'>
      <div className=''>
        <img className='hidden md:block' src="./img/img01.webp" alt="메인배너"/>
        <img className='md:hidden' src="./img/img01_m.webp" alt="메인배너_모바일"/>
      </div>
      <div className='absolute w-full top-1/2 text-center'>
        <img className=' w-1/3 md:w-1/6 m-auto mb-4' src="./img/womens_polo_logo_white.svg" alt="배너_로고"/>
        <p className=' text-white text-5xl font-extrabold font-logofont'>Summer</p>
      </div>
    </section>
  )
}

export default MainBanner