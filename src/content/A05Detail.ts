import { fetch } from './../util/unity_resource';

declare var gContextUrl: string;
declare var alert_msg: (msg: string) => void;
declare var $: any;

export default class A05DetailPage {
  state: any;

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        contents: '',  // 내용
        visitPlan: ''  // 방문희망일
      },
      description: {

      }
    }
    this.getDescription();
    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;

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
      viewA05Detail: {
        title: this.state.description.minwonNm,
        contents: [this.state.requestInfo.contents, '내용'],
        visitPlan: [this.state.requestInfo.visitPlan, '방문희망일']
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
    const that = this;
    const requestInfo = this.state.requestInfo;

    if (!requestInfo.contents) {
      alert(that.state.description.minwonNm + "내용을 입력하세요.");
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
        contents: e.target.value.substring(0, 1500)
      }
    });
    e.target.value = this.state.requestInfo.contents.substring(0, 1500);
  }

  //
  handleChangeVisitPlan(e: any) {
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        contents: e.target.value.substring(0, 150)
      }
    });
    e.target.value = this.state.requestInfo.visitPlan.substring(0, 150);
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyInHousWtlkg.do";
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
      'contents': requestInfo.contents,
      'visitPlan': requestInfo.visitPlan,
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
	              <label class="input-label"><span>내용</span></label>
	              <textarea name="contents" id="contents" class="textarea-box" title="내용"  maxlength="1500"
	              	value="${that.state.requestInfo.contents}"
	              	onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleChangeContents(event)" 
		            	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeContents(event)"></textarea>
              </li>
              <li>
	              <label for="visitPlan" class="input-label"><span>방문희망일</span></label>
	            	<input type="text" id="visitPlan" name="visitPlan" class="input-box input-w-2 datepicker" title="방문희망일" maxlength="150"
	            		value="${that.state.requestInfo.visitPlan}"
	            		onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleChangeVisitPlan(event)" 
			            onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeVisitPlan(event)">
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