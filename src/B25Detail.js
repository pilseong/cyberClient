class B25DetailPage {
  constructor(parent, minwonCd) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {},
      requestInfo: {
        gubun: '',   // 신규 1 변경 2, 해지 3, 공백은 미선택
        method: '',  // 알림톡 1, 문자 2
        mobile: '',
        agree: false
      },
      description: {}
    }
    this.getDescription();
  }

  // 초기값 설정
  setInitValue(suyongaNum) {
    const that = this;

    var url = gContextUrl + "/citizen/common/getImmdNtcnInfo.do";
    var queryString = "mgrNo=" + suyongaNum;
    fetch('GET', url, queryString, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
        return;
      }
      console.log(data)

      if (data.result.status === 'SUCCESS') {
        const fetchedData = data.business.bodyVO[0];
        that.setState({
          ...that.state,
          statusInfo: {
            data: fetchedData
          },
          requestInfo: {
            ...that.state.requestInfo,
            gubun: '',
            method: '',
            mobile: ''
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
            gubun: '',
            method: 'T',
            mobile: ''
          }
        })
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
      console.log(data);
      console.log('after fetching', that.state);
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
    return {
      viewB25Detail: {
        title: "수도요금 바로알림 신청",
        gubun: [this.state.requestInfo.gubun === '1' ? '신규' :
          this.state.requestInfo.gubun === '2' ? '변경' :
            this.state.requestInfo.gubun === '3' ? '해지' : '미선택', '신청구분'],
        method: [this.state.requestInfo.method === '1' ? '알림톡' :
          this.state.requestInfo.method === '2' ? '문자' : '미선택', '안내방법'],
        mobile: [this.state.requestInfo.mobile, '알림수신번호'],
        agree: [this.state.requestInfo.agree === true ? '동의' : '미동의', '알림동의여부']
      }
    };
  }

  setState(nextState) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 민원신청 구분
  handleOnChangeGubun(gubun) {
    let method = this.state.requestInfo.method;
    let mobile = this.state.requestInfo.mobile;
    let agree = this.state.requestInfo.agree;
    // 클릭된 버튼을 다시 클릭한 경우
    if (this.state.requestInfo.gubun === gubun) {
      removeMW("#aGubun" + gubun);
      $('#method').show();
      $('#mobile').show();
      $('#agree').show();
      gubun = '';
    } else {
      // 신규
      if (gubun === "1") {
        addMW("#aGubun1");
        removeMW("#aGubun2");
        removeMW("#aGubun3");
      // 변경 선택
      } else if (gubun === "2") {
        addMW("#aGubun2");
        removeMW("#aGubun1");
        removeMW("#aGubun3");
        $('#method').show();
        $('#mobile').show();
        $('#agree').show();
      // 해지
      } else if (gubun === "3") {
        addMW("#aGubun3");
        removeMW("#aGubun1");
        removeMW("#aGubun2");
        $('#method').hide();
        $('#mobile').hide();
        $('#agree').hide();
        method = '';
        mobile= '';
        agree=false;
        removeMW("#bGubun1");
        removeMW("#bGubun2");
        $('#mobile-input').val(mobile);
        $('#ch81').prop('checked', false);
      }
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

    console.log("b25 gubun selection: ", this.state);
  }

  // 안내방법 선택
  handleMethod(method) {
    // 클릭된 버튼을 다시 클릭한 경우
    if (this.state.requestInfo.method === method) {
      removeMW("#bGubun" + method);
      method = '';
    } else {
      if (method === "1") {
        addMW("#bGubun1");
        removeMW("#bGubun2");
      } else if (method === "2") {
        addMW("#bGubun2");
        removeMW("#bGubun1");
      }
    }

    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        method
      }
    })

    console.log("b25 method selection: ", this.state);
  }

  // 핸드폰 번호 매핑
  handleOnChangeMobile(e) {
    console.log(e.target.value.substring(0, 11));
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        mobile: e.target.value.substring(0, 11)
      }
    });
    e.target.value = this.state.requestInfo.mobile.substring(0, 11);
    phoneNumberInputValidation(e.target, 11, /(010)(\d{3,4})(\d{4})/g);
  }

  // 개인정보 수집 동의
  handleOnClickAtreeOnReception(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        agree: !this.state.requestInfo.agree
      }
    })
  }

  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;

    if (!requestInfo.gubun) {
      alert("수도요금 바로알림 신청 구분값을 설정하세요.");
      return false;
    }

    if (requestInfo.gubun !== '3' && !requestInfo.method) {
      alert("수도요금 바로알림 안내방법을 설정하세요.");
      return false;
    }

    if (requestInfo.gubun !== '3' && !requestInfo.mobile) {
      alert("수도요금 바로알림을 수신할 휴대폰 번호를 입력하세요");
      return false;
    }

    // 해지시에는 수신동의는 기본적으로 확인하지 않는다.
    if (requestInfo.gubun !== '3' && !requestInfo.agree) {
      alert("수도요금 바로알림 수신동의를 체크해 주세요");
      return false;
    }
    return true;
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyImmdNtcn.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg("수도요금 바로알림 신청이 정상적으로 처리되지 않았습니다.");
        return;
      }
      console.log(data);

      console.log('after fetching', that.state);
      that.render();
    });
  }

  getQueryString() {
    const pattern = /(02|0\d{2})(\d{3,4})(\d{4})/g

    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;

    const mobileArr = pattern.exec(requestInfo.mobile);

    const notifyRequestData = {
      // 통합 민원 데이터 셋 바인딩
      'immdNtcnVO.reqGubun': "" + parseInt(requestInfo.gubun) - 1,
      'immdNtcnVO.reqInfoMobile': statusInfo.data ? statusInfo.data.yogmResultNtceTel : '',
      'immdNtcnVO.minwonCd': 'B25',
      'immdNtcnVO.reqMobile': requestInfo.mobile,
      'immdNtcnVO.reqFormCd': requestInfo.method === '1' ? '00' :
        requestInfo.method === '2' ? '03' : '',
    };

    return {
      ...this.state.parent.state.suyongaInfoPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...notifyRequestData
    };
  }
  
  getStatusString() {
    const statusInfo = this.state.statusInfo;
    
    if (!statusInfo.data) {
      return "신청정보가 없습니다.";
    } else {
      return `${statusInfo.data.yogmResultNtceTel}(${statusInfo.data.reqFormCd === '00' ? '알림톡 수신' : '문자 수신'})`;
    }
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
      <!-- 수도요금 바로알림 신청 (신규/변경/해지) -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기"><span class="i-01">수도요금 바로알림 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>민원신청 구분을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="aGubun1" ${that.state.statusInfo.data ? "style='display:none;'" : "style='display:block;'"} 
                    class="aGubun"><a href="javascript:void(0);" onClick="cyberMinwon.state.currentModule.state.currentPage.handleOnChangeGubun('1')"><span>신규</span></a></li>
                  <li id="aGubun2" ${!that.state.statusInfo.data ? "style='display:none;'" : "style='display:block;'"} 
                    class="aGubun"><a href="javascript:void(0);" onClick="cyberMinwon.state.currentModule.state.currentPage.handleOnChangeGubun('2')"><span>변경</span></a></li>
                  <li id="aGubun3" ${!that.state.statusInfo.data ? "style='display:none;'" : "style='display:block;'"} 
                    class="aGubun"><a href="javascript:void(0);" onClick="cyberMinwon.state.currentModule.state.currentPage.handleOnChangeGubun('3')"><span>해지</span></a></li>
                </ul>
              </li>
              <li id="method">
                <label class="input-label"><span>안내방법을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="bGubun1" class="bGubun">
                    <a href="javascript:void(0);" onClick="cyberMinwon.state.currentModule.state.currentPage.handleMethod('1')"><span>알림톡</span></a>
                  </li>
                  <li id="bGubun2" class="bGubun">
                    <a href="javascript:void(0);" onClick="cyberMinwon.state.currentModule.state.currentPage.handleMethod('2')"><span>문자</span></a>
                  </li>
                </ul>
              </li>
  
              <li><label class="input-label"><span>기존신청정보</span></label>
                <p class="form-info">${that.getStatusString()}</p>
              </li>
  
              <li id="mobile">
                <label for="form-mw36-tx" class="input-label"><span>휴대폰번호</span></label>
                <input type="text" id="mobile-input" 
                  onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleOnChangeMobile(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleOnChangeMobile(event)"
                    value="${that.state.requestInfo.mobile}"
                  class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <p class="form-cmt txStrongColor">
                  * 신규/변경/해지할 휴대폰 번호를 입력하세요.
                </p>
              </li>
                <li><label class="input-label"><span class="sr-only">수도요금 바로알림 수신여부</span></label>
                  <p class="form-info" id="agree">
                    <input type="checkbox" name="ch81" id="ch81" onclick="cyberMinwon.state.currentModule.state.currentPage.handleOnClickAtreeOnReception(event)"
                      ${that.state.requestInfo.agree ? 'checked' : ''}>
                    <label class="chk-type" for="ch81">
                      <span>수도요금 바로알림 수신동의<span class="tx-opt">(필수) </span></span></label>
                    <a href="javascript:void(0);" onClick="showHideInfo('#form-mw23-info');" class="btn btnSS btnTypeC">
                      <span>내용보기</span>
                    </a>
                  </p>
  
                  <p id="form-mw23-info" class="display-none form-info-box">
                    <span class="tit-mw-h5 row">수도요금바로알림</span>
                  메시지 수신 설정 상태, 데이터 상태, 시스템 오류, 통신장애, 휴대폰 사용 정지, 휴대폰 전원 상태 등으로 메시지 수신이 불가할 수 있습니다.
                  메시지내용은 발송일 기준으로 작성된 것이므로 이 후 변동사항은 해당 사업소로 문의하시기 바랍니다.
                  서비스 받으실 이동전화번호가 변경된 경우, 변경신청 하여야 하며, 신청 지연 및 신청내용 오류로 인하여 신청자 또는 제3자에게 발생된 사태나 손해에 대하여 서비스 기관이 책임지지 않습니다.
                  전·출입을 반영하여 서비스 하지 않으므로 사유발생 시, 해지 및 신규 신청하여야 하며 그렇지 않아 발생할 수 있는 불이익 등에 대한 책임은 서비스 기관에 없으며, 이를 예방하기 위한 조치로 직권해지 할 수 있습니다.
                  매월 8일까지 신청분은 당월에 적용하며, 이후 신청분은 차월 납기부터 적용합니다.
                  메시지 전송일은 요금결정 다음날인 12일 전·후이며 변경될 수 있습니다.
                  </p>
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
  
  // 기본 설정값은 여기에서 랜더링 해야 한다.
  afterRender() {
    addMW('#aGubun' + this.state.requestInfo.gubun);
    addMW('#bGubun' + this.state.requestInfo.method);
    
    // 해지가 선택된 경우는 화면에 알림 방법 메뉴를 보여주지 않는다.
    if (this.state.requestInfo.gubun === '3') {
      $('#method').hide();
      $('#mobile').hide();
      $('#agree').hide();  // agree
    }

    this.setEventListeners();
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