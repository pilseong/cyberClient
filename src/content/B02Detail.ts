import CyberMinwon from '../infra/CyberMinwon';
import { fetch, fetchMultiPart } from './../util/unity_resource';
import { radioMW, citizenAlert, citizenConfirm, maskingFnc } from './../util/uiux-common';

declare var gContextUrl: string;
declare var alert_msg: (msg: string) => void;
declare var fncCutByByte: (str: string, maxByte: number) => string;
declare var $: any;
declare var gVariables: any;
declare var cyberMinwon: CyberMinwon;

export default class B02DetailPage {
  path: string;
  state: {
      minwonCd: string;
      parent: any;
      isSubmitSuccessful: boolean;
      submitResult: any,
      statusInfo: any;
      requestInfo: {
        chBusinNm: string; // 변경업종명
        chBusinCd: string; // 변경업종코드
        businNm: string; // 업종명
        businCd: string; // 업종코드
        buildingDownstair: string; // 지하
        buildingUpstair: string; // 지상
        comNm: string; // 상호(기관)
        residentCont: string; // 입주현황
      },
      viewInfo:{
        totalStair: string; //전체 층수
      },
      viewRequestInfo: any;
      description: any;
  };
  constructor(parent:any , minwonCd: string) {
    this.state = {
      minwonCd,
      parent,
      isSubmitSuccessful: false,
      submitResult: {},
      statusInfo: {},
      requestInfo: {
	    	chBusinNm: "",//변경업종명
  	  	chBusinCd: "",//변경업종코드
  	  	businNm: "",//업종명
  	  	businCd: "",//업종코드
  	  	buildingDownstair: "",//지하
  	  	buildingUpstair: "",//지상
  	  	comNm: "",//상호(기관)
  	  	residentCont: ""//입주현황
      },
      viewInfo:{
        totalStair: "" //전체 층수
      },
      viewRequestInfo: {},
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
  			chBusinNm: "가정용",//변경업종명 : '현재업종코드'에 따라 선택 못하게 해야하므로 afterRender에서 값주입
  	  	chBusinCd: "10",//변경업종코드 : '현재업종코드'에 따라 선택 못하게 해야하므로 afterRender에서 값주입
  	  	businNm: "",//업종명
        businCd: "",//업종코드
  	  	buildingDownstair: "0",//지하
  	  	buildingUpstair: "0",//지상
  	  	comNm: "",//상호(기관)
  	  	residentCont: ""//입주현황
      },
      viewInfo:{
        totalStair: "0층" //전체 층수
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
    		
    		businNm : [that.state.requestInfo.businNm, "현재 급수업종"],
    		chBusinNm : [that.state.requestInfo.chBusinNm, "변경 신고 급수업종"],
    		buildingStair : ["지하 "+that.state.requestInfo.buildingDownstair+"층"+" / 지상 "+this.state.requestInfo.buildingUpstair+"층"+" (전체 "+(parseInt(this.state.requestInfo.buildingDownstair)+parseInt(this.state.requestInfo.buildingUpstair))+"층)", "건물 층 수"],
    		comNm : [that.state.requestInfo.comNm, "상호 등"],
    		residentCont : [that.state.requestInfo.residentCont, "입주현황"]
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
    if(parseInt(requestInfo.buildingDownstair) == 0 && parseInt(requestInfo.buildingUpstair) == 0){
      citizenAlert("건물층수를 선택해 주세요.").then(result => {
        if(result){
          $("#buildingDownstair").focus();
        }
      });
    	return false;
    }
    if(requestInfo.residentCont == ""){
      citizenAlert("입주현황을 입력해 주세요.").then(result => {
        if(result){
          $("#residentCont").focus();
        }
      });
    	return false;
    }
    return true;
  }
  //지하,지상 층계산
  handleBuildingStair(e: any) {
	  var buildingDownstair:string|number = parseInt($("#buildingDownstair option:selected").val());
	  var buildingUpstair:string|number = parseInt($("#buildingUpstair option:selected").val());
	  var totalStair:string|number = buildingDownstair + buildingUpstair;
	  if(buildingDownstair == 3 || buildingUpstair == 5)
			totalStair =  totalStair + '층 이상';
		else
			totalStair =  totalStair + '층';
		$('#totalStair').text(totalStair);
		
		this.setState({
		      ...this.state,
		      requestInfo: {
		        ...this.state.requestInfo,
		        buildingDownstair: buildingDownstair, 
		        buildingUpstair: buildingUpstair
		      },
		      viewInfo:{
            totalStair: totalStair
          }
		});      
	
  }
  //상호(기관)명
  handleComNm(e: any) {
	  this.setState({
	      ...this.state,
	      requestInfo: {
	        ...this.state.requestInfo,
	        comNm: fncCutByByte(e.target.value, 100)
	      }
	    });
	    e.target.value = this.state.requestInfo.comNm
	  }
  
  //입주현황
  handleResidentCont(e: any) {
	  this.setState({
	      ...this.state,
	      requestInfo: {
	        ...this.state.requestInfo,
	        residentCont: fncCutByByte(e.target.value, 150)
	      }
	    });
	  e.target.value = this.state.requestInfo.residentCont
  }
  
  //신청 구분에 따른 UI 활성화
  toggleUIGubun(gubun: string, id: string, uiBox: string, gubunNm: string) {
	  
	if(gubun == this.state.requestInfo.businCd){//현재업종과 같은 변경요청 없종 선택 불가
		
		return false;
	}  
	this.setState({
		...this.state,
		requestInfo: {
			...this.state.requestInfo,
			chBusinNm : gubunNm,//변경요청업종코드명
			chBusinCd : gubun//변경요청업종코드
		}
	})
    radioMW(id, uiBox);
  }
  
  // 서비스를 서버로 요청한다.
  submitApplication() {
    const that = this;

    var url = gContextUrl + "/citizen/common/procApplyTyinduChnge.do";
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
        //goFront();
        //that.render();
    });
  }

  getQueryString() {
  	const requestInfo = this.state.requestInfo;
    const EditTyinduChngeObjcData = {
    		chBusinNm: requestInfo.chBusinNm,//변경업종명
    		chBusinCd: requestInfo.chBusinCd,//변경업종코드
    		businNm: requestInfo.businNm,//업종명
    		businCd: requestInfo.businCd,//업종코드
    		buildingDownstair: requestInfo.buildingDownstair,//지하
    		buildingUpstair: requestInfo.buildingUpstair,//지상
    		comNm: requestInfo.comNm,//상호(기관)
    		residentCont: requestInfo.residentCont//입주현황
    }
    
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
      <!-- 상하수도 누수요금 감면 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw23');" class="off" title="닫기">
        <span class="i-01">${that.state.description.minwonNm}</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
	            <li>
		            <label class="input-label-1"><span class="form-req"><span class="sr-only">필수</span>변경 신고 업종을 선택해 주세요.</span></label>
		            <ul class="mw-opt mw-opt-5 row">
			            <li id="aGubun10" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('10', '#aGubun10', '.aGubun', '가정용');"><span>가정용</span></a>
			            </li>
			            <li id="aGubun11" class="aGubun off">
			            	<a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('11', '#aGubun11','.aGubun', '가정용(공동수도)');"><span>가정용(공동수도)</span></a>
			            </li>
			            <li id="aGubun30" class="aGubun off">
			            <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('30', '#aGubun30','.aGubun', '일반용');"><span>일반용</span></a>
			            </li>
			            <li id="aGubun31" class="aGubun off">
			            <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('31', '#aGubun31','.aGubun', '일반용(임시급수)');"><span>일반용(임시급수)</span></a>
			            </li>
			            <li id="aGubun40" class="aGubun off">
			            <a href="javascript:void(0);" onclick="${that.path}.toggleUIGubun('40', '#aGubun40','.aGubun', '욕탕용');" disabled><span>욕탕용</span></a>
			            </li>
		            </ul>
	            </li>
	            <li>
		            <label for="" class="input-label-1" style="display:block;"><span class="form-req"><span class="sr-only">필수</span>건물층수를 선택해 주세요.</span></label>
		            <span>지하</span>
		            <select id="buildingDownstair" name="buildingDownstair" title="선택" class="input-box input-w-sel" onChange="${that.path}.handleBuildingStair(this);">
			            <option value="0">0층</option>
			            <option value="1">1층</option>
			            <option value="2">2층</option>
			            <option value="3">3층이상</option>
		            </select>
		            <span>지상</span>
		            <select id="buildingUpstair" name="buildingUpstair" title="선택" class="input-box input-w-sel" onChange="${that.path}.handleBuildingStair(this);">
			            <option value="0">0층</option>
			            <option value="1">1층</option>
			            <option value="2">2층</option>
			            <option value="3">3층</option>
			            <option value="4">4층</option>
			            <option value="5">5층이상</option>
		            </select>
		            <span class="txt_word1 txt_word1_ml1">전체</span>
		            <span class="txt_word1 txt_word1_ml1" title="전체 층수" id="totalStair">${that.state.viewInfo.totalStair}</span>
	            </li>
	            <li>
	            	<label for="" class="input-label"><span>상호 등</span></label>
	            	<input onkeyup="${that.path}.handleComNm(event)" onchange="${that.path}.handleComNm(event)"
	            	value="${that.state.requestInfo.comNm}"
	            	type="text" id="comNm" name="comNm" class="input-box input-w-2" maxlength="25"/>
	            </li>
	            <li>
	            	<label for="" class="input-label"><span class="form-req"><span class="sr-only">필수</span>입주현황</span></label>
	            	<input onkeyup="${that.path}.handleResidentCont(event)" onchange="${that.path}.handleResidentCont(event)"
	            	value="${that.state.requestInfo.residentCont}"
	            	type="text" id="residentCont" name="residentCont" class="input-box input-w-2" maxlength="37"/>
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
  	const that = this;
  	this.setState({
        ...this.state,
        requestInfo: {
          ...this.state.requestInfo,
          businNm: that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.idtCdSNm,//(현)업종코드명
          businCd: that.state.parent.state.parent.state.currentModule.state.applicationPage.suyongaInfo.state.suyongaInfo.idtCdS//(현)업종코드
        }
      });
  	$("#aGubun"+that.state.requestInfo.businCd).addClass("disable");
  	//
  	if(that.state.requestInfo.businCd == that.state.requestInfo.chBusinCd){
  		if(that.state.requestInfo.businCd == "10"){
  			this.setState({
  		        ...this.state,
  		        requestInfo: {
  		          ...this.state.requestInfo,
  		        chBusinNm: "가정용(공수도)",//(현)업종코드명
  		        chBusinCd: "11",//(현)업종코드명
  		        }
  		      });
  		} else {
  			this.setState({
  		        ...this.state,
  		        requestInfo: {
  		          ...this.state.requestInfo,
  		        chBusinNm: "가정용",//(현)업종코드명
  		        chBusinCd: "10",//(현)업종코드명
  		        }
  		      });
  		}
  	}
  	
  	
  	
  	
  	radioMW('#aGubun'+that.state.requestInfo.chBusinCd,'.aGubun');
  	$("#buildingDownstair").val(that.state.requestInfo.buildingDownstair).prop("selected", true);
  	$("#buildingUpstair").val(that.state.requestInfo.buildingUpstair).prop("selected", true);
  	
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