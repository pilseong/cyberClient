class A11DetailPage {
  constructor(parent, minwonCd) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        waterTy: '', // 직결급수유형
        constructDt: '',  // 직결급수공사시기
        area: '', // 연건축면적
        pipeDia: '', //인입급수관구경
        buildingYear: '', //건축년도
        building: '', //용도
        family: '', //가구수(세대수)
        floor1: '', //층수:지상
        floor2: '' //지하
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

    //누수위치
    let waterType = fncGetCodeByGroupCdUsing("waterType");
    console.log("waterType", leakPosCd);
    //누수원인
    let building = fncGetCodeByGroupCdUsing("building");
    console.log("building", leakReaCd);

    that.setState({
      ...that.state,
      statusInfo: {
        comboWaterType: waterType,
        comboBuilding: building
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
    const that = this;

    return {
      viewA11Detail: {
        title: this.state.description.minwonNm,
        waterTy: [this.state.requestInfo.waterTy, '직결급수유형'],
        constructDt: [this.state.requestInfo.constructDt, '직결급수공사시기'],
        area: [this.state.requestInfo.area + '㎥', '연건축면적'],
        pipeDia: [this.state.requestInfo.pipeDia + '㎜', '인입급수관구경'],
        buildingYear: [this.state.requestInfo.buildingYear + '년', '건축년도'],
        building: [this.state.requestInfo.building, '용도'],
        family: [this.state.requestInfo.family, '가구수(세대수)'],
        floor: [this.state.requestInfo.floor1 + '/' + this.state.requestInfo.floor2, '층수:지상/지하'],
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

    if (!requestInfo.constructDt) {
      alert("직결급수공사시기를 입력하세요.");
      return false;
    }

    return true;
  }

  //직결급수유형 onchange
  handleChangeWaterTy(e) {
    let value;
    let name;
    if (typeof e == 'string') {
      value = $("#" + e).val();
      name = $("#" + e + " option:selected").text();
    } else {
      value = e.value;
      name = e.options[e.selectedIndex].text;
    }

    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        handleChangeWaterTy: value
      }
    });
  }

  //직결급수공사시기
  handleChangeConstructDt(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        constructDt: e.target.value
      }
    });
    e.target.value = this.state.requestInfo.constructDt;
  }

  //연건축면적
  handleChangeArea(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        area: e.target.value
      }
    });
    e.target.value = this.state.requestInfo.area;
  }

  //인입급수관구경
  handleChangePipeDia(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        pipeDia: e.target.value
      }
    });
    e.target.value = this.state.requestInfo.pipeDia;
  }

  //용도 onchange 
  handleChangeBuilding(e) {
    let value;
    let name;
    if (typeof e == 'string') {
      value = $("#" + e).val();
      name = $("#" + e + " option:selected").text();
    } else {
      value = e.value;
      name = e.options[e.selectedIndex].text;
    }

    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        building: value
      }
    });

  }

  //가구수(세대수)
  handleChangeFamily(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        family: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.requestInfo.family.substring(0, 10);
  }

  //층수:지상
  handleChangeFloor1(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        floor1: e.target.value
      }
    });
    e.target.value = this.state.requestInfo.floor1;
  }

  //층수:지하
  handleChangeFloor1(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        floor2: e.target.value
      }
    });
    e.target.value = this.state.requestInfo.floor2;
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyDrcconWsp.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg(that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
        return;
      }
      console.log(data);

      console.log('after fetching', that.state);
      cyberMinwon.goFront('B14');
      //      that.render();
    });
  }

  getQueryString() {
    const requestInfo = this.state.requestInfo;

    const requestData = {
      //
      'DrcconWspVO.waterTy': requestInfo.waterTy,
      'DrcconWspVO.constructDt': requestInfo.constructDt.replaceAll("-", ""),
      'DrcconWspVO.area': requestInfo.area,
      'DrcconWspVO.pipeDia': requestInfo.pipeDia,
      'DrcconWspVO.buildingYear': requestInfo.buildingYear,
      'DrcconWspVO.building': requestInfo.building,
      'DrcconWspVO.family': requestInfo.family,
      'DrcconWspVO.floor1': requestInfo.floor1,
      'DrcconWspVO.floor2': requestInfo.floor2,
    }

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...requestData
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
                <label for="leakPosCd" class="input-label"><span class="form-req">누수위치</span></label>
                <select id="leakPosCd" name="leakPosCd" title="누수위치 선택" class="input-box input-w-2"
                	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakPosCd(this)">
                </select>
                <input type="text" id="leakPos" name="leakPos" class="input-box input-w-2" title="누수위치 기타 입력" maxlength="200" placeholder="누수위치 기타 입력"
                	value="${that.state.requestInfo.leakPos}"
                	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakPosEtc(event)"
                	onpaste="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakPosEtc(event)">
              </li>
              <li>
	            <label for="leakReaCd" class="input-label"><span class="form-req">누수원인</span></label>
	            <select id="leakReaCd" name="leakReaCd" title="누수원인" class="input-box input-w-2"
	            	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakReaCd(this)">
	            </select>
	            <input type="text" id="leakRea" name="leakRea" class="input-box input-w-2" title="누수원인 기타 입력" maxlength="200" placeholder="누수원인 기타 입력"
	            	value="${that.state.requestInfo.leakRea}"
	            	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakRea(event)"
                onpaste="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakRea(event)">
	            <p id="leakRea_007" class="display-none form-cmt txStrongColor">
                *양변기고장에 따른 옥내누수는 상수도요금과 물이용부담금이 미감면됨(하수도요금만 감면됨)
              </p>
	          </li>
  
              <li>
              	<label for="leakRepairDt" class="input-label"><span>누수수리일시</span></label>
              	<input type="date" id="leakRepairDt" name="leakRepairDt" class="input-box input-w-3" maxlength="10"
              		value="${that.state.requestInfo.leakRepairDt}"
              		onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeRepairDt(event)">
              	
              </li>
  
              <li>
                <label for="form-mw36-tx" class="input-label"><span class="form-req">첨부파일</span></label>
                <input type="file" id="file1" name="file" title="첨부파일" value="${that.state.requestInfo.file}"
                	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeFile(event)">
                <a href="javascript:void(0);" class="btn btnSS" onclick="cyberMinwon.state.currentModule.state.currentPage.handleClickDeleteFile(this)"><span>삭제</span></a>
                <p class="form-cmt txStrongColor">
                  * 누수적용 신청 시 증빙자료(공사 중 사진 또는 누수수리영수증 등) 등록이 필요합니다.
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
    const that = this;
    console.log("afterRender()");
    fncSetComboByCodeList("waterType", that.state.statusInfo.comboLeakPosCd);
    this.handleChangeLeakPosCd("waterType");

    fncSetComboByCodeList("building", that.state.statusInfo.comboLeakReaCd);
    this.handleChangeLeakReaCd("building");
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