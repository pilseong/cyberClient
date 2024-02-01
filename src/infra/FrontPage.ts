import { fetch } from '../util/unity_resource';
import { citizenAlert, citizen_alert, citizenConfirm, maskingFnc } from './../util/uiux-common';

declare var gContextUrl: string;
declare var document: any;
declare var $: any;


// 민원 진입시 첫화면 관리
export default class FrontPage {
  path: string;
  state: {
    parent: any;
    root: any;
    searchYN: boolean;
    allYN: boolean;
    keyword: string;
    minwonInfo: any;
    filteredMinwons: any[];
  }

  constructor(parent: any, root: any) {
    this.state = {
      parent,
      root,
      searchYN: false,
      allYN: false,
      keyword: '',
      minwonInfo: [],
      filteredMinwons: []
    }
    this.path = "cyberMinwon.state.currentModule";
    this.getInitMinwonInfo();
  }

  getInitMinwonInfo() {
    const that = this;
    var url = gContextUrl + "/citizen/common/listCitizenCvplDfn.do";

    fetch('GET', url, '', function (error: any, data: any) {
      if (error) {
        citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 시작해 주세요.");
        return;
      }

      that.setState({
        ...that.state,
        searchYN: false,
        minwonInfo: data
      });

    });
    this.render();
  }
  
  handleAllList(){
    const that = this;
    that.setState({
      ...that.state,
      allYN: true,
      searchYN: true,
      keyword: '',
    });
  }
  
  handleKeywordReset(){
    const that = this;
    that.setState({
      ...that.state,
      searchYN: false,
      keyword: '',
    });
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
      allYN: false,
      filteredMinwons
    });
    e.target.value = this.state.keyword.substring(0, 50);

    document.getElementById('result-list').innerHTML = `
      <h2><span class="i-99">민원신청 서비스</span></h2>
      ${that.getMinwonList()}
    `;

    if (!this.state.searchYN) {
      $('#result-list').hide();
      $('#result-default').show();
      $('.result-default').show();
    } else {
      $('#result-default').hide();
      $('.result-default').hide();
      $('#result-list').show();
    }
  }

  handleOnSubmit(e: any) {
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
  
  handleTagClick(tagNm: string){
    const that = this;
    let filteredMinwons = [];
    filteredMinwons = this.state.minwonInfo.filter((minwon: any) => {
      return minwon.minwonKeyword.includes(tagNm.trim()) ||
        minwon.minwonDesProc.includes(tagNm.trim()) ||
        minwon.minwonDesProcTitle.includes(tagNm.trim()) ||
        minwon.minwonDfn.includes(tagNm.trim()) ||
        minwon.minwonGde.includes(tagNm.trim()) ||
        minwon.minwonHow.includes(tagNm.trim()) ||
        minwon.minwonNm.includes(tagNm.trim()) ||
        minwon.presentnPapers.includes(tagNm.trim())
        ;
    });
    
    this.setState({
      ...this.state,
      searchYN: true,
      keyword: tagNm,
      filteredMinwons
    });
    $("#searchBox").val(this.state.keyword.substring(0, 50));

    document.getElementById('result-list').innerHTML = `
      <h2><span class="i-99">민원신청 서비스</span></h2>
      ${that.getMinwonList()}
    `;

    if (!this.state.searchYN) {
      $('#result-list').hide();
      $('#result-default').show();
      $('.result-default').show();
    } else {
      $('#result-default').hide();
      $('.result-default').hide();
      $('#result-list').show();
    }
  }

  render() {
    const that = this;

    let template = `
       <!-- 민원검색 -->
       <div class="sch-mw-wrap row">
         <form onsubmit="cyberMinwon.state.currentModule.handleOnSubmit(event)">
           <div class="sch-mw row">
             <ul>
               <li class="col-tx">
                 <label for="sch-mw-tx" class="sr-only">검색어 입력</label>
                 <input
                   id="searchBox"
                   onkeyup="${that.path}.handleSeachInput(event)" 
                   onpaste="${that.path}.handleSeachInput(event)"
                   value="${that.state.keyword}"
                   type="text"
                   title="검색어 입력"
                   placeholder="검색어를 입력해 주세요."
                 />
               </li>
               <li class="col-btn">
                 <label for="sch-mw-btn" class="sr-only">검색버튼</label>
                 <button
                   id="sch-mw-btn"
                   type="button"
                   title="검색버튼"
                   onclick="${that.path}.handleOnSubmit(event)"
                 >
                   <span class="sr-only">검색버튼</span>
                 </button>
               </li>
             </ul>
           </div>
           <div class="sch-mw-tag row">
             <a href="javascript:void(0);" onclick="${that.path}.handleTagClick('명의변경');">
               <span>#명의변경</span>
             </a>
             <a href="javascript:void(0);" onclick="${that.path}.handleTagClick('자동납부');">
               <span>#자동납부</span>
             </a>
             <a href="javascript:void(0);" onclick="${that.path}.handleTagClick('요금');">
               <span>#요금</span>
             </a>
             <a href="javascript:void(0);" onclick="${that.path}.handleTagClick('계량기');">
               <span>#계량기</span>
             </a>
             <a href="javascript:void(0);" onclick="${that.path}.handleTagClick('수질');">
               <span>#수질</span>
             </a>
             <a href="javascript:void(0);" onclick="${that.path}.handleTagClick('누수');">
               <span>#누수</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goFront();">
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
               <span>소유자(사용자)명의 변경 신고</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B14');">
               <span>자동납부(계좌) 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B19');">
               <span>전자고지 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B25');">
               <span>수도요금 문자 알림 서비스 신청</span>
             </a>
           </div>
         </div>
  
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">수도계량기 관리 신청</span>
             </h4>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A02');">
               <span>수도계량기 교체 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B09');">
               <span>수도계량기 검정시험 신청</span>
             </a>
             `;
      template += `
           </div>
         </div>
       </div>
       <div class="g-mw-wrap row result-default">
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">수도 요금 감면(조정) 신청</span>
             </h4>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B01');">
               <span>상하수도 누수요금 감면 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B24');">
               <span>자가검침 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B13');">
               <span>사용요금 분리 신고</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B10');">
               <span>과오납금반환 청구</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B20');">
               <span>상하수도요금 이의신청</span>
             </a>
           </div>
         </div>
  
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">급수공사 신청</span>
             </h4>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A01');">
               <span>급수공사 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('I10');">
               <span>수도계량기 및 상수도관 이설 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A11');">
               <span>직결급수 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A08');">
               <span>포장도로 복구 신고</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A09');">
               <span>돌발 누수사고 피해배상 신청</span>
             </a>
           </div>
         </div>
       </div>
       <div class="g-mw-wrap row result-default">
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">수도 사용 변경 신청</span>
             </h4>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B04');">
               <span>소유자(사용자)명의 변경 신고</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B18');">
               <span>수도요금 청구지 주소변경 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B02');">
               <span>급수업종 변경 신고</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B05');">
               <span>급수설비 폐지 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('I06');">
               <span>급수중지 (해제) 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B08');">
               <span>정수처분 해제 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('I12');">
               <span>세대분할 신고</span>
             </a>
           </div>
         </div>
  
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">수도 사용 불편 신청</span>
             </h4>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A04');">
               <span>급수불편 해소 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A07');">
               <span>수질검사 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A05');">
               <span>옥내 누수진단 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A06');">
               <span>옥외 누수 신고</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A12');">
               <span>옥내급수관 진단 상담 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A13');">
               <span>옥내급수관 공사비 지원 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('A14');">
               <span>옥내급수관 공사비 지급 요청</span>
             </a>
           </div>
         </div>
       </div>
       <div class="g-mw-wrap row result-default">
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">안내 서비스 신청</span>
             </h4>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B19');">
               <span>전자고지 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B25');">
               <span>수도요금 문자 알림 서비스 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B23');">
               <span>시각장애인 요금 안내 서비스 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B15');">
               <span>검침일 안내 서비스 신청</span>
             </a>
           </div>
         </div>
  
         <div class="col col-2">
           <div class="g-mw-box row">
             <h4>
               <span class="i-99">편의 서비스 신청</span>
             </h4>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B14');">
               <span>자동납부(계좌) 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B03');">
               <span>수도요금 납부증명 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B27');">
               <span>고지서 재발급 신청</span>
             </a>
             <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('C01');">
               <span>기타민원(질의, 건의, 고충)</span>
             </a>
           </div>
         </div>
       </div>
       <div class="list-mw row" id="result-list">
        <h2><span class="i-99">민원신청 서비스</span></h2>
        `;
    if(this.state.allYN){
      template += `${that.getMinwonListAll()}` 
    }else{
      template += `${that.getMinwonList()}`
    }
      template += `
      </div>
     `;
    this.state.root.innerHTML = template;

    if (!this.state.searchYN) {
      $('#result-list').hide();
      $('#result-default').show();
      $('.result-default').show();
    } else {
      $('#result-default').hide();
      $('.result-default').hide();
      $('#result-list').show();
    }
//    $('#searchBox').focus();
  }

  getMinwonList() {
    return this.state.filteredMinwons.sort(function (a:any, b:any){
      if(a.minwonNm > b.minwonNm) return 1;
      else if(a.minwonNm < b.minwonNm) return -1;
      else return 0;
    }).map((minwon, index) => {
      if(minwon.minwonCd === "B99"){
        return ``;
      }else{
        let mwListStr = `
        <!-- 민원목록 -->
          <div id="list-mw${index + 1}" class="row">
            <div class="tit-mw-h3">
              <a href="javascript:void(0);" 
                onClick="showHideLayer('#list-mw${index + 1}');" class="on" title="닫기"`
                
                if(minwon.minwonCd == "B19"){
                  mwListStr += 'style="font-size:11px;"';
                } else if(minwon.minwonCd == "B13"){
                  mwListStr += 'style="font-size:15px;"';
                } else {
                  mwListStr += 'style="font-size:16px;"';
                }
                
             mwListStr   += `>${minwon.minwonNm}
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
        return mwListStr;
      }
    }).join('');
  }
  
  getMinwonListAll() {
    return this.state.minwonInfo.sort(function (a:any, b:any){
      if(a.minwonNm > b.minwonNm) return 1;
      else if(a.minwonNm < b.minwonNm) return -1;
      else return 0;
    }).map((minwon:any, index:any) => {
      if(minwon.minwonCd === "B99"){
        return ``;
      }else{
        let mwListStr =`
          <!-- 민원목록 -->
          <div id="list-mw${index + 1}" class="row">
            <div class="tit-mw-h3">
              <a href="javascript:void(0);" 
                onClick="showHideLayer('#list-mw${index + 1}');" class="on" title="닫기"`
                
                if(minwon.minwonCd == "B19"){
                  mwListStr += 'style="font-size:11px;"';
                } else if(minwon.minwonCd == "B13"){
                  mwListStr += 'style="font-size:15px;"';
                } else {
                  mwListStr += 'style="font-size:16px;"';
                }
                
             mwListStr   += `>${minwon.minwonNm}
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
        return mwListStr;
      }
    }).join('');
  }
}