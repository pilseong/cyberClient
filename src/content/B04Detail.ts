/**
 * 소유자, 사용자 명의 변경 상세 화면
 */
import { fetch } from './../util/unity_resource';
import {
  hideGubunMulti, showGubunMulti,
  setGubunMulti, showLayer, hideLayer,
  phoneNumberInputValidation
} from './../util/uiux-common';

declare var gContextUrl: string;
declare var alert: (msg: string) => void;

export default class B04DetailPage {
  state: any;
  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      ownerCheck: false,
      userCheck: false,
      reason: '',
      ownerInfo: {
        gubun: '0',
        ownerName: '',
        ownerBusinessNumber: '',
        ownerPhone: '',
        ownerMobile: '',
        ownerChangeDate: new Date().toLocaleDateString('en-CA')
      },
      userInfo: {
        // 0이 개인, 1이 법인
        gubun: '0',
        userName: '',
        userBusinessNumber: '',
        userPhone: '',
        userMobile: '',
        userChangeDate: new Date().toLocaleDateString('en-CA')
      },
      viewRequestInfo: {},
      description: {}
    };

    this.getDescription();
  }

  // 초기값 설정
  setInitValue() {

  }

  // 명의 변경 서비스를 서버로 요청한다.
  getDescription() {
    const that = this;

    var url = ''//gContextUrl + "/citizen/common/listCitizenCvplDfn.do";
    var queryString = {
      'minwonCd': this.state.minwonCd
    };

    fetch('GET', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        alert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }

      that.setState({
        ...that.state,
        description: data[0]
      })
      console.log(data);
      console.log('after fetching', that.state);
    });
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  getViewInfo() {
    const infoData: any = {};
    if (this.state.userCheck) {
      infoData['userInfo'] = {
        title: '사용자 명의 변경 입력정보',
        gubun: [this.state.userInfo.gubun === '0' ? '개인' : '법인', '구분'],
        name: [this.state.userInfo.userName, '이름'],
        phone: [this.state.userInfo.userPhone, '전화번호'],
        mobile: [this.state.userInfo.userMobile, '휴대폰'],
        changeDate: [this.state.userInfo.userChangeDate, '변경일'],
        changeReason: [this.state.reason, '변경사유']
      };

      // 사업자 번호는 구분에 따라서 표출여부가 결정된다.
      if (this.state.userInfo.gubun === '1') {
        infoData['userInfo']['businessNumber'] = [this.state.userInfo.userBusinessNumber, '사업자번호'];
      }
    }

    if (this.state.ownerCheck) {
      infoData['ownerInfo'] = {
        title: '소유자 명의 변경 입력정보',
        gubun: [this.state.ownerInfo.gubun === '0' ? '개인' : '법인', '구분'],
        name: [this.state.ownerInfo.ownerName, '이름'],
        businessNumber: [this.state.ownerInfo.ownerBusinessNumber, '사업자번호'],
        phone: [this.state.ownerInfo.ownerPhone, '전화번호'],
        mobile: [this.state.ownerInfo.ownerMobile, '휴대폰'],
        changeReason: [this.state.reason, '변경사유']
      };

      // 사업자 번호는 구분에 따라서 표출여부가 결정된다.
      if (this.state.ownerInfo.gubun === '1') {
        infoData['ownerInfo']['businessNumber'] = [this.state.ownerInfo.ownerBusinessNumber, '사업자번호'];
      }
    }

    if (!this.state.userCheck && !this.state.ownerCheck) {
      infoData['nameChnge'] = {
        title: this.state.description.minwonNm,
        desc: ['', '신청정보가 없습니다.']
      }
    }

    return infoData;
  }


  verify() {
    const ownerInfo = this.state.ownerInfo;
    const userInfo = this.state.userInfo;

    if (!this.state.ownerCheck && !this.state.userCheck) {
      alert("소유자 명의 변경 신청 정보가 없습니다.");
      return false;
    }

    if (!this.state.reason) {
      alert("소유자 명의 변경 신청사유를 입력해 주세요.");
      return false;
    }

    // 소유자 명의 변경 체크
    if (this.state.ownerCheck) {
      if (!ownerInfo.ownerName) {
        alert("소유자 명의 변경 변경할 소유자의 이름을 입력해 주세요.");
        return false;
      }

      if (ownerInfo.gubun === '1') {
        if (!ownerInfo.ownerBusinessNumber) {
          alert("소유자 명의 변경 변경할 소유자의 사업자번호를 입력해 주세요.");
          return false;
        }
      }

      if (!ownerInfo.ownerPhone && !ownerInfo.ownerMobile) {
        if (!ownerInfo.ownerName) {
          alert("소유자 명의 변경 변경할 소유자의 전화번호를 입력해 주세요.");
          return false;
        }
      }
    }

    // 사용자 명의 변경 체크
    if (this.state.userCheck) {
      if (!userInfo.userName) {
        alert("사용자 명의 변경 변경할 사용자의 이름을 입력해 주세요.");
        return false;
      }

      if (userInfo.gubun === '1') {
        if (!userInfo.userBusinessNumber) {
          alert("사용자 명의 변경 변경할 사용자의 사업자번호를 입력해 주세요.");
          return false;
        }
      }

      if (!userInfo.userPhone && !userInfo.userMobile) {
        if (!userInfo.userName) {
          alert("사용자 명의 변경 변경할 사용자의 전화번호를 입력해 주세요.");
          return false;
        }
      }
    }
    return true;
  }

  // 법인 / 개인 선택 시 UI 변경 처리
  handleUserGubun(e: any) {
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        gubun: e.target.value
      }
    });

    console.log(this.state);
    this.render();
  }

  handleOwnerGubun(e: any) {
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        gubun: e.target.value
      }
    });

    console.log(this.state);
    this.render();
  }

  // 신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun: string, id: string, uiBox: any) {
    if (gubun === 'ownerCheck') {
      this.setState({
        ...this.state,
        ownerCheck: !this.state[gubun]
      });
    } else if (gubun === 'userCheck') {
      this.setState({
        ...this.state,
        userCheck: !this.state[gubun]
      });
    }
    setGubunMulti(id, uiBox);
    this.render();
  }

  // 사용자 전화번호 연동
  handleUserPhone(e: any) {
    console.log(e.target.value.substring(0, 11));
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userPhone: e.target.value.substring(0, 11)
      },
      viewRequestInfo: {
        ...this.state.viewRequestInfo,
        userPhone: [e.target.value.substring(0, 11), "일반전화"]
      }
    });
    phoneNumberInputValidation(e.target, 11, /(02|0\d{2})(\d{3,4})(\d{4})/g);
  }

  // 소유자 전화번호 연동
  handleOwnerPhone(e: any) {
    console.log(e.target.value.substring(0, 11));
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerPhone: e.target.value.substring(0, 11)
      }
    });
    e.target.value = this.state.ownerInfo.ownerPhone.substring(0, 11);
    phoneNumberInputValidation(e.target, 11, /(02|0\d{2})(\d{3,4})(\d{4})/g);
  }

  // 사용자 휴대번호 연동
  handleUserMobile(e: any) {
    console.log(e.target.value.substring(0, 11));
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userMobile: e.target.value.substring(0, 11)
      }
    });
    e.target.value = this.state.userInfo.userMobile.substring(0, 11);
    phoneNumberInputValidation(e.target, 11, /(010)(\d{3,4})(\d{4})/g);
  }

  // 소유자 휴대번호 연동
  handleOwnerMobile(e: any) {
    console.log(e.target.value.substring(0, 11));
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerMobile: e.target.value.substring(0, 11)
      }
    });
    e.target.value = this.state.ownerInfo.ownerMobile.substring(0, 11);
    phoneNumberInputValidation(e.target, 11, /(010)(\d{3,4})(\d{4})/g);

  }

  // 사용자 이름 연동
  handleUserName(e: any) {
    console.log(e.target.value.substring(0, 30));
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userName: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.userInfo.userName.substring(0, 30);
  }

  // 소유자 이름 연동
  handleOwnerName(e: any) {
    console.log(e.target.value.substring(0, 30));
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerName: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.ownerInfo.ownerName.substring(0, 30);
  }

  // 소유자 사업자번호 연동
  handleOwnerBusinessNumber(e: any) {
    console.log(e.target.value.substring(0, 10));
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerBusinessNumber: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.ownerInfo.ownerBusinessNumber.substring(0, 10);
  }

  // 사용자 사업자번호 연동
  handleUserBusinessNumber(e: any) {
    console.log(e.target.value.substring(0, 10));
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userBusinessNumber: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.userInfo.userBusinessNumber.substring(0, 10);
  }


  handleDateForUser(e: any) {
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userChangeDate: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.userInfo.userChangeDate.substring(0, 30);

    console.log(this.state.userInfo)
  }

  handleDateForOwner(e: any) {
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerChangeDate: e.target.value.substring(0, 30)
      }
    });
    e.target.value = this.state.ownerInfo.ownerChangeDate.substring(0, 30);
    console.log(this.state.ownerInfo)
  }

  handleReason(e: any) {
    this.setState({
      ...this.state,
      reason: e.target.value.substring(0, 100)
    });
    e.target.value = this.state.reason.substring(0, 100);
    console.log(this.state.reason)
  }

  // 명의 변경 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyNmchnge.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        alert("소유자/사용자 명의변경 신청이 정상적으로 처리되지 않았습니다.");
        return;
      }
      console.log(data);

      console.log('after fetching', that.state);
      that.render();
    });
  }

  getQueryString() {
    const pattern = /(02|0\d{2})(\d{3,4})(\d{4})/g

    const ownerInfo = this.state.ownerInfo;
    const userInfo = this.state.userInfo;

    const ownerPhoneArr = pattern.exec(ownerInfo.ownerPhone);
    const ownerMobileArr = pattern.exec(ownerInfo.ownerMobile);

    const userPhoneArr = pattern.exec(userInfo.userPhone);
    const userMobileArr = pattern.exec(userInfo.userMobile);

    const nameChangeData = {
      // 통합 민원 데이터 셋 바인딩
      'nmchngeVO.gubun': this.state.ownerCheck && this.state.userCheck ?
        '소유자및사용자' :
        this.state.ownerCheck ? '소유자' : '사용자',
      'nmchngeVO.changeDesc': this.state.reason,
      'nmchngeVO.nowNm': ownerInfo.ownerName,
      'nmchngeVO.jooNo1': ownerInfo.ownerBusinessNumber,
      'nmchngeVO.jooNo2': '',
      'nmchngeVO.nowOwnTelno1': ownerPhoneArr ? ownerPhoneArr[1] : '',
      'nmchngeVO.nowOwnTelno2': ownerPhoneArr ? ownerPhoneArr[2] : '',
      'nmchngeVO.nowOwnTelno3': ownerPhoneArr ? ownerPhoneArr[3] : '',
      'nmchngeVO.nowOwnHpno1': ownerMobileArr ? ownerMobileArr[1] : '',
      'nmchngeVO.nowOwnHpno2': ownerMobileArr ? ownerMobileArr[2] : '',
      'nmchngeVO.nowOwnHpno3': ownerMobileArr ? ownerMobileArr[3] : '',
      'nmchngeVO.nowOwnChDt': ownerInfo.ownerChangeDate && ownerInfo.ownerChangeDate.replaceAll('-', '/'),
      'nmchngeVO.nowUseNm': userInfo.userName,
      'nmchngeVO.nowUseJooNo1': userInfo.userBusinessNumber,
      'nmchngeVO.nowUseJooNo2': '',
      'nmchngeVO.nowUseTelno1': userPhoneArr ? userPhoneArr[1] : '',
      'nmchngeVO.nowUseTelno2': userPhoneArr ? userPhoneArr[2] : '',
      'nmchngeVO.nowUseTelno3': userPhoneArr ? userPhoneArr[3] : '',
      'nmchngeVO.nowUseHpno1': userMobileArr ? userMobileArr[1] : '',
      'nmchngeVO.nowUseHpno2': userMobileArr ? userMobileArr[2] : '',
      'nmchngeVO.nowUseHpno3': userMobileArr ? userMobileArr[3] : '',
      'nmchngeVO.nowUseChDt': userInfo.userChangeDate && userInfo.userChangeDate.replaceAll('-', '/')
    };

    return {
      ...this.state.parent.state.suyongaInfoPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...nameChangeData
    };
  }

  render() {
    const that = this;

    let template = `
      <div class="mw-box" id="desc">
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
        </div><!-- // info-mw -->
      </div><!-- // mw-box -->
      <!-- 신청내용 -->
      <div class="mw-box">
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw21');" title="닫기">
        <span class="i-01">명의변경 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>명의변경 대상을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="aGubun1" class="off">
                    <a class="btn"
                      onClick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('userCheck', '#aGubun1','#mw-box1')">
                    <span>사용자</span></a>
                  </li>
                  <li id="aGubun2" class="off">
                    <a class="btn"
                      onClick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('ownerCheck', '#aGubun2','#mw-box2')">
                    <span>소유자</span></a>
                  </li>
                </ul>
                <!-- <a href="#" class="btn btnSS"><span>체납확인</span></a> -->
                <p class="form-cmt form-cmt-1 txRed row">
                  * 세입자이신 경우는 사용자 변경을 선택하시면 됩니다.<br>
                  * 고지서의 명의변경을 원하는 경우 사용자를 선택하시면 됩니다.
                </p>
              </li>
              <li>
                <label for="form-mw22-tx" class="input-label-1"><span>변경사유를 입력하세요.</span></label>
                <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleReason(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleReason(event)"
                  value="${that.state.reason}"
                  type="text" id="form-mw22-tx" class="input-box input-w-0" placeholder="변경사유">
              </li>
            </ul>
          </div>
        </div><!-- // form-mw-box -->
      </div><!-- // form-mw21 -->
      </div><!-- // mw-box -->
  
      <!-- 사용자정보 -->
      <div id="mw-box1" class="mw-box display-none row">
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw22');" title="닫기">
          <span class="i-01">사용자 정보</span></a>
        </div>
        <div class="form-mw-box display- row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="cGubunType1" class="input-label"><span>성명(회사명)</span></label>
                <select id="cGubunType1" name="cGubunType1" onchange="cyberMinwon.state.currentModule.state.currentPage.handleUserGubun(event)" 
                  title="변경구분 선택" class="input-box input-w-2">
                  <option value="0" ${that.state.userInfo.gubun === '0' ? 'selected' : ''}>개인</option>
                  <option value="1" ${that.state.userInfo.gubun === '1' ? 'selected' : ''}>법인</option>
                </select>
                <label for="form-mw12-tx"><span class="sr-only">성명(회사명)</span></label>
                <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleUserName(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleUserName(event)"
                  type="text" value="${that.state.userInfo.userName}"
                  id="form-mw12-tx" class="input-box input-w-2" placeholder="사용자 성명(회사명)">
              </li>
              <li ${that.state.userInfo.gubun === '0' ? 'hidden' : ''}>
                <label for="form-mw35-tx" class="input-label"><span>사업자번호</span></label>
                <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleUserBusinessNumber(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleUserBusinessNumber(event)"
                  value="${that.state.userInfo.userBusinessNumber}"
                  type="text" id="form-mw35-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw45-tx" class="input-label"><span>전화번호</span></label>
                <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleUserPhone(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleUserPhone(event)"
                  value="${that.state.userInfo.userPhone}"
                  type="text" id="form-mw45-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw36-tx" class="input-label"><span class="form-req">휴대폰번호</span></label>
                <input  onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleUserMobile(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleUserMobile(event)"
                  value="${that.state.userInfo.userMobile}"
                  type="text" id="form-mw36-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <p class="form-cmt">* 휴대번호가없는 경우 전화번호를 입력하세요.</p>
              </li>
              <li>
                <label for="leakRepairDt" class="input-label"><span>변경년월일 </span></label>
                <input type="date" onchange="cyberMinwon.state.currentModule.state.currentPage.handleDateForUser(event)" onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleDateForUser(event)"
                  value="${that.state.userInfo.userChangeDate}" id="leakRepairDt" name="leakRepairDt"
                  class="input-box input-w-2 datepicker hasDatepicker">
                <p class="form-cmt txRed">* 실제 사용자 변경일자를 입력하세요.</p>
              </li>
            </ul>
          </div>
        </div><!-- // form-mw-box -->
      </div><!-- // form-mw22 -->
      </div><!-- // mw-box -->

      <!-- 소유자정보 -->
      <div id="mw-box2" class="mw-box display-none row">
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" title="닫기">
          <span class="i-01">소유자 정보</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="cGubunType2" class="input-label"><span>성명(회사명)</span></label>
                <select id="cGubunType2" name="cGubunType2" onchange="cyberMinwon.state.currentModule.state.currentPage.handleOwnerGubun(event)"
                  title="변경구분 선택" class="input-box input-w-2">
                  <option value="0" ${that.state.ownerInfo.gubun === '0' ? 'selected' : ''}>개인</option>
                  <option value="1" ${that.state.ownerInfo.gubun === '1' ? 'selected' : ''}>법인</option>
                </select>
                <label for="form-mw32-tx"><span class="sr-only">성명(회사명)</span></label>
                <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleOwnerName(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleOwnerName(event)"
                  type="text" value="${that.state.ownerInfo.ownerName}"
                  id="form-mw32-tx" class="input-box input-w-2" placeholder="사용자 성명(회사명)">
              </li>
              <li ${that.state.ownerInfo.gubun === '0' ? 'hidden' : ''}>
                <label for="form-mw55-tx" class="input-label"><span>사업자번호</span></label>
                <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleOwnerBusinessNumber(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleOwnerBusinessNumber(event)"
                  value="${that.state.ownerInfo.ownerBusinessNumber}"
                  type="text" id="form-mw55-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw65-tx" class="input-label"><span>전화번호</span></label>
                <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleOwnerPhone(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleOwnerPhone(event)"
                  value="${that.state.ownerInfo.ownerPhone}"
                type="text" id="form-mw65-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw46-tx" class="input-label"><span class="form-req">휴대폰번호</span></label>
                <input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleOwnerMobile(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleOwnerMobile(event)"
                  value="${that.state.ownerInfo.ownerMobile}"
                type="text" id="form-mw46-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <p class="form-cmt">* 휴대번호가없는 경우 전화번호를 입력하세요.</p>
              </li>
              <li><label for="leakRepairDt1" class="input-label"><span>변경년월일 </span></label>
                <input type="date" onchange="cyberMinwon.state.currentModule.state.currentPage.handleDateForOwner(event)" onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleDateForOwner(event)"
                  value="${that.state.ownerInfo.ownerChangeDate}" id="leakRepairDt1" name="leakRepairDt1"
                  class="input-box input-w-2 datepicker hasDatepicker">
                <p class="form-cmt txRed">* 실제 소유자 변경일자를 입력하세요.</p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- // form-mw23 -->
      </div><!-- // mw-box -->
    `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));

    this.afterRender();
  }

  afterRender() {
    // 상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
    this.state.userCheck ? showGubunMulti('#aGubun1', '#mw-box1') : hideGubunMulti('#aGubun1', '#mw-box1');
    this.state.userCheck ? showLayer('#form-mw22') : hideLayer('#form-mw22');
    this.state.ownerCheck ? showGubunMulti('#aGubun2', '#mw-box2') : hideGubunMulti('#aGubun2', '#mw-box2');
    this.state.ownerCheck ? showLayer('#form-mw23') : hideLayer('#form-mw23');
  }

  renderDescription(target: any) {
    const that = this;
    const desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div class="form-mw-box display-none row">
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>${that.state.description.minwonNm}</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>${that.state.description.minwonDfn}<br>
                </ul>
              </div>
    
              <div class="tit-mw-h5 row"><span>신청방법</span></div>
              - ${that.state.description.minwonHow}<br>
              <div class="tit-mw-h5 row"><span>처리기간</span></div>
              - ${that.state.description.minwonReqstDc}<br>
              <div class="tit-mw-h5 row"><span>처리부서</span></div>
              - ${that.state.description.minwonGde}<br>
              <div class="tit-mw-h5 row"><span>신청서류</span></div>
              - ${that.state.description.presentnPapers}<br>
              <div class="tit-mw-h5 row"><span>관련법규</span></div>
              - ${that.state.description.mtinspGde}<br>
              <div class="tit-mw-h5 row"><span>처리절차</span></div>
              - ${that.state.description.minwonProcedure}<br>
            </div>
          </div>
        </div><!-- // info-mw -->
      `;
    target.innerHTML = desc;
  }
}