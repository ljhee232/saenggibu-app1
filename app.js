// ========================================
// 생기부 활동 저장 v1.0
// 관저고등학교 전용
// ========================================

// ---------- 과목 색상 ----------
const SUBJECT_COLORS = {
  "국어":"#D32F2F",
  "영어":"#1976D2",
  "수학":"#2E7D32",
  "과학":"#00897B",
  "사회":"#F57C00",
  "한국사":"#6A1B9A",
  "기타":"#455A64"
};

// ---------- 로그인 ----------
function login(){

  const studentId=document.getElementById("studentId").value.trim();
  const name=document.getElementById("name").value.trim();
  const password=document.getElementById("password").value.trim();

  if(!studentId||!name||!password){
    alert("학번, 이름, 비밀번호를 입력해주세요.");
    return;
  }

  localStorage.setItem("loginInfo",JSON.stringify({
    studentId,name,password
  }));

  location.href="dashboard.html";
}

// ---------- 자동 로그인 ----------
function autoLogin(){

  const info=JSON.parse(localStorage.getItem("loginInfo"));

  if(!info)return;

  if(document.getElementById("studentId"))
    document.getElementById("studentId").value=info.studentId;

  if(document.getElementById("name"))
    document.getElementById("name").value=info.name;

  if(document.getElementById("password"))
    document.getElementById("password").value=info.password;
}

// ---------- 로그아웃 ----------
function logout(){

  if(confirm("로그아웃 하시겠습니까?")){
    localStorage.removeItem("loginInfo");
    location.href="index.html";
  }

}

// ---------- 활동 저장 ----------
function saveActivity(){

  const activity={

    subject:document.getElementById("subject").value,
    title:document.getElementById("title").value.trim(),
    date:document.getElementById("date").value,
    role:document.getElementById("role").value.trim(),
    content:document.getElementById("content").value.trim(),
    learned:document.getElementById("learned").value.trim()

  };

  if(activity.title===""){
    alert("활동 제목을 입력해주세요.");
    return;
  }

  let activities=JSON.parse(localStorage.getItem("activities"))||[];

  const editIndex=localStorage.getItem("editIndex");

  if(editIndex!==null){

    activities[editIndex]=activity;

    localStorage.removeItem("editIndex");
    localStorage.removeItem("editData");

  }else{

    activities.push(activity);

  }

  localStorage.setItem("activities",JSON.stringify(activities));

  alert("저장되었습니다.");

  location.href="dashboard.html";

}

// ---------- 수정 ----------
function editActivity(index){

  const activities=JSON.parse(localStorage.getItem("activities"))||[];

  localStorage.setItem("editIndex",index);
  localStorage.setItem("editData",JSON.stringify(activities[index]));

  location.href="add.html";

}

// ---------- add.html 자동 채우기 ----------
function fillEditData(){

  const editData=localStorage.getItem("editData");

  if(!editData)return;

  const data=JSON.parse(editData);

  document.getElementById("subject").value=data.subject;
  document.getElementById("title").value=data.title;
  document.getElementById("date").value=data.date;
  document.getElementById("role").value=data.role;
  document.getElementById("content").value=data.content;
  document.getElementById("learned").value=data.learned;

}

// ---------- 삭제 ----------
function deleteActivity(index){

  let activities=JSON.parse(localStorage.getItem("activities"))||[];

  if(confirm("이 활동을 삭제하시겠습니까?")){

    activities.splice(index,1);

    localStorage.setItem("activities",JSON.stringify(activities));

    loadActivities();
    loadRecords();

  }

}

// ---------- 대시보드 숫자 ----------
function updateDashboardCount(activities){

  const total=document.getElementById("totalCount");
  const month=document.getElementById("monthCount");

  if(total) total.textContent=activities.length;

  if(month){

    const today=new Date();

    const count=activities.filter(a=>{

      if(!a.date)return false;

      const d=new Date(a.date);

      return d.getFullYear()==today.getFullYear()
      && d.getMonth()==today.getMonth();

    }).length;

    month.textContent=count;

  }

}

// ---------- 최근 활동 ----------
function loadActivities(){

  const list=document.getElementById("activityList");

  if(!list)return;

  const activities=JSON.parse(localStorage.getItem("activities"))||[];

  updateDashboardCount(activities);

  list.innerHTML="";

  if(activities.length===0){

    list.innerHTML="<p style='text-align:center;color:#777;'>아직 기록된 활동이 없습니다.</p>";
    return;

  }

  activities.slice().reverse().forEach(a=>{

    list.innerHTML+=`

      <div style="
      background:#fff;
      border-left:6px solid ${SUBJECT_COLORS[a.subject]};
      border-radius:18px;
      padding:16px;
      margin-bottom:14px;
      box-shadow:0 4px 12px rgba(0,0,0,.08);
      animation:fadeIn .25s ease;">

      <strong style="color:${SUBJECT_COLORS[a.subject]}">
      ${a.subject}
      </strong>

      <h3 style="margin:8px 0;color:#12327d;">
      ${a.title}
      </h3>

      <small style="color:#666;">
      ${a.date}
      </small>

      <p style="margin-top:10px;">
      역할 : ${a.role}
      </p>

      </div>

    `;

  });

}

// ---------- 기록 화면 ----------
function loadRecords(filter="전체"){

  const recordList=document.getElementById("recordList");

  if(!recordList)return;

  const keyword=(document.getElementById("searchInput")?.value||"").toLowerCase();

  let activities=JSON.parse(localStorage.getItem("activities"))||[];

  activities=activities.filter(a=>{

    const searchMatch=
      a.subject.toLowerCase().includes(keyword)||
      a.title.toLowerCase().includes(keyword);

    const filterMatch=(filter==="전체")||(a.subject===filter);

    return searchMatch&&filterMatch;

  });

  recordList.innerHTML="";

  if(activities.length===0){

    recordList.innerHTML="<p style='text-align:center;color:#777;'>검색 결과가 없습니다.</p>";
    return;

  }

  activities.slice().reverse().forEach((a,index)=>{

    const realIndex=activities.length-1-index;

    recordList.innerHTML+=`

    <div class="record"
    style="
    border-left:6px solid ${SUBJECT_COLORS[a.subject]};
    animation:fadeIn .25s ease;">

      <strong style="color:${SUBJECT_COLORS[a.subject]}">
      ${a.subject}
      </strong>

      <h3>${a.title}</h3>

      <small>${a.date}</small>

      <p><strong>역할</strong><br>${a.role}</p>

      <p><strong>활동 내용</strong><br>${a.content}</p>

      <p><strong>배운 점</strong><br>${a.learned}</p>

      <div class="btns">

        <button class="edit"
        onclick="editActivity(${realIndex})">
        ✏ 수정
        </button>

        <button class="delete"
        onclick="deleteActivity(${realIndex})">
        🗑 삭제
        </button>

      </div>

    </div>

    `;

  });

}

// ---------- 과목 필터 ----------
function setFilter(subject){

  const buttons=document.querySelectorAll(".filter-btn");

  buttons.forEach(b=>b.classList.remove("active"));

  const target=document.querySelector(`[data-subject="${subject}"]`);

  if(target)target.classList.add("active");

  loadRecords(subject);

}

// ---------- 테스트용 ----------
function resetAllData(){

  if(confirm("모든 활동을 삭제하시겠습니까?")){

    localStorage.removeItem("activities");
    localStorage.removeItem("editData");
    localStorage.removeItem("editIndex");

    location.reload();

  }

}

// ---------- 페이지 시작 ----------
window.onload=function(){

  autoLogin();

  fillEditData();

  loadActivities();

  loadRecords();

  const search=document.getElementById("searchInput");

  if(search){

    search.addEventListener("input",()=>{

      const active=document.querySelector(".filter-btn.active");

      if(active){

        loadRecords(active.dataset.subject);

      }else{

        loadRecords();

      }

    });

  }

};
