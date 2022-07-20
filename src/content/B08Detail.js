class B08DetailPage {
  constructor(parent, minwonCd) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {
      	
      },
      requestInfo: {
    	  idtCdSNm: "",//수용가 업종명
    	  jsDay: "",//정수처분일
    	  chenapDocSeNm: ""//정수처분사유
      },
      description: {
      	
      }
    };
    this.getDescription();
    this.setInitValue();
  }

  //수용가 조회 시 민원 신청 가능한지 확인하는 함수
  possibleApplyChk(mgrNo){
	  const that = this;
	  var result = true;
	  
	  if(mgrNo){
		  $.ajax({
			  url : "/citizen/common/swaterDspsDtlsSearch.do",
			  type : 'post',
			  async : false,
			  data : {"mkey" : mgrNo},
			  dataType : 'json',
			  error : function(xhr, status, error) {
				  fncAlertAjaxErrMsg(xhr);
				  },
			  success : function(data) {
				  if (data.resultCd != '00') {//00이 정수중일 때의 상태
					  alert_msg("정수처분된 수용가번호가 아닙니다! 해제신청을 할 수 없습니다.");
					  result = false;
				} else {
					that.setState({
						...that.state,
						requestInfo: {
							idtCdSNm: cyberMinwon.state.currentModule.state.applicationPage.state.suyongaInfo.state.suyongaInfo.idtCdSNm,//업종
  							jsDay: data.data.jsDay,//정수처분일
  							chenapDocSeNm: data.data.chenapDocSeNm//정수처분사유
  						}
					});
				  $("#idtCdSNm").val(cyberMinwon.state.currentModule.state.applicationPage.state.suyongaInfo.state.suyongaInfo.idtCdSNm);
				  $("#jsDay").val(data.data.jsDay);
				  $("#chenapDocSeNm").val(data.data.chenapDocSeNm);
				  
				  result = true;
				}
			  }
			});
		  }
  return result;
  }
  
  
  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
  		...that.state,
  		requestInfo: {
  			idtCdSNm: "",//수용가 업종명
  			jsDay: "",//정수처분일
  			chenapDocSeNm: ""//정수처분사유
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

    return {
    	viewB08Detail: {
    		title: this.state.description.minwonNm,
    		idtCdSNm: [this.state.requestInfo.idtCdSNm, "업종"],//업종명
      	  	jsDay: [this.state.requestInfo.jsDay, "정수처분일"],//정수처분일
      	  	chenapDocSeNm: [this.state.requestInfo.chenapDocSeNm, "정수처분사유"]//정수처분사유
    	}
    };
  }

  setState(nextState) {
    this.state = nextState;
  }

  setEventListeners() {
  }
  
  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;
    return true;
  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyWprhbReles.do";
    const sendData = this.getQueryString();
    

    fetch('POST', url, sendData, function (error, data) {
        // 에러가 발생한 경우
        if (error) {
          alert_msg(that.state.description.minwonNm+"이 정상적으로 처리되지 않았습니다.");
          return;
        }
        cyberMinwon.goFront();
      });
  }

  getQueryString() {
  	const requestInfo = this.state.requestInfo;
    const EditTyinduChngeObjcData = {}
    
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...EditTyinduChngeObjcData
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
      <!-- 정수처분 해제 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
	            	<label for="" class="input-label"><span>업종</span></label>
	            	<input value="${that.state.requestInfo.idtCdSNm}" type="text" id="idtCdSNm" name="idtCdSNm" class="input-box input-w-2" readonly/>
	            </li>
	            <li>
	            	<label for="" class="input-label"><span class="form-req">정수처분일</span></label>
	            	<input value="${that.state.requestInfo.jsDay}" type="text" id="jsDay" name="jsDay" class="input-box input-w-2" readonly/>
	            </li>
            	<li>
	            	<label for="" class="input-label"><span class="form-req">정수처분사유</span></label>
	            	<input value="${that.state.requestInfo.chenapDocSeNm}" type="text" id="chenapDocSeNm" name="chenapDocSeNm" class="input-box input-w-2" readonly/>
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