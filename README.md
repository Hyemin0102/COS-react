<img width="45%" src="https://github.com/Hyemin0102/COS-react/assets/128768462/7857d28c-71bc-49fc-a275-0404312370aa">
<img width="45%" src="https://github.com/Hyemin0102/COS-react/assets/128768462/e2681613-d1a5-4db7-b897-6842a931d640">


# COS_shoppingmall
COS 쇼핑몰 브랜드 홈페이지를 react로 재구현 한 쇼핑몰 웹사이트

<br>

## 🔎프로젝트 소개
https://astounding-pegasus-6a3f02.netlify.app

firebase google 로그인 연동으로 로그인 기능을 구현하고, 로그인 상태를 context API로 관리해 전역적으로 사용하며, 관리자 계정으로 로그인 한 경우 해당 계정만 상품 관리 탭이 보이도록 구현하였다.

또 관리자가 상품 등록 시 이미지 파일을 cloudinary로 업로드 해 url을 얻고 이를 firebase 실시간 데이터베이스 등록 시 이미지 url로 사용하였으며, useQuery로 데이터 베이스를 비동기적으로 가져와 화면을 구성했다.

<br>

## 🧾목차
* [⚙개발 환경](#개발-환경)
* [⏱개발 기간](#개발-기간)
* [🚩주요 기능](#주요-기능)
  - firebase google 로그인 연동
  - context api 로그인 정보 관리
  - firebase admin계정 권한 부여 / 실시간 데이터베이스 관리
  - cloudinary 이미지 업로드 로직 함수
  - useQuery hook으로 firebase 실시간 데이터베이스 비동기 가져오기
* [🛠개선 사항](#개선-사항)
  - 코드 스플리팅(React.lazy, Suspense)
* [💡문제 해결](#문제-해결)
* [😊프로젝트를 마치며](#프로젝트를-마치며)

<br>
<hr>

## ⚙개발 환경
React, react-router-dom, react-query, firebase, cloudinary, tailwind css

<br>
<hr>

## ⏳개발 기간
2023.06.28 ~ 2023.07.11 (약 2주)

<br>
<hr>

# 🚩주요 기능
* [router](#router)
* [firebase google 로그인 연동](#firebase-google-로그인-연동)
* [context api 로그인 정보 관리](#context-api-로그인-정보-관리)
* [firebase admin계정 권한 부여 / 데이터베이스 관리](#firebase-admin계정-권한-부여)
* [cloudinary 이미지 업로드 로직 함수](#cloudinary-이미지-업로드-로직-함수)
* [useQuery hook으로 firebase 실시간 데이터베이스 비동기 가져오기](#useQuery-hook으로-firebase-실시간-데이터베이스-비동기-가져오기)
* tailwind css

<br>

## 📌코드 리뷰

### 💻router
```javascript
const LazyApp = lazy(()=>import("./App"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyApp />
      </Suspense>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, path: "/", element: <Home /> },
      { path: "/products", element: <AllProducts /> },
      {
        path: "/products/new",
        element: (
          <ProtectedRoute requireAdmin>
            {" "}
            {/* admin계정인지 조건 하나 더 붙어서 이게 true 인 경우 */}
            <NewProduct />
          </ProtectedRoute>
        ),
      },
      { path: "/products/:id", element: <ProductDetail /> },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <MyCart />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```

```javascript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextPorvider>
        <Navbar />
        <Outlet />
      </AuthContextPorvider>
    </QueryClientProvider>
  );
}
```

<br>

### 💻firebase google 로그인 연동
firebase 공식 문서 -> 인증 → 웹 → google 페이지에서 필수 문법을 제공하는데 해당 코드를 가져와서 변경해준다.

**firebase.js**
```javascript
import { initializeApp } from "@firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, get, set, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAtZV231iqFS2vqdfS7BNAWhxG6_Hq5XrM",
  authDomain: "shop-cos.firebaseapp.com",
  projectId: "shop-cos",
  databaseURL: "https://shop-cos-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export async function login() {
  return signInWithPopup(auth, provider).catch(console.error);
}

//logout 함수 호출 시 setState의 user값 null값으로 바꾸기 (비우기)
export async function logout() {
  return signOut(auth).then(() => null);
}
```

login 클릭했을 때 로그인 정보를 받아와야 하기때문에 onClick 시 실행할 함수 만들어주고 그 안에 signInWithPopup 문법 넣어주는데, 로그인 상태를 context로 관리해 user 상태를 전역적으로 사용할 수 있게 해주었다.
(참조: Authentication(사용자 인증 및 관리) -> 구글 -> 사용설정 -> 빌드 -> 웹 -> 시작하기 -> 로그인 상태 관찰 문법)

**Navbar.js**
```javascript
export default function Navbar() {
  const {user,login,logout} = useAuthContext(); 
  
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
            {user && <Button onClick={logout} text={'LOGOUT'} />}
            {!user && <Button onClick={login} text={'LOGIN'} />}
          </nav>
        </header>
      </div>
    </div>
  )
}
```
이렇게 작성 시 logout/login 클릭했을 때 login / logout 함수를 바로 호출해 상태 업데이트 할 수 있다.
<hr>
<br>

### 💻context api 로그인 정보 관리
**AuthContext.jsx**
```javascript
//1.context 정의
const AuthContext = createContext();

//2.범위 지정
export function AuthContextPorvider({children}){
  const [user,setUser] = useState();//로그인 여부(로그인되었을때 정보 다 넣어놓음)
  useEffect(()=>{ //화면이 리로드됐을때 로그인 상태 관찰하는 함수 작동(firebast 파일)
    onUserStateChange((user)=>{
      console.log('dddd',user)
      setUser(user)})},[]) //결과값 받아와서 setUser 업데이트
      
  return (
    <AuthContext.Provider value={{user,login,logout}}>
      {children}
    </AuthContext.Provider>
  )
}

//4. context 받아 올 컴포넌트에서 사용할 함수 정의
export function useAuthcontext(){
	return useContext(AuthContext); 
}
```
**App.js**
```javascript
function App() {
  return (
    //3. context 범위 지정
		<AuthContextPorvider>
      <Navbar />
      <Outlet />
    </AuthContextPorvider>
  );
}
```
<hr>
<br>

### 💻firebase admin계정 권한 부여
firebase 를 통해 구글 로그인을 구현하고, 로그인한 user 중 특정 user에게 admin 권한을 부여해 쇼핑몰 상품을 등록할 수 있게 구현할 예정.

우선, admin계정으로 사용하고 싶은 user 정보 중 uid 값을 firebase 실시간 데이터에 등록해두고 실시간 데이터베이스 접근 가능하게 설정

**firebase.js**
```javascript
import { getDatabase, ref, get } from "firebase/database";

//2.사용자가 어드민 권한 있는지 확인해서 isAdmin 을 user안에 넣음
async function adminUser(user) {
  //실시간 데이터베이스 안의 admins 참조
  return get(ref(database, "admins")).then((snapshot) => {
    if (snapshot.exists()) {
      const admins = snapshot.val(); //가져온 admins 데이터베이스의 값을 admins 상수에 할당
      const isAdmin = admins.includes(user.uid); //user.uid 에 그 값을 포함하고 있는지 불리언값으로 나옴
      return { ...user, isAdmin }; //user 전체 항목 불러와서 isAdmin 값 끼워넣음
    }
    return user;
  });
}
```
기본 문법에서 chile → get / dbRef → ref /  dbRef → database / `users/${userId}` -> 실시간 데이터베이스에서 내가 설정한 키값 으로 변경해서 실시간 데이터베이스의 값을 snapshot으로 받아옴 → snapshot의 값 (넣어 놓은 uid값)을 상수 할당하고, 이 값이 true인지 false인지 불리언값 출력해서 isAdmin 상수에 할당 그리고 전체 user값 불러와서 거기에 isAdmin 값 끼워넣어줌

*어드민 계정 권한 주기 위해 해야 할 일*

1. **사용자가 로그인 한 경우 확인**
2. **사용자가 어드민 권한이 있는지 확인**
3. 사용자에게 알려줌

→ 사용자가 로그인한 경우는 미리 만들어둔 onUserStateChange 함수에서 확인 가능
```javascript
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
//1.사용자가 로그인 한 경우
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}
```
여기까지 사용자에게 어드민 권한이 있는지 체크하는 단계였고, 다음으로 어드민 계정이라면 해당 계정만 권한을 부여해야한다. 위의 코드에서 실시간 데이터베이스에 admin으로 지정되어있는 uid인 경우 user안에 isAdmin 값을 true로 설정되게 해놓았는데, 그럼 해당 계정에만 product를 편집할 수 있는 권한을 부여하고 cart 또한 로그인이 되어 있는 상태에만 보이도록 추가한다.

**Navbar.js**
```javascript
 <nav className='flex items-center gap-4'>
            {user && user.isAdmin && (<Link to='/products/new'><SlNote /></Link>)}
            {user && <User user={user}/>}
            {user && <Button onClick={logoutProp} text={'LOGOUT'} />}
            {!user && <Button onClick={loginProp} text={'LOGIN'} />}
            {user && <Link to='/cart'><SlBag /></Link>}
  </nav>
```
이렇게 해서 isAdmin이 true인 경우 products/new 로 넘어가도록 해주는데 router로 파라미터 별로 넘어가는 요소에 로그인&어드민 계정 여부를 구분 할 수 있는 정보를 전달해서 조건에 맞는 경우만 넘어가도록 설정해야한다. 


**index.js**
```javascript
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, path: "/", element: <Home /> },
      { path: "/products", element: <AllProducts /> },
      {
        path: "/products/new",
        element: (
          <ProtectedRoute requireAdmin>//isAdmin 여부 확인하는 조건 붙힘
            <NewProduct />
          </ProtectedRoute>
        ),
      },
      { path: "/products/:id", element: <ProductDetail /> },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <MyCart />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```
**ProtectedRoute.jsx**
```javascript
const ProtectedRoute = ({children,requireAdmin}) =>{
		const {user} = useAuthContext(); 
		if(!user){ //로그인 안되어있는 경우 home페이지로 이동
			return <Navigate to='/' replace={true}/>//replace - 뒤로 가기 불가능하게 해주는 옵션
		}
		return children; // 로그인 되어있으면 하위 컴포넌트 작동
}
```
로그인 상태 시만 하위 컴포넌트로 이동하도록 route를 설정해주었다. 이렇게 하면 로그인 되어있을 때 cart 컴포넌트가 보이고, 해당 계정이 admin 계정일때만 상품을 수정할 수 있는 아이콘이 보이고 해당 컴포넌트로 넘어갈 수 있게 된다.
<hr>
<br>

### 💻cloudinary 이미지 업로드 로직 함수
위에서 구현한 어드민 계정만 접근할 수 있는 컴포넌트에서 상품을 등록하는 기능을 구현할 것이다. 이를 위해 내가 올리는 이미지 파일을 url 주소로 변환해줘서 그 값을 받아와야하는데 이 때 cloudinary 라는 사이트를 이용할 것이다.

firebase를 통해 imgurl 을 올릴 수도 있지만 커스터마이징 할 수 없고 cloudinary를 이용하는 경우 미리 커스터마이징을 지정해 사용자가 올리는 이미지를 내가 원하는 느낌으로 작업할 수 있다!
```javascript
export async function uploadImage(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "kj6pktek");
  return fetch("https://api.cloudinary.com/v1_1/dhjix3onq/image/upload", {
    method: "POST",
    body: data,
  }) //여기까진 post 형식으로 클라우드너리 업로드 해줌
    .then((res) => res.json()) //업로드한거 json형식으로 가져옴
    .then((data) => data.url); //그 중에 url만 출력
}
```
uploadImage 함수로 이미지 파일을 업로드하고 url 가져오는 함수를 정의했다. 이렇게 함수를 작동시켜서 file 프로퍼티로 보내면 file 안에는 이미지의 url만 담긴다.

그럼 이 값이 필요한 컴포넌트에서 함수 작동 시키면 끝!! -> firebase에 상품 등록할때 이미지 url부분에 사용
<hr>
<br>

### 💻useQuery hook으로 firebase 실시간 데이터베이스 비동기 가져오기
위에서 실시간 데이터베이스에 등록한 상품들을 불러와 필요한 정보만 화면에 렌더링 될 수 있도록 구현했다.

먼저, firebase 파일에 데이터값 불러오는 함수 생성

**firebase.js**
```javascript
export async function getProduct(){
	return get(ref(database,"products")).then((snapshot) => {
		if(snapshot.exists()){
			return Object.value(snapshot.val());
			}
  });
}
```
useQuery는 서버에서 비동기 작업을 통해 데이터를 가져와야 할 때 사용하는데 isLoadgin, error, data와 같은 변수를 사용해 데이터가 로딩 중인지, 에러가 났는지, 데이터를 잘 가져왔는지 확인할 수 있다. 또한 서버에서 데이터 값이 변경된 경우 자동으로 업데이트해줘 데이터 관리하기가 편리하다는 장점이 있다. <br>useQuery의 첫번째 파라미터는 unique key를 포함한 배열이 들어가고 이 후 동일한 쿼리를 불러올 때 사용한다. 두번째 파라미터는 실제 호출하고자 하는 비동기 함수가 들어가고, 이 때 함수는 promise를 반환하는 형태여야 한다. 이렇게 data를 가져오고 isLodding과 error를 사용해 상태를 간단하게 확인할 수 있다!

**Products.js**
```javascript
const Products = () => { 
//useQuery로 getProduct함수의 데이터 가져옴
const {isLoading,error,data:products} = useQuery(['products'],getProduct);

  return (
    <div>
      {isLoading && <p>Loading</p>}
      {error && <p>{error}데이터 불러오기에 실패하였습니다.</p>}
      <ul>
        {products && products.map(product=> <ProductCard key={product.id} product={product} />)}
      </ul>
    </div>
  )
}

```
이렇게 로딩중인 경우와 에러 발생했을 경우 정의해주고, 받아온 data 값을 화면에 출력해주면 간단하게 끝난다.

<br>
<hr>

## 🛠개선 사항
### 1. 코드 스플리팅
성능 개선을 위해 Lighthouse 성능 측정 점수를 해보았는데 사용하지 않는 자바스크립트 줄이기 라는 항목으로 성능이 크게 저하된 것을 알 수 있었다. 이에 React.lazy 로 자바스크립트 번들을 분할하는 방법을 사용해 보기로 하였다. (+Suspense 컴포넌트 같이 사용해 lazy 컴포넌트가 로드되는 동안 로딩 화면 보여줌)

<img src="https://github.com/Hyemin0102/COS-react/assets/128768462/e278f0b6-c198-4451-a8ba-957150bb3df6">

<br>

## 💡문제 해결
### 1. 코드 스플리팅
App.js 컴포넌트가 렌더링 되는 것을 분할해 처음 로딩 될 때의 번들링 사이즈를 줄여 초기 페이지 로드를 감소시켰다.
```javascript
const LazyApp = lazy(()=>import("./App"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyApp />
      </Suspense>
    ),
//...생략
```
이것 하나만 변경했는데 성능이 크게 늘어난 것을 확인 할 수 있었다.

<img src="https://github.com/Hyemin0102/COS-react/assets/128768462/852cbb9e-5a65-4504-af35-89a58484b3b4">

앞으로 비동기 데이터를 처리할 경우에도 isLoading으로 상태 관리를 하는 대신 Suspense를 사용하는 방법으로 적용해야겠다. 

<br>
<hr>

## 😊프로젝트를 마치며
처음 구현해보는 기능이 많아 처음에는 단순히 로직을 이해하는 것도 어려웠다. 그래도 notion과 git에 정리를 하며 계속 복습하다보니 전체적인 로직과 react hook의 개별적인 쓰임에 대해 이해할 수 있었다. 이 프로젝트를 진행하며 사용한 hook과 firebase에 실시간 데이터베이스를 연동하고, 이미지 주소를 받아오는 작업을 이해하고 새로운 프로젝트에 적용해 사용할 수 있다면 많은 부분에서 도움이 될 것 같다. 가장 어려웠던 점은 한번도 사용해보지 않았던 useQuery와 QueryProvider의 개념이었는데 이 부분은 개인적으로 따로 더 공부를 해야겠다. 그래도 context로 로그인 정보를 전역에서 관리하고 admin계정을 등록해 해당 계정만 상품 관리를 할 수 있도록 기능 구현하는 과정은 굉장히 재미있었고, tailwind로 스타일 적용시키는 부분도 익숙해져서 많은 것을 배운 프로젝트였다. 또 firebase에서 로그인 기능을 구현 시 사용하는 공식 문법도 다른 프로젝트에서 동일한 기능 구현할 때 다시 한번 적용해보면서 복습해봐야겠다.
