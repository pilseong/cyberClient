/**
 * 소유자, 사용자 명의 변경 상세 화면
 */
import CyberMinwon from '../infra/CyberMinwon';
import UnityMinwonPanel from '../components/UnityMinwonPanel';
import { fetch } from './../util/unity_resource';
import {
  hideGubunMulti, showGubunMulti, setGubunMulti, showLayer, hideLayer, saupsoInfo,
  phoneNumberInputValidation, phoneNumberInputValidationRemove, citizenAlert, citizen_alert, citizenConfirm, maskingFnc, phonePattern, mobilePattern
} from './../util/uiux-common';

declare var gContextUrl: string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;
declare var fncCutByByte: (str: string, maxByte: number) => string;

export default class B04DetailPage {
  state: {
      minwonCd: string;
      parent: any;
      ownerCheck: boolean;
      userCheck: boolean;
      reason: string;
      isSubmitSuccessful: boolean;
      submitResult: any,
      ownerInfo: {
        gubun: string;
        ownerName: string;
        ownerBusinessNumber: string;
        ownerPhone: string;
        ownerMobile: string;
        ownerChangeDate: string;
      },
      userInfo: {
        // 0이 개인, 1이 법인
        gubun: string;
        userName: string;
        userBusinessNumber: string;
        userPhone: string;
        userMobile: string;
        userChangeDate: string;
      },
      viewRequestInfo: any;
      description: any;
  };
  path: string;
  
  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      ownerCheck: false,
      userCheck: false,
      reason: '',
      isSubmitSuccessful: false,
      submitResult: {},
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

    this.path = 'cyberMinwon.state.currentModule.state.currentPage';
    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
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
      }
    });
  }

  // 명의 변경 서비스를 서버로 요청한다.
  getDescription(data: any) {
    const that = this;
    that.setState({
      ...that.state,
      description: data 
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
        name: [(this.state.userInfo.gubun === '0' ? '개인' : '법인')+" / "+maskingFnc.name(this.state.userInfo.userName,"*"), '사용자명'],
//        phone: [maskingFnc.telNo(this.state.userInfo.userPhone, "*")+" / "+maskingFnc.telNo(this.state.userInfo.userMobile, "*"), '연락처'],
//        changeDate: [this.state.userInfo.userChangeDate, '변경일'],
//        changeReason: [this.state.reason, '변경사유']
      };

      // 사업자 번호는 구분에 따라서 표출여부가 결정된다.
      if (this.state.userInfo.gubun === '1') {
        infoData['userInfo']['businessNumber'] = [maskingFnc.businessNumber(this.state.userInfo.userBusinessNumber,"*", 5), '사업자등록번호'];
      }
      infoData['userInfo']['phone'] = [maskingFnc.telNo(this.state.userInfo.userPhone, "*")+" / "+maskingFnc.telNo(this.state.userInfo.userMobile, "*"), '연락처']
      infoData['userInfo']['changeDate'] = [this.state.userInfo.userChangeDate, '변경일']
      infoData['userInfo']['changeReason'] = [this.state.reason, '변경사유']
      
    }

    if (this.state.ownerCheck) {
      infoData['ownerInfo'] = {
        title: '소유자 명의 변경 입력정보',
        name: [(this.state.ownerInfo.gubun === '0' ? '개인' : '법인')+" / "+maskingFnc.name(this.state.ownerInfo.ownerName,"*"), '소유자명'],
//        phone: [maskingFnc.telNo(this.state.ownerInfo.ownerPhone, "*")+" / "+maskingFnc.telNo(this.state.ownerInfo.ownerMobile, "*"), '연락처'],
//        changeDate: [this.state.ownerInfo.ownerChangeDate, '변경일'],
//        changeReason: [this.state.reason, '변경사유']
      };

      // 사업자 번호는 구분에 따라서 표출여부가 결정된다.
      if (this.state.ownerInfo.gubun === '1') {
        infoData['ownerInfo']['businessNumber'] = [maskingFnc.businessNumber(this.state.ownerInfo.ownerBusinessNumber,"*", 5), '사업자등록번호'];
      }
      infoData['ownerInfo']['phone'] = [maskingFnc.telNo(this.state.ownerInfo.ownerPhone, "*")+" / "+maskingFnc.telNo(this.state.ownerInfo.ownerMobile, "*"), '연락처'],
      infoData['ownerInfo']['changeDate'] = [this.state.ownerInfo.ownerChangeDate, '변경일']
      infoData['ownerInfo']['changeReason'] = [this.state.reason, '변경사유']
    }

    if (!this.state.userCheck && !this.state.ownerCheck) {
      infoData['noinfo'] = {
        title: this.state.description.minwonNm,
        desc: ['', '신청정보가 없습니다.']
      };
    }

    return infoData;
  }

  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};

    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    let requestTypeTitle = this.state.userCheck && this.state.ownerCheck ? '사용자, 소유자' : '';
    requestTypeTitle = this.state.userCheck && !this.state.ownerCheck ? '사용자' : '';
    requestTypeTitle = !this.state.userCheck && this.state.ownerCheck ? '소유자' : '';
    const resultData = this.state.submitResult;
    const resultList = resultData.errorMsg.split(',');
    // 성공
    if (this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: requestTypeTitle + ' 명의 변경 신청 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt, '신청일시'],
        desc: [`정상적으로 신청 되었습니다.`, '신청결과']
      };
    } else {
      // 신청 실패 화면
      infoData['noinfo'] = {
//        title: '소유자 명의 변경 신청 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo ? resultData.data.receiptNo : '-', '접수번호'],        
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
        desc: [`[${resultList[1]}]로 비정상 처리 되었습니다.<br>아래 수도사업소 또는 서울아리수본부에 문의해 주십시오.`, '신청결과'],
//        cause: [resultData.errorMsg.length > 200 ? "시스템 내부에서 오류가 발생했습니다." : resultData.errorMsg, '사유']
      };
    }
    
    return infoData;
  }

  verify() {
    const ownerInfo = this.state.ownerInfo;
    const userInfo = this.state.userInfo;

    if (!this.state.ownerCheck && !this.state.userCheck) {
      citizenAlert("소유자 명의 변경 신청 정보가 없습니다.");
      return false;
    }

    if (!this.state.reason) {
      citizenAlert("변경 신청사유를 입력해 주세요.");
      return false;
    }

    // 소유자 명의 변경 체크
    if (this.state.ownerCheck) {
      if (!ownerInfo.ownerName) {
        citizenAlert("소유자 정보에 소유자명을 입력해 주세요.");
        return false;
      }

      if (ownerInfo.gubun === '1') {
        if (!ownerInfo.ownerBusinessNumber) {
          citizenAlert("소유자 정보에 사업자등록번호를 입력해 주세요.");
          return false;
        }
        if(ownerInfo.ownerBusinessNumber.length !== 10){
          citizenAlert("소유자 정보에 사업자등록번호 10자리를 입력해 주세요.");
          return false;
        }
      }

      if (!ownerInfo.ownerPhone && !ownerInfo.ownerMobile) {
          citizenAlert("소유자 정보에 전화번호를 입력해 주세요.");
          return false;
      }
      
      if (ownerInfo.ownerPhone && phonePattern.test(ownerInfo.ownerPhone) !== true) {
        citizenAlert("소유자 정보의 전화번호가 형식에 맞지 않습니다. 지역번호를 포함한 정확한 전화번호를 입력해 주세요.").then(result => {
          if(result){
            $("#form-mw65-tx").focus();
          }
        });
        return false;
      };
      
      if (ownerInfo.ownerMobile && mobilePattern.test(ownerInfo.ownerMobile) !== true) {
        citizenAlert("소유자 정보의 휴대전화 번호가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.").then(result => {
          if(result){
            $("#form-mw46-tx").focus();
          }
        });
        return false;
      };
    }

    // 사용자 명의 변경 체크
    if (this.state.userCheck) {
      if (!userInfo.userName) {
        citizenAlert("사용자 정보에 사용자명을 입력해 주세요.");
        return false;
      }

      if (userInfo.gubun === '1') {
        if (!userInfo.userBusinessNumber) {
          citizenAlert("사용자 정보에 사업자등록번호를 입력해 주세요.");
          return false;
        }
        if(userInfo.userBusinessNumber.length !== 10){
          citizenAlert("사용자 정보에 사업자등록번호 10자리를 입력해 주세요.");
          return false;
        }
      }

      if (!userInfo.userPhone && !userInfo.userMobile) {
          citizenAlert("사용자 정보에 전화번호를 입력해 주세요.");
          return false;
      }
      
      if (userInfo.userPhone && phonePattern.test(userInfo.userPhone) !== true) {
      citizenAlert("사용자 정보의 전화번호가 형식에 맞지 않습니다. 지역번호를 포함한 정확한 전화번호를 입력해 주세요.");
      $("#form-mw45-tx").focus();
      return false;
      };
      
      if (userInfo.userMobile && mobilePattern.test(userInfo.userMobile) !== true) {
      citizenAlert("사용자 정보의 휴대전화 번호가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.");
       $("#form-mw36-tx").focus();
       return false;
      };
    }
    let payMentInfo = this.state.parent.state.applicationPage.suyongaInfo.payMentInfo;
    if(this.state.userCheck || (this.state.userCheck && this.state.ownerCheck)){
      if(!payMentInfo.paymentChk){
        citizenAlert("체납확인 버튼을 눌러 주세요");
        return false;
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
    let val = e.target.value.replace(/[^0-9]/g,"").substring(0, 12);
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userPhone: val
      },
      viewRequestInfo: {
        ...this.state.viewRequestInfo,
        userPhone: [val, "일반전화"]
      }
    });
    e.target.value = val;
    val.length > 0 ? phoneNumberInputValidation(e.target, 12, phonePattern) : phoneNumberInputValidationRemove(e.target);
  }

  // 소유자 전화번호 연동
  handleOwnerPhone(e: any) {
    let val = e.target.value.replace(/[^0-9]/g,"").substring(0, 12);
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerPhone: val
      }
    });
    e.target.value = val;
    val.length > 0 ? phoneNumberInputValidation(e.target, 12, phonePattern) : phoneNumberInputValidationRemove(e.target);
  }

  // 사용자 휴대번호 연동
  handleUserMobile(e: any) {
    let val = e.target.value.replace(/[^0-9]/g,"").substring(0, 11);
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userMobile: val
      }
    });
    e.target.value = val;
    val.length > 0 ? phoneNumberInputValidation(e.target, 11, mobilePattern) : phoneNumberInputValidationRemove(e.target);
  }

  // 소유자 휴대번호 연동
  handleOwnerMobile(e: any) {
    let val = e.target.value.replace(/[^0-9]/g,"").substring(0, 11);
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerMobile: val
      }
    });
    e.target.value = val;
    val.length > 0 ? phoneNumberInputValidation(e.target, 11, mobilePattern) : phoneNumberInputValidationRemove(e.target);

  }

  // 사용자 이름 연동
  handleUserName(e: any) {
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userName: fncCutByByte(e.target.value, 150)
      }
    });
    e.target.value = this.state.userInfo.userName;
  }

  // 소유자 이름 연동
  handleOwnerName(e: any) {
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerName: fncCutByByte(e.target.value, 150)
      }
    });
    e.target.value = this.state.ownerInfo.ownerName;
  }

  // 소유자 사업자등록번호 연동
  handleOwnerBusinessNumber(e: any) {
    this.setState({
      ...this.state,
      ownerInfo: {
        ...this.state.ownerInfo,
        ownerBusinessNumber: e.target.value.replace(/[^0-9]/g,"").substring(0, 10)
      }
    });
    e.target.value = this.state.ownerInfo.ownerBusinessNumber;
  }

  // 사용자 사업자등록번호 연동
  handleUserBusinessNumber(e: any) {
    this.setState({
      ...this.state,
      userInfo: {
        ...this.state.userInfo,
        userBusinessNumber: e.target.value.replace(/[^0-9]/g,"").substring(0, 10)
      }
    });
    e.target.value = this.state.userInfo.userBusinessNumber;
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
  }

  handleReason(e: any) {
    this.setState({
      ...this.state,
      reason: e.target.value.substring(0, 100)
    });
    e.target.value = this.state.reason.substring(0, 100);
  }

  // 명의 변경 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyNmchnge.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function(error: any, data: any) {
      if(error){
        citizenAlert('서버와 통신에 실패하였습니다.')
        $(".Modal").remove();
        return;
      }
      // 통합민원 결과 저장
      if (data.resultCd === 'Y') {
        that.state.parent.state.applicationPage.unityMinwons.setUnityList(data.data.receiptNo,"Y");
      }

      // 결과에 대한 정리가 필요하다. 현재 소유자가 들어간 경우는 resultCd가 N이어도
      // 정상신청이 된 경우가 있다. 성공 실패 여부를 구분하지 않고 결과를 보여 줄 것을 고민해야 할 듯
      that.setState({
        ...that.state,
        isSubmitSuccessful: data.resultCd === 'Y' ? true : 
          that.state.ownerCheck ? true : false,
        submitResult: data
      });

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');
    });
  }
  
  getSmsResult(){
    const that = this;
    const applicationPage = that.state.parent.state.applicationPage;
    const suyongaInfo = applicationPage.suyongaInfo.state.suyongaInfo;
    let smsTemplate = ``;
    const mkey = suyongaInfo.mkey;
    const address = suyongaInfo.suyongaAddress;
    let saupsoCdR = ""
    if(that.state.submitResult.data){
      saupsoCdR = that.state.submitResult.data.receiptNo.substring(0,3);
    }
    let officeNm = '';
    const saupso = saupsoInfo.find(ele => {ele.saupsoCd === saupsoCdR});
    if(typeof saupso  === 'undefined') {
      
    }else{
      officeNm = saupso.fullName;
    }
    smsTemplate += `
      <p class="form-info-box-gol"><명의변경 처리 안내><br>
      고객번호 : ${mkey}<br>
      주소 : ${address}<br><br>
      위 수도의 사용자가 ${maskingFnc.name(suyongaInfo.usrName,"*")}님에서 ${maskingFnc.name(that.state.userInfo.userName,"*")}님으로 변경처리되었습니다.<br><br><br>
      ${officeNm}
      </p>
    `;
    if(that.state.userCheck && !that.state.ownerCheck){
      return smsTemplate;
    }else{
      return '';
    }
  }

  getQueryString() {
    const ownerInfo = this.state.ownerInfo;
    const userInfo = this.state.userInfo;

    const ownerPhoneArr = phonePattern.exec(ownerInfo.ownerPhone);
    const ownerMobileArr = mobilePattern.exec(ownerInfo.ownerMobile);

    const userPhoneArr = phonePattern.exec(userInfo.userPhone);
    const userMobileArr = mobilePattern.exec(userInfo.userMobile);

    const nameChangeData = {
      // 통합 민원 데이터 셋 바인딩
      'nmchngeVO.gubun': this.state.ownerCheck && this.state.userCheck ?
        '소유자및사용자' :
        this.state.ownerCheck ? '소유자' : '사용자',
      'nmchngeVO.changeDesc': this.state.reason,
      'nmchngeVO.nowNm': ownerInfo.ownerName,
      'nmchngeVO.jooNo1': ownerInfo.ownerBusinessNumber?.substring(0, 5),
      'nmchngeVO.jooNo2': ownerInfo.ownerBusinessNumber?.substring(5),
      'nmchngeVO.nowOwnTelno1': ownerPhoneArr ? ownerPhoneArr[1] : '',
      'nmchngeVO.nowOwnTelno2': ownerPhoneArr ? ownerPhoneArr[2] : '',
      'nmchngeVO.nowOwnTelno3': ownerPhoneArr ? ownerPhoneArr[3] : '',
      'nmchngeVO.nowOwnHpno1': ownerMobileArr ? ownerMobileArr[1] : '',
      'nmchngeVO.nowOwnHpno2': ownerMobileArr ? ownerMobileArr[2] : '',
      'nmchngeVO.nowOwnHpno3': ownerMobileArr ? ownerMobileArr[3] : '',
      'nmchngeVO.nowOwnChDt': ownerInfo.ownerChangeDate && ownerInfo.ownerChangeDate.replace(/-/g, '/'),
      'nmchngeVO.nowUseNm': userInfo.userName,
      'nmchngeVO.nowUseJooNo1': userInfo.userBusinessNumber?.substring(0, 5),
      'nmchngeVO.nowUseJooNo2': userInfo.userBusinessNumber?.substring(5),
      'nmchngeVO.nowUseTelno1': userPhoneArr ? userPhoneArr[1] : '',
      'nmchngeVO.nowUseTelno2': userPhoneArr ? userPhoneArr[2] : '',
      'nmchngeVO.nowUseTelno3': userPhoneArr ? userPhoneArr[3] : '',
      'nmchngeVO.nowUseHpno1': userMobileArr ? userMobileArr[1] : '',
      'nmchngeVO.nowUseHpno2': userMobileArr ? userMobileArr[2] : '',
      'nmchngeVO.nowUseHpno3': userMobileArr ? userMobileArr[3] : '',
      'nmchngeVO.nowUseChDt': userInfo.userChangeDate && userInfo.userChangeDate.replace(/-/g, '/')
    };
    
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...nameChangeData
    };
  }

  render() {
    const that = this;
//    that.getDescription();

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
                <label class="input-label-1"><span>명의변경 대상을 선택해 주세요.</span></label>
                <ul class="mw-opt mw-opt-2 row">
                  <li id="aGubun1" class="off">
                    <a class="btn"
                      onClick="${that.path}.toggleUIGubun('userCheck', '#aGubun1','#mw-box1')">
                    <span>사용자</span></a>
                  </li>
                  <li id="aGubun2" class="off">
                    <a class="btn"
                      onClick="${that.path}.toggleUIGubun('ownerCheck', '#aGubun2','#mw-box2')">
                    <span>소유자</span></a>
                  </li>
                </ul>
                <!-- <a href="#" class="btn btnSS"><span>체납확인</span></a> -->
                <p class="form-cmt form-cmt-1 pre-star tip-red row">고지서의 명의, 세입자 등의 명의 변경은 사용자를 선택하세요.</p>
                <p class="form-cmt form-cmt-1 pre-star tip-red row">소유자는 부동산 "등기사항증명서(구 등기부등본)" 상의 소유자명을 의미합니다.</p>
                <!--
                <p class="form-cmt form-cmt-1 pre-star tip-red row">고지서의 명의변경은 사용자를 선택합니다..</p>
                <p class="form-cmt form-cmt-1 pre-star tip-red row">세입자 등으로 명의변경은 사용자를 선택합니다.</p>
                -->
              </li>
              <li>
                <label for="form-mw22-tx" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>변경사유를 입력해 주세요.</span></label>
                <input onkeyup="${that.path}.handleReason(event)" onchange="${that.path}.handleReason(event)"
                  value="${that.state.reason}" maxlength="100"
                  type="text" id="form-mw22-tx" class="input-box input-w-0 only" placeholder="변경사유">
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
              <li class="select-input">
                <label for="cGubunType1" class="input-label"><span class="form-req"><span class="sr-only">필수</span>사용자명</span></label>
                <select id="cGubunType1" name="cGubunType1" onchange="${that.path}.handleUserGubun(event)" 
                  title="변경구분 선택" style="min-width:0px" class="input-box">
                  <option value="0" ${that.state.userInfo.gubun === '0' ? 'selected' : ''}>개인</option>
                  <option value="1" ${that.state.userInfo.gubun === '1' ? 'selected' : ''}>법인</option>
                </select>
                <label for="form-mw12-tx"><span class="sr-only">사용자명</span></label>
                <input onkeyup="${that.path}.handleUserName(event)" onchange="${that.path}.handleUserName(event)"
                  type="text" value="${that.state.userInfo.userName}"
                  id="form-mw12-tx" class="input-box input-w-2" placeholder="사용자 성명(회사명)">
              </li>
              <li ${that.state.userInfo.gubun === '0' ? 'hidden' : ''}>
                <label for="form-mw35-tx" class="input-label"><span>사업자등록번호</span></label>
                <input onkeyup="${that.path}.handleUserBusinessNumber(event)" 
                  onchange="${that.path}.handleUserBusinessNumber(event)"
                  value="${that.state.userInfo.userBusinessNumber}" maxlength="10"
                  type="text" id="form-mw35-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw45-tx" class="input-label"><span>전화번호</span></label>
                <input onkeyup="${that.path}.handleUserPhone(event)" onchange="${that.path}.handleUserPhone(event)"
                  value="${that.state.userInfo.userPhone}" maxlength="12"
                  type="text" id="form-mw45-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw36-tx" class="input-label"><span class="form-req"><span class="sr-only">필수</span>휴대전화</span></label>
                <input  onkeyup="${that.path}.handleUserMobile(event)" onchange="${that.path}.handleUserMobile(event)"
                  value="${that.state.userInfo.userMobile}" maxlength="11"
                  type="text" id="form-mw36-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <p class="form-cmt pre-star tip-blue">휴대전화번호가 없는 경우 전화번호를 입력해 주세요.</p>
              </li>
              <li>
                <label for="leakRepairDt" class="input-label"><span>변경일</span></label>
                <input type="date" onchange="${that.path}.handleDateForUser(event)" 
                  onkeyup="${that.path}.handleDateForUser(event)" min="1000-01-01" max="2100-12-31" maxlength="10"
                  value="${that.state.userInfo.userChangeDate}" id="leakRepairDt" name="leakRepairDt"
                  class="input-box input-w-2 datepicker hasDatepicker">
                <p class="form-cmt pre-star tip-red">실제 사용자 변경일을 입력해 주세요.</p>
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
              <li class="select-input">
                <label for="cGubunType2" class="input-label"><span class="form-req"><span class="sr-only">필수</span>소유자명</span></label>
                <select id="cGubunType2" name="cGubunType2" onchange="${that.path}.handleOwnerGubun(event)"
                  title="변경구분 선택" style="min-width:0px" class="input-box">
                  <option value="0" ${that.state.ownerInfo.gubun === '0' ? 'selected' : ''}>개인</option>
                  <option value="1" ${that.state.ownerInfo.gubun === '1' ? 'selected' : ''}>법인</option>
                </select>
                <label for="form-mw32-tx"><span class="sr-only">소유자명</span></label>
                <input onkeyup="${that.path}.handleOwnerName(event)" onchange="${that.path}.handleOwnerName(event)"
                  type="text" value="${that.state.ownerInfo.ownerName}"
                  id="form-mw32-tx" class="input-box input-w-2" placeholder="소유자 성명(회사명)">
                <p class="form-cmt pre-star tip-red">소유자는 부동산 "등기사항증명서(구 등기부등본)" 상의 소유자명을 의미합니다.</p>
              </li>
              <li ${that.state.ownerInfo.gubun === '0' ? 'hidden' : ''}>
                <label for="form-mw55-tx" class="input-label"><span>사업자등록번호</span></label>
                <input onkeyup="${that.path}.handleOwnerBusinessNumber(event)" 
                  onchange="${that.path}.handleOwnerBusinessNumber(event)"
                  value="${that.state.ownerInfo.ownerBusinessNumber}" maxlength="10"
                  type="text" id="form-mw55-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw65-tx" class="input-label"><span>전화번호</span></label>
                <input onkeyup="${that.path}.handleOwnerPhone(event)" onchange="${that.path}.handleOwnerPhone(event)"
                  value="${that.state.ownerInfo.ownerPhone}" maxlength="12"
                type="text" id="form-mw65-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw46-tx" class="input-label"><span class="form-req"><span class="sr-only">필수</span>휴대전화</span></label>
                <input onkeyup="${that.path}.handleOwnerMobile(event)" onchange="${that.path}.handleOwnerMobile(event)"
                  value="${that.state.ownerInfo.ownerMobile}" maxlength="11"
                type="text" id="form-mw46-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <p class="form-cmt pre-star tip-blue">휴대전화번호가없는 경우 전화번호를 입력해 주세요.</p>
              </li>
              <li><label for="leakRepairDt1" class="input-label"><span>변경일</span></label>
                <input type="date" onchange="${that.path}.handleDateForOwner(event)" maxlength="10" min="1000-01-01" max="2100-12-31"
                  value="${that.state.ownerInfo.ownerChangeDate}" id="leakRepairDt1" name="leakRepairDt1"
                  class="input-box input-w-2 datepicker hasDatepicker">
                <p class="form-cmt pre-star tip-red">실제 소유자 변경일을 입력해 주세요.</p>
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
    const minwonDesc = that.state.description;
    
    const desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="펼치기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div class="form-mw-box display-none row">
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>신청방법</span></div>
              <p>${minwonDesc.minwonHow}</p>
              <div class="tit-mw-h5 row"><span>처리기간</span></div>
              <p>${minwonDesc.minwonReqstDc}</p>
              <div class="tit-mw-h5 row"><span>처리부서</span></div>
              <p>${minwonDesc.minwonGde}</p>
              <div class="tit-mw-h5 row"><span>신청서류</span></div>
              <p>${minwonDesc.presentnPapers}</p>
              <div class="tit-mw-h5 row"><span>관련법규</span></div>
              <p>${minwonDesc.mtinspGde}</p>
              <div class="tit-mw-h5 row"><span>민원편람</span></div>
              <a href="${minwonDesc.minwonGudUrl}" target="_blank" class="txBlue" style="display:inline-block;float:right">민원편람 바로가기</a>
            </div>
          </div>
        </div><!-- // info-mw -->
      `;
    target.innerHTML = desc;
  }
}