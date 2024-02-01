/**
 *  기본 신청 폼 - 수용가 정보와 신청인 정보를 관리하는 컴포넌트 
 */
import CyberMinwon from '../infra/CyberMinwon';
import ApplicantInfo from '../components/ApplicantInfo';
import AthenticationInfo from '../components/AuthenticationInfo3';
import { showHideLayer, citizen_alert, citizenAlert, citizenAlert2, lpad, phonePattern, mobilePattern, clearObject } from '../util/uiux-common';
import { fetch } from '../util/unity_resource';
import { getPrivacyAgree } from './PrivacyAgree';
declare var $: any;
declare var cyberMinwon: CyberMinwon;

export default class A13ApplicationPage {
  authenticationInfo3: AthenticationInfo;
  applicantInfo: ApplicantInfo;
  state: any;
  
  constructor(private parent: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
//      parent,
      privacyAgree: false,
      smsAgree: false,
      addData: {
        receiptNo:'',
        receiptList:[]
      },
      path : 'cyberMinwon.state.currentModule.state.currentPage',
      searchInfo: {
        receiptNo: '',
        applyName: '',
        dongName: ''
      },
    };
    this.authenticationInfo3 = new AthenticationInfo(this, this.setAuthInfoToApplicantInfo);
    this.applicantInfo = new ApplicantInfo(this, false);
    
    this.setInitValue();
  }
  
  // 인증 시 호출되는 콜백 함수
  setAuthInfoToApplicantInfo = (authInfo: any) => {
    this.applicantInfo.setState({
      ...this.applicantInfo.state,
      applyInfo: {
        ...this.applicantInfo.state.applyInfo,
        applyName: authInfo.name,
        applyMobile: authInfo.type === 'M' ? authInfo.mobile : ''
      }
    });
    this.applicantInfo.render();
  }
  
  reset(){
    this.state = {
      privacyAgree: false,
      smsAgree: false,
      addData: {
        receiptNo:'',
        receiptList:[]
      },
      path : 'cyberMinwon.state.currentModule.state.currentPage',
      searchInfo: {
        receiptNo: '',
        applyName: '',
        dongName: ''
      },
    };
    this.authenticationInfo3 = new AthenticationInfo(this, this.setAuthInfoToApplicantInfo);
    this.applicantInfo = new ApplicantInfo(this, false);
  }
  
  // 초기값 설정
  setInitValue() {
    const that = this;
    that.setState({
      ...that.state,
      searchInfo: {
        receiptNo: '',   // 수질유형 코드
        applyName: '',   // 수질유형-기타입력
        dongName: ''  // 내용
      }
    });
  }
  
  setState(nextState: any) {
    this.state = nextState;
  }

  
  getViewInfo() {
    return {
      ...this.parent.state.steps['A13'].step[1].getViewInfoApplication(),
      ...this.applicantInfo.getApplyView(),
      privacyAgree: {
        title: '민원 신청 안내 및 동의',
        privacyAgree: [this.state.privacyAgree ? '예' : '아니오', '개인정보 수집·이용 동의'],
        smsAgree: [this.state.smsAgree ? '예' : '아니오', '민원 진행현황 수신 동의'],
      }
    };
  }

  // 개인정보 수집 동의
  handleOnClickForPrivateInfo() {
    this.setState({
      ...this.state,
      privacyAgree: !this.state.privacyAgree
    })
  }
  
  // SMS 수신 동의
  handleOnClickForSmsInfo() {
    const mobileTel = this.applicantInfo.state.applyInfo.applyMobile;
    if(!mobilePattern.test(mobileTel)){
      citizenAlert('민원 진행현황 수신(SMS)에 동의를 선택하시려면 휴대전화 번호를 입력해 주세요.').then(result=>{
        if(result){
          $('#smsAgree').prop('checked',false);
          $('#applyMobile').focus();
        }
      });
      return;
    }
    this.setState({
      ...this.state,
      smsAgree: !this.state.smsAgree
    })
  }
  
  // 신청내역 주소를 복사해서 신청인 주소에 입력한다.
  // 신청인 주소와 함께 우편번호도 복사해야 한다.
  // 주의점은 View 주소에는 우편번호와 주소 모두 포함되어야 한다.
  handleCopyA12Address() {
    if(!$("input:radio[name ='receiptNoRadio']:checked").val()){
      citizenAlert('선택된 신청내역이 없습니다.');
      return false;
    }
    const a12ReceiptNo = $("input:radio[name ='receiptNoRadio']:checked").val();
    const applicantState = this.applicantInfo.state;
    //const suyongaInfo = this.suyongaInfo.state.suyongaInfo;
    
    let a13Info:any;
    
    this.state.addData.receiptList.result1.map((item: any, index: number) => {
        if(item.receiptNo === a12ReceiptNo){
          a13Info = this.state.addData.receiptList.result1[index];
        }
      });
    
 
    let displayAddr = a13Info.fullDoroAddr;
    displayAddr = a13Info.extraAdd.trim().length > 0 ? displayAddr + " " + a13Info.extraAdd : displayAddr;
    
    //let displayAddr = a13Info.suyongaAddress ? a13Info.suyongaAddress : ""//요약주소(보여주기용)
    //displayAddr = suyongaInfo.suyongaDetailAddress.trim().length > 0 ? displayAddr + " " + suyongaInfo.suyongaDetailAddress : displayAddr;
    
    this.applicantInfo.setState({
      ...applicantState,
      applyInfo: {
        ...applicantState.applyInfo,
        applyAddress: a13Info.fullDoroAddr,
        applyDisplayAddress: displayAddr,
        // 신청인의 우편번호에 수용가 우편번호를 넣는다.
        applyPostNumber: a13Info.zipcode,
        zipcode: a13Info.zipcode,
        sido: a13Info.sido,
        sigungu: a13Info.sigungu,
        fullDoroAddr: a13Info.fullDoroAddr,
//        fullDoroAddr: viewSourceInfo.viewDoroJuso[0],
        umd: a13Info.umd,//법정동명
        hdongNm: '',//자바 로직에서 만들어짐
        dong: '',
        doroCd: '',
        doroNm: a13Info.doroNm,//도로명
        dzipcode: '',
        bupd: a13Info.bupd,//(수전주소-표준법정동 코드) <-> reqStdBdongCd(청구지수조 - 표준법정동 코드)

        bdMgrNum: '',
        bdBonNum: a13Info.bdBonNum,//건물본번
        bdBuNum: a13Info.bdBuNum,//건물부번
        bdnm: a13Info.bdnm,//건물명
        bdDtNm: a13Info.bdDtNm,//기타주소
        addr2: a13Info.addr2,//주소2
        addr1: a13Info.addr1,//주소1
        bunji: a13Info.bunji,//본번
        ho: a13Info.ho,//부번
        extraAdd: a13Info.extraAdd,//기타주소
        specAddr: a13Info.specAddr,//건물명
        specDng: a13Info.specDng,//동
        specHo: a13Info.specHo,//호
        floors: a13Info.floors//지하 층 번호
      },
      /*
      viewApplyInfo: {
        //...viewDestInfo,
        applyPostNumber: suyongaInfo.suyongaPostNumber,
        applyAddress: suyongaInfo.suyongaAddress
      }
      */
    });
    this.applicantInfo.setState({
      ...this.applicantInfo.state,
        copySuyongaAddress : true
    })
    this.render();
    if($("#jusosearchapplicant").is(":visible")){
      this.applicantInfo.toggleJusoSearch();
    }
    
  }
  
  //'신청인' 주소 정보가 '수용가주소' 기능으로 입력 됐는데 수용가 주소가 변할 경우 신청인 주소 값 삭제 처리 함수 
  handleChangeFromCopy() {
    this.applicantInfo.setState({
      ...this.applicantInfo.state,
        copySuyongaAddress : false
    })
    const saveKeyArry = ["applyName", "applyPhone", "applyMobile", "applyEmailId", "applyEmailProvider", "applyEmailProviderSelector"];
    saveKeyArry.push("applyRelation", "applyRelation1", "applyRelation2", "applyRelationSelector", "applyRelationSelector1");
    //saveKeyArry.push("sido", "sigungu", "umd");//직접주소 입력 select박스 값을 지우게 되므로 제외
    clearObject(this.applicantInfo.state.applyInfo, saveKeyArry);
  }
  
  verify() {
    if(!this.state.addData.receiptNo){
      citizenAlert("신청내역의 선택된 접수번호가 없습니다.");
      return false;
    }
    if (!this.applicantInfo.verify()) return false;

    if (!this.state.privacyAgree) {
      citizenAlert("개인정보 수집·이용에 동의해 주세요.");
      return false;
    }
    const mobileTel = this.applicantInfo.state.applyInfo.applyMobile;
    if(this.state.smsAgree && !mobileTel && !mobilePattern.test(mobileTel)){
      citizenAlert('민원 진행현황 수신(SMS)에 동의를 선택하시려면 휴대전화 번호를 입력해 주세요.').then(result=>{
        if(result){
          $('#applyMobile').focus();
        }
      });
      return false;
    }

    return true;
  }
  
  getApplyQueryString() {
    //신청인 정보
    const applyInfoData = this.applicantInfo.state.applyInfo;
    const phoneArr = phonePattern.exec(applyInfoData.applyPhone);
    const mobileArr = mobilePattern.exec(applyInfoData.applyMobile);
    const applyEmail = applyInfoData.applyEmailId + "@" + applyInfoData.applyEmailProvider;
    const applyRelation1 = applyInfoData.applyRelation1 !== '직접입력' ? applyInfoData.applyRelation1 : applyInfoData.applyRelation2;
    const recSec = $('#recSec').val() || null
    return {
      // 신청 기본 정보
      'cvplInfo.cvpl.treatSec': '001',
      'cvplInfo.cvpl.recSec': recSec? recSec:'003',
      
      //본인확인
      'authCertResultVO.reqSeq' : this.authenticationInfo3.state.authInfo.data.reqSeq,
      
      // 신청 부가 정보
      'cvplInfo.cvplProcnd.cyberUserKey': $('#userKey').val(),
      'cvplInfo.cvplProcnd.officeYn': 'N',
      'cvplInfo.cvplProcnd.privacyAgree': this.state.privacyAgree ? 'Y' : 'N',
      'cvplInfo.cvplProcnd.smsAllowYn': this.state.smsAgree ? 'Y' : 'N',
      'cvplInfo.cvplProcnd.authYn': 'Y',

      // 신청인 정보
      'cvplInfo.cvpl.applyNm': applyInfoData.applyName,  // 신청인 이름
      'cvplInfo.cvplApplcnt.telno1': phoneArr ? phoneArr[1] : '',
      'cvplInfo.cvplApplcnt.telno2': phoneArr ? phoneArr[2] : '',
      'cvplInfo.cvplApplcnt.telno3': phoneArr ? phoneArr[3] : '',
      'cvplInfo.cvplApplcnt.hpno1': mobileArr ? mobileArr[1] : '',
      'cvplInfo.cvplApplcnt.hpno2': mobileArr ? mobileArr[2] : '',
      'cvplInfo.cvplApplcnt.hpno3': mobileArr ? mobileArr[3] : '',
      'cvplInfo.cvplApplcnt.email': applyEmail, //this.applicantInfo.state.viewApplyInfo.viewApplyEmail[0],
      'cvplInfo.cvplApplcnt.relation1': applyInfoData.applyRelation,
      'cvplInfo.cvplApplcnt.relation2': applyRelation1, // 기존은 사용자/소유자 -> 관계로 설정 / 사용여부 고려 해봐야 => TM_CVPL_APPLCNT table 데이터 필요. 기존대로 변경.

      // 신청인 주소 정보
      'cvplInfo.cvplAddr[1].cvplAdresTy': 'APPLY',
      'cvplInfo.cvplAddr[1].sido': applyInfoData.sido,                                                     
      'cvplInfo.cvplAddr[1].sigungu': applyInfoData.sigungu,                                               
      'cvplInfo.cvplAddr[1].umd': applyInfoData.umd,                                                       
      'cvplInfo.cvplAddr[1].hdongNm': applyInfoData.hdongNm,                                               
      'cvplInfo.cvplAddr[1].dong': applyInfoData.dong,                                                     
      'cvplInfo.cvplAddr[1].doroCd': applyInfoData.doroCd,                                                 
      'cvplInfo.cvplAddr[1].doroNm': applyInfoData.doroNm,                                                 
      'cvplInfo.cvplAddr[1].dzipcode': applyInfoData.dzipcode,            // 도로우편번호                        
      'cvplInfo.cvplAddr[1].bupd': applyInfoData.bupd,                                                     
      'cvplInfo.cvplAddr[1].bdMgrNum': applyInfoData.bdMgrNum,            // 빌딩관리번호                        
      'cvplInfo.cvplAddr[1].bdBonNum': applyInfoData.bdBonNum,                                             
      'cvplInfo.cvplAddr[1].bdBuNum': applyInfoData.bdBuNum,                                               
      'cvplInfo.cvplAddr[1].bdnm': applyInfoData.bdnm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)          
      'cvplInfo.cvplAddr[1].bdDtNm': applyInfoData.bdDtNm,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력   
      'cvplInfo.cvplAddr[1].addr2': applyInfoData.addr2,                                                   
      'cvplInfo.cvplAddr[1].zipcode': applyInfoData.zipcode,                                               
      'cvplInfo.cvplAddr[1].fullDoroAddr': applyInfoData.applyAddress,                                     
      'cvplInfo.cvplAddr[1].addr1': applyInfoData.addr1,                                                   
      'cvplInfo.cvplAddr[1].bunji': applyInfoData.bunji,                                                   
      'cvplInfo.cvplAddr[1].ho': applyInfoData.ho,                                                         
      'cvplInfo.cvplAddr[1].extraAdd': applyInfoData.applyDetailAddress,                                             
      'cvplInfo.cvplAddr[1].specAddr': applyInfoData.specAddr,                                             
      'cvplInfo.cvplAddr[1].specDng': applyInfoData.specDng,                                               
      'cvplInfo.cvplAddr[1].specHo': applyInfoData.specHo,                                                 
      'cvplInfo.cvplAddr[1].floors': applyInfoData.floors
    };
  }
  
  priavcyAgreeLayer() {
    const title = "개인정보 수집 및 이용 안내";
    citizenAlert2(title, getPrivacyAgree(), true).then(result => {
      if(result){
         this.setState({
          ...this.state,
          privacyAgree: true
        })
        $("#ch83").prop("checked", true);
        $(".agreeDetail").focus();
      } else {
        $(".agreeDetail").focus();
        return;
      }
    });
  }

  // 신청인 이름 타이핑 매핑
  handleReceiptNo(e: any) {

    this.setState({
      ...this.state,
      searchInfo: {
        ...this.state.searchInfo,
        receiptNo: e.target.value.substring(0, 13)
      }
    });
    e.target.value = this.state.searchInfo.receiptNo.substring(0, 20);
  }
  
  //접수번호 라디오 선택
  handleReceiptNoRadio(e: any) {
    this.setState({
      ...this.state,
      addData: {
        ...this.state.addData,
        receiptNo : e.target.value.substring(0, 13)
      }
    });
    this.parent.state.steps['A13'].step[1].initSearch = true;
    //더이상 수용가주소 복사 상태가 아님
    if(this.applicantInfo.state.copySuyongaAddress){
        this.handleChangeFromCopy();
      }
  }

  // 신청인 이름 타이핑 매핑
  handleApplyName(e: any) {

    this.setState({
      ...this.state,
      searchInfo: {
        ...this.state.searchInfo,
        applyName: e.target.value.substring(0, 50)
      }
    });
    e.target.value = this.state.searchInfo.applyName.substring(0, 50);
  }

  // 신청인 이름 타이핑 매핑
  handleDongName(e: any) {

    this.setState({
      ...this.state,
      searchInfo: {
        ...this.state.searchInfo,
        dongName: e.target.value.substring(0, 20)
      }
    });
    e.target.value = this.state.searchInfo.dongName.substring(0, 20);
  }

  handleSearchMinwon() {
    const that = this;
    if (!this.state.searchInfo.receiptNo.trim() && !this.state.searchInfo.applyName.trim() && !this.state.searchInfo.dongName.trim()) {
      citizenAlert("검색어를 입력해 주세요");
      return;
    }
    this.state.addData.addreceiptList = [];
    var url = "/citizen/common/nCitizenSearchApplyCtSport.do";
    const queryString = {
      "keyword1": this.state.searchInfo.receiptNo,
      "keyword2": this.state.searchInfo.applyName,
      "keyword3": this.state.searchInfo.dongName
    };
    let formData = new FormData();
    formData.append("keyword1",this.state.searchInfo.receiptNo);
    formData.append("keyword2",this.state.searchInfo.applyName);
    formData.append("keyword3",this.state.searchInfo.dongName);
    
    $(".contents-mw").append('<div class="Modal"></div>');
    $(".Modal").append('<div><h1 style="color: white; font-size: 24px;">조회 중...</h1></div>');
    
    window.fetch(url,{
      method: 'post',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      this.state.addData.receiptNo = "";
      that.handleSetResult(data,"");
      $(".Modal").remove();
    })
    .catch(err => {
      $(".Modal").remove();
      citizenAlert("고객번호와 수용가명을 다시 확인하시고 검색해 주세요.");
    });
    //더이상 수용가주소 복사 상태가 아님
    if(this.applicantInfo.state.copySuyongaAddress){
        this.handleChangeFromCopy();
      }

//    fetch('POST', url, queryString, function (error: any, data: any) {
//      // 에러가 발생한 경우
//      if (error) {
//        alert_msg("고객번호와 수용가명을 다시 확인하시고 검색해 주세요.");
//        return;
//      }
//      console.log("A13 handleSearchMinwon::", data);
//      that.handleSetResult(data);
//      if (data.result1.length === 0) {
//        // 나중에 슬라이드 alert으로 변경
//        alert_msg("데이터 없음 처리. 화면 아래 결과에서 보여주어야 한다.");
//        that.render();
//        return;
//      }
//    });
  }
  
  handleSetResult(data: any,receiptNo:string){
    const that = this;
    this.state.addData.receiptList = data;
    let template = ``;
    
    if(data.result1.length !== 0) {
      template += data.result1.map((item: any, index: number) => {
        let temp = ``;
        let procYn = '';
        if(item.cvplRelProcYn === ''){
          procYn = '신청가능';
        }else if(item.cvplRelProcYn === 'N'){
          procYn = '진행';
        }else if(item.cvplRelProcYn === 'Y'){
          procYn = '완료';
        } 
        if(procYn === '신청가능'){
          
          temp += `
            <div class="searchlist">
              <div class="searchresult-b_5" style="word-break:break-all;">
                  <input type="radio" name="receiptNoRadio" value="${item.receiptNo}"
                  onclick="${that.state.path}.handleReceiptNoRadio(event)"
                  />
              </div>
              <div class="searchresult-b-2" style="word-break:break-all;">
                  ${item.receiptNo}
              </div>
              <div class="searchresult-b-2" style="word-break:break-all;">
                ${item.applyNm}
              </div>
              <div class="searchresult-b-3" style="word-break:break-all;">
                ${item.fullDoroAddr}
              </div>
              <div class="searchresult-b-1" style="word-break:break-all;">
                ${procYn}
              </div>
            </div>
          `;
        }else{
          temp += `
            <div class="searchlist">
              <div class="searchresult-b_5" style="word-break:break-all;">
              </div>
              <div class="searchresult-b-2" style="word-break:break-all;">
                ${item.receiptNo}
              </div>
              <div class="searchresult-b-2" style="word-break:break-all;">
                ${item.applyNm}
              </div>
              <div class="searchresult-b-3" style="word-break:break-all;">
                ${item.fullDoroAddr}
              </div>
              <div class="searchresult-b-1" style="word-break:break-all;">
                ${procYn}
              </div>
            </div>
          `;
        }
        
        return temp;
      }).join(''); 
    } else {
      template += `
        <div class="searchlist">
          <div class="txStrongColor">
            『옥내급수관상담민원』이 없습니다.<br>
            『옥내급수관상담민원』을 먼저 접수, 완료한 이후에<br>
            『옥내급수관공사비지원신청민원』을 신청접수할 수 있습니다.
          </div>
        </div>
      `;
    }
//    document.getElementById('a13ResultDetail')!.innerHTML = template;
//    let a13Result = document.getElementById('a13Result')!
//    a13Result.classList.remove('display-none');
//    a13Result.classList.add('display-block');
//    showHideLayer('#a13Result');
    document.getElementById('a13ResultDetail')!.innerHTML = template;
    this.state.addData.receiptNo = receiptNo;
    if(receiptNo){
      $("input:radio[name ='receiptNoRadio']:input[value='"+receiptNo+"']").attr("checked", true);
    }
//    document.getElementById('a13ResultDetail')!.insertAdjacentHTML('beforeend',template);
//    that.render();
  }
  
  getAddData(){
    return this.state.addData;
  }

  // 화면을 그려주는 부분이다.
  render() {
    const that = this;
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc"></div><!-- //mw-box -->    
  
      <div class="mw-box row">
        <!-- 신청내용 -->
        <div id="form-mw22" class="row">
          <div class="tit-mw-h3">
            <a href="javascript:void(0);" onClick="showHideLayer('#form-mw22');" class="off" title="펼치기">
              <span class="i-01">옥내급수관 진단 상담 신청 조회</span>
            </a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul>
                <li><label for="form-mw01-tx" class="input-label">
                  <span>접수번호</span></label>
                  <input type="text" id="form-mw01-tx" 
                    onkeyup="${that.state.path}.handleReceiptNo(event)"
                    onpaste="${that.state.path}.handleReceiptNo(event)"
                    class="input-box input-w-2" placeholder="접수번호"
                    value="${that.state.searchInfo.receiptNo}">
                 </li>
                <li><label for="form-mw01-tx" class="input-label"></label>
                    <span class="pre-star tip-blue">옥내급수관 진단 상담 민원의 접수번호를 입력해 주세요.</span>
                 </li>
                <li>
                  <label for="form-mw02-tx" class="input-label"><span>신청인성명</span>
                  </label>
                  <input type="text" id="form-mw02-tx" 
                    onkeyup="${that.state.path}.handleApplyName(event)"
                    onpaste="${that.state.path}.handleApplyName(event)"
                    class="input-box input-w-2" placeholder="신청인성명"
                    value="${that.state.searchInfo.applyName}">
                </li>
                <li>
                  <label for="form-mw03-tx" class="input-label"><span>수용가행정(법정)동</span></label>
                  <input type="text" id="form-mw03-tx" 
                    onkeyup="${that.state.path}.handleDongName(event)"
                    onpaste="${that.state.path}.handleDongName(event)"
                    class="input-box input-w-2" placeholder="수용가행정(법정)동"
                    value="${that.state.searchInfo.dongName}">
                </li>
              </ul>
            </div>
          </div><!-- //form-mw22 -->
        </div><!-- //mw-box -->
      </div><!-- //mw-box -->
      <!-- 버튼영역 -->
      <div class="form-btn-wrap row">
        <button type="button" 
          onclick="${that.state.path}.handleSearchMinwon()"
          class="btn btnM btnWL">확인</button>
      </div><!-- //form-btn-wrap -->
      <div class="mw-box row">
        <div id="a13Result" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#a13Result');" title="닫기"><span class="i-01">신청내역</span></a></div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
            <div class="searchtable">
              <div class="header">
                <div class="searchresult-h_5"></div>
                <div class="searchresult-h-2">접수번호</div>
                <div class="searchresult-h-2">신청인</div>
                <div class="searchresult-h-3">수용가주소</div>
                <div class="searchresult-h-1">상태</div>
              </div>
              <div class="body" id="a13ResultDetail">
              </div>
            </div>
            </div>
          </div>
          </div>
        </div>
      </div><!-- //mw-box -->
      <!-- 본인확인 -->      
      <div class="mw-box" id="authentication"></div>
      <!-- 신청인정보 -->
      <div class="mw-box" id="applicant"></div><!-- //mw-box -->
      <!-- 민원 신청 안내 및 동의 -->
      <div class="mw-box">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="닫기">
            <span class="i-53">민원 신청 안내 및 동의</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul class="policy2">
                <li>
                  <label><span class="sr-only">개인정보 수집·이용에 동의합니다</span></label>
                  <input type="checkbox" name="ch83" id="ch83" 
                    onclick="${that.state.path}.handleOnClickForPrivateInfo(event)"
                    ${that.state.privacyAgree ? 'checked' : ''}>
                    <label class="chk-type chk-typeS" for="ch83"><span>개인정보 수집·이용에 동의합니다.<p class="tx-opt">(필수)</p></span></label>
                    <a href="javascript:void(0);" onClick="${that.state.path}.priavcyAgreeLayer()" class="btn btnSS btnTypeC agreeDetail"><span>자세히</span></a>
                    <div class="p-depth-1 bd-gray">
                      <ul>
                        <li class="dot">민원 진행현황은 「민원신청 > 민원처리결과확인」에서 확인하실 수 있습니다.</li>
                        <li class="dot">민원 신청 당시 ① 신청인(이름)과 전화번호(유선전화 또는 휴대전화 번호) 또는 ② 접수번호로 조회합니다.</li>
                        <li class="dot2">기타민원(질의, 건의, 고충) 답변내용 확인은 비밀번호가 필요합니다.</li>
                      </ul>
                    </div>
                    <!--
                    <p class="p-depth-1 bd-gray">
                    민원 진행현황은 「민원신청 > 민원처리결과확인」에서 확인하실 수 있습니다.<br>
                    민원 신청 당시 ① 신청인(이름)과 전화번호(유선전화 또는 휴대전화 번호) 또는 ② 접수번호로 조회합니다.<br>
                       ※ 기타민원(질의, 건의, 고충) 답변내용 확인은 비밀번호가 필요합니다.
                    </p>
                    -->
                    <div id="privacyAgreeInfo" class="display-none form-info-box row">

                    </div>
                </li>
                <li>
                  <label><span class="sr-only">민원 진행현황 수신(SMS)에 동의합니다</span></label>
                  <input type="checkbox" name="smsAgree" id="smsAgree" 
                    onclick="${that.state.path}.handleOnClickForSmsInfo(event)"
                    ${that.state.smsAgree ? 'checked' : ''}>
                    <label class="chk-type smsAgree" for="smsAgree"><span>민원 진행현황 수신(SMS)에 동의합니다.<p class="tx-opt">(선택)</p></span></label>
                    <div class="p-depth-1 bd-gray">
                      <ul>
                        <li class="dot2">카카오톡 알림으로 진행상황을 알려드립니다.</li>
                        <li class="dot2">카카오톡 계정이 없거나 ‘서울특별시 서울아리수본부’ 채널을 차단한 경우 문자로 발송됩니다.</li>
                        <li class="dot2">알림 수신 당시 인터넷에 연결상태에 따라 카카오톡과 문자 발송이 원활하지 않을 수 있습니다.</li>
                        <li class="dot2">자동납부, 전자고지, 문자알림 신청은 동의 여부 상관없이 처리결과 알림이 발송됩니다.</li>
                      </ul>
                    </div>
                    <!--
                    <p class="p-depth-1 bd-gray">
                    ※ 카카오톡 알림으로 진행상황을 알려드립니다.<br>
                    ※ 카카오톡 계정이 없거나 ‘서울특별시 서울아리수본부’ 채널을 차단한 경우 문자로 발송됩니다.<br>
                    ※ 알림 수신 당시 인터넷에 연결상태에 따라 카카오톡과 문자 발송이 원활하지 않을 수 있습니다.<br>
                    ※ 자동납부, 전자고지, 문자알림 신청은 동의 여부 상관없이 처리결과 알림이 발송됩니다.
                    </p>
                    -->
                </li>
              </ul>
            </div>
          </div>
        </div><!-- //form-mw-p -->
      </div><!-- //mw-box -->
    `;

    // 실제로 화면을 붙여준다.
    document.getElementById('minwonRoot')!.innerHTML = template;

    // 후처리를 위한 로직이 수행될 부분들
    this.afterRender();
  }

  afterRender() {
    // 안내 절차를 받아온다.
    this.parent.state.steps[this.parent.state.minwonCd].step[1].renderDescription(document.getElementById('desc'));
    this.authenticationInfo3.render();
    this.applicantInfo.render();
    
    if (this.state.searchInfo.receiptNo.trim() || this.state.searchInfo.applyName.trim() || this.state.searchInfo.dongName.trim()) {
      this.handleSetResult(this.state.addData.receiptList,this.state.addData.receiptNo); //민원 리스트를 불러온다.
    }
  }
}