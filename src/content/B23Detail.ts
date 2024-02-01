import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { radioMW, phoneNumberInputValidation, citizenAlert, citizen_alert, citizenConfirm, maskingFnc, mobilePattern } from './../util/uiux-common';

declare var gContextUrl: string;
declare var $: any;
declare var fncAlertAjaxErrMsg: (code: string) => string;
declare var cyberMinwon: CyberMinwon;

export default class B23DetailPage {
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any;
      statusInfo: any;
      orgReqInfo: string;
      orgServiceTelno: string;
      requestInfo: {
        reqGbn: string; // 신청구분 신규, 변경, 해지
        reqGbnNm: string; // 신청구분 신규, 변경, 해지
        reqInfo: string;  // 신규 - 신청정보(안내방법) : 1 - 문자음성변환용 안내문 전송, 3 - 점자안내문 우편발송
        reqInfoNm: string; //신규 - 신청정보명(안내방법) : 1 - 문자음성변환용 안내문 전송, 3 - 점자안내문 우편발송
        serviceTelno: string; //신규 - 안내받을 번호
      },
      viewRequestInfo: any;
      description: any;
  };
  path: string;
  
  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {},
      orgReqInfo: '',
      orgServiceTelno: '',
      requestInfo: {
        reqGbn: '',   // 신청구분 신규, 변경, 해지
        reqGbnNm: '',   // 신청구분명 신규, 변경, 해지 15
        reqInfo: '',   //신규 - 신청정보(안내방법) : 1 - 문자음성변환용 안내문 전송, 3 - 점자안내문 우편발송
        reqInfoNm: '',   //신규 - 신청정보명(안내방법) : 1 - 문자음성변환용 안내문 전송, 3 - 점자안내문 우편발송
        serviceTelno: ''  //신규 - 안내받을 번호
      },
      viewRequestInfo: {},
      description: {}
    };

    this.setInitValue();
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        reqGbn: '',   // 신청구분 신규, 변경, 해지
        reqGbnNm: '',   // 신청구분명 신규, 변경, 해지 15
        reqInfo: '',   //신규 - 신청정보(안내방법) : 1 - 문자음성변환용 안내문 전송, 3 - 점자안내문 우편발송
        reqInfoNm: '',   //신규 - 신청정보명(안내방법) : 1 - 문자음성변환용 안내문 전송, 3 - 점자안내문 우편발송
        serviceTelno: ''  //신규 - 안내받을 번호
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
    const that = this.state.requestInfo;
    let reqGbnNm = that.reqGbnNm;
    let reqInfoNm = that.reqInfo === "1" ? "문자음성변환용 안내문 전송" : "점자안내문 우편발송";
    let serviceTelno = that.serviceTelno;
    
    if(that.reqGbn === "3"){
      return {
        noinfo: {
          reqGbn: [reqGbnNm, '신청구분'],
        }
      };
    }else{
      if(that.reqInfo === "1"){
        return {
          noinfo: {
            reqGbn: [reqGbnNm, '신청구분'],
            reqInfo: [that.reqGbn === '3'? '' : reqInfoNm, '안내방법'],
            telno: [ maskingFnc.telNo(serviceTelno,"*"), '연락처']
          }
        };
      }else{
        return {
          noinfo: {
            reqGbn: [reqGbnNm, '신청구분'],
            reqInfo: [that.reqGbn === '3'? '' : reqInfoNm, '안내방법'],
          }
        };
      }
    }
    
    
    
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const that = this.state.requestInfo;
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    
    let resultTitle = this.state.description.minwonNm.substring(0,this.state.description.minwonNm.indexOf("신청")) + that.reqGbnNm;
    const resultData = this.state.submitResult;
    const resultList = resultData.errorMsg.split(',');
    // 신청 실패 화면
    if (!this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: resultTitle+' 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo ? resultData.data.receiptNo : '-', '접수번호'], 
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
        desc: [`[${resultList[1]}]로 비정상 처리 되었습니다.<br>아래 수도사업소 또는 서울아리수본부에 문의해 주십시오.`, '신청결과'],
      }
    // 성공
    } else {
      infoData['noinfo'] = {
//        title:  resultTitle+' 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt, '신청일자'],
        desc: ['정상적으로 신청되었습니다.', '신청결과']
      }
    }
    
    return infoData;
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;

    
    if (!requestInfo.reqGbn) {
      citizenAlert("신청구분을 선택해 주세요.");
      
      return false;
    }
    
    if (!requestInfo.reqInfo) {
      citizenAlert("신청정보명(안내방법)을 선택해 주세요.");
      
      return false;
    }
    if (requestInfo.reqGbn !== "3" && requestInfo.reqInfo == "1" && !requestInfo.serviceTelno) {
      citizenAlert("연락처를 입력해 주세요.").then(result => {
        if(result){
          $("#serviceTelno").focus();
        }
      });
      return false;
    }
    if(requestInfo.reqGbn !== "3" && requestInfo.reqInfo == "1" && requestInfo.serviceTelno.length > 0 && mobilePattern.test(requestInfo.serviceTelno) !== true){
      citizenAlert("연락처가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.").then(result => {
        if(result){
          $("#serviceTelno").focus();
        }        
      });
      return false;
    }
    
    return true;
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubunTy:string, columnNm:string, value:string) {
    var id = "#"+columnNm+value;
    var idNm = columnNm+"Nm";
    var idNmVal = $(id).children().text();
    var classNm = "."+gubunTy;
    
    //disble처리
    if($(id).hasClass("disable")){
      return false;
    }
    
    if(id === "#reqGbn1" || id === "#reqGbn2"){
      $(".bGubun").removeClass("disable");
      $("#serviceTelno").attr("disabled", false);
      if(this.state.requestInfo.reqInfo === "1"){
        radioMW("#reqInfo1", ".bGubun");
        $("#serviceTelno").val(this.state.requestInfo.serviceTelno);
        $("#serviceTelno").attr("disabled", false);
        $("#serviceTelno").focus();
        $("#serviceTelno").parent().show();
        $("#reqInfo3InfoText").hide();
      } else {
        radioMW("#reqInfo3", ".bGubun");
        $("#serviceTelno").attr("disabled", true);
        $("#serviceTelno").parent().hide();
        $("#reqInfo3InfoText").show();
      }
    }else if(id === "#reqGbn3"){
      $(".bGubun").addClass("disable");
      $("#serviceTelno").val("");
      $("#serviceTelno").attr("disabled", true);
      $("#serviceTelno").parent().hide();
      $("#reqInfo3InfoText").hide();
    }
    
    if(id === "#reqInfo3"){
      $("#serviceTelno").attr("disabled", true);
      $("#serviceTelno").parent().hide();
      $("#reqInfo3InfoText").show();
    }else if(id === "#reqInfo1"){
      $("#serviceTelno").val(this.state.requestInfo.serviceTelno);
      $("#serviceTelno").attr("disabled", false);
      $("#serviceTelno").focus();
      $("#serviceTelno").parent().show();
      $("#reqInfo3InfoText").hide();
    }
    
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [columnNm] : value,
        [idNm] : idNmVal
      }
    });
    radioMW(id, classNm);
  }
  
  //
  handleChangeServiceTelno(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        serviceTelno: e.target.value.replace(/[^0-9]/g, "").substring(0,11)
      }
    });
    e.target.value = this.state.requestInfo.serviceTelno.substring(0,11);
    phoneNumberInputValidation(e.target, 11, mobilePattern);
  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyBlind.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert(that.state.description.minwonNm+"이 정상적으로 처리되지 않았습니다.");
        return;
      }
      that.setState({
        ...that.state,
        isSubmitSuccessful: data.resultCd === '00' ? true : false,
        submitResult: data
      });

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');

    });
  }

  getQueryString() {

    const requestInfo = this.state.requestInfo;
    const orgReqInfo = this.state.orgReqInfo;
    const orgServiceTelno = this.state.orgServiceTelno;
    const reqGbn = requestInfo.reqGbn;
    const reqGbnNm = requestInfo.reqGbnNm;
    let requestData = {};
    if(reqGbn === "1"){
      requestData = {
        'reqGbn': reqGbnNm,
        'newReqInfo': requestInfo.reqInfo,
        'newServiceTelno': requestInfo.serviceTelno,
        'orgReqInfo': orgReqInfo,
        'orgServiceTelno': orgServiceTelno
      };
    }else if(reqGbn === "2"){
      requestData = {
        'reqGbn': reqGbnNm,
        'chnReqInfo': requestInfo.reqInfo,
        'chnServiceTelno': requestInfo.serviceTelno,
        'orgReqInfo': orgReqInfo,
        'orgServiceTelno': orgServiceTelno
      };
    }else{
      requestData = {
        'reqGbn': reqGbnNm,
        'orgReqInfo': orgReqInfo,
        'orgServiceTelno': orgServiceTelno
      };
    }

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...requestData
    };
  }
  
  getStatusString() {
//    const that = this;
  }


  render() {
    const that = this;
//    that.getDescription();
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
      <!-- 시각장애인 요금 안내 서비스 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청구분을 선택해 주세요.</span></label>
                <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
                  <li id="reqGbn1" class="aGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'reqGbn', '1');"><span>신규</span></a>
                  </li>
                  <li id="reqGbn2" class="aGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'reqGbn','2');"><span>변경</span></a>
                  </li>
                  <li id="reqGbn3" class="aGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'reqGbn','3');"><span>해지</span></a>
                  </li>
                </ul>
              </li>
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>안내방법을 선택해 주세요.</span></label>
                <ul class="mw-opt mw-opt-2 row">
                  <li id="reqInfo1" class="bGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('bGubun', 'reqInfo', '1');"><span>문자음성변환 안내문</span></a>
                  </li>
                  <li id="reqInfo3" class="bGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('bGubun', 'reqInfo','3');"><span>점자안내문 우편발송</span></a>
                  </li>
                </ul>
                <p class="pre-star tip-red" id="reqInfo3InfoText" style="display:none;">신청인의 주소로 안내 우편이 발송됩니다.</p>
              </li>
              <li style="display:none;">
                <label class="input-label"><span class="form-req"><span class="sr-only">필수</span>연락처</span></label>
                <input type="text" name="serviceTelno" id="serviceTelno" class="input-box input-w-2" title="연락처" maxlength="13"
                  value="${that.state.requestInfo.serviceTelno}" placeholder="'-' 없이 번호입력"
                  onkeyup="${that.path}.handleChangeServiceTelno(event)"
                  onchange="${that.path}.handleChangeServiceTelno(event)">
              </li>
  
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    
    this.afterRender();
  }
  
  // 기본 설정값은 여기에서 랜더링 해야 한다.
  afterRender() {
    const that = this;
    var mgrNo = that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
    let reqGbn = that.state.requestInfo.reqGbn;
    let reqInfo = that.state.requestInfo.reqInfo;
    if(mgrNo){
      
      $.ajax({
        url : "/citizen/common/ntceVisualDisabledByMgrNo.do",
        type : 'post',
        async : false,
        data : {
          "mkey" : mgrNo
        },
        dataType : 'json',
        error : function(xhr:any, status:any, error:any) {
          fncAlertAjaxErrMsg(xhr);
        },
        success : function(data:any) {
          const business = data.business;
          
          if(reqGbn == "1"){
            $("#reqGbn1").removeClass("disable");
            $("#reqGbn1").removeClass("off");
            $("#reqGbn1").addClass("on");
            $("#reqGbn2, #reqGbn3").addClass("disable");
            $("#reqGbn2, #reqGbn3").removeClass("on");
            $("#reqGbn2, #reqGbn3").addClass("off");
          }else if(reqGbn == "2"){
            $("#reqGbn1").addClass("disable");
            $("#reqGbn1, #reqGbn3").removeClass("on");
            $("#reqGbn1, #reqGbn3").addClass("off");
            $("#reqGbn2").removeClass("disable");
            $("#reqGbn2").removeClass("off");
            $("#reqGbn2").addClass("on");
          }else if(reqGbn == "3"){
            $("#reqGbn1").addClass("disable");
            $("#reqGbn1, #reqGbn2").removeClass("on");
            $("#reqGbn1, #reqGbn2").addClass("off");
            $("#reqGbn3").removeClass("disable");
            $("#reqGbn3").removeClass("off");
            $("#reqGbn3").addClass("on");
            $(".bGubun").addClass("disable");
            $("#serviceTelno").attr("disabled", true);
          }else{
            if(business === "" || business.bodyVO.nowStatusCd === "03"){
              //신청 내용이 없거나 해지 상태
              $("#reqGbn1").removeClass("disable");
              $("#reqGbn1").removeClass("off");
              $("#reqGbn1").addClass("on");
              $("#reqGbn2, #reqGbn3").addClass("disable");
              $("#reqGbn2, #reqGbn3").removeClass("on");
              $("#reqGbn2, #reqGbn3").addClass("off");
              reqGbn = "1";
              reqInfo = "1";
            }else{
              //기 신청, 변경 상태
              $("#reqGbn1").addClass("disable");
              $("#reqGbn1, #reqGbn3").removeClass("on");
              $("#reqGbn1, #reqGbn3").addClass("off");
              $("#reqGbn2").removeClass("disable");
              $("#reqGbn2").removeClass("off");
              $("#reqGbn2").addClass("on");
              reqGbn = "2";
              reqInfo = "1";
            }
          }
          let reqGbnNm = "";
          if(reqGbn == "1"){
            reqGbnNm = "신규";
          }else if(reqGbn == "2"){
            reqGbnNm = "변경";
          }else if(reqGbn == "3"){
            reqGbnNm = "해지";
          }
          
          that.toggleUIGubun('bGubun','reqInfo',reqInfo);
          
          that.setState({
            ...that.state,
            orgReqInfo: business ? business.bodyVO.reqFormCd.substring(1,2) : "",
            orgServiceTelno: business ? business.bodyVO.smsSvcMtel : "",
            requestInfo: {
              ...that.state.requestInfo,
              reqGbn: reqGbn,
              reqGbnNm: reqGbnNm,
              reqInfo: reqInfo,
              serviceTelno: !that.state.requestInfo.serviceTelno ? that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile : that.state.requestInfo.serviceTelno
            }
          });
          $("#serviceTelno").val(that.state.requestInfo.serviceTelno);
        }
      });
    }
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
    `;
    if(that.state.description.minwonHow){
      desc += `
                <div class="tit-mw-h5 row"><span>신청방법</span></div>
                <p>${that.state.description.minwonHow}</p>
      `;
    }
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
    if(that.state.description.mtinspGde){
      desc += `
                <div class="tit-mw-h5 row"><span>관련법규</span></div>
                <p>${that.state.description.mtinspGde}</p>
      `;
    }
    desc += `
              <div class="tit-mw-h5 row"><span>안내방법</span></div>
              <div class="info-mw-list">
                <ul>
                  <li style="margin-left:0px;">안내시기  <br />
                       - 문자메시지 전송 : 16일 14시 <br />
                       - 점자안내문 발송 : 17 ~21일
                  </li>
                  <li style="margin-left:0px;">시각장애인이 신청한 방법으로 안내합니다.</li>
                  <li style="margin-left:0px;">수도요금청구서는 별도로 발송합니다.</li>
                </ul>
              </div>
    `;
    if(that.state.description.minwonProcedure){
      desc += `
                <div class="tit-mw-h5 row"><span>처리절차</span></div>
                <p>${that.state.description.minwonProcedure}</p>
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