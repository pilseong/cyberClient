/**
 *  기본 신청 폼 - 수용가 정보와 신청인 정보를 관리하는 컴포넌트 
 */
import SpotInfo from "./SpotInfo";
import ApplicantInfo from "./ApplicantInfo";

export default class NoSuyongaApplicationPage {
  state: {
    parent: any;
    spotInfo: SpotInfo;
    applicantInfo: ApplicantInfo;
    privacyAgree: boolean,
  }

  constructor(parent: any) {

    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      spotInfo: new SpotInfo(this),
      applicantInfo: new ApplicantInfo(this, false),
      privacyAgree: false,
    };
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  getViewInfo() {
    return {
      ...this.state.spotInfo.getSpotView(),
      ...this.state.applicantInfo.getApplyView(),
      privacyAgree: {
        title: '개인정보동의',
        privacyAgree: [this.state.privacyAgree ? '예' : '아니오', '개인정보이용동의']
      }
    };
  }

  // 개인정보 수집 동의
  handleOnClickForPrivateInfo() {
    this.setState({
      ...this.state,
      privacyAgree: !this.state.privacyAgree
    })
  }

  verify() {
    if (!this.state.spotInfo.verify()) return false;
    if (!this.state.applicantInfo.verify()) return false;

    console.log("민원신청 verify::::::::", this.state.privacyAgree);
    if (!this.state.privacyAgree) {
      alert("개인정보취급방침을 동의해 주세요.");
      return false;
    }

    return true;
  }

  // 화면을 그려주는 부분이다.
  render() {
    const that = this;
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc"></div><!-- //mw-box -->    
      <div class="mw-box" id="spot"></div><!-- //mw-box -->
  
      <!-- 신청인정보 -->
      <div class="mw-box" id="applicant">

      </div><!-- //mw-box -->
  
      <!-- 개인정보 취급방침 동의 -->
      <div class="mw-box">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="닫기">
            <span class="i-10">개인정보취급방침</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li>
                  <label><span class="sr-only"> 개인정보취급방침</span></label>
                  <input type="checkbox" name="ch83" id="ch83" 
                    onclick="cyberMinwon.state.currentModule.state.currentPage.handleOnClickForPrivateInfo(event)"
                    ${that.state.privacyAgree ? 'checked' : ''}>
                    <label class="chk-type" for="ch83"> <span>개인정보취급방침 동의</span></label>
                    <a href="https://www.xrp.kr/_arisu/data/use-info.hwp" target="_blank" class="btn btnSS btnTypeC m-br">
                      <span>내용보기</span>
                    </a>
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw-p -->
      </div><!-- //mw-box -->
    `;

    // 실제로 화면을 붙여준다.
    document.getElementById('minwonRoot')!.innerHTML = template;

    // 후처리를 위한 로직이 수행될 부분들
    this.afterRender();
  }

  afterRender() {
    // 안내 절차를 받아온다.
    this.state.parent.state.steps[this.state.parent.state.minwonCd].step[1].renderDescription(document.getElementById('desc'));
    this.state.spotInfo.render();
    this.state.applicantInfo.render();
  }
}