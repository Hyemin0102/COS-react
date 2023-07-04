import React from 'react';
import {useNavigate} from 'react-router-dom';

const ProductCard = ({product, product:{id,image,title,price,category}}) => { 
  //{product} 안에서 필요한 요소만 가져오고 싶은 경우 분해해서 가져옴
  /*
  맨 앞 product는 navigate에서 전체 정보를 통채로 넘겨줘야해서 추가해줌
  navigate의 state는 props 를 넘겨주는 역할 
  */
  const navigate = useNavigate(); //navigate 함수처럼 사용
  const formatPrice = price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
  //console.log({state:{product}},'뭘 보낸거임??')

  return (
    <li onClick={()=>navigate(`/products/${id}`,{state:{product}} )}>
      <img className='w-full' src={image} alt="상품이미지"/>
      <div>
        <p className='text-xs mt-2 mb-1 truncate'>{title}</p>
        <p className='text-xs'>{`￦${formatPrice}`}</p>
      </div>
{/*       <div>{category}</div> */}
    </li>
  )
}

export default ProductCard