import React, {useState } from 'react';
import {useLocation} from 'react-router-dom';
import Button from '../components/ui/Button';
import { addOrUpdateToCart } from '../api/firebase';
import { useAuthContext } from '../components/context/AuthContext';
import {useMutation,useQueryClient } from '@tanstack/react-query';

export default function ProductDetail() {
  const {uid} = useAuthContext(); 
  const {
      state:{
              product:{
                      category,
                      description,
                      id,
                      image,
                      price,
                      title,
                      options
                  }
            },
        } = useLocation();

  //const location = useLocation(); 구조분해 안하는 경우
  //productCard에서 보내준 state props에서 필요한거 구조분해
  //console.log('location',location.state);


  const [selected,setSelected] = useState(options && options[0]); //첫번째 아이템 선택되게 
  //console.log('selectedeeee',selected)
  const [success,setSuccess] = useState();//성공표시

  //장바구니 추가 함수
  const handleClick = () =>{
    //product 넘겨줄 값들, id는 사용자의 id 가져와야함
    const product= {id,title,image,options:selected,price,title,quantity:1}
    //addOrUpdateToCart(uid,product) - queryClient 사용하고 성공했을때 지정
    addOrUpdateItem.mutate(product,{
      onSuccess:()=>{
        setSuccess('장바구니에 추가 되었습니다.');
        setTimeout(()=>setSuccess(null),3000)
      }
    })
    console.log('클릭하면 보내는거',product)
  }

  //옵션 선택
  const handleSelect =(e)=>{
    setSelected(e.target.value)
  }; 

  //useMutation - useQuery사용 시 바로 적용 안되는 점 개선하고 실시간 업데이트를 위해
  //CartStatus의 useQuery stale 속성으로 시간 지정해준거 무효화 시킴. 그렇다고 그 속성 지정 안하면 적용 안됨. 근데 왜 여기서 쓸까..? addOrUpdateToCart 함수를 사용해줘야해서...
  const queryClient = useQueryClient();
  const addOrUpdateItem = useMutation((product)=>addOrUpdateToCart(uid,product),{
    onSuccess:()=>queryClient.invalidateQueries(['carts',uid || ''])
    //carts키를 가진 쿼리를 유효하게 만듦
  })

  const formatPrice = price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  
  return (
    <div className='w-full max-w-screen-xl py-24 md:py-40 m-auto p-8'>
      <section className='flex flex-col md:flex-row justify-center md:gap-36 gap-10'>
        <img className='w-1/2' src={image} alt={title}/>
        <div className='w-1/2'>
          <p className='pb-2'>{title}</p>
          <p className='pb-2'>{`￦${formatPrice}`}</p>
          <p className='pb-4'>{description}</p>
          <div className='pb-10'>
            <label htmlFor='select'></label>
            <select name="" id="select" onChange={handleSelect} value={selected}>
              {options && options.map((option,index)=>(
                <option key={index}>{option}</option>
              ))}
            </select>
          </div>
          {success && <p className='text-lg py-5'>{success}</p>}
          <Button onClick={handleClick} text='장바구니에 추가'/>
          </div>
        </section>
    </div>
  )
}
