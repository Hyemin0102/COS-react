import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../api/firebase';
import { useAuthContext } from '../components/context/AuthContext';
import CartItem from '../components/CartItem';
import Button from '../components/ui/Button';

export default function MyCart() {
  const {uid} = useAuthContext(); //사용자 정보 context에서 가져옴 
  const {isLoading, data: products} = useQuery(['carts',uid || ''],()=>getCart(uid),{staleTime:1000})//useQuery로 firebase 정보 가져옴
  
  if(isLoading)return <p>Loading...</p>;
  const hasProducts = products && products.length > 0; //쇼핑카트 아이템 있는지 변수 할당
  
  const totalPrice = products && products.reduce(
    (sum,value) =>sum + parseInt(value.price * value.quantity),0);
  const SHIPPING = 3000; //배송비
  const totalCartPrice = totalPrice+SHIPPING;
  

  const formatTotelPrice = totalPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const formatSHIPPING = SHIPPING.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  const formatTotalCartPrice = totalCartPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");



  console.log('dddd',totalPrice+SHIPPING)
  
  return (
  <section className='w-full max-w-screen-xl py-24 md:py-40 m-auto p-8'>
    <div className='flex flex-col'> 
    <h2 className='text-sm pb-3'>장바구니</h2>
    <div className='py-3 flex justify-between gap-20'>
      <ul className='border-t border-black flex-1 pt-1'>
        {!hasProducts && <p className='text-center py-8 font-bold text-lg'>장바구니에 상품이 없습니다.</p>}
        {products && products.map((product)=>(
          <CartItem key={product.id} product={product} uid={uid}/>
        ))}
      </ul>
      <div className='border-t border-black flex-1'>
        <div className='text-sm flex flex-col justify-between gap-8 mt-8'>
          <div className='flex justify-between'>상품 금액<p>{`￦${formatTotelPrice}`}</p></div>
          <div className='flex justify-between'>배송비<p>￦{formatSHIPPING} </p></div>
          <div className='flex justify-between border-t border-slate-200 py-6 text-red-600'>총 금액<p>{`￦${formatTotalCartPrice}`}</p></div>
        </div>
        <div className='text-right'>
          <Button text={'구매하기'} className="w-full"/>
        </div>
      </div>
    </div>

    </div>
  </section>
  )
}
