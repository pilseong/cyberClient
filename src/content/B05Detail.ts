import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { citizenAlert, citizen_alert, citizenConfirm, maskingFnc } from './../util/uiux-common';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var gContextUrl: string;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class B05DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any,
      statusInfo: any;
      requestInfo: {
        comNm: string; // 상호
        closeDesc: string; // 폐전사유
        closeDescNm: string; // 폐전사유명
        gcThsmmPointer: string; // 최근계량기지침
        closeDial: string; // 현계랑기지침
        onetimeBit: string; // 임시급수
        etc: string; //기타
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
      	comNm: '',   // 상호
      	closeDesc: '',  // 폐전사유
      	closeDescNm: '', // 폐전사유명
      	gcThsmmPointer: '', //최근계량기지침
      	closeDial: '', //현계랑기지침
      	onetimeBit: 'N',
      	etc: ''
      },
      viewRequestInfo: {},
      description: {}
    }
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';

    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        comNm: '',   // 상호
        closeDesc: '',  // 폐전사유
        closeDescNm: '', // 폐전사유명
        gcThsmmPointer: '', //최근계량기지침
        closeDial: '', //현계랑기지침
        onetimeBit: 'N',
        etc: ''
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
    var closeDesc = fncGetCodeByGroupCdUsing("MTR_CLOSE_RSN");
    
    that.setState({
      ...that.state,
      statusInfo: {
        comboCloseDesc: closeDesc
      }
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
  	const that = this;
  	
    return {
      noinfo: {
//        title: this.state.description.minwonNm,
        comNm: [that.state.requestInfo.comNm, '상호명'],
        closeDescNm: [that.state.requestInfo.closeDescNm, '폐지사유'],
        gcThsmmPointerParam: [that.state.requestInfo.gcThsmmPointer, '계량기지침(최근)'],
        closeDial: [that.state.requestInfo.closeDial, '계랑기지침(현재)'],
        etc: [that.state.requestInfo.etc, '기타내용']
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

    if (!requestInfo.comNm) {
      citizenAlert("상호를 입력해 주세요.");
      return false;
    }

    return true;
  }
  
  //상호
  handleChangeComNm(e: any) {
  	this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        comNm: fncCutByByte(e.target.value, 80)
      }
    });
  	e.target.value = this.state.requestInfo.comNm;
  }
  
  //폐전사유
  handleChangeCloseDesc(e: any) {
  	
  	let value = e.value;
  	let name = e.options[e.selectedIndex].text;
  	let preValue = this.state.requestInfo.closeDesc;
  	
  	this.setState({
				...this.state,
				requestInfo: {
					...this.state.requestInfo,
					closeDesc: value,
					closeDescNm: name
				}
		});
  }
  
  //현재 계량기지침
  handleChangeCloseDial(e: any) {
  	this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        closeDial: e.target.value.replace(/[^0-9]/g, "").substring(0,10)
      }
    });
  	e.target.value = this.state.requestInfo.closeDial.substring(0,10);
  }
  
  handleAddSuyongaInfo(){
    const suyongaInfo = this.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo;
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        gcThsmmPointer: suyongaInfo.gcThsmmPointer,
        onetimeBit: suyongaInfo.cbCdNm === "31" ? "Y" : "N"
      }
    });
    $("#gcThsmmPointer").val(suyongaInfo.gcThsmmPointer);
  }
  
  //기타(비고)
  handleEtc(e:any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          etc: fncCutByByte(e.target.value, 480)
        }
      });
    e.target.value = this.state.requestInfo.etc
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyEqpCls.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function (error: any, data: any) {
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
    const suyongaInfo = this.state.parent.state.applicationPage.suyongaInfo;

    const notifyRequestData = {
      // 급수설비 폐지 신청 데이터 셋 바인딩
      'comNm': requestInfo.comNm,
      'closeDesc': requestInfo.closeDesc,
      'onetimeBit': requestInfo.onetimeBit,
      'closeDial': requestInfo.closeDial,
      'etc': requestInfo.etc,
      'pipeDia': suyongaInfo.state.suyongaInfo.cbCdNm,
      'chargeFlag': suyongaInfo.payMentInfo.chargeFlag,
      'bankCd': suyongaInfo.payMentInfo.bankCd,
      'bankNm': suyongaInfo.payMentInfo.bankNm,
      'bankBranch': suyongaInfo.payMentInfo.bankBranch,
      'paidDt': suyongaInfo.payMentInfo.paidDt.replace(/[^0-9]/g,""),
      'paidAmount': suyongaInfo.payMentInfo.paidAmount
    };

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...notifyRequestData
    };
  }
  
  getStatusString() {
    const statusInfo = this.state.statusInfo;
    
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
      <!-- 급수설비 폐지 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
	              <label for="comNm" class="input-label"><span class="form-req"><span class="sr-only">필수</span>상호명</span></label>
	            	<input type="text" id="comNm" name="comNm" class="input-box input-w-2" title="상호" maxlength="80" placeholder="상호명"
	            		value="${that.state.requestInfo.comNm}"
	            		onkeyup="${that.path}.handleChangeComNm(event)" 
	            		onchange="${that.path}.handleChangeComNm(event)">
              </li>
              <li>
	              <label for="closeDesc" class="input-label"><span class="form-req"><span class="sr-only">필수</span>급수설비 폐지 유형</span></label>
	              <select id="closeDesc" name="closeDesc" title="급수설비 폐지 유형" class="input-box input-w-2"
	              	onchange="${that.path}.handleChangeCloseDesc(this)">
	              </select>
	            </li>
  
	            <li>
	              <label for="gcThsmmPointer" class="input-label"><span>최근지침</span></label>
	            	<input type="text" id="gcThsmmPointer" name="gcThsmmPointer" class="input-box input-w-2" title="최근 계량기 지침" placeholder="최근 계량기 지침"
	            		value="${that.state.requestInfo.gcThsmmPointer}" disabled>
	            </li>
  
              <li>
                <label for="form-mw36-tx" class="input-label"><span>현재지침</span></label>
                <input type="text" id="closeDial" 
                	value="${that.state.requestInfo.closeDial}"
                	onkeyup="${that.path}.handleChangeCloseDial(event)" 
                  onchange="${that.path}.handleChangeCloseDial(event)"
                    value="" maxlength="10" class="input-box input-w-2" title="현재 계랑기 지침" placeholder="현재 계랑기 지침">
                <p class="form-cmt pre-star tip-blue">신속한 처리를 위해 계량기 지침 확인하여 주세요.</p>
              </li>
              
              <li>
                <label for="etc" class="input-label-1"><span>기타 내용을 입력해 주세요.</span></label> 
                <textarea onkeyup="${that.path}.handleEtc(event)" onchange="${that.path}.handleEtc(event)"
                  id="etc" name="etc" class="textarea-box"  title="기타(비고)" maxlength="160">${that.state.requestInfo.etc}</textarea>
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
  	
  	fncSetComboByCodeList("closeDesc", that.state.statusInfo.comboCloseDesc);
  	$("#closeDesc").val(that.state.requestInfo.closeDesc ? that.state.requestInfo.closeDesc : $("#closeDesc option:selected").val())
  	               .trigger("change");
    this.handleAddSuyongaInfo();
    $("#comNm").focus();
    this.setEventListeners();
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