import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { citizenAlert, citizen_alert, citizenConfirm, maskingFnc } from './../util/uiux-common';

declare var gContextUrl: string;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class A06DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any,
      statusInfo: any;
      requestInfo: {
        contents: string; // 신고 내용
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
    	  contents: ''  // 신고 내용
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
        contents: ''  // 신고 내용
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
  	
    return {
      noinfo: {
//        title: that.state.description.minwonNm,
        contents: [this.state.requestInfo.contents, '신고 내용']
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
  	const that = this;
    const requestInfo = this.state.requestInfo;

    if (!requestInfo.contents) {
      citizenAlert("신고 내용을 입력해 주세요.").then(result => {
        if(result){
          $("#contnets").focus();
        }
      });
      return false;
    }
    return true;
  }

  //
  handleChangeContents(e: any) {
  	this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				contents: fncCutByByte(e.target.value, 1500)
			}
  	});
  	e.target.value = this.state.requestInfo.contents;
  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyOutHousWtlkg.do";
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

//      that.render();
    });
  }

  getQueryString() {
    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;

    const notifyRequestData = {
      // 통합 민원 데이터 셋 바인딩
      'contents': requestInfo.contents
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
      <!-- 옥외 누수 신고 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신고 내용을 입력해 주세요.</span></label>
		            <textarea name="contents" id="contents" class="textarea-box" title="신고 내용" maxlength="1500"
		            	onkeyup="${that.path}.handleChangeContents(event)"
	                onchange="${that.path}.handleChangeContents(event)">${that.state.requestInfo.contents}</textarea>
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
  }
  

  renderDescription(target: any) {
  	const that = this;
  	const minwonDesc = that.state.description;
  	
    let desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="펼치기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div class="form-mw-box display-none row">
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>보상금지급 제외자</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>상수도본부, 동 산하사업소에 소속된 공무원과 지방자치단체 및 산하투자기관에서 발주한 공사 또는 용역 업무를 수행중인자가 업무수행중에 발견된 누수<br>
                  <li>수용가의 대지 내 급수관에서의 누수와 각종 건설현장에서 발생된 누수를 신고한 자<br>
                </ul>
              </div>
    `;
    if(minwonDesc.minwonHow){
      desc += `
                <div class="tit-mw-h5 row"><span>신청방법</span></div>
                <p>${minwonDesc.minwonHow}</p>
      `;
    }
    if(minwonDesc.minwonReqstDc){
      desc += `
                <div class="tit-mw-h5 row"><span>처리기간</span></div>
                <p>${minwonDesc.minwonReqstDc}</p>
      `;
    }
    if(minwonDesc.minwonGde){
      desc += `
                <div class="tit-mw-h5 row"><span>처리부서</span></div>
                <p>${minwonDesc.minwonGde}</p>
      `;
    }
    if(minwonDesc.presentnPapers){
      desc += `
                <div class="tit-mw-h5 row"><span>신청서류</span></div>
                <p>${minwonDesc.presentnPapers}</p>
      `;
    }
    if(minwonDesc.mtinspGde){
      desc += `
                <div class="tit-mw-h5 row"><span>관련법규</span></div>
                <p>${minwonDesc.mtinspGde}</p>
      `;
    }
    if(minwonDesc.minwonProcedure){
      desc += `
                <div class="tit-mw-h5 row"><span>처리절차</span></div>
                <p>${minwonDesc.minwonProcedure}</p>
      `;
    }
      desc += `
              <div class="tit-mw-h5 row"><span>민원편람</span></div>
              <a href="${minwonDesc.minwonGudUrl}" target="_blank" class="txBlue" style="display:inline-block;float:right">민원편람 바로가기</a>
            </div>
          </div>
        </div><!-- // info-mw -->
      `;
    target.innerHTML = desc;
  }
}