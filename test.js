const REST_API_KEY = "8ff342306e1b7d862d5f75fbc30bb978";
let bookInfo = {};


// 검색 버튼 클릭 시 GET으로 도서 api 요청
document.getElementById("search").addEventListener("click", function(){
  
let bookName = document.getElementById("bookName").value;
  $.ajax({
    method: "GET",
    url: "https://dapi.kakao.com/v3/search/book?target=title",
    data: { query : bookName },
    headers: {Authorization: `KakaoAK ${REST_API_KEY}`}
  })
    .done(function( book ) {
      let title = book.documents[0].title;
      let thumbnail = book.documents[0].thumbnail;
      let authors = book.documents[0].authors;
      let contents = book.documents[0].contents;

      // bookInfo 객체에 검색 도서 정보 저장
      bookInfo.title = title;
      bookInfo.thumbnail = thumbnail;
      bookInfo.authors = authors;
      bookInfo.contents = contents;
      console.log(bookInfo); 


      // 도서 썸네일 이미지, 제목 출력
      document.getElementById("title").innerHTML = book.documents[0].title;
      document.getElementById("thumbnail").src = book.documents[0].thumbnail;

      // 코멘트 입력폼 노출
      document.getElementById("commentForm").style.display = "block";
    });
});


// 코멘트 저장 버튼 클릭 시 이벤트
let form = document.getElementById ("commentForm");
form.addEventListener("submit", function(e){
  e.preventDefault();

  let comment = document.getElementById("comment").value;
  bookInfo.comment = comment;
  
  // console.log(bookInfo);
  
  const json = JSON.stringify(bookInfo);
  // console.log(json);


  // 도서정보 post로 저장
  $.ajax({
    url: "http://localhost:4000/books", //주소
    data: bookInfo, //전송 데이터
    type: "POST", //전송 타입    		
  })
  .done(function(response) {
    console.log(response);

    // container 안에 자식 노드로 div 생성
    let bookMark = document.createElement("div");
    bookMark.setAttribute("class", "bookMark");
    document.getElementById("container").appendChild(bookMark);
    bookMark.innerHTML = `<div class='commentBox'>${response.comment}</div>
    <div class='titleBox'>${response.title}</div>`;
    });
  });





// 도서정보 get으로 읽기
// $.ajax({
//   url: "http://localhost:4000/books", //주소
//   data: bookInfo, //전송 데이터
//   type: "GET", //전송 타입    		
// })



// $.get("demo_test.asp", function(data, status){
//   alert("Data: " + data + "\nStatus: " + status);
// });

// fetch("http://localhost:3000/books")
// 	.then((response) =>response.json())
// 	.then((data) => console.log(data))
// 	.catch((error) => console.log(error));











