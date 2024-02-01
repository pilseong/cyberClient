import CyberMinwon from '../infra/CyberMinwon';
import AthenticationInfo from '../components/AuthenticationInfo3';
import AthenticationInfo2 from '../components/AuthenticationInfo3';
import InfoPanel from '../components/InfoPanel';
import { fetch } from './../util/unity_resource'
import { getB19Agree } from './B19Agree';
import {
  addMW, removeMW, disableMW, 
  hideGubunMulti, showGubunMulti, saupsoInfo,
  setGubunMulti, showLayer, hideLayer, citizenAlert2,
  phoneNumberInputValidation, citizenAlert, citizenConfirm, maskingFnc, mobilePattern
} from './../util/uiux-common';
import { getDescription } from './B19Description';
import CyberMinwonStorage from '../infra/StorageData';
declare var gContextUrl: string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;
declare var fncCutByByte: (str: string, maxByte: number) => string;

export default class B19DetailPage {
  state: {
      minwonCd: string;
      parent: any;
      statusInfo: {
        emailStatus: boolean;
        smsStatus: boolean;
        paperStatus: boolean;
        appStatus: boolean;
        data: any;
      };
      emailCheck: boolean;
      msgCheck: boolean;
      paperCheck: boolean;            // 종이 고지 체크에 변동이 있는 경우 true로 생성
      agreeCheck: boolean;            // 약관 동의
      deleagtionAgree: boolean;       // 위임 동의
      msgRequestInfo: {
        gubun: string;                // 1: 신청, 2: 변경, 3: 해지
        msgType: string;              // 문자 전송 형식(알림톡, 문자) 여기서는 1 카카오, 2 문자
        destNumber: string;           // 문자 발송 대상 번호
      };
      emailRequestInfo: {
        gubun: string;                // 1: 신청, 2: 변경, 3: 해지 - 이메일 신규, 변경, 해지
        emailId: string;              // 신청 이메일 ID
        emailProvider: string;        // 이메일 공급자 주소
        emailProviderSelector: number | string; // 기본설정값이 필요하다.
      };      
      paperRequestInfo: {
        isRequest: string;             // Y면 신청, N이면 해지, '' 이면 변경 없음 
      };
      authRctInfo: {
        receiptName:string;
        receiptBirth:string;
        receiptJooName:string;
        receiptJooNumber:string;
        authType:string;
      };
      authRctInfo2: {
        receiptName:string;
        receiptBirth:string;
        receiptJooName:string;
        receiptJooNumber:string;
        authType:string;
      };
      isSubmitSuccessful: boolean;
      isBizAuthenticated:boolean;
      isBizAuthenticated2:boolean;
      submitResult: any;
      description: any;
      receiveIdNoSe: string;
      smsReceiveIdSe: string;
      renderBool: boolean;
  };
  statusInfoPanel: InfoPanel;
  authenticationInfo: AthenticationInfo;
  authenticationInfo2: AthenticationInfo2;
  path: string;
  
  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {
        emailStatus: false,
        smsStatus: false,
        paperStatus: false,
        appStatus: false,
        data: {}
      },
      emailCheck: false,
      msgCheck: false,
      paperCheck: false,
      agreeCheck: false,
      deleagtionAgree: false,       // 위임 동의
      isSubmitSuccessful: false,
      isBizAuthenticated: false,
      isBizAuthenticated2: false,
      submitResult: {},
      msgRequestInfo: {
        gubun: '',                // 1: 신청, 2: 변경, 3: 해지
        msgType: '',              // 문자 전송 형식(알림톡, 문자) 여기서는 1 카카오, 2 문자
        destNumber: '',            // 문자 발송 대상 번호
      },
      emailRequestInfo: {
        gubun: '',                // 이메일 신규, 변경, 해지
        emailId: '',              // 신청 이메일 ID
        emailProvider: '',        // 이메일 공급자 주소
        emailProviderSelector: 0, // 기본설정값이 필요하다.
      },      
      paperRequestInfo: {
        isRequest: ''             // Y면 신청, N이면 해지, '' 이면 변경 없음 
      },
      authRctInfo: {
        receiptName:'',
        receiptBirth:'',
        receiptJooName:'',
        receiptJooNumber:'',
        authType:''
      },
      authRctInfo2: {
        receiptName:'',
        receiptBirth:'',
        receiptJooName:'',
        receiptJooNumber:'',
        authType:''
      },
      description: {},
      receiveIdNoSe: "01",
      smsReceiveIdSe: "01",
      renderBool: false
    }
    this.authenticationInfo = new AthenticationInfo(this, this.setAuthInfoToApplicantInfo, "authentication");
    this.authenticationInfo2 = new AthenticationInfo2(this, this.setAuthInfoToApplicantInfo2, "authentication2");
    this.statusInfoPanel = new InfoPanel('', 
      this.state.parent, this, 'getStatusInfo');

    this.path = 'cyberMinwon.state.currentModule.state.currentPage';
  }
  
  // 인증 시 호출되는 콜백 함수 (SMS)
  setAuthInfoToApplicantInfo = (authInfo: any) => {
    citizenAlert("인증에 성공하였습니다.");
    const curPage = this.state.parent.state.page;
    let applyInfo = null;
    if(curPage === 0){
      applyInfo = this.state.parent.state.applicantInfo.state.applyInfo;
    }else{
      applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    }
    this.setState({
      ...this.state,
      authRctInfo: {
        ...this.state.authRctInfo,
        receiptName: authInfo.name, //인증 성명
        receiptBirth: authInfo.birth, //생년월일
        authType: authInfo.type //인증 구분
      },
      msgRequestInfo: {
      ...this.state.msgRequestInfo,
        destNumber: (authInfo.type === 'M' || authInfo.type === 'yessign' || authInfo.type === 'ezok') ? authInfo.mobile : applyInfo.applyMobile, //인증 전화번호 아이핀 인증은 신청인의 모바일
      }
    });
    
    $("#rctName").val(authInfo.name);
    $("#destNumber").val((authInfo.type === 'M' || authInfo.type === 'yessign' || authInfo.type === 'ezok') ? authInfo.mobile : applyInfo.applyMobile);
    $("#rctBirth").val(authInfo.birth);
    $("#destNumber").attr("disabled",true);
    $("#rctBirth").attr("disabled",true);
    
    if(!authInfo.birth){
      $("#rctBirth").removeAttr("disabled");
      $("#rctBirth").val("");
    }
    
    if(!authInfo.mobile || authInfo.type === 'I'){
      $("#destNumber").removeAttr("disabled");
      $("#rctBirth").removeAttr("disabled");
    }
  }
  
  // 인증 시 호출되는 콜백 함수(이메일)
  setAuthInfoToApplicantInfo2 = (authInfo: any) => {
    citizenAlert("인증에 성공하였습니다.");
    
    this.setState({
      ...this.state,
      authRctInfo2: {
        ...this.state.authRctInfo2,
        receiptName: authInfo.name, //인증 성명
        receiptBirth: authInfo.birth, //생년월일
        authType: authInfo.type //인증 구분
      }
    });
    
    $("#rctName2").val(authInfo.name);
    $("#rctBirth2").val(authInfo.birth);
    $("#rctBirth2").attr("disabled",true);
//    if(!authInfo.mobile){
//      $("#rctBirth2").val("");
//      $("#rctBirth2").removeAttr("disabled");
//    }
  }
  
  // 페이지 내부에 삽입될 InfoPanel 데이터 설정
  getStatusInfo() {
    const statusInfo = this.state.statusInfo.data;
    
    let smsStatus,emailStatus,appStatus,paperStatus = ''; 

    if (statusInfo) {
      smsStatus = statusInfo.smsFlag === 'Y' ? 
        `사용중 [ ${maskingFnc.telNo(statusInfo.smsReciveMtel,"*")}, ${statusInfo.smsNtceFormCd === '01' ? '알림톡' : '문자'} ]` : '미사용';
      emailStatus = statusInfo.emailFlag === 'Y' ? `사용중 [ ${maskingFnc.email(statusInfo.egojiEmail , "*", 3)} ]` : '미사용';
      appStatus = statusInfo.appFlag === 'Y' ? `사용중 [ ${statusInfo.payNm} ]` : '미사용';
      paperStatus = statusInfo.gojiMthCd === '01' || statusInfo.gojiMthCd === '03'  ? "사용중" : '미사용';
    }
    
    // noinfo로 설정한 이유는 info panel 내부 섹션이 없기 때문이다.
    return {
      viewUseStatusB19: {
        viewMessage: [statusInfo ? smsStatus : '미조회', '문자(알림톡 또는 SMS)'],
        viewEmail: [statusInfo ? emailStatus : '미조회', '전자우편(eMail)'],
        viewApp: [statusInfo ? appStatus : '미조회', '앱'],
        viewPaper: [statusInfo ? paperStatus : '미조회', '종이'],
        title: '사용현황'
      }
    }
  }
  
  setInitCheck() {
    //앞 단계 본인 인증 값 초기에 넣어주기 start
    const sessionData = CyberMinwonStorage.getStorageData();
    const authInfo = sessionData?sessionData.authenticationInfo.authInfo:'';
    const applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    let applyName = applyInfo.applyName;
    let applyMobile = applyInfo.applyMobile;
    let applyBirth = applyInfo.applyBirth?applyInfo.applyBirth : authInfo?authInfo.authNumber.substr(2,6):'';
    let applyEmailId = applyInfo.applyEmailId;
    let applyEmailProvider = applyInfo.applyEmailProvider;
    
    this.setState({
      ...this.state,
      authRctInfo: {
        ...this.state.authRctInfo,
        receiptName: applyName, //인증 성명
        receiptBirth: applyBirth, //생년월일
        authType: "01", //인증 구분
      },
      authRctInfo2: {
        ...this.state.authRctInfo2,
        receiptName: applyName,
        receiptBirth: applyBirth,
        authType: "01"
      },
      msgRequestInfo: {
        destNumber: applyMobile
      }
    });
    
    $("#rctName").val(applyName);
    $("#rctBirth").val(applyBirth);
    $("#destNumber").val(applyMobile);
    $("#rctName2").val(applyName);
    $("#rctBirth2").val(applyBirth);
    $("#emailId").val(applyEmailId);
    $("#emailProvider").val(applyEmailProvider);
    
    //앞 단계 본인 인증 값 초기에 넣어주기 end
    
    const that = this;
    let suyongaNum = '';
    if(sessionData){
      suyongaNum = sessionData.mkey;
    }else{
      suyongaNum = that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
    }
    const officeCd = that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.csOfficeCd
    let officeNm = ''
    let telNo = ''
    const saupso = saupsoInfo.find(ele => {ele.saupsoCd === officeCd});
    if(typeof saupso  === 'undefined') {
      
    }else{
      officeNm = saupso.fullName;
      telNo = saupso.telNo
    }
    var url = gContextUrl + "/citizen/common/getEmailNticInfo.do";
    var queryString = "mgrNo=" + suyongaNum;
    fetch('GET', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert(`서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.<br>관련문의는 다산콜 120 또는 ${officeNm} ${telNo}`).then(result => {
          if(result){
            cyberMinwon.state.currentModule.setPage(0)
          }
        });
        return;
      }
      
      const emailId = data.egojiEmail.substring(0, data.egojiEmail.indexOf('@'));
      const emailProvider = data.egojiEmail.substring(data.egojiEmail.indexOf('@')+1);
      $("#emailProviderSelector").val(emailProvider).prop("selected", true);
      let emailProviderSelector = $("#emailProviderSelector option").index($("#emailProviderSelector option:selected"));
      if(emailProviderSelector === -1){
        emailProviderSelector = 0;
      }
      
      const statusInfo = data;
      //let isRequest = ''; 

      // 종이 고지의 초기 값을 계산한다.
      // 전자고지가 모두 신청되어 있지 않을 경우는 종이고지 사용 중이라도 종이고지 초기값을 false로 한다.
      /*
      if (statusInfo.gojiMthCd === '01' || statusInfo.gojiMthCd === '03') {
        if (statusInfo.smsFlag === 'N' && statusInfo.emailFlag === 'N' && statusInfo.appFlag === 'N') {
          isRequest = 'Y';
        } else {
          isRequest = 'N';
        }
      } else {
        isRequest = 'Y';
      }
      */
      if (statusInfo.smsFlag === 'N') {
        statusInfo.smsReceiveIdNo = '';
        statusInfo.smsReceiveNm = '';
      }
      
      that.setState({
        ...that.state,
        statusInfo: {
          ...that.state.statusInfo,
          smsStatus: statusInfo.smsFlag === 'Y' ? true : false, 
          emailStatus: statusInfo.emailFlag === 'Y' ? true: false,
          paperStatus: statusInfo.gojiMthCd === '01' || statusInfo.gojiMthCd === '03' ? true : false,
          appStatus: statusInfo.appFlag === 'Y' ? true: false,
          data
        },
        emailRequestInfo: {
          ...that.state.emailRequestInfo,
          gubun: statusInfo.emailFlag === 'Y' ? '2': '1',
          emailId:emailId?emailId:applyEmailId,
          emailProvider:emailProvider?emailProvider:applyEmailProvider,
          emailProviderSelector,
        },
        receiveIdNoSe: !statusInfo.receiveIdSe? '01': statusInfo.receiveIdSe,
        smsReceiveIdSe: !statusInfo.smsReceiveIdSe? '01': statusInfo.smsReceiveIdSe,
        msgRequestInfo: {
          ...that.state.msgRequestInfo,
          gubun: statusInfo.smsFlag === 'Y' ? '2': '1',
          msgType: !data.smsNtceFormCd? '' : data.smsNtceFormCd,
        },
        /*
        paperRequestInfo: {
          isRequest
        },
        */
      });
    });
  }

  // 초기값 설정
  setInitValue() {
    const that = this;

    that.setState({
      ...that.state,
      statusInfo: {
        emailStatus: false,
        smsStatus: false,
        paperStatus: false,
        appStatus: false,
        data: {}
      },
      emailCheck: false,
      msgCheck: false,
      paperCheck: false,
      agreeCheck: false,
      deleagtionAgree: false,       // 위임 동의
      isBizAuthenticated: false,
      isBizAuthenticated2: false,
      msgRequestInfo: {
        gubun: '',                // 1: 신청, 2: 변경, 3: 해지
        msgType: '',              // 문자 전송 형식(알림톡, 문자) 여기서는 1 카카오, 2 문자
        destNumber: '',            // 문자 발송 대상 번호
      },
      emailRequestInfo: {
        gubun: '',                // 이메일 신규, 변경, 해지
        emailId: '',              // 신청 이메일 ID
        emailProvider: '',        // 이메일 공급자 주소
        emailProviderSelector: 0, // 기본설정값이 필요하다.
      },      
      paperRequestInfo: {
        isRequest: ''             // Y면 신청, N이면 해지, '' 이면 변경 없음 
      },
      authRctInfo: {
        receiptName:'',
        receiptBirth:'',
        receiptJooName:'',
        receiptJooNumber:'',
        authType:''
      },
      authRctInfo2: {
        receiptName:'',
        receiptBirth:'',
        receiptJooName:'',
        receiptJooNumber:'',
        authType:''
      },
    });
  }

  verify() {
    const that = this;
    
    if(!that.state.msgCheck && !that.state.emailCheck && !that.state.paperCheck){
      citizenAlert("고지 유형을 선택해 주세요");
      return false;
    }
    
    if(that.state.msgCheck && that.state.msgRequestInfo.gubun != '3'){
      if(!this.state.msgRequestInfo.msgType){
        citizenAlert("문자 전자고지 안내방법을 선택해 주세요");
        return false;
      }
      if(!that.state.msgRequestInfo.destNumber){
        citizenAlert("문자 발송 대상 번호를 입력해 주세요").then(result => {
          if(result){
            $("#destNumber").focus();
          }
        });
        return false;
      }
      if(mobilePattern.test(that.state.msgRequestInfo.destNumber) !== true){
        citizenAlert("문자 발송 대상 번호가 잘못된 형식입니다").then(result => {
          if(result){
            $("#destNumber").focus();
          }
        });
        return false;
      }
      
      if(that.state.smsReceiveIdSe === "01" || that.state.smsReceiveIdSe === "03"){ //SMS
        if(!that.state.authRctInfo.receiptBirth || that.state.authRctInfo.receiptBirth.length != 6){
          citizenAlert("생년월일 6자리를 입력해 주세요").then(result => {
            if(result){
              $("#rctBirth").focus();
            }
          });
          return false;
        }
      }else if(that.state.smsReceiveIdSe === "02"){
        if(!this.state.isBizAuthenticated){
          citizenAlert("사업자 인증을 해주세요");
          return false;
        }
      }
    }
    
    if(that.state.emailCheck && that.state.emailRequestInfo.gubun != '3'){
      if(!that.state.emailRequestInfo.emailId){
        citizenAlert("전자우편 아이디를 입력해 주세요").then(result => {
          if(result){
            $("#emailId").focus();
          }
        });
        return false;
      }
      if(!that.state.emailRequestInfo.emailProvider){
        citizenAlert("전자우편(eMail) 도메인 형식을 알맞게 입력해 주세요.").then(result => {
          if(result){
            $("#emailProvider").focus();
          }
        });
        return false;
      }
      if(that.state.receiveIdNoSe === "01" || that.state.receiveIdNoSe === "03"){ //이메일
        if(!that.state.authRctInfo2.receiptBirth || that.state.authRctInfo2.receiptBirth.length != 6){
          citizenAlert("생년월일 6자리를 입력해 주세요").then(result => {
            if(result){
              $("#rctBirth").focus();
            }
          });
          return false;
        }
      }else if(that.state.receiveIdNoSe === "02"){
        if(!this.state.isBizAuthenticated2){
          citizenAlert("사업자 인증을 해주세요");
          return false;
        }
      }
    }
    
    if(!that.state.statusInfo.smsStatus && !that.state.statusInfo.emailStatus && !that.state.statusInfo.appStatus && that.state.statusInfo.paperStatus){
      if(!that.state.msgCheck && !that.state.emailCheck && that.state.paperCheck){
        citizenAlert("문자, 전자우편 전자고지를 1개 이상 신청하여야 종이고지를 해지할 수 있습니다.");
        return false;
      }
    }
    
    if(!that.state.agreeCheck){
      citizenAlert("전자고지 이용약관에 동의해 주세요.");
      return false;
    }
    if(!that.state.deleagtionAgree){
      citizenAlert("전자고지 신청 위임사항에 동의해 주세요.");
      return false;
    }
    
    return true;
  }
  
  // 명의 변경 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyEmailNtic.do";
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

      that.setState({
        ...that.state,
        isSubmitSuccessful: data.resultCd === 'Y' ? true : false,
        submitResult: data
      });

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');
    });
    
    that.state.renderBool = false;
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    // 사실 성공이 아니라 정상적으로 예외 처리가 가능한 경우를 말한다.
    const resultData = this.state.submitResult;
    const resultList = resultData.errorMsg.split(',');
    if (this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: '전자 고지 신청 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
        desc: ['정상적으로 신청되었습니다.', '신청결과'],
//        desc1: [resultList[1], '안내']
      }
    // 실패라기 보다는 예외로 처리할 수 없는 경우를 말한다.
    } else {
      infoData['noinfo'] = {
//        title: '전자 고지 신청 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo ? resultData.data.receiptNo : '-', '접수번호'],        
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
        desc: [`[${resultList[0]}]로 비정상 처리 되었습니다.<br>아래 수도사업소 또는 서울아리수본부에 문의해 주십시오.`, '신청결과'],
//        cause: [this.state.submitResult.errorMsg.length > 200 ? "시스템 내부에서 오류가 발생했습니다." : this.state.submitResult.errorMsg, '사유']
      };
    }
    return infoData;
  }
  
  getSmsResult(){
    const that = this;
    const emailRequestInfo = this.state.emailRequestInfo;
    const msgRequestInfo = this.state.msgRequestInfo;
    const paperRequestInfo = this.state.paperRequestInfo;
    const statusInfo = this.state.statusInfo;
    const applicationPage = that.state.parent.state.applicationPage;
    const applyInfo = applicationPage.applicantInfo.state.applyInfo;
//    const requestInfo = that.state.requestInfo;
    let smsTemplate = ``;
    const resultData = that.state.submitResult.data;
    const status = resultData.status;
    const mkey = status.mgrNo;
    const address = applicationPage.suyongaInfo.state.suyongaInfo.suyongaAddress;
    
    const emailCheck = status.emailFlag === 'Y'?true:false;
    const egojiEmail = status.egojiEmail;
    const receiveNm = status.receiveNm;
    
    const msgCheck = status.smsFlag === 'Y'?true:false;
    const smsReciveMtel = status.smsReciveMtel;
    const smsReceiveNm = status.smsReceiveNm;
    
    const paperCheck = that.state.paperCheck;

    let gojiMthCd = status.gojiMthCd;
    
    let dp1, dp2, dp3, dp4, dp5 = ``;
    if(gojiMthCd === '01'){
      dp1 = `(종이고지)`
      dp5 = '종이고지 발행'
    }else if(gojiMthCd === '02'){
      dp1 = `(전자고지)`
      dp5 = '종이고지 미발행'
    }else{
      dp1 = `(전자고지+종이고지)`
      dp5 = '종이고지 발행'
    }
    dp2 = emailCheck? `${maskingFnc.email(egojiEmail,'*',4)}(${maskingFnc.name(receiveNm,"*")})` : ``;
    dp3 = msgCheck? `${maskingFnc.telNo(smsReciveMtel,'*')}(${maskingFnc.name(smsReceiveNm,"*")})` : ``
    dp4 = status.appFlag === 'Y'? status.payNm?status.payNm:`모바일 앱` : ``;
    
    let curStatus = `${dp1}, `;
    curStatus += `${dp2?`${dp2}, `:``}${dp3?` ${dp3}, `:``}${dp4?` ${dp4}, `:``}`;
    curStatus += ` ${dp5}`;
    let saupsoCdR = ""
    
    if(resultData){
      saupsoCdR = resultData.receiptNo.substring(0,3);
    }
    const appNapgi = resultData.appNapgi.replaceAll('.','');
    let officeNm = '';
    const saupso = saupsoInfo.find(ele => {ele.saupsoCd === saupsoCdR});
    if(typeof saupso  === 'undefined') {
      
    }else{
      officeNm = saupso.fullName;
    }
//    const gubun = that.state.requestInfo.gubun === '1' ? '신청' : '해지';
    smsTemplate += `
      <p class="form-info-box-gol"><전자고지 민원 처리결과 안내><br>
      고객번호 : ${mkey}<br>
      주소 : ${address}<br>
      신청인 : ${maskingFnc.name(applyInfo.applyName,"*")}<br>
      전자고지 현황 : ${curStatus}<br><br>
      위 수도에 대한 전자고지 민원이 정상적으로 처리되어 ${appNapgi.substring(0,4)}년 ${appNapgi.substring(4,6)}월 납기분부터 고객전용입금계좌, ARS 등 편한 방법을 선택하셔서 직접 납부하시기 바랍니다.<br><br><br>
      `;
      
    smsTemplate += `
      ※ 전자고지 이용안내 ( 반드시 읽어주시기 바랍니다. )<br>
       1. 이사 등으로 사용자(납부자)가 변경될 경우 전자고지를 해지하시기 바랍니다. 모바일 앱 전자고지 해지가 필요한 경우 가입되어 있는 간편결제 앱에서 해지해 주시기 바랍니다.<br>
       2. 이메일 주소나 휴대전화 번호가 변경 또는 해지된 경우 전자고지 변경 또는 해지를 신청해 주시기 바랍니다. 신청하지 않아 발생하는 문제는 수도사업소에서 책임지지 않습니다.<br>
       3. 이메일 운영사 또는 통신사의 사정으로 청구서가 송달되지 않은 경우 수도사업소에서 처리하기 어려운 점 양해바랍니다.<br>
       4. 납기월 20일전까지 이메일, 휴대전화 또는 모바일 전자고지로 청구서를 송달받지 못한 경우 개별적으로 고지서 송달을 요청해 주시기 바랍니다.<br>
       5. 전자고지 요금감면은 상수도 요금부과액의 1%이며(최소 200원에서 최대 1,000원의 범위 이내), 종이고지서 발행을 병행 신청하신 경우에는 감면되지 않습니다.<br>
       6. 허위내용 발견, 신청 오류 등 직권해지가 필요한 경우 수도사업소에서 직권으로 해지할 수 있습니다.<br>
      ${officeNm}
      </p>
    `;
    return smsTemplate;
  }

  // 서버로 보낼 데이터 조합
  getQueryString() {
    const that = this;
    const emailRequestInfo = this.state.emailRequestInfo;
    const msgRequestInfo = this.state.msgRequestInfo;
    const paperRequestInfo = this.state.paperRequestInfo;
    const statusInfo = this.state.statusInfo.data;
    const statusInfoThis = this.state.statusInfo;
    const authRctInfo = this.state.authRctInfo;
    const authRctInfo2 = this.state.authRctInfo2;
    const suyongaInfo = this.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo;

    const emailAddress = emailRequestInfo.emailId + '@' + emailRequestInfo.emailProvider;
    
    let receiptName = '';
    if(this.state.receiveIdNoSe === '02'){
      receiptName = authRctInfo2.receiptJooName;
    }else if(this.state.receiveIdNoSe === '01' || this.state.receiveIdNoSe === '03'){
      receiptName = authRctInfo2.receiptName;
    }
    
    let smsReceiveNm = '';
    if(this.state.smsReceiveIdSe === '02'){
      smsReceiveNm = authRctInfo.receiptJooName;
    }else if(this.state.smsReceiveIdSe === '01' || this.state.smsReceiveIdSe === '03'){
      smsReceiveNm = authRctInfo.receiptName;
    }
    let pgojiYn = this.state.paperCheck ? (this.state.statusInfo.paperStatus?'N':'Y'): (this.state.statusInfo.paperStatus?'Y':'N')               // 종이고지 신청 구분
    //앱 고지 있는 경우
    if(statusInfoThis.appStatus){
      
      if(!that.state.msgCheck && !that.state.emailCheck && that.state.paperCheck){
        pgojiYn = statusInfoThis.paperStatus?'N':'Y'
      }
    }else{
    //앱 고지 없는 경우
      //전자고지(문자, 이메일) 해지이고 앱 신청이 안되어 있는 경우 종이 고지 신청을 안하더라도 자동으로 종이고지 신청
      if( (
           (that.state.msgCheck && msgRequestInfo.gubun === "3" && !statusInfoThis.emailStatus && !that.state.emailCheck) 
        || (that.state.emailCheck && emailRequestInfo.gubun === "3" && !statusInfoThis.smsStatus && !that.state.msgCheck)
        || (that.state.msgCheck && that.state.emailCheck && msgRequestInfo.gubun === "3" && emailRequestInfo.gubun === "3")
          )
        ){
        pgojiYn = 'Y';
      }else if((
        
           (that.state.msgCheck && msgRequestInfo.gubun === "1" && !statusInfoThis.emailStatus && !that.state.emailCheck) 
        || (that.state.emailCheck && emailRequestInfo.gubun === "1" && !statusInfoThis.smsStatus && !that.state.msgCheck)
        || (that.state.msgCheck && that.state.emailCheck && msgRequestInfo.gubun === "1" && emailRequestInfo.gubun === "1")
        )
        && ((statusInfoThis.paperStatus && !that.state.paperCheck)//종이 발행 & 변경 없음
        || (!statusInfoThis.paperStatus && !that.state.paperCheck)//종이 미발행 & 변경 없음
        )
      ){
        pgojiYn = 'N';
      }
      
    }
    let eBillData = {
      'emailNticVO.mkey'            : suyongaInfo.mkey,
      'emailNticVO.owner'            : suyongaInfo.suyongaName,
      'emailNticVO.eteGojiYn'       : statusInfo.emailFlag,                     // 기존 이메일 고지 여부    
      'emailNticVO.preAppGojiYn'    : statusInfo.appFlag,                       // 기존 앱고지 여부  
      'emailNticVO.preSmsGojiYn'    : statusInfo.smsFlag,                       // 기존 문자 고지 여부
      'emailNticVO.paperMethod'    : this.state.paperCheck?'Y':'N',                    // 종이고지 신규 신청여부
      'emailNticVO.pgojiYn'         : pgojiYn,               // 종이고지 신청 구분     
//      'emailNticVO.pgojiYn'         : this.state.paperCheck ? (this.state.statusInfo.paperStatus?'N':'Y'): (this.state.statusInfo.paperStatus?'Y':'N'),               // 종이고지 신청 구분     
      'emailNticVO.trmsAgreYn'      : this.state.agreeCheck ? 'Y' : 'N',        // 이용약관 동의
      'emailNticVO.deleagtionAgree' : this.state.deleagtionAgree ? 'Y' : 'N',   // 위임 동의
      'emailNticVO.applyerGbn'      : this.state.receiveIdNoSe,                 // 신청 구분 01: 개인, 02: 법인, 03:외국인
      'emailNticVO.certCd'         : authRctInfo2.authType,                 // 인증구분
    };
    
    // 이메일 고지의 변경이 있을 경우
    if (this.state.emailCheck) {
      let emailParams = {
        // 이메일고지 신청 상태
        'emailNticVO.gojiYn'          : emailRequestInfo.gubun === '1' ?  'Y' : emailRequestInfo.gubun === '2' ? 'C' : 'N',
        'emailNticVO.eteGojiEmail'    : emailRequestInfo.gubun !== '3' ? emailAddress : statusInfo.egojiEmail,   // 이메일 고지 신규 이메일
        'emailNticVO.method'          : emailRequestInfo.gubun,       // 이메일 고지신청 구분 - emailStatusCd 매칭               
        'emailNticVO.receiverNm'      : emailRequestInfo.gubun !== '3' ? receiptName : statusInfo.receiveNm, // 이메일수신자 이름
        'emailNticVO.receiverBirth'   : emailRequestInfo.gubun !== '3' ? authRctInfo2.receiptBirth : statusInfo.receiveIdSe !== '02'? statusInfo.receiveIdNo : '', // 이메일수신자 생년월일          
        'emailNticVO.receiveIdNoSe'   : emailRequestInfo.gubun !== '3' ? this.state.receiveIdNoSe : statusInfo.receiveIdSe,                 // 이메일수신자 구분 01: 개인, 02: 법인, 03:외국인   
        'emailNticVO.saNo'            : emailRequestInfo.gubun !== '3' ? authRctInfo2.receiptJooNumber : statusInfo.receiveIdSe === '02'? statusInfo.receiveIdNo : '',                 // 사업자등록번호
      }
      
      eBillData = {
        ...eBillData,
        ...emailParams
      };
    }
    
    // 문자고지의 변경이 있을 경우
    if (this.state.msgCheck) {
      let smsParams = {
        // 문자고지 신청 상태
        'emailNticVO.smsGojiYn'       : msgRequestInfo.gubun === '1' ?  'Y' : msgRequestInfo.gubun === '2' ? 'C' : 'N',
        // 문자고지방법 01: 알림톡, 04: LMS
        'emailNticVO.smsFormCd'       : msgRequestInfo.gubun !== '3' ? msgRequestInfo.msgType : statusInfo.smsNtceFormCd,
        // 문자고지 수신 번호
        'emailNticVO.chgGojiMobile'   : msgRequestInfo.gubun !== '3' ? msgRequestInfo.destNumber : statusInfo.smsReciveMtel,
        'emailNticVO.smsMethod'       : msgRequestInfo.gubun,         // 문자 고지신청 구분 - smsStatusCd 매칭
        'emailNticVO.smsReceiveNm'    : msgRequestInfo.gubun !== '3' ? smsReceiveNm : statusInfo.smsReceiveNm,   // 문자수신자 이름
        'emailNticVO.smsReceiverBirth': msgRequestInfo.gubun !== '3' ? authRctInfo.receiptBirth : statusInfo.smsReceiveIdSe !== '02'? statusInfo.smsReceiveIdNo : '',   // 문자수신자 생년월일          
        'emailNticVO.smsReceiveIdSe'  : msgRequestInfo.gubun !== '3' ? this.state.smsReceiveIdSe : statusInfo.smsReceiveIdSe,                // 문자수신자 구분 01: 개인, 02: 법인, 03:외국인
        'emailNticVO.smsSaNo'         : msgRequestInfo.gubun !== '3' ? authRctInfo.receiptJooNumber : statusInfo.smsReceiveIdSe === '02'? statusInfo.smsReceiveIdNo : '',                 // 사업자등록번호
      }
      
      eBillData = {
        ...eBillData,
        ...smsParams
      };      
    }
    
//참고용으로 삭제 하지 않았다.
//    const temp = {
//      ...eBillData,
//      // 통합 민원 데이터 셋 바인딩
//      'emailNticVO.mkey'            : suyongaInfo.mkey,
//      'emailNticVO.eteGojiEmail'    : emailAddress,                 // 신청하는 이메일 주소 reqerEmail 매칭
//      'emailNticVO.egojiEmail'      : statusInfo.egojiEmail,        // 미사용, 기존 신청된 이메일 주소
//      'emailNticVO.chgGojiMobile'   : msgRequestInfo.destNumber,    // 문자고지 신규 수신번호
//      'emailNticVO.smsReciveMtel'   : statusInfo.smsReciveMtel,     // 미사용, 기존 문자 수신 번호
//      'emailNticVO.method'          : emailRequestInfo.gubun,       // 이메일 고지신청 구분 - emailStatusCd 매칭 
//      'emailNticVO.smsMethod'       : msgRequestInfo.gubun,         // 문자 고지신청 구분 - smsStatusCd 매칭
//      'emailNticVO.gojiMthCd'       : statusInfo.gojiMthCd,         // 기존 상태 정보 01: 종이 02: 전자 03: 종이 + 전자
//      'emailNticVO.eteGojiYn'       : statusInfo.emailFlag,         // 기존 이메일 고지 여부
//      'emailNticVO.preSmsGojiYn'    : statusInfo.smsFlag,           // 기존 문자 고지 여부
//      'emailNticVO.owner'           : authInfo.authName,            // 미사용
//      'emailNticVO.pgojiYn'         : paperRequestInfo.isRequest ? 'Y' : 'N',  // 종이고지 신청 구분
//      'emailNticVO.reqerIdNoSe'     : '',                           // 이메일 고지 개인,외국인,법인 구분
//      'emailNticVO.reqSmsMobile'    : '010',                        // 문자수신 번호 - 서버에서 사용하지 않는다.
//      'emailNticVO.preAppGojiYn'    : statusInfo.appFlag,           // 기존 앱고지 여부  
//      'emailNticVO.smsNtceFormCd'   : '01',                         // 미사용, 대신 smsFormCd 사용 문자고지방법 01: 알림톡, 04: LMS
//      'emailNticVO.smsGojiYn'       : 'N',                          // 문자고지 신청 상태
//      'emailNticVO.smsReceiveNm'    : '%EA%B0%95%EB%8F%99%EC%9B%90',// 문자수신자 이름
//      'emailNticVO.smsReceiveIdSe'  : '01',                         // 문자수신자 구분 1: 개인, 2: 법인, 3:외국인
//      'emailNticVO.smsReceiverBirth': '791018',                     // 문자수신자 생년월일
//      'emailNticVO.smsSaNo'         : '',                           // 문자수신자의 사업자번호
//      'emailNticVO.receiverNm'      : '',                           // 이메일수신자 이름
//      'emailNticVO.receiverBirth'   : '',                           // 이메일수신 생년월일
//      'emailNticVO.saNo'            : '',                           // 이메일수신자의 사업자번호
//    };

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...eBillData
    };
  }  
  
    // 신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun: string, id: string, uiBox: any) {
    if (gubun === 'emailCheck') {
      this.setState({
        ...this.state,
        emailCheck: !this.state[gubun]
      });
    } else if (gubun === 'msgCheck') {
      this.setState({
        ...this.state,
        msgCheck: !this.state[gubun]
      });
    }else if(gubun === 'paperCheck'){
      this.setState({
        ...this.state,
        paperCheck: !this.state[gubun]
      });
    }
    setGubunMulti(id, uiBox);
    this.render();
  }

  // 민원안내, 절차 정보를 서버에 요청한다. 
  getDescription(data: any) {
    const that = this;
    that.setState({
      ...that.state,
      description: data 
    });
  }

  // 문자 고지 신청 구분 선택
  handleMsgRequestTypeClick(gubun: string) {
    let gubunVal = this.state.msgRequestInfo.gubun;
    if(gubunVal === "1" && (gubun === "2" || gubun === "3")){
      return false;
    }else if(gubun === "1" && (gubunVal === "2" || gubunVal === "3")){
      return false;
    }
    this.drawMsgRequestUI(gubun);
    
    this.setState({
      ...this.state,
      msgRequestInfo: {
        ...this.state.msgRequestInfo,
        gubun: gubun
      }
    });
  }
  
  handleBizGubunSelector(e: any) {
    this.setState({
      ...this.state,
      smsReceiveIdSe: e.target.value
    });
    if(e.target.value === "01" || e.target.value === "03"){ //개인 or 외국인
      $("#authPerArea").show();
      $("#authJooArea").hide();
      $("#destNumber").attr("disabled",true);
    }else{
      $("#authPerArea").hide();
      $("#authJooArea").show();
      $("#destNumber").removeAttr("disabled");
    }
  }
  
  handleBizGubunSelector2(e: any) {
    this.setState({
      ...this.state,
      receiveIdNoSe: e.target.value
    });
    if(e.target.value === "01" || e.target.value === "03"){ //개인 or 외국인
      $("#authPerArea2").show();
      $("#authJooArea2").hide();
    }else{
      $("#authPerArea2").hide();
      $("#authJooArea2").show();
    }
  }
  
  handleBizAuthentication(gubun:string){
    const that = this;
    let receiptJooName = "";
    let receiptJooNumber = "";
    if(gubun === "2"){
      receiptJooName = this.state.authRctInfo2.receiptJooName;
      receiptJooNumber = this.state.authRctInfo2.receiptJooNumber;
      if(!receiptJooName){
        citizenAlert("전자우편 고지 사업자명을 입력해 주세요.");
        $("#rctJooName2").focus();
        return false;
      }else if(!receiptJooNumber){
        citizenAlert("전자우편 고지 사업자번호를 입력해 주세요.");
        $("#rctJooNumber2").focus();
        return false;
      }
    }else{
      receiptJooName = this.state.authRctInfo.receiptJooName;
      receiptJooNumber = this.state.authRctInfo.receiptJooNumber;
      if(!receiptJooName){
        citizenAlert("문자고지 사업자명을 입력해 주세요.");
        $("#rctJooName").focus();
        return false;
      }else if(!receiptJooNumber){
        citizenAlert("문자고지 사업자번호를 입력해 주세요.");
        $("#rctJooNumber").focus();
        return false;
      }
    }
    
    let queryString = {
      'compName': receiptJooName,
      'compCode': receiptJooNumber,
    };
    let url = "/basic/auth/corpCheck.do";
    fetch('POST', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }
      
      if(gubun === "2"){
        if(data.resultCd == "1"){
          citizenAlert("법인 인증에 성공하였습니다.");
          that.state.isBizAuthenticated2 = true;
          $("#biz2").removeClass("btnTypeC");
          $("#biz2").addClass("btnTypeC:hover");
          $("#biz2").html("인증완료");
          $("#rctJooName2").attr("disabled",true);
          $("#rctJooNumber2").attr("disabled",true);
        } else {
            citizenAlert("법인 인증에 실패하였습니다. 다시 확인해주시기 바랍니다.");
            $("#biz2").removeClass("btnTypeC:hover");
            $("#biz2").addClass("btnTypeC");
            $("#biz2").html("인증하기");
        }
      }else{
        if(data.resultCd == "1"){
          citizenAlert("법인 인증에 성공하였습니다.");
          that.state.isBizAuthenticated = true;
          $("#biz").removeClass("btnTypeC");
          $("#biz").addClass("btnTypeC:hover");
          $("#biz").html("인증완료");
          $("#rctJooName").attr("disabled",true);
          $("#rctJooNumber").attr("disabled",true);
        } else {
            citizenAlert("법인 인증에 실패하였습니다. 다시 확인해주시기 바랍니다.");
            $("#biz").removeClass("btnTypeC:hover");
            $("#biz").addClass("btnTypeC");
            $("#biz").html("인증하기");
        }
      }
      
    });
  }
  
  drawMsgRequestUI(gubun: string) {
    // 신규
    if (gubun === "1") {
      addMW("#bGubun1");
      disableMW("#bGubun2");
      disableMW("#bGubun3");
      $('#bGubun2').attr("disabled",true);
      $('#bGubun3').attr("disabled",true);
      addMW("#fGubun1");
      addMW("#gGubun1");
    // 변경
    } else if (gubun === "2") {
      disableMW("#bGubun1");
      addMW("#bGubun2");
      removeMW("#bGubun3");
      $('#bGubun1').attr("disabled",true);
      $('#msgMethod').show();
      $('#rcvMethod').show();
      $(".msgTermination").removeClass("display-none");
      $('#destNumber').attr("disabled",false);
    // 해지
    } else if (gubun === "3") {
      disableMW("#bGubun1");
      removeMW("#bGubun2");
      addMW("#bGubun3");
      $('#bGubun1').attr("disabled",true);
      $('#msgMethod').hide();
      $('#rcvMethod').hide();
      $(".msgTermination").addClass("display-none");
      // 해지 시 다시 신청되어 있는 문자번호로 초기화 한다.
      $('#destNumber').val(this.state.statusInfo!.data.smsReciveMtel);
      $('#destNumber').attr("disabled",true);
      
    }
  }
  
  drawPaperRequestUI(gubun: string) {
    // 신규
    if (gubun === "1") {
      addMW("#eGubun1");
      disableMW("#eGubun3");
      $('#eGubun3').attr("disabled",true);
    } else if (gubun === "3") {
      disableMW("#eGubun1");
      addMW("#eGubun3");
      $('#eGubun1').attr("disabled",true);
    }
  }

  drawMsgTypeUI(type: string) {
    // 알림톡
    if (type === "01") {
      addMW("#cGubun1");
      removeMW("#cGubun2");
    // 문자
    } else if (type === "04") {
      addMW("#cGubun2");
      removeMW("#cGubun1");
    }
  }
  
  drawRcvTypeUI(type: string, gubun: string) {
    // 개인
    if (type === "01") {
      addMW(`#${gubun}1`);
      removeMW(`#${gubun}2`);
    // 법인
    } else if (type === "02") {
      addMW(`#${gubun}2`);
      removeMW(`#${gubun}1`);
    }
  }
  
  handleChangeRctJooName(e: any) { //sms 사업자명
    this.setState({
      ...this.state,
      authRctInfo: {
        ...this.state.authRctInfo,
        receiptJooName: fncCutByByte(e.target.value, 100)
      }
    });
    e.target.value = fncCutByByte(this.state.authRctInfo.receiptJooName, 100);
  }
  
  handleChangeRctJooName2(e: any) { //이메일 사업자명
    this.setState({
      ...this.state,
      authRctInfo2: {
        ...this.state.authRctInfo2,
        receiptJooName: fncCutByByte(e.target.value, 100)
      }
    });
    e.target.value = fncCutByByte(this.state.authRctInfo2.receiptJooName, 100);
  }
  
  handleChangeRctJooNumber(e: any) { //sms 사업자번호
    let val = e.target.value.replace(/[^0-9]/g, "").substring(0, 10)
    this.setState({
      ...this.state,
      authRctInfo: {
        ...this.state.authRctInfo,
        receiptJooNumber: val
      }
    });
    e.target.value = val;
  }
  
  handleChangeRctJooNumber2(e: any) { //이메일 사업자번호
    let val = e.target.value.replace(/[^0-9]/g, "").substring(0, 10)
    this.setState({
      ...this.state,
      authRctInfo2: {
        ...this.state.authRctInfo2,
        receiptJooNumber: val
      }
    });
    e.target.value = val;
  }
  
  handleChangeRctBirth(e: any) { //sms 생년월일
    let val = e.target.value.replace(/[^0-9]/g, "").substring(0, 10)
    this.setState({
      ...this.state,
      authRctInfo: {
        ...this.state.authRctInfo,
        receiptBirth: val
      }
    });
    e.target.value = val;
  }
  
  handleChangeRctBirth2(e: any) { //이메일 생년월일
    let val = e.target.value.replace(/[^0-9]/g, "").substring(0, 10)
    this.setState({
      ...this.state,
      authRctInfo2: {
        ...this.state.authRctInfo2,
        receiptBirth: val
      }
    });
    e.target.value = val;
  }
  
  handleMsgTypeClick(type: string) {
    // 클릭된 버튼을 다시 클릭한 경우
    if (this.state.msgRequestInfo.msgType === type) {
      removeMW("#cGubun" + type);
      type = '';
    } else {
      this.drawMsgTypeUI(type);
    }

    this.setState({
      ...this.state,
      msgRequestInfo: {
        ...this.state.msgRequestInfo,
        msgType: type
      }
    });
  }
  
  handleRcvTypeClick(type: string){
    this.setState({
      ...this.state,
      smsReceiveIdSe: type
    });
    this.drawRcvTypeUI(type, 'fGubun');
    if(type === '01'){
      $("#authPerArea").show();
      $("#authJooArea").hide();
//      $("#destNumber").attr("disabled",true);
    }else{
      $("#authPerArea").hide();
      $("#authJooArea").show();
      $("#destNumber1").removeAttr("disabled");
    }
  }
  
  handleRcvTypeClick2(type: string){
    this.setState({
      ...this.state,
      receiveIdNoSe: type
    });
    this.drawRcvTypeUI(type, 'gGubun');
    if(type === '01'){
      $("#authPerArea2").show();
      $("#authJooArea2").hide();
    }else{
      $("#authPerArea2").hide();
      $("#authJooArea2").show();
    }
  }
  
  // 이메일 고지 신청 구분 선택
  handleEmailRequestTypeClick(gubun: string) {
    let gubunVal = this.state.emailRequestInfo.gubun;
    if(gubunVal === "1" && (gubun === "2" || gubun === "3")){
      return false;
    }else if(gubun === "1" && (gubunVal === "2" || gubunVal === "3")){
      return false;
    }
    
    this.drawEmailRequestUI(gubun);

    this.setState({
      ...this.state,
      emailRequestInfo: {
        ...this.state.emailRequestInfo,
        gubun: gubun
      }
    })
  }
  
  drawEmailRequestUI(gubun: string) {
    // 신규
    if (gubun === "1") {
      addMW("#dGubun1");
      disableMW("#dGubun2");
      disableMW("#dGubun3");
    // 변경
    } else if (gubun === "2") {
      disableMW("#dGubun1");
      addMW("#dGubun2");
      removeMW("#dGubun3");
      $(".emailTermination").removeClass("display-none");
      $('#emailId').attr("disabled",false);
      $('#emailProvider').attr("disabled",false);
      $('#emailProviderSelector').attr("disabled",false);
    // 해지
    } else if (gubun === "3") {
      const statusInfo = this.state.statusInfo.data;
      const emailId = statusInfo.egojiEmail.substring(0, statusInfo.egojiEmail.indexOf('@'));
      const emailProvider = statusInfo.egojiEmail.substring(statusInfo.egojiEmail.indexOf('@')+1);
      $(".emailTermination").addClass("display-none");
      addMW("#dGubun3");
      disableMW("#dGubun1");
      removeMW("#dGubun2");
      
      // 해지 지정 시 수정전에 등록된 이메일로 초기화한다.
      $('#emailId').val(emailId);
      $('#emailProvider').val(emailProvider);
      
      $('#emailId').attr("disabled",true);
      $('#emailProvider').attr("disabled",true);
      $('#emailProviderSelector').attr("disabled",true);      
      
      $('#emailRctName').val(this.state.statusInfo!.data.receiveNm);
      $('#emailrctBirth').val(this.state.statusInfo!.data.receiveIdNo);      
      
    }    
  }  
  
  setState(nextState: any) {
    if (this.state !== nextState)
      this.state = nextState;
  }
  
  // 이메일 id 입력 연동
  handleEmailId(e: any) {
    this.setState({
      ...this.state,
      emailRequestInfo: {
        ...this.state.emailRequestInfo,
        emailId: e.target.value.replace(/[^a-z0-9.-_+]/gi,'').substring(0, 30)
      }
    });
    e.target.value = this.state.emailRequestInfo.emailId.substring(0, 30);
  }
  
  // 이메일 공급자를 리스트에서 선택할 경우
  handleEmailProviderSelector(e: any) {
    this.setState({
      ...this.state,
      emailRequestInfo: {
        ...this.state.emailRequestInfo,
        // 공급자의 domain을 공급자로 저장한다.
        emailProvider: e.target.value,
        // 선택한 이메일 공급자의 index를 저장한다.
        emailProviderSelector: e.target.options.selectedIndex
      }
    });
    this.render();

    var $emailProviderSelector = document.getElementById("emailProviderSelector") as HTMLSelectElement;
    if (typeof this.state.emailRequestInfo.emailProviderSelector === 'number')
      $emailProviderSelector.options[this.state.emailRequestInfo.emailProviderSelector].selected = true;
  }
  
  // 휴대번호
  handleUserMobile(e: any) {
    this.setState({
      ...this.state,
      msgRequestInfo: {
        ...this.state.msgRequestInfo,
        destNumber: e.target.value.replace(/[^0-9]/g, "").substring(0, 11)
      }
    });
    e.target.value = this.state.msgRequestInfo.destNumber.replace(/[^0-9]/g, "").substring(0, 11);
    phoneNumberInputValidation(e.target, 11, mobilePattern);
  }
  
  // 이메일 공급자를 입력하는 루틴
  handleEmailProvider(e: any) {
    // 상태를 변경하기 전에 선택된 select 박스를 해지해 준다.
    if (this.state.emailRequestInfo.emailProviderSelector !== '') {
      const $emailProviderSelector = document.getElementById("emailProviderSelector") as HTMLSelectElement;
      if (typeof this.state.emailRequestInfo.emailProviderSelector === 'number')
        $emailProviderSelector.options[this.state.emailRequestInfo.emailProviderSelector].selected = false;
    }

    this.setState({
      ...this.state,
      emailRequestInfo: {
        ...this.state.emailRequestInfo,
        emailProvider: e.target.value.replace(/[^a-z0-9.-]/gi,'').substring(0, 30),
        emailProviderSelector: ''
      }
    });
    e.target.value = this.state.emailRequestInfo.emailProvider;
  }
  
  getViewInfo() {
    const infoData: any = {};
    const msgRequestInfo = this.state.msgRequestInfo;
    
    let msgReqDesc = '';
    if (this.state.msgCheck) {
      if (this.state.msgRequestInfo.gubun === '1') {
        msgReqDesc = '신규';
      } else if (this.state.msgRequestInfo.gubun === '2') {
        msgReqDesc = '변경';
      } else if (this.state.msgRequestInfo.gubun === '3') {
        msgReqDesc = '해지';
      } else {
        msgReqDesc = '변경없음';
      }
    }

    // 변동이 있을 때만 작성한다.
    if (this.state.msgCheck) {
      if(this.state.msgRequestInfo.gubun === '3'){
        infoData['msgInfo'] = {
          title: '문자 고지 입력정보',
          gubun: [msgReqDesc, '신청구분'],
        };
      }else if(this.state.smsReceiveIdSe === "02"){
        infoData['msgInfo'] = {
          title: '문자 고지 입력정보',
          gubun: [msgReqDesc, '신청구분'],
          destNumber: [maskingFnc.telNo(msgRequestInfo.destNumber, "*")+", "+(msgRequestInfo.msgType === '01' ?  '알림톡' : '문자'), '휴대전화 번호'],
          birth: [this.state.authRctInfo.receiptJooNumber, '인증번호(사업자번호)'],
        };
      }else{
        infoData['msgInfo'] = {
          title: '문자 고지 입력정보',
          gubun: [msgReqDesc, '신청구분'],
          destNumber: [maskingFnc.telNo(msgRequestInfo.destNumber, "*")+", "+(msgRequestInfo.msgType === '01' ?  '알림톡' : '문자'), '휴대전화 번호'],
          birth: [this.state.authRctInfo.receiptBirth, '인증번호(생년월일)'],
        };
      }
      
    }    
    
    let emailReqDesc = '';
    if (this.state.emailCheck) {
      if (this.state.emailRequestInfo.gubun === '1') {
        emailReqDesc = '신규';
      } else if (this.state.emailRequestInfo.gubun === '2') {
        emailReqDesc = '변경';
      } else if (this.state.emailRequestInfo.gubun === '3') {
        emailReqDesc = '해지';
      } else {
        emailReqDesc = '변경없음';
      }
    }    
    
    if (this.state.emailCheck) {
      if (this.state.emailRequestInfo.gubun === '3'){
        infoData['emailInfo'] = {
          title: '전자우편 고지 입력정보',
          gubun: [emailReqDesc, '신청구분'],
        };
      }else if(this.state.receiveIdNoSe === "02"){
        infoData['emailInfo'] = {
          title: '전자우편 고지 입력정보',
          gubun: [emailReqDesc, '신청구분'],
          email: [maskingFnc.emailId(this.state.emailRequestInfo.emailId, "*", 3) + '@' + this.state.emailRequestInfo.emailProvider, '전자우편'],
          birth: [this.state.authRctInfo2.receiptJooNumber, '인증번호(사업자번호)'],
        };
      }else{
        infoData['emailInfo'] = {
          title: '전자우편 고지 입력정보',
          gubun: [emailReqDesc, '신청구분'],
          email: [maskingFnc.emailId(this.state.emailRequestInfo.emailId, "*", 3) + '@' + this.state.emailRequestInfo.emailProvider, '전자우편'],
          birth: [this.state.authRctInfo2.receiptBirth, '인증번호(생년월일)'],
        };
      }
    }
    
    if (this.state.paperCheck) {
      infoData['paperInfo'] = {
        title: '종이고지 신청 여부',
        gubun: [this.state.paperCheck? (this.state.statusInfo.paperStatus? '해지' : '신청') : '변경없음', '구분'],
      };
    }

    if (!this.state.emailCheck && !this.state.msgCheck && !this.state.paperCheck) {
      infoData['noinfo'] = {
        title: this.state.description.minwonNm,
        desc: ['', '신청정보가 없습니다.']
      };
    }
    infoData['noinfo'] = {
      title: '민원 신청 안내 및 동의',
      agreeCheck: [this.state.agreeCheck ? '동의' : '미동의', '이용약관 확인 및 동의'],
      deleagtionAgree: [this.state.deleagtionAgree ? '동의' : '미동의', '신청위임 확인 및 동의'],
    }

    return infoData;
  }
  
  handleOnClickForAgreement() {
    this.setState({
      ...this.state,
      agreeCheck: !this.state.agreeCheck 
    });    
  }

  handleOnClickForDeleagtionAgree() {
    this.setState({
      ...this.state,
      deleagtionAgree: !this.state.deleagtionAgree 
    });    
  }
  
  getTermsAgree(){
    const title = "전자고지 이용약관";
    citizenAlert2(title, getB19Agree(), true).then(result => {
      if(result){
        this.setState({
          ...this.state,
          agreeCheck: true
        })
        $("#agreeCheck").prop("checked", true);
      }else{
        return;
      }
    });
  }
  
  render() {
    const that = this;
    const UserAgent = navigator.userAgent
//    that.getDescription();

    let template = `
      <div class="mw-box" id="desc">
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3">
            <a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
              <span class="i-06 txStrongColor">민원안내 및 처리절차</span>
            </a>
          </div>
        </div><!-- // info-mw -->
      </div><!-- // mw-box -->
      <div class="mw-box">
      <div id="form-mw20" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw20');" class="off" title="닫기">
            <span class="i-01">전자고지 신청(신규,변경,해지)</span>
          </a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>고지 유형을 선택해 주세요.</span></label>
                <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
                  <li id="aGubun1" class="off">
                    <a href="javascript:void(0);" 
                      onClick="${that.path}.toggleUIGubun('msgCheck', '#aGubun1','#mw-box1')">
                      <span>문자</span>
                    </a>
                  </li>
                  <li id="aGubun2" class="off">
                    <a href="javascript:void(0);" 
                      onClick="${that.path}.toggleUIGubun('emailCheck', '#aGubun2','#mw-box2')">
                      <span>전자우편</span>
                    </a>
                  </li>
                  <li id="aGubun3" class="off">
                    <a href="javascript:void(0);" 
                      onClick="${that.path}.toggleUIGubun('paperCheck', '#aGubun3','#mw-box3')">
                      <span>종이</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li id="statusInfo"></li>
              <li>
              <p class="form-cmt form-cmt-1">
                <span class="pre-star tip-blue">앱 전자고지는 신한pLay(my bill&pay), 카카오톡(카카오페이-내문서함), 토스(서울시 수도요금 내기) 앱에서 신청/해지해 주세요.</span>
              </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw20 -->
      </div><!-- //mw-box -->
  
      <div id="mw-box1" class="mw-box display-none row">
        <div id="form-mw21" class="row">
          <div class="tit-mw-h3">
            <a href="javascript:void(0);" onClick="toggleLayer('#form-mw21');" class="on" title="닫기">
              <span class="i-01">전자고지 문자</span>
            </a>
          </div>
          <div class="form-mw-box display-block row">
    
            <div class="form-mv row">
              <ul>
                <li>
                  <label class="input-label-1"><span>전자고지신청 구분을 선택해 주세요.</span></label>
                  <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
                    <li id="bGubun1" class="dGubun">
                      <a href="javascript:void(0);" onClick="${that.path}.handleMsgRequestTypeClick('1')" tabindex="-1">
                        <span>신규</span>
                      </a>
                    </li>
                    <li id="bGubun2" class="bGubun off">
                      <a href="javascript:void(0);" onClick="${that.path}.handleMsgRequestTypeClick('2')">
                        <span>변경</span>
                      </a>
                    </li>
                    <li id="bGubun3" class="bGubun off">
                      <a href="javascript:void(0);" onClick="${that.path}.handleMsgRequestTypeClick('3')">
                        <span>해지</span>
                      </a>
                    </li>
                  </ul>
                </li>
                <li id="msgMethod">
                  <label class="input-label-1"><span>안내방법을 선택해 주세요.</span></label>
                  <ul class="mw-opt mw-opt-2 row">
                    <li id="cGubun1" class="cGubun off">
                      <a href="javascript:void(0);" onClick="${that.path}.handleMsgTypeClick('01')"><span>알림톡(카카오)</span></a>
                    </li>
                    <li id="cGubun2" class="cGubun off">
                      <a href="javascript:void(0);" onClick="${that.path}.handleMsgTypeClick('04')"><span>문자(SMS)</span></a>
                    </li>
                  </ul>
                </li>
                <li id="rcvMethod">
                  <label class="input-label-1"><span>수신자 정보를 입력해  주세요.</span></label>
                  <ul class="mw-opt mw-opt-2 row">
                    <li id="fGubun1" class="fGubun off">
                      <a href="javascript:void(0);" onClick="${that.path}.handleRcvTypeClick('01')"><span>개 인</span></a>
                    </li>
                    <li id="fGubun2" class="fGubun off">
                      <a href="javascript:void(0);" onClick="${that.path}.handleRcvTypeClick('02')"><span>법 인</span></a>
                    </li>
                  </ul>
                </li>
            <ul id="authPerArea" class="msgTermination">
              <li>
                <label for="rctName" class="input-label"><span>이  름</span></label>
                <input type="text" id="rctName"
                  value="${that.state.authRctInfo.receiptName}"
                  class="input-box" placeholder="성명" disabled
                >
              <li>
                <label for="rctBirth" class="input-label"><span>인증번호</span></label>
                <input type="text" id="rctBirth" maxlength="6"
                  value="${that.state.authRctInfo.receiptBirth}"
                  class="input-box input-w-2" placeholder="생년월일(6자리) ex)930101"
                  onkeyup="${that.path}.handleChangeRctBirth(event)" 
                  onchange="${that.path}.handleChangeRctBirth(event)"
                  disabled
                >
              </li>
              <li class="msgTermination">
                  <label for="destNumber" class="input-label"><span>연락처</span></label>
                  <input type="text" id="destNumber" 
                    value="${that.state.msgRequestInfo.destNumber}"
                    onkeyup="${that.path}.handleUserMobile(event)" onchange="${that.path}.handleUserMobile(event)"
                    class="input-box input-w-2" placeholder="'-' 없이 번호입력" disabled>
                </li>
              <li>
                <p class="form-cmt form-cmt-1 pre-star tip-red">인증번호(생년월일)는 전자고지 확인에 필요한 암호입니다. 꼭 기억해 주세요.</p>
              </li>
              <li><span class="pre-star tip-blue">수신자를 변경하실 경우 수신자의 본인확인을 진행해 주세요.</span></li>
              `;
      if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
                    || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우                 
          template += `
                      <li><span class="pre-star tip-blue">인증 관련 문의 ☎ 금융인증서(1577-5500), 간편인증(1899-7411), 휴대전화·아이핀(1600-1522)</span></li>
                      `;
      }else{
          template += `
                      <li><span class="pre-star tip-blue">인증 관련 문의 ☎ 금융인증서(1577-5500), 간편인증(1899-7411), 휴대전화·아이핀·공동인증서(1600-1522)</span></li>
                      `;
      }
      template += `
              
              
              <li id="authentication"></li>
            </ul>
            <ul id="authJooArea" style="display:none;" class="msgTermination">
              <li>
                <label for="rctJooName" class="input-label"><span>법인명</span></label>
                <input type="text" id="rctJooName"
                  value="${that.state.authRctInfo.receiptJooName}"
                  class="input-box input-w-2" placeholder="법인명"
                  onkeyup="${that.path}.handleChangeRctJooName(event)" 
                  onchange="${that.path}.handleChangeRctJooName(event)"
                >
              </li>
              <li>
                <label for="rctJooNumber" class="input-label"><span>인증번호</span></label>
                <input type="text" id="rctJooNumber" maxlength="10"
                  value="${that.state.authRctInfo.receiptJooNumber}"
                  class="input-box input-w-2" placeholder="사업자번호 입력"
                  onkeyup="${that.path}.handleChangeRctJooNumber(event)" 
                  onchange="${that.path}.handleChangeRctJooNumber(event)"
                >
                <button type="button" id="biz"
                  onclick="${that.path}.handleBizAuthentication('1')"
                  class="btn btnS ${that.state.isBizAuthenticated ? 'btnTypeC:hover' : 'btnTypeC' }">
                  ${that.state.isBizAuthenticated ? '인증완료' : '인증하기' }
                </button>
              </li>
              <li class="msgTermination">
                  <label for="destNumber1" class="input-label"><span>연락처</span></label>
                  <input type="text" id="destNumber1" 
                    value="${that.state.msgRequestInfo.destNumber}"
                    onkeyup="${that.path}.handleUserMobile(event)" onchange="${that.path}.handleUserMobile(event)"
                    class="input-box input-w-2" placeholder="'-' 없이 번호입력" disabled>
                </li>
              <li>
                <p class="form-cmt form-cmt-1 pre-star tip-red">인증번호(사업자등록번호)는 전자고지 확인에 필요한 암호입니다. 꼭 기억해 주세요.</p>
              </li>
              <li><span class="pre-star tip-blue">인증 관련 문의 ☎ 금융인증서(1577-5500), 간편인증(1899-7411), 휴대전화·아이핀·공동인증서(1600-1522)</span></li>
            </ul>
              </ul>
            </div>
    
          </div>
        </div><!-- //form-mw21 -->
      </div><!-- //mw-box1 -->
  
      <div id="mw-box2" class="mw-box display-none row">
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw22');" class="on" title="닫기">
            <span class="i-01">전자고지 전자우편(이메일)</span>
          </a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>전자고지신청 구분을 선택해 주세요.</span></label>
                <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
                  <li id="dGubun1" class="dGubun">                  
                    <a href="javascript:void(0);" onClick="${that.path}.handleEmailRequestTypeClick('1')"><span>신규</span></a>
                  </li>
                  <li id="dGubun2" class="dGubun">                  
                    <a href="javascript:void(0);" onClick="${that.path}.handleEmailRequestTypeClick('2')"><span>변경</span></a>
                  </li>
                  <li id="dGubun3" class="dGubun">                  
                    <a href="javascript:void(0);" onClick="${that.path}.handleEmailRequestTypeClick('3')"><span>해지</span></a>
                  </li>
                </ul>
              </li>
              </ul>
              <ul class="emailTermination">
                <li id="rcvMethod2">
                    <label class="input-label-1"><span>수신자 정보를 입력해  주세요.</span></label>
                    <ul class="mw-opt mw-opt-2 row">
                      <li id="gGubun1" class="gGubun off">
                        <a href="javascript:void(0);" onClick="${that.path}.handleRcvTypeClick2('01')"><span>개 인</span></a>
                      </li>
                      <li id="gGubun2" class="gGubun off">
                        <a href="javascript:void(0);" onClick="${that.path}.handleRcvTypeClick2('02')"><span>법 인</span></a>
                      </li>
                    </ul>
                </li>
            </ul>
            <ul id="authPerArea2" class="emailTermination">
              <li>
                <label for="rctName"><span class="input-label">이   름</span></label>
                <input type="text" id="rctName2"
                  value="${that.state.authRctInfo2.receiptName}"
                  class="input-box" placeholder="이름" disabled
                >
              <li>
                <label for="rctBirth2">
                  <span class="input-label">인증번호</span>
                </label>
                <input type="text" id="rctBirth2" maxlength="6"
                  value="${that.state.authRctInfo2.receiptBirth}"
                  class="input-box input-w-2" placeholder="생년월일(6자리) ex)930101"
                  onkeyup="${that.path}.handleChangeRctBirth2(event)" 
                  onchange="${that.path}.handleChangeRctBirth2(event)"
                  disabled
                >
                <ul class="emailTermination">
              <li class="email">
                <label for="emailId" class="input-label"><span>이메일</span></label>
                <input type="text" id="emailId"
                  value="${that.state.emailRequestInfo.emailId}" 
                  onkeyup="${that.path}.handleEmailId(event)"
                  onpaste="${that.path}.handleEmailId(event)"                
                  class="input-box input-w-mail"> 
                <span>@</span>
                <label for="emailProvider"><span class="sr-only">이메일 주소</span></label>
                <input type="text" id="emailProvider" 
                  onkeyup="${that.path}.handleEmailProvider(event)"
                  onpaste="${that.path}.handleEmailProvider(event)"                
                  value="${that.state.emailRequestInfo.emailProvider}"
                  class="input-box input-w-mail">
                <label for="emailProviderSelector"><span class="sr-only">이메일 선택</span></label>
                <select name="emailProviderSelector" id="emailProviderSelector" 
                  onchange="${that.path}.handleEmailProviderSelector(event)"
                  value="${that.state.emailRequestInfo.emailProvider}"
                  title="이메일도메인선택" class="input-box input-w-mail2">
                  <option value="">직접입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="hotmail.com">hotmail.com</option>
                  <option value="chol.com">chol.com</option>
                  <option value="dreamwiz.com">dreamwiz.com</option>
                  <option value="empal.com">empal.com</option>
                  <option value="freechal.com">freechal.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="hanafos.com">hanafos.com</option>
                  <option value="hanmir.com">hanmir.com</option>
                  <option value="hitel.net">hitel.net</option>
                  <option value="korea.com">korea.com</option>
                  <option value="nate.com">nate.com</option>
                  <option value="netian.com">netian.com</option>
                  <option value="paran.com">paran.com</option>
                  <option value="yahoo.com">yahoo.com</option>
                </select>
              </li>
            </ul>
                <p class="form-cmt form-cmt-1 pre-star tip-red">인증번호(생년월일)는 전자고지 확인에 필요한 암호입니다. 꼭 기억해 주세요.</p>
                <li><span class="pre-star tip-blue">수신자를 변경하실 경우 수신자의 본인확인을 진행해 주세요.</span></li>
                `;
      if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
                    || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우                 
          template += `
                      <li><span class="pre-star tip-blue">인증 관련 문의 ☎ 금융인증서(1577-5500), 간편인증(1899-7411), 휴대전화·아이핀(1600-1522)</span></li>
                      `;
      }else{
          template += `
                      <li><span class="pre-star tip-blue">인증 관련 문의 ☎ 금융인증서(1577-5500), 간편인증(1899-7411), 휴대전화·아이핀·공동인증서(1600-1522)</span></li>
                      `;
      }
      template += `
              </li>
              <li id="authentication2"></li>
            </ul>
            <ul id="authJooArea2" style="display:none;" class="emailTermination">
              <li>
                <label for="rctJooName2" class="input-label"><span>법 인 명</span></label>
                <input type="text" id="rctJooName2"
                  value="${that.state.authRctInfo2.receiptJooName}"
                  class="input-box input-w-2" placeholder="법인명"
                  onkeyup="${that.path}.handleChangeRctJooName2(event)" 
                  onchange="${that.path}.handleChangeRctJooName2(event)"
                >
              </li>
              <li>
                <label for="rctJooNumber2" class="input-label"><span>인증번호</span></label>
                <input type="text" id="rctJooNumber2" maxlength="10"
                  value="${that.state.authRctInfo2.receiptJooNumber}"
                  class="input-box input-w-2" placeholder="사업자번호"
                  onkeyup="${that.path}.handleChangeRctJooNumber2(event)" 
                  onchange="${that.path}.handleChangeRctJooNumber2(event)"
                >
                <button type="button" id="biz2"
                  onclick="${that.path}.handleBizAuthentication('2')"
                  class="btn btnS ${that.state.isBizAuthenticated2 ? 'btnTypeC:hover' : 'btnTypeC' }">
                  ${that.state.isBizAuthenticated2 ? '인증완료' : '인증하기' }
                </button>
              </li>
              <ul class="emailTermination">
              <li class="email">
                <label for="emailId" class="input-label"><span>이메일</span></label>
                <input type="text" id="emailId"
                  value="${that.state.emailRequestInfo.emailId}" 
                  onkeyup="${that.path}.handleEmailId(event)"
                  onpaste="${that.path}.handleEmailId(event)"                
                  class="input-box input-w-mail"> 
                <span>@</span>
                <label for="emailProvider"><span class="sr-only">이메일 주소</span></label>
                <input type="text" id="emailProvider" 
                  onkeyup="${that.path}.handleEmailProvider(event)"
                  onpaste="${that.path}.handleEmailProvider(event)"                
                  value="${that.state.emailRequestInfo.emailProvider}"
                  class="input-box input-w-mail">
                <label for="emailProviderSelector"><span class="sr-only">이메일 선택</span></label>
                <select name="emailProviderSelector" id="emailProviderSelector" 
                  onchange="${that.path}.handleEmailProviderSelector(event)"
                  value="${that.state.emailRequestInfo.emailProvider}"
                  title="이메일도메인선택" class="input-box input-w-mail2">
                  <option value="">직접입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="hotmail.com">hotmail.com</option>
                  <option value="chol.com">chol.com</option>
                  <option value="dreamwiz.com">dreamwiz.com</option>
                  <option value="empal.com">empal.com</option>
                  <option value="freechal.com">freechal.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="hanafos.com">hanafos.com</option>
                  <option value="hanmir.com">hanmir.com</option>
                  <option value="hitel.net">hitel.net</option>
                  <option value="korea.com">korea.com</option>
                  <option value="nate.com">nate.com</option>
                  <option value="netian.com">netian.com</option>
                  <option value="paran.com">paran.com</option>
                  <option value="yahoo.com">yahoo.com</option>
                </select>
              </li>
            </ul>
              <li>
                <p class="form-cmt form-cmt-1 pre-star tip-red">인증번호(사업자등록번호)는 전자고지 확인에 필요한 암호입니다. 꼭 기억해 주세요.</p>
              </li>
              <li><span class="pre-star tip-blue">인증 관련 문의 ☎ 1600-1522 나이스신용평가(주)</span></li>
            </ul>
              
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box2 -->
      
      <div id="mw-box3" class="mw-box display-none row">
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="on" title="닫기">
            <span class="i-01">종이 고지 신청정보</span>
          </a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <ul class="mw-opt mw-opt-2 row">
                  <li id="eGubun1" class="eGubun">                  
                    <a href="javascript:void(0);"><span>신청</span></a>
                  </li>
                  <li id="eGubun3" class="eGubun">                  
                    <a href="javascript:void(0);"><span>해지</span></a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box2 -->
  
      <div class="mw-box">
      <div id="form-mw24" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw24');" 
            class="off" title="닫기">
            <span class="i-01">전자고지 신청 확인 및 동의</span>
          </a>
        </div>
        <div class="form-mw-box display-block">
          <div class="form-mv row">
            <ul class="policy2">
              <li>
                <label><span class="sr-only">전자고지 이용약관 동의</span></label>
                <input type="checkbox" name="agreeCheck" id="agreeCheck"                 
                  onclick="${that.path}.handleOnClickForAgreement(event)"
                  ${that.state.agreeCheck ? 'checked' : ''}>                  
                <label class="chk-type chk-typeS" for="agreeCheck"><span>안내문을 확인하였고, 전자고지 이용약관에 동의합니다.<p class="tx-opt">(필수)</p></span></label>
                <a href="javascript:void(0);" onClick="${that.path}.getTermsAgree()" class="btn btnSS btnTypeC"><span>자세히</span></a>
                <div class="p-depth-1 bd-gray">
                  <ul id="trmsAgreYn">
                      <li>1. [종이 고지서 발행]을 선택하는 경우 요금이 감면되지 않습니다.(상수도 요금의 1% 최소 200~1,000원)</li>
                      <li>2. 당월 8일 까지 신청(신규, 변경, 해지)은 당월 납기, 당월 8일 이후 신청은 다음 납기에 반영됩니다.</li>
                      <li>3. 향후, 이사정산을 하는 경우 전입자가 고지서를 받지 못하는 사례를 방지하기 위해 직권해지(종이고지서만 발행) 또는 직권변경(전자고지 및 종이고지서 발행) 될 수 있습니다.</li>
                  </ul>
                </div>
                <!--
                <p id="trmsAgreYn" class="p-depth-1 bd-gray">
                    1. [종이 고지서 발행]을 선택하는 경우 요금이 감면되지 않습니다.(상수도 요금의 1% 최소 200~1,000원)<br>
                    2. 당월 8일 까지 신청(신규, 변경, 해지)은 당월 납기, 당월 8일 이후 신청은 다음 납기에 반영됩니다.<br>
                    3. 향후, 이사정산을 하는 경우 전입자가 고지서를 받지 못하는 사례를 방지하기 위해 직권해지(종이고지서만 발행) 또는 직권변경(전자고지 및 종이고지서 발행) 될 수 있습니다.
                </p>
                -->
              </li>
              <li>
                <label><span class="sr-only">전자고지 신청 위임 동의</span></label>
                <input type="checkbox" name="deleagtionAgree" id="deleagtionAgree"                 
                  onclick="${that.path}.handleOnClickForDeleagtionAgree(event)"
                  ${that.state.deleagtionAgree ? 'checked' : ''}>                  
                <label class="chk-type" for="deleagtionAgree"><span>안내문을 확인하였고, 전자고지 신청(신규, 변경, 해지)을 동의합니다.<p class="tx-opt">(필수)</p></span></label>
                <div class="p-depth-1 bd-gray">
                  <ul id="deleagtionAgreeYn">
                      <li>수도사용자등과 전자고지 신청인(수신인)이 상이한 경우 신청인은 수도사용자등*에게 전자고지 신청(신규, 변경, 해지)을 위임받았습니다.</li>
                      <li class="dot2">‘수도사용자등’은 급수설비 사용자·소유자 또는 관리인을 말한다.(서울특별시 수조 조례 제2조)</li>
                      <li class="dot2">‘수도사용자등’과 실제 소유자 또는 사용자의 명의가 다른 경우 [명의변경]을 신청해 주십시오.</li>
                  </ul>
                </div>
                <!--
                <p id="deleagtionAgreeYn" class="p-depth-1 bd-gray">
                    수도사용자등과 전자고지 신청인(수신인)이 상이한 경우 신청인은 수도사용자등*에게 전자고지 신청(신규, 변경, 해지)을 위임받았습니다.<br>
                    ※ ‘수도사용자등’은 급수설비 사용자·소유자 또는 관리인을 말한다.(서울특별시 수조 조례 제2조)<br>
                    ※ ‘수도사용자등’과 실제 소유자 또는 사용자의 명의가 다른 경우 [명의변경]을 신청해 주십시오.<br>
                </p>
                -->
              </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->
    `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    if(!this.state.renderBool){ //처음 랜더만 실행
      this.setInitCheck();
      this.state.renderBool = true;
    }
    
    this.afterRender();
    
  }

  renderDescription(target: any) {
    const that = this;

    const desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div id="innerDesc" class="form-mw-box display-none row">
            <div class="info-mw row">
    
              <div class="tit-mw-h5 row"><span>처리기간</span></div>
              <p>${that.state.description.minwonReqstDc}</p>
              <div class="tit-mw-h5 row"><span>처리부서</span></div>
              <p>${that.state.description.minwonGde}</p>
              <div class="tit-mw-h5 row"><span>신청서류</span></div>
              <p>${that.state.description.presentnPapers}</p>
              <div class="tit-mw-h5 row"><span>관련법규</span></div>
              <p>${that.state.description.mtinspGde}</p>
              <div class="tit-mw-h5 row"><span>민원편람</span></div>
              <a href="${that.state.description.minwonGudUrl}" target="_blank" class="txBlue" style="display:inline-block;float:right">민원편람 바로가기</a>
            </div>
          </div>
        </div><!-- // info-mw -->
      `;
    target.innerHTML = desc;
    document.getElementById('innerDesc')!.insertAdjacentHTML('afterbegin',getDescription());
  }

  afterRender() {
    
    const msgRequestInfo = this.state.msgRequestInfo;
    const emailRequestInfo = this.state.emailRequestInfo;
    
    this.drawMsgTypeUI(msgRequestInfo.msgType); 
    this.drawMsgRequestUI(msgRequestInfo.gubun);
    
    this.drawEmailRequestUI(emailRequestInfo.gubun);
    this.drawPaperRequestUI(this.state.statusInfo.paperStatus?"3":"1");
    
    /*
    if(this.state.emailCheck){
      showGubunMulti("#aGubun1", "#mw-box1");
    }if(this.state.msgCheck){
      showGubunMulti("#aGubun2", "#mw-box2");
    }
    */
    const parentAuthInfo = this.state.parent.state.applicationPage.authenticationInfo;
    //SMS
    this.drawRcvTypeUI(this.state.smsReceiveIdSe,'fGubun');
    if(this.state.smsReceiveIdSe === "01" || this.state.smsReceiveIdSe === "03"){ //개인 or 외국인
      $("#authPerArea").show();
      $("#authJooArea").hide();
      if(parentAuthInfo.state.type === 'M'){
        $("#destNumber").attr("disabled",true);
      }else{
        $("#destNumber").removeAttr("disabled");
      }
    }else if(this.state.smsReceiveIdSe === "02"){
      $("#authPerArea").hide();
      $("#authJooArea").show();
      $("#destNumber1").removeAttr("disabled");
    }
    
    //이메일
    this.drawRcvTypeUI(this.state.receiveIdNoSe,'gGubun');
    if(this.state.receiveIdNoSe === "01" || this.state.receiveIdNoSe === "03"){ //개인 or 외국인
      $("#authPerArea2").show();
      $("#authJooArea2").hide();
    }else if(this.state.receiveIdNoSe === "02"){
      $("#authPerArea2").hide();
      $("#authJooArea2").show();
    }
    
    // 상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
    this.state.msgCheck ? showGubunMulti('#aGubun1', '#mw-box1') : hideGubunMulti('#aGubun1', '#mw-box1');
    this.state.msgCheck ? showLayer('#form-mw21') : hideLayer('#form-mw21');
    this.state.emailCheck ? showGubunMulti('#aGubun2', '#mw-box2') : hideGubunMulti('#aGubun2', '#mw-box2');
    this.state.emailCheck ? showLayer('#form-mw22') : hideLayer('#form-mw22');
    this.state.paperCheck ? showGubunMulti('#aGubun3', '#mw-box3') : hideGubunMulti('#aGubun3', '#mw-box3');
    this.state.paperCheck ? showLayer('#form-mw23') : hideLayer('#form-mw23');
//    this.state.paperCheck ? showLayer('#form-mw24') : hideLayer('#form-mw24');          
    
    var $emailProviderSelector = document.getElementById("emailProviderSelector") as HTMLSelectElement;
    if (typeof emailRequestInfo.emailProviderSelector === 'number') // selector의 타입이 string | number이다.
      $emailProviderSelector!.options[emailRequestInfo.emailProviderSelector].selected = true;      
    
    // Info 패널을 그려준다.
    const $target = document.getElementById('statusInfo');
    $target!.innerHTML = this.statusInfoPanel.render();
    this.authenticationInfo.render();
    this.authenticationInfo2.render();
  }  
}