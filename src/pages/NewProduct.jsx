import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { uploadImage } from '../api/uploader';
import { addNewProduct } from '../api/firebase';

export default function NewProduct() {
  const [product, setProduct] = useState({});//입력한 데이터 모으는 역할
  const [file,setFile] = useState(); //이미지url 임시 저장
  const [isUploading,setIsUploading] = useState(false);//업로드중
  const [success,setSuccess] = useState();//성공표시

  const handleChange =(e)=>{//각 변화하는 타겟 알아야함
    console.log(e.target.files);
    const {name, value, files} = e.target; //타겟의 name 속성, 입력값 등 필요함

    if(name==='img'){//name = img 인 경우 파일 임시저장해서 이미지 미리보기
      setFile(files && files[0]);
      return;
    }
    //product 전체 복사해서 [name] 변수에 해당하는 곳에 vlaue값 할당 ,name이 title인 경우 title:value
    //동적으로 변수를 할당하기 위해 [] 사용해야함. [name]이 프로퍼티 이름으로 됨
    setProduct((product)=>({...product,[name]:value}))
    
  }

  //file 업로드하고 img url 받아옴 -> 받아온 url을 product에 넣고 파이어베이스에 올림
  const handleSubmit =(e)=>{ 
    e.preventDefault();
    setIsUploading(true); //업로드 중 표시
    uploadImage(file) //클라우드너리에 이미지 업로드
    .then(url=>{ //이미지 url 받아옴
      //console.log('options',product.options.split(","))
      addNewProduct(product,url) //firebase에 정보 넘겨줌
      .then(()=>{
        setSuccess('제품 등록이 완료되었습니다.');
        setTimeout(()=>{ //시간 설정해서 5초 이후에 success 값 변경
          setSuccess(null)
        },5000)
      })
    })
    .finally(()=>setIsUploading(false))//finally - 결과 성공,실패 상관없이 종료 되면 실행
  }
  return (
    <section className='w-full pt-40 max-w-screen-xl m-auto'>
      {success ? <p className='text-center text-2xl font-bold'>{success}</p> : <h2 className='text-center text-2xl font-bold'>새로운 제품 등록</h2>}
      {file && <img className='mx-auto m-10 h-96' src={URL.createObjectURL(file)} alt="localfile"/>}
      <form className='flex flex-col m-11' onSubmit={handleSubmit}>
        <input type="file" accept='image/*' name='img' onChange={handleChange} required/>
        <input type="text" name='title' placeholder='제품명' onChange={handleChange} value={product.title ?? ''} required/>
        <input type="number" name='price' placeholder='가격' onChange={handleChange} value={product.price ?? ''} required/>
        <input type="text" name='category' placeholder='카테고리' onChange={handleChange} value={product.category ?? ''} required/>
        <input type="text" name='description' placeholder='제품설명' onChange={handleChange} value={product.description ?? ''} required/>
        <input type="text" name='options' placeholder='옵션(,로 구분)' onChange={handleChange}value={product.options ?? ''} required/>
        <Button text={isUploading?"Uploading...":'제품등록하기'}></Button>
      </form>
    </section>
  )
}

/* 
  내장 오브젝트 URL에 createObjectURL 매소드-해당 파일에 대한 임시 url 생성, 이미지 미리 보기 
 */
