import { createContext,useContext,useEffect, useState } from "react";
import { onUserStateChange,login,logout } from "../../api/firebase";

//1.context 정의
const AuthContext = createContext();

//2.범위 지정
export function AuthContextPorvider({children}){
  const [user,setUser] = useState();//로그인 여부(로그인되었을때 정보 다 넣어놓음)
  useEffect(()=>{ //화면이 리로드됐을때 로그인 상태 관찰하는 함수 작동(firebast 파일)
    onUserStateChange((user)=>{
      setUser(user)})},[]) //결과값 받아와서 setUser 업데이트
      //console.log('user',user)
  return (
    <AuthContext.Provider value={{user, uid:user && user.uid, loginProp:login, logoutProp:logout}}>
      {/* uid:user && user.uid 장바구니 추가할때 사용자 uid값 구해와야해서 이것도 같이 보내줌 */}
      {children}
    </AuthContext.Provider>
  )
}
//4.useContext 이용해서 정보 가져오는데 따로 함수 지정해서 사용
export function useAuthContext(){
  return useContext(AuthContext);
}

/*
firebase의 login, logout 함수도 컨텍스트에 포함
5. loginProp:login 프로퍼티(내가 지정):가져온 함수 -> 이름 동일하게 지정하고 축약 가능 
*/