import React from 'react';
import { getProduct } from '../api/firebase';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';


const Products = () => { 
//useQuery로 context getProduct함수의 데이터 가져옴
const {isLoading,error,data:products} = useQuery(['products'],getProduct);
console.log('products',products);

  return (
    <div className=''>
      {isLoading && <p>Loading</p>}
      {error && <p>{error}데이터 불러오기에 실패하였습니다.</p>}
      <h2 className='text-center text-2xl md:text-4xl md:pt-18 md:pb-6 pt-20 border-y-black'>2023 여름 컬렉션</h2>
      <div className='w-full max-w-screen-2xl m-auto py-8'>
        <ul className='grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-8'>
          {products && products.map(product=> <ProductCard key={product.id} product={product} />)}
        </ul>
      </div>
    </div>
  )
}

export default Products