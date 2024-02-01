import CyberMinwon from '../infra/CyberMinwon';
import { fetch, fetchMultiPart } from './../util/unity_resource';
import { radioMW, citizenAlert, citizen_alert, citizenConfirm, maskingFnc } from './../util/uiux-common';
declare var fncCutByByte: (str: string, maxByte: number) => string;

declare var gContextUrl: string;
declare var $: any;
declare var gVariables: any;
declare var fncAlertAjaxErrMsg: (code: string) => string;
declare var cyberMinwon: CyberMinwon;

export default class I06DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any;
      statusInfo: any;
      minwonGubun: string;//민원구분 (B06/B07)
      closeYn: string;//입력된 수용가의 굽수 중지여부(Y:중지중,N:중지상태아님)
      requestInfo: {
        companyNm: string; // 상호(기관)명
        meterDial: string;   // 계량기지침
        reason: string;  // 급수중지(해제)사유
        closeDtFrom: string; //급수중지기간(시작)
        closeDtTo: string; //급수중지기간(끝)
      },
      viewRequestInfo: any;
      description: any;
  };
  constructor(parent:any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {},
      minwonGubun: "",//민원구분 (B06/B07)
      closeYn: "",//입력된 수용가의 굽수 중지여부(Y:중지중,N:중지상태아님)
      requestInfo: {
    	  companyNm: "",//상호(기관)명
    	  meterDial: "",//계량기지침
    	  reason: "",//급수중지(해제)사유
    	  closeDtFrom: "",//급수중지기간(시작)
    	  closeDtTo: ""//급수중지기간(끝)
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
      requestInfo: {
        companyNm: "",//상호(기관)명
        meterDial: "",//계량기지침
        reason: "",//급수중지(해제)사유
        closeDtFrom: "",//급수중지기간(시작)
        closeDtTo: ""//급수중지기간(끝)
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
			
  	if(that.state.minwonGubun == "B06"){
      var infoArray;
  		infoArray =  {
  	  			noinfo: {
  	  	    		minwonNm: ["급수중지 신청", "신청구분"],
  	  	    		companyNm: [this.state.requestInfo.companyNm, "상호명"],//상호(기관)명
  	  	  			meterDial: [this.state.requestInfo.meterDial, "계량기지침"],//계량기지침
	  	  	  		closeDtFrom: [this.state.requestInfo.closeDtFrom, "급수중지 시작일"],//급수중지 시작일
	  				closeDtTo: [this.state.requestInfo.closeDtTo, "급수중지 종료일"],//급수중지 종료일
  	  			    reason: [this.state.requestInfo.reason, "급수중지 사유"]//급수중지(해제) 사유
  	  	    	}
  	  	}
  	} else {
  		infoArray = {
  	  			noinfo: {
                minwonNm: ["급수중지 해제 신청", "신청구분"],
  	  	    		companyNm: [this.state.requestInfo.companyNm, "상호명"],//상호(기관)명
  	  	  			meterDial: [this.state.requestInfo.meterDial, "계량기지침"],//계량기지침
  	  			    reason: [this.state.requestInfo.reason, "급수중지 해제 사유"]//급수중지(해제) 사유
  	  	    	}
  	  	}
  	}
  	
  	return infoArray;
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const requestInfo = this.state.requestInfo;
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    const minwonGubun = this.state.minwonGubun;
    
    // 신청 실패 화면
    if (!this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: minwonGubun === "B06"? '급수중지 신청': '급수중지 해제 신청' + ' 결과',
        width: "150px",
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [this.state.submitResult.data.applyDt?this.state.submitResult.data.applyDt:applyDt, '신청일시'],
        desc: ['정상적으로 처리되지 않았습니다.', '신청결과'],
        cause: [this.state.submitResult.errorMsg,'사유']
      }
    // 성공
    } else {
      infoData['noinfo'] = {
//        title:  minwonGubun === "B06"? '급수중지 신청': '급수중지 해제 신청' + ' 결과',
        width: "150px",
        receipt_no : [this.state.submitResult.data.receiptNo, '접수번호'],
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [this.state.submitResult.data.applyDt, '신청일시'],
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

    if(this.state.minwonGubun == "B06"){
    	if(!requestInfo.meterDial){
        citizenAlert("현재지침을 입력해 주세요.").then(result => {
        if(result){
            $("#meterDial").focus();
          }
        });
        return false;
      }
    	if(!requestInfo.closeDtFrom){
        citizenAlert("급수중지 시작일을 입력해 주세요.").then(result => {
        if(result){
            $("#closeDtFrom").focus();
          }
        });
        return false;
    	}
    	
    	if(!requestInfo.closeDtTo){
        citizenAlert("급수중지 종료일을 입력해 주세요.").then(result => {
        if(result){
            $("#closeDtTo").focus();
          }
        });
        return false;
    	}
    	
    	let closeDtFrom = requestInfo.closeDtFrom.replace(/[^0-9]/g,"")
    	let closeDtTo = requestInfo.closeDtTo.replace(/[^0-9]/g,"")
      if(Number(closeDtFrom) < 10000101 || Number(closeDtFrom) > 21001231 || Number(closeDtTo) < 10000101 || Number(closeDtTo) > 21001231){
        citizenAlert("급수중지 기간을 확인해 주세요.").then(result => {
        if(result){
            $("#closeDtFrom").select();
            $("#closeDtFrom").focus();
          }
        });
        return false;
      }
      
      if(Number(closeDtFrom) < Number(closeDtTo) == false){
        citizenAlert("급수중지 종료일이 시작일보다 빠를 수 없습니다.").then(result => {
        if(result){
            $("#closeDtFrom").select();
            $("#closeDtFrom").focus();
          }
        });
        return false;
      }
    }
    
    if(!requestInfo.reason){
    	var msg = this.state.minwonGubun == "B06" ? "급수중지 사유를 입력해 주세요." : "급수중지 해제 사유를 입력해 주세요.";
    	citizenAlert(msg).then(result => {
        if(result){
          $("#reason").focus();
        }
      });
      return false;
    }
    
    return true;
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun:String, id:string, uiBox:string) {
	  //disble처리
	  if($(id).hasClass("disable")){
		  return false;
	  }
	  this.setState({
		  ...this.state,
		  minwonGubun : gubun
	  })
	  gubun == "B06" ? $("#companyNm").attr("maxlength", 110) : $("#companyNm").attr("maxlength", 12);
	  gubun == "B06" ? $("#meterDial").attr("maxlength", 30) : $("#meterDial").attr("maxlength", 10);
	  gubun == "B06" ? $("#reason").attr("maxlength", 590) : $("#reason").attr("maxlength", 125);
	  //$(".aGubun").removeClass("disable");
	  radioMW(id, uiBox);
	  
	  //급수중지기간은 급수중지 신청(B06)일때만 보이게한다.
	  gubun == "B06" ? $(".B06input").show() : $(".B06input").hide();
	  
	  //급수중지(해제) 사유 텍스트 변경
	  var reasonText = gubun == "B06" ? "급수중지 사유를 입력해 주세요." : "급수중지 해제 사유를 입력해 주세요.";
	  $("#reason").prev().children().text(reasonText);
  }
  
  //상호(기관)명
  handleCompanyNm(e: any) {
	  this.setState({
	      ...this.state,
	      requestInfo: {
	        ...this.state.requestInfo,
	        companyNm: this.state.minwonGubun == "B06" ? e.target.value.substring(0, 110) : e.target.value.substring(0, 12)
	      }
	    });
	    e.target.value = this.state.requestInfo.companyNm
	  }
  
  //계량기지침
  handleMeterDial(e:any) {
	  
	  this.setState({
	      ...this.state,
	      requestInfo: {
	        ...this.state.requestInfo,
	        meterDial: this.state.minwonGubun == "B06" ? e.target.value.replace(/[^[0-9]/gi, "").substring(0, 9) : e.target.value.replace(/[^[0-9]/gi, "").substring(0, 9)
	      }
	    });
	  e.target.value = this.state.requestInfo.meterDial
  }
  
  //급수중지 시작일
  handleCloseDtFrom(e:any) {
	  	this.setState({
				...this.state,
				requestInfo: {
					...this.state.requestInfo,
					closeDtFrom: e.target.value
				}
	  	});
	  	e.target.value = this.state.requestInfo.closeDtFrom
	  }
  
  //급수중지 종료일
  handleCloseDtTo(e:any) {
	  this.setState({
		  ...this.state,
		  requestInfo: {
			  ...this.state.requestInfo,
			  closeDtTo: e.target.value
		  }
	  });
	  e.target.value = this.state.requestInfo.closeDtTo
  }
  
  //급수중지(해제) 사유
  handleReason(e:any) {
	  this.setState({
	      ...this.state,
	      requestInfo: {
	        ...this.state.requestInfo,
	        reason: this.state.minwonGubun == "B06" ? fncCutByByte(e.target.value, 590) : fncCutByByte(e.target.value, 490)
	      }
	    });
	    e.target.value = this.state.requestInfo.reason
	  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/";
    url += that.state.minwonGubun == "B06" ? "addWspStpge.do" : "addStpgeReles.do";
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

	const wspStpgeStpgeRelesObjcData = {
			companyNm: requestInfo.companyNm,//상호(기관)명
			meterDial: requestInfo.meterDial,//계량기지침
			closeDtFrom: requestInfo.closeDtFrom.replace(/[^[0-9]/gi, ""),//급수중지기간(시작)
			closeDtTo: requestInfo.closeDtTo.replace(/[^[0-9]/gi, ""),//급수중지기간(끝)
			closeReason: requestInfo.reason,//급수중지 사유(B06)
			openReason: requestInfo.reason,//급수중지 해제 사유(B07)
	}
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonGubun,
      ...wspStpgeStpgeRelesObjcData
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
      <!-- 급수중지(해제) 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청 민원을 선택해 주세요.</span></label>
		            <ul class="mw-opt mw-opt-4 row">
			            <li id="aGubun1" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('B06', '#aGubun1', '.aGubun');"><span>급수중지 신청</span></a>
			            </li>
			            <li id="aGubun2" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('B07', '#aGubun2','.aGubun');"><span>급수중지 해제 신청</span></a>
			            </li>
		            </ul>
	            </li>
	            <li>
	            	<label for="" class="input-label"><span>상호명</span></label>
	            	<input onkeyup="${that.path}.handleCompanyNm(event)" onchange="${that.path}.handleCompanyNm(event)"
	            		value="${that.state.requestInfo.companyNm}" placeholder="상호(기관)명 입력"
	            		type="text" id="companyNm" name="companyNm" class="input-box input-w-2" maxlength="120"/>
	            </li>
            	<li>
	            	<label for="" class="input-label"><span class="form-req"><span class="sr-only">필수</span>현재지침</span></label>
	            	<input onkeyup="${that.path}.handleMeterDial(event)" onchange="${that.path}.handleMeterDial(event)"
	            		value="${that.state.requestInfo.meterDial}" title="현재 계량기 지침" placeholder="현재 계량기지침 입력"
	            		type="text" id="meterDial" name="meterDial" class="input-box input-w-2 inp_num" maxlength="9"/>
            	</li>
	            <li class="B06input">
	              	<label for="" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>급수중지 기간을 입력해 주세요.</span></label>
	            </li>
	            <li class="B06input">
	                <label for="closeDtFrom" class="input-label"><span>시작일</span></label>  	
	              	<input onchange="${that.path}.handleCloseDtFrom(event)"
	              		value="${that.state.requestInfo.closeDtFrom}" min="1000-01-01" max="2100-12-31"
	              		type="date" id="closeDtFrom" name="closeDtFrom" class="input-box input-w-fix" maxlength="10">	
	            </li>
	            <li class="B06input">
	                <label for="closeDtTo" class="input-label"><span>종료일</span></label>    
	              	<input onchange="${that.path}.handleCloseDtTo(event)"
	              		value="${that.state.requestInfo.closeDtTo}"  min="1000-01-01" max="2100-12-31"
	              		type="date" id="closeDtTo" name="closeDtTo" class="input-box input-w-fix" maxlength="10">
	            </li>
	            <li class="B06input">
	              <p class="pre-star tip-blue">급수 재사용 시 반드시 "급수중지 해제" 신청을 하시기 바랍니다.</p>
	            </li>
	            <li>
	                <label for="reason" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>급수중지(해제) 사유를 입력해 주세요.</span></label> 
	                <textarea onkeyup="${that.path}.handleReason(event)" onchange="${that.path}.handleReason(event)"
	                	id="reason" name="reason" class="textarea-box" title="내용">${that.state.requestInfo.reason}</textarea>
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
  
  //상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
  afterRender() {
  	const that = this;
  	
  	var mgrNo = that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.mkey;
	 $.ajax({
			url : "/citizen/common/checkCloseYn.do",
			type : 'post',
			async : false,
			data : {
				"mgrNo" : mgrNo
			},
			dataType : 'json',
			error : function(xhr:any, status:any, error:any) {
				fncAlertAjaxErrMsg(xhr);
			},
			success : function(data:any) {
				that.setState({
			        ...that.state,
			        closeYn: data.business.bodyVO.flag,//(급수중지중:Y, 급수중지중아님:N)
			        minwonGubun: data.business.bodyVO.flag == "N" ? "B06" : "B07"
			      });
			}
		});
	//급수중지 여부에 화면 속성 제어(closeYn N:급수중지 신청, Y:급수중지 해제 신청)
	that.state.minwonGubun == "B06" ? $("#aGubun2").addClass("disable") : $("#aGubun1").addClass("disable") ;
	that.state.minwonGubun == "B06" ? $("#aGubun1").addClass("on") 	  : $("#aGubun2").addClass("on");//신청 구분 disabled 대신 안보이도록 수정 요청
	//that.state.minwonGubun == "B06" ? $("#aGubun2").hide() : $("#aGubun1").hide();
	that.state.minwonGubun == "B06" ? $("#companyNm").attr("maxlength", 110) : $("#companyNm").attr("maxlength", 12);//상호(기관명)
	that.state.minwonGubun == "B06" ? $("#meterDial").attr("maxlength", 30) : $("#meterDial").attr("maxlength", 10);//계량기지침
	that.state.minwonGubun == "B06" ? $("#reason").attr("maxlength", 590) : $("#reason").attr("maxlength", 125);//급수중지(해제) 사유
	
	//급수중지기간은 급수중지 신청(B06)일때만 보이게한다.
	that.state.minwonGubun == "B06" ? $(".B06input").show() : $(".B06input").hide();
			
	//급수중지(해제) 사유 텍스트 변경
	var reasonText = that.state.minwonGubun == "B06" ? "급수중지 사유를 입력해 주세요." : "급수중지 해제 사유를 입력해 주세요.";
	$("#reason").prev().children().text(reasonText);
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