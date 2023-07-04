//import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { SlNote } from "react-icons/sl";
import Menu from '../pages/Menu';
//import { login,logout,onUserStateChange } from '../api/firebase'; //context에서 전부 불러왔기때문에 안써도 됨
import User from './User';
import Button from './ui/Button';
import Banner from './Banner';
import { useAuthContext } from './context/AuthContext';
import CartStatus from './CartStatus';

export default function Navbar() {
  //4.useContext 이용해서 정보 가져오는데 따로 함수 지정해서 사용
  const {user,loginProp,logoutProp} = useAuthContext(); 

  
  return (
    <div className='border-b border-black fixed w-full z-10 t-0 bg-white'>
      <Banner />
      <div className='w-full max-w-screen-2xl m-auto p-4'>
        <header className='flex justify-between items-center'>
          <div className='flex items-center gap-6'>
            <Link to='/'>
              <h1 className='md:text-3xl text-xl font-logofont tracking-widest'>COS</h1>
            </Link>
            <Link to='/products'><Menu /></Link>
          </div>
          <nav className='flex items-center gap-4'>
            {user && user.isAdmin && (<Link to='/products/new'><SlNote /></Link>)}
            {user && <User user={user}/>}
            {user && <Button onClick={logoutProp} text={'LOGOUT'} />}
            {!user && <Button onClick={loginProp} text={'LOGIN'} />}
            
            {user && <Link to='/cart'><CartStatus /></Link>}
          </nav>
        </header>
      </div>
    </div>
  )
}


/* export default function Navbar() {
  const [user,setUser] = useState();

    
  //console.log('dd',user)
  const handleLogin = () =>{
    login()//로그인했을때 user 정보 return 하는 함수
      .then(setUser)
  }
  const handleLogout = () =>{
    logout()//로그인했을때 user 정보 return 하는 함수
      .then(setUser) //null값 받아와서 setUser 업데이트
  }
  return (
    <div className='border-b border-black p-4'>
      <div className='w-full max-w-screen-2xl m-auto'>
        <header className='flex justify-between items-center'>
          <div className='flex items-center gap-6'> 
            <h1 className='text-3xl font-logofont tracking-widest'>COS</h1> {/* md: 붙히면 반응형
            <Link to='/products'><Menu /></Link>
          </div>
          <nav className='flex items-center gap-4'>
            <Link to='/cart'>Cart</Link>
            <Link to='/products/new'><SlNote /></Link>
            {user && <button onClick={handleLogout}>logout</button>} {/* 로그인 되어있는 경우 
            {!user && <button onClick={handleLogin}>login</button>} {/* 로그아웃인 경우 *
          </nav>
        </header>
      </div>
    </div>
  )
} */
