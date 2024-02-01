/**
 * 급수공사 신청 상세 화면
 */
import CyberMinwon from '../infra/CyberMinwon';
import { fetch } from './../util/unity_resource';
import { getDescription } from './A01Description';
import { addMW, removeMW, disableMW, citizenAlert, citizen_alert, citizenConfirm, maskingFnc } from './../util/uiux-common';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var gContextUrl: string;
//declare var citizen_alert: (msg: string) => void;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class A01DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any;
      viewRequestInfo: any;
      constTy: string; //공사종류 013
      constTyNm: string;
      statusInfo: any;
      requestInfo: {
        construct: string; // 건축물용도 014
        constructNm: string;  // 건축물용도
        useDesc: string;  // 급수용도 009
        useDescNm: string; // 급수용도
        area: string; //건축연면적 10
        houseCnt: string; //가구수(세대) 2
        houseCnt1: string; //세대수(공동주택) 3
        houseCnt2: string; //호·실수(일반건물) 3
        bldOwner: string; //건축주 50
        etc: string; //기타사항 250
        installmentYn: string;
        installmentCnt: string;
        installmentDt1: string;
        installmentDt2: string;
        installmentDt3: string;
        installmentDt4: string;
        agreeYn: boolean; //이용동의
      },
      description: any;
  };

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      viewRequestInfo: {},
      constTy: '',
      constTyNm: '',
      statusInfo: {},
      requestInfo: {
        construct: '', // 건축물용도 014
        constructNm: '', // 건축물용도
        useDesc: '', // 급수용도 009
        useDescNm: '', // 급수용도명
        area: '', // 건축연면적 10
        houseCnt: '', // 가구수(세대) 2
        houseCnt1: '', // 세대수(공동주택) 3
        houseCnt2: '', // 호·실수(일반건물) 3
        bldOwner: '', // 건축주 50
        etc: '', // 기타사항 250
        installmentYn: 'N', // 분할납부 신청 여부
        installmentCnt: '0', // 분할횟수
        installmentDt1: '', // 분할납부일1
        installmentDt2: '', // 분할납부일1
        installmentDt3: '', // 분할납부일1
        installmentDt4: '', // 분할납부일1
        agreeYn: false // 이용동의
      },
      description: {}
    };
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';

    this.setInitValue();
  }
  
  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        construct: '', // 건축물용도 014
        constructNm: '', // 건축물용도명
        useDesc: '', // 급수용도 009
        useDescNm: '', // 급수용도명
        area: '', // 건축연면적 10
        houseCnt: '', // 가구수(세대) 2
        houseCnt1: '', // 세대수(공동주택) 3
        houseCnt2: '', // 호·실수(일반건물) 3
        bldOwner: '', // 건축주 50
        etc: '', // 기타사항 250
        installmentYn: 'N', // 분할납부 신청 여부
        installmentCnt: '0', // 분할횟수
        installmentDt1: '', // 분할납부일1
        installmentDt2: '', // 분할납부일1
        installmentDt3: '', // 분할납부일1
        installmentDt4: '', // 분할납부일1
        agreeYn: false // 이용동의
      }
    });
  }

  // 명의 변경 서비스를 서버로 요청한다.
  getDescription(data: any) {
    const that = this;
    that.setState({
      ...that.state,
      description: data 
    });

    //건물구조
    let construct = fncGetCodeByGroupCdUsing("014");
    //용도
    let useDesc = fncGetCodeByGroupCdUsing("009");
    
    that.setState({
      ...that.state,
      statusInfo: {
        comboConstruct: construct,
        comboUseDesc: useDesc
      }
    });
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  getViewInfo() {
    let infoData: any = {};
    let requestInfo = this.state.requestInfo;
    if(requestInfo) {
      infoData['noinfo'] = {
        constTyNm: [this.state.constTyNm, '공사종류'],
        constructNm: [this.state.requestInfo.constructNm, '건축물용도'],
        useDescNm: [requestInfo.useDescNm, '급수용도'],
        area: [requestInfo.area+"㎡", '건축연면적'],
        houseCnt: [requestInfo.houseCnt, '가구수(단독주택)'],
        houseCnt1: [requestInfo.houseCnt1, '세대수(공동주택)'],
        houseCnt2: [requestInfo.houseCnt2, '호·실수(일반건물)'],
      }
      if(requestInfo.bldOwner){
        infoData['noinfo'].bldOwner = [maskingFnc.name(requestInfo.bldOwner,"*"),'건축주'];
      }
      if(requestInfo.installmentYn == 'Y'){
        infoData['noinfo'].installmentYn = ['신청','원인자부담금 분할납부']
        infoData['noinfo'].installmentCnt = [requestInfo.installmentCnt+'회','분할납부 횟수']
        let installmentDt = `${requestInfo.installmentDt1}, ${requestInfo.installmentDt2}`
        if(requestInfo.installmentCnt == '3'){
          installmentDt += `, ${requestInfo.installmentDt3}`
        }else if(requestInfo.installmentCnt == '4'){
          installmentDt += `, ${requestInfo.installmentDt3}, ${requestInfo.installmentDt4}`
        }
        infoData['noinfo'].installmentDt = [installmentDt,'분할납부 신청일자']
      }else{
        infoData['noinfo'].installmentYn = ['미신청','원인자부담금 분할납부']
      }
      infoData['noinfo'].etc = [requestInfo.etc, '기타사항'];
      infoData['noinfo'].agreeYn = [(requestInfo.agreeYn?'예':'아니요'), '행정정보 공동이용 동의'];
    }
    
    
    return infoData;
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
        desc: ['정상적으로 신청되었습니다.', '신청결과'],
      }
    }
    
    return infoData;
  }

  verify() {
    const constTy = this.state.constTy;
    const requestInfo = this.state.requestInfo;
    // 급수 공사 신청 내용
    // 건축주
    if (!requestInfo.bldOwner && (constTy === "C01" || constTy === "C02" || constTy === "C03" 
                               || constTy === "E01")) {
        citizenAlert("건축주를 입력해 주세요.").then(result => {
          if(result){
            $("#bldOwner").focus();
          }
        });
        return false;
    }
    if(requestInfo.installmentYn == 'Y'){
      const installmentCnt = requestInfo.installmentCnt
      if(installmentCnt == '0'){
        citizenAlert("원인자부담금 분할납부 횟수를 선택해 주세요.").then(result => {
          if(result){
            $("#installmentCntDisplay").focus();
          }
        });
        return false;
      }else{
        
        const installmentDt1 = requestInfo.installmentDt1
        const installmentDt2 = requestInfo.installmentDt2
        const installmentDt3 = requestInfo.installmentDt3
        const installmentDt4 = requestInfo.installmentDt4
        if(!installmentDt1){
          citizenAlert("원인자부담금 분할납부1 일자를 입력해 주세요.").then(result => {
            if(result){
              $("#installmentDt1").focus();
            }
          });
          return false;
        }
        if(!installmentDt2){
          citizenAlert("원인자부담금 분할납부2 일자를 입력해 주세요.").then(result => {
            if(result){
              $("#installmentDt2").focus();
            }
          });
          return false;
        }
        if((installmentCnt == '3' || installmentCnt == '4') && !installmentDt3){
          citizenAlert("원인자부담금 분할납부3 일자를 입력해 주세요.").then(result => {
            if(result){
              $("#installmentDt3").focus();
            }
          });
          return false;
        }
        if(installmentCnt == '4' && !installmentDt4){
          citizenAlert("원인자부담금 분할납부4 일자를 입력해 주세요.").then(result => {
            if(result){
              $("#installmentDt4").focus();
            }
          });
          return false;
        }
      }
    }
    if(!requestInfo.agreeYn){
      citizenAlert("행정정보 공동이용 동의를 해주세요.").then(result => {
        if(result){
          $("#useAgree").focus();
        }
      });
      return false;
    }
    
    return true;
  }

  // 민원 신청.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyWspConst.do";
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
  
  //construct constructNm
  handleChangeConstruct(e: any){
    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          construct: value,
          constructNm: name
        }
    });
  }
  
  //useDesc useDescNm
  handleChangeUseDesc(e: any){
    let value = e.value;
    let name = e.options[e.selectedIndex].text;
    
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          useDesc: value,
          useDescNm: name
        }
    });
  }
  
  handleChangeArea(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        area: e.target.value.replace(/[^0-9]/g, "").substring(0,8)
      }
    });
    e.target.value = this.state.requestInfo.area.substring(0,8);
  }
  
  handleChangeHouseCnt(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        houseCnt: e.target.value.replace(/[^0-9]/g, "").substring(0,3)
      }
    });
    e.target.value = this.state.requestInfo.houseCnt.substring(0,3);
  }
  
  handleChangeHouseCnt1(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        houseCnt1: e.target.value.replace(/[^0-9]/g, "").substring(0,5)
      }
    });
    e.target.value = this.state.requestInfo.houseCnt1.substring(0,5);
  }
  
  handleChangeHouseCnt2(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        houseCnt2: e.target.value.replace(/[^0-9]/g, "").substring(0,3)
      }
    });
    e.target.value = this.state.requestInfo.houseCnt2.substring(0,3);
  }
  
  handleChangeBldOwner(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        bldOwner: fncCutByByte(e.target.value, 150)
      }
    });
    e.target.value = fncCutByByte(this.state.requestInfo.bldOwner, 150);
  }
  
  handleChangeEtc(e: any){
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        etc: fncCutByByte(e.target.value, 300)
      }
    });
    e.target.value = fncCutByByte(this.state.requestInfo.etc, 300);
  }

  getQueryString() {
    const requestInfo = this.state.requestInfo;
    const suyongaInfo = this.state.parent.state.applicationPage.suyongaInfo.state.suyongaInfo;
    const wspConstVOData = {
      'owner': suyongaInfo.suyongaName,
      'useNm': suyongaInfo.usrName,
      
      // 급수 공사 데이터 셋 바인딩
      'constTy': this.state.constTy,
      'construct': requestInfo.construct,
      'useDesc': requestInfo.useDesc,
      'area': requestInfo.area,
      'houseCnt': requestInfo.houseCnt,
      'houseCnt1': requestInfo.houseCnt1,
      'houseCnt2': requestInfo.houseCnt2,
      'bldOwner': requestInfo.bldOwner,
      'etc': requestInfo.etc,
      'installmentYn': requestInfo.installmentYn,
      'installmentCnt': requestInfo.installmentCnt,
      'installmentDt1': requestInfo.installmentDt1.replace(/-/gi,''),
      'installmentDt2': requestInfo.installmentDt2.replace(/-/gi,''),
      'installmentDt3': requestInfo.installmentDt3.replace(/-/gi,''),
      'installmentDt4': requestInfo.installmentDt4.replace(/-/gi,''),
      'agreeYn': requestInfo.agreeYn? 'Y':'N'
    };

    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...wspConstVOData
    };
  }
  
  handleOnClickForAgreeYn(e: any) {
    this.setState({
      ...this.state,
      requestInfo : {
        ...this.state.requestInfo,
        agreeYn : !this.state.requestInfo.agreeYn
      }
    })
  }
  
  //원인자 부담금 분할납부 신청 유무
  handleInstallmentYnClick(insYn: string){
    const that = this
    this.setState({
      ...this.state,
      requestInfo : {
        ...this.state.requestInfo,
        installmentYn : insYn
      }
    })
    this.handleDrawInstallmentYn(insYn)
  }
  
  handleDrawInstallmentYn(insYn: string){
    const that = this
    if(insYn == 'Y'){
      //신청
      
      addMW("#installmentYn1");
      removeMW("#installmentYn2");
      const cnt = that.state.requestInfo.installmentCnt
      this.handleInstallmentCntClick(cnt)
      $('#installmentCntDisplay').show()
      $('#installmentDtDisplay').show()
    }else{
      //미신청 시 분할 횟수, 분할납부일자 초기화
      this.setState({
        ...this.state,
        requestInfo : {
          ...this.state.requestInfo,
          installmentCnt : '0',
          installmentDt1: '',
          installmentDt2: '',
          installmentDt3: '',
          installmentDt4: '',
        }
      })
      addMW("#installmentYn2");
      removeMW("#installmentYn1");
      removeMW('.installmentCnt')
      $('#installmentCntDisplay').hide()
      $('#installmentDtDisplay').hide()
    }
  }
  
  handleInstallmentCntClick(cnt: string){
    this.setState({
      ...this.state,
      requestInfo : {
        ...this.state.requestInfo,
        installmentCnt : cnt
      }
    })
    const onId = '#installmentCnt'+cnt
    removeMW('.installmentCnt')
    addMW(onId)
    this.handleMakeInstallmentDt(cnt)
  }
  
  handleMakeInstallmentDt(cnt: string){
    const dtCnt = parseInt(cnt)
    const req = this.state.requestInfo
    let dtTemplate = `<li><input type="date" onchange="cyberMinwon.state.currentModule.state.currentPage.handleDate(event)" id="installmentDt" name="installmentDt"
                        value="" class="input-box input-w-2 datepicker hasDatepicker installmentDt" 
                        required data-placeholder="분할납부일" min="1000-01-01" max="2100-12-31" maxlength="10"></li>`
    let tempInstallmentDt = ``
    if(dtCnt !== 0){
      const today = $('#applyDt').val().substring(0,10).replace(/\./gi,'-')
      const todayP = new Date(today)
      const startDay = $('#startDay').val().replace(/\//gi,'-')
      const lastDay = new Date(todayP.setDate(todayP.getDate()+734))
      const timeOff = new Date().getTimezoneOffset()*60000
      for(let i=1; i<=dtCnt; i++){
        tempInstallmentDt += dtTemplate.replace(/installmentDt/gi,`installmentDt${i}`).replace('분할납부일',`분할납부일${i}`)
        tempInstallmentDt = tempInstallmentDt.replace('1000-01-01',`${startDay}`).replace('2100-12-31',`${new Date(lastDay.getTime()-timeOff).toISOString().split('T')[0]}`)
        let tmpVal = this.handleGetInstallmentDt(i)
        console.log(tmpVal)
        if(tmpVal){
          tempInstallmentDt = tempInstallmentDt.replace(`value=""`,`value="${tmpVal}"`)
        }
      }
    }
    document.getElementById('installmentDt')!.innerHTML = tempInstallmentDt;
    /*
    else if(dtCnt === 0){
      document.getElementById('installmentDt')!.innerHTML = tempInstallmentDt;
    }
    */
  }
  
  handleGetInstallmentDt(ord: number){
    const req = this.state.requestInfo
    if(ord == 1) return req.installmentDt1
    else if(ord == 2) return req.installmentDt2
    else if(ord == 3) return req.installmentDt3
    else if(ord == 4) return req.installmentDt4
  }
  
  handleDate(e:any) {
    console.log(e.target.id)
    console.log(e.target.value)
    const idx = parseInt(e.target.id.slice(-1))
    const regEx = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)
    const oriStr = e.target.value
    if(oriStr != ''){
      if(regEx.test(oriStr)){
        if(idx > 1){
          const prevDate = $('#installmentDt'+(idx-1)).val()
          const date1 = new Date(prevDate).getTime()
          const date2 = new Date(oriStr).getTime()
          if(date1 > date2){
            citizenAlert("앞 분할납부 일자보다 커야 합니다.").then(result => {
              if(result){
                e.target.value = ''
                $('#installmentDt'+idx).focus();
              }
            });
            return false
          }
        }
      }else{
        citizenAlert("정확한 연월일을 입력해주세요.").then(result => {
          if(result){
            e.target.value = ''
            $('#installmentDt'+idx).focus();
          }
        });
        return false
      }
    }
    this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        [e.target.id]: e.target.value//파라미터로 가져온 id를 key값으로 사용
      }
    });
  }

  render() {
    const that = this;
    
    let template = `
      <div class="mw-box" id="desc">
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="닫기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
        </div><!-- // info-mw -->
      </div><!-- // mw-box -->
      <!-- 신청내용 -->
      <div class="mw-box">
      <!-- 급수공사 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="construct" class="input-label"><span class="form-req"><span class="sr-only">필수</span>건축물용도</span></label>
                <select id="construct" name="construct" title="건축물용도 선택" class="input-box input-w-2"
                  onchange="${that.path}.handleChangeConstruct(this)">
                </select>
              </li>
              <li>
                <label for="useDesc" class="input-label"><span class="form-req"><span class="sr-only">필수</span>급수용도</span></label>
                <select id="useDesc" name="useDesc" title="급수용도" class="input-box input-w-2"
                  onchange="${that.path}.handleChangeUseDesc(this)">
                </select>
              </li>
              <li class="area">
                <label for="area" class="input-label"><span>건축연면적</span></label>
                <input type="text" id="area" name="area" title="건축연면적" class="input-box input-w-2" maxlength="8"
                  value="${that.state.requestInfo.area}" placeholder="숫자만 입력"
                  onkeyup="${that.path}.handleChangeArea(event)"
                  onchange="${that.path}.handleChangeArea(event)"><span class="area">㎡</span>
              </li>
              <li>
                <label for="houseCnt" class="input-label"><span>가구수(단독주택)</span></label>
                <input type="text" id="houseCnt" name="houseCnt" title="가구수(단독주택)" class="input-box input-w-2" maxlength="3"
                  value="${that.state.requestInfo.houseCnt}" placeholder="숫자만 입력"
                  onkeyup="${that.path}.handleChangeHouseCnt(event)"
                  onchange="${that.path}.handleChangeHouseCnt(event)">
              </li>
              <li>
                <p class="form-cmt pre-star tip-blue">단독주택(단독, 다중, 다가구)의 구획 수</p>
              </li>
              <li>
                <label for="houseCnt1" class="input-label"><span>세대수(공동주택)</span></label>
                <input type="text" id="houseCnt1" name="houseCnt1" title="세대수(공동주택)" class="input-box input-w-2" maxlength="5"
                  value="${that.state.requestInfo.houseCnt1}" placeholder="숫자만 입력"
                  onkeyup="${that.path}.handleChangeHouseCnt1(event)"
                  onchange="${that.path}.handleChangeHouseCnt1(event)">
              </li>
              <li>
                <p class="form-cmt pre-star tip-blue">공동주택(아파트·연립·다세대, 도시형생활주택 포함)의 구획 수</p>
              </li>
              <li>
                <label for="houseCnt2" class="input-label"><span>호·실수(일반건물)</span></label>
                <input type="text" id="houseCnt2" name="houseCnt2" title="호·실수(일반건물)" class="input-box input-w-2" maxlength="3"
                  value="${that.state.requestInfo.houseCnt2}" placeholder="숫자만 입력"
                  onkeyup="${that.path}.handleChangeHouseCnt2(event)"
                  onchange="${that.path}.handleChangeHouseCnt2(event)">
              </li>
              <li>
                <p class="form-cmt pre-star tip-blue">집합건물(오피스텔, 상가 등) 및 고시원 등 일반건물의 구획 수</p>
              </li>
              <li id="bldOwnerDisplay">
                <label for="bldOwner" class="input-label"><span class="form-req"><span class="sr-only">필수</span>건축주</span></label>
                <input type="text" id="bldOwner" name="area" title="건축주" class="input-box input-w-2" maxlength="150"
                  value="${that.state.requestInfo.bldOwner}" placeholder="건축주 이름"
                  onkeyup="${that.path}.handleChangeBldOwner(event)"
                  onchange="${that.path}.handleChangeBldOwner(event)">
              </li>
              <li id="">
                <label class="input-label-1"><span>원인자 부담금 분할납부 신청</span></label>
                <ul class="mw-opt mw-opt-2 row">
                  <li id="installmentYn1" class="installmentYn off">
                    <a href="javascript:void(0);" onClick="${that.path}.handleInstallmentYnClick('Y')"><span>신 청</span></a>
                  </li>
                  <li id="installmentYn2" class="installmentYn on">
                    <a href="javascript:void(0);" onClick="${that.path}.handleInstallmentYnClick('N')"><span>미신청</span></a>
                  </li>
                </ul>
              </li>
              <li id="installmentCntDisplay">
                <label class="input-label-1"><span>원인자 부담금 분할납부 횟수</span></label>
                <ul class="mw-opt mw-opt-3 mw-opt-type03 row">
                  <li id="installmentCnt2" class="installmentCnt off">
                    <a href="javascript:void(0);" onClick="${that.path}.handleInstallmentCntClick('2')" tabindex="-1">
                      <span>2회</span>
                    </a>
                  </li>
                  <li id="installmentCnt3" class="installmentCnt off">
                    <a href="javascript:void(0);" onClick="${that.path}.handleInstallmentCntClick('3')">
                      <span>3회</span>
                    </a>
                  </li>
                  <li id="installmentCnt4" class="installmentCnt off">
                    <a href="javascript:void(0);" onClick="${that.path}.handleInstallmentCntClick('4')">
                      <span>4회</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li id="installmentDtDisplay">
                <label class="input-label-1"><span>원인자 부담금 분할납부 일자</span></label>
                <ul id="installmentDt" class="mw-opt mw-opt-type04 row">
                </ul>
              </li>
              <li>
                <label for="etc" class="input-label-1"><span>기타사항을 입력해 주세요.</span></label>
                <textarea id="etc" name="etc" class="textarea-box" title="기타사항" maxlength="300" 
                  onchange="${that.path}.handleChangeEtc(event)"
                  onkeyup="${that.path}.handleChangeEtc(event)"
                  onpaste="${that.path}.handleChangeEtc(event)">${that.state.requestInfo.etc}</textarea>
              </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box --> 
      <!-- 이용 동의 -->
      <div class="mw-box">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="닫기">
            <span class="i-53">민원 신청 안내 및 동의</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul class="policy2">
                <li class="agree-more">
                  <label><span class="sr-only">행정정보 공동이용 등 동의<span class="tx-opt-a">(필수)</span></span></label>
                  <input type="checkbox" name="useAgree" id="useAgree" 
                    onclick="${that.path}.handleOnClickForAgreeYn(event)"
                    ${that.state.requestInfo.agreeYn ? 'checked' : ''}>
                    <label class="chk-type" for="useAgree"><span>안내문을 확인하였고, 급수공사 신청에 동의합니다.<span class="tx-opt-a">(필수)</span></span></label>
                    
                    <!--<a href="javascript:void(0);" onClick="showHideInfo2('#toggleUseAgree', event);" class="btn btnSS btnTypeC"><span>보기</span></a>-->
                    
                    <div id="toggleUseAgree" class="p-depth-1 bd-gray">
                      <ul>
                        <li class="dot2">본인은 본 민원 처리와 관련하여 민원처리법 제10조의2(민원인의 요구에 의한 본인정보 공동이용)에 따라 담당자(공무원)의 행정정보 공동이용을 동의합니다.<li>
                        <li class="dot2">급수공사 준공과 동시에 서울특별시 수도조례 제9조 제2항에 따라 수도계량기 및 대지경계선 밖에 매설되는 모든 시설물은 이의 없이 서울특별시에 기부체납 합니다.</li><br />
                      </ul>
                      <span class="pre-star tip-red">행정정보의 공동이용에 동의하지 않은 경우 신축중인 건물은 건축허가증 사본을, 기존건축물인 경우 건축물관리대장, 임시급수인 경우 가설건축물필증을, 사용자의 명의로 신청하는 경우는 토지(건물) 사용승낙서를 현장조사 시에 담당 공무원에게 제출하여 주시기 바랍니다.</span>
                    </div>
                    <!--
                    <p class="p-depth-1 bd-gray">
                    ※ 본인은 본 민원 처리와 관련하여 민원처리법 제10조의2(민원인의 요구에 의한 본인정보 공동이용)에 따라 담당자(공무원)의 행정정보 공동이용을 동의합니다.<br><br>
                    ※ 급수공사 준공과 동시에 서울특별시 수도조례 제9조 제2항에 따라 수도계량기 및 대지경계선 밖에 매설되는 모든 시설물은 이의 없이 서울특별시에 기부체납 합니다.<br><br>
                    <span class="pre-star tip-red">행정정보의 공동이용에 동의하지 않은 경우 신축중인 건물은 건축허가증 사본을, 기존건축물인 경우 건축물관리대장, 임시급수인 경우 가설건축물필증을, 사용자의 명의로 신청하는 경우는 토지(건물) 사용승낙서를 현장조사 시에 담당 공무원에게 제출하여 주시기 바랍니다.</span>
                    </p>
                    -->
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw-p -->
      </div><!-- //mw-box -->
  
    `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    
    this.afterRender();
  }
  
  afterRender() {
    const that = this;
    // 상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
    fncSetComboByCodeList("construct", that.state.statusInfo.comboConstruct);
    $("#construct").val(that.state.requestInfo.construct ? that.state.requestInfo.construct : $("#construct option:selected").val())
                   .trigger("change");
    fncSetComboByCodeList("useDesc", that.state.statusInfo.comboUseDesc);
    $("#useDesc").val(that.state.requestInfo.useDesc ? that.state.requestInfo.useDesc : $("#useDesc option:selected").val())
                   .trigger("change");
    const constTy = that.state.parent.state.applicationPage.state.constTy;
    const constTyNm = that.state.parent.state.applicationPage.state.constTyNm;
    if(constTy === "C01" || constTy === "C02" || constTy === "C03" || constTy === "B02" || constTy === "E01"){
      $("#bldOwnerDisplay").show();
    }else{
      $("#bldOwnerDisplay").hide();
    }
    this.handleDrawInstallmentYn(that.state.requestInfo.installmentYn)
    this.setState({
      ...this.state,
      constTy: constTy,
      constTyNm: constTyNm
    });
  }

  renderDescription(target: any) {
    const that = this;
    const minwonDesc = that.state.description;
    
    let desc = `
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw0');" class="on" title="펼치기">
            <span class="i-06 txStrongColor">민원안내 및 처리절차</span></a>
          </div>
          <div id="innerDesc" class="form-mw-box display-none row">
            <div class="info-mw row">
    `;
    if(minwonDesc.minwonHow){
      desc += `
                <div class="tit-mw-h5 row"><span>신청방법</span></div>
                <p>${minwonDesc.minwonHow}</P>
      `;
    }
    if(minwonDesc.minwonReqstDc){
      desc += `
                <div class="tit-mw-h5 row"><span>처리기간</span></div>
                <p>${minwonDesc.minwonReqstDc}</P>
      `;
    }
    if(minwonDesc.minwonGde){
      desc += `
                <div class="tit-mw-h5 row"><span>처리부서</span></div>
                <p>${minwonDesc.minwonGde}</P>
      `;
    }
    if(minwonDesc.presentnPapers){
      desc += `
                <div class="tit-mw-h5 row"><span>신청서류</span></div>
                <p>${minwonDesc.presentnPapers}</P>
      `;
    }
    if(minwonDesc.mtinspGde){
      desc += `
                <div class="tit-mw-h5 row"><span>관련법규</span></div>
                <p>${minwonDesc.mtinspGde}</P>
      `;
    }
    if(minwonDesc.minwonProcedure){
      desc += `
                <div class="tit-mw-h5 row"><span>처리절차</span></div>
                <p>${minwonDesc.minwonProcedure}</P>
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
    document.getElementById('innerDesc')!.insertAdjacentHTML('beforeend',getDescription());
  }
}