/**
 *  기본 신청 폼 - 수용가 정보와 신청인 정보를 관리하는 컴포넌트 
 */
import SuyongaInfo from './SuyongaInfo';
import ApplicantInfo from './ApplicantInfo';
import AthenticationInfo from './AuthenticationInfo';


export default class BasicApplicationPage {
  state: {
    parent: any
    suyongaInfo: SuyongaInfo,
    authenticationInfo: AthenticationInfo,
    applicantInfo: any,
    privacyAgree: boolean,
  };

  constructor(parent: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      parent,
      suyongaInfo: new SuyongaInfo(this),
      authenticationInfo: new AthenticationInfo(this),
      applicantInfo: new ApplicantInfo(this, true),
      privacyAgree: false,
    };
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  getViewInfo() {
    return {
      ...this.state.suyongaInfo.getSuyongaView(),
      ...this.state.applicantInfo.getApplyView(),
      privacyAgree: {
        title: '개인정보동의',
        privacyAgree: [this.state.privacyAgree ? '예' : '아니오', '개인정보이용동의']
      }
    };
  }

  // 개인정보 수집 동의
  handleOnClickForPrivateInfo(e: any) {
    this.setState({
      ...this.state,
      privacyAgree: !this.state.privacyAgree
    })
  }

  // 신청인에 소유자 이름을 복사한다.
  handleCopyOwnerName(e: any) {
    const applicantState = this.state.applicantInfo.state;
    const viewSourceInfo = this.state.suyongaInfo.state.viewSuyongaInfo;
    const viewDestInfo = this.state.applicantInfo.state.viewApplyInfo;

    this.state.applicantInfo.setState({
      ...applicantState,
      applyInfo: {
        ...applicantState.applyInfo,
        applyName: viewSourceInfo.viewOwnerName[0]
      },
    });

    console.log(this);
    this.state.applicantInfo.render();
  }

  // 신청인에 사용자 이름을 복사한다.
  handleCopyUserName(e: any) {
    const applicantState = this.state.applicantInfo.state;
    const viewSourceInfo = this.state.suyongaInfo.state.viewSuyongaInfo;
    const viewDestInfo = this.state.applicantInfo.state.viewApplyInfo;

    this.state.applicantInfo.setState({
      ...applicantState,
      applyInfo: {
        ...applicantState.applyInfo,
        applyName: viewSourceInfo.viewUserName[0]
      },
    });

    console.log(this);
    this.state.applicantInfo.render();
  }

  // 수용가의 주소를 복사해서 신청인 주소에 입력한다.
  // 신청인 주소와 함께 우편번호도 복사해야 한다.
  // 주의점은 View 주소에는 우편번호와 주소 모두 포함되어야 한다.
  handleCopySuyongaAddress(e: any) {
    const applicantState = this.state.applicantInfo.state;
    const viewSourceInfo = this.state.suyongaInfo.state.viewSuyongaInfo;
    const suyongaInfo = this.state.suyongaInfo.state.suyongaInfo;
    const viewDestInfo = this.state.applicantInfo.state.viewApplyInfo;

    this.state.applicantInfo.setState({
      ...applicantState,
      applyInfo: {
        ...applicantState.applyInfo,
        // 신청인 주소에 도로 주소를 복사한다.
        applyAddress: viewSourceInfo.viewDoroJuso[0],
        // 신청인의 우편번호에 수용가 우편번호를 넣는다.
        applyPostNumber: suyongaInfo.suyongaPostNumber
      },
      viewApplyInfo: {
        ...viewDestInfo,
        applyPostNumber: suyongaInfo.suyongaPostNumber,
        applyAddress: viewSourceInfo.viewDoroJuso[0],
        sido: suyongaInfo.csSido,
        sigungu: suyongaInfo.csGuCdNm,
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: suyongaInfo.csRn,
        dzipcode: '',
        bupd: suyongaInfo.csHdongCd,
        bdMgrNum: '',
        bdBonNum: suyongaInfo.csBldBon,
        bdBuNum: suyongaInfo.csBldBu,
        bdnm: suyongaInfo.csBldNm,
        bdDtNm: suyongaInfo.csEtcAddr,
        addr2: suyongaInfo.csAddr2,
        addr1: suyongaInfo.csAddr1,
        bunji: suyongaInfo.csBon,
        ho: suyongaInfo.csBu,
        extraAdd: suyongaInfo.csEtcAddr,
        specAddr: suyongaInfo.csBldNm,
        specDng: suyongaInfo.csBldDong,
        specHo: suyongaInfo.csBldHo,
        floors: suyongaInfo.csUgFloorNo
      }
    });
    this.render();
    console.log(this.state);
  }

  verify() {
    if (!this.state.suyongaInfo.verify()) return false;
    if (!this.state.applicantInfo.verify()) return false;

    console.log("민원신청 verify::::::::", this.state.privacyAgree);
    if (!this.state.privacyAgree) {
      alert("개인정보취급방침을 동의해 주세요.");
      return false;
    }

    return true;
  }

  // 신청을 위한 데이터를 수집한다.
  getSuyongaQueryString() {

    console.log(this.state.parent);
    const data = this.state.suyongaInfo.state.suyongaInfo;
    console.log(data);
    console.log(this.state.applicantInfo);
    const pattern = /(02|0\d{2})(\d{3,4})(\d{4})/g
    const phoneArr = pattern.exec(this.state.applicantInfo.state.applyInfo.applyPhone);
    const mobileArr = pattern.exec(this.state.applicantInfo.state.applyInfo.applyMobile);

    console.log(mobileArr);
    return {
      // 신청 기본 정보
      'cvplInfo.cvpl.treatSec': '001',
      'cvplInfo.cvpl.recSec': '003',
      'cvplInfo.cvpl.mgrNo': data.suyongaNumber,

      // 수용가 정보
      'cvplInfo.cvplOwner.csOfficeCd': data.csOfficeCd,
      'cvplInfo.cvplOwner.mblckCd': data.mblckCd,
      'cvplInfo.cvplOwner.mblckCdNm': data.mblckCdNm,
      'cvplInfo.cvplOwner.sblckCd': data.sblckCd,
      'cvplInfo.cvplOwner.sblckCdNm': data.sblckCdNm,
      'cvplInfo.cvplOwner.ownerNm': data.suyongaName,
      'cvplInfo.cvplOwner.usrName': data.usrName,
      'cvplInfo.cvplOwner.idtCdSNm': data.idtCdSNm,
      'cvplInfo.cvplOwner.reqKbnNm': '',
      'cvplInfo.cvplProcnd.cyberUserKey': '',
      'cvplInfo.cvplProcnd.officeYn': 'N',

      // 수용자 주소 정보
      'cvplInfo.cvplAddr[0].cvplAdresTy': 'OWNER',
      'cvplInfo.cvplAddr[0].sido': data.csSido,
      'cvplInfo.cvplAddr[0].sigungu': data.csGuCdNm,
      'cvplInfo.cvplAddr[0].umd': data.csBdongCdNm,
      'cvplInfo.cvplAddr[0].hdongNm': data.csHdongCdNm,
      'cvplInfo.cvplAddr[0].dong': '',
      'cvplInfo.cvplAddr[0].doroCd': '',
      'cvplInfo.cvplAddr[0].doroNm': data.csRn,
      'cvplInfo.cvplAddr[0].dzipcode': '',            // 도로우편번호
      'cvplInfo.cvplAddr[0].bupd': data.csHdongCd,
      'cvplInfo.cvplAddr[0].bdMgrNum': '',            // 빌딩관리번호
      'cvplInfo.cvplAddr[0].bdBonNum': data.csBldBon,
      'cvplInfo.cvplAddr[0].bdBuNum': data.csBldBu,
      'cvplInfo.cvplAddr[0].bdnm': data.csBldNm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)
      'cvplInfo.cvplAddr[0].bdDtNm': data.csEtcAddr,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력
      'cvplInfo.cvplAddr[0].addr2': data.csAddr2,
      'cvplInfo.cvplAddr[0].zipcode': data.suyongaPostNumber,
      'cvplInfo.cvplAddr[0].fullDoroAddr': this.state.suyongaInfo.state.viewSuyongaInfo.viewDoroJuso[0],
      'cvplInfo.cvplAddr[0].addr1': data.csAddr1,
      'cvplInfo.cvplAddr[0].bunji': data.csBon,
      'cvplInfo.cvplAddr[0].ho': data.csBu,
      'cvplInfo.cvplAddr[0].extraAdd': data.csEtcAddr,
      'cvplInfo.cvplAddr[0].specAddr': data.csBldNm,
      'cvplInfo.cvplAddr[0].specDng': data.csBldDong,
      'cvplInfo.cvplAddr[0].specHo': data.csBldHo,
      'cvplInfo.cvplAddr[0].floors': data.csUgFloorNo,

      // 신청인 정보
      'cvplInfo.cvpl.applyNm': this.state.applicantInfo.state.applyInfo.applyName,  // 신청인 이름
      'cvplInfo.cvplApplcnt.telno1': phoneArr ? phoneArr[1] : '',
      'cvplInfo.cvplApplcnt.telno2': phoneArr ? phoneArr[2] : '',
      'cvplInfo.cvplApplcnt.telno3': phoneArr ? phoneArr[3] : '',
      'cvplInfo.cvplApplcnt.hpno1': mobileArr ? mobileArr[1] : '',
      'cvplInfo.cvplApplcnt.hpno2': mobileArr ? mobileArr[2] : '',
      'cvplInfo.cvplApplcnt.hpno3': mobileArr ? mobileArr[3] : '',
      'cvplInfo.cvplApplcnt.smsAllowYn': this.state.applicantInfo.state.applyInfo.applySMSAgree ? 'Y' : 'N',
      'cvplInfo.cvplApplcnt.email': this.state.applicantInfo.state.viewApplyInfo.viewApplyEmail[0],
      'cvplInfo.cvplApplcnt.relation1': this.state.applicantInfo.state.applyInfo.applyRelation,
      'cvplInfo.cvplApplcnt.relation2': '', // 기존은 사용자/소유자 -> 관계로 설정 / 사용여부 고려 해봐야

      // 신청인 주소 정보
      'cvplInfo.cvplAddr[1].cvplAdresTy': 'APPLY',
      'cvplInfo.cvplAddr[1].sido': '',
      'cvplInfo.cvplAddr[1].sigungu': '',
      'cvplInfo.cvplAddr[1].umd': '',
      'cvplInfo.cvplAddr[1].hdongNm': '',
      'cvplInfo.cvplAddr[1].dong': '',
      'cvplInfo.cvplAddr[1].doroCd': '',
      'cvplInfo.cvplAddr[1].doroNm': '',
      'cvplInfo.cvplAddr[1].dzipcode': '',
      'cvplInfo.cvplAddr[1].bupd': '',
      'cvplInfo.cvplAddr[1].bdMgrNum': '',
      'cvplInfo.cvplAddr[1].bdBonNum': '',
      'cvplInfo.cvplAddr[1].bdBuNum': '',
      'cvplInfo.cvplAddr[1].bdnm': '',
      'cvplInfo.cvplAddr[1].bdDtNm': '',
      'cvplInfo.cvplAddr[1].addr2': '',
      'cvplInfo.cvplAddr[1].zipcode': this.state.applicantInfo.state.applyInfo.applyPostNumber,
      'cvplInfo.cvplAddr[1].fullDoroAddr': this.state.applicantInfo.state.applyInfo.applyAddress,
      'cvplInfo.cvplAddr[1].addr1': '',
      'cvplInfo.cvplAddr[1].bunji': '',
      'cvplInfo.cvplAddr[1].ho': '',
      'cvplInfo.cvplAddr[1].extraAdd': '',
      'cvplInfo.cvplAddr[1].specAddr': '',
      'cvplInfo.cvplAddr[1].specDng': '',
      'cvplInfo.cvplAddr[1].specHo': '',
      'cvplInfo.cvplAddr[1].floors': '',
    };
  }

  // 화면을 그려주는 부분이다.
  render() {
    const that = this;
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc"></div><!-- //mw-box -->    
      <div class="mw-box" id="suyonga"></div><!-- //mw-box -->
      <!-- 본인인증 -->      
      <div class="mw-box" id="authentication"></div>
      <!-- 신청인정보 -->
      <div class="mw-box" id="applicant"></div><!-- //mw-box -->
  
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
    this.state.suyongaInfo.render();
    this.state.authenticationInfo.render();
    this.state.applicantInfo.render();
  }
}