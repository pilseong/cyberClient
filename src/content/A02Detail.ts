import { fetch } from './../util/unity_resource';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var gContextUrl: string;
declare var alert_msg: (msg: string) => void;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var $: any;

export default class A02DetailPage {
  state: any;

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      statusInfo: {

      },
      requestInfo: {
        reason: '',   // 계량기교체사유 코드
        reasonNm: '',   // 계량기교체사유
        contents: '',  // 내용
        smsFrzburYnCheck: false, //동파예방 안내 sms 수신 동의
        smsFrzburYn: 'N' //동파예방 안내 sms 수신 동의
      },
      description: {

      }
    };
    this.getDescription();
    // this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;

    var mtrCngRsn = fncGetCodeByGroupCdUsing("018");

    that.setState({
      ...that.state,
      statusInfo: {
        comboMtrCngRsn: mtrCngRsn
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
    return {
      viewA02Detail: {
        title: this.state.description.minwonNm,
        reason: [this.state.requestInfo.reasonNm, '계량기교체사유'],
        contents: [this.state.requestInfo.contents, '내용'],
        smsFrzburYnCheck: [this.state.requestInfo.smsFrzburYnCheck === 'N' ? '동의' : '미동의', 'sms수신동의여부']
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

    if (requestInfo === undefined && !requestInfo) {
      alert("내용을 입력하세요.");
      return false;
    }
    return true;
  }

  handleChangeReason(e: any) {

    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    let preValue = this.state.requestInfo.reason;

    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reason: value,
        reasonNm: name
      }
    });
  }

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

  handleClickSms(e: any) {
    console.log("handleClickSms::", e.target.value);
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        smsFrzburYnCheck: e.target.value,
        smsFrzburYn: (e.target.value === true) ? 'Y' : 'N'
      }
    });
  }

  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyMtrChng.do";
    var queryString = this.getQueryString();

    fetch('POST', url, queryString, function (error: any, data: any) {
      // 에러가 발생한 경우
      if (error) {
        alert_msg(+that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
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


    const mtrChngData = {
      // 통합 민원 데이터 셋 바인딩
      'reason': requestInfo.reason,
      'contents': requestInfo.contents,
      'smsFrzburYn': requestInfo.smsFrzburYn,
    };

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...mtrChngData
    };
  }

  getStatusString() {
    const that = this;
    const requestInfo = this.state.requestInfo;

    if (!requestInfo.contents) {
      alert(that.state.description.minwonNm + "내용을 입력하세요.");
      return false;
    }
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
      <!-- 수도계량기 교체 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
	              <label for="reason" class="input-label"><span class="form-req">계량기교체사유</span></label>
	              <select id="reason" name="reason" title="계량기교체사유" class="input-box input-w-2"
	              	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeReason(this)">
	              </select>
              </li>
              <li>
                <label class="input-label"><span>내용</span></label>
                <textarea name="contents" id="contents" class="textarea-box" title="내용" value="" maxlength="1500"
                	value="${that.state.requestInfo.contents}"
                	onkeyup="cyberMinwon.state.currentModule.state.currentPage.handleChangeContents(event)"
                	onchange="cyberMinwon.state.currentModule.state.currentPage.handleChangeContents(event)"></textarea>
              </li>
  
              <li><label class="sr-only"><span>SMS 수신 동의</span></label>
              <input type="checkbox" name="smsFrzburYnCheck" id="smsFrzburYnCheck"
              	${that.state.requestInfo.smsFrzburYnCheck ? 'checked' : ''}
              	onclick="cyberMinwon.state.currentModule.state.currentPage.handleClickSms(event)">
              <label class="chk-type" for="smsFrzburYnCheck"> <span>· 동파예방 안내 SMS 수신 동의(계량기교체사유가 “동파”일 경우에만 선택 가능합니다.)</span></label>
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
    //계량기교체사유
    fncSetComboByCodeList("reason", that.state.statusInfo.comboMtrCngRsn);
    $("#closeDesc").val(that.state.requestInfo.reason ? that.state.requestInfo.reason : $("#reason option:selected").val())
      .trigger("change");

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