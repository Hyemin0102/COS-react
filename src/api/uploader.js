//클라우드너리에 이미지 주소 보내주는 함수
export async function uploadImage(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET); //가져온 값 노출되지 않도록 .env 이용
  return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    method: "POST",
    body: data,
  }) //여기까진 post 형식으로 클라우드너리 업로드 해줌
    .then((res) => res.json()) //업로드한거 json형식으로 가져옴
    .then((data) => data.url); //그 중에 url만 출력
}

//.env 파일 변경했으면 다시 yarn start 필요
