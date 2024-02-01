import CyberMinwon from '../infra/CyberMinwon';
import JusoSearchPanel from '../components/JusoSearchPanel';
import { fetch } from './../util/unity_resource';
import { showHideInfo, phoneNumberInputValidation, hideElement, citizen_alert, citizenAlert, citizenConfirm, maskingFnc, getNowDate, phonePattern, clearObject } from './../util/uiux-common';

declare var fncGetCodeByGroupCdUsing: (code: string) => string;
declare var gContextUrl: string;
declare var fncSetComboByCodeList: (param1: string, param2: string) => void;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var document: any;
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class A11DetailPage {
  jusoTarget: string;
  jusoSearchPanel: JusoSearchPanel;
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any;
      viewRequestInfo: any;
      jusosearchShow: boolean,
      statusInfo: any,
      requestInfo: {
        waterTy: string, // 직결급수 유형
        waterTyNm: string, // 직결급수 유형명
        constructDt: string,  // 직결급수 공사시기
        area: string, // 연건축면적
        pipeDia: string, //인입급수관구경
        buildingYear: string, //건축년도
        building: string, //용도
        buildingUse: string, //용도명
        family: string, //가구수(세대수)
        floor1: string, //층수:지상
        floor2: string //지하
      },
      compInfo: {
        comPresident: string,// 대표자성명 30
        constructCom: string,// 회사명 100
        compTel: string,// 전화번호
        cvpl_adres_ty : string,
        
        compPostNumber: string,
        compAddress: string,
        compDetailAddress: string,
        compDisplayAddress: string,
        
        //주소
        sido: string,
        sigungu: string,
        umd: string,
        hdongNm: string,
        dong: string,
        doroCd: string,
        doroNm: string,
        dzipcode: string,
        bupd: string,
        bdMgrNum: number|string,
        bdBonNum: number|string,
        bdBuNum: number|string,
        bdnm: string,
        bdDtNm: string,
        addr2: string,
        zipcode: string,
        fullDoroAddr: string, //applyAddress
        addr1: string,
        bunji: number|string,
        ho: number|string,
        extraAdd: string,
        specAddr: string,
        specDng: string,
        specHo: string,
        floors: string
      },
      description: any
  };

  constructor(parent: any, minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      viewRequestInfo: {},
      jusosearchShow: false,
      statusInfo: {},
      requestInfo: {
      	waterTy: '', // 직결급수 유형
      	waterTyNm: '', // 직결급수 유형명
				constructDt: '',  // 직결급수 공사시기
				area: '', // 연건축면적
				pipeDia: '', //인입급수관구경
				buildingYear: '', //건축년도
				building: '', //용도
				buildingUse: '', //용도명
				family: '', //가구수(세대수)
				floor1: '', //층수:지상
				floor2: '' //지하
      },
      compInfo: {
        comPresident: '',// 대표자성명 30
        constructCom: '',// 회사명 100
        compTel: '',
        cvpl_adres_ty : 'COMP',
        compPostNumber: '',
        compAddress: '',
        compDetailAddress: '',
        compDisplayAddress: '',
        //주소
        sido: '',
        sigungu: '',
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: '',
        dzipcode: '',
        bupd: '',
        bdMgrNum: 0,
        bdBonNum: 0,
        bdBuNum: 0,
        bdnm: '',
        bdDtNm: '',
        addr2: '',
        zipcode: '',
        fullDoroAddr: '', //applyAddress
        addr1: '',
        bunji: 0,
        ho: 0,
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: ''
      },
      
      description: {},
    };
    this.path = 'cyberMinwon.state.currentModule.state.currentPage';
    this.jusoTarget = 'jusosearchdetailA11';
    this.jusoSearchPanel = new JusoSearchPanel(this, this.path, this.jusoTarget, this.handleSelectJuso);

    this.setInitValue();
  }

  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      requestInfo: {
        waterTy: '', // 직결급수 유형
        waterTyNm: '', // 직결급수 유형명
        constructDt: '',  // 직결급수 공사시기
        area: '', // 연건축면적
        pipeDia: '', //인입급수관구경
        buildingYear: '', //건축년도
        building: '', //용도
        buildingUse: '', //용도명
        family: '', //가구수(세대수)
        floor1: '', //층수:지상
        floor2: '' //지하
      },
      compInfo: {
        comPresident: '',// 대표자성명 30
        constructCom: '',// 회사명 100
        compTel: '',
        cvpl_adres_ty : 'COMP',
        compPostNumber: '',
        compAddress: '',
        compDetailAddress: '',
        compDisplayAddress: '',
        //주소
        sido: '',
        sigungu: '',
        umd: '',
        hdongNm: '',
        dong: '',
        doroCd: '',
        doroNm: '',
        dzipcode: '',
        bupd: '',
        bdMgrNum: 0,
        bdBonNum: 0,
        bdBuNum: 0,
        bdnm: '',
        bdDtNm: '',
        addr2: '',
        zipcode: '',
        fullDoroAddr: '', //applyAddress
        addr1: '',
        bunji: 0,
        ho: 0,
        extraAdd: '',
        specAddr: '',
        specDng: '',
        specHo: '',
        floors: ''
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
    //직결급수 유형
    let waterType = fncGetCodeByGroupCdUsing("waterType");
    //유형
    let building = fncGetCodeByGroupCdUsing("building");
    
    that.setState({
      ...that.state,
      statusInfo: {
        comboWaterType: waterType,
        comboBuilding: building
      }
    });
  }

  // InfoPanel 데이터 설정
  getViewInfo() {
  	let infoData: any = {};

    if(this.state.requestInfo) {
      infoData['noinfo'] = {
//        title: this.state.description.minwonNm,
        waterTy: [this.state.requestInfo.waterTy, '직결급수 유형'],
        constructDt: [this.state.requestInfo.constructDt, '직결급수 공사시기'],
        area: [this.state.requestInfo.area + '㎡' , '연건축면적'],
        pipeDia: [this.state.requestInfo.pipeDia + '㎜', '인입급수관구경'],
        buildingYear: [this.state.requestInfo.buildingYear + '년', '건축년도'],
        building: [this.state.requestInfo.building, '건축물현황(용도)'],
        family: [this.state.requestInfo.family, '건축물현황(가구수)'],
        floor: ["지상 "+this.state.requestInfo.floor1 +'/' + "지하 "+this.state.requestInfo.floor2, '건축물현황(층수)'],
        constructCom: [this.state.compInfo.constructCom, '시공자(회사명)'],
        comPresident: [maskingFnc.name(this.state.compInfo.comPresident, "*"), '시공자(대표자성명)'],
        fullDoroAddr: ["("+this.state.compInfo.zipcode+") "+this.state.compInfo.compDisplayAddress, '시공자(주소)'],
        compTel: [maskingFnc.telNo(this.state.compInfo.compTel, "*"), '시공자(연락처)'],
      }
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
    const compInfo = this.state.compInfo;

    if (!requestInfo.constructDt ) {
      citizenAlert("직결급수 공사시기를 입력해 주세요.").then(result => {
        if(result){
          $("#constructDt").focus();
        }
      });
      return false;
    }
    
    if (!compInfo.compAddress ) {
      citizenAlert("시공업체 주소를 입력해 주세요.").then(result => {
        if(result){
          $("#compPostNumber").siblings("a").focus();
        }
      });
      return false;
    }
    
    if(compInfo.compTel.length > 0 && phonePattern.test(compInfo.compTel) !== true){
      citizenAlert("잘못된 형식의 연락처입니다. 시공업체 연락처를 확인해 주세요.").then(result => {
        if(result){
          $("#applyPhone").focus();
        }        
      });
      return false;
    }
    
    return true;
  }
  
  handleSelectJuso = (jusoInfo: any, detailAddress: string, action?: string) => {    
    this.setState({      
      ...this.state,      
      compInfo: {        
        ...this.state.compInfo,      
        compPostNumber: jusoInfo.zipNo,//우편번호
        compAddress: jusoInfo.roadAddr,
//        compAddress: jusoInfo.siNm +" "+jusoInfo.sggNm+" "+jusoInfo.emdNm,//지역명
        zipcode: jusoInfo.zipNo,//우편번호        
        addr1: (jusoInfo.siNm +" "+jusoInfo.sggNm+" "+jusoInfo.emdNm).trim(),//지역명        
        addr2: '',//상세주소        
        fullDoroAddr: jusoInfo.roadAddr,        
        sido: jusoInfo.siNm,//시도명        
        sigungu: jusoInfo.sggNm,//시군구명        
        umd: jusoInfo.emdNm,//법정읍면동명        
        //hdongNm: '',//행정동 명(java단에서 어차피 만들어줌)        
        dong: jusoInfo.emdNm,//행정읍동명 같지만 값이 없어 umd와 같은 값을 준다        
        doroCd: jusoInfo.rnMgtSn,//도로명코드        
        doroNm: jusoInfo.rn,//도로명        
        //dzipcode: '',        
        bupd: jusoInfo.admCd,//법정동코드        
        bdMgrNum: jusoInfo.bdMgtSn,//건물관리번호 (java단에서 어차피 만들어줌)        
        bdBonNum: jusoInfo.buldMnnm,//건물본번        
        bdBuNum: jusoInfo.buldSlno,//건물부번        
        bdnm: jusoInfo.bdNm,//건물명        
        bdDtNm: '',//상세건물명                        
        bunji: jusoInfo.lnbrMnnm,//번지        
        ho: jusoInfo.lnbrSlno,//호        
        extraAdd: '',        
        specAddr: '',        
        specDng: '',        
        specHo: '',        
        floors: '',
        
        compDetailAddress : detailAddress,//상세주소
        compDisplayAddress : (jusoInfo.roadAddr+" "+detailAddress).trim()//요약주소(보여주기용)   
      }    
    });     
    
    document.getElementById('compPostNumber').value = jusoInfo.zipNo;
    document.getElementById('compDisplayAddress').innerHTML = jusoInfo.roadAddr+" "+detailAddress
    document.getElementById('compDisplayAddress').parentNode.style.display = 'none';
    if(action !== "clear"){
      document.getElementById('compDisplayAddress').parentNode.style.display = 'block';
      this.toggleJusoSearch();
      //const $zip: HTMLInputElement = document.getElementById('compPostNumber') as HTMLInputElement;    
      //const $addr: HTMLInputElement = document.getElementById('compAddress') as HTMLInputElement;     
      //$zip.value = jusoInfo.zipNo    
      //$addr.value = jusoInfo.roadAddr    
      //$("#compDetailAddress").focus();  
    }
  }
  
  disableJusoSearch() {
    hideElement('#' + this.jusoTarget);
    this.setState({
      ...this.state,
      jusosearchShow: false,
    });
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
    $("#jusosearchdetailA11doro > input").focus();
  }

  handleCompDetailAddress(e: any) {

    this.setState({
      ...this.state,
      compInfo: {
        ...this.state.compInfo,
        compDetailAddress: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.compInfo.compDetailAddress.substring(0, 50);
  }

  //직결급수 유형 onchange
  handleChangeWaterTy(e: any) {
  	let value = e.value;
    let name = e.options[e.selectedIndex].text;
    let preValue = this.state.requestInfo.waterTy;
  	
  	this.setState({
				...this.state,
				requestInfo: {
					...this.state.requestInfo,
					waterTy: value,
					waterTyNm: name
				}
		});
  }
  
  //직결급수 공사시기
  handleChangeConstructDt(e: any) {
  	this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        constructDt: e.target.value.replace(/[^0-9-]/g, "").substring(0, 11)
      }
    });
  	e.target.value = this.state.requestInfo.constructDt;
  }
  
  //연건축면적
  handleChangeArea(e: any) {
  	this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        area: e.target.value.replace(/[^0-9.]/g, "").substring(0, 8)
      }
    });
  	e.target.value = this.state.requestInfo.area;
  }
  
  //인입급수관구경
  handleChangePipeDia(e: any) {
  	this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        pipeDia: e.target.value.replace(/[^0-9]/g, "").substring(0, 10)
      }
    });
  	e.target.value = this.state.requestInfo.pipeDia;
  }
  
  //
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
  
  //용도 onchange 
  handleChangeBuilding(e: any) {
  	let value = e.value;
    let name = e.options[e.selectedIndex].text;
  	
		this.setState({
				...this.state,
				requestInfo: {
					...this.state.requestInfo,
					building: value,
					buildingUse: name
				}
		});
		
  }
  
  //가구수(세대수)
  handleChangeFamily(e: any) {
  	this.setState({
      ...this.state,
      requestInfo: {
        ...this.state.requestInfo,
        family: e.target.value.replace(/[^0-9]/g, "").substring(0, 10)
      }
    });
  	e.target.value = this.state.requestInfo.family;
  }
  
  //층수:지상
  handleChangeFloor1(e: any) {
  	this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				floor1: e.target.value.replace(/[^0-9]/g, "").substring(0, 5)
			}
  	});
  	e.target.value = this.state.requestInfo.floor1;
  }
  
  //층수:지하
  handleChangeFloor2(e: any) {
  	this.setState({
			...this.state,
			requestInfo: {
				...this.state.requestInfo,
				floor2: e.target.value.replace(/[^0-9]/g, "").substring(0, 5)
			}
  	});
  	e.target.value = this.state.requestInfo.floor2;
  }
  
  //대표자성명
  handleChangeComPresident(e: any) {
    this.setState({
      ...this.state,
      compInfo: {
        ...this.state.compInfo,
        comPresident: fncCutByByte(e.target.value, 30)
      }
    });
    e.target.value = this.state.compInfo.comPresident;
  }
  
  //회사명
  handleChangeConstructCom(e: any) {
    this.setState({
      ...this.state,
      compInfo: {
        ...this.state.compInfo,
        constructCom: fncCutByByte(e.target.value, 100)
      }
    });
    e.target.value = this.state.compInfo.constructCom;
  }
  
  //전화번호
  handleChangeCompTel(e: any) {
    this.setState({
      ...this.state,
      compInfo: {
        ...this.state.compInfo,
        compTel: e.target.value.replace(/[^0-9]/g, "").substring(0, 12)
      }
    });
    e.target.value = this.state.compInfo.compTel;
    phoneNumberInputValidation(e.target, 12, phonePattern);
  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyDrcconWsp.do";
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
  	const compInfo = this.state.compInfo;
    const drcconWspVO = {
    		//
    		'waterTy' : requestInfo.waterTy,
    		'constructDt' : requestInfo.constructDt.replace(/[^0-9]/g,""),
    		'area' : requestInfo.area,
    		'pipeDia' : requestInfo.pipeDia,
    		'buildingYear' : requestInfo.buildingYear,
    		'building' : requestInfo.building,
    		'family' : requestInfo.family,
    		'floor1' : requestInfo.floor1,
    		'floor2' : requestInfo.floor2,
    		'comPresident': compInfo.comPresident,
    		'constructCom': compInfo.constructCom,
    		'comTelno': compInfo.compTel,
    		'cvplInfo.cvplAddr[2].cvplAdresTy': compInfo.cvpl_adres_ty,
        'cvplInfo.cvplAddr[2].sido': compInfo.sido,
        'cvplInfo.cvplAddr[2].sigungu': compInfo.sigungu,
        'cvplInfo.cvplAddr[2].umd': compInfo.umd,
        'cvplInfo.cvplAddr[2].hdongNm': compInfo.hdongNm,
        'cvplInfo.cvplAddr[2].dong': compInfo.umd,
        'cvplInfo.cvplAddr[2].doroCd': compInfo.doroCd,
        'cvplInfo.cvplAddr[2].doroNm': compInfo.doroNm,
        'cvplInfo.cvplAddr[2].dzipcode': compInfo.dzipcode,            // 도로우편번호
        'cvplInfo.cvplAddr[2].bupd': compInfo.bupd,
        'cvplInfo.cvplAddr[2].bdMgrNum': compInfo.bdMgrNum,            // 빌딩관리번호
        'cvplInfo.cvplAddr[2].bdBonNum': compInfo.bdBonNum,
        'cvplInfo.cvplAddr[2].bdBuNum': compInfo.bdBuNum,
        'cvplInfo.cvplAddr[2].bdnm': compInfo.bdnm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)
        'cvplInfo.cvplAddr[2].bdDtNm': compInfo.bdDtNm,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력
        'cvplInfo.cvplAddr[2].addr2': compInfo.addr2,
        'cvplInfo.cvplAddr[2].zipcode': compInfo.zipcode,
        'cvplInfo.cvplAddr[2].fullDoroAddr': compInfo.fullDoroAddr,
        'cvplInfo.cvplAddr[2].addr1': compInfo.addr1,
        'cvplInfo.cvplAddr[2].bunji': compInfo.bunji,
        'cvplInfo.cvplAddr[2].ho': compInfo.ho,
        'cvplInfo.cvplAddr[2].extraAdd': compInfo.compDetailAddress,
        'cvplInfo.cvplAddr[2].specAddr': compInfo.specAddr,
        'cvplInfo.cvplAddr[2].specDng': compInfo.specDng,
        'cvplInfo.cvplAddr[2].specHo': compInfo.specHo,
        'cvplInfo.cvplAddr[2].floors': compInfo.floors,
    }
    
    return {
      ...this.state.parent.state.applicationPage.getSuyongaQueryString(),
      'cvplInfo.cvpl.minwonCd': this.state.minwonCd,
      ...drcconWspVO
    };
  }
  
  getStatusString() {}

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
        <!-- 직결급수 신고 -->
        <div id="form-mw23" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
          <span class="i-01">${that.state.description.minwonNm}</span></a></div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li>
                  <label for="waterTy" class="input-label"><span class="form-req"><span class="sr-only">필수</span>직결급수 유형</span></label>
                  <select id="waterTy" name="waterTy" title="직결급수 유형 선택" class="input-box input-w-2"
                  	onchange="${that.path}.handleChangeWaterTy(this)">
                  </select>
                  
                </li>
                <li>
                  <label for="constructDt" class="input-label"><span class="form-req"><span class="sr-only">필수</span>직결급수 공사시기</span></label>
                  <input type="date" id="constructDt" name="constructDt" class="input-box input-w-2" maxlength="10" min="1000-01-01" max="2100-12-31"
                    value="${that.state.requestInfo.constructDt}"
                    onchange="${that.path}.handleChangeConstructDt(event)">
                    
                </li>
                <li>
                  <label for="area" class="input-label"><span>연건축면적(㎡)</span></label>
                  <input type="text" id="area" name="area" class="input-box input-w-2" title="연건축면적 입력" maxlength="8" placeholder="예)100"
                    value="${that.state.requestInfo.area}"
                    onchange="${that.path}.handleChangeArea(event)"
                    onkeyup="${that.path}.handleChangeArea(event)"
                    onpaste="${that.path}.handleChangeArea(event)">
                </li>
                <li>
                  <label for="pipeDia" class="input-label"><span>인입급수관구경(㎜)</span></label>
                  <input type="text" id="pipeDia" name="pipeDia" class="input-box input-w-2" title="인입급수관구경 입력" maxlength="10" placeholder="예)15"
                    value="${that.state.requestInfo.pipeDia}"
                    onchange="${that.path}.handleChangePipeDia(event)"
                    onkeyup="${that.path}.handleChangePipeDia(event)"
                    onpaste="${that.path}.handleChangePipeDia(event)">
                </li>
                <li>
                  <label for="buildingYear" class="input-label"><span>건축년도</span></label>
                  <input type="text" id="buildingYear" name="buildingYear" class="input-box input-w-2" title="건축년도 입력" maxlength="4" placeholder="건축년도 입력"
                    value="${that.state.requestInfo.buildingYear}"
                    onchange="${that.path}.handleChangeBuildingYear(event)"
                    onkeyup="${that.path}.handleChangeBuildingYear(event)"
                    onpaste="${that.path}.handleChangeBuildingYear(event)">
                </li>
                <li>
    	            <label for="building" class="input-label"><span class="form-req"><span class="sr-only">필수</span>용도</span></label>
    	            <select id="building" name="building" title="용도" class="input-box input-w-2"
    	            	onchange="${that.path}.handleChangeBuilding(this)">
    	            </select>
    	          </li>
                <li>
                  <label for="family" class="input-label"><span>가구수</span></label>
                  <input type="text" id="family" name="family" class="input-box input-w-2" title="가구수" maxlength="10" placeholder="가구수 입력"
                    value="${that.state.requestInfo.family}"
                    onchange="${that.path}.handleChangeFamily(event)"
                    onkeyup="${that.path}.handleChangeFamily(event)"
                    onpaste="${that.path}.handleChangeFamily(event)">
                </li>
                <li>
                  <label for="floor1" class="input-label"><span>층수:지상</span></label>
                  <input type="text" id="floor1" name="floor1" class="input-box input-w-2" title="층수:지상" maxlength="5" placeholder="예)10"
                    value="${that.state.requestInfo.floor1}"
                    onchange="${that.path}.handleChangeFloor1(event)"
                    onkeyup="${that.path}.handleChangeFloor1(event)"
                    onpaste="${that.path}.handleChangeFloor1(event)">
                </li>
                <li>
                  <label for="floor2" class="input-label"><span>지하</span></label>
                  <input type="text" id="floor2" name="floor2" class="input-box input-w-2" title="지하" maxlength="5" placeholder="예)3"
                    value="${that.state.requestInfo.floor2}"
                    onchange="${that.path}.handleChangeFloor2(event)"
                    onkeyup="${that.path}.handleChangeFloor2(event)"
                    onpaste="${that.path}.handleChangeFloor2(event)">
                </li>
    
              </ul>
            </div>
          </div><!-- //form-mw-box -->
        </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      <div class="mw-box">
        <div id="form-mw24" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
          <span class="i-01">시공업체</span></a></div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li>
                  <label for="" class="input-label"><span>회사명</span></label>
                  <input value="${that.state.compInfo.constructCom}" type="text" id="constructCom" name="constructCom" class="input-box input-w-2" placeholder="회사명 입력" 
                    onchange="${that.path}.handleChangeConstructCom(event)"
                    onkeyup="${that.path}.handleChangeConstructCom(event)"
                    onpaste="${that.path}.handleChangeConstructCom(event)">
                </li>
                <li>
                  <label for="" class="input-label"><span>대표자성명</span></label>
                  <input value="${that.state.compInfo.comPresident}" type="text" id="comPresident" name="comPresident" class="input-box input-w-2"  placeholder="대표자성명 입력"
                    onchange="${that.path}.handleChangeComPresident(event)"
                    onkeyup="${that.path}.handleChangeComPresident(event)"
                    onpaste="${that.path}.handleChangeComPresident(event)">
                </li>
                <li>
                  <label for="compPostNumber" class="input-label"><span class="form-req"><span class="sr-only">필수</span>주소</span></label>
                  <span onClick="${that.path}.toggleJusoSearch()">
                    <input type="text" value="${that.state.compInfo.compPostNumber}" id="compPostNumber"
                      class="input-box input-w-2" placeholder="우편번호" disabled>
                  </span>
                  <a class="btn btnSS btnTypeA btnSingle"
                    onClick="${that.path}.toggleJusoSearch()"><span>주소검색</span></a>
                </li>
                `
       
       template += `${that.state.compInfo.compDisplayAddress}` ? `<li>` : `<li style="display:none;">` ;
       template += `
                  <label for="compDisplayAddress" class="input-label display-inline"><span class="sr-only">주소</span></label>
                  <div id="compDisplayAddress" class="input-box input-w-2 result-address">${that.state.compInfo.compDisplayAddress}</div>
                </li>
                
                <li id="${that.jusoTarget}" class="display-block">
                </li>
                <li>
                  <label for="" class="input-label"><span>연락처</span></label>
                  <input value="${that.state.compInfo.compTel}" type="text" id="compTel" name="compTel" class="input-box input-w-2" 
                    onchange="${that.path}.handleChangeCompTel(event)" placeholder="'-' 없이 번호입력" maxlength="12"
                    onkeyup="${that.path}.handleChangeCompTel(event)"
                    onpaste="${that.path}.handleChangeCompTel(event)">
                </li>
              </ul>
            </div>
          </div><!-- //form-mw-box -->
        </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->
      `;

    document.getElementById('minwonRoot')!.innerHTML = template;

    this.renderDescription(document.getElementById('desc'));
    
    this.afterRender();
    
    if (!this.state.jusosearchShow) {
      showHideInfo('#' + this.jusoTarget);
    }
    this.jusoSearchPanel.render();
  }
  
  // 기본 설정값은 여기에서 랜더링 해야 한다.
  afterRender() {
  	const that = this;
  	fncSetComboByCodeList("waterTy", that.state.statusInfo.comboWaterType);
  	$("#waterTy").val(that.state.requestInfo.waterTy ? that.state.requestInfo.waterTy : $("#waterTy option:selected").val())
                   .trigger("change");
  	
  	fncSetComboByCodeList("building", that.state.statusInfo.comboBuilding);
  	$("#building").val(that.state.requestInfo.building ? that.state.requestInfo.building : $("#building option:selected").val())
                   .trigger("change");
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