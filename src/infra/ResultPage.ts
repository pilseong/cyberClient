import InfoPanel from "../components/InfoPanel";
import { saupsoInfo } from '../util/uiux-common';

declare var $: any;

export default class ResultPage {
  state: {
    parent: any;
    target: any;
  }
  infoPanels: InfoPanel[];
  saupsoInfo: any;
  path: string;
  constructor(parent: any, target: any) {
    
    this.state = {
      parent,
      target
    }
    this.saupsoInfo = saupsoInfo;
    this.infoPanels = [];
    this.path = 'cyberMinwon.state.currentModule';
  }
  
  reset(){
    this.infoPanels = [];
  }

  render() {
    const that = this;
    const minwonCd = that.state.parent.state.unityMinwon.state.minwonCd;
    
    let template = `
      <!-- 신청내용 -->
      <div class="mw-box">
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw21');" title="닫기">
            <span class="i-01">민원 신청 결과</span>
          </a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
              <ul id="summary" class="result-box">
              </ul>
          </div>
        </div><!-- //form-mw-box -->
    `;
    if(minwonCd === "B04" || minwonCd === "B14" || minwonCd === "B19" || minwonCd === "B25"){
      template += `
        <div class="form-mv row">
          <ul>
            <li>
              <label class="input-label-1"><span style="color:#1c5cbe;">이사 통합민원 추가 신청</span></label>
              <ul class="mw-opt mw-opt-2 mw-opt-type02 row" id="unityMinwonLink"><!-- css 먹이기 위한 id -->
                <li id="uGubun1" class="uGubun">
                  <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B04')">
                    <span>소유자(사용자)명의변경 신고</span>
                  </a>
                </li>
                <li id="uGubun2" class="uGubun">
                  <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B14')">
                    <span>자동납부(계좌) 신청(신규,해지)</span>
                  </a>
                </li>
                <li id="uGubun3" class="uGubun">
                  <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B19')">
                    <span>전자고지 신청(신규,변경,해지)</span>
                  </a>
                </li>
                <li id="uGubun4" class="uGubun">
                  <a href="javascript:void(0);" onclick="cyberMinwon.goMinwon('B25')">
                    <span>수도요금 문자 알림 서비스 신청</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      `;
    }
    template += `
      </div><!-- //form-mw21 -->
      </div><!-- //mw-box -->    
      
      <div class="form-btn-wrap row">
        <button type="button" class="btn btnM btnWL" id="prev" onclick="cyberMinwon.goFront()">확인</button>
      </div>
      <!-- 문의안내 -->
      <div id="saupsoInfo" class="searchtable row" style="margin:50px 0;">
        <p class="txStrongColor txCenter" style="margin:10px 0;">※ 문의 안내 ※</p>
        <div class="header">
          <div class="searchresult-h-1">수도사업소</div>
          <div class="searchresult-h-3">담당지역</div>
          <div class="searchresult-h-1">연락처</div>
        </div>
        <div class="body" id="saupsoInfoData">
        </div>
        <p class="txCenter">시스템이 응답하지 않는 경우 - 서울아리수본부 [ 120 ]</p>
      </div>
    `;

    // 실제로 화면을 붙여준다.
    this.state.target!.innerHTML = template;
    
    const renderedInfoPanels = this.infoPanels.map(function (node) {
      return node.render();
    }).join('');
    
    const $target = document.getElementById('summary');
    $target!.innerHTML += renderedInfoPanels;
    const $saupsoInfo = document.getElementById('saupsoInfoData');
    $saupsoInfo!.innerHTML += saupsoInfo.map((item, idx)=>{
      return `
        <div class="searchlist">
          <div class="searchresult-b-1" style="margin:auto;">${item.shortName}</div>
          <div class="searchresult-b-3 txStrongColor" style="margin:auto;">${item.region}</div>
          <div class="searchresult-b-1" style="margin:auto;">${item.telNo}</div>
        </div>
      `;
    }).join('');
  }
}