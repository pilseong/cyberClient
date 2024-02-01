import { saupsoInfo } from '../util/uiux-common';

export default class A14ApplicationPage {
  state: any;
  constructor(private parent: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      path: 'cyberMinwon.state.currentModule.state.currentPage',
      description: {}
    };
  }

  setState(nextState: any) {
    this.state = nextState;
  }
  
  getDescription(data: any) {
    const that = this;
    that.setState({
      ...that.state,
      description: data 
    });
  }

  getViewInfo() {
    return {};
  }

  verify() {
    return true;
  }

  // 화면을 그려주는 부분이다.
  render() {
    const that = this;
    let template = `
            <p>
            『옥내급수관 상담』 민원과 『옥내급수관 공사비 지원신청』 민원 처리완료 후 <span class="txRed">수도사업소</span>에서 신청하는 민원입니다.<br>
            관할지역 수도사업소에 문의하여 주시기 바랍니다.<br>
            (아래의  "<span class="txBlue">담당기관(수도사업소)</span>"를 참고해 주세요.)
            </p>
    `;
    let template1 = `
      <div class="form-btn-wrap row" id="btnSet">
        <button type="button" class="btn btnM btnWL" id="home" onclick="cyberMinwon.goFront()" alt="첫화면으로 이동">첫화면으로 가기</button>
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
    document.getElementById('minwonDesc')!.innerHTML = template;
    document.getElementById('minwonRoot')!.innerHTML = template1;
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
//    document.getElementsByClassName("form-btn-wrap").display = 'none'

    // 후처리를 위한 로직이 수행될 부분들
//    this.afterRender();
  }

  afterRender() {
    // 안내 절차를 받아온다.
//    this.state.parent.state.steps[this.state.parent.state.minwonCd].step[1].renderDescription(document.getElementById('desc'));
  }
}