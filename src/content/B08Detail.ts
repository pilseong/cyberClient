import CyberMinwon from '../infra/CyberMinwon';
import { fetch, fetchMultiPart } from './../util/unity_resource';
import { radioMW, citizen_alert, citizenAlert, citizenConfirm, maskingFnc } from './../util/uiux-common';

declare var gContextUrl: string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class B08DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any,
      statusInfo: any;
      requestInfo: {
        idtCdSNm: string; // 수용가 업종명
        jsDay: string;   // 정수처분일
        chenapDocSeNm: string;  // 정수처분사유
      },
      viewRequestInfo: any;
      description: any;
  };
  constructor(parent:any, minwonCd:string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {},
      requestInfo: {
    	  idtCdSNm: "",//수용가 업종명
    	  jsDay: "",//정수처분일
    	  chenapDocSeNm: ""//정수처분사유
      },
      viewRequestInfo: {},
      description: {}
    };
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';

    this.setInitValue();
  }

  //수용가 조회 시 민원 신청 가능한지 확인하는 함수
  async possibleApplyChk(mgrNo:string){
	  const that = this;
	  var result = true;
	  let formData = new FormData();
	  formData.set("mkey",mgrNo);
	  
	  try{
      let res = await window.fetch("/citizen/common/swaterDspsDtlsSearch.do",{
        method: 'post',
        body: formData
      });
      let getData = await res.json();
      if (getData.resultCd != '00') {//00이 정수중일 때의 상태
        citizenAlert("정수처분된 수용가번호가 아닙니다! 해제신청을 할 수 없습니다.");
        result = false;
      }else{
        that.setState({
          ...that.state,
          requestInfo: {
              jsDay: getData.data.jsDay,//정수처분일
              chenapDocSeNm: getData.data.chenapDocSeNm//정수처분사유
            }
        });
        $("#jsDay").val(getData.data.jsDay);
        $("#chenapDocSeNm").val(getData.data.chenapDocSeNm);
        
        result = true;
      }
      return result;
    }catch(err: any){
      citizenAlert("네트워크 또는 서버 오류입니다. 잠시 후 다시 시도해 주세요.");
    }
  }
  
  
  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        idtCdSNm: "",//수용가 업종명
        jsDay: "",//정수처분일
        chenapDocSeNm: ""//정수처분사유
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
//    		title: this.state.description.minwonNm,
    		idtCdSNm: [that.state.requestInfo.idtCdSNm, "업종"],//업종명
      	jsDay: [that.state.requestInfo.jsDay?this.state.requestInfo.jsDay.substring(0,4)+"-"+this.state.requestInfo.jsDay.substring(4,6)+"-"+this.state.requestInfo.jsDay.substring(6,8):'', "정수처분일"],//정수처분일
      	chenapDocSeNm: [that.state.requestInfo.chenapDocSeNm, "신청내용"]//정수처분사유
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

  setState(nextState:any) {
    this.state = nextState;
  }

  setEventListeners() {
  }
  
  // 입력사항 검증 로직
  verify() {
    const requestInfo = this.state.requestInfo;
    return true;
  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyWprhbReles.do";
    const sendData = this.getQueryString();
    

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

  getQueryString() {
  	const requestInfo = this.state.requestInfo;
    const EditTyinduChngeObjcData = {}
    
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
      <!-- 정수처분 해제 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
            	<li>
	            	<label for="" class="input-label-1 txStrongColor">정수처분 내용을 확인해 주세요.</label>
              </li>
	            <li>
	            	<label for="" class="input-label"><span>업종</span></label>
	            	<input value="${that.state.requestInfo.idtCdSNm}" type="text" id="idtCdSNm" name="idtCdSNm" class="input-box input-w-2" readonly/>
	            </li>
	            <li>
	            	<label for="" class="input-label"><span class="form-req"><span class="sr-only">필수</span>정수처분일</span></label>
	            	<input value="${this.state.requestInfo.jsDay?this.state.requestInfo.jsDay.substring(0,4)+"-"+this.state.requestInfo.jsDay.substring(4,6)+"-"+this.state.requestInfo.jsDay.substring(6,8):''}" type="text" id="jsDay" name="jsDay" class="input-box input-w-2" readonly/>
	            </li>
            	<li>
	            	<label for="" class="input-label"><span class="form-req"><span class="sr-only">필수</span>신청내용</span></label>
	            	<input value="${that.state.requestInfo.chenapDocSeNm}" type="text" id="chenapDocSeNm" name="chenapDocSeNm" class="input-box input-w-2" readonly/>
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
    const that = this
    that.setState({
            ...that.state,
            requestInfo: {
                idtCdSNm: that.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo.idtCdSNm,//업종
                jsDay: that.state.requestInfo.jsDay,//정수처분일
                chenapDocSeNm: that.state.requestInfo.chenapDocSeNm//정수처분사유
              }
          });
     $("#idtCdSNm").val(that.state.requestInfo.idtCdSNm);     
  }
  
  
	
  renderDescription(target:any) {
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