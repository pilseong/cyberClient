import CyberMinwon from '../infra/CyberMinwon';
import { fetch, fetchMultiPart } from './../util/unity_resource';
import { citizenAlert, citizenConfirm, maskingFnc } from './../util/uiux-common';
//import * as CyberMinwon from './../CyberMinwon';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var gContextUrl: string;
declare var gVariables: any;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class B01DetailPage {
  state: {
      minwonCd: string;
      parent: any;
      statusInfo: any;
      requestInfo: {
        [key : string]: string | any,
        leakPosCd: string; // 누수위치
        leakPos: string;   // 누수위치 - 기타
        leakReaCd: string;  // 누수원인
        leakRea: string; // 누수원인 - 기타
        leakRepairDt: string; //누수수리일시
        fileName1: string; //첨부파일명
        file1: any; //첨부파일
        fileName2: string; //첨부파일명
        file2: any; //첨부파일
        fileName3: string; //첨부파일명
        file3: any; //첨부파일
      },
      isSubmitSuccessful: boolean;
      submitResult: any,
      viewRequestInfo: any;
      description: any;
  };

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {},
      requestInfo: {
				leakPosCd: '', // 누수위치
				leakPos: '',   // 누수위치 - 기타
				leakReaCd: '',  // 누수원인
				leakRea: '', // 누수원인 - 기타
				leakRepairDt: '', //누수수리일시
				fileName1: '', //첨부파일명
				file1: '', //첨부파일
				fileName2: '', //첨부파일명
				file2: '', //첨부파일
				fileName3: '', //첨부파일명
				file3: '' //첨부파일
      },
      isSubmitSuccessful: false,
      submitResult: {},
      viewRequestInfo: {},	
      description: {}
    };

    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        leakPosCd: '', // 누수위치
        leakPos: '',   // 누수위치 - 기타
        leakReaCd: '',  // 누수원인
        leakRea: '', // 누수원인 - 기타
        leakRepairDt: '', //누수수리일시
        fileName1: '', //첨부파일명
        file1: '', //첨부파일
        fileName2: '', //첨부파일명
        file2: '', //첨부파일
        fileName3: '', //첨부파일명
        file3: '' //첨부파일
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
    //누수위치
    var leakPosCd = fncGetCodeByGroupCdUsing("043");
    //누수원인
    var leakReaCd = fncGetCodeByGroupCdUsing("042");
    
    that.setState({
      ...that.state,
      statusInfo: {
        comboLeakPosCd: leakPosCd,
        comboLeakReaCd: leakReaCd
      }
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
  	const that = this;

    return {
    	noinfo: {
//    		title: this.state.description.minwonNm,
    		leakPos: [(that.state.requestInfo.leakPosCd==='008'?'기타 - '+this.state.requestInfo.leakPos:this.state.requestInfo.leakPos), '누수위치'],
    		leakRea: [(that.state.requestInfo.leakReaCd==='006'?'기타 - '+this.state.requestInfo.leakRea:this.state.requestInfo.leakRea), '누수원인'],
    		leakRepairDt: [that.state.requestInfo.leakRepairDt, '누수 수리일'],
    		fileName1: [that.state.requestInfo.fileName1, '첨부파일'],
    		fileName2: [that.state.requestInfo.fileName2, '첨부파일'],
    		fileName3: [that.state.requestInfo.fileName3, '첨부파일']
    	}
    };
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

    if (requestInfo.leakPosCd === '008' && !requestInfo.leakPos ) {
      citizenAlert("누수위치를 입력해 주세요.");
      $("#leakPos").focus();
      return false;
    }

    if (requestInfo.leakReaCd === '006' && !requestInfo.leakRea) {
      citizenAlert("누수원인을 입력해 주세요");
      $("#leakRea").focus();
      return false;
    }

    // 첨부파일 필수.
    if (!requestInfo.fileName1 && !requestInfo.fileName2 && !requestInfo.fileName3) {
      citizenAlert("첨부파일을 등록해 주세요");
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
  	let value = e.value;
  	let name = e.options[e.selectedIndex].text;
  	let preValue = this.state.requestInfo.leakPosCd;
  	if (value == '008') {//기타
  		$("#leakPos").show();
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
					leakPos: value === '008'? ((preValue == '008' && this.state.requestInfo.leakPos) ? this.state.requestInfo.leakPos : '') : name
				}
		});
  }
  
  //
  handleChangeLeakPosEtc(e: any) {
  	this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        leakPos: fncCutByByte(e.target.value, 300)
      }
    });
  	e.target.value = this.state.requestInfo.leakPos;
  }
  
  //누수원인 onchange 
  handleChangeLeakReaCd(e: any) {
  	let value = e.value;
  	let name = e.options[e.selectedIndex].text;
  	let preValue = this.state.requestInfo.leakReaCd;
  	if (value == '006') { //기타
  		$("#leakRea").show();
//  		$("#leakRea").val('');
  		$("#leakRea").val((preValue == '006' && this.state.requestInfo.leakRea) ? this.state.requestInfo.leakRea : '');
  	} else {
  		$("#leakRea").hide();
  		$("#leakRea").val(name);
  	}
  	
		this.setState({
				...this.state,
				requestInfo: {
					...this.state.requestInfo,
					leakReaCd: value,
//					leakRea: value === '006'? '' : name
					leakRea: value === '006'? ((preValue == '006' && this.state.requestInfo.leakRea) ? this.state.requestInfo.leakRea : '') : name
				}
		});
		
  }
  
  //
  handleChangeLeakRea(e: any) {
  	this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        leakRea: fncCutByByte(e.target.value, 300)
      }
    });
  	e.target.value = this.state.requestInfo.leakRea;
  }
  
  //
  handleChangeRepairDt(e: any) {
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
				["file"+fileIdx]: inputFile,
        ["fileName"+fileIdx]: e.target.files[0].name
			}
  	});
  	$("#fileName"+fileIdx).val(e.target.files[0].name);
//  	e.target.value = this.state.requestInfo.fileName;
  }
  
  handleClickDeleteFile(e: any, idx: number) {
    let fileIdx = idx;
    let fileName = 'fileName'+fileIdx;
    let file = 'file'+fileIdx;
  	if(!$("#"+fileName).val()){
      return false;
    }
  	citizenConfirm("첨부된 파일을 삭제하시겠습니까?").then(result => {
      $("#"+fileName).focus();
      if(!result){
        return false;
      }
      
      let agent = navigator.userAgent.toLowerCase();
      
      $("#"+fileName).val("");
      $("#"+file).val("");
      
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [fileName]: '',
          [file]: ''
        }
      });
    });
//  	if(confirm("첨부된 파일을 삭제하시겠습니까?")){
  		
	  	
  }
  
  handleClickFileBtn(fileId: any){
  	$("#"+fileId).trigger("click");
  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyWtlkgReduc.do";
    var formWtlkgReduc = new FormData();
    const sendData = this.getQueryString();
    for(let key in sendData){
    	formWtlkgReduc.append(key, sendData[key]);
    }
    
    for(let idx=1; idx <= 3; idx++){
      let fileData = that.state.requestInfo["file"+idx];
      if(fileData){
        formWtlkgReduc.append("file",fileData.files[0]);
      }
      
    }
    
//    return;

    fetchMultiPart(url, formWtlkgReduc, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        citizenAlert(data.errorMsg+"\n" + that.state.description.minwonNm+"이 정상적으로 처리되지 않았습니다.");
        return;
      }
      that.setState({
        ...that.state,
        isSubmitSuccessful: data.resultCd === '00' ? true : false,
        submitResult: data
      });

      cyberMinwon.setResult(that.state.description.minwonNm, that, 'getResultView');

//      that.render();
    });
  }

  getQueryString() {
  	const requestInfo = this.state.requestInfo;
    
    const WtlkgReducData = {
    		//
    		'leakPosCd' : requestInfo.leakPosCd,
    		'leakPos' : requestInfo.leakPos,
    		'leakReaCd' : requestInfo.leakReaCd,
    		'leakRea' : requestInfo.leakRea,
    		'leakRepairDt' : requestInfo.leakRepairDt.replace(/[^0-9]/g,"")
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
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="펼치기">
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
              <li class="select-input">
                <label for="leakPosCd" class="input-label"><span class="form-req"><span class="sr-only">필수</span>누수위치</span></label>
                <select id="leakPosCd" name="leakPosCd" title="누수위치 선택" class="input-box input-w-2"
                	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakPosCd(this)">
                </select>
                <input type="text" id="leakPos" name="leakPos" class="input-box input-w-2" title="누수위치 기타 입력" maxlength="200" placeholder="누수위치 기타 입력"
                	value="${that.state.requestInfo.leakPos}"
                	onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakPosEtc(event)"
                	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakPosEtc(event)"
                	onpaste="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakPosEtc(event)">
              </li>
              <li class="select-input">
	            <label for="leakReaCd" class="input-label"><span class="form-req"><span class="sr-only">필수</span>누수원인</span></label>
	            <select id="leakReaCd" name="leakReaCd" title="누수원인" class="input-box input-w-2"
	            	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakReaCd(this)">
	            </select>
	            <input type="text" id="leakRea" name="leakRea" class="input-box input-w-2" title="누수원인 기타 입력" maxlength="200" placeholder="누수원인 기타 입력"
	            	value="${that.state.requestInfo.leakRea}"
	            	onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakRea(event)"
	            	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakRea(event)"
                onpaste="cyberMinwon.state.currentModule.state.currentPage.handleChangeLeakRea(event)">
	          </li>  
              <li>
              	<label for="leakRepairDt" class="input-label"><span>누수 수리일</span></label>
              	<input type="date" id="leakRepairDt" name="leakRepairDt" class="input-box input-w-2" maxlength="10" min="1000-01-01" max="2100-12-31"
              		value="${that.state.requestInfo.leakRepairDt}"
              		onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeRepairDt(event)">
              </li>
              <li class="addfile">
	              <label for="form-mw36-tx" class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>증빙서류를 제출해 주세요.</span></label>
	              <ul>
	                <li>
	                  <label for="file1" class="fileLabel">파일 선택</label>
                    <input type="text" id="fileName1" name="fileName1" value="${that.state.requestInfo.fileName1}" placeholder="선택된 파일 없음" readonly >
                    <input type="file" id="file1" name="file1" title="첨부파일" class="display-none"
                      onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeFile(event)">
                    <a href="javascript:void(0);" class="btn btnSS" onclick="cyberMinwon.state.currentModule.state.currentPage.handleClickDeleteFile(this,1)"><span>삭제</span></a>
                  </li>
                  <li>  
                    <label for="file2" class="fileLabel">파일 선택</label>
                    <input type="text" id="fileName2" name="fileName2" value="${that.state.requestInfo.fileName2}" placeholder="선택된 파일 없음" readonly >
                    <input type="file" id="file2" name="file2" title="첨부파일" class="display-none"
                      onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeFile(event)">
                    <a href="javascript:void(0);" class="btn btnSS" onclick="cyberMinwon.state.currentModule.state.currentPage.handleClickDeleteFile(this,2)"><span>삭제</span></a>
                  </li>
                  <li>  
                    <label for="file3" class="fileLabel">파일 선택</label>
                    <input type="text" id="fileName3" name="fileName3" value="${that.state.requestInfo.fileName3}" placeholder="선택된 파일 없음" readonly >
                    <input type="file" id="file3" name="file3" title="첨부파일" class="display-none"
                      onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeFile(event)">
                    <a href="javascript:void(0);" class="btn btnSS" onclick="cyberMinwon.state.currentModule.state.currentPage.handleClickDeleteFile(this,3)"><span>삭제</span></a>
                    <p class="pre-star tip-blue">
                      누수적용 신청 시 증빙자료(공사 중 사진 또는 누수수리영수증 등) 등록이 필요합니다.
                    </p>
                    <p class="pre-star tip-blue">
                      등록 가능 파일 : 이미지(gif, jpg 등), 문서(pdf, hwp*, doc*, ppt*) (최대 파일 크기: ${gVariables['fileUploadSize']} MB)
                    </p>
                      <!--등록 가능 파일 : ${gVariables['imgFileUploadPosible'].toString()} (최대 파일 크기: ${gVariables['fileUploadSize']} MB)-->
	                </li>
	              </ul>
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
    //누수원인
  	var leakReaCd = fncGetCodeByGroupCdUsing("042");
  	
  	that.setState({
  		...that.state,
      statusInfo: {
      	comboLeakPosCd: leakPosCd,
        comboLeakReaCd: leakReaCd
      }
  	});*/
  	
  	fncSetComboByCodeList("leakPosCd", that.state.statusInfo.comboLeakPosCd);
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