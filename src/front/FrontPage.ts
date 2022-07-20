import { fetch } from './../util/unity_resource';

declare var gContextUrl: string;
declare var alert_msg: (...args: any[]) => void;
declare var document: any;
declare var $: any;


// 민원 진입시 첫화면 관리
export default class FrontPage {
  state: {
    parent: any;
    root: any;
    searchYN: boolean;
    keyword: string;
    minwonInfo: any;
    filteredMinwons: any[];
  }

  constructor(parent: any, root: any) {
    this.state = {
      parent,
      root,
      searchYN: false,
      keyword: '',
      minwonInfo: [],
      filteredMinwons: []
    }

    this.getInitMinwonInfo();
  }

  getInitMinwonInfo() {
    const that = this;
    var url = gContextUrl + "/citizen/common/listCitizenCvplDfn.do";

    fetch('GET', url, '', function (error: any, data: any) {
      if (error) {
        alert_msg("서버가 응답하지 않습니다. 잠시 후 다시 시작해주세요.");
        return;
      }

      that.setState({
        ...that.state,
        searchYN: false,
        minwonInfo: data
      });

      console.log(that.state);
    });
    this.render();
  }

  handleSeachInput(e: any) {
    const that = this;
    let filteredMinwons = [];
    if (e.target.value !== '') {
      filteredMinwons = this.state.minwonInfo.filter((minwon: any) => {
        return minwon.minwonKeyword.includes(e.target.value.trim()) ||
          minwon.minwonDesProc.includes(e.target.value.trim()) ||
          minwon.minwonDesProcTitle.includes(e.target.value.trim()) ||
          minwon.minwonDfn.includes(e.target.value.trim()) ||
          minwon.minwonGde.includes(e.target.value.trim()) ||
          minwon.minwonHow.includes(e.target.value.trim()) ||
          minwon.minwonNm.includes(e.target.value.trim()) ||
          minwon.presentnPapers.includes(e.target.value.trim())
          ;
      });
    }

    this.setState({
      ...this.state,
      searchYN: e.target.value === '' ? false : true,
      keyword: e.target.value,
      filteredMinwons
    });
    e.target.value = this.state.keyword.substring(0, 50);

    console.log(filteredMinwons);
    document.getElementById('result-list').innerHTML = `
      <h2><span class="i-99">민원신청 서비스</span></h2>
      ${that.getMinwonList()}
    `;

    if (!this.state.searchYN) {
      $('#result-list').hide();
      $('#result-default').show();
    } else {
      $('#result-default').hide();
      $('#result-list').show();
    }
  }

  handleOnSumbit(e: any) {
    const that = this;

    e.preventDefault();

    var url = gContextUrl + "/citizen/common/listCitizenCvplDfn.do";
    var queryString = 'minwon';

    this.render();
  }

  setState(newState: any) {
    if (this.state !== newState) {
      this.state = newState;
    }
  }

  render() {
    const that = this;

    let template = `
       <!-- 민원검색 -->
       <div class="sch-mw-wrap row">
         <form onsubmit="cyberMinwon.state.currentModule.handleOnSumbit(event)">
           <div class="sch-mw row">
             <ul>
               <li class="col-tx">
                 <label for="sch-mw-tx" class="sr-only">검색어 입력</label>
                 <input
                   id="searchBox"
                   onkeyup="cyberMinwon.state.currentModule.handleSeachInput(event)" 
                   onpaste="cyberMinwon.state.currentModule.handleSeachInput(event)"
                   value="${that.state.keyword}"
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
                   onclick="cyberMinwon.state.currentModule.handleOnSumbit(event)"
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
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B04');">
               <span>소유자(사용자)명의변경 신고</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B14');">
               <span>자동납부(계좌) 신규/해지</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B25');">
               <span>수도요금 바로알림 신규/변경/해지</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B19');">
               <span>전자고지 신규/변경/해지</span>
             </a>
           </div>
         </div>
  
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">수도계량기 서비스신청</span>
             </h4>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A02');">
               <span>수도계량기 교체 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A03');">
               <span>수도계량기 이설 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B24');">
               <span>자가검침 신규/변경/해지</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B15');">
               <span>검침일 안내서비스 신청</span>
             </a>
           </div>
         </div>
       </div>
       <div class="list-mw row" id="result-list">
        <h2><span class="i-99">민원신청 서비스</span></h2>
        ${that.getMinwonList()}
      </div>
     `;
    this.state.root.innerHTML = template;

    if (!this.state.searchYN) {
      $('#result-list').hide();
      $('#result-default').show();
    } else {
      $('#result-default').hide();
      $('#result-list').show();
    }
  }

  getMinwonList() {
    console.log('called');
    return this.state.filteredMinwons.map((minwon, index) => {
      return `
        <!-- 민원목록 -->
        <div id="list-mw${index + 1}" class="row">
          <div class="tit-mw-h3">
            <a href="javascript:void(0);" 
              onClick="showHideLayer('#list-mw${index + 1}');" class="on" title="닫기">${minwon.minwonNm}
            </a>
          </div>
          <div class="form-mw-box display-none row">
            <div class="info-mw row">
              ${minwon.minwonDfn.replaceAll('\/', '')}
              <!-- 버튼영역 -->
              <div class="info-btn-wrap row">
                <button type="button" class="btn btnS" onclick="cyberMinwon.goMinwon('${minwon.minwonCd}')">민원신청</button>
                <button type="button" class="btn btnS btnDGray" onClick="showHideLayer('#list-mw${index + 1}');">닫기</button>
              </div><!-- //info-btn-wrap -->
            </div><!-- //info-mw -->
          </div>
        </div><!-- //list-mw1 -->
      `;
    }).join('');
  }
}