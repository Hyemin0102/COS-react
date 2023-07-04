import uuid from "react-uuid";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, get, set, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export async function login() {
  return signInWithPopup(auth, provider).catch(console.error); //then이 없어도 onAuthStateChanged 에서 user받아오기때문에 없어도 됨
}

//logout 함수 호출 시 setState의 user값 null값으로 바꾸기 (비우기)
export async function logout() {
  return signOut(auth).then(() => null);
}

//callback함수를 인자로 사용(setUser함수)
export function onUserStateChange(callback) {
  onAuthStateChanged(auth, async (user) => {
    //1.사용자가 로그인 한 경우
    const updatedUser = user ? await adminUser(user) : null;
    callback(updatedUser);
  });
}

const database = getDatabase(app); //실시간 데이터베이스 사용 가능한 코드 가져옴

//2.사용자가 어드민 권한 있는지 확인해서 isAdmin 을 user안에 넣음
//firebase의 admin 정보 가져오기
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

//입력한 product 값 firsbase에 집어넣는 함수(adminUser함수랑 비슷하게)
//firebase에 입력한 상품 정보 집어넣기
export async function addNewProduct(product, image) {
  //image - 이미지url
  const id = uuid();
  return set(ref(database, `products/${id}`), {
    ...product,
    id,
    price: parseInt(product.price), //숫자열로 변환
    options: product.options.split(","), //쉼표 구분해서 문자열을 새 배열로 반환
    image, //이미지 url
  });
}

//firsebase 입력한 제품 가져오는 함수
export async function getProduct() {
  return get(ref(database, "products")).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val()); //받아온 데이터베이스의 value값만 객체의 값으로 배열 만듦
    }
  });
}

//사용자 카트 추가, 업데이트
export async function addOrUpdateToCart(userId, product) {
  return set(ref(database, `carts/${userId}/${product.id}`), product);
} //product인자는 장바구니에 업데이트하려는 값

//특정 사용자 카트에 정보 가져오는 함수
export async function getCart(userId) {
  return get(ref(database, `carts/${userId}`)).then((snapshot) => {
    const items = snapshot.val() || {}; //비어있을때 오류날까봐 변수 지정
    return Object.values(items); //받아온 데이터베이스의 value값만 객체의 값으로 배열 만듦
  });
}

//카트에서 제품 삭제하는 함수
export async function removeFromCart(userId, productId) {
  //삭제할때 필요한 인자 내가 정함
  return remove(ref(database, `carts/${userId}/${productId}`));
}

/* 
<함축 전>
export async function login() {
  //비동기 함수
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      //console.log("user", user);
      return user;
    })
    .catch(console.error);
  //catch((error) => console.error(error)); 받아오는 인자, 호출하는 인자 동일할때 생략
}

//logout 함수 호출 시 setState의 user값 null값으로 바꾸기 (비우기)
export async function logout() {
  return signOut(auth).then(() => null);
}
 */
