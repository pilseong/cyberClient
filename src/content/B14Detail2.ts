// 자동 납부 신청
import CyberMinwon from '../infra/CyberMinwon';
//import AthenticationInfo from '../components/AuthenticationInfo2';
import { fetch } from './../util/unity_resource';
import {
  showHideInfo2, maskingFnc,  saupsoInfo,
  hideElement, citizenAlert, citizenConfirm, citizenAlert2
} from './../util/uiux-common';
import { getB14Agree } from './B14Agree';
import { getDescription } from './B14Description';
import CyberMinwonStorage from '../infra/StorageData';
declare var gContextUrl: string;
declare var $: any;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var fncGetCodeByGroupCdUsing: (code: string) => any;
declare var fncSetComboByCodeList: (id: string, data: any, defaultValue: string, groupYn: string) => void;
declare var mtk: any;
declare var initmTranskey: () => void;
declare var transkey: any;
declare var tk_origin: string;
declare var initTime: string;
declare var cyberMinwon: CyberMinwon;

export default class B14DetailPage {
  state: any;
  path: string;
  //authenticationInfo: AthenticationInfo;
  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      keypadInit: false,
      isSubmitSuccessful: false,
      isHistoryConfirm: false,    // 계좌이력확인
      renderBool: false,
      statusInfo: {
        data: {}
      },
      conditionInfo: {
        isValidAccount: false,    // 사용가능한 계좌 여부 -> true만 신청가능하다
        certifed: false,          // 전자서명을 통해서 인증받은지 여부 -> true만 신청가능하다.
        certifyType: '',          // 유일하게 X 전자서명 인증만 허용
        accountCheckResult: {}    // 계좌확인 결과를 담는 객체        
      },
      requestInfo: {
        gubun: '',                // 신규 1, 해지 2, 공백은 미선택
        etc: '',
        bankName: '',
        bankCode: '',
        bankCodeSelector: '0',
        bankAccountNumber: '',
        bankAccountNumberEncrypted: '',
        authName: '',
        authNumber: '',
        birthday: '',
        ci: '',                   // 공동인증서 ci 값
        msgReceiptionAgreement: false,
        withdrawAgreement: false,
        ruleAgreement: false,
        prvcClctAgreYn: false, // 개인정보 수집·이용 동의
        prvcPvsnAgreYn: false, // 개인정보 제3자 제공 동의
        agreeCheckAll: false, // 전체 확인
      },
      description: {},
      bankMeta: []
    }
    //this.authenticationInfo = new AthenticationInfo(this);
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';
    this.setInitValue();
  }
  
  setInitValue() {
    this.setState({
      ...this.state,
      keypadInit: false,
      isHistoryConfirm: false,    // 계좌이력확인
      renderBool: false,
      conditionInfo: {
        isValidAccount: false,    // 사용가능한 계좌 여부 -> true만 신청가능하다
        certifed: false,          // 전자서명을 통해서 인증받은지 여부 -> true만 신청가능하다.
        certifyType: '',          // 유일하게 X 전자서명 인증만 허용
        accountCheckResult: {}    // 계좌확인 결과를 담는 객체        
      },
      requestInfo: {
        gubun: '',                // 신규 1, 해지 2, 공백은 미선택
        etc: '',
        bankName: '',
        bankCode: '',
        bankCodeSelector: '0',
        bankAccountNumber: '',
        bankAccountNumberEncrypted: '',
        authName: '',
        authNumber: '',
        birthday: '',
        ci: '',                   // 공동인증서 ci 값
        msgReceiptionAgreement: false,
        withdrawAgreement: false,
        ruleAgreement: false,
        prvcClctAgreYn: false, // 개인정보 수집·이용 동의
        prvcPvsnAgreYn: false, // 개인정보 제3자 제공 동의
        agreeCheckAll: false, // 전체 확인
      },
    });
  }
  
  // 인증을 성공한 경우 실행되는 함수
  setAuthInfo(authInfo: any) {
    // 인증정보 매핑
    this.setState({
      ...this.state,
      requestInfo : {
        ...this.state.requestInfo,
        authName: (this.state.requestInfo.gubun === "1" || this.state.requestInfo.gubun === "") ? authInfo.authName : this.state.requestInfo.authName,
        authNumber: (this.state.requestInfo.gubun === "1" || this.state.requestInfo.gubun === "") ? (authInfo.authNumber.length === 8?authInfo.authNumber.substring(2):authInfo.authNumber) : this.state.requestInfo.authNumber,
        ci: authInfo.ci
      },
      conditionInfo : {
        ...this.state.conditionInfo,
        certifed: authInfo.isAuthenticated,
        certifyType: authInfo.type, // 유일하게 X인증(공동인증서)만 허용
      }
    });
  }

  // 수용가 조회시 초기값 설정
  // 이 때 기존에 데이터는 초기화가 되어야 한다.
  async setInitCheck() {
    const that = this;
    const sessionData = CyberMinwonStorage.getStorageData();
    let suyongaNum = '';
    let authName, authNumber = ''
    if(sessionData){
      suyongaNum = sessionData.mkey;
      authName = sessionData.applicantInfo.applyName?sessionData.applicantInfo.applyName:''
      //authName = sessionData.authenticationInfo.authInfo?sessionData.authenticationInfo.authInfo.authName:''
      //authNumber = sessionData.authenticationInfo.authInfo?sessionData.authenticationInfo.authInfo.authNumber:''
    }else{
      suyongaNum = that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
    }
    console.log(that.state.parent)
    const officeCd = that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.csOfficeCd
    
    let officeNm,telNo = ''
    const saupso = saupsoInfo.find(ele => ele.saupsoCd === officeCd);
    
    if(typeof saupso  === 'undefined') {
      
    }else{
      officeNm = saupso.fullName;
      telNo = saupso.telNo
    }
    var url = gContextUrl + "/citizen/common/searchAutoPay.do";
    let formData = new FormData();
    formData.set("mgrNo",suyongaNum);
    let searchResult = true
    try{
      let res = await window.fetch(url,{
        method: 'post',
        body: formData
      })
      let getData = await res.json();
      if(getData.result.status === 'SUCCESS'){
        const fetchedData = getData.business.bodyVO;
        if(fetchedData.bankCd.substring(0,1).toUpperCase() == 'C'){
          citizenAlert("입력하신 고객번호는 카드 자동납부 신청되어 있어, 해지처리가 불가능합니다.<br><br>카드 자동납부 해지는 서울시지방세납부시스템(ETAX)에서 회원가입 후 공인인증서로 로그인 후 신청하실 수 있습니다.").then(result => {
            if(result){
              searchResult = false
            }
          });
          return false
        }
        if(fetchedData.acctownerIdNoSe == '02'){
          citizenAlert(`등록된 자동납부 계좌가 "사업자"입니다. 신청인 확인 등이 필요하니 다산콜 120 또는 담당 수도사업소(${officeNm} ${telNo})로 문의해 주세요.`).then(result => {
            if(result){
              searchResult = false
            }
          });
          return false
        }
        //if(sessionData.authenticationInfo && (fetchedData.acctownerIdNoSe == '01' || fetchedData.acctownerIdNoSe == '' || fetchedData.acctownerIdNoSe == null) && authName != fetchedData.acctowner && authNumber != (authNumber.length == 8? fetchedData.juminIdNo.substring(0,8):fetchedData.juminIdNo.substring(0,6))
        //   && that.state.parent.state.page == 1){
        if(sessionData.authenticationInfo && (fetchedData.acctownerIdNoSe == '01' || fetchedData.acctownerIdNoSe == '' || fetchedData.acctownerIdNoSe == null) && authName != fetchedData.acctowner 
           && that.state.parent.state.page == 1){
         // citizenAlert("등록된 자동납부 계좌의 [예금주+실명번호]가 본인확인 정보와 다릅니다. 확인 후 다시 신청해 주세요.").then(result => {
          citizenAlert("등록된 자동납부 계좌의 [예금주]가 신청인 정보와 다릅니다. 확인 후 다시 신청해 주세요.").then(result => {
            if(result){
              searchResult = false
              cyberMinwon.state.currentModule.setPage(0)
            }
          });
          return false
        }
        that.setState({
          ...that.state,
          statusInfo: {
            data: fetchedData,      
          },
          requestInfo: {
            ...that.state.requestInfo,
            gubun: '2',   // 신규 1, 해지 2, 공백은 미선택
//            etc: '',
            bankName: fetchedData.bankCdNm,
            bankCode: fetchedData.bankCd,
            bankAccountNumber: fetchedData.acctNo,
            authName: fetchedData.acctowner,
            authNumber: fetchedData.juminIdNo,
            birthday: fetchedData.juminIdNo,
//            msgReceiptionAgreement: false,
//            withdrawAgreement: false,
//            ruleAgreement: false,
//            prvcClctAgreYn: false, 
//            prvcPvsnAgreYn: false, 

          }
        })        
      }else{
        if($('#linkCall').val() == 'Y' && $('#mKey').val()){
          citizenAlert("등록된 자동납부 계좌가 없습니다. 확인 후 다시 신청해 주세요.").then(result => {
            if(result){
              searchResult = false
              that.state.parent.state.applicationPage.suyongaInfo.setInit()
              that.state.parent.state.applicationPage.suyongaInfo.render()
            }
            return false
          });
        }
        const authInfo = sessionData?sessionData.authenticationInfo.authInfo : null;
        const applicantInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo

        that.setState({
          ...that.state,
          statusInfo: {
            data: null,         
          },
          requestInfo: {
            ...that.state.requestInfo,            
            gubun: '1',   // 신규 1, 해지 2, 공백은 미선택
//            etc: '',
            bankName: '',//'신한은행[88]',
            bankCode: '',//'088',
            bankAccountNumber: '',//'110476943144',
            authName: applicantInfo? applicantInfo.applyName : authName,//'꽥휨메',
            authNumber: '',//'6604251',
            birthday: '',//'6604251',
            bankCodeSelector: '0',//'55',
//            msgReceiptionAgreement: false,
//            withdrawAgreement: false,
//            ruleAgreement: false,
//            prvcClctAgreYn: false, 
//            prvcPvsnAgreYn: false,
          }
        });        
        searchResult = true
      }
      return searchResult;
    }catch(err: any){
      citizenAlert(`서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.<br>관련문의는 다산콜 120 또는 ${officeNm} ${telNo}`).then(result => {
        if(result){
          cyberMinwon.state.currentModule.setPage(0)
        }
      })
      return false;
    }
  }
  
  // 민원안내, 절차 정보를 서버에 요청한다. 
  getDescription(data: any) {
    const that = this;
    that.setState({
      ...that.state,
      description: data 
    });

    // 은행 리스트를 받아온다.
    const bankMeta = fncGetCodeByGroupCdUsing("007");
    that.setState({
      ...that.state,
      bankMeta
    });
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    // 사실 성공이 아니라 정상적으로 예외 처리가 가능한 경우를 말한다.
    // 성공 resultList[3] 이 '1' 성공, '2' 실패, '3' 통신장애, 대기시간 초과
    const resultData = this.state.submitResult;
    const resultList = resultData.errorMsg.split(',');
    if (this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: '자동 납부 ' + (this.state.requestInfo.gubun === '1' ? '신청' : '해지' + ' 신청 결과'),
        width: "150px",
        receipt_no : [resultData.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
        desc: ['정상적으로 신청되었습니다.', '신청결과'],
        
      }
      if(resultData.data.resultCode === '1'){
        infoData['noinfo'] = {
          ...infoData['noinfo'],
          desc1: [resultList[0], '안내']
        }
      }
    // 실패라기 보다는 예외로 처리할 수 없는 경우를 말한다.
    } else {
      infoData['noinfo'] = {
//        title: '자동 납부 ' + (this.state.requestInfo.gubun === '1' ? '신청' : '해지' + ' 신청 결과'),
        width: "150px",
        receipt_no : [resultData.data.receiptNo ? resultData.data.receiptNo : '-', '접수번호'],        
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
//        desc: ['정상적으로 처리되지 않았습니다.', '결과'],
//        cause: [resultData.errorMsg.length > 200 ? "시스템 내부에서 오류가 발생했습니다." : this.state.submitResult.errorMsg, '사유']
      };
      if(resultData.data.resultCode === '4'){
        infoData['noinfo'] = {
          ...infoData['noinfo'],
          desc1: [`서울특별시 시금고에서 알려드립니다. ( ※ 신한은행 )<br>[${resultList[1]}]로 비정상 처리 되었습니다.<br>※ 실명번호(생년월일) 오류 등 계좌 문제는 각 은행에 문의해 주십시오.
          <br>※ 동일계좌 오류 등은 아래 수도사업소 또는 서울아리수본부에 문의해 주십시오`, '안내'],
//          desc2: [`※ 실명번호(생년월일) 오류 등 계좌 문제는 각 은행에 문의해 주십시오.`, ''],
//          desc3: [`※ 동일계좌 오류 등은 아래 수도사업소 또는 서울아리수본부에 문의해 주십시오`, ''],
        }
      }else{
        infoData['noinfo'] = {
          ...infoData['noinfo'],
          desc1: [`[${resultList[1]}]로 비정상 처리 되었습니다.<br>아래 수도사업소 또는 서울아리수본부에 문의해 주십시오.`, '안내']
        }
      }
    }
    return infoData;
  }
  
  getSmsResult(){
    const that = this;
    const resultData = that.state.submitResult.data;
    //접수되고 요금 정상, 시금고 정상인 경우
    if(resultData.resultCode !== '2') return '';
    const applicationPage = that.state.parent.state.applicationPage;
    const suyongaInfo = applicationPage.suyongaInfo.state.suyongaInfo;
    const applyInfo = applicationPage.applicantInfo.state.applyInfo;
    const requestInfo = that.state.requestInfo;
    let smsTemplate = ``;
    const mkey = suyongaInfo.mkey;
    const address = suyongaInfo.suyongaAddress;
    let saupsoCdR = ""
    if(resultData){
      saupsoCdR = resultData.receiptNo.substring(0,3);
    }
    const appNapgi = resultData.appNapgi
    let officeNm = '';
    const saupso = saupsoInfo.find(ele => {ele.saupsoCd === saupsoCdR});
    if(typeof saupso  === 'undefined') {
      
    }else{
      officeNm = saupso.fullName;
    }
    const gubun = that.state.requestInfo.gubun === '1' ? '신청' : '해지';
    smsTemplate += `
      <p class="form-info-box-gol"><자동이체 ${gubun} 처리결과 안내><br>
      고객번호 : ${mkey}<br>
      주소 : ${address}<br>
      사용자 : ${maskingFnc.name(suyongaInfo.usrName,"*")}(신청인:${maskingFnc.name(applyInfo.applyName,"*")})<br><br>
      `;
    if(gubun === '신청'){
      smsTemplate += `
        위 수도에 대한 자동이체 신청 (${requestInfo.bankName}, ${maskingFnc.account(requestInfo.bankAccountNumber, "*", 6)}) ${appNapgi.substring(0,4)}년 ${appNapgi.substring(4,6)}월 납기분부터 적용됩니다.<br><br>
        자동이체 주요 내용을 아래와 같이 알려드리니 반드시 읽어보시기 바랍니다.<br>
         1. 이사 등으로 사용자(납부자)가 변경될 경우 반드시 자동이체를 해지하시기 바랍니다.<br>
         2. 자동이체를 해지하지 않아 계속 자동이체된 경우 수도사업소에서는 책임지지 않습니다.<br>
         3. 자동이체일은 납기월 말일이며, 해당일이 금융기관 휴무일인 경우 다음날에 이체됩니다.<br>
         4. 금융기관마다 자동이체 시각이 다르니, 전일까지 납부요금을 지정하신 계좌에 입금해두시기 바랍니다.<br>
         5. 신규신청계좌에 대한 적용납기이후 출금부터 계좌잔액이 부족한 경우 계좌잔액을 우선 출금하고 부족한 금액은 당해납기 다음달 10일, 20일, 말일에 재출금합니다.<br>
         6. 정기분 수도요금만 자동이체 처리되며, 체납된 수도요금은 고객전용입금계좌, ARS 등의 방법으로 납부하셔야 합니다.<br>
         7. 연속하여 2회 이상 자동이체 실적이 없는 경우 사전통지 없이 자동이체가 해지됩니다.<br><br>
        `;
    }else{
      smsTemplate += `
        위 수도에 대한 자동이체 해지 신청이 정상적으로 처리되었으며, ${appNapgi.substring(0,4)}년 ${appNapgi.substring(4,6)}월 납기분부터 고객전용입금계좌, ARS 등 편한 방법을 선택하셔서 직접 납부하시기 바랍니다.<br><br>
        `;
    }
      
    smsTemplate += `
      ${officeNm}
      </p>
    `;
    return smsTemplate;
  }
  
  verify() {
    const requestInfo = this.state.requestInfo;
    const conditionInfo = this.state.conditionInfo;
    if(requestInfo.gubun === "1"){
      
      if (!requestInfo.bankName) {
        citizenAlert("은행명을 선택해 주세요.");
        return false;
      }
  
      // 요청 정보 입력 확인
//      if (!requestInfo.bankAccountNumberEncrypted) {
//        citizenAlert("계좌번호를 입력해 주세요.");
//        return false;
//      }
  
      if (!requestInfo.authName) {
        citizenAlert("예금주가 없습니다. 예금주를 입력해 주세요.");
        return false;  
      }
  
      if (!requestInfo.authNumber) {
        citizenAlert("실명번호가 없습니다. 실명번호를 입력해 주세요.");
        return false;
      }
  
      // 계좌 상태 및 인증 상태 확인
      if (!conditionInfo.isValidAccount && requestInfo.gubun === "1") {
          citizenAlert("계좌 정보가 정확하지 않거나 은행에서 자동이체 등록을 거부하는 계좌입니다.");
          return false;
      }
  
    }else{
      if (!requestInfo.bankAccountNumber) {
        citizenAlert("기존에 등록되어 있는 계좌가 없습니다.");
        return false;
      }
      //본인확인 실명번호와 해지 정보의 실명번호 비교
      if(true){
        
      }
    }
    if (!requestInfo.ruleAgreement) {
        citizenAlert("자동이체 이용약관 동의는 필수입니다.");
        return false;
      }
    // 
    if (!requestInfo.prvcClctAgreYn) {
        citizenAlert("개인정보 수집·이용 동의는 필수입니다.");
        return false;
    }
    if (!requestInfo.prvcPvsnAgreYn) {
        citizenAlert("개인정보 제3자 제공 동의는 필수입니다.");
        return false;
    }
//    if (!requestInfo.msgReceiptionAgreement) {
//        citizenAlert("자동납부 출금 및 미출금 내역 메시지 수신 동의는 필수입니다.");
//        return false;
//    }
    return true;
  }
  
  // 자동 납부 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyAutoPay.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function(error: any, data: any) {
      let result = '';
      let isSuccess = false;
      if(error){
        $(".Modal").remove();
        citizenAlert("서버와 통신에 실패하였습니다.").then(rst=>{
          if(rst){
            result = '7';
            isSuccess = false;
            data = {
              ...data,
              resultCode : '7'
            }
            that.setState({
              ...that.state,
              isSubmitSuccessful: isSuccess,
              submitResult: data
            });
          }
        });
      }else{
        
        // 통합민원 결과 저장
        if (data.resultCd === 'Y') {
          that.state.parent.state.applicationPage.unityMinwons.setUnityList(data.data.receiptNo,"Y");
        }
        result = data.data.resultCode;
        if(result === '1' || result === '2' || result === '3'){
          isSuccess = true;
        }else{
          isSuccess = false;
        }
  
        that.setState({
          ...that.state,
          isSubmitSuccessful: isSuccess,
          submitResult: data
        });
      }

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');
      that.state.renderBool = false;
    });
  }
  
  // 은행 계좌번호는 암호화 된 것과 아닌 것을 둘 다 보존해야 한다.
  // 민원을 신청하는 페이지는 자동납부 페이지가 아니기 때문  
  getQueryString() {
    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;
    const transkeyInfo = this.state.transkeyInfo;
    const authInfo = this.state.parent.state.summaryPage.authenticationInfo3.state.authInfo;

    const autoPayData = {
      'id': transkeyInfo.id, 
      'transkey_n_account_no_new_':       transkeyInfo.hidden,
      'transkey_HM_n_account_no_new_':    transkeyInfo.hmac,
      'keyboardType_n_account_no_new_':   transkeyInfo.keyboardType,
      'keyIndex_n_account_no_new_':       transkeyInfo.keyIndex,
      'fieldType_n_account_no_new_':      transkeyInfo.fieldType,
      'seedKey_':                         transkeyInfo.seedKey,
      'initTime_':                        transkeyInfo.initTime,
      'hidfrmId':                         tk_origin,
      'autopayVO.autoPay':      requestInfo.gubun === '1' ? '신규' : '해지',  
//      'autopayVO.allowYn':      'N', // 안쓴다.
      'autopayVO.njooNo1':      requestInfo.authNumber.substr(0, 6),      // 식별번호 앞
      'autopayVO.njooNo2':      requestInfo.authNumber.substr(6),         // 식별번호 뒤
      'autopayVO.nbankNm':      requestInfo.bankCode,                     // 은행이름
      'autopayVO.naccountNo':   requestInfo.gubun === '1' ? 
        requestInfo.bankAccountNumberEncrypted : requestInfo.bankAccountNumber,   // 계좌번호 - 안쓴다
      'autopayVO.ndepositTy':   '',                                       // 안쓴다
      'autopayVO.ndepositNm':   requestInfo.authName,                     // 예금주    
      'autopayVO.smsOutNo':     requestInfo.msgReceiptionAgreement?'Y':'N',
      'autopayVO.smsOutYes':    requestInfo.msgReceiptionAgreement?'Y':'N',
      'autopayVO.certCd':       '', // 인증방법 설정 -> 안쓴다. -> certification.js에서 설정 
      'autopayVO.ojooNo1':      statusInfo.data ? statusInfo.data.juminIdNo.substr(0, 6) : '', // 이전 주민번호
      'autopayVO.ojooNo2':      statusInfo.data ? statusInfo.data.juminIdNo.substr(6, 13) : '', // 이전 주민번호
      'autopayVO.obankNm':      statusInfo.data ? statusInfo.data.bankCd : '',
      'autopayVO.oaccountNo':   statusInfo.data ? statusInfo.data.acctNo : '',
      'autopayVO.odepositNm':   statusInfo.data ? statusInfo.data.acctowner : '',
      'autopayVO.trmsAgreYn': requestInfo.ruleAgreement?'Y':'N',
      'autopayVO.prvcClctAgreYn': requestInfo.prvcClctAgreYn?'Y':'N',
      'autopayVO.prvcPvsnAgreYn': requestInfo.prvcPvsnAgreYn?'Y':'N',
      //본인확인
      'authCertResultVO.reqSeq' : authInfo.data.reqSeq
    };
    
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...autoPayData
    };
  }
  
  getViewInfo() {
    const that = this;
    const requestInfo = that.state.requestInfo;
    const infoData: any = {};
    if(requestInfo.gubun === "1"){
      
      infoData['requestInfo'] = {
        title: '자동 납부 입력정보',
        gubun: [requestInfo.gubun === '1' ? '신규' : '해지', '구분'],
        bankName: [requestInfo.bankName, '은행명'],
        bankAccountNumber: [maskingFnc.account(requestInfo.bankAccountNumber, "*", 6), '계좌번호'],
        authName: [maskingFnc.name(requestInfo.authName,"*"), '예금주'],
        authNumber: [requestInfo.authNumber, '실명확인번호'],
        ruleAgreement: [requestInfo.ruleAgreement? '동의':'미동의', '자동이체 이용약관 동의'],      
        prvcClctAgreYn: [requestInfo.prvcClctAgreYn? '동의':'미동의', '개인정보 수집·이용 동의'],
        prvcPvsnAgreYn: [requestInfo.prvcPvsnAgreYn? '동의':'미동의', '개인정보 제3자 제공동의'],
        msgReceiptionAgreement: [requestInfo.msgReceiptionAgreement ? '동의':'미동의', '메시지 수신 동의'],
      };
      
      infoData['conditionInfo'] = {
        title: '자동 납부 검증정보',
       // certifed: [this.state.conditionInfo.certifed === false ? '미인증' : '인증완료', '본인확인 여부'],
        isValidAccount: [this.state.conditionInfo.isValidAccount === false ? '미검증' : '검증완료', '계좌검증 여부'],
//        certifyType: [this.state.conditionInfo.certifyType === 'X' ? '공동인증서' : '공동인증서 아님', '공동인증서 인증여부'],
      };    
    }else{
      infoData['requestInfo'] = {
        title: '자동 납부 해지정보',
        gubun: [requestInfo.gubun === '1' ? '신규' : '해지', '구분'],
        bankName: [requestInfo.bankName, '은행명'],
        bankAccountNumber: [maskingFnc.account(requestInfo.bankAccountNumber, "*", 6), '계좌번호'],
        authName: [maskingFnc.name(requestInfo.authName,"*"), '예금주'],
        authNumber: [maskingFnc.authNumber(requestInfo.authNumber, "*").substring(0,6), '실명확인번호'],
        ruleAgreement: [requestInfo.ruleAgreement? '동의':'미동의', '자동이체 이용약관 동의'],      
        prvcClctAgreYn: [requestInfo.prvcClctAgreYn? '동의':'미동의', '개인정보 수집·이용 동의'],
        prvcPvsnAgreYn: [requestInfo.prvcPvsnAgreYn? '동의':'미동의', '개인정보 제3자 제공동의'],
      };
    }
    return infoData;
  }
  
  // 계좌번호 onclick 호출
  saveEncryptedAccountNumber() {
  const $n_account_no_new = document.getElementById('n_account_no_new') as HTMLInputElement;
    const id = 'n_account_no_new';
    var values = mtk.inputFillEncData($n_account_no_new); // 예) document.getElementById("n_account_no_new")
    var hidden = values.hidden;
    var hmac = values.hmac;
    var keyboardType = transkey[id].keyboard;
    var keyIndex = transkey[id].keyIndex;
    var fieldType = transkey[id].fieldType;
    var $seedKey = document.getElementById("seedKey") as HTMLInputElement;
    var seedKey = $seedKey ? $seedKey.value : '';  
    
//    console.log("id=" + id + "&transkey_" + id + "_=" + hidden + 
//      "&transkey_HM_" + id + "_=" + hmac + "&keyboardType_" + id + "_=" + keyboardType + 
//      "&keyIndex_" + id + "_=" + keyIndex + "&fieldType_" + id + "_=" + fieldType + 
//      "&seedKey_=" + seedKey + "&initTime_=" + initTime + "&hidfrmId=" + tk_origin);    
    
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
      },
      transkeyInfo: {
        id,
        values,
        hidden,
        // hmac은 nested object라서 string으로 강제 변경함(가이드에서 
        // 객체를 string으로 대입하는 방식을 그대로 이용함)
        hmac: "" + hmac,
        keyboardType,
        keyIndex,
        fieldType,
        seedKey,
        initTime
      }
    });
    
  }

  setState(nextState: any) {
    if (this.state !== nextState) {
      this.state = nextState;
    }
  }

  // 민원신청 구분
  handleOnChangeGubun(gubun: any) {
    //disble처리
    if($("#aGubun"+gubun).hasClass("disable")){
      return false;
    }
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        gubun:gubun
      }
    });

    this.render();
  }
  
  handleOnChangeEtc(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        etc: fncCutByByte(e.target.value, 500)
      }
    });
    e.target.value = this.state.requestInfo.etc;
  }
  
  handleBankSelector(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        bankName: e.target.selectedOptions[0].innerText,
        bankCode: e.target.value,
        // index를 저장한다.
        bankCodeSelector: e.target.options.selectedIndex
      }
    });
  }
  
  // 개발서버 테스트용 임시
  tempChanageName(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        authName: e.target.value,
      }
    });
  }
  
  // 개발서버 테스트용 임시
  tempChanageNumber(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        authNumber: fncCutByByte(e.target.value.replace(/[^0-9]/g,""), 6),
      }
    });
    e.target.value = this.state.requestInfo.authNumber
  }
  
  handleAccountChange(){
    const that = this;
    
    $("#bankSelector").prop("disabled", false);
    $("#n_account_no_new").prop("disabled", false);
    $("#acctChange").hide()
  }
  
  // 계좌확인 기능
  handleAccountCheck() {
    const that = this;
    mtk.fillEncData();
    
    let requestInfo = this.state.requestInfo;
    const $bankAccountNumber = document.getElementById('n_account_no_new')! as HTMLInputElement;
    const bankAccountNumber = $bankAccountNumber.value;
    if (!bankAccountNumber) {
      citizenAlert('계좌번호를 입력해 주세요');
      return false;
    }else if(!requestInfo.bankCode){
      citizenAlert('은행을 선택해 주세요.');
      return false;
    }
    const bankCd = requestInfo.bankCode;
    //농협중앙 - 계좌자리수 14인경우, 계좌자리수가 13이면서 끝자리가 3,4,7,8,9  인경우 오류메세지
    if(bankCd === '011'){
      if(bankAccountNumber.length === 14){
        citizenAlert('농협(중앙)에 해당되는 계좌가 아닙니다.<br>확인하시고 다시 선택바랍니다.').then(result => {
          if(result){
            $("#bankSelector").focus()
            return false
          }
        })
        return false
      }
      if(bankAccountNumber.length === 13){
        const endDigit = bankAccountNumber.substring(12,13)
//        console.log(`endDigit::${endDigit}`)
        if(endDigit == "3" || endDigit == "4" || endDigit == "5" || endDigit == "7") {
          citizenAlert('농협(중앙)에 해당되는 계좌가 아닙니다.<br>확인하시고 다시 선택바랍니다.').then(result => {
            if(result){
              $("#bankSelector").focus()
              return false
            }
          })
          return false
        }
        if(endDigit == "8" || endDigit == "9") {
          citizenAlert('신청할 수 없는 계좌번호입니다.<br>확인하시고 다시 선택바랍니다.').then(result => {
            if(result){
              $("#n_account_no_new").focus()
              return false
            }
          })
          return false
        }
      }
    }
    //농협단위 - 계좌자리수 11or 12인경우, 계좌자리수가 13이면서 끝자리가 1,2,6,8,9 인경우 오류메세지
    if(bankCd === '012'){
      if(bankAccountNumber.length === 11 || bankAccountNumber.length === 12){
        citizenAlert('농협(단위)에 해당되는 계좌가 아닙니다.<br>확인하시고 다시 선택바랍니다.').then(result => {
          if(result){
            $("#bankSelector").focus()
            return false
          }
        })
        return false
      }
      if(bankAccountNumber.length === 13){
        const endDigit = bankAccountNumber.substring(12,13)
//        console.log(`endDigit::${endDigit}`)
        if(endDigit == "1" || endDigit == "2" || endDigit == "6") {
          citizenAlert('농협(단위)에 해당되는 계좌가 아닙니다.<br>확인하시고 다시 선택바랍니다.').then(result => {
            if(result){
              $("#bankSelector").focus()
              return false
            }
          })
          return false
        }
        if(endDigit == "8" || endDigit == "9") {
          citizenAlert('신청할 수 없는 계좌번호입니다.<br>확인하시고 다시 선택바랍니다.').then(result => {
            if(result){
              $("#n_account_no_new").focus()
              return false
            }
          })
          return false
        }
      }
    }
    
    $(".contents-mw").append('<div class="Modal"></div>');
    $(".Modal").append('<div><h1 style="color: white; font-size: 24px;">계좌 확인중<br/>기다려 주세요</h1></div>');
    
    var queryString = "bankCd=" + requestInfo.bankCode + "&bankNm="+ requestInfo.bankName + 
      "&acctNo=" + $bankAccountNumber.value + 
      "&acctOwner=" + requestInfo.authName;//"형신경";

    var url = '/citizen/common/checkAcctNo.do';
    
    //임시  || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0 )
    const applyDate = $("#applyDt").val()
    const splitDate = applyDate.split('.')
    const thDay = new Date(Number(splitDate[0]),Number(splitDate[1])-1,Number(splitDate[2])).getDay()
    const hostName = location.hostname;//thDay !== 3 && thDay !== 4 && 
    if(hostName === "localhost" || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0 ){
      that.setState({
        ...that.state,
        conditionInfo : {
          ...that.state.conditionInfo,
          isValidAccount:true,
          accountCheckResult: {resultCode:"1"}
        },
        requestInfo : {
          ...that.state.requestInfo,
          bankAccountNumber : bankAccountNumber
        }
      });
      setTimeout(()=>{
        $(".Modal").remove();  
        $("#bankSelector").prop("disabled", true);
        $("#n_account_no_new").prop("disabled", true);
        $("#acctChange").show()
      },1000);
      
      return;
    }
  
    fetch('POST', url, queryString, function(error: any, data: any) {
      $(".Modal").remove();
      if (error) {
        citizenAlert("시스템 내부에서 오류가 발생했습니다.");
        return;
      }
      
      let isValidAccount = false; 
      if (data.resultCode == "1") {
        citizenAlert("사용가능한 계좌로 확인되었습니다.");
        $("#n_account_no_new").prop("disabled", true);
        $("#bankSelector").val(data.bankCd);
        $("#bankSelector").prop("disabled", true);
        $("#acctChange").show()
        isValidAccount = true;
      } else {
        if (data.resultCode == "2") {
          citizenAlert("예금주명이 일치하지 않습니다.");
        } else {
          citizenAlert("은행에 등록된 계좌정보와 일치하지 않거나 사용불가능한 계좌입니다.<br>확인하시기 바랍니다.");
        }
        isValidAccount = false;
      }
      
      that.setState({
        ...that.state,
        conditionInfo : {
          ...that.state.conditionInfo,
          isValidAccount,
          accountCheckResult: data
        },
        requestInfo : {
          ...that.state.requestInfo,
          bankAccountNumber : bankAccountNumber
        }
      });
    });
  }
  
  handleAccountHist(){
    const that = this;
    const requestInfo = that.state.requestInfo;
    const conditionInfo = that.state.conditionInfo || null;
    const mkey = that.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
    const bankCd = requestInfo.bankCode;
    const acct = $('#n_account_no_new').val();
    const acctOwner = requestInfo.authName;
    if(conditionInfo.accountCheckResult){// && Object.keys(conditionInfo.accountCheckResult).length === 0
      citizenAlert("계좌확인을 먼저 해주세요.").then(result => {
        if(result){
          return;
        }
      });
    }else if(that.state.isHistoryConfirm){
      citizenAlert("이미 이력확인된 계좌입니다.").then(result => {
        if(result){
          return;
        }
      });
    }else if(mkey){
      citizenAlert("고객번호를 입력해 주세요.").then(result => {
        if(result){
          return;
        }
      });
    }else if(bankCd === '000'){
      citizenAlert("은행을 선택해 주세요.").then(result => {
        if(result){
          return;
        }
      });
    }else if(acct){
      citizenAlert("계좌번호를 입력해 주세요.").then(result => {
        if(result){
          return;
        }
      });
    }else if(acctOwner){
      citizenAlert("성명(예금주)을 입력해 주세요.").then(result => {
        if(result){
          return;
        }
      });
    }else{
      const url = '/citizen/common/checkAcctNoHistory.do';
      const queryString = `withdrawAcctBankCd=${bankCd}&withdrawAcctNo=${acct}&acctOwner=${acctOwner}&mkey=${mkey}`;
      fetch('POST', url, queryString, function(error: any, data: any) {
        if (error) {
          citizenAlert("시스템 내부에서 오류가 발생했습니다.");
          return;
        }
        if(data.reqFlag === 'Y'){
          citizenConfirm("사용 가능한 계좌입니다.<br>해당 계좌로 등록하시겠습니까?").then(result => {
            if(result){
              that.state.isHistoryConfirm = true;
            }
          });
        }else{
          citizenAlert("사용 불가능한 계좌입니다.").then(result => {
            if(result){
              return;
            }
          });
        }
      });
    }
  }
  
  // 전체 동의
  handleAgreeCheckAll(e: any){
    const requestInfo = this.state.requestInfo
    
    if(e.target.checked){
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          ruleAgreement: true,
          msgReceiptionAgreement: requestInfo.gubun == '2'? false : true,
          withdrawAgreement: true,
          prvcClctAgreYn: true,
          prvcPvsnAgreYn: true,
          agreeCheckAll: true,
        }
      });
      $("input[type='checkbox']").each((idx:number, ele: any)=>{
        ele.checked = true;
      })
    }else{
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          ruleAgreement: false,
          msgReceiptionAgreement: false,
          withdrawAgreement: false,
          prvcClctAgreYn: false,
          prvcPvsnAgreYn: false,
          agreeCheckAll: false,
        }
      });
      $("input[type='checkbox']").each((idx:number, ele: any)=>{
        ele.checked = false;
      })
    }
  }
  
  // 메시지 수진 동의
  handleMsgReceiptionAgreement() {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        msgReceiptionAgreement: !this.state.requestInfo.msgReceiptionAgreement
      }
    });
  }
  
  // 출금 동의
  handleWithdrawAgreement() {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        withdrawAgreement: !this.state.requestInfo.withdrawAgreement
      }
    });
  }
  handlePrvcClctAgreYn() {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        prvcClctAgreYn: !this.state.requestInfo.prvcClctAgreYn
      }
    });
  }
  handlePrvcPvsnAgreYn() {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        prvcPvsnAgreYn: !this.state.requestInfo.prvcPvsnAgreYn
      }
    });
  }
  
  // 이용약관 동의
  handleRuleAgreement() {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        ruleAgreement: !this.state.requestInfo.ruleAgreement
      }
    });
  }
  
  handleRuleAgreementLayer(){
    const title = "자동이체 이용약관";
    citizenAlert2(title, getB14Agree(), true).then(result => {
      if(result){
        this.setState({
          ...this.state,
          requestInfo : {
            ...this.state.requestInfo,
            ruleAgreement: true
          }
        })
        $("#ruleAgreement").prop("checked", true);
      }else{
        return;
      }
    });
  }

  render() {
    const that = this;
    if(!this.state.renderBool){ //처음 랜더만 실행
      this.setInitCheck();
      this.state.renderBool = true;
    }

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
        <!-- 자동납부 신청(신규/변경/해지) -->
        <div id="form-mw21" class="row">
          <div class="tit-mw-h3">
            <a href="javascript:void(0);" onClick="toggleLayer('#form-mw21');" class="off" title="닫기">
              <span class="i-01">자동납부 신청</span>
            </a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li>
                  <label class="input-label-1"><span>자동납부 신청을 선택해 주세요.</span></label>
                  <ul class="mw-opt mw-opt-2 row">
                    <li id="aGubun1" class="off"><a href="javascript:void(0);" 
                      onClick="${that.path}.handleOnChangeGubun('1')"><span>신규</span></a></li>
                    <li id="aGubun2" class="off"><a href="javascript:void(0);" 
                      onClick="${that.path}.handleOnChangeGubun('2')"><span>해지</span></a></li>
                  </ul>
                </li>
                <li>
                  <label for="contents" class="input-label-1"><span>비고</span></label>
                  <textarea name="contents" id="content" maxlength="500" title="비고" class="textarea-box"
                    onchange="${that.path}.handleOnChangeEtc(event)"
                    onkeyup="${that.path}.handleOnChangeEtc(event)"
                    onpaste="${that.path}.handleOnChangeEtc(event)"
                  >${that.state.requestInfo.etc}</textarea>
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw21 -->
      </div><!-- //mw-box -->
  
  
      <div id="mw-box1" class="mw-box display-none row">
      <!-- 신계좌 정보 -->
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" 
          onClick="toggleLayer('#form-mw22');" class="off" title="닫기">
          <span class="i-01">자동납부(계좌) 신규 신청</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="bankSelector" class="input-label"><span class="form-req">은행명</span></label>
                <select id="bankSelector"
                  onchange="${that.path}.handleBankSelector(event)"
                  name="bankSelector" title="은행명 선택" class="input-box input-w-2">
                </select>
                <a href="javascript:void(0);" id="acctChange" onclick="${that.path}.handleAccountChange()" class="btn btnSS btnTypeA">
                  <span>계좌변경</span>
                </a>
              </li>
              <li class="mw-opt-2">
                <label for="n_account_no_new" class="input-label"><span class="form-req">계좌번호 </span></label>
                  <input type="text" id="n_account_no_new" class="input-box input-w-2" 
                    data-tk-kbdType="number" value="" autocomplete="new-password" maxlength="30" title="계좌번호"  
                    onclick="mtk.onKeyboard(this);"
                    placeholder="'-' 없이 번호입력" readonly>
                <a href="javascript:void(0);" onclick="${that.path}.handleAccountCheck()" class="btn btnSS btnTypeA">
                  <span>계좌확인</span>
                </a>
                <a href="javascript:void(0);" onclick="${that.path}.handleAccountHist()" class="btn btnSS btnTypeB"><span>계좌이력확인</span></a>
              </li>
              <li>
                <label for="authName" class="input-label"><span class="form-req">예금주명</span></label>  
                  <input type="text" id="authName"
                    value="${that.state.requestInfo.authName}"
                    onchange="${that.path}.tempChanageName(event)"
                    class="input-box input-w-2" placeholder="성명(예금주)" readonly>
              </li>
  
              <li>
                <label for="authNumber" class="input-label"><span class="form-req">실명번호</span></label>
                  <input type="text" id="authNumber" value="${that.state.requestInfo.authNumber}"
                    onchange="${that.path}.tempChanageNumber(event)"
                    onkeyup="${that.path}.tempChanageNumber(event)"
                    onpaste="${that.path}.tempChanageNumber(event)"
                    class="input-box input-w-2" placeholder="실명번호" >
              </li>
                <p class="form-cmt form-cmt-1">
                  * <span class="txStrongColor">실명번호(개인)</span>는 <span class="txStrongColor">주민등록번호 앞자리(6자리,생년월일:YYMMDD)</span> 은행(계좌) 관리번호입니다.
                </p>
                <p class="form-cmt form-cmt-1">
                  * <span class="txStrongColor">법인</span>은 <span class="txStrongColor">수도사업소 또는 서울시ETAX(etax.seoul.go.kr)</span>에서 신청해 주세요.</span>
                </p>
                <p class="form-cmt form-cmt-1">
                  <span>* 증권계좌는 자동납부 신청이 불가합니다.(지방세징수법에 의거 증권사는 지방세수납대행기관에 해당되지 않습니다.)</span>
                </p>
              <li>
                
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box -->
  
      <div id="mw-box2" class="mw-box display-none row">
      <!-- 자동납부(계좌) 해지 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
            <span class="i-01">자동납부(계좌) 해지 신청</span>
          </a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="form-mw18-tx" class="input-label">
                <span>은행명</span>
                </label>
                <input type="text"
                  value="${that.state.requestInfo.bankName}"
                  id="form-mw18-tx" class="input-box input-w-2" placeholder="은행명" readOnly>
              </li>
              <li>
                <label for="form-mw28-tx" class="input-label">
                  <span>계좌번호</span>
                </label>
                <input type="text" 
                  value="${maskingFnc.account(that.state.requestInfo.bankAccountNumber,"*", 6)}"
                  id="form-mw28-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력" readOnly>
              </li>
              <li>
                <label for="form-mw38-tx" class="input-label">
                  <span>성명(예금주)</span>
                </label>
                <input type="text" 
                  value="${maskingFnc.name(that.state.requestInfo.authName, "*")}"
                  id="form-mw38-tx" class="input-box input-w-2" placeholder="성명(예금주)" readOnly>
              </li>
              <li>
                <label for="form-mw48-tx" class="input-label">
                  <span>실명번호</span>
                </label>
                <input 
                  value="${that.state.requestInfo.birthday.length !== 10 ? 
                    that.state.requestInfo.birthday.substring(0, 6) : that.state.requestInfo.birthday}"
                    type="text" id="form-mw48-tx" class="input-box input-w-2" placeholder="생년월일" readOnly>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->
      
      <!-- 전자서명 
      <div class="mw-box" id="authentication"></div>
      -->      
      
      <div id="agreeEdge" class="mw-box row">
      <!-- 약관동의 -->
      <div id="form-mw24" class="row">
        <div class="tit-mw-h3">
          <a href="javascript:void(0);" onClick="toggleLayer('#form-mw24');" class="off" title="닫기">
          <span class="i-01">자동납부 신청 확인 및 동의</span></a>
        </div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul class="policy2">
              <li style='border-bottom: 1px solid #cbd2d8 !important;'>
                <input type="checkbox" name="agreeCheckAll" 
                  onclick="${that.path}.handleAgreeCheckAll(event)"
                  id="agreeCheckAll" ${that.state.requestInfo.agreeCheckAll ? 'checked' : ''}>
                <label class="chk-type" for="agreeCheckAll"> 
                  <span style="font-weight:bold;">전체 동의</span>
                </label><br>
              </li>
              <li>
                <input type="checkbox" name="ruleAgreement" 
                  onclick="${that.path}.handleRuleAgreement(event)"
                  id="ruleAgreement" ${that.state.requestInfo.ruleAgreement ? 'checked' : ''}>
                <label class="chk-type chk-typeS" for="ruleAgreement"> 
                  <span>자동이체 이용약관 동의<span class="tx-opt-a">(필수)</span></span>
                </label>
                <a href="javascript:void(0);" onClick="${that.path}.handleRuleAgreementLayer();" class="btn btnSS btnTypeC">
                  <span>자세히</span>
                </a>
                <div class="p-depth-1 bd-gray">
                  <ul>
                    <li>[주요내용]</li>
                    <li class="dot">제4조(과실책임) : ②납부자가 자동이체 해지를 신청하지 않아 계속 자동이체된 경우에는 사업소(본부)에서는 책임을 지지 않습니다.</li>
                    <li class="dot">①청구금액에 비해 계좌잔액이 부족하여도 잔액을 출금할 수 있습니다. 다만, 자동이체 부분출금 후 부족한 금액은 해당납기 다음달 10일, 20일, 말일에 재출금 합니다. ②다음달 말일까지 재청구하여 미출금된 금액은 자동이체가 되지 않으며, 다음 납기에 발송되는 체납청구서로 납부하여야 합니다.</li>
                    <li class="dot">제10조(자동이체 해지) : 연속하여 2납기 자동이체 실적이 없는 경우에는 납부자에게 사전통지 없이 자동이체를 해지 합니다.</li>
                  </ul>
                </div>
              </li>
              <li>
                <input type="checkbox" name="prvcClctAgreYn" 
                  onclick="${that.path}.handlePrvcClctAgreYn(event)"
                  id="prvcClctAgreYn" ${that.state.requestInfo.prvcClctAgreYn ? 'checked' : ''}>
                <label class="chk-type chk-typeS" for="prvcClctAgreYn"> 
                  <span>개인정보 수집·이용에 동의합니다.<span class="tx-opt-a">(필수)</span></span>
                </label>
                <a href="javascript:void(0);" onClick="showHideInfo2('#togglePrvcClctAgreYn', event);" class="btn btnSS btnTypeC">
                  <span>보기</span>
                </a>
                <div id="togglePrvcClctAgreYn" class="p-depth-1 bd-gray display-none">
                  <ul>
                    <li class="dot">수집·이용 목적 : 자동이체 서비스의 원활한 제공</li>
                    <li class="dot">수집항목(개인정보) : 성명, 전화번호, 주소, 계좌정보, 생년월일</li>
                    <li class="dot">보유기간 : 전자금융거래법에 의거 자동이체 이용 종료 또는 해지 후 5년</li>
                    <li class="dot">개인정보 및 고유식별정보 수집/이용을 거부할 권리가 있으며, 권리행사 시 자동이체신청이 거부될 수 있습니다.</li>
                  </ul>
                </div>
              </li>
              <li>
                <input type="checkbox" name="prvcPvsnAgreYn" 
                  onclick="${that.path}.handlePrvcPvsnAgreYn(event)"
                  id="prvcPvsnAgreYn" ${that.state.requestInfo.prvcPvsnAgreYn ? 'checked' : ''}>
                <label class="chk-type chk-typeS" for="prvcPvsnAgreYn"> 
                  <span>개인정보 제3자 제공에 동의합니다.<span class="tx-opt-a">(필수)</span></span>
                </label>
                <a href="javascript:void(0);" onClick="showHideInfo2('#togglePrvcPvsnAgreYn', event);" class="btn btnSS btnTypeC">
                  <span>보기</span>
                </a>
                <div id="togglePrvcPvsnAgreYn" class="p-depth-1 bd-gray display-none">
                  <ul>
                    <li class="dot">제공받는 자 : 사단법인 금융결제원, 은행 등 금융회사</li>
                    <li class="dot">개인정보 이용 목적 : 자동이체 서비스 제공, 자동이체 신규 등록·해지 사실 안내, 자동이체 출금동의 확인</li>
                    <li class="dot">제공하는 개인정보 항목 : 금융기관, 출금계좌번호, 생년월일, 예금주명, 전화번호, 휴대전화번호, 출금계좌 개설 금융기관에 등록된 휴대전화번호</li>
                    <li class="dot">보유기간 : 수십·이용 동의일로부터 자동이체 이용 종료 또는 해지 후 5년</li>
                    <li class="dot">신청자는 개인정보를 금융결제원에 제공하는 것을 거부할 권리가 있으며, 거부시 출금이제 신청이 거불될 수 있습니다.</li>
                  </ul>
                </div>
              </li>
              <li id="showMsg">
                <input type="checkbox" name="msgReceiptionAgreement" 
                  onclick="${that.path}.handleMsgReceiptionAgreement(event)"
                  id="msgReceiptionAgreement" ${that.state.requestInfo.msgReceiptionAgreement ? 'checked' : ''}>
                <label class="chk-type" for="msgReceiptionAgreement"> 
                  <span>자동납부 출금 및 미출금 내역 메시지 수신 동의 <span class="tx-opt-a">(선택)</span></span>
                </label><br>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->        
    `;

    document.getElementById('minwonRoot')!.innerHTML = template;
    this.renderDescription(document.getElementById('desc'));
    this.afterRender();
  }

  afterRender() {
    const requestInfo = this.state.requestInfo;
    // 신청, 해지 버튼 그려주기
    if (requestInfo.gubun === '1') {
      $("#aGubun1").addClass("on");
      $("#aGubun2").removeClass("off");
      $("#aGubun2").addClass("disable");
      $('#mw-box1').addClass("display-block");
      $('#mw-box1').removeClass("display-none");;
      $('#mw-box2').addClass("display-none");
      $('#mw-box2').removeClass("display-block");
      $('#showMsg').show()
    } else if (requestInfo.gubun === '2') {
      $("#aGubun2").addClass("on");
      $("#aGubun1").removeClass("off");
      $("#aGubun1").addClass("disable");
      $('#mw-box2').addClass("display-block");
      $('#mw-box2').removeClass("display-none");;
      $('#mw-box1').addClass("display-none");
      $('#mw-box1').removeClass("display-block");
      $('#showMsg').hide()
//      hideElement('#agreeEdge');
    } else {
      $('#mw-box1').addClass("display-none");
      $('#mw-box2').addClass("display-none");
      $('#showMsg').show()
    }
    
    // 예전 코드 재활용 / 셀렉트 박스 설정
    $("#bankSelector").prepend("<option value='000' selected='selected'>선택해 주세요</option>");
    fncSetComboByCodeList("bankSelector", this.state.bankMeta, "", 'N');
    
    // 선택된 셀렉트 박스로 상태를 복구한다.
    var $bankSelector = document.getElementById("bankSelector") as HTMLSelectElement;
    $bankSelector!.options[this.state.requestInfo.bankCodeSelector].selected = true;    
    
    // 키보드 보안 모듈이 DOM을 스캔한다.
    if (requestInfo.gubun !== '') {// && this.state.keypadInit === false) { 
      initmTranskey();
//      this.state.keypadInit = true;
    }
    $("#acctChange").hide()
    //임시
    const hostName = location.hostname;
    if((hostName === "localhost" || hostName.indexOf('98.42.34.126') === 0 || hostName.indexOf('98.42.34.22') === 0 )){
      $("#authName").prop("readonly", false);
      $("#authNumber").prop("readonly", false);
    }
    //this.authenticationInfo.render();
  }

  renderDescription(target: any) {
    const that = this;

    const desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" 
            onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div id="innerDesc" class="form-mw-box display-none row">
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>민원편람</span></div>
              <a href="${that.state.description.minwonGudUrl}" target="_blank" class="txBlue" style="display:inline-block;float:right">민원편람 바로가기</a>
            </div>
          </div>
        </div><!-- // info-mw -->
    `;

    target.innerHTML = desc;
    document.getElementById('innerDesc')!.insertAdjacentHTML('afterbegin',getDescription());
  }
}