import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { citizenAlert, citizen_alert, citizenConfirm, maskingFnc, getNowDate } from './../util/uiux-common';

declare var gContextUrl: string;
declare var alert_msg: (msg: string) => void;
declare var $: any;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var cyberMinwon: CyberMinwon;

export default class A12DetailPage {
  state: {
      minwonCd: string;
      parent: any;
      path: string,
      isSubmitSuccessful: boolean;
      submitResult: any,
      statusInfo: any;
      requestInfo: {
        buildingYear: string;  // 준공년도
        contents: string; // 민원내용
      },
      viewRequestInfo: any;
      description: any;
  };

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      path: 'cyberMinwon.state.currentModule.state.currentPage',
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {},
      requestInfo: {
      	buildingYear: '',  // 준공년도
      	contents: ''  // 내용
      },
      viewRequestInfo: {},
      description: {}
    }

    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        buildingYear: '',  // 준공년도
        contents: ''  // 내용
      }
    });
  }
  
  //수용가 조회 시 민원 신청 가능한지 확인하는 함수
  async possibleApplyChk(mgrNo:string){
    
    let formData = new FormData();
    formData.set("mkey",mgrNo);
    
    try{
    let res = await window.fetch("/citizen/common/wspCnsltHistory.do",{
      method: 'post',
      body: formData
    })
    let data =  await res.json();
      if(data.length !== 0){
        citizenAlert("옥내급수관 공사비 지급이력이 있는 수용가(주소지)입니다.<br>관할 수도사업소로 문의하여 주시기 바랍니다.");
        return false;
      }else{
        return true;
      }
    }catch(err: any){
      citizenAlert("네트워크 또는 서버 오류입니다. 잠시 후 다시 시도해 주세요.");
      return false;
    }
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
        buildingYear: [that.state.requestInfo.buildingYear, '준공년도'],
        contents: [that.state.requestInfo.contents, '상담 신청내용']
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

    if (!requestInfo.buildingYear) {
      citizenAlert("준공년도를 입력해 주세요.").then(result => {
        if(result){
          $("#buildingYear").focus();
        }
      });
      return false;
    }
    return true;
  }

  handleChangeBuildingYear(e: any) {
    let value = e.target.value.replace(/[^0-9]/g,"").substring(0,4);
    
    let dateMap =getNowDate();
    (value > '2100' || value == "0000") ? value= dateMap.get("year") : value;
    
  	this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				buildingYear: value
			}
  	});
  	e.target.value = this.state.requestInfo.buildingYear;
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
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyWspCnslt.do";
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
    const suyongaInfo = this.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo;

    const requestData = {
      // 통합 민원 데이터 셋 바인딩
    		'buildingYear': requestInfo.buildingYear,
        'contents': requestInfo.contents,
        'owner': suyongaInfo.ownerNm,
        'useNm': suyongaInfo.usrName
    };

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...requestData
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
      <!-- 옥내급수관 진단 상담 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
            	<li>
		          	<label for="buildingYear" class="input-label"><span class="form-req"><span class="sr-only">필수</span>준공년도</span></label>
		          	<input type="text" id="buildingYear" name="buildingYear" class="input-box input-w-2" title="건물 준공년도" maxlength="4" placeholder="건물 준공년도 입력"
		          		value="${that.state.requestInfo.buildingYear}"
		          		onkeyup="${that.state.path}.handleChangeBuildingYear(event)" 
			            onchange="${that.state.path}.handleChangeBuildingYear(event)">
		          </li>  
		          <li>
		            <label class="input-label-1"><span>상담 신청내용을 입력해 주세요.</span></label>
		            <textarea name="contents" id="contents" class="textarea-box" title="상담 신청내용" maxlength="1500"
		            	onkeyup="${that.state.path}.handleChangeContents(event)"
	                onchange="${that.state.path}.handleChangeContents(event)">${that.state.requestInfo.contents}</textarea>
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