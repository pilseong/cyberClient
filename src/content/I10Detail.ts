import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { radioMW, citizenAlert, citizen_alert, citizenConfirm, maskingFnc, getNowDate, lpad } from './../util/uiux-common';

declare var gContextUrl: string;
declare var gVariables: any;
declare var $: any;
declare var cyberMinwon: CyberMinwon;
declare var fncCutByByte: (str: string, maxByte: number) => string;

export default class I10DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      minwonGubun: string;
      statusInfo: any;
      requestInfo: {
        //A03 constDt contents
        constDt: string;// 이설희망일
        contents: string;  // 신청내용(사유)
        //A10 compDt etc
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
      minwonGubun: 'A03', //민원구분 guBunType1 guBunType2
      statusInfo: {},
      requestInfo: {
        //A03
        constDt: '',// 이설희망일
        contents: '',  // 신청내용(사유)
        //A10
      },
      isSubmitSuccessful: false,
      submitResult: {},
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
        constDt: '',// 이설희망일
        contents: '',  // 신청내용(사유)
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
        minwonGubun: [(this.state.minwonGubun==="A03"?"수용가 자체 이설":"수도사업소 이설"), '이설유형'],
        constDt: [this.state.requestInfo.constDt, '이설희망일'],
        contents: [this.state.requestInfo.contents, '신청내용(사유)']
      }
    };
  }
  
  // 결과 뷰를 세팅하는 함수. 여기서 반환된 결과가 ResultPage에 표시된다.
  getResultView() {
    const infoData: any = {};
    const applyNm = this.state.parent.state.applicationPage.getSuyongaQueryString()['cvplInfo.cvpl.applyNm'];
    const applyDt = $("#applyDt").val();
    const minwonGubun = this.state.minwonGubun;
    // 신청 실패 화면
    if (!this.state.isSubmitSuccessful) {
      infoData['noinfo'] = {
//        title: minwonGubun === "A03"? '수용가 자체 이설 신청': '수도사업소 이설 신청' + ' 결과',
        width: "150px",
        applyNm: [maskingFnc.name(applyNm, "*"), '신청인'],
        applyDt: [this.state.submitResult.data.applyDt?this.state.submitResult.data.applyDt:applyDt, '신청일시'],
        desc: ['정상적으로 처리되지 않았습니다.', '신청결과'],
        cause: [this.state.submitResult.errorMsg,'신청내용(사유)']
      }
    // 성공
    } else {
      infoData['noinfo'] = {
//        title: minwonGubun === "A03"? '수용가 자체 이설 신청': '수도사업소 이설 신청' + ' 결과',
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

    if(this.state.minwonGubun == "A03"){
      
      if (!requestInfo.constDt) {
        citizenAlert("이설희망일을 입력해 주세요.").then(result => {
          if(result){
            $("#constDt").focus();
          }
        });
        return false;
      }
    }
    if (!requestInfo.contents) {
      citizenAlert("신청내용(사유)를 입력해 주세요.").then(result => {
        if(result){
          $("#contents").focus();
        }
      });
      return false;
    }
    return true;
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun:String, id:string, uiBox:string) {
    //disble처리
    if($(id).hasClass("disable")){
      return false;
    }
    this.setState({
      ...this.state,
      minwonGubun : gubun
    })
    $(".aGubun").removeClass("disable");
    radioMW(id, uiBox);
    let minwonCd = "";
    //이설희망일 필수 표시 변경
    if(gubun === "A03"){
      $("#constDt").prev().children().addClass("form-req");
      minwonCd = "A03";
    }else{
      $("#constDt").prev().children().removeClass("form-req");
      minwonCd = "A10";
    }
    this.setState({
      ...this.state,
      minwonGubun:minwonCd
    });
  }
  
  //
  handleChangeConstDt(e: any) {
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
        constDt: e.target.value
      }
    });
    e.target.value = this.state.requestInfo.constDt;
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

    var url = gContextUrl + "/citizen/common/";
    url += that.state.minwonGubun == "A03" ? "addMtrRloc.do" : "procApplyTubeRloc.do";
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
    const suyongaInfo = this.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo;

    // 데이터 셋 바인딩
    let requestData = {};
    if(this.state.minwonGubun == "A03"){
      requestData = {
        'constDt': requestInfo.constDt.replace(/[^0-9]/g,""),
        'contents': requestInfo.contents
      };
    }else{
      requestData = {
        'compDt': requestInfo.constDt.replace(/[^0-9]/g,""),
        'etc': requestInfo.contents,
        'construct': suyongaInfo.idtCdS,
        'houseCnt': suyongaInfo.hshldCnt
      };
    }

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonGubun,
      ...requestData
    };
  }
  
  getStatusString() {
    const statusInfo = this.state.statusInfo;
    
  }


  render() {
    const that = this;
//    that.getDescription();
    
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
      <!-- 수도계량기 및 상수도관 이설 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청 민원을 선택해 주세요.</span></label>
                <ul class="mw-opt mw-opt-2 row">
                  <li id="aGubun1" class="aGubun on">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('A03', '#aGubun1', '.aGubun');"><span>수용가 자체 이설</span></a>
                  </li>
                  <li id="aGubun2" class="aGubun off">
                    <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('A10', '#aGubun2', '.aGubun');"><span>수도사업소 이설</span></a>
                  </li>
                </ul>
              </li>
              <li>
                <label for="constDt" class="input-label"><span class="form-req"><span class="sr-only">필수</span>이설희망일</span></label>
                <input type="date" id="constDt" name="constDt" class="input-box input-w-fix" min="1000-01-01" max="2100-12-31" maxlength="10"
                  value="${that.state.requestInfo.constDt.replace(/[^0-9]/g,"").substring(0,4)+"-"+that.state.requestInfo.constDt.replace(/[^0-9]/g,"").substring(4,6)+"-"+that.state.requestInfo.constDt.replace(/[^0-9]/g,"").substring(6,8)}"
                  onchange="${that.path}.handleChangeConstDt(event)">
                
              </li>  
              <li>
                <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신청내용(사유)를 입력해 주세요.</span></label>
                <textarea name="contents" id="contents" class="textarea-box" title="신청내용(사유)" maxlength="1500"
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
    const that = this;
    let minwonCd = that.state.minwonGubun;
    if(minwonCd === "A03"){
      that.toggleUIGubun(minwonCd, '#aGubun1', '.aGubun');
    }else{
      that.toggleUIGubun(minwonCd, '#aGubun2', '.aGubun');
    }
//    $("#aGubun2").addClass("disable");
//    $("#aGubun1").addClass("on");
//    that.state.minwonGubun == "A03" ? $("#aGubun2").addClass("disable") : $("#aGubun1").addClass("disable") ;
//    that.state.minwonGubun == "A03" ? $("#aGubun1").addClass("on")    : $("#aGubun2").addClass("on");
    
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