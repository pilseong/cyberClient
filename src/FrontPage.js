// 민원 진입시 첫화면 관리
class FrontPage {

  constructor(parent, root) {
    this.state = {
      parent,
      root
    }
  }
  
  render() {
    let template = `
       <!-- 민원검색 -->
       <div class="sch-mw-wrap row">
         <form>
           <div class="sch-mw row">
             <ul>
               <li class="col-tx">
                 <label for="sch-mw-tx" class="sr-only">검색어 입력</label>
                 <input
                   id="sch-mw-tx"
                   type="text"
                   title="검색어 입력"
                   placeholder="무엇을 도와드릴까요?"
                 />
               </li>
               <li class="col-btn">
                 <label for="sch-mw-btn" class="sr-only">검색버튼</label>
                 <button
                   id="sch-mw-btn"
                   type="button"
                   title="검색버튼"
                   onclick="clickCategory('S')"
                 >
                   <span class="sr-only">검색버튼</span>
                 </button>
               </li>
             </ul>
           </div>
           <div class="sch-mw-tag row">
             <a href="#">
               <span>#명의변경</span>
             </a>
             <a href="#">
               <span>#자동납부</span>
             </a>
             <a href="#">
               <span>#요금</span>
             </a>
             <a href="#">
               <span>#계량기</span>
             </a>
             <a href="#">
               <span>#수질</span>
             </a>
             <a href="#">
               <span>#누수</span>
             </a>
             <a href="index.html">
               <span>#홈</span>
             </a>
           </div>
         </form>
       </div>
  
       <!-- 민원서비스 바로가기 -->
       <div class="g-mw-wrap row" id="result-default">
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">이사를 하셨나요?</span>
             </h4>
             <a href="01.html">
               <span>소유자(사용자)명의변경 신고</span>
             </a>
             <a href="02.html">
               <span>자동납부(계좌) 신규/해지</span>
             </a>
             <a href="03.html">
               <span>수도요금 바로알림 신규/변경/해지</span>
             </a>
             <a href="04.html">
               <span>전자고지 신규/변경/해지</span>
             </a>
           </div>
         </div>
  
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">수도계량기 서비스신청</span>
             </h4>
             <a href="05.html">
               <span>수도계량기 교체 신청</span>
             </a>
             <a href="index.html">
               <span>수도계량기 이설 신청</span>
             </a>
             <a href="index.html">
               <span>자가검침 신규/변경/해지</span>
             </a>
             <a href="index.html">
               <span>검침일 안내서비스 신청</span>
             </a>
           </div>
         </div>
       </div>
       <div class="list-mw row" id="result-list">
  
       </div>
     `;
    this.state.root.innerHTML = template;
  }
}