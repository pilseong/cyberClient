class B20DetailPage {
  constructor(parent, minwonCd) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        contents: '', // 내용
        rtnWay: '',   // 수신방법
        fileName: '', //첨부파일명
        file: '' //첨부파일
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
        contents: "",
        rtnWay: "0"
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
      viewB20Detail: {
        title: this.state.description.minwonNm,
        contents: [this.state.requestInfo.contents, '내용'],
        rtnWay: [this.state.requestInfo.rtnWay == "0" ? "전자우편(eMail)" : "우편 또는 유선", '수신방법'],
        fileName: [this.state.requestInfo.fileName ? this.state.requestInfo.fileName : "없음", '파일명']
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
    if (!requestInfo.contents) {
      alert_msg("신청 내용을 입력하세요.");
      return false;
    }
    return true;
  }
  //내용 연동
  handleContents(e) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        contents: e.target.value.substring(0, 3900)
      }
    });
    e.target.value = this.state.requestInfo.contents.substring(0, 3900);
  }

  handleChangeFile(e) {
    const inputFile = e.target;
    //임시 파일 체크
    let ext = e.target.value.split(".").pop().toLowerCase();
    if ($.inArray(ext, gVariables['imgFileUploadPosible']) < 0) {
      alert_msg("업로드가 제한된 파일입니다. 확장자를 체크해 주세요.\n[업로드 가능 파일 : " + gVariables['imgFileUploadPosible'].toString() + " ]");
      return false;
    }
    if (inputFile != undefined && inputFile !== null) {
      let fileSize = inputFile.files[0].size;
      let maxSize = gVariables['fileUploadSize'] * 1024 * 1024;
      if (fileSize > maxSize) {
        alert_msg("파일용량 " + gVariables['fileUploadSize'] + "MB를 초과하였습니다.");
        //					$("#file1").focus();
        return false;
      }
    }
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        fileName: e.target.files[0].name,
        file: inputFile
      }
    });
    $("#fileName").val(e.target.files[0].name);
    //	  	e.target.value = this.state.requestInfo.fileName;
  }

  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun, id, uiBox) {
    /*if (gubun === 'ownerCheck') {
      this.setState({
        ...this.state,
        ownerCheck: !this.state[gubun]
      });
    } else if (gubun === 'userCheck') {
      this.setState({
        ...this.state,
        userCheck: !this.state[gubun]
      });
    }*/
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        rtnWay: gubun
      }
    })
    radioMW(id, uiBox);
    //this.render();
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyChrgeObjc.do";
    var formEditChrgeObjc = new FormData();//ChrgeObjcVO chrgeObjcVO
    const sendData = this.getQueryString();
    for (let key in sendData) {
      formEditChrgeObjc.append(key, sendData[key]);
    }

    if (that.state.requestInfo.file != null) {
      const inputFile = that.state.requestInfo.file.files[0];
      formEditChrgeObjc.append("file", inputFile);
    } else {
      formEditChrgeObjc.append("file", "");
    }

    //
    //    return;
    fetchMultiPart(url, formEditChrgeObjc, function (error, data) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg(that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
        return;
      }
      cyberMinwon.goFront('B20');
      //      that.render();
    });
  }

  getQueryString() {
    const requestInfo = this.state.requestInfo;
    const EditChrgeObjcData = {
      'contents': requestInfo.contents,
      'rtnWay': requestInfo.rtnWay
      //'ChrgeObjcVO.file1' : requestInfo.file1 === '' ? $("#file1").val() : requestInfo.file1,
    }

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...EditChrgeObjcData
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
                <label for="contents" class="input-label"><span class="form-req">신청 내용을 입력하세요</span></label> 
                <textarea onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleContents(event)" onchange="cyberMinwon.state.currentModule.state.currentPage.handleContents(event)"
                	id="contents" name="contents" class="textarea-box"  title="내용" maxlength="3900">${that.state.requestInfo.contents}</textarea>
              </li>
	          <li>
		          <label for="form-mw36-tx" class="input-label">첨부파일</label>
		          
		          
		          
		          
		          <ui class="mw-opt mw-opt-6 row">
			          <div class="filebox">
			          <label for="file1" class="fileLabel">파일 선택</label>
		                <input type="text" id="fileName" name="fileName" class="upload-name" value="" placeholder="선택된 파일 없음" readonly >
		                <input type="file" id="file1" name="file" title="첨부파일" class="display-none"
		                	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeFile(event)">
		                <a href="javascript:void(0);" class="btn btnSS" onclick="cyberMinwon.state.currentModule.state.currentPage.handleClickDeleteFile(this)"><span>삭제</span></a>
				      </div>
		          </ui>
		          
		          
		          
		          
		          
	          </li>
		      </li>
	          <li>
		          <label class="input-label-1"><span class="form-req">결과 수신방법을 선택하세요.</span></label>
		          <ul class="mw-opt mw-opt-6 row">
			          <li id="aGubun1" class="aGubun off" style="width:25%;">
			          	<a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('0', '#aGubun1', '.aGubun');"><span>전자우편(eMail)</span></a>
			          </li>
			          <li id="aGubun2" class="aGubun off" style="width:25%;">
			          	<a href="javascript:void(0);" onclick="cyberMinwon.state.currentModule.state.currentPage.toggleUIGubun('1', '#aGubun2','.aGubun');"><span>우편 또는 유선</span></a>
			          </li>
		          </ul>
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

    (that.state.requestInfo.rtnWay == "0") ? radioMW('#aGubun1', '.aGubun') : radioMW('#aGubun2', '.aGubun');

    if (that.state.requestInfo.fileName) {
      $("#fileName").val(that.state.requestInfo.fileName);
    }
  }

  //첨부파일 삭제
  handleClickDeleteFile(e) {
    if (confirm("첨부된 파일을 삭제하시겠습니까?")) {

      let agent = navigator.userAgent.toLowerCase();

      if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
        // ie 일때 input[type=file] init.
        $(e).siblings("input").replaceWith($(e).siblings("input").clone(true));
      } else {
        //other browser 일때 input[type=file] init.
        $(e).siblings("input").val("");
      }
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          fileName: '',
          file: ''
        }
      });
    }
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