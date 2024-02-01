import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { citizenAlert, citizen_alert, citizenConfirm, maskingFnc, getNowDate , lpad} from './../util/uiux-common';

declare var gContextUrl: string;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class A05DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any,
      statusInfo: any;
      requestInfo: {
        contents: string; // 내용
        visitPlan: string;   // 방문희망일
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
    	  contents: '',  // 내용
    	  visitPlan: ''  // 방문희망일
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
        contents: '',  // 내용
        visitPlan: ''  // 방문희망일
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
//        title: this.state.description.minwonNm,
        contents: [that.state.requestInfo.contents, '신청내용'],
        visitPlan: [that.state.requestInfo.visitPlan, '방문희망일']
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
      citizenAlert("신청내용을 입력해 주세요.").then(result => {
        if(result){
          $("#contnets").focus();
        }
      });
      return false;
    }
    
    let visitPlan = requestInfo.visitPlan.replace(/[^0-9]/g,"")
    if(visitPlan && (Number(visitPlan) < 10000101 || Number(visitPlan) > 21001231)){
      citizenAlert("방문희망일을 확인해 주세요.").then(result => {
        if(result){
          $("#visitPlan").focus();
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
  	e.target.value = fncCutByByte(this.state.requestInfo.contents, 1500);
  }
  
  //
  handleChangeVisitPlan(e: any) {
    
    let comDate1 = new Date(e.target.value)
    let dateMap = getNowDate();
    let year = dateMap.get("year").toString();
    let month = lpad(dateMap.get("month"), 2, "0");
    let date = lpad(dateMap.get("date"), 2, "0");
    let comDate2 = new Date(year+"-"+month+"-"+date);
    
    if(comDate1.getTime() <= comDate2.getTime()){
      citizenAlert("방문 희망일은 금일 이후로 입력해 주세요.");
      let returnDate = new Date(year+"-"+month+"-"+date);
      returnDate.setDate(returnDate.getDate()+1);
      
      let returnYear = returnDate.getFullYear();
      let returnMonth = lpad((returnDate.getMonth()+1).toString(), 2, "0");
      let returnDay = lpad(returnDate.getDate().toString(), 2, "0");
                       
      e.target.value = returnYear+"-"+returnMonth+"-"+returnDay;
    }
    
  	this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				visitPlan: e.target.value
			}
  	});
  	e.target.value = this.state.requestInfo.visitPlan;
  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyInHousWtlkg.do";
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
      'contents': requestInfo.contents,
      'visitPlan': requestInfo.visitPlan.replace(/[^0-9]/g,""),
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
      <!-- 옥내 누수진단 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
	              <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청내용을 입력해 주세요.</span></label>
	              <textarea name="contents" id="contents" class="textarea-box" title="신청내용"  maxlength="1500"
	              	onkeyup="${that.path}.handleChangeContents(event)" 
		            	onchange="${that.path}.handleChangeContents(event)">${that.state.requestInfo.contents}</textarea>
              </li>
              <li>
	              <label for="visitPlan" class="input-label"><span>방문희망일</span></label>
	            	<input type="date" id="visitPlan" name="visitPlan" class="input-box input-w-2 datepicker" title="방문희망일" maxlength="10"
	            		value="${that.state.requestInfo.visitPlan}" min="1000-01-01" max="2100-12-31"
			            onchange="${that.path}.handleChangeVisitPlan(event)">
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