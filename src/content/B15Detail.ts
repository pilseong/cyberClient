import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { radioMW, citizenAlert, citizen_alert, citizenConfirm, maskingFnc, phoneNumberInputValidation, phonePattern, mobilePattern  } from './../util/uiux-common';

declare var gContextUrl: string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class B15DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      statusInfo: any;
      requestInfo: {
        gcReqGubun: string;//신청 구분  (1:신규, 2:변경, 3:해지 )
        gumInfoTy: string;//안내 방법 (0:알림, 1:음성안내, 2:미사용, 3:문자안내 )
        gumTelTy: string;//검침일 안내연락처 (0:일반전화, 1:휴대폰 ) 
        agreeYn: string;//확인사항 확인 여부
        
        //신청인 정보에서 가져오는 값들
        reqTel: string;//신청자 전화
        reqMobile: string;//신청자 휴대폰
        reqEmail: string;//신청자 EMail
        relation: string;//관계
      };
      description: any;
      
      viewRequestInfo: any;
      isSubmitSuccessful: boolean;
      submitResult: any,
  };
  constructor(parent:any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {},
      requestInfo: {
    	  gcReqGubun: '',
    	  gumInfoTy: '',
    	  gumTelTy: '',
    	  agreeYn: '',
    	  reqTel: '',
    	  reqMobile: '',
    	  reqEmail: '',
    	  relation: '',
      },

      description: {},
      viewRequestInfo: {},
      isSubmitSuccessful: false,
      submitResult: {},
    };
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';

    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        gcReqGubun: '',
        gumInfoTy: '',
        gumTelTy: '',
        agreeYn: '',
        reqTel: '',
        reqMobile: '',
        reqEmail: '',
        relation: ''
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
  	const that = this;
    var infoArray;
    
    var gcReqGubun;//신청 구분
    if(this.state.requestInfo.gcReqGubun == "1"){
      gcReqGubun = "신규";
    } else if(this.state.requestInfo.gcReqGubun == "2"){
      gcReqGubun = "변경";
    } else {//"3"
      gcReqGubun = "해지";
    }
    
    var gumInfoTy;//안내 방법
    if(this.state.requestInfo.gumInfoTy == "0"){
      gumInfoTy = "알림톡";
    } else if(this.state.requestInfo.gumInfoTy == "3"){
      gumInfoTy = "문자안내";
    } else {//"1"
      gumInfoTy = "음성안내";
    }
    
    var gumTelTy = this.state.requestInfo.gumTelTy == "0" ? "일반전화" : "휴대전화";//안내 연락처 구분
    var gumTelNo = this.state.requestInfo.gumTelTy == "0" ? this.state.requestInfo.reqTel : this.state.requestInfo.reqMobile;//안내 연락처
     
    if(this.state.requestInfo.gcReqGubun === "3"){
      infoArray =  {
        noinfo: {
//          title: this.state.description.minwonNm,
          gcReqGubun: [gcReqGubun, "신청 구분"],
        }
      }
    }else{
      infoArray =  {
        noinfo: {
//          title: this.state.description.minwonNm,
          gcReqGubun: [gcReqGubun, "신청 구분"],
          gumInfoTy: [gumInfoTy, "안내 방법"],
          gumTelTy: [gumTelTy+" "+maskingFnc.telNo(gumTelNo, "*"), "연락처"]
        }
      }
    }
		
  	return infoArray;
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    const resultData = this.state.submitResult;
    const resultList = resultData.errorMsg.split(',');
    // 신청 실패 화면
    if (!this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: this.state.description.minwonNm+' 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo ? resultData.data.receiptNo : '-', '접수번호'], 
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt?resultData.data.applyDt:applyDt, '신청일시'],
        desc: [`[${resultList[1]}]로 비정상 처리 되었습니다.<br>아래 수도사업소 또는 서울아리수본부에 문의해 주십시오.`, '신청결과'],
//        cause: [resultData.errorMsg,'사유']
      }
    // 성공
    } else {
      infoData['noinfo'] = {
//        title:  this.state.description.minwonNm+' 결과',
        width: "150px",
        receipt_no : [resultData.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [resultData.data.applyDt, '신청일시'],
        desc: ['정상적으로 신청되었습니다.', '신청결과']
      }
    }
    
    return infoData;
  }
  
  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;

  	if(!requestInfo.gcReqGubun){
  		citizenAlert("신청 구분을 선택해 주세요.").then(result => {
        if(result){
      		$("#gcReqGubun").focus();
        }
      });
  		return false;
  	}else if(!requestInfo.gumInfoTy && this.state.requestInfo.gcReqGubun !== "3"){
  		citizenAlert("안내 방법을 선택해 주세요.").then(result => {
        if(result){
          $("#gumInfoTy").focus();
        }
      });
      return false;
  	}else if(!requestInfo.gumTelTy && this.state.requestInfo.gcReqGubun !== "3"){
  		citizenAlert("연락처 선택해 주세요.").then(result => {
        if(result){
          $("#gumTelTy").focus();
        }
      });
      return false;
    }else if(requestInfo.gumTelTy == '0' && !requestInfo.reqTel && this.state.requestInfo.gcReqGubun !== "3"){
      citizenAlert("전화번호를 입력해 주세요.").then(result => {
        if(result){
          $("#reqTel").focus();
        }
      });
      return false;
    }else if(requestInfo.gumTelTy == '1' && !requestInfo.reqMobile && this.state.requestInfo.gcReqGubun !== "3"){
      citizenAlert("휴대전화 번호를 입력해 주세요.").then(result => {
        if(result){
          $("#reqMobile").focus();
        }
      });
      return false;
    }else if(requestInfo.gumTelTy == '0' && this.state.requestInfo.reqTel && phonePattern.test(this.state.requestInfo.reqTel) !== true && this.state.requestInfo.gcReqGubun !== "3"){
      citizenAlert("전화번호가 형식에 맞지 않습니다. 지역번호를 포함한 정확한 전화번호를 입력해 주세요.").then(result => {
        if(result){
          $("#reqTel").focus();
        }
      });
      return false;
    }else if(requestInfo.gumTelTy == '1' && this.state.requestInfo.reqMobile && mobilePattern.test(this.state.requestInfo.reqMobile) !== true && this.state.requestInfo.gcReqGubun !== "3"){
      citizenAlert("휴대전화 번호가 형식에 맞지 않습니다. 확인 후 다시 입력해 주세요.").then(result => {
        if(result){
          $("#reqMobile").focus();
        }
      });
      return false;
    }else if(requestInfo.agreeYn != "Y" && this.state.requestInfo.gcReqGubun !== "3"){
      citizenAlert("검침일 안내문 수신에 동의해 주세요.").then(result => {
        if(result){
          $("#agreeYn").focus();
        }
      });
      return false;
    }
    
    return true;
  }
  
  // 신청인 전화번호 연동
  handleReqTel(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reqTel: e.target.value.replace(/[^0-9]/g,"").substring(0, 12)
      }
    });
    e.target.value = this.state.requestInfo.reqTel.substring(0, 12);
    if(this.state.requestInfo.reqTel.length === 0){
      e.target.classList.remove("success","err");
    } else {
      phoneNumberInputValidation(e.target, 12, phonePattern);
    }
  }
  
  // 신청인 휴대번호 연동
  handleReqMobile(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reqMobile: e.target.value.replace(/[^0-9]/g,"").substring(0, 11)
      }
    });
    e.target.value = this.state.requestInfo.reqMobile.substring(0, 11);
    if(this.state.requestInfo.reqMobile.length === 0){
      e.target.classList.remove("success","err");
    } else {
      phoneNumberInputValidation(e.target, 11, mobilePattern);
    }
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubunTy:string, columnNm:string, value:string) {
    var id = "#"+gubunTy+value;
    var classNm = "."+gubunTy;
	  //disble처리
	  if($(id).hasClass("disable")){
		  return false;
	  }
	  
	  this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [columnNm] : value
      }
    });
	  
	  this.render();
  }
  
  //확인사항 동의여부(agreeYn)
  handleAgreeYn(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.checked ? "Y" : ""
        }
      });
    }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyReadMtrDe.do";
    const sendData = this.getQueryString();
    

    fetch('POST', url, sendData, function (error:any, data:any) {
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

	const readmtrDeObjcData = {
			gcReqGubun: requestInfo.gcReqGubun,//검침일안내신청구분  (1:신규, 2:변경, 3:해지 )
			gumInfoTy: requestInfo.gcReqGubun=='3'?'2':requestInfo.gumInfoTy,//안내 방법 (0:알림, 1:음성안내, 2:미사용, 3:문자안내 )
			gumTelTy: requestInfo.gcReqGubun=='3'?'0':requestInfo.gumTelTy,//검침일 안내연락처 (0:일반전화, 1:휴대폰 )
			
			reqTel: requestInfo.reqTel,//신청자 일반전화
			reqMobile: requestInfo.reqMobile,//신청자 휴대전화
			reqEmail: requestInfo.reqEmail,//신청자 전자우편
			relation: requestInfo.relation,//관계
	}
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...readmtrDeObjcData
    };
  }
  
  getStatusString() {
    
  }


  render() {
  	const that = this;

  	
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
      <!-- 검침일 안내 서비스 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청 구분을 선택해 주세요.</span></label>
		            <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
			            <li id="aGubun1" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'gcReqGubun', '1');"><span>신규</span></a>
			            </li>
			            <li id="aGubun2" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'gcReqGubun', '2');"><span>변경</span></a>
			            </li>
			            <li id="aGubun3" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('aGubun', 'gcReqGubun', '3');"><span>해지</span></a>
			            </li>
		            </ul>
	            </li>
	            <li>
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>안내 방법을 선택해 주세요.</span></label>
		            <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
			            <li id="bGubun0" class="bGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('bGubun', 'gumInfoTy', '0');"><span>알림톡</span></a>
			            </li>
			            <li id="bGubun3" class="bGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('bGubun', 'gumInfoTy', '3');"><span>문자안내</span></a>
			            </li>
			            <li id="bGubun1" class="bGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('bGubun', 'gumInfoTy', '1');"><span>음성안내</span></a>
			            </li>
		            </ul>
	            </li>
	            <li>
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>연락처를 선택해 주세요.</span></label>
		            <ul class="mw-opt mw-opt-6 row">
			            <li id="cGubun0" class="cGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('cGubun', 'gumTelTy', '0');"><span>전화번호</span></a>
			            </li>
			            <li id="cGubun1" class="cGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('cGubun', 'gumTelTy', '1');"><span>휴대전화</span></a>
			            </li>
		            </ul>
	            </li>
	            <li id="telArea" style="display:none" >
	              <label for="reqTel" class="input-label"><span class="form-req"><span class="sr-only">필수</span>전화번호</span></label>
		            <input value="${that.state.requestInfo.reqTel}" maxlength="12"
                  onkeyup="${that.path}.handleReqTel(event)"
                  onpaste="${that.path}.handleReqTel(event)"
                  type="text" id="reqTel" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
	            </li>
	            <li id="mobileArea" style="display:none">
	              <label for="reqMobile" class="input-label"><span class="form-req"><span class="sr-only">필수</span>휴대전화</span></label>
		            <input value="${that.state.requestInfo.reqMobile}" maxlength="12"
                  onkeyup="${that.path}.handleReqMobile(event)"
                  onpaste="${that.path}.handleReqMobile(event)"
                  type="text" id="reqMobile" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
	            </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      
      <div id="gumInfoAgreeDiv" class="mw-box">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="닫기">
            <span class="i-53">민원 신청 안내 및 동의</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul class="policy2">
                <li class="agree-more">
                  <label><span class="sr-only">검침일 안내문 확인</span></label>
                  <input type="checkbox" name="agreeYn" id="agreeYn" 
                    onclick="${that.path}.handleAgreeYn(event)"
                    ${that.state.requestInfo.agreeYn ? 'checked' : ''}>
                    <label class="chk-type" for="agreeYn"><span>안내문을 확인하였고, 검침일 안내문 수신을 동의합니다.<p class="tx-opt">(필수)</p></span></label>
                    <div class="p-depth-1 bd-gray">
                      <ul>
                        <li>우리집 수도계량기의 검침일을 알려드리는 서비스입니다.</li>
                        <li>검침일 안내는 검침일(수도요금 납기 전월 21일 ~ 당월 8일) 3일 전 발송됩니다.</li>
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
  
  //상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
  afterRender() {
    const that = this;
    var mgrNo = that.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
    $.ajax({
      url : "/citizen/common/gcApplyYNByMgrNo.do",
      type : 'post',
      async : false,
      data : {"mkey":mgrNo},
      dataType : 'json',
      error : function(xhr:any, status:any, error:any){
        citizenAlert(error);
      },
      success : function(data:any){
        var gcNowStatus = data.business.bodyVO.gcNowStatus;
        
        //신청 구분 disabled제어
        if(gcNowStatus=="Y"){//이미 검침일 안내 신청되어있는 상태
          $("#aGubun1").addClass("disable");
          $("#aGubun1").removeClass("on");
          $("#aGubun1").addClass("off");
          if(that.state.requestInfo.gcReqGubun !== "3"){
            that.setState({
              ...that.state,
              requestInfo: {
                ...that.state.requestInfo,
                gcReqGubun: "2"//'변경'입력
              }
            });
          }
          
          
        }else if(gcNowStatus=="N"){//검침일 안내 신청 안되어있는 상태,신규접수
          $("#aGubun2, #aGubun3").addClass("disable");
          $("#aGubun2, #aGubun3").removeClass("on");
          $("#aGubun2, #aGubun3").addClass("off");
          that.setState({
            ...that.state,
            requestInfo: {
              ...that.state.requestInfo,
              gcReqGubun: "1"//'신규'입력
            }
          });

        }       
      }
   });
    
    //신청 구분  (1:신규, 2:변경, 3:해지 )
    var gcReqGubun = that.state.requestInfo.gcReqGubun;
    $("#aGubun"+gcReqGubun).addClass("on");
    $("#aGubun"+gcReqGubun).removeClass("off");
    
    if(gcReqGubun === "3"){
      $("#gumInfoAgreeDiv").hide();
      $("#telArea").css('display', 'none');
      $("#mobileArea").css('display', 'none');
      
      $(".bGubun").addClass("disable");
      $(".cGubun").addClass("disable");
    }else{
      $("#gumInfoAgreeDiv").show();
      $(".bGubun").removeClass("disable");
      $(".cGubun").removeClass("disable");
      
      //안내 방법 (0:알림, 1:음성안내, 2:미사용, 3:문자안내 )
      var gumInfoTy = that.state.requestInfo.gumInfoTy;
      $("#bGubun"+gumInfoTy).addClass("on");
      $("#bGubun"+gumInfoTy).removeClass("off");
      if("#bGubun"+gumInfoTy == "#bGubun0" || "#bGubun"+gumInfoTy == "#bGubun3"){
        $("#cGubun0").addClass("disable");
        $("#cGubun1").addClass("on");
        $("#cGubun1").removeClass("off");
        $("#telArea").css('display', 'none');
        $("#mobileArea").css('display', 'block');
        that.setState({
        ...that.state,
        requestInfo: {
          ...that.state.requestInfo,
          gumTelTy: '1',
        }
      });
      }else{
        //검침일 안내연락처 (0:일반전화, 1:휴대폰 )
        var gumTelTy = that.state.requestInfo.gumTelTy;
        $("#cGubun"+gumTelTy).addClass("on");
        $("#cGubun"+gumTelTy).removeClass("off");
        
        if("#cGubun"+gumTelTy == "#cGubun0"){
          $("#telArea").css('display', 'block');
          $("#mobileArea").css('display', 'none');
          phoneNumberInputValidation($("#reqTel")[0], 12, phonePattern);
        }else if("#cGubun"+gumTelTy == "#cGubun1"){
          $("#telArea").css('display', 'none');
          $("#mobileArea").css('display', 'block');
          phoneNumberInputValidation($("#reqMobile")[0], 11, mobilePattern);
        }
      }
      
      //확인사항 확인 여부
      if(that.state.requestInfo.agreeYn == "Y"){
        $("#agreeYn").prop("checked", true);
      }
    }
    
    
    var applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    var relation = !applyInfo.applyRelation2 ? applyInfo.applyRelation+"의 " + applyInfo.applyRelation1 : applyInfo.applyRelation+"의 " + applyInfo.applyRelation2;
    
    let phoneNo = that.state.requestInfo.reqTel?that.state.requestInfo.reqTel:applyInfo.applyPhone;
    let mobileNo = that.state.requestInfo.reqMobile?that.state.requestInfo.reqMobile:applyInfo.applyMobile;
    $("#reqTel").val(phoneNo);
    $("#reqMobile").val(mobileNo);
    that.setState({
      ...that.state,
      requestInfo: {
        ...that.state.requestInfo,
        reqTel: phoneNo,//신청인 전화
        reqMobile: mobileNo,//신청인 휴대폰
        reqEmail: applyInfo.applyEmailId,//신청인 이메일
        relation: relation//관계
      }
    });
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