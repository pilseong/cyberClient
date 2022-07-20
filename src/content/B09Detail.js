class B09DetailPage {
  constructor(parent, minwonCd) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        pipeDia: "",//구경(수용가조회 값,분기(divConst에 사용)
        bizNm: "",//업종(수용가조회 값)
        applyRsn: "",//신청사유
        etc: ""//기타(비고)
      },
      description: {

      }
    };
    this.getDescription();
    // this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        pipeDia: "",//구경(수용가조회 값,분기(divConst에 사용)
        bizNm: "",//업종(수용가조회 값)
        applyRsn: "",//신청사유
        etc: ""//기타(비고)
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
      viewB09Detail: {
        title: this.state.description.minwonNm,
        pipeDia: [this.state.requestInfo.pipeDia + "mm", "구경"],
        bizNm: [this.state.requestInfo.bizNm, "업종"],
        applyRsn: [this.state.requestInfo.applyRsn, "신청사유"],
        etc: [this.state.requestInfo.etc, "기타"]
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
    if (!requestInfo.applyRsn) {
      alert_msg("신청사유를 입력하세요.");
      $("#applyRsn").focus();
      return false;
    }
    return true;
  }
  //신청사유
  handleApplyRsn(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        applyRsn: e.target.value.substring(0, 190)
      }
    });
    e.target.value = this.state.requestInfo.applyRsn
  }

  //기타(비고)
  handleEtc(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        etc: e.target.value.substring(0, 120)
      }
    });
    e.target.value = this.state.requestInfo.etc
  }

  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun, id, uiBox, gubunNm) {
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyMtrAthrz.do";
    const sendData = this.getQueryString();


    fetch('POST', url, sendData, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg(that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
        return;
      }
      cyberMinwon.goFront('B09');
    });
  }

  getQueryString() {
    const requestInfo = this.state.requestInfo;
    const EditMtrAthrzObjcData = {
      pipeDia: requestInfo.pipeDia,//구경
      bizNm: requestInfo.bizNm,//업종
      applyRsn: requestInfo.applyRsn,//신청사유
      etc: requestInfo.etc//기타(비고)
    }

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...EditMtrAthrzObjcData
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
      <!-- 수도계량기 검정시험 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
	            	<label for="applyRsn" class="input-label"><span class="form-req">신청사유를 입력하세요</span></label> 
		            <textarea onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleApplyRsn(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleApplyRsn(event)"
		            	id="applyRsn" name="applyRsn" class="textarea-box"  title="신청사유" maxlength="190">${that.state.requestInfo.applyRsn}</textarea>
	            </li>
	            <li>
		            <label for="etc" class="input-label"><span>기타(비고)</span></label> 
		            <textarea onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleEtc(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleEtc(event)"
		            	id="etc" name="etc" class="textarea-box"  title="기타(비고)" maxlength="120">${that.state.requestInfo.etc}</textarea>
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
    //state.requestInfo;
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        pipeDia: cyberMinwon.state.currentModule.state.applicationPage.state.suyongaInfo.state.suyongaInfo.idtCdS,//(현)업종코드
        bizNm: cyberMinwon.state.currentModule.state.applicationPage.state.suyongaInfo.state.suyongaInfo.idtCdSNm//(현)업종코드명
      }
    });
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