import React from 'react';
import { useAuthContext } from './context/AuthContext';
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children,requireAdmin}) => {
  const {user} = useAuthContext();

  if(!user || (requireAdmin && !user.isAdmin )){ //user가 없는 경우 또는 isAdmin이 false인 경우 리액트돔 navigate로 링크 연결
    return <Navigate to='/' replace={true}/>
    //replace - 뒤로 가기 불가능
  }
  return children; //user가 있는 경우 하위 경로로 넘어감
}

export default ProtectedRoute

/*
  로그인한 사용자가 있는지 확인
  그 사용자가 admin 계정인지 ? 
*/