class B02DetailPage {
	constructor(parent, minwonCd) {
		this.state = {
			minwonCd,
			parent,
			statusInfo: {

			},
			requestInfo: {
				chBusinNm: "",//변경업종명
				chBusinCd: "",//변경업종코드
				businNm: "",//업종명
				businCd: "",//업종코드
				buildingDownstair: "",//지하
				buildingUpstair: "",//지상
				comNm: "",//상호(기관)
				residentCont: ""//입주현황
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
				chBusinNm: "가정용",//변경업종명 : '현재업종코드'에 따라 선택 못하게 해야하므로 afterRender에서 값주입
				chBusinCd: "10",//변경업종코드 : '현재업종코드'에 따라 선택 못하게 해야하므로 afterRender에서 값주입
				buildingDownstair: "0",//지하
				buildingUpstair: "0",//지상
				comNm: "",//상호(기관)
				residentCont: ""//입주현황
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
			viewB02Detail: {
				title: this.state.description.minwonNm,

				businNm: [this.state.requestInfo.businNm, "현재 급수업종"],
				chBusinNm: [this.state.requestInfo.chBusinNm, "변경요청 급수업종"],
				buildingDownstair: [this.state.requestInfo.buildingDownstair + "층", "건물층수(지하)"],
				buildingUpstair: [this.state.requestInfo.buildingUpstair + "층", "건물층수(지상)"],
				buildingStair: [(parseInt(this.state.requestInfo.buildingDownstair) + parseInt(this.state.requestInfo.buildingUpstair)) + "층", "건물층수(전체)"],
				comNm: [this.state.requestInfo.comNm, "상호(기관)"],
				residentCont: [this.state.requestInfo.residentCont, "입주현황"]
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
		if (requestInfo.buildingDownstair == 0 && requestInfo.buildingUpstair == 0) {
			alert_msg("건물층수를 선택하세요.");
			$("#buildingDownstair").focus();
			return false;
		}
		if (requestInfo.residentCont == "") {
			alert_msg("입주현황을 입력하세요.");
			$("#residentCont").focus();
			return false;
		}
		return true;
	}
	//지하,지상 층계산
	handleBuildingStair(e) {
		var buildingDownstair = parseInt($("#buildingDownstair option:selected").val());
		var buildingUpstair = parseInt($("#buildingUpstair option:selected").val());
		var totalStair = buildingDownstair + buildingUpstair;
		if (buildingDownstair == 3 || buildingUpstair == 5)
			totalStair = totalStair + '층 이상';
		else
			totalStair = totalStair + '층';
		$('#totalStair').text(totalStair);

		this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				buildingDownstair: buildingDownstair,
				buildingUpstair: buildingUpstair
			}
		});

	}
	//상호(기관)명
	handleComNm(e) {
		this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				comNm: e.target.value.substring(0, 12)
			}
		});
		e.target.value = this.state.requestInfo.comNm.substring(0, 12)
	}

	//입주현황
	handleResidentCont(e) {
		this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				residentCont: e.target.value.substring(0, 37)
			}
		});
		e.target.value = this.state.requestInfo.residentCont.substring(0, 37)
	}

	//신청 구분에 따른 UI 활성화
	toggleUIGubun(gubun, id, uiBox, gubunNm) {

		if (gubun == this.state.requestInfo.businCd) {//현재업종과 같은 변경요청 없종 선택 불가

			return false;
		}
		this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				chBusinNm: gubunNm,//변경요청업종코드명
				chBusinCd: gubun//변경요청업종코드
			}
		})
		radioMW(id, uiBox);
	}

	// 서비스를 서버로 요청한다.
	submitApplication() {
		const that = this;

		var url = gContextUrl + "/citizen/common/procApplyTyinduChnge.do";
		const sendData = this.getQueryString();


		fetch('POST', url, sendData, function (error, data) {
			// 에러가 발생한 경우
			if (error) {
				alert_msg(that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
				return;
			}
			cyberMinwon.goFront('B02');
			//that.render();
		});
	}

	getQueryString() {
		const requestInfo = this.state.requestInfo;
		const EditTyinduChngeObjcData = {
			chBusinNm: requestInfo.chBusinNm,//변경업종명
			chBusinCd: requestInfo.chBusinCd,//변경업종코드
			businNm: requestInfo.businNm,//업종명
			businCd: requestInfo.businCd,//업종코드
			buildingDownstair: requestInfo.buildingDownstair,//지하
			buildingUpstair: requestInfo.buildingUpstair,//지상
			comNm: requestInfo.comNm,//상호(기관)
			residentCont: requestInfo.residentCont//입주현황
		}

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
      <!-- 상하수도 누수요금 감면 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
		            <label class="input-label-1"><span class="form-req">변경요청 업종을 선택하세요.</span></label>
		            <ul class="mw-opt mw-opt-5 row">
			            <li id="aGubun10" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('10', '#aGubun10', '.aGubun', '가정용');"><span>가정용</span></a>
			            </li>
			            <li id="aGubun11" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('11', '#aGubun11','.aGubun', '가정용(공동수도)');"><span>가정용(공동수도)</span></a>
			            </li>
			            <li id="aGubun30" class="aGubun off">
			            <a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('30', '#aGubun30','.aGubun', '일반용');"><span>일반용</span></a>
			            </li>
			            <li id="aGubun31" class="aGubun off">
			            <a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('31', '#aGubun31','.aGubun', '일반용(임시급수)');"><span>일반용(임시급수)</span></a>
			            </li>
			            <li id="aGubun40" class="aGubun off">
			            <a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('40', '#aGubun40','.aGubun', '욕탕용');" disabled><span>욕탕용</span></a>
			            </li>
		            </ul>
	            </li>
	            <li>
		            <label for="" class="input-label-1"><span class="form-req">건물층수를 선택하세요.</span></label>
		            지하
		            <select id="buildingDownstair" name="buildingDownstair" title="선택" class="input-box input-w-sel" onChange="cyberMinwon.state.currentModule.state.currentPage.handleBuildingStair(this);">
			            <option value="0">0층</option>
			            <option value="1">1층</option>
			            <option value="2">2층</option>
			            <option value="3">3층이상</option>
		            </select>
		            지상
		            <select id="buildingUpstair" name="buildingUpstair" title="선택" class="input-box input-w-sel" onChange="cyberMinwon.state.currentModule.state.currentPage.handleBuildingStair(this);">
			            <option value="0">0층</option>
			            <option value="1">1층</option>
			            <option value="2">2층</option>
			            <option value="3">3층</option>
			            <option value="4">4층</option>
			            <option value="5">5층이상</option>
		            </select>
		            <span class="txt_word1 txt_word1_ml1">전체</span>
		            <span class="txt_word1 txt_word1_ml1" title="전체 층수" id="totalStair">0층</span>
	            </li>
	            <li>
	            	<label for="" class="input-label"><span>상호(기관)</span></label>
	            	<input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleComNm(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleComNm(event)"
	            	value="${that.state.requestInfo.comNm}"
	            	type="text" id="comNm" name="comNm" class="input-box input-w-2" maxlength="12"/>
	            </li>
	            <li>
	            	<label for="" class="input-label"><span class="form-req">입주현황</span></label>
	            	<input onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleResidentCont(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleResidentCont(event)"
	            	value="${that.state.requestInfo.residentCont}"
	            	type="text" id="residentCont" name="residentCont" class="input-box input-w-2" maxlength="37"/>
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
				businNm: cyberMinwon.state.currentModule.state.applicationPage.state.suyongaInfo.state.suyongaInfo.idtCdSNm,//(현)업종코드명
				businCd: cyberMinwon.state.currentModule.state.applicationPage.state.suyongaInfo.state.suyongaInfo.idtCdS//(현)업종코드
			}
		});
		$("#aGubun" + that.state.requestInfo.businCd).addClass("disable");
		//
		if (that.state.requestInfo.businCd == that.state.requestInfo.chBusinCd) {
			if (that.state.requestInfo.businCd == "10") {
				this.setState({
					...this.state,
					requestInfo: {
						...this.state.requestInfo,
						chBusinNm: "가정용(공수도)",//(현)업종코드명
						chBusinCd: "11",//(현)업종코드명
					}
				});
			} else {
				this.setState({
					...this.state,
					requestInfo: {
						...this.state.requestInfo,
						chBusinNm: "가정용",//(현)업종코드명
						chBusinCd: "10",//(현)업종코드명
					}
				});
			}
		}




		radioMW('#aGubun' + that.state.requestInfo.chBusinCd, '.aGubun');
		$("#buildingDownstair").val(that.state.requestInfo.buildingDownstair).prop("selected", true);
		$("#buildingUpstair").val(that.state.requestInfo.buildingUpstair).prop("selected", true);

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