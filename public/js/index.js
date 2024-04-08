const REST_API_KEY = config.apikey;
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
  let bookName = document.getElementById("bookName").value;
  $.ajax({
    method: "GET",
    url: "https://dapi.kakao.com/v3/search/book?target=title",
    data: { query: bookName },
    headers: { Authorization: `KakaoAK ${REST_API_KEY}` },
  })
    .done(function (book) {
      let title = book.documents[0].title;
      let thumbnail = book.documents[0].thumbnail;
      let authors = book.documents[0].authors;
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
      ).innerHTML = `${book.documents[0].authors[0]} 저`;
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
    .fail(function (e) {
      console.log(e.responseJSON);
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
  $(window).load(function () {
    var $container = $("#container");
    $container.masonry({
      itemSelector: ".grid-item",
      gutter: 20,
    });
  });

  // 스크롤 이벤트
  // ScrollReveal().reveal(".bookMark", {
  //   interval: 100,
  //   reset: true,
  //   origin: "top",
  //   // delay: 500,
  // });
}

// 모달 띄우기
// TODO : 바닐라로 변경
function showModal(div) {
  $(".modal").fadeIn("slow");
  $(".modal_bg").fadeIn("slow");
  // 모달 내 첫 번째 포커스 가능한 요소에 포커스 이동
  // $("#bookInfoModal").find("button.close").focus();
  trapFocus('#bookInfoModal');

  $(".modal_bg").click(function () {
    $(".modal").fadeOut("slow");
    $(".modal_bg").fadeOut("slow");
    $('#bookInfoModal').off('keydown');
  });

  $(".close").click(function () {
    $(".modal").fadeOut("slow");
    $(".modal_bg").fadeOut("slow");
    $('#bookInfoModal').off('keydown');
  });

  modalInput(div);
}

// 모달에 정보 전송
function modalInput(div) {
  // 현재 제목
  thisID = div.getAttribute("id");

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
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
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

// title fade-in 이벤트
function fadeIn() {
  document.querySelector(".mainTitle").style.opacity = "1";
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


// 포커스 관리
// TODO : 바닐라로 변경
function trapFocus(element) {
  var $focusableElements = $(element).find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').filter(':visible');
  var $firstFocusableElement = $focusableElements.first();
  var $lastFocusableElement = $focusableElements.last();

  // 모달 내 첫 번째 포커스 가능 요소에 포커스를 강제로 이동
  $firstFocusableElement.addClass('js-focus').focus();

  $(element).on('keydown', function(e) {
    var isTabPressed = e.key === 'Tab' || e.keyCode === 9;
    let isEscPressed = e.key === 'Escape' || e.keyCode === 27;

    if (isEscPressed) {
      $(".modal").fadeOut("slow");
      $(".modal_bg").fadeOut("slow");
      return;
    }

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) /* shift + tab */ {
      if (document.activeElement === $firstFocusableElement[0]) {
        $lastFocusableElement.removeClass('js-focus').focus(); // 마지막 요소로 포커스 이동
        e.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === $lastFocusableElement[0]) {
        $firstFocusableElement.removeClass('js-focus').focus(); // 첫 번째 요소로 포커스 이동
        e.preventDefault();
      }
    }
  });
}
