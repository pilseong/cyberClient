import CyberMinwon from '../infra/CyberMinwon';
import { fetch, fetchMultiPart } from './../util/unity_resource';
import { radioMW, citizenAlert, citizenConfirm, maskingFnc } from './../util/uiux-common';

declare var gContextUrl: string;
declare var $: any;
declare var gVariables: any;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var cyberMinwon: CyberMinwon;

export default class I12DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      statusInfo: any;
      minwonGubun: string;//민원구분 (B12/B16/B17/B22)
      requestInfo: {
        useGubun: string;//용도구분
        agreeYn: string;//행정정보 공동이용 동의여부
        useCnt: string;//사용세대수
        dormiNm: string;//시설명
        manCnt: string;//거주인수
        geUseStateTy: string;//계량기사용현황
        buildConfirm: string;//건축물대장 또는 안전시설 등 완비증명서 확인
        roomCnt: string;//방수(건축물현황도)
        tobeBizTy: string;//변경요청 업종
        file1: any;//건축물대장 또는 안전시설 등 완비증명서 파일
        fileName1: string;//건축물대장 또는 안전시설 등 완비증명서 파일 이름
        file2: any;//건축물현황도 파일
        fileName2: string;//건축물현황도 파일 이름
      };
      description: any;
      
      viewRequestInfo: any;
      isSubmitSuccessful: boolean;
      submitResult: any;
  };
  constructor(parent:any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {},
      minwonGubun: "",//민원구분 (B12/B16/B17/B22)
      requestInfo: {
        useGubun: "",//용도구분
        agreeYn: "",//행정정보 공동이용 동의여부
        useCnt: "",//사용세대수
        dormiNm: "",//시설명
        manCnt: "",//거주인수
        geUseStateTy: "",//계량기사용현황
        buildConfirm: "",//건축물대장 또는 안전시설 등 완비증명서 확인
        roomCnt: "",//방수(건축물현황도)
        tobeBizTy: "",//변경요청 업종
        file1: "",//건축물대장 또는 안전시설 등 완비증명서 파일
        fileName1: "",//건축물대장 또는 안전시설 등 완비증명서 파일 이름
        file2: "",//건축물현황도 파일
        fileName2: ""//건축물현황도 파일 이름
      },

      description: {},
      viewRequestInfo: {},
      isSubmitSuccessful: false,
      submitResult: {}
    };
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';

    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      minwonGubun: "B12",//민원구분 (B12/B16/B17/B22)
      requestInfo: {
        useGubun: "",//용도구분
        agreeYn: "",//행정정보 공동이용 동의여부
        useCnt: "",//사용세대수
        dormiNm: "",//시설명
        manCnt: "",//거주인수
        geUseStateTy: "",//계량기사용현황
        buildConfirm: "",//건축물대장 또는 안전시설 등 완비증명서 확인
        roomCnt: "",//방수(건축물현황도)
        tobeBizTy: "",//변경요청 업종
        file1: "",//건축물대장 또는 안전시설 등 완비증명서 파일
        fileName1: "",//건축물대장 또는 안전시설 등 완비증명서 파일 이름
        file2: "",//건축물현황도 파일
        fileName2: ""//건축물현황도 파일 이름
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
  	var applyGubun;//신청구분: [가정용주택,주거·점포겸용주택,공동·다가구 주택 등,기숙사,사회복지시설,고시원]
  	if(that.state.minwonGubun == "B12"){
      applyGubun = "가정용주택";
    } else if(that.state.minwonGubun == "B16"){
      if(that.state.requestInfo.useGubun == "001"){
        applyGubun = "기숙사";
      } else {//002
        applyGubun = "사회복지시설";
      }
    } else if(that.state.minwonGubun == "B17"){
      if(that.state.requestInfo.useGubun == "003"){
        applyGubun = "주거·점포겸용주택";
      } else {//004
        applyGubun = "공동·다가구 주택 등";  
      }
    } else {//B22
      applyGubun = "고시원";
    }
  	
  	if(that.state.minwonGubun == "B12" || that.state.minwonGubun == "B17"){
      infoArray =  {
            noinfo: {
//                title: that.state.description.minwonNm,
                applyGubun: [applyGubun, "신청구분"],
                useCnt: [that.state.requestInfo.useCnt+" 세대", "현재 거주 세대 수"],
                agreeYn: [that.state.requestInfo.agreeYn == "Y" ? "동의함" : "동의하지 않음", "세대분할 신청 동의"]
              }
        }
    } else if(that.state.minwonGubun == "B16"){
      infoArray =  {
            noinfo: {
//                title: that.state.description.minwonNm,
                applyGubun: [applyGubun, "신청구분"],
                dormiNm: [that.state.requestInfo.dormiNm, "시설명"],
                manCnt: [that.state.requestInfo.manCnt+" 명", "거주인 수"],
                useCnt: [that.state.requestInfo.useCnt+" 세대", "현재 거주 세대 수"]
              }
        }
    } else {//B22
      infoArray =  {
            noinfo: {
//                title: that.state.description.minwonNm,
                applyGubun: [applyGubun, "신청구분"],
                geUseStateTy: [that.state.requestInfo.geUseStateTy == "on" ? "단독 사용" : "단독 사용 아님", "계량기 사용 현황"],
                buildConfirm: [that.state.requestInfo.buildConfirm == "on" ? "예" : "아니오", "고시원 업종 표기 여부"],
                roomCnt: [that.state.requestInfo.roomCnt+" 개", "방 수"],
                tobeBizTy: [that.state.requestInfo.tobeBizTy == "on" ? "가정용" : "변경없음", "변경요청 업종"],
                fileName1: [that.state.requestInfo.fileName1, "완비증명서 등 파일"],
                fileName2: [that.state.requestInfo.fileName2, "건축물 현황도 파일"]
              }
        }
    }
    
    
  	return infoArray;
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const that = this;
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    var applyGubun;//신청구분: [가정용주택,주거·점포겸용주택,공동·다가구 주택 등,기숙사,사회복지시설,고시원]
    if(that.state.minwonGubun == "B12"){
      applyGubun = "가정용주택";
    } else if(that.state.minwonGubun == "B16"){
      if(that.state.requestInfo.useGubun == "001"){
        applyGubun = "기숙사";
      } else {//002
        applyGubun = "사회복지시설";
      }
    } else if(that.state.minwonGubun == "B17"){
      if(that.state.requestInfo.useGubun == "003"){
        applyGubun = "주거·점포겸용주택";
      } else {//004
        applyGubun = "공동·다가구 주택 등";  
      }
    } else {//B22
      applyGubun = "고시원";
    }
    // 신청 실패 화면
    if (!this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: this.state.description.minwonNm + ` ${applyGubun} 결과`,
        width: "150px",
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [this.state.submitResult.data.applyDt?this.state.submitResult.data.applyDt:applyDt, '신청일시'],
        desc: ['정상적으로 처리되지 않았습니다.', '신청결과'],
        cause: [this.state.submitResult.errorMsg,'사유']
      }
    // 성공
    } else {
      infoData['noinfo'] = {
//        title:  this.state.description.minwonNm + ` ${applyGubun} 결과`,
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
    const minwonGubun = this.state.minwonGubun; 
    const requestInfo = this.state.requestInfo; 
    
    if(minwonGubun == "B12" || minwonGubun == "B17"){
      if(!requestInfo.useCnt){
        citizenAlert("거주세대수를 입력해 주세요.").then(result => {
          if(result){
            $("#useCnt").focus();
          }
        });
        return false;
      }
      if(requestInfo.agreeYn != "Y"){
        citizenAlert("세대분할 신청 동의에 동의해 주세요.").then(result => {
          if(result){
            $("#agreeYn").focus();
          }
        });
        return false;
      }
    } else if(minwonGubun == "B16"){
      if(!requestInfo.dormiNm){
        citizenAlert("시설명을 입력해 주세요.").then(result => {
          if(result){
            $("#dormiNm").focus();
          }
        });
        return false;
      }
      if(!requestInfo.manCnt){
        citizenAlert("거주인 수를 입력해 주세요.").then(result => {
          if(result){
            $("#manCnt").focus();
          }
        });
        return false;
      }
      if(!requestInfo.useCnt){
        citizenAlert("거주세대수를 입력해 주세요.").then(result => {
          if(result){
            $("#useCnt").focus();
          }
        });
        return false;
      }
      if(requestInfo.useCnt > requestInfo.manCnt){
        citizenAlert("세대수가 거주인 수보다 많을 수 없습니다.").then(result => {
          if(result){
            $("#useCnt").focus();
          }
        });
        return false;
      }
    } else {//B22
      if(!requestInfo.geUseStateTy){
        citizenAlert("수도계량기 사용현황이 '단독사용'입니다.").then(result => {
          if(result){
            $("#geUseStateTy").focus();
          }
        });
        return false;
      }
      if(!requestInfo.buildConfirm){
        citizenAlert("'건축물대장 또는 안전시설 등 완비증명서'을 확인하신 다음 '고시원 업종 표기'에 체크바랍니다.").then(result => {
          if(result){
            $("#buildConfirm").focus();
          }
        });
        return false;
      }
      if(!requestInfo.roomCnt){
        citizenAlert("건축물현황도 방수를 입력해 주세요.").then(result => {
          if(result){
            $("#roomCnt").focus();
          }
        });
        return false;
      }
      if(!requestInfo.file1){
        citizenAlert("건축물 대장을 첨부하셔야 합니다. '찾아보기'로 찾으신 후 '첨부'버튼을 반드시 클릭바랍니다.").then(result => {
          if(result){
            $("#file1").focus();
          }
        });
        return false;
      }
      if(!requestInfo.file2){
        citizenAlert("건축물 현황도를 첨부하셔야 합니다. '찾아보기'로 찾으신 후 '첨부'버튼을 반드시 클릭바랍니다.").then(result => {
          if(result){
            $("#file2").focus();
          }
        });
        return false;
      }
    }
    
    
    return true;
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(minwonCd:string, uiBox:string, useGubun:string) {
    var tabId = useGubun ? "#"+minwonCd+useGubun : "#"+minwonCd;
	  //disble처리
	  if($(tabId).hasClass("disable")){
		  return false;
	  }
	  this.setState({
		  ...this.state,
		  minwonGubun : minwonCd,
		  requestInfo: {
        ...this.state.requestInfo,
  		  useGubun : useGubun// ex) 001,002,003,004
        }
	  })

	  $(".aGubun").removeClass("disable");
	  radioMW(tabId, uiBox);
	  
	  $(".uiType").hide();
	  $("#uiTypeAgree").hide();
	  //민원 구분에 따른 화면 표출
	  if(minwonCd == "B12" || minwonCd == "B17"){
      $("#uiType1").show();
      $("#uiTypeAgree").show();
    } else if(minwonCd == "B16"){
      $("#uiType2").show();
    } else {
      $("#uiType3").show();
    }
	  //gubun == "B06" ? $("#closeDtFrom").parent().show() : $("#closeDtFrom").parent().hide();
  }
  
  //행정정보 공동이용 동의여부(agreeYn)
  handleAgreeYn(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.checked ? "Y" : ""
        }
      });
      e.target.value = this.state.requestInfo.agreeYn
    }
  
  //사용세대수(useCnt)
  handleUseCnt(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.value.replace(/[^0-9]/g, "").substring(0, 5)
        }
      });
      e.target.value = this.state.requestInfo.useCnt
    }
  
  //시설명(dormiNm)
  handleDormiNm(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: fncCutByByte(e.target.value, 50)
        }
      });
      e.target.value = this.state.requestInfo.dormiNm
    }
    
  //거주인수(manCnt)
  handleManCnt(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.value.replace(/[^0-9]/g, "").substring(0, 4)
        }
      });
      e.target.value = this.state.requestInfo.manCnt
    }
    
  //계량기사용현황(geUseStateTy)
  handleGeUseStateTy(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.checked ? "on" : ""
        }
      });
      e.target.value = this.state.requestInfo.geUseStateTy
    }
  
  //건축물대장 또는 안전시설 등 완비증명서 확인(buildConfirm)
  handleBuildConfirm(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.checked ? "on" : ""
        }
      });
      e.target.value = this.state.requestInfo.buildConfirm
    }
  
  //방수(건축물현황도)(roomCnt)
  handleRoomCnt(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.value.replace(/[^0-9]/g, "").substring(0, 3)
        }
      });
      e.target.value = this.state.requestInfo.roomCnt
    }
    
  //변경요청 업종(tobeBizTy)
  handleTobeBizTy(e: any) {
    var idtCdSNm = this.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.idtCdSNm;
    if(idtCdSNm == "가정용(10)"){
      citizenAlert("현업종이 가정용이므로 선택할 수 없습니다");
      $("#tobeBizTy").attr("checked", false);
      $("#tobeBizTy").attr("disabled", true);
      return false;
    }
    
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.checked ? "on" : ""
        }
      });
      e.target.value = this.state.requestInfo.tobeBizTy
    }
   
   //파일 관리 함수 
   handleChangeFile(e: any, obj:any) {
    const inputFile = e.target;
    let fileIdx = parseInt(inputFile.id.substring(inputFile.id.length-1));
    const fileNameId = $(obj).prev().attr("id");
    //임시 파일 체크
    let ext = e.target.value.split(".").pop().toLowerCase();
    if($.inArray(ext, gVariables['imgFileUploadPosible']) < 0){
      citizenAlert("업로드가 제한된 파일입니다. 확장자를 확인해 주세요.");
      //citizenAlert("업로드가 제한된 파일입니다. 확장자를 체크해 주세요.\n[업로드 가능 파일 : " + gVariables['imgFileUploadPosible'].toString() + " ]");
      $("#file"+fileIdx).val("");
      return false;
    }
    if(inputFile != undefined && inputFile !== null){
      let fileSize = inputFile.files[0].size;
      let maxSize = gVariables['fileUploadSize'] * 1024 *1024;
      if (fileSize > maxSize){
        citizenAlert("파일용량 " + gVariables['fileUploadSize'] + "MB를 초과하였습니다.");
        $("#file"+fileIdx).val("");
        return false;
      }
    }
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [e.target.id]: inputFile,
        [fileNameId]: e.target.files[0].name
      }
    });
    $(obj).prev().val(e.target.files[0].name);
  }
  
  //첨부파일 삭제
  handleClickDeleteFile(e: any) {
    var fileId = $(e).prev().attr("id");
    var fileNameId = $(e).prev().prev().attr("id");
    citizenConfirm("첨부된 파일을 삭제하시겠습니까?").then(result => {
      $(e).focus();
      if(!result){
        return false;
      }
      
      let agent = navigator.userAgent.toLowerCase();
      
      if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ){
          // ie 일때 input[type=file] init.
          $(e).siblings("input").replaceWith( $(e).siblings("input").clone(true) );
      } else {
          //other browser 일때 input[type=file] init.
        $(e).siblings("input").val("");
      }
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [fileId]: '',
          [fileNameId]: ''
        }
      });
    });
  }
    
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;
    var url = gContextUrl + "/citizen/common/";
    if(that.state.minwonGubun == "B12"){
      url += "procApplyHmPartitn.do";
    } else  if(that.state.minwonGubun == "B16"){
      url += "procApplyWlfarePartitn.do";
    } else  if(that.state.minwonGubun == "B17"){
      url += "procApplyCombiPartitn.do";
    } else {//B22
      url += "procApplyOneroomPartitn.do";
    }
    var formUnionPartitnObjc = new FormData();
    const sendData = this.getQueryString();
    
    for(let key in sendData){
      formUnionPartitnObjc.append(key, sendData[key]);
    }
    
    if(that.state.minwonGubun == "B22"){//B22는 파일이 있어 fetchMultiPart 사용
      const inputFile1 = that.state.requestInfo.file1.files[0];
      const inputFile2 = that.state.requestInfo.file2.files[0];
      formUnionPartitnObjc.append("file", inputFile1);
      formUnionPartitnObjc.append("file", inputFile2);
      
      fetchMultiPart(url, formUnionPartitnObjc, function (error: any, data: any) {
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
      
    } else {//B12,B16,B17는 파일이 없어 일반 fetch
      
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
      
  }

  getQueryString() {
  	const requestInfo = this.state.requestInfo;
  	const requestData:any = {};
  	const minwonGubun = this.state.minwonGubun;
  	
	if(minwonGubun == "B12" || minwonGubun == "B17"){
    requestData["useGubun"] = requestInfo.useGubun;//용도구분 [주거·점포검용주택,공동·다가구 주택 등]
    requestData["useCnt"] = requestInfo.useCnt;//현재 거주 세대 수
    requestData["agreeYn"] = requestInfo.agreeYn;//행정정보 공동이용 동의
  } else if(minwonGubun == "B16"){
    requestData["useGubun"] = requestInfo.useGubun;//용도구분 [주거·점포검용주택,공동·다가구 주택 등]
    requestData["dormiNm"] = requestInfo.dormiNm;//시설명
    requestData["manCnt"] = requestInfo.manCnt;//거주인 수
    requestData["useCnt"] = requestInfo.useCnt;//현재 거주 세대 수
  } else {//B22
    requestData["geUseStateTy"] = requestInfo.geUseStateTy;//단독사용
    requestData["buildConfirm"] = requestInfo.buildConfirm;//고시원 업종 표기
    requestData["roomCnt"] = requestInfo.roomCnt;//방 수
    requestData["tobeBizTy"] = requestInfo.tobeBizTy;//가정용으로 변경 요청 여부
  }
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonGubun,
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
      <!-- 세대분할 신고 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>세대분할 구분을 선택해 주세요.</span></label>
		            <ul class="mw-opt mw-opt-6 row">
			            <li id="B12" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('B12', '.aGubun');"><span>가정용주택</span></a>
			            </li>
			            <li id="B17003" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('B17','.aGubun', '003');"><span>주거·점포겸용주택</span></a>
			            </li>
			            <li id="B17004" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('B17','.aGubun', '004');"><span>공동·다가구 주택 등</span></a>
			            </li>
			            <li id="B16001" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('B16','.aGubun', '001');"><span>기숙사</span></a>
			            </li>
			            <li id="B16002" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('B16','.aGubun', '002');"><span>사회복지시설</span></a>
			            </li>
			            <li id="B22" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('B22','.aGubun');"><span>고시원</span></a>
			            </li>
			          </ul> 
	            </li>
              <li>
                <label class="input-label"><span>현재 세대수</span></label>
                <input value="" type="text" id="hshldCnt" name="hshldCnt" class="input-box input-w-2" readonly/>
              </li>
              <li>
                <label class="input-label"><span>최종 검침일</span></label>
                <input value="" type="text" id="gcYyMmDd" name="gcYyMmDd" class="input-box input-w-2" readonly/>
              </li>
            </ul>
          </div><br>
          
          <!-- B12, B17 -->
          <div id="uiType1" class="form-mv row uiType">
            <ul>
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>세대분할 요금 적용 신청내용</span></label>
                <ul>
                  <li>
                    <label class="input-label" for="useCnt"><span>거주세대수</span></label>
                    <input onkeyup="${that.path}.handleUseCnt(event)" onchange="${that.path}.handleUseCnt(event)" 
                          value="${that.state.requestInfo.useCnt}" type="text" id="useCnt" name="useCnt" class="input-box input-w-2" placeholder="현재 거주 세대수" maxlength="5">
                    <p class="i12-info form-cmt pre-star tip-blue">세대가 거주하고 있으니 세대분할 요금 적용을 신청합니다.</p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- B12, B17 -->
          
          <!-- B16 -->
          <div id="uiType2" class="form-mv row uiType">
            <ul>
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>세대분할 요금 적용 신청내용</span></label>
                <ul>
                  <li>
                    <label for="dormiNm" class="input-label"><span>시설명</span></label>
                    <input onkeyup="${that.path}.handleDormiNm(event)" onchange="${that.path}.handleDormiNm(event)"
                      value="${that.state.requestInfo.dormiNm}" type="text" id="dormiNm" name="dormiNm" class="input-box input-w-2" placeholder="시설명" maxlength="12">
                  </li>
                  <li>
                    <label for="manCnt" class="input-label"><span>거주인 수</span></label>
                    <input onkeyup="${that.path}.handleManCnt(event)" onchange="${that.path}.handleManCnt(event)"
                      value="${that.state.requestInfo.manCnt}" type="text" id="manCnt" name="manCnt" class="input-box input-w-2" placeholder="거주인 수(숫자) 입력" maxlength="4">
                  </li>
                  <li>
                    <label for="useCnt" class="input-label"><span>거주세대수</span></label>
                    <input onkeyup="${that.path}.handleUseCnt(event)" onchange="${that.path}.handleUseCnt(event)"
                      value="${that.state.requestInfo.useCnt}" type="text" id="useCnt" name="useCnt" class="input-box input-w-2" placeholder="현재 거주 세대수(숫자) 입력" maxlength="5">
                    <p class="i12-info form-cmt pre-star tip-blue">세대가 거주하고 있으니 세대분할 요금 적용을 신청합니다.</p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- B16 -->
          
          <!-- B22 -->
          <div id="uiType3" class="form-mv row uiType">
            <ul>
              <li>
                <label class="input-label"><span class="form-req"><span class="sr-only">필수</span>방수(호)</span></label>
                <input onkeyup="${that.path}.handleRoomCnt(event)" onchange="${that.path}.handleRoomCnt(event)"
                  value="${that.state.requestInfo.roomCnt}" type="text" id="roomCnt" name="roomCnt" class="input-box input-w-2" placeholder="건축물현황도 방수(숫자) 입력" maxlength="3">
              </li>
              <p class="form-cmt pre-star tip-blue">건축물 현황도 내용으로 등록해 주세요.</p>
              <li>
                <label><span class="sr-only">고시원 업종을 확인해 주세요.</span></label>
                <input type="checkbox" name="buildConfirm" id="buildConfirm" 
                  onclick="${that.path}.handleBuildConfirm(event)"
                  ${that.state.requestInfo.buildConfirm ? 'checked' : ''}>
                <label class="chk-type chk-label" for="buildConfirm"><span>&quot;고시원 업종&quot;을 확인해 주세요.</span></label>
                <p class="pre-star tip-blue">건축물대장 또는 안전시설 등 완비증명서</p>
              </li>
              <li>
                <label><span class="sr-only">수도계량기 사용현황이 단독사용입니다.</span></label>
                <input type="checkbox" name="geUseStateTy" id="geUseStateTy" 
                  onclick="${that.path}.handleGeUseStateTy(event)"
                  ${that.state.requestInfo.geUseStateTy ? 'checked' : ''}>
                <label class="chk-type chk-label" for="geUseStateTy"><span>수도계량기 사용현황이 &quot;단독사용&quot;입니다.</span></label>
              </li>
              <li>
                <label><span class="sr-only">변경 업종을 가정용으로 변경합니다.(선택)</span></label>
                <input type="checkbox" name="tobeBizTy" id="tobeBizTy" 
                  onclick="${that.path}.handleTobeBizTy(event)"
                  ${that.state.requestInfo.tobeBizTy ? 'checked' : ''}>
                <label class="chk-type chk-label" for="tobeBizTy"><span>변경 업종을 가정용으로 변경합니다.<p class="tx-opt">(선택)</p></span></label>
              </li>
              <li>
                <!--<label class="input-label-1"><span class="form-req">증빙서류를 제출해 주세요. ( 두 서류 모두 필수 )</span></label>-->
                <ul>
                  <li class="addfile">
                    <label for="form-mw36-tx" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>건축물대장 또는 안전시설 등 완비증명서</span></label>
                    <label for="file1" class="fileLabel">파일 선택</label>
                        <input type="text" id="fileName1" name="fileName1" class="upload-name" value="${that.state.requestInfo.fileName1}" placeholder="선택된 파일 없음" readonly >
                        <input type="file" id="file1" name="file1" title="첨부파일" class="display-none"
                          onchange="${that.path}.handleChangeFile(event, this)">
                    <a href="javascript:void(0);" class="btn btnSS" onclick="${that.path}.handleClickDeleteFile(this)"><span>삭제</span></a>
                  </li>
                  <li class="addfile">
                    <label for="form-mw36-tx" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>건축물현황도</span></label>
                    <label for="file2" class="fileLabel">파일 선택</label>
                          <input type="text" id="fileName2" name="fileName2" class="upload-name" value="${that.state.requestInfo.fileName2}" placeholder="선택된 파일 없음" readonly >
                          <input type="file" id="file2" name="file2" title="첨부파일" class="display-none"
                            onchange="${that.path}.handleChangeFile(event, this)">
                    <a href="javascript:void(0);" class="btn btnSS" onclick="${that.path}.handleClickDeleteFile(this)"><span>삭제</span></a>
                  </li>
                  <li>
                    <p class="pre-star tip-blue">등록 가능 파일 : 이미지(gif, jpg 등), 문서(pdf, hwp*, doc*, ppt*) (최대 파일 크기: ${gVariables['fileUploadSize']} MB)</p>
                      <!--등록 가능 파일 : ${gVariables['imgFileUploadPosible'].toString()} (최대 파일 크기: ${gVariables['fileUploadSize']} MB)-->
                  </li>
                </ul>
                
                <!--
                <ul>
                  <li class="addfile">
                    <label for="form-mw36-tx" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>건축물대장 또는 안전시설 등 완비증명서</span></label>
                    <ui class="mw-opt mw-opt-6 row">
                      <div class="filebox">
                      <label for="file1" class="fileLabel">파일 선택</label>
                          <input type="text" id="fileName1" name="fileName1" class="upload-name" value="${that.state.requestInfo.fileName1}" placeholder="선택된 파일 없음" readonly >
                          <input type="file" id="file1" name="file1" title="첨부파일" class="display-none"
                            onchange="${that.path}.handleChangeFile(event, this)">
                          <a href="javascript:void(0);" class="btn btnSS" onclick="${that.path}.handleClickDeleteFile(this)"><span>삭제</span></a>
                    </div>
                    </ui>
                  </li>
                  <li class="addfile">
                    <label for="form-mw36-tx" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>건축물현황도</span></label>
                    <ui class="mw-opt mw-opt-6 row">
                      <div class="filebox">
                      <label for="file2" class="fileLabel">파일 선택</label>
                          <input type="text" id="fileName2" name="fileName2" class="upload-name" value="${that.state.requestInfo.fileName2}" placeholder="선택된 파일 없음" readonly >
                          <input type="file" id="file2" name="file2" title="첨부파일" class="display-none"
                            onchange="${that.path}.handleChangeFile(event, this)">
                          <a href="javascript:void(0);" class="btn btnSS" onclick="${that.path}.handleClickDeleteFile(this)"><span>삭제</span></a>
                    </div>
                    </ui>
                  </li>
                  <li>
                    <p class="pre-star tip-blue">
                      등록 가능 파일 : ${gVariables['imgFileUploadPosible'].toString()} (최대 파일 크기: ${gVariables['fileUploadSize']} MB)
                    </p>
                  </li>
                </ul>
                -->
                
              </li>
            </ul>
          </div>
          <!-- B22 -->
          
          
          </div><!-- //form-mw-box -->
        </div><!-- //form-mw23 -->
      </div>
      
      <div id="uiTypeAgree" class="mw-box">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="닫기">
            <span class="i-53">민원 신청 안내 및 동의</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li class="agree-more">
                  <label><span class="sr-only">세대분할 신청에 동의</span></label>
                  <input type="checkbox" name="agreeYn" id="agreeYn" 
                      onclick="${that.path}.handleAgreeYn(event)"
                      ${that.state.requestInfo.agreeYn ? 'checked' : ''}>
                    <label class="chk-type" for="agreeYn"><span>안내문을 확인하였고, 세대분할 신청에 동의합니다.<p class="tx-opt">(필수)</p></span></label>
                    <div class="p-depth-1 bd-gray">
                      <ul>
                        <li>수도요금 세대분할 관련으로 행정정보(주민등록 전입여부 등)를 확인하는 것을 동의합니다.</li>
                        <li class="dot2">동의하지 않은 경우에는 전자적 처리가 불가하여 관할 동주민센터를 직접 방문 신청하시거나, 전입여부를 증빙할 서류를 직접 제출하여야 합니다.</li>
                        <li class="dot2">외국인은 주민등록 미등재로 거주확인이 불가하오니 외국인 등록증을 가지고 수도사업소 또는 동주민센터를 직접방문하여 신고하시기 바랍니다.</li>
                      </ul>
                    </div>
                    <!--
                    <p class="p-depth-1 bd-gray">
                    수도요금 세대분할 관련으로 행정정보(주민등록 전입여부 등)를 확인하는 것을 동의합니다.<br>
                      ※ 동의하지 않은 경우에는 전자적 처리가 불가하여 관할 동주민센터를 직접 방문 신청하시거나, 전입여부를 증빙할 서류를 직접 제출하여야 합니다.<br>
                      ※ 외국인은 주민등록 미등재로 거주확인이 불가하오니 외국인 등록증을 가지고 수도사업소 또는 동주민센터를 직접방문하여 신고하시기 바랍니다.<br>
                    </p>
                    -->
                </li>
              </ul>
            </div>
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
  	//선택 값이 없으면 초기 값 B12 입력
  	if(!that.state.minwonGubun){
      that.setState({
          ...this.state,
          minwonGubun : "B12"
        })
    }
    const suyongaInfo = that.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo;
    $("#hshldCnt").val(suyongaInfo.hshldCnt);
    $("#gcYyMmDd").val(`${suyongaInfo.gcYy}-${suyongaInfo.gcMm}-${suyongaInfo.gcDd}`);
    
  	var tabId = that.state.requestInfo.useGubun ? "#"+that.state.minwonGubun+that.state.requestInfo.useGubun : "#"+that.state.minwonGubun;
  	$(tabId).addClass("on");
    $(tabId).removeClass("off");
    $(tabId).attr('title', '선택됨');
    
    $(".uiType").hide();
    $("#uiTypeAgree").hide();
    //민원 구분에 따른 화면 표출
    if(that.state.minwonGubun == "B12" || that.state.minwonGubun == "B17"){
      $("#uiType1").show();
      $("#uiTypeAgree").show();
    } else if(that.state.minwonGubun == "B16"){
      $("#uiType2").show();
    } else {
      $("#uiType3").show();
    }
    
    //행정정보 공동이용 동의여부
    if(that.state.requestInfo.agreeYn == "Y"){$("#agreeYn").prop("checked", true)}
    if(that.state.requestInfo.geUseStateTy == "on"){$("#geUseStateTy").prop("checked", true)}
    if(that.state.requestInfo.buildConfirm == "on"){$("#buildConfirm").prop("checked", true)}
    if(that.state.requestInfo.tobeBizTy == "on"){$("#tobeBizTy").prop("checked", true)}
    
    //세대분할 신고 고시원(B22) 가정용일 경우 가정용 disabled 처리
    var idtCdSNm = this.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo.idtCdSNm;
    //var idtCdSNm = this.state.parent.state.parent.state.currentModule.state.applicationPage.state.suyongaInfo.state.suyongaInfo.idtCdSNm
    if(idtCdSNm == "가정용(10)"){
      $("#tobeBizTy").attr("disabled", true);
    }
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