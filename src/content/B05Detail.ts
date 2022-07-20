import { fetch } from './../util/unity_resource';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var gContextUrl: string;
declare var alert_msg: (msg: string) => void;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var $: any;

export default class B05DetailPage {
  state: any;

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        comNm: '',   // 상호
        closeDesc: '',  // 폐전사유
        closeDescNm: '', // 폐전사유명
        gcThsmmPointerParam: '', //최근계량기지침
        closeDial: '' //현계랑기지침
      },
      description: {

      }
    }
    this.getDescription();
    // this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;

    var closeDesc = fncGetCodeByGroupCdUsing("MTR_CLOSE_RSN");

    that.setState({
      ...that.state,
      statusInfo: {
        comboCloseDesc: closeDesc
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
      viewB05Detail: {
        title: this.state.description.minwonNm,
        comNm: [this.state.requestInfo.comNm, '상호'],
        closeDescNm: [this.state.requestInfo.closeDescNm, '폐전사유'],
        gcThsmmPointerParam: [this.state.requestInfo.gcThsmmPointerParam, '최근계량기지침'],
        closeDial: [this.state.requestInfo.closeDial, '현계랑기지침']
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

    if (!requestInfo.comNm) {
      alert("상호를 입력하세요.");
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
        leakRea: e.target.value.substring(0, 80)
      }
    });
    e.target.value = this.state.requestInfo.comNm.substring(0, 80);
  }

  //계량기 교체사유
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
        leakRea: e.target.value.substring(0, 10)
      }
    });
    e.target.value = this.state.requestInfo.closeDial.substring(0, 10);
  }


  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyEqpCls.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg(that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
        return;
      }
      console.log(data);

      console.log('after fetching', that.state);
      that.render();
    });
  }

  getQueryString() {
    const pattern = /(02|0\d{2})(\d{3,4})(\d{4})/g

    const requestInfo = this.state.requestInfo;
    const statusInfo = this.state.statusInfo;

    const notifyRequestData = {
      // 통합 민원 데이터 셋 바인딩
      'comNm': requestInfo.comNm,
      'closeDesc': requestInfo.closeDesc,
      'gcThsmmPointerParam': requestInfo.gcThsmmPointerParam,
      'closeDial': requestInfo.closeDial,
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
	              <label for="comNm" class="input-label"><span class="form-req">상호</span></label>
	            	<input type="text" id="comNm" name="comNm" class="input-box input-w-2" title="상호" value="" maxlength="80" placeholder="상호명"
	            		value="${that.state.requestInfo.comNm}"
	            		onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleChangeComNm(event)" 
	            		onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeComNm(event)">
              </li>
              <li>
	              <label for="reasonTy" class="input-label"><span class="form-req">민원유형</span></label>
	              <select id="reasonTy" name="reasonTy" title="민원유형" class="input-box input-w-2"
	              	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeReasonTy(this)">
	              </select>
	            </li>
  
	            <li>
	              <label for="gcThsmmPointer" class="input-label"><span class="form-req">최근계량기지침</span></label>
	            	<input type="text" id="gcThsmmPointer" name="gcThsmmPointer" class="input-box input-w-2" title="최근계량기지침" 
	            		value="${that.state.requestInfo.gcThsmmPointer}">
	            </li>
  
              <li>
                <label for="form-mw36-tx" class="input-label"><span>현계랑기지침</span></label>
                <input type="text" id="closeDial" 
                	value="${that.state.requestInfo.closeDial}"
                	onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleChangeCloseDial(event)" 
                  onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeCloseDial(event)"
                    value="" maxlength="10" class="input-box input-w-2" >
                <p class="form-cmt txStrongColor">
                	※ 신속한 처리를 위해 계량기 지침 확인하여 주세요.
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

    fncSetComboByCodeList("closeDesc", that.state.statusInfo.comboCloseDesc);
    $("#closeDesc").val(that.state.requestInfo.closeDesc ? that.state.requestInfo.closeDesc : $("#closeDesc option:selected").val())
      .trigger("change");

    this.setEventListeners();
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