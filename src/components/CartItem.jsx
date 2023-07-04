import React from 'react';
import { PiPlusLight,PiMinusLight,PiXLight } from "react-icons/pi";
import { addOrUpdateToCart, removeFromCart } from '../api/firebase';
import {useMutation,useQueryClient } from '@tanstack/react-query';

const CartItem = ({product,product:{image,title,options,price,quantity,id},uid}) => {
  const formatPrice = price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

  //MyCart에서 사용한 useQuery 실시간 업데이트 하기 위해 
  const queryClient = useQueryClient();
  const addOrUpdatePlus = useMutation((product)=>
  addOrUpdateToCart(uid,{...product,quantity: quantity+1}),{
    onSuccess:()=>queryClient.invalidateQueries(['carts',uid || ''])
  });

  const addOrUpdateMinus = useMutation((product)=>
  addOrUpdateToCart(uid,{...product,quantity: quantity-1}),{
    onSuccess:()=>queryClient.invalidateQueries(['carts',uid || ''])
  })

  const removeCart = useMutation(()=>
  removeFromCart(uid,id),{
    onSuccess:()=>queryClient.invalidateQueries(['carts',uid || ''])
  })


    //파이어베이스 quantity 수량 빼기
  const handleMinus=()=>{
    if(quantity < 2) return; //수량 1일때는 안빠지게
  /*   addOrUpdateToCart(uid,{
      ...product,
      quantity: quantity-1
    }) */
    addOrUpdateMinus.mutate(product);
  }

  //파이어베이스 quantity 수량 추가
  const handlePlus=()=>{
    /* addOrUpdateToCart(uid,{
      ...product,
      quantity: quantity+1
    }) */
    addOrUpdatePlus.mutate(product)
  }

  //파이어베이스에서 항목 삭제
  const handleDelete=()=> removeCart.mutate(uid,id)
  


  return (
    <li className='flex justify-between gap-5 border-b border-slate-200 py-8'>
      <img className=' w-28' src={image} alt={title} />
      <div className='flex-1'>
        <p className=' pb-2'>{title}</p>
        <p className=' pb-2 '>{options}</p>
        <p>{`￦${formatPrice}`}</p>
      </div>
      <div className='flex justify-between items-center gap-3'>
        <PiMinusLight className=" cursor-pointer" onClick={handleMinus}/>
        <span className=''>{quantity}</span>
        <PiPlusLight className=" cursor-pointer" onClick={handlePlus} />
        <PiXLight className="cursor-pointer text-xl"  onClick={handleDelete}/>
      </div>
    </li>
  )
}

export default CartItem