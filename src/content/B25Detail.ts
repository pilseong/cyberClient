import { fetch } from './../util/unity_resource';
import CyberMinwon from '../infra/CyberMinwon';
import {
  addMW, removeMW, disableMW, saupsoInfo,
  phoneNumberInputValidation, citizenAlert, citizen_alert, citizenConfirm, maskingFnc, mobilePattern
} from './../util/uiux-common';
import UnityMinwonPanel from '../components/UnityMinwonPanel';
import CyberMinwonStorage from '../infra/StorageData';
declare var gContextUrl: string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

// 수도요금 문자 알림
export default class B25DetailPage {
  state: {
    minwonCd: string;
    parent: any;
    statusInfo: any;
    isSubmitSuccessful: boolean;
    submitResult: any;
    requestInfo: {
      gubun: string;   // 신규 1 변경 2, 해지 3, 공백은 미선택
      method: string;  // 알림톡 1, 문자 2
      mobile: string;
      agree: boolean;
    },
    description: {
      minwonNm: string;
      minwonDfn: string;
      minwonHow: string;
      minwonReqstDc: string;
      minwonGde: string;
      presentnPapers: string;
      minwonProcedure: string;
      mtinspGde: string;
      minwonGudUrl: string;
    },
    renderBool: boolean;
  };
  path: string;

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {},
      requestInfo: {
        gubun: '',   // 신규 1 변경 2, 해지 3, 공백은 미선택
        method: '',  // 알림톡 1, 문자 2
        mobile: '',
        agree: false
      },
      description: {
        minwonNm: '',
        minwonDfn: '',
        minwonHow: '',
        minwonReqstDc: '',
        minwonGde: '',
        presentnPapers: '',
        minwonProcedure: '',
        mtinspGde: '',
        minwonGudUrl: ''
        
      },
      renderBool: false
    }
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';

  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        gubun: '',   // 신규 1 변경 2, 해지 3, 공백은 미선택
        method: '',  // 알림톡 1, 문자 2
        mobile: '',
        agree: false
      }
    });
  }
  
  setInitCheck() {
    const that = this;
    const sessionData = CyberMinwonStorage.getStorageData();
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
    var url = gContextUrl + "/citizen/common/getImmdNtcnInfo.do";
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

      if (data.result.status === 'SUCCESS') {
        const fetchedData = data.business.bodyVO[0];
        const gubun = fetchedData.nowStatusCd;        //신청/변경/해지 구분 01:신규 , 02:변경, 03:해지, 04:직권해지
        const method = fetchedData.reqFormCd; //안내방법(00:알림톡,01:E-mail,02:핸드폰+E-mail,03:문자)
        const mobile = fetchedData.yogmResultNtceTel; //결과통지 수신번호
        that.setState({
          ...that.state,
          statusInfo: {
            data: fetchedData
          },
          requestInfo: {
            ...that.state.requestInfo,
            gubun: (gubun === "03" || gubun === "04")? "1" : "2",
            method: method === "00"? "1" : (method === "03"? "2" : ""),
            mobile: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile
          }
        })
      } else {
        that.setState({
          ...that.state,
          statusInfo: {
            data: null
          },
          requestInfo: {
            ...that.state.requestInfo,
            gubun: '1',
            method: '',
            mobile: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile
          }
        })
      }

    });
  }

  // 민원안내, 절차 정보를 서버에 요청한다. 
  getDescription(data: any) {
    const that = this;
    that.setState({
      ...that.state,
      description: data 
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
    const gubun = this.state.requestInfo.gubun;
    if(gubun === '1' || gubun === '2'){
      
      return {
        viewB25Detail: {
          gubun: [this.state.requestInfo.gubun === '1' ? '신규' :
            this.state.requestInfo.gubun === '2' ? '변경' :
              this.state.requestInfo.gubun === '3' ? '해지' : '미선택', '신청구분'],
          method: [this.state.requestInfo.method === '1' ? '알림톡' :
            this.state.requestInfo.method === '2' ? '문자' : '미선택', '안내방법'],
          mobile: [maskingFnc.telNo(this.state.requestInfo.mobile,"*"), '알림수신번호'],
          agree: [this.state.requestInfo.agree === true ? '동의' : '미동의', '알림동의여부']
        }
      };
    }else{
      return {
        viewB25Detail: {
          gubun: [this.state.requestInfo.gubun === '1' ? '신규' :
            this.state.requestInfo.gubun === '2' ? '변경' :
              this.state.requestInfo.gubun === '3' ? '해지' : '미선택', '신청구분'],
        }
      }
    }
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 민원신청 구분
  handleOnChangeGubun(gubun: string) {
    
    let gubunVal = this.state.requestInfo.gubun;
    if(gubunVal === "1" && (gubun === "2" || gubun === "3")){
      return false;
    }else if(gubun === "1" && (gubunVal === "2" || gubunVal === "3")){
      return false;
    }
    
    this.toggleGubun(gubun);
    
  }
  
  toggleGubun(gubun: string){
    let method = this.state.requestInfo.method;
    let mobile = this.state.requestInfo.mobile;
    let agree = this.state.requestInfo.agree;
    // 신규
    if (gubun === "1") {
      addMW("#aGubun1");
      disableMW("#aGubun2");
      disableMW("#aGubun3");
      $('#agreeInfoBox').show();
    // 변경
    } else if (gubun === "2") {
      disableMW("#aGubun1");
      addMW("#aGubun2");
      removeMW("#aGubun3");
      $('#method').show();
      $('#mobile').show();
      $('#agreeInfoBox').show();
    // 해지
    } else if (gubun === "3") {
      addMW("#aGubun3");
      removeMW("#aGubun1");
      removeMW("#aGubun2");
      
      $('#method').hide();
      $('#mobile').hide();
      $('#agreeInfoBox').hide();
      method = '';
      mobile = '';
      agree = false;
      removeMW("#bGubun1");
      removeMW("#bGubun2");
      $('#mobile-input').val(mobile);
      $('#ch81').prop('checked', false);
    }
    
    this.setState({
      ...this.state,
      requestInfo: {
        gubun,
        method,
        mobile,
        agree
      }
    })
  }

  // 안내방법 선택
  handleMethod(method: string) {
    if (method === "1") {
      addMW("#bGubun1");
      removeMW("#bGubun2");
    } else if (method === "2") {
      addMW("#bGubun2");
      removeMW("#bGubun1");
    }

    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        method
      }
    })

  }

  // 핸드폰 번호 매핑
  handleOnChangeMobile(e: any) {
    let val = e.target.value.replace(/[^0-9]/g,"").substring(0, 11);
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        mobile: val
      }
    });
    e.target.value = val;
    phoneNumberInputValidation(e.target, 11, mobilePattern);
  }

  // 개인정보 수집 동의
  handleOnClickAtreeOnReception() {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        agree: !this.state.requestInfo.agree
      }
    })
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    let gubunNm = "";
    const requestInfo = this.state.requestInfo;
    if(requestInfo.gubun === "1"){
      gubunNm = "신규";
    }else if(requestInfo.gubun === "2"){
      gubunNm = "변경";
    }else if(requestInfo.gubun === "3"){
      gubunNm = "해지";
    }
    let resultTitle = this.state.description.minwonNm.substring(0,this.state.description.minwonNm.indexOf("신청")) + gubunNm;
    const resultData = this.state.submitResult;
    const resultList = resultData.errorMsg.split('=');
    if (this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: resultTitle+' 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt, '신청일시'],
        desc: ['정상적으로 신청되었습니다.', '신청결과']
      }
    } else {
      infoData['noinfo'] = {
//        title: resultTitle+' 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo ? resultData.data.receiptNo : '-', '접수번호'],        
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
        desc: [`[${resultList[0]}]로 비정상 처리 되었습니다.<br>아래 수도사업소 또는 서울아리수본부에 문의해 주십시오.`, '신청결과'],
//        cause: [resultData.errorMsg.length > 200 ? "시스템 내부에서 오류가 발생했습니다." : resultData.errorMsg, '사유']
      };
    }
    return infoData;      
  }
  
  getSmsResult(){
    const that = this;
    const applicationPage = that.state.parent.state.applicationPage;
    const suyongaInfo = applicationPage.suyongaInfo.state.suyongaInfo;
    let smsTemplate = ``;
    const mkey = suyongaInfo.mkey;
    const address = suyongaInfo.suyongaAddress;
    let saupsoCdR = ""
    const resultData = that.state.submitResult.data;
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
    smsTemplate += `
      <p class="form-info-box-gol"><수도요금 바로알림서비스 처리 안내><br>
      고객번호 : ${mkey}<br>
      주소 : ${address}<br>
      사용자 : ${maskingFnc.name(suyongaInfo.usrName,"*")}<br><br>
      위 수도에 대한 바로알림서비스가 처리되어,${appNapgi.substring(0,4)}년 ${appNapgi.substring(4,6)}월 납기부터 적용될 예정입니다.(메시지 전송일 : 납기월 12일 전후)<br><br>
      이사, 전화번호 변경 등이 있는 경우 수도사업소로 연락하셔서 서비스를 변경 또는 해지해주시기 바라며, 통신장애 등으로 메시지 수신이 불가할 수도 있는 점 양해바랍니다.<br><br>
      ${officeNm}
      </p>
    `;
    return smsTemplate;
  }

  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;

    if (!requestInfo.gubun) {
      citizenAlert("수도요금 문자 알림 신청 구분값을 설정해 주세요.");
      return false;
    }

    if (requestInfo.gubun !== '3' && !requestInfo.method) {
      citizenAlert("수도요금 문자 알림 안내방법을 설정해 주세요.");
      return false;
    }

    if (requestInfo.gubun !== '3' && !requestInfo.mobile) {
      citizenAlert("수도요금 문자 알림을 수신할 휴대전화 번호를 입력해 주세요");
      return false;
    }
    if (requestInfo.gubun !== '3' && requestInfo.mobile && mobilePattern.test(requestInfo.mobile) !== true) {
      citizenAlert("휴대전화 번호가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.");
      return false;
    }
    
    /*
    if (requestInfo.gubun !== '3' && requestInfo.mobile.length !== 11) {
      citizenAlert("수도요금 문자 알림을 수신할 휴대전화 번호 11자리를 입력해 주세요");
      return false;
    }
    */
    // 해지시에는 수신동의는 기본적으로 확인하지 않는다.
    if (requestInfo.gubun !== '3' && !requestInfo.agree) {
      citizenAlert("수도요금 문자 알림 수신동의를 체크해 주세요");
      return false;
    }
    return true;
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyImmdNtcn.do";
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
      
      that.state.renderBool = false;
    });
  }

  getQueryString() {
    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;
    
    const suyongaInfo = this.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo;

    const notifyRequestData = {
      // 통합 민원 데이터 셋 바인딩
      'immdNtcnVO.reqGubun': "" + (parseInt(requestInfo.gubun) - 1),
      'immdNtcnVO.reqInfoMobile': statusInfo.data ? statusInfo.data.yogmResultNtceTel : '',
      'immdNtcnVO.minwonCd': 'B25',
      'immdNtcnVO.reqMobile': requestInfo.mobile,
      'immdNtcnVO.reqFormCd': requestInfo.method === '1' ? '00' :
        requestInfo.method === '2' ? '03' : '',
      'emailNticVO.mkey': suyongaInfo.mkey,
      'immdNtcnVO.agree': requestInfo.agree? 'Y':'N',
    };

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...notifyRequestData
    };
  }

  getStatusString() {
    const statusInfo = this.state.statusInfo;

    if (!statusInfo.data) {
      return "미가입 수용가";
    } else {
      return `${statusInfo.data.reqFormCd === '00' ? '카카오(알림톡)' : '문자(SMS)'} ${maskingFnc.telNo(statusInfo.data.yogmResultNtceTel, "*")}`;
    }
  }
  
  render() {
    const that = this;
    
    if(!this.state.renderBool){ //처음 랜더만 실행
      this.setInitCheck();
      this.state.renderBool = true;
    }
    
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc">
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
        </div><!-- // info-mw -->
      </div><!-- // mw-box -->  
      <!-- 신청내용 -->
      <div class="mw-box">
      <!-- 수도요금 문자 알림 신청 (신규/변경/해지) -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기"><span class="i-01">수도요금 문자 알림 서비스 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li><label for="statusInfo" class="input-label"><span>사용현황</span></label>
                <input type="text" id="statusInfo" class="input-box input-w-2" readonly style="pointer-events:none;" value="${that.getStatusString()}">
              </li>
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청구분을 선택해 주세요</span></label>
                <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
                  <li id="aGubun1" class="aGubun">
                    <a href="javascript:void(0);" onClick="${that.path}.handleOnChangeGubun('1')"><span>신규</span></a>
                  </li>
                  <li id="aGubun2" class="aGubun">
                    <a href="javascript:void(0);" onClick="${that.path}.handleOnChangeGubun('2')"><span>변경</span></a>
                  </li>
                  <li id="aGubun3" class="aGubun">
                    <a href="javascript:void(0);" onClick="${that.path}.handleOnChangeGubun('3')"><span>해지</span></a>
                  </li>
                </ul>
              </li>
              <li id="method">
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>안내방법을 선택해 주세요.</span></label>
                <ul class="mw-opt mw-opt-2 row">
                  <li id="bGubun1" class="bGubun">
                    <a href="javascript:void(0);" onClick="${that.path}.handleMethod('1')"><span>알림톡</span></a>
                  </li>
                  <li id="bGubun2" class="bGubun">
                    <a href="javascript:void(0);" onClick="${that.path}.handleMethod('2')"><span>문자</span></a>
                  </li>
                </ul>
              </li>
  
              <li id="mobile">
                <label for="form-mw36-tx" class="input-label"><span class="form-req"><span class="sr-only">필수</span>휴대전화</span></label>
                <input type="text" id="mobile-input" 
                  onkeyup="${that.path}.handleOnChangeMobile(event)" onchange="${that.path}.handleOnChangeMobile(event)"
                    value="${that.state.requestInfo.mobile}" maxlength="11"
                  class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <!--
                <p class="form-cmt pre-star tip-blue">신규/변경/해지할 휴대전화 번호를 입력해 주세요.</p>
                -->
              </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      
      <div class="mw-box" id="agreeInfoBox">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="닫기">
            <span class="i-53">민원 신청 안내 및 동의</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul class="policy2">
                <li>
                  <label><span class="sr-only">수도요금 문자 알림 수신여부</span></label>
                  <input type="checkbox" name="ch81" id="ch81" onclick="${that.path}.handleOnClickAtreeOnReception(event)"
                      ${that.state.requestInfo.agree ? 'checked' : ''}>
                    <label class="chk-type chk-typeS" for="ch81"><span>안내문을 확인하였고, 수도요금 문자 알림 수신 동의합니다.<p class="tx-opt">(필수)</p></span></label>
                  <a href="javascript:void(0);" onClick="showHideInfo2('#agreeInfo', event);" class="btn btnSS btnTypeC">
                    <span>보기</span>
                  </a>
                  <div id="agreeInfo" class="p-depth-1 bd-gray display-none">
                    <ul>
                      <li class="dot">메시지 수신 설정 상태, 데이터 상태, 시스템 오류, 통신장애, 휴대폰 사용 정지, 휴대폰 전원 상태 등으로 메시지 수신이 불가할 수 있습니다.</li>
                      <li class="dot">메시지내용은 발송일 기준으로 작성된 것이므로 이 후 변동사항은 해당 사업소로 문의하시기 바랍니다.</li>
                      <li class="dot">서비스 받으실 이동전화번호가 변경된 경우, 변경신청 하여야 하며, 신청 지연 및 신청내용 오류로 인하여 신청자 또는 제3자에게 발생된 사태나 손해에 대하여 서비스 기관이 책임지지 않습니다.</li>
                      <li class="dot">전·출입을 반영하여 서비스 하지 않으므로 사유발생 시, 해지 및 신규 신청하여야 하며 그렇지 않아 발생할 수 있는 불이익 등에 대한 책임은 서비스 기관에 없으며, 이를 예방하기 위한 조치로 직권해지 할 수 있습니다.</li>
                      <li class="dot">매월 8일까지 신청분은 당월에 적용하며, 이후 신청분은 차월 납기부터 적용합니다.</li>
                      <li class="dot">메시지 전송일은 요금결정 다음날인 12일 전·후이며 변경될 수 있습니다.</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));

    this.afterRender();
  }

  // 기본 설정값은 여기에서 랜더링 해야 한다.
  afterRender() {
    this.toggleGubun(this.state.requestInfo.gubun);
    this.handleMethod(this.state.requestInfo.method);

    this.setEventListeners();
  }

  renderDescription(target: any) {
    const that = this;
    let desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="펼치기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div class="form-mw-box display-none row">
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>유의사항</span></div>
              <p>향상된 수준의 서비스를 제공하기 위해 동일 내용 단문 서비스(납부일, 검침결과 안내)는 본 서비스로 대체합니다.</p>
              <p>시스템오류, 통신장애, 문자 수신 설정 상태, 데이터 상태, 휴대폰 사용 정지, 전원 상태 등으로 메세지 수신이 불가할 수 있습니다.</p>
              <p>전화번호 변경, 전· 출입 시 신고하여야 하며, 전출 시 신청 지연 및 신청내용 오류로인하여 신청자 또는 제3자에게 발생된 사태나 손해에 대하여 서비스 기관에 책임이없으며 이를 예방하기 위해 직권해지 할 수 있습니다.</p>
              <p>매 월 8일까지 신청 분에 한 해 당 월 적용하며, 이 후 신청 분은 차월 납기부터 적용합니다.</p>
    
              <div class="tit-mw-h5 row"><span>신청방법</span></div>
              <p>전화신청: 다산콜센터(국번없이 120), 수도사업소(본인과의 통화내용 녹취로 본인 인증 후 신청)</p>
              <p>인터넷신청 : 상수도 홈페이지(온라인)민원신청(휴대폰으로 본인 인증 후 신청) ※ 추후 공공아이핀 인증 예정</p>
     `;
    if(that.state.description.minwonReqstDc){
      desc += `
                <div class="tit-mw-h5 row"><span>처리기간</span></div>
                <p>${that.state.description.minwonReqstDc}</p>
      `;
    }
    if(that.state.description.minwonGde){
      desc += `
                <div class="tit-mw-h5 row"><span>처리부서</span></div>
                <p>${that.state.description.minwonGde}</p>
      `;
    }
    if(that.state.description.presentnPapers){
      desc += `
                <div class="tit-mw-h5 row"><span>신청서류</span></div>
                <p>${that.state.description.presentnPapers}</p>
      `;
    }
      desc += `
              <div class="tit-mw-h5 row"><span>민원편람</span></div>
              <a href="${that.state.description.minwonGudUrl}" target="_blank" class="txBlue" style="display:inline-block;float:right">민원편람 바로가기</a>
            </div>
          </div>
        </div><!-- // info-mw -->
      `;
    target.innerHTML = desc;
  }
}