import CyberMinwon from '../infra/CyberMinwon';
import { fetch} from './../util/unity_resource';
import JusoSearchPanel from "./../components/JusoSearchPanel";
import { radioMW, showHideInfo, hideElement, phoneNumberInputValidation, 
         citizenAlert, citizen_alert, citizenConfirm, maskingFnc, phonePattern, clearObject } from './../util/uiux-common';

declare var gContextUrl: string;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var document: any;
declare var $: any;
declare var cyberMinwon: CyberMinwon;


export default class B13DetailPage {
  state: {
    minwonCd: string;
    parent: any;
    jusosearchShow: any;
    path: string;
    statusInfo: any;
    requestInfo: {
      gubun: string,
      gaugeDia: string,
      declaDt: string,
      oldTelno: string,
      oldTelno1: string,
      oldTelno2: string,
      oldTelno3: string,
      oldOwner: string,
      newOwner: string,
    };
    oldOwnerAddrInfo: {
      zipcode: string,
      fullDoroAddr: string,
      addr2: string,
      sido: string,
      sigungu: string,
      umd: string,
      hdongNm: string,
      dong: string,
      doroCd: string,
      doroNm: string,
      dzipcode: string,
      bupd: string,
      bdMgrNum: string,
      bdBonNum: string,
      bdBuNum: string,
      bdnm: string,
      bdDtNm: string,
      addr1: string,
      bunji: string,
      ho: string,
      extraAdd: string,
      specAddr: string,
      specDng: string,
      specHo: string,
      floors: string,
      oldAddress: string,
      oldDetailAddress: string,
      oldDisplayAddress: string
    };
    viewOldOwnerInfo:{
      viewOldOwnerAddress: any
    };
    description: any;
    viewRequestInfo: any;
    isSubmitSuccessful: boolean;
    submitResult: any,
  }
  jusoTarget: string;
  jusoSearchPanel: JusoSearchPanel;
  
  constructor(parent:any , minwonCd: string) {
    this.state = {
      
      minwonCd,
      parent,
      jusosearchShow: false,
      path: 'cyberMinwon.state.currentModule.state.currentPage',
      statusInfo: {},
      requestInfo: {
	    	gubun:"",//소유자,사용자 구분
	    	gaugeDia:"",//계량기 지침
	    	declaDt:"",//취득일자
	    	oldTelno:"",//신[소유자,사용자]전화번호 원본
	    	oldTelno1:"",//신[소유자,사용자]전화번호1
	    	oldTelno2:"",//신[소유자,사용자]전화번호2
	    	oldTelno3:"",//신[소유자,사용자]전화번호3
	    	oldOwner:"",//구[소유자,사용자]성명
	    	newOwner:""//신[소유자,사용자]성명
      },
      oldOwnerAddrInfo: {
        zipcode: '',
        fullDoroAddr: '',
        addr2: '',
        sido: '',
        sigungu: '',
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: '',
        dzipcode: '',
        bupd: '',
        bdMgrNum: '',
        bdBonNum: '',
        bdBuNum: '',
        bdnm: '',
        bdDtNm: '',
        addr1: '',
        bunji: '',
        ho: '',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        oldAddress: '',
        oldDetailAddress: '',
        oldDisplayAddress: ''
      },
      
      viewOldOwnerInfo: {
        viewOldOwnerAddress: ['', '전출주소'],
      },
      description: {},
      viewRequestInfo: {},
      isSubmitSuccessful: false,
      submitResult: {}
    };

    this.setInitValue();
    this.jusoTarget = 'jusosearcholdOwner'
    this.jusoSearchPanel = new JusoSearchPanel(this, this.state.path, this.jusoTarget, this.handleSelectJuso);
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        gubun:"소유자",//소유자,사용자 구분
        gaugeDia:"",//계량기 지침
        declaDt:"",//취득일자
        oldTelno:"",//신[소유자,사용자]전화번호 원본
        oldTelno1:"",//신[소유자,사용자]전화번호1
        oldTelno2:"",//신[소유자,사용자]전화번호2
        oldTelno3:"",//신[소유자,사용자]전화번호3
        oldOwner:"",//구[소유자,사용자]성명
        newOwner:""//신[소유자,사용자]성명
      },
      oldOwnerAddrInfo: {
        zipcode: '',
        fullDoroAddr: '',
        addr2: '',
        sido: '',
        sigungu: '',
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: '',
        dzipcode: '',
        bupd: '',
        bdMgrNum: '',
        bdBonNum: '',
        bdBuNum: '',
        bdnm: '',
        bdDtNm: '',
        addr1: '',
        bunji: '',
        ho: '',
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        oldAddress: '',
        oldDetailAddress: '',
        oldDisplayAddress: ''
      },
      
      viewOldOwnerInfo: {
        viewOldOwnerAddress: ['', '전출주소'],
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
    		gubun : [that.state.requestInfo.gubun, "변경 구분"],
    		gaugeDia : [that.state.requestInfo.gaugeDia, "현재지침"],
    		newOwner : [maskingFnc.name(that.state.requestInfo.newOwner, "*"), "신 "+that.state.requestInfo.gubun+" 성명"],
    		declaDt : [that.state.requestInfo.declaDt, "취득예정일"],
    		oldOwner : [maskingFnc.name(that.state.requestInfo.oldOwner, "*"), "구 "+that.state.requestInfo.gubun+" 성명"],
    		fullDoroAddr : ["("+that.state.oldOwnerAddrInfo.zipcode+ ") " + that.state.oldOwnerAddrInfo.oldDisplayAddress, "구 "+that.state.requestInfo.gubun+" 전출주소"],
    		oldTelno : [maskingFnc.telNo(that.state.requestInfo.oldTelno, "*"), "구 "+that.state.requestInfo.gubun+" 연락처"]
    	}
    };
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  setEventListeners() {
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

  // 입력사항 검증 로직
  verify() {
    const that = this;
    const requestInfo = this.state.requestInfo;
    const oldOwnerAddrInfo = this.state.oldOwnerAddrInfo;
    
   if(!requestInfo.gaugeDia){
      citizenAlert("현재지침을 입력해 주세요.").then(result => {
        if(result){
          $("#gaugeDia").focus();
        }
      });
      return false;
      }
   if(!requestInfo.newOwner){
        citizenAlert("신 "+that.state.requestInfo.gubun+" 성명을 입력해 주세요.").then(result => {
          if(result){
            $("#newOwner").focus();
          }
        });
        return false;
      }
   if(!requestInfo.declaDt){
        citizenAlert("취득예정일을 입력해 주세요.").then(result => {
          if(result){
            $("#declaDt").focus();
          }
        });
        return false;
      }
   if(!requestInfo.oldOwner){
        citizenAlert("구 "+that.state.requestInfo.gubun+" 성명을 입력해 주세요.").then(result => {
          if(result){
            $("#oldOwner").focus();
          }
        });
        return false;
      }
   if(!oldOwnerAddrInfo.zipcode){
        citizenAlert("구 "+that.state.requestInfo.gubun+" 전출주소를 검색해 주세요.").then(result => {
          if(result){
            $("#zipcode").focus();
          }
        });
        return false;
      }
    if(!requestInfo.oldTelno){
        citizenAlert("구 "+that.state.requestInfo.gubun+" 연락처를 입력해 주세요.").then(result => {
          if(result){
            $("#oldTelno").focus();
          }
        });
        return false;
    }
    if(phonePattern.test(requestInfo.oldTelno) !== true){
        citizenAlert("구 "+that.state.requestInfo.gubun+" 연락처가 잘못된 형식입니다.").then(result => {
          if(result){
            $("#oldTelno").focus();
          }
        });
        return false;
    }
    
    return true;
  }
 
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(id: string, uiBox: string, gubun: string) {
  this.setState({
    ...this.state,
    requestInfo: {
      ...this.state.requestInfo,
      gubun : gubun//소유자,사용자 구분
      
    }
  })
    radioMW(id, uiBox);
    $(".gubunText").text(gubun);
    $("#newOwner").attr("placeholder", "신 "+gubun+" 성명");
    $("#oldOwner").attr("placeholder", "구 "+gubun+" 성명");
  }
  
  //계량기 지침
  handleGaugeDia(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.value.replace(/[^0-9]/g, "").substring(0, 12)
        }
      });
      e.target.value = e.target.value.replace(/[^0-9]/g, "").substring(0, 12)
    }
  
  //신 소유자 성명
  handleNewOwner(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: fncCutByByte(e.target.value, 30)
        }
      });
      e.target.value = fncCutByByte(e.target.value, 30)
    }
    
  //구 소유자 성명
  handleOldOwner(e: any) {
    this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: fncCutByByte(e.target.value, 30)
        }
      });
      e.target.value = fncCutByByte(e.target.value, 30)
    }
    
  //취득 예정 일자
  handleDeclaDt(e:any) {
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.value
        }
      });
      e.target.value = e.target.value
    } 
    
    
    
  // 콜백에서 사용되기 때무에 arrow function을 사용한다.
  // 수정 시에 this의 score에 주의한다.
  handleSelectJuso = (jusoInfo: any, detailAddress: string, action?: string) => {
    this.setState({
      ...this.state,
      oldOwnerAddrInfo: {
        ...this.state.oldOwnerAddrInfo,
        zipcode: jusoInfo.zipNo,//우편번호
        addr1: (jusoInfo.siNm +" "+jusoInfo.sggNm+" "+jusoInfo.emdNm).trim(),//지역명
        addr2: '',//상세주소(java 소스에서 만들어주는 값)
        fullDoroAddr: jusoInfo.roadAddr,
        sido: jusoInfo.siNm,//시도명
        sigungu: jusoInfo.sggNm,//시군구명
        umd: jusoInfo.emdNm,//법정읍면동명
        //hdongNm: '',//행정동 명(java단에서 만들어줌)
        dong: jusoInfo.emdNm,//행정읍동명 같지만 값이 없어 umd와 같은 값을 준다
        doroCd: jusoInfo.rnMgtSn,//도로명코드
        doroNm: jusoInfo.rn,//도로명
        bupd: jusoInfo.admCd,//법정동코드
        bdMgrNum: jusoInfo.bdMgtSn,//건물관리번호 (java단에서 어차피 만들어줌)
        bdBonNum: jusoInfo.buldMnnm,//건물본번
        bdBuNum: jusoInfo.buldSlno,//건물부번
        bdnm: jusoInfo.bdNm,//건물명
        bdDtNm: '',//상세건물명(요금관리시스템:값 없음, 도로명주소API 사용하기 어려운 값)
        
        
        bunji: jusoInfo.lnbrMnnm,//번지
        ho: jusoInfo.lnbrSlno,//호
        extraAdd: '',//입력받는 상세주소
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: '',
        oldAddress: jusoInfo.roadAddr,
        oldDetailAddress : detailAddress,//상세주소
        oldDisplayAddress : (jusoInfo.roadAddr+" "+detailAddress).trim()//요약주소(보여주기용)
      }
    });
    document.getElementById('zipcode').value = jusoInfo.zipNo;
    document.getElementById('oldDisplayAddress').innerHTML = jusoInfo.roadAddr+" "+detailAddress
    document.getElementById('oldDisplayAddress').parentNode.style.display = 'none';
    if(action !== "clear"){
      document.getElementById('oldDisplayAddress').parentNode.style.display = 'block';
      this.toggleJusoSearch();
    }
    //const $zip: HTMLInputElement = document.getElementById('zipcode') as HTMLInputElement;
    //const $addr: HTMLInputElement = document.getElementById('fullDoroAddr') as HTMLInputElement;
    //$zip.value = jusoInfo.zipNo
    //$addr.value = jusoInfo.roadAddr
    //$("#extraAdd").focus();
  }
  
  toggleJusoSearch() {
    showHideInfo('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: !this.state.jusosearchShow
    });
    clearObject(this.jusoSearchPanel.state.jusoResult);
    this.jusoSearchPanel.render();
    //!document.getElementById(this.jusoTarget+"doro") ? this.jusoSearchPanel.render() : "";
    $("#jusosearcholdOwnerdoro > input").focus();
  }
 
  handleExtraAdd(e: any) {

    this.setState({
      ...this.state,
      oldOwnerAddrInfo: {
        ...this.state.oldOwnerAddrInfo,
        [e.target.id]: e.target.value.substring(0, 50)
      }
    });
    e.target.value = e.target.value.substring(0, 50)
  }
  
  disableJusoSearch() {
    hideElement('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: false,
    });
  }
  
  //전화번호
  handleOldTelno(e:any) {
      this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          [e.target.id]: e.target.value.replace(/[^0-9]/g, "").substring(0, 12)
        }
      });
      e.target.value = e.target.value.replace(/[^0-9]/g, "").substring(0, 12)
      phoneNumberInputValidation(e.target, 12, phonePattern);
    }
    
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyChrgSeprat.do";
    const sendData = this.getQueryString();
    

    fetch('POST', url, sendData, function (error: any, data: any) {
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
  	const oldOwnerAddrInfo = this.state.oldOwnerAddrInfo;
  	var oldTelnoArray = phonePattern.exec(requestInfo.oldTelno);
  	
    const EditChrgSepratObjcData = {
    		gubun: requestInfo.gubun,//신청구분[소유자 / 사용자]
    		gaugeDia: requestInfo.gaugeDia,//계량기 지침
    		declaDt: requestInfo.declaDt.replace(/[^0-9]/g, ""),//취득일자
    		newOwner: requestInfo.newOwner,//신소유자(사용자)성명
    		oldTelno1: oldTelnoArray ? oldTelnoArray[1] : "",//구소유자(사용자)전화번호1
    		oldTelno2: oldTelnoArray ? oldTelnoArray[2] : "",//구소유자(사용자)전화번호2
    		oldTelno3: oldTelnoArray ? oldTelnoArray[3] : "",//구소유자(사용자)전화번호3
    		oldOwner: requestInfo.oldOwner,//구소유자(사용자) 성명
    		relation: '',//해당 컬럼은 TB_CHRG_SEPRAT 테이블의 RELATION 컬럼으로 저장된 적이 단 한번도 없어 empty처리(2023.01.17. 곽현민)
    		//relation: this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyRelation+"의 "+ this.state.parent.state.applicationPage.applicantInfo.state.applyInfo.applyRelation1,

        'cvplInfo.cvplAddr[2].cvplAdresTy': 'OLDOWNER',
        'cvplInfo.cvplAddr[2].zipcode': oldOwnerAddrInfo.zipcode,
        'cvplInfo.cvplAddr[2].fullDoroAddr': oldOwnerAddrInfo.fullDoroAddr,
        'cvplInfo.cvplAddr[2].addr2': oldOwnerAddrInfo.addr2,
        'cvplInfo.cvplAddr[2].sido': oldOwnerAddrInfo.sido,
        'cvplInfo.cvplAddr[2].sigungu': oldOwnerAddrInfo.sigungu,
        'cvplInfo.cvplAddr[2].umd': oldOwnerAddrInfo.umd,
        'cvplInfo.cvplAddr[2].hdongNm': oldOwnerAddrInfo.hdongNm,
        'cvplInfo.cvplAddr[2].dong': oldOwnerAddrInfo.dong,
        'cvplInfo.cvplAddr[2].doroCd': oldOwnerAddrInfo.doroCd,
        'cvplInfo.cvplAddr[2].doroNm': oldOwnerAddrInfo.doroNm,
        'cvplInfo.cvplAddr[2].dzipcode': oldOwnerAddrInfo.dzipcode,
        'cvplInfo.cvplAddr[2].bupd': oldOwnerAddrInfo.bupd,
        'cvplInfo.cvplAddr[2].bdMgrNum': oldOwnerAddrInfo.bdMgrNum,
        'cvplInfo.cvplAddr[2].bdBonNum': oldOwnerAddrInfo.bdBonNum,
        'cvplInfo.cvplAddr[2].bdBuNum': oldOwnerAddrInfo.bdBuNum,
        'cvplInfo.cvplAddr[2].bdnm': oldOwnerAddrInfo.bdnm,
        'cvplInfo.cvplAddr[2].bdDtNm': oldOwnerAddrInfo.bdDtNm,
        'cvplInfo.cvplAddr[2].addr1': oldOwnerAddrInfo.addr1,
        'cvplInfo.cvplAddr[2].bunji': oldOwnerAddrInfo.bunji,
        'cvplInfo.cvplAddr[2].ho': oldOwnerAddrInfo.ho,
        'cvplInfo.cvplAddr[2].extraAdd': oldOwnerAddrInfo.oldDetailAddress,
        'cvplInfo.cvplAddr[2].specAddr': oldOwnerAddrInfo.specAddr,
        'cvplInfo.cvplAddr[2].specDng': oldOwnerAddrInfo.specDng,
        'cvplInfo.cvplAddr[2].specHo': oldOwnerAddrInfo.specHo,
        'cvplInfo.cvplAddr[2].floors': oldOwnerAddrInfo.floors,
    }
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...EditChrgSepratObjcData
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
        <!-- 신·구 소유자(사용자) 사용요금 분리 신고 -->
        <div id="form-mw23" class="row">
          <div class="tit-mw-h3">
            <a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기"><span class="i-01">신고 내용</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
  	            <li>
  		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>신고구분을 선택해 주세요.</span></label>
  		            <ul class="mw-opt mw-opt-5 row">
  			            <li id="own" class="aGubun off">
  			            	<a href="javascript:void(0);" onclick="${that.state.path}.toggleUIGubun('#own', '.aGubun', '소유자');"><span>소유자</span></a>
  			            </li>
  			            <li id="usr" class="aGubun off">
  			            	<a href="javascript:void(0);" onclick="${that.state.path}.toggleUIGubun('#usr','.aGubun', '사용자');"><span>사용자</span></a>
  			            </li>
  		            </ul>
  	            </li>
  	            <li>
  	            	<label for="gaugeDia" class="input-label"><span class="form-req"><span class="sr-only">필수</span>현재지침</span></label>
  	            	<input onkeyup="${that.state.path}.handleGaugeDia(event)" onchange="${that.state.path}.handleGaugeDia(event)"
  	            	value="${that.state.requestInfo.gaugeDia}"
  	            	type="text" id="gaugeDia" name="gaugeDia" class="input-box input-w-2" maxlength="12" placeholder="계량기 현재 지침(숫자)"/>
  	            </li>
  	            <li>
  	            	<label for="newOwner" class="input-label"><span class="form-req"><span class="sr-only">필수</span>신<span class="gubunText">${that.state.requestInfo.gubun}</span></span></label>
  	            	<input onkeyup="${that.state.path}.handleNewOwner(event)" onchange="${that.state.path}.handleNewOwner(event)"
  	            	value="${that.state.requestInfo.newOwner}"
  	            	type="text" id="newOwner" name="newOwner" class="input-box input-w-2" maxlength="7" placeholder="신 ${that.state.requestInfo.gubun} 성명"/>
  	            </li>
  	            <li>
                    <label for="declaDt" class="input-label"><span class="form-req"><span class="sr-only">필수</span>취득예정일</span></label>
                    <input onchange="${that.state.path}.handleDeclaDt(event)"  min="1000-01-01" max="2100-12-31"
                      value="${that.state.requestInfo.declaDt}" type="date" id="declaDt" name="declaDt" class="input-box input-w-fix" maxlength="10"> 
                </li>
              </ul>
            </div>
          </div><!-- 신·구 소유자(사용자)사용요금 분리 신고 -->
        </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
        
        
    <!-- 구[소유자,사용자]정보 -->
    <div class="mw-box">
     <div id="form-mw24" class="row">
      <div class="tit-mw-h3">
        <a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기"><span class="i-01">구 <span class="gubunText">${that.state.requestInfo.gubun}</span> 정보</span></a>
      </div>
      <div class="form-mw-box display-block row">
        <div class="form-mv row">
          <ul>
            <li>
              <label for="oldOwner" class="input-label"><span class="form-req"><span class="sr-only">필수</span>성명</span></label>
              <input onkeyup="${that.state.path}.handleOldOwner(event)" onchange="${that.state.path}.handleOldOwner(event)"
              value="${that.state.requestInfo.oldOwner}"
              type="text" id="oldOwner" name="oldOwner" class="input-box input-w-2" maxlength="7" placeholder="구 ${that.state.requestInfo.gubun} 성명"/>
            </li>
            <li>
              <label for="zipcode" class="input-label"><span class="form-req"><span class="sr-only">필수</span>전출주소</span></label>
              <span onClick="${that.state.path}.toggleJusoSearch()">
                <input type="text" value="${that.state.oldOwnerAddrInfo.zipcode}" id="zipcode"
                  class="input-box input-w-2" placeholder="우편번호" disabled>
              </span>  
              <a class="btn btnSS btnTypeA btnSingle"
                onClick="${that.state.path}.toggleJusoSearch()"><span>주소검색</span></a>
            </li>
            `
       
   template += `${that.state.oldOwnerAddrInfo.oldDisplayAddress}` ? `<li>` : `<li style="display:none;">` ;
   template += `
              <label for="oldDisplayAddress" class="input-label display-inline"><span class="sr-only">주소</span></label>
              <div id="oldDisplayAddress" class="input-box input-w-2 result-address">${that.state.oldOwnerAddrInfo.oldDisplayAddress}</div>
            </li>
            <li id="${that.jusoTarget}" class="display-block"></li>
            </li>
                <label for="oldTelno" class="input-label">
                <span class="form-req"><span class="sr-only">필수</span>연락처</span></label>
                <input value="${that.state.requestInfo.oldTelno}"
                  onfocus="${that.state.path}.disableJusoSearch()"
                  onkeyup="${that.state.path}.handleOldTelno(event)"
                  onpaste="${that.state.path}.handleOldTelno(event)"
                  type="text" id="oldTelno" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
          </ul>
        </div>
      </div><!-- //form-mw-box -->
    </div><!-- //form-mw24 -->
  </div><!-- //mw-box -->        
  <!-- 구[소유자,사용자]정보 -->      
      
      `;

    document.getElementById('minwonRoot')!.innerHTML = template;
    
    if (!this.state.jusosearchShow) {
      showHideInfo('#' + this.jusoTarget);
    }

    this.renderDescription(document.getElementById('desc'));
    this.afterRender();
    this.jusoSearchPanel.render();
  }
  
  //상태가 아닌 UI class 적용은 랜더링 후에 처리되어야 한다.
  afterRender() {
  	const that = this;
  	this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
        }
      });
    
    
    that.state.requestInfo.gubun == "사용자" ? $("#usr").addClass("on") : $("#own").addClass("on");
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
              <div class="tit-mw-h5 row"><span>유의사항</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>단, 취득일로부터 10일전에 신고하셔야 분리고지 가능<br>
                  <li>단, 소유자만 변경되고 사용자는 동일하거나, 1개의 수도계량기로 여러세대가 사용하는 주택으로 일부사용자(세대)가 변경되는 경우에는 사용요금을 분리하실 수 없습니다.<br>
                </ul>
              </div>
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