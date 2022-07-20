/**
 *  기본 신청 폼 - 수용가 정보와 신청인 정보를 관리하는 컴포넌트 
 */
import { fetch } from './../util/unity_resource';

declare var alert_msg: (msg: string) => void

export default class A13ApplicationPage {
  state: any;
  constructor(parent: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      path: 'cyberMinwon.state.currentModule.state.currentPage',
      searchInfo: {
        receiptNo: '',
        applyName: '',
        dongName: ''
      }
    };
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  getViewInfo() {
    return {};
  }

  // 개인정보 수집 동의
  handleOnClickForPrivateInfo(e: any) {
    this.setState({
      ...this.state,
      privacyAgree: !this.state.privacyAgree
    })
  }

  verify() {
    return true;
  }

  // 신청인 이름 타이핑 매핑
  handleReceiptNo(e: any) {
    console.log(e.target.value.substring(0, 13));

    this.setState({
      ...this.state,
      searchInfo: {
        ...this.state.searchInfo,
        receiptNo: e.target.value.substring(0, 13)
      }
    });
    e.target.value = this.state.searchInfo.receiptNo.substring(0, 20);
    console.log(this.state);
  }

  // 신청인 이름 타이핑 매핑
  handleApplyName(e: any) {
    console.log(e.target.value.substring(0, 20));

    this.setState({
      ...this.state,
      searchInfo: {
        ...this.state.searchInfo,
        applyName: e.target.value.substring(0, 20)
      }
    });
    e.target.value = this.state.searchInfo.applyName.substring(0, 20);
    console.log(this.state);
  }

  // 신청인 이름 타이핑 매핑
  handleDongName(e: any) {
    console.log(e.target.value.substring(0, 20));

    this.setState({
      ...this.state,
      searchInfo: {
        ...this.state.searchInfo,
        dongName: e.target.value.substring(0, 20)
      }
    });
    e.target.value = this.state.searchInfo.dongName.substring(0, 20);
    console.log(this.state);
  }

  handleSearchMinwon() {
    const that = this;
    if (!this.state.searchInfo.receiptNo && !this.state.searchInfo.applyName && !this.state.dongName) {
      alert_msg("검색어를 입력해주세요");
      return;
    }

    var url = "/citizen/common/searchApplyCtSport.do";
    const queryString = {
      "keyword1": this.state.searchInfo.receiptNo,
      "keyword2": this.state.searchInfo.applyName,
      "keyword3": this.state.searchInfo.dongName
    };

    fetch('POST', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg("고객번호와 수용가명을 다시 확인하시고 검색해주세요.");
        return;
      }

      if (data.result1.length === 0) {
        // 나중에 슬라이드 alert으로 변경
        alert_msg("데이터 없음 처리. 화면 아래 결과에서 보여주어야 한다.");
        that.render();
        return;
      }
    });
  }

  // 화면을 그려주는 부분이다.
  render() {
    const that = this;
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc"></div><!-- //mw-box -->    
  
      </div><!-- //mw-box -->
  
      <div class="mw-box row">
        <!-- 신청내용 -->
        <div id="form-mw22" class="row">
          <div class="tit-mw-h3">
            <a href="javascript:void(0);" onClick="showHideLayer('#form-mw22');" class="off" title="닫기">
              <span class="i-01">신청내용</span>
            </a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li><label for="form-mw01-tx" class="input-label">
                  <span>접수번호</span></label>
                  <input type="text" id="form-mw01-tx" 
                    onkeyup="${that.state.path}.handleReceiptNo(event)"
                    onpaste="${that.state.path}.handleReceiptNo(event)"
                    class="input-box input-w-2" placeholder="접수번호">
                 </li>
                <li>
                  <label for="form-mw02-tx" class="input-label"><span>신청인성명</span>
                  </label>
                  <input type="text" id="form-mw02-tx" 
                    onkeyup="${that.state.path}.handleApplyName(event)"
                    onpaste="${that.state.path}.handleApplyName(event)"
                    class="input-box input-w-2" placeholder="신청인성명">
                </li>
                <li>
                  <label for="form-mw03-tx" class="input-label"><span>수용가행정(법정)동</span></label>
                  <input type="text" id="form-mw03-tx" 
                    onkeyup="${that.state.path}.handleDongName(event)"
                    onpaste="${that.state.path}.handleDongName(event)"
                    class="input-box input-w-2" placeholder="수용가행정(법정)동">
                </li>
              </ul>
            </div>
          </div><!-- //form-mw22 -->
        </div><!-- //mw-box -->
      </div><!-- //mw-box -->
      <!-- 버튼영역 -->
      <div class="form-btn-wrap row">
        <button type="button" 
          onclick="${that.state.path}.handleSearchMinwon()"
          class="btn btnM btnWL">확인</button>
      </div><!-- //form-btn-wrap -->
    `;

    // 실제로 화면을 붙여준다.
    document.getElementById('minwonRoot')!.innerHTML = template;

    // 후처리를 위한 로직이 수행될 부분들
    this.afterRender();
  }

  afterRender() {
    // 안내 절차를 받아온다.
    this.state.parent.state.steps[this.state.parent.state.minwonCd].step[1].renderDescription(document.getElementById('desc'));
  }
}