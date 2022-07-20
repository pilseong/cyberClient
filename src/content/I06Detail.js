class I06DetailPage {
  constructor(parent, minwonCd) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {
      	
      },
      minwonGubun: "",//민원구분 (B06/B07)
      closeYn: "",//입력된 수용가의 굽수 중지여부(Y:중지중,N:중지상태아님)
      requestInfo: {
    	  companyNm: "",//상호(기관)명
    	  meterDial: "",//계량기지침
    	  reason: "",//급수중지(해제)사유
    	  closeDtFrom: "",//급수중지기간(시작)
    	  closeDtTo: ""//급수중지기간(끝)
      },

      description: {
      }
    };
    this.getDescription();
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
  			reason: "",//급수중지(해제) 사유
  			closeDtFrom: "",//급수중지 시작일
  			closeDtTo: "",//급수중지 종료일
      }
  	});
  	
  }

  // 민원안내, 절차 정보를 서버에 요청한다. 
  getDescription() {
  	const that = this;

    var url = gContextUrl + "/citizen/common/listCitizenCvplDfn.do";
    var queryString = {
      'minwonCd': this.state.minwonCd
    };

    fetch('GET', url, queryString, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }

      that.setState({
        ...that.state,
        description: data[0]
      })
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
  	const that = this;
			
  	if(that.state.minwonGubun == "B06"){
  		var infoArray = {
  	  			viewI06Detail: {
  	  	    		title: this.state.description.minwonNm,
  	  	    		companyNm: [this.state.requestInfo.companyNm, "상호(기관)명"],//상호(기관)명
  	  	  			meterDial: [this.state.requestInfo.meterDial, "계량기지침"],//계량기지침
	  	  	  		closeDtFrom: [this.state.requestInfo.closeDtFrom, "급수중지 시작일"],//급수중지 시작일
	  				closeDtTo: [this.state.requestInfo.closeDtTo, "급수중지 종료일"],//급수중지 종료일
  	  			    reason: [this.state.requestInfo.reason, "급수중지 사유"]//급수중지(해제) 사유
  	  	    	}
  	  	}
  	} else {
  		var infoArray = {
  	  			viewI06Detail: {
  	  	    		title: this.state.description.minwonNm,
  	  	    		companyNm: [this.state.requestInfo.companyNm, "상호(기관)명"],//상호(기관)명
  	  	  			meterDial: [this.state.requestInfo.meterDial, "계량기지침"],//계량기지침
  	  			    reason: [this.state.requestInfo.reason, "급수중지 해제 사유"]//급수중지(해제) 사유
  	  	    	}
  	  	}
  	}
  	
  	return infoArray;
  }

  setState(nextState) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;

    if(this.state.minwonGubun == "B06"){
    	if(!requestInfo.closeDtFrom){
    		alert_msg("급수중지 시작일을 입력하세요.");
    		$("#closeDtFrom").focus();
    		return false;
    	}
    	
    	if(!requestInfo.closeDtTo){
    		alert_msg("급수중지 종료일을 입력하세요.");
    		$("#closeDtTo").focus();
    		return false;
    	}
    	
    	if(requestInfo.closeDtFrom > requestInfo.closeDtTo){
    		alert_msg("급수중지 기간을 확인해 주세요.");
    		$("#closeDtFrom").select();
    		$("#closeDtFrom").focus();
    		return false;
    	}
    }
    
    if(!requestInfo.reason){
    	var msg = this.state.minwonGubun == "B06" ? "급수중지 사유를 입력해 주세요." : "급수중지 해제 사유를 입력해 주세요.";
    	alert_msg(msg);
    	$("#reason").focus();
    	return false;
    }
    
    return true;
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun, id, uiBox) {
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
	  $(".aGubun").removeClass("disable");
	  radioMW(id, uiBox);
	  
	  //급수중지기간은 급수중지 신청(B06)일때만 보이게한다.
	  gubun == "B06" ? $("#closeDtFrom").parent().show() : $("#closeDtFrom").parent().hide();
	  
	  //급수중지(해제) 사유 텍스트 변경
	  var reasonText = gubun == "B06" ? "급수중지 사유" : "급수중지 해제 사유";
	  $("#reason").prev().children().text(reasonText);
  }
  
  //상호(기관)명
  handleCompanyNm(e) {
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
  handleMeterDial(e) {
	  
	  this.setState({
	      ...this.state,
	      requestInfo: {
	        ...this.state.requestInfo,
	        meterDial: this.state.minwonGubun == "B06" ? e.target.value.replace(/[^[0-9]/gi, "").substring(0, 30) : e.target.value.replace(/[^[0-9]/gi, "").substring(0, 10)
	      }
	    });
	  e.target.value = this.state.requestInfo.meterDial
  }
  
  //급수중지 시작일
  handleCloseDtFrom(e) {
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
  handleCloseDtTo(e) {
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
  handleReason(e) {
	  this.setState({
	      ...this.state,
	      requestInfo: {
	        ...this.state.requestInfo,
	        reason: this.state.minwonGubun == "B06" ? e.target.value.substring(0, 590) : e.target.value.substring(0, 125)
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
    

    fetch('POST', url, sendData, function (error, data) {
        // 에러가 발생한 경우
        if (error) {
          alert_msg(that.state.description.minwonNm+"이 정상적으로 처리되지 않았습니다.");
          return;
        }
        cyberMinwon.goFront('I06');
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
      <!-- 상하수도 누수요금 감면 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
		            <label class="input-label-1"><span class="form-req">신청 민원을 선택하세요.</span></label>
		            <ul class="mw-opt mw-opt-2 row">
			            <li id="aGubun1" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('B06', '#aGubun1', '.aGubun');"><span>급수중지 신청</span></a>
			            </li>
			            <li id="aGubun2" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('B07', '#aGubun2','.aGubun');"><span>급수중지 해제 신청</span></a>
			            </li>
		            </ul>
	            </li>
	            <li>
	            	<label for="" class="input-label"><span>상호(기관)</span></label>
	            	<input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleCompanyNm(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleCompanyNm(event)"
	            		value="${that.state.requestInfo.companyNm}"
	            		type="text" id="companyNm" name="companyNm" class="input-box input-w-2" maxlength="120"/>
	            </li>
            	<li>
	            	<label for="" class="input-label"><span>계량기지침</span></label>
	            	<input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleMeterDial(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleMeterDial(event)"
	            		value="${that.state.requestInfo.meterDial}"
	            		type="text" id="meterDial" name="meterDial" class="input-box input-w-2 inp_num" maxlength="30"/>
            	</li>
	            <li>
	              	<label for="leakRepairDt" class="input-label"><span class="form-req">급수중지기간</span></label>
	              	<input onchange="cyberMinwon.state.currentModule.state.currentPage.handleCloseDtFrom(event)"
	              		value="${that.state.requestInfo.closeDtFrom}"
	              		type="date" id="closeDtFrom" name="closeDtFrom" class="input-box input-w-fix" maxlength="10">	
	              	~
	              	<input onchange="cyberMinwon.state.currentModule.state.currentPage.handleCloseDtTo(event)"
	              		value="${that.state.requestInfo.closeDtTo}"
	              		type="date" id="closeDtTo" name="closeDtTo" class="input-box input-w-fix" maxlength="10">
	              	<p class="form-cmt txStrongColor">
		              	※ 급수 재사용 시 반드시 "급수중지 해제" 신청을 하시기 바랍니다.
	                </p>
	            </li>
	            <li>
	            </li>
	            <li>
	                <label for="reason" class="input-label"><span class="form-req">급수중지(해제) 사유</span></label> 
	                <textarea onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleReason(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleReason(event)"
	                	id="reason" name="reason" class="textarea-box" title="내용">${that.state.requestInfo.reason}</textarea>
                </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      `;

    document.getElementById('minwonRoot').innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    
    this.afterRender();
  }
  
  //상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
  afterRender() {
  	const that = this;
  	
  	var mgrNo = cyberMinwon.state.currentModule.state.applicationPage.state.suyongaInfo.state.suyongaInfo.mkey;
	 $.ajax({
			url : "/citizen/common/checkCloseYn.do",
			type : 'post',
			async : false,
			data : {
				"mgrNo" : mgrNo
			},
			dataType : 'json',
			error : function(xhr, status, error) {
				fncAlertAjaxErrMsg(xhr);
			},
			success : function(data) {
				that.setState({
			        ...that.state,
			        closeYn: data.business.bodyVO.flag,//(급수중지중:Y, 급수중지중아님:N)
			        minwonGubun: data.business.bodyVO.flag == "N" ? "B06" : "B07"
			      });
			}
		});
	//급수중지 여부에 화면 속성 제어(closeYn N:급수중지 신청, Y:급수중지 해제 신청)
	that.state.minwonGubun == "B06" ? $("#aGubun2").addClass("disable") : $("#aGubun1").addClass("disable") ;
	that.state.minwonGubun == "B06" ? $("#aGubun1").addClass("on") 	  : $("#aGubun2").addClass("on");
	that.state.minwonGubun == "B06" ? $("#companyNm").attr("maxlength", 110) : $("#companyNm").attr("maxlength", 12);//상호(기관명)
	that.state.minwonGubun == "B06" ? $("#meterDial").attr("maxlength", 30) : $("#meterDial").attr("maxlength", 10);//계량기지침
	that.state.minwonGubun == "B06" ? $("#reason").attr("maxlength", 590) : $("#reason").attr("maxlength", 125);//급수중지(해제) 사유
	
	//급수중지기간은 급수중지 신청(B06)일때만 보이게한다.
	that.state.minwonGubun == "B06" ? $("#closeDtFrom").parent().show() : $("#closeDtFrom").parent().hide();
			
	//급수중지(해제) 사유 텍스트 변경
	var reasonText = that.state.minwonGubun == "B06" ? "급수중지 사유" : "급수중지 해제 사유";
	$("#reason").prev().children().text(reasonText);
  }
  
  
	
  renderDescription(target) {
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