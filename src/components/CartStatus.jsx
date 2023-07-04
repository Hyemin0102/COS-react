import React from 'react';
import { SlBag } from "react-icons/sl";
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from './context/AuthContext';
import { getCart } from '../api/firebase';

const CartStatus = () => {
  const {uid} = useAuthContext(); //사용자 정보 context에서 가져옴 
  const {data: products} = useQuery(['carts',uid || ''],()=>getCart(uid),{staleTime:1000})
  //useQuery로 firebase 정보 가져옴
  //console.log('cartstatus',products)
  return (
    <div className='relative'>
      <SlBag />
      {products && <p className='absolute -top-3 -right-3 text-sm'>{products.length}</p> }
    </div>
  )
}

export default CartStatus