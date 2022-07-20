import InfoPanel from "./InfoPanel";
import { addMW } from './uiux-common';

declare var $: any;

export default class SummaryPage {
  state: {
    parent: any;
  }
  infoPanels: InfoPanel[];
  constructor(parent: any) {
    this.state = {
      parent,
    }

    this.infoPanels = [];
  }

  render() {
    let template = `
      <!-- 신청내용 -->
      <div class="mw-box">
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw21');" title="닫기">
            <span class="i-01">민원신쳥내역</span>
          </a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
              <ul id="summary">
              </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw21 -->
      </div><!-- //mw-box -->
  
      <!-- 이사 통합민원 추가 신청 -->
      <div class="mw-box" id="extra">
      <div id="form-mw24" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw24');" title="닫기">
        <span class="i-02">이사 통합민원 추가 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>추가신청 할 민원을 선택하세요.</span></label>
  
                <ul class="mw-opt mw-opt-2 row">
                  <li id="dGubun1" class="dGubun off">
                    <a onclick="cyberMinwon.state.currentModule.setPage(1, 'B04')">
                      <span>소유자(사용자)명의변경 신고</span>
                    </a>
                  </li>
                  <li id="dGubun2" class="dGubun off">
                    <a onclick="cyberMinwon.state.currentModule.setPage(1, 'B14')">
                      <span>자동납부(계좌) 신규/해지 추가</span>
                    </a>
                  </li>
                  <li id="dGubun3" class="dGubun off">
                    <a onclick="cyberMinwon.state.currentModule.setPage(1, 'B19')">
                      <span>전자고지 신규/변경/해지 추가</span>
                    </a>
                  </li>
                  <li id="dGubun4" class="dGubun off">
                    <a onclick="cyberMinwon.state.currentModule.setPage(1, 'B25')">
                      <span>수도요금 바로알림 신규/해지 추가</span>
                    </a>
                  </li>
                </ul>
                <p class="form-cmt form-cmt-1 txStrongColor">* 추가신청 할 민원을 선택하고 민원신청을 할 경우, 해당 민원을 추가로 등록 할 수 있습니다.</p>
              </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->       
    `;

    // 실제로 화면을 붙여준다.
    document.getElementById('minwonRoot')!.innerHTML = template;

    const renderedInfoPanels = this.infoPanels.map(function (node) {
      return node.render();
    }).join('');

    const $target = document.getElementById('summary');
    $target!.innerHTML += renderedInfoPanels;
    // 버튼 초기상태 값 설정    
    if (['B04', 'B14', 'B19', 'B25'].includes(this.state.parent.state.minwonCd)) {
      if (this.state.parent.state.registeredMinwons.indexOf('B04') !== -1) addMW('#dGubun1');
      if (this.state.parent.state.registeredMinwons.indexOf('B14') !== -1) addMW('#dGubun2');
      if (this.state.parent.state.registeredMinwons.indexOf('B19') !== -1) addMW('#dGubun3');
      if (this.state.parent.state.registeredMinwons.indexOf('B25') !== -1) addMW('#dGubun4');
    } else {
      $('#extra').hide();
    }
  }
}