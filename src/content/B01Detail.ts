import { fetch, fetchMultiPart } from './../util/unity_resource';
//import * as CyberMinwon from './../CyberMinwon';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var gContextUrl: string;
declare var gVariables: any;
declare var alert_msg: (msg: string) => void;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var $: any;

export default class B01DetailPage {
  state: any;

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        leakPosCd: '', // 누수위치
        leakPos: '',   // 누수위치 - 기타
        leakReaCd: '',  // 누수원인
        leakRea: '', // 누수원인 - 기타
        leakRepairDt: '', //누수수리일시
        fileName: '', //첨부파일명
        file: '' //첨부파일
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
    var leakPosCd = fncGetCodeByGroupCdUsing("043");
    console.log("leakPosCd", leakPosCd);
    //누수원인
    var leakReaCd = fncGetCodeByGroupCdUsing("042");
    console.log("leakReaCd", leakReaCd);

    that.setState({
      ...that.state,
      statusInfo: {
        comboLeakPosCd: leakPosCd,
        comboLeakReaCd: leakReaCd
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

    fetch('GET', url, queryString, function (error: any, data: any) {
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
      viewB01Detail: {
        title: this.state.description.minwonNm,
        leakPos: [this.state.requestInfo.leakPos, '누수위치'],
        leakRea: [this.state.requestInfo.leakRea, '누수원인'],
        leakRepairDt: [this.state.requestInfo.leakRepairDt, '누수수리일자'],
        fileName: [this.state.requestInfo.fileName, '파일명']
      }
    };
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
  }

  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;

    if (requestInfo.leakPosCd === '008' && !requestInfo.leakPos) {
      alert("누수위치를 입력하세요.");
      $("#leakPos").focus();
      return false;
    }

    if (requestInfo.leakReaCd === '006' && !requestInfo.leakRea) {
      alert("누수원인을 입력하세요");
      $("#leakRea").focus();
      return false;
    }

    // 첨부파일 필수.
    if (!requestInfo.fileName) {
      alert("첨부파일을 등록해 주세요");
      $("#file1").focus();
      return false;
    }

    //    if(!fncCheckFileExt("file1")){
    //    	$("#file1").focus();
    //    }
    return true;
  }

  //누수위치 onchange
  handleChangeLeakPosCd(e: any) {
    //  	console.log("handleChangeLeakPosCd", e);
    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    let preValue = this.state.requestInfo.leakPosCd;
    console.log("value::" + value);
    console.log("name::" + name);
    if (value == '008') {//기타
      $("#leakPos").show();
      //  		$("#leakPos").val('');
      $("#leakPos").val((preValue == '008' && this.state.requestInfo.leakPos) ? this.state.requestInfo.leakPos : '');
    } else {
      $("#leakPos").hide();
      $("#leakPos").val(name);
    }

    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        leakPosCd: value,
        //					leakPos: value === '008'? '' : name
        leakPos: value === '008' ? ((preValue == '008' && this.state.requestInfo.leakPos) ? this.state.requestInfo.leakPos : '') : name
      }
    });
  }

  //
  handleChangeLeakPosEtc(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        leakPos: e.target.value.substring(0, 200)
      }
    });
    e.target.value = this.state.requestInfo.leakPos.substring(0, 200);
  }

  //누수원인 onchange 
  handleChangeLeakReaCd(e: any) {
    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    let preValue = this.state.requestInfo.leakReaCd;
    console.log("value::" + value);
    console.log("name::" + name);
    if (value == '006') { //기타
      $("#leakRea").show();
      //  		$("#leakRea").val('');
      $("#leakRea").val((preValue == '006' && this.state.requestInfo.leakRea) ? this.state.requestInfo.leakRea : '');
    } else {
      $("#leakRea").hide();
      $("#leakRea").val(name);
    }

    if (value == '007') { //
      $("#leakRea_007").addClass("display-block");
      $("#leakRea_007").removeClass("display-none");
    } else {
      $("#leakRea_007").addClass("display-none");
      $("#leakRea_007").removeClass("display-block");
    }
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        leakReaCd: value,
        //					leakRea: value === '006'? '' : name
        leakRea: value === '006' ? ((preValue == '006' && this.state.requestInfo.leakRea) ? this.state.requestInfo.leakRea : '') : name
      }
    });

  }

  //
  handleChangeLeakRea(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        leakRea: e.target.value.substring(0, 200)
      }
    });
    e.target.value = this.state.requestInfo.leakRea.substring(0, 200);
  }

  //
  handleChangeRepairDt(e: any) {
    console.log(e);
    console.log(e.target.value);
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        leakRepairDt: e.target.value
      }
    });
    e.target.value = this.state.requestInfo.leakRepairDt;
  }

  handleChangeFile(e: any) {
    console.log(e);
    console.log(e.target.files[0].name);
    const inputFile = e.target;

    console.log(inputFile);
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
        //				$("#file1").focus();
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
    //  	e.target.value = this.state.requestInfo.fileName;
  }

  handleClickDeleteFile(e: any) {
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

  handleClickFileBtn(fileId: any) {
    $("#" + fileId).trigger("click");
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyWtlkgReduc.do";
    var formWtlkgReduc = new FormData();
    console.log("formWtlkgReduc setting :::::::::::");
    const sendData = this.getQueryString();
    for (let key in sendData) {
      //    	console.log("key::"+key+"--val::"+sendData[key]);
      formWtlkgReduc.append(key, sendData[key]);
    }

    const inputFile = that.state.requestInfo.file;
    console.log(inputFile);
    console.log("file data:::" + inputFile.files[0]);
    formWtlkgReduc.append("file", inputFile.files[0]);

    //    console.log("cyberMinwon::",CyberMinwon);
    //
    //    return;

    fetchMultiPart(url, formWtlkgReduc, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg(data.errorMsg + "\n" + that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
        return;
      }
      if (data.resultCd === '00') {
        //      	console.log("cyberMinwon::",CyberMinwon);
        // cyberMinwon.goFront('B14');
      } else {
        alert_msg(data.errorMsg + "\n" + that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
      }
      console.log(data);

      console.log('after fetching', that.state);
      //      that.render();
    });
  }

  getQueryString() {
    const requestInfo = this.state.requestInfo;

    const WtlkgReducData = {
      //
      'leakPosCd': requestInfo.leakPosCd,
      'leakPos': requestInfo.leakPos,
      'leakReaCd': requestInfo.leakReaCd,
      'leakRea': requestInfo.leakRea,
      'leakRepairDt': requestInfo.leakRepairDt.replaceAll("-", "")
      //    		'WtlkgReducVO.file' : requestInfo.file1,
    }

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...WtlkgReducData
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
	            <input type="text" id="leakRea" name="leakRea" class="input-box input-w-3" title="누수원인 기타 입력" maxlength="200" placeholder="누수원인 기타 입력"
	            	value="${that.state.requestInfo.leakRea}"
	            	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakRea(event)"
                onpaste="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakRea(event)">
	            <p id="leakRea_007" class="display-none form-cmt txStrongColor">
                *양변기고장에 따른 옥내누수는 상수도요금과 물이용부담금이 미감면됨(하수도요금만 감면됨)
              </p>
	          </li>
  
              <li>
              	<label for="leakRepairDt" class="input-label"><span>누수수리일시</span></label>
              	<input type="date" id="leakRepairDt" name="leakRepairDt" class="input-box input-w-2" maxlength="10"
              		value="${that.state.requestInfo.leakRepairDt}"
              		onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeRepairDt(event)">
              	
              </li>
  
              <li>
	              	<label for="form-mw36-tx" class="input-label"><span class="form-req">첨부파일</span></label>
	              	<label for="file1" class="fileLabel">파일 선택</label>
	                <input type="text" id="fileName" name="fileName" value="" placeholder="선택된 파일 없음" readonly >
	                <input type="file" id="file1" name="file" title="첨부파일" class="display-none"
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

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));

    this.afterRender();
  }

  // 기본 설정값은 여기에서 랜더링 해야 한다.
  afterRender() {
    const that = this;

    /*//누수위치
    var leakPosCd = fncGetCodeByGroupCdUsing("043");
    console.log("leakPosCd",leakPosCd);
    //누수원인
    var leakReaCd = fncGetCodeByGroupCdUsing("042");
    console.log("leakReaCd",leakReaCd);
  	
    that.setState({
      ...that.state,
      statusInfo: {
        comboLeakPosCd: leakPosCd,
        comboLeakReaCd: leakReaCd
      }
    });*/

    console.log("afterRender() in", that);
    fncSetComboByCodeList("leakPosCd", that.state.statusInfo.comboLeakPosCd);
    console.log("afterRender() in that.state.requestInfo.leakPosCd", that.state.requestInfo.leakPosCd);
    $("#leakPosCd").val(that.state.requestInfo.leakPosCd ? that.state.requestInfo.leakPosCd : $("#leakPosCd option:selected").val())
      .trigger("change");
    //  	if(that.state.requestInfo.leakPos){
    //  		$("#leakPos").val(that.state.requestInfo.leakPos);
    //  	}

    fncSetComboByCodeList("leakReaCd", that.state.statusInfo.comboLeakReaCd);
    $("#leakReaCd").val(that.state.requestInfo.leakReaCd ? that.state.requestInfo.leakReaCd : $("#leakReaCd option:selected").val())
      .trigger("change");
    //  	if(that.state.requestInfo.leakRea){
    //	  	$("#leakRea").val(that.state.requestInfo.leakRea);
    //		}
    if (that.state.requestInfo.fileName) {
      $("#fileName").val(that.state.requestInfo.fileName);
    }

  }

  renderDescription(target: any) {
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