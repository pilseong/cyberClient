import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { citizenAlert, citizen_alert, citizenConfirm, maskingFnc } from './../util/uiux-common';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var gContextUrl: string;
declare var alert_msg: (msg: string) => void;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class A02DetailPage {
  state: {
      minwonCd: string;
      parent: any;
      path: string,
      isSubmitSuccessful: boolean;
      submitResult: any,
      statusInfo: any;
      requestInfo: {
        reason: string; // 계량기 교체유형 코드
        reasonNm: string;   // 계량기 교체유형
        contents: string;  // 내용
        smsFrzburYnCheck: boolean; // 동파예방 안내 sms 수신 동의
        smsFrzburYn: string; //동파예방 안내 sms 수신 동의
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
      statusInfo: {

      },
      requestInfo: {
        reason: '',   // 계량기 교체유형 코드
        reasonNm: '',   // 계량기 교체유형
        contents: '',  // 내용
        smsFrzburYnCheck: false, //동파예방 안내 sms 수신 동의
        smsFrzburYn: 'N' //동파예방 안내 sms 수신 동의
      },
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
        reason: '',   // 계량기 교체유형 코드
        reasonNm: '',   // 계량기 교체유형
        contents: '',  // 내용
        smsFrzburYnCheck: false, //동파예방 안내 sms 수신 동의
        smsFrzburYn: 'N' //동파예방 안내 sms 수신 동의
      }
    });
  }
  
  

  // 민원안내, 절차 정보를 서버에 요청한다. 
  getDescription(data: any) {
    const that = this;
//    const minwonDesc = cyberMinwon.getFrontMinwonData(that.state.minwonCd);
    that.setState({
      ...that.state,
//      description: minwonDesc 
      description: data 
    });
    var mtrCngRsn = fncGetCodeByGroupCdUsing("018");

    that.setState({
      ...that.state,
      statusInfo: {
        comboMtrCngRsn: mtrCngRsn
      }
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
    return {
      noinfo: {
//        title: this.state.description.minwonNm,
        reason: [this.state.requestInfo.reasonNm, '계량기 교체유형'],
        contents: [this.state.requestInfo.contents, '신청내용'],
        smsFrzburYnCheck: [this.state.requestInfo.smsFrzburYn === 'Y' ? '동의' : '미동의', '동파예방안내 수신'] //sms수신동의여부
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

    if (!requestInfo.contents) {
      citizenAlert("신청내용을 입력해 주세요.");
      return false;
    }
    return true;
  }

  handleChangeReason(e: any) {

    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    let preValue = this.state.requestInfo.reason;
    if(value !== "001"){
      $("#smsFrzburYnCheck").prop("checked", false);
    }
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        reason: value,
        reasonNm: name
      }
    });
    let title = '계량기 교체유형'
    $("#reason").attr("title",`${name} 선택됨 ${title}`);
  }

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

  handleClickSms(e: any) {
    if(this.state.requestInfo.reason !== "001"){
      citizenAlert("계량기 교체유형이 “동파”일 경우에만 선택 가능합니다.").then(result => {
        if(result){
          //e.target.focus = true;
          $('#smsFrzburYnCheck').focus();
        }        
      });
      e.target.checked = false;
      
      return false;
    }
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        smsFrzburYnCheck: e.target.checked,
        smsFrzburYn: (e.target.checked) ? 'Y' : 'N'
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
        citizenAlert(that.state.description.minwonNm + "이 정상적으로 처리되지 않았습니다.");
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
    const suyongaInfo = cyberMinwon.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo;
    let reason = requestInfo.reason;
    let divConst = "";
    const cbCdNm = parseInt(suyongaInfo.cbCdNm);
    if(reason === "001" || reason === "002"){
      if(cbCdNm > 50){
        divConst = "2";
      }else{
        divConst = "1";
      }
    }else{
      divConst = "3";
    }

    const mtrChngData = {
      // 계량기교체 데이터 셋 바인딩
      'reason': requestInfo.reason,
      'contents': requestInfo.contents,
      'smsFrzburYn': requestInfo.smsFrzburYn,
      'divConst': divConst,
      'pipeDia': suyongaInfo.cbCdNm,
      'mtrTypeCd': suyongaInfo.mtrTypeCd,
      'mtrTypeCdNm': suyongaInfo.mtrTypeCdNm,
      'tapLocCd': suyongaInfo.tapLocCd,
      'tapLocCdNm': suyongaInfo.tapLocCdNm,
      'tapLocDetailCd': suyongaInfo.tapLocDetailCd,
      'tapLocDetailCdNm': suyongaInfo.tapLocDetailCdNm,
      'mpcMtrqlt': suyongaInfo.mpcMtrqlt,
      'mpcStatus': suyongaInfo.mpcStatus,
      'mrnrBxStatus': suyongaInfo.mrnrBxStatus,
      'wplmStatus': suyongaInfo.wplmStatus,
      'wpMtrqlt': suyongaInfo.wpMtrqlt
    };

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      'cvplInfo.cvplOwner.cbCd': suyongaInfo.cbCdNm,//계량기구경
      ...mtrChngData
    };
  }

  getStatusString() {
    const that = this;
    const requestInfo = this.state.requestInfo;

    if (!requestInfo.contents) {
      citizenAlert(that.state.description.minwonNm + "내용을 입력해 주세요.");
      return false;
    }
  }


  render() {
    const that = this;
//    that.getDescription();

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
      <!-- 수도계량기 교체 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
	              <label for="reason" class="input-label"><span class="form-req"><span class="sr-only">필수</span>교체유형</span></label>
	              <select id="reason" name="reason" title="계량기 교체유형" class="input-box input-w-2"
	              	onchange="${that.state.path}.handleChangeReason(this)">
	              </select>
              </li>
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청내용을 입력해 주세요.</span></label>
                <textarea name="contents" id="contents" class="textarea-box" title="신청내용" value="" maxlength="1500"
                	onkeyup="${that.state.path}.handleChangeContents(event)"
                	onchange="${that.state.path}.handleChangeContents(event)">${that.state.requestInfo.contents}</textarea>
              </li>
  
              <li><label class="sr-only"><span>동파 예방 안내(SMS) 수신 동의</span></label>
              <input type="checkbox" name="smsFrzburYnCheck" id="smsFrzburYnCheck"
              	${that.state.requestInfo.smsFrzburYnCheck ? 'checked' : ''}
              	onclick="${that.state.path}.handleClickSms(event)">
              <label class="chk-type" for="smsFrzburYnCheck"> <span>동파 예방 안내(SMS) 수신 동의('동파'인 경우 선택 가능)</span></label>
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
    //계량기 교체유형
    fncSetComboByCodeList("reason", that.state.statusInfo.comboMtrCngRsn);
    $("#reason").val(that.state.requestInfo.reason ? that.state.requestInfo.reason : $("#reason option:selected").val())
      .trigger("change");
    $("#reason").attr("title",`${that.state.requestInfo.reasonNm} 선택됨 계량기 교체유형`);
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
              <div class="tit-mw-h5 row"><span>계량기고장유형</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>동파 : 겨울철 동결로 유리부가 파손되어 판독이 불가한 경우<br>
                  <li>외갑누수 : 계량기 외갑에서 물이 새어 나올 경우<br>
                  <li>화상 : 화재 또는 해빙작업 등으로 손상을 입은 경우<br>
                  <li>초파 : 사용자 관리부주의로 유리부가 파손된 경우<br>
                  <li>망실 : 계량기가 분실된 경우<br>
                  <li>침비 : 계량기 숫자의 일부 단위 작동상태가 비정상인 경우<br>
                  <li>불회전·회전불량 : 수돗물을 사용하고 있음에도 계량기 숫자가 회전하지 않거나, 회전상태가 불량인 경우<br>
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