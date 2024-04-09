let bookInfo = {};
let count = 0;

const db = firebase.firestore();

db.collection("bookmark")
  .orderBy("id", "asc")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      // 도서정보 get으로 읽어와서 책갈피 div 생성
      count += 1;
      createDIV(doc.data());
    });
  });

// 검색 버튼 클릭 시 GET으로 도서 api 요청
function search() {
  const REST_API_KEY = config.apikey;
  let bookName = document.getElementById("bookName").value;

  fetch(
    `https://dapi.kakao.com/v3/search/book?target=title&query=${encodeURIComponent(
      bookName
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${REST_API_KEY}`,
      },
    }
  )
    .then((response) => response.json())
    .then((book) => {
      console.log(book);
      let title = book.documents[0].title;
      let thumbnail = book.documents[0].thumbnail;
      let authors = book.documents[0].authors || book.documents[0].publisher;
      let contents = book.documents[0].contents;

      // 현재 날짜 불러오기
      let now = new Date();
      let date = dateFormat(now);

      // bookInfo 객체에 검색 도서 정보 저장
      bookInfo.title = title;
      bookInfo.thumbnail = thumbnail;
      bookInfo.authors = authors;
      bookInfo.contents = contents;
      bookInfo.date = date;

      // 도서 썸네일 이미지, 제목 출력
      document.getElementById(
        "title"
      ).innerHTML = `⌜${book.documents[0].title}⌟`;
      document.getElementById(
        "author"
      ).innerHTML = `${book.documents[0].authors[0] || book.documents[0].publisher} 저`;
      document.getElementById("thumbnail").src = book.documents[0].thumbnail;

      if (matchMedia("screen and (max-width: 767px)").matches) {
        // 화면 크기가 767px이하일때
        // 코멘트 입력폼 노출
        document.querySelector(".searchResult").style.display = "block";
        document.getElementById("commentForm").style.display = "block";

        document.querySelector("#section_left").style.height = "410px";
        document.getElementById("comment").rows = "7";
      }
    })
    .catch((error) => {
      console.log(error.responseJSON);
      alert("찾으시는 책 정보가 없습니다.");
    });
}

// 코멘트 저장 버튼 클릭 시 이벤트
function saveComment() {
  let comment = document.getElementById("comment");

  // 공백검사
  if (comment.value == "") {
    alert("책갈피 내용을 입력해주세요.");
    e.preventDefault();
  }

  // 정규표현식 사용 개행문자\n -> <br> 치환
  let commentValue = comment.value.replace(/(\n|\r\n)/g, "<br>");
  bookInfo.comment = commentValue;
  bookInfo.id = count + 1;

  // 도서정보 firebase에 저장
  db.collection("bookmark")
    .doc(String(count + 1))
    .set(bookInfo)
    .then(() => {
      location.reload(true);
    });
}

// container 안에 자식 노드로 div 생성
function createDIV(response) {
  let colorList = ["#B05044", "#2F4842", "#B77855", "#D88269", "#86A5A8"];

  let bookMark = document.createElement("div");
  bookMark.setAttribute(
    "class",
    "bookMark grid-item animate__animated animate__fadeInUp"
  );
  bookMark.setAttribute("id", count);
  bookMark.setAttribute("onclick", "showModal(this)");
  document.getElementById("container").appendChild(bookMark);
  bookMark.innerHTML = `<div class='commentBox'>${response.comment}</div>
    <div class='titleBox'>${response.title}</div>`;

  // 배경색 변경
  let bookMarks = document.getElementsByClassName("bookMark");

  for (let i = 0; i < bookMarks.length; i++) {
    if (i % 5 == 0) {
      bookMarks[i].style.background = colorList[0];
    } else if (i % 5 == 1) {
      bookMarks[i].style.background = colorList[1];
    } else if (i % 5 == 2) {
      bookMarks[i].style.background = colorList[2];
    } else if (i % 5 == 3) {
      bookMarks[i].style.background = colorList[3];
    } else bookMarks[i].style.background = colorList[4];
  }

  // masonry 레이아웃
  let elem = document.querySelector(".grid");
  let msnry = new Masonry(elem, {
    itemSelector: ".grid-item",
    gutter: 20,
    originTop: true,
  });

  // masonry 겹침
  window.onload = function () {
    var container = document.querySelector("#container");
    new Masonry(container, {
      itemSelector: ".grid-item",
      gutter: 20,
    });
  };

  // 스크롤 이벤트
  // ScrollReveal().reveal(".bookMark", {
  //   interval: 100,
  //   reset: true,
  //   origin: "top",
  //   // delay: 500,
  // });
}

// 모달 띄우기
function showModal(div) {
  const modal = document.querySelector(".modal");
  const modalBg = document.querySelector(".modal_bg");
  const modalBtn = document.querySelector(".close");

  modal.classList.add("fade-in");
  modalBg.classList.add("fade-in");

  modalInput(div);

  // 포커스 관리
  trapFocus(modal);

  // 닫기 버튼 및 배경 클릭 시 모달 닫기
  modalBg.addEventListener("click", closeModal);
  modalBtn.addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.remove("fade-in");
    modalBg.classList.remove("fade-in");

    modalBg.removeEventListener("click", closeModal);
    modalBtn.removeEventListener("click", closeModal);
  }
}

// 모달에 정보 전송
function modalInput(div) {
  // 현재 제목
  const thisID = div.getAttribute("id");

  let docRef = db.collection("bookmark").doc(thisID);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        let data = doc.data();

        document.getElementById("modalThumbnail").src = data["thumbnail"];
        document.getElementById(
          "modalTitle"
        ).innerHTML = `${data["title"]}<br><br>`;
        document.getElementById(
          "modalAuthors"
        ).innerHTML = `<b>작가</b> : ${data["authors"]}`;
        document.getElementById(
          "modalContents"
        ).innerHTML = `<b>줄거리</b> : ${data["contents"]} ...`;
        document.getElementById("modalDate").innerHTML = `${data["date"]} 기록`;
      } else {
        alert("책갈피를 찾을 수 없습니다.");
      }
    })
    .catch((error) => {
      console.error("문서를 불러오는 중 에러가 발생했습니다:", error);
      alert("정보를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.");
    });
}

// 날짜 포멧 설정
function dateFormat(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;
  hour = hour >= 10 ? hour : "0" + hour;
  minute = minute >= 10 ? minute : "0" + minute;

  return (
    date.getFullYear() + "." + month + "." + day + " " + hour + ":" + minute
  );
}

// 화면 사이즈 변경 시, 새로고침
window.onresize = function () {
  document.location.reload();
};

// 책갈피 정렬
let counter = 0;
document.querySelector(".sortBtn").addEventListener("click", function () {
  counter++;
  if (counter % 2 == 1) {
    document.querySelector(".sortBtn").innerHTML = "오래된 순 🔄";
    let elem = document.querySelector(".grid");
    let msnry = new Masonry(elem, {
      itemSelector: ".grid-item",
      gutter: 20,
      isOriginTop: false,
    });
  } else {
    document.querySelector(".sortBtn").innerHTML = "최신순 🔄";
    let elem = document.querySelector(".grid");
    let msnry = new Masonry(elem, {
      itemSelector: ".grid-item",
      gutter: 20,
      isOriginTop: true,
    });
  }
});

// 검색 버튼 클릭 이벤트
const clearInput = () => {
  const input = document.getElementsByTagName("input")[1];
  input.value = "";
};

const clearBtn = document.getElementById("clear-btn");
clearBtn.addEventListener("click", clearInput);

// 모달 포커스 관리
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  firstFocusableElement.focus();

  document.addEventListener("keydown", function (e) {
    const isTabPressed = e.key === "Tab";
    const isEscPressed = e.key === "Escape";

    if (isEscPressed) {
      console.log("isEscPressed");
      document.querySelector(".modal").classList.remove("fade-in");
      document.querySelector(".modal_bg").classList.remove("fade-in");
      return;
    }

    if (!isTabPressed) return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  });
}
