import CyberMinwon from '../infra/CyberMinwon';
import { fetch, fetchMultiPart } from './../util/unity_resource';
import { radioMW, citizenAlert, citizenConfirm, maskingFnc, phoneNumberInputValidation, phonePattern, emailProviderPattern } from './../util/uiux-common';

declare var gContextUrl: string;
declare var document: any;
declare var $: any;
declare var gVariables: any;
declare var cyberMinwon: CyberMinwon;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var fncTrim: (str: string) => string;

export default class B20DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any;
      statusInfo: any;
      requestInfo: {
        contents: string; // 내용
        rtnWay: string;  // 수신방법
        fileName: string;  // 첨부파일명
        file: any; // 첨부파일
      },
      saveApplyInfo:{//본 화면과 '신청인' 정보 입력과 값을 공유하기 때문에 앞에서 입력한 값으로 되돌려야 할 경우 사용할 값
        saveApplyPhone: string;
        saveApplyEmailId: string;
        saveApplyEmailProvider: string;
        saveApplyEmailProviderSelector: number;
      },
      viewRequestInfo: any;
      description: any;
  };
  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {},
      requestInfo: {
    	  contents: '', // 내용
    	  rtnWay: '0',   // 수신방법
				fileName: '', //첨부파일명
				file: '' //첨부파일
      },
      saveApplyInfo:{
        saveApplyPhone: '',//
        saveApplyEmailId: '',
        saveApplyEmailProvider: '',
        saveApplyEmailProviderSelector: 0
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
        contents: '', // 내용
        rtnWay: '0',   // 수신방법
        fileName: '', //첨부파일명
        file: '' //첨부파일
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
    let applyInfo = that.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    let viewInfo : any = {};
    
    if(that.state.requestInfo.rtnWay == "0"){
      viewInfo["noinfo"] = {
        rtnWay:["전자우편", "수신방법"],
        rtnWayEmail:[maskingFnc.emailId(applyInfo.applyEmailId, "*", 3)+"@"+applyInfo.applyEmailProvider, "전자우편주소"]
      }
    } else {
      viewInfo["noinfo"] = {
        rtnWay:["우편 또는 연락처", "수신방법"],
        viewApplyAddress: [applyInfo.applyPostNumber 
            + " " + applyInfo.applyAddress +
            (applyInfo.applyDetailAddress? " " + applyInfo.applyDetailAddress : "")
            , '도로명주소' 
            ],
        viewApplyJibeunAddress: [
            fncTrim(applyInfo['addr1'])
               + " " +fncTrim(applyInfo['bunji']) + 
              (fncTrim(applyInfo['ho']) && fncTrim(applyInfo['ho']) !== '0'? "-"+fncTrim(applyInfo['ho']):"") +
              (applyInfo['applyDetailAddress']? " "+fncTrim(applyInfo['applyDetailAddress']):"")
              , '지번주소'],
        rtnWayPhone:[maskingFnc.telNo(applyInfo.applyPhone, "*"), "연락처"],
      }
    }
    
    return viewInfo;
    /*
    {
    	noinfo: {
//    		title: this.state.description.minwonNm,
    		rtnWay: [that.state.requestInfo.rtnWay == "0" ? "전자우편" : "우편 또는 연락처", '수신방법'],
    		rtnWayStr: [
                    that.state.requestInfo.rtnWay == "0" ? maskingFnc.emailId(that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailId, "*", 3)+"@"+that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProvider : that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone
    		          , that.state.requestInfo.rtnWay == "0" ? '전자우편주소' : '연락처'
    		          ],
    		contents: [that.state.requestInfo.contents, '신청내용'],
    		fileName: [that.state.requestInfo.fileName ? this.state.requestInfo.fileName : "없음", '증빙자료']
    	}
    };
    */
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    // 신청 실패 화면
    if (!this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: this.state.description.minwonNm+' 결과',
        width: "150px",
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [this.state.submitResult.data.applyDt?this.state.submitResult.data.applyDt:applyDt, '신청일시'],
        desc: ['정상적으로 처리되지 않았습니다.', '신청결과'],
        cause: [this.state.submitResult.errorMsg,'사유']
      }
    // 성공
    } else {
      infoData['noinfo'] = {
//        title:  this.state.description.minwonNm+' 결과',
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
    let applyInfo = this.state.parent.state.steps.B20.step[0].applicantInfo.state.applyInfo;
    
//    if(requestInfo.rtnWay === '0' && (!applyInfo.applyEmailId || !applyInfo.applyEmailProvider)){
    if(requestInfo.rtnWay === '0'){
      if(applyInfo.applyEmailId === ""){
        citizenAlert("수신방법을 전자우편으로 선택 시 전자우편 아이디를 필수로 입력해 주세요.").then(result => {
          if(result){
            $("#applyEmailId").focus();
          }
        });
        return false;
      }else if(applyInfo.applyEmailProvider === ""){
        citizenAlert("수신방법을 전자우편으로 선택 시 전자우편 도메인을 필수로 입력해 주세요.").then(result => {
          if(result){
            $("#applyEmailProvider").focus();
          }
        });
        return false;
      }else if(emailProviderPattern.test(applyInfo.applyEmailProvider) !== true){
        citizenAlert("전자우편 도메인 형식을 알맞게 입력해 주세요.").then(result => {
          if(result){
            $("#applyEmailProvider").focus();
          }
        });
        return false;
      }
    } else if(requestInfo.rtnWay === '1'){//rtnWay:1
      if(!applyInfo.applyPhone){
        citizenAlert("수신방법을 우편 또는 유선으로 선택 시 전화번호를 필수로 입력해 주세요.").then(result => {
          if(result){
            $("#applyPhone").focus();
          }
        });
        return false;
      } else if(phonePattern.test(applyInfo.applyPhone) !== true){
        citizenAlert("전화번호가 형식에 맞지 않습니다. 지역번호를 포함한 정확한 전화번호를 입력해 주세요.").then(result => {
          if(result){
            $("#applyPhone").focus();
          }        
        });
        return false;
      }
    }
    if(!requestInfo.contents){
    	citizenAlert("신청 내용을 입력해 주세요.");
      return false;
    } 
    return true;
  }
  //내용 연동
  handleContents(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        contents: fncCutByByte(e.target.value, 3900)
      }
    });
    e.target.value = this.state.requestInfo.contents;
  }
  
  handleChangeFile(e: any) {
  	const inputFile = e.target;
    let fileIdx = parseInt(inputFile.id.substring(inputFile.id.length-1));
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
				fileName: e.target.files[0].name,
				file: inputFile
			}
  	});
  	$("#fileName").val(e.target.files[0].name);
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun: string, id: string, uiBox: string) {
    
  const applyInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    
	this.setState({
		...this.state,
		requestInfo: {
			...this.state.requestInfo,
			rtnWay : gubun
		}
	})
    radioMW(id, uiBox);
    if(gubun === '0'){//0:전자우편
      $(".email").css("display", "block");
      $(".phone").css("display", "none");
      
      applyInfo.applyPhone = this.state.saveApplyInfo.saveApplyPhone;
      $("#applyPhone").val(applyInfo.applyPhone);
      phoneNumberInputValidation($("#applyPhone")[0], 12, phonePattern);
      
    } else {//우편또는연락처
      $(".email").css("display", "none");
      $(".phone").css("display", "block");
      
      applyInfo.applyEmailId = this.state.saveApplyInfo.saveApplyEmailId;
      $("#applyEmailId").val(applyInfo.applyEmailId);
      applyInfo.applyEmailProvider = this.state.saveApplyInfo.saveApplyEmailProvider;
      $("#applyEmailProvider").val(applyInfo.applyEmailProvider);
      applyInfo.applyEmailProviderSelector = this.state.saveApplyInfo.saveApplyEmailProviderSelector;
      phoneNumberInputValidation($("#applyPhone")[0], 12, phonePattern);
      
    }
    //this.render();
  }
  
  //신청인 페이지 이메일 id 입력 연동
  handleApplyEmailId(e: any) {
    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        applyEmailId: e.target.value.replace(/[^a-z0-9,\-,\_]/gi,'').substring(0, 30)
      }
    });
    e.target.value = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailId.substring(0, 30);
  }
  
  // 전자우편 공급자를 리스트에서 선택할 경우
  handleApplyEmailProviderSelector(e: any) {
    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        // 공급자의 domain을 공급자로 저장한다.
        applyEmailProvider: e.target.value,
        // 선택한 전자우편 공급자의 index를 저장한다.
        applyEmailProviderSelector: e.target.options.selectedIndex
      }
    });
    this.render();

    var $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
    $applyEmailProviderSelector.options[this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector].selected = true;
  }
  
  
  // 전자우편 공급자를 입력하는 루틴
  handleApplyEmailProvider(e: any) {
    // 상태를 변경하기 전에 선택된 select 박스를 해지해 준다.
    if (this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector !== 0) {
      const $applyEmailProviderSelector = document.getElementById("applyEmailProviderSelector");
      $applyEmailProviderSelector.options[this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector].selected = false;
    }

    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        applyEmailProvider: e.target.value.replace(/[^a-z0-9.]/gi,'').substring(0, 30),
        applyEmailProviderSelector: 0
      }
    });
    e.target.value = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProvider.substring(0, 30);
  }
  
  // 신청인 전화번호 연동
  handleApplyPhone(e: any) {
    this.state.parent.state.applicationPage.applicantInfo.setState({
      ...this.state.parent.state.applicationPage.applicantInfo.state,
      applyInfo: {
        ...this.state.parent.state.applicationPage.applicantInfo.state.applyInfo,
        applyPhone: e.target.value.replace(/[^0-9]/g,"").substring(0, 12)
      }
    });
    e.target.value = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone.substring(0, 12);
    if(this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone.length === 0){
      e.target.classList.remove("success","err");
    } else {
      phoneNumberInputValidation(e.target, 12, phonePattern);
    }
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyChrgeObjc.do";
    var formEditChrgeObjc = new FormData();//ChrgeObjcVO chrgeObjcVO
    const sendData = this.getQueryString();
    for(let key in sendData){
    	formEditChrgeObjc.append(key, sendData[key]);
    }
    
    if(that.state.requestInfo.file != "" && that.state.requestInfo.file != null){
    	const inputFile = that.state.requestInfo.file.files[0];
    	formEditChrgeObjc.append("file", inputFile);
    } else {
    	formEditChrgeObjc.append("file", "");
    }

//    return;
    fetchMultiPart(url, formEditChrgeObjc, function (error: any, data: any) {
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
  	const applicantInfo = this.state.parent.state.applicationPage.applicantInfo.state.applyInfo;
    const EditChrgeObjcData = {
    		'contents' : requestInfo.contents,
    		'rtnWay' : requestInfo.rtnWay,
    		'name' : applicantInfo.applyName
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
    	          <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>처리결과 수신방법을 선택해 주세요.</span></label>
    	          <ul class="mw-opt mw-opt-2 row">
    		          <li id="aGubun1" class="aGubun off">
    		          	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('0', '#aGubun1', '.aGubun');"><span>전자우편(eMail)</span></a>
    		          </li>
    		          <li id="aGubun2" class="aGubun off">
    		          	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('1', '#aGubun2','.aGubun');"><span>우편 또는 연락처</span></a>
    		          </li>
    	          </ul>
  		          <li class="email" style="display:none;">
                  <label for="applyEmailId" class="input-label"><span class="form-req"><span class="sr-only">필수</span>전자우편</span></label>
                  <input value="${that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailId}" placeholder="전자우편 아이디" onkeyup="${that.path}.handleApplyEmailId(event)" onpaste="${that.path}.handleApplyEmailId(event)" type="text" id="applyEmailId" class="input-box input-w-mail"> 
                  <span>@</span>
                  <label for="applyEmailProvider"><span class="sr-only">전자우편 주소</span></label>
                  <input placeholder="도메인" onkeyup="${that.path}.handleApplyEmailProvider(event)" onpaste="${that.path}.handleApplyEmailProvider(event)" type="text" id="applyEmailProvider" class="input-box input-w-mail" 
                  value="${that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProvider}">
                  <label for="applyEmailProviderSelector"><span class="sr-only">전자우편 선택</span></label>
                  <select id="applyEmailProviderSelector" onchange="${that.path}.handleApplyEmailProviderSelector(event)" title="전자우편도메인선택" class="input-box input-w-mail2 ">
                    <option value="">직접입력</option>
                    <option value="naver.com">naver.com</option>
                    <option value="hotmail.com">hotmail.com</option>
                    <option value="chol.com">chol.com</option>
                    <option value="dreamwiz.com">dreamwiz.com</option>
                    <option value="empal.com">empal.com</option>
                    <option value="freechal.com">freechal.com</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="hanmail.net">hanmail.net</option>
                    <option value="hanafos.com">hanafos.com</option>
                    <option value="hanmir.com">hanmir.com</option>
                    <option value="hitel.net">hitel.net</option>
                    <option value="korea.com">korea.com</option>
                    <option value="nate.com">nate.com</option>
                    <option value="netian.com">netian.com</option>
                    <option value="paran.com">paran.com</option>
                    <option value="yahoo.com">yahoo.com</option>
                  </select>
                </li>
                <li class="phone" style="display:none;">
                  <label for="applyPhone" class="input-label"><span class="form-req"><span class="sr-only">필수</span>전화번호</span></label>
                  <input value="${that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone}" maxlength="12"
                    onkeyup="${that.path}.handleApplyPhone(event)"
                    onpaste="${that.path}.handleApplyPhone(event)"
                    type="text" id="applyPhone" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                </li>
    	          <p class="form-cmt pre-star tip-red">연락처를 수정하시면 신청인 정보(전자우편, 전화번호)도 함께 변경됩니다.</p>
              </li>
              <li style="padding-top:15px;">
                <label for="contents" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>이의신청 내용을 입력해 주세요</span></label> 
                <textarea onkeyup="${that.path}.handleContents(event)" onchange="${that.path}.handleContents(event)"
                	id="contents" name="contents" class="textarea-box"  title="내용" maxlength="3900">${that.state.requestInfo.contents}</textarea>
              </li>
  	          <li class="addfile">
  		          <label for="form-mw36-tx" class="input-label-1">증빙자료를 등록해 주세요.</label>
  		          <!--
  		          <ui class="mw-opt mw-opt-6 row">
  			          <div class="filebox">
  			        -->  
  			          <label for="file1" class="fileLabel">파일 선택</label>
  		                <input type="text" id="fileName" name="fileName" class="upload-name" value="" placeholder="선택된 파일 없음" readonly >
  		                <input type="file" id="file1" name="file" title="첨부파일" class="display-none"
  		                	onchange="${that.path}.handleChangeFile(event)">
  		                <a href="javascript:void(0);" class="btn btnSS" onclick="${that.path}.handleClickDeleteFile(this)"><span>삭제</span></a>
                <!--  
  				        </div>
  		          </ui>
                -->
  	          </li>
  	          <li>
                <p class="pre-star tip-blue">
                  등록 가능 파일 : 이미지(gif, jpg 등), 문서(pdf, hwp*, doc*, ppt*) (최대 파일 크기: ${gVariables['fileUploadSize']} MB)
                </p>
                  <!--등록 가능 파일 : ${gVariables['imgFileUploadPosible'].toString()} (최대 파일 크기: ${gVariables['fileUploadSize']} MB)-->
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
  	
  	//신청인에서 입력한 값 저장
    that.setState({
      ...that.state,
      saveApplyInfo: {
        ...that.state.saveApplyInfo,
        saveApplyPhone: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyPhone,
        saveApplyMobile: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyMobile,
        saveApplyEmailId: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailId,
        saveApplyEmailProvider: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProvider,
        saveApplyEmailProviderSelector: that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector
      }
    })
    
  	let applyEmailProviderSelector = that.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyEmailProviderSelector;
  	$("#applyEmailProviderSelector option:eq("+applyEmailProviderSelector+")").attr("selected", "selected");
  	
  	if(that.state.requestInfo.rtnWay === '0'){
      radioMW('#aGubun1','.aGubun')
      $(".email").css("display", "block");
      $(".phone").css("display", "none");
    } else {
      radioMW('#aGubun2','.aGubun')
      $(".email").css("display", "none");
      $(".phone").css("display", "block");
      phoneNumberInputValidation($("#applyPhone")[0], 12, phonePattern);
    }
    
  	//(that.state.requestInfo.rtnWay == "0") ? radioMW('#aGubun1','.aGubun') : radioMW('#aGubun2','.aGubun');
  	
  	if(that.state.requestInfo.fileName){
  		$("#fileName").val(that.state.requestInfo.fileName);
  	}
  }
  
  	//첨부파일 삭제
  handleClickDeleteFile(e: any) {
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
					fileName: '',
					file: ''
				}
	  	});
  	});
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