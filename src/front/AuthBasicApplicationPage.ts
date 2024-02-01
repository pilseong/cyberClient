/**
 *  기본 신청 폼 - 수용가 정보와 신청인 정보를 관리하는 컴포넌트 
 */
import SuyongaInfo from '../components/SuyongaInfo';
import ApplicantInfo from '../components/ApplicantInfo';
import AthenticationInfo from '../components/AuthenticationInfo';
import AthenticationInfo3 from '../components/AuthenticationInfo3';
import { toggleMW, citizenAlert, citizenAlert2, citizenAlert3, serverTime, phonePattern, mobilePattern, clearObject } from './../util/uiux-common';
import { getPrivacyAgree } from './PrivacyAgree';
import UnityMinwonPanel from '../components/UnityMinwonPanel';
import CyberMinwonStorage from '../infra/StorageData';
declare var $: any;
export default class AuthBasicApplicationPage {
  suyongaInfo: SuyongaInfo;
  authenticationInfo: AthenticationInfo;
  authenticationInfo3: AthenticationInfo3;
  applicantInfo: ApplicantInfo;
  state: {
    privacyAgree: boolean,
    smsAgree: boolean
  };
  unityMinwons : any
  path: string;
  noticeCheck: boolean;

  constructor(private parent: any) {
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      privacyAgree: false,
      smsAgree: false
    };
    this.unityMinwons = UnityMinwonPanel;
    this.suyongaInfo = new SuyongaInfo(this);
    this.authenticationInfo = new AthenticationInfo(this, this.setAuthInfoToApplicantInfo);
    this.authenticationInfo3 = new AthenticationInfo3(this, this.setAuthInfoToApplicantInfo);
    this.applicantInfo = new ApplicantInfo(this, false);
    this.path = "cyberMinwon.state.currentModule.state.currentPage";
    this.noticeCheck = false
  }
  
  // 인증 시 호출되는 콜백 함수
  setAuthInfoToApplicantInfo = (authInfo: any) => {
    this.applicantInfo.setState({
      ...this.applicantInfo.state,
      applyInfo: {
        ...this.applicantInfo.state.applyInfo,
        applyName: authInfo.name,
        applyMobile: (authInfo.type === 'M' || authInfo.type === 'yessign' || authInfo.type === 'ezok') ? authInfo.mobile : '',
        applyBirth: authInfo.birth ? authInfo.birth : ''
      }
    });
    this.applicantInfo.render();
  }
  
  reset(){
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      privacyAgree: false,
      smsAgree: false
    };
    this.suyongaInfo = new SuyongaInfo(this);
    this.authenticationInfo = new AthenticationInfo(this, this.setAuthInfoToApplicantInfo);
    this.authenticationInfo3 = new AthenticationInfo3(this, this.setAuthInfoToApplicantInfo);
    this.applicantInfo = new ApplicantInfo(this, false);
//    this.noticeCheck = false
  }

  setState(nextState: any) {
    this.state = nextState;
  }

  getViewInfo() {
    return {
      ...this.suyongaInfo.getSuyongaView(),
      ...this.applicantInfo.getApplyView(),
      privacyAgree: {
        title: '민원 신청 안내 및 동의',
        privacyAgree: [this.state.privacyAgree ? '동의' : '미동의', '개인정보 수집·이용 동의'],
        smsAgree: [this.state.smsAgree ? '동의' : '미동의', '민원 진행현황 수신 동의'],
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
          return false;
        }
      });
      return;
    }else{
      this.setState({
      ...this.state,
      smsAgree: !this.state.smsAgree
    })
    }
    
  }

  // 신청인에 소유자 이름을 복사한다.
  handleCopyOwnerName() {
    const applicantState = this.applicantInfo.state;
    const viewSourceInfo = this.suyongaInfo.state.viewSuyongaInfo;
//    const viewDestInfo = this.applicantInfo.state.viewApplyInfo;

    this.applicantInfo.setState({
      ...applicantState,
      applyInfo: {
        ...applicantState.applyInfo,
        applyName: viewSourceInfo.viewOwnerName[0]
      },
    });

    this.applicantInfo.render();
  }

  // 신청인에 사용자 이름을 복사한다.
  handleCopyUserName() {
    const applicantState = this.applicantInfo.state;
    const viewSourceInfo = this.suyongaInfo.state.viewSuyongaInfo;
//    const viewDestInfo = this.applicantInfo.state.viewApplyInfo;

    this.applicantInfo.setState({
      ...applicantState,
      applyInfo: {
        ...applicantState.applyInfo,
        applyName: viewSourceInfo.viewUserName[0]
      },
    });

    this.applicantInfo.render();
  }

  // 수용가의 주소를 복사해서 신청인 주소에 입력한다.
  // 신청인 주소와 함께 우편번호도 복사해야 한다.
  // 주의점은 View 주소에는 우편번호와 주소 모두 포함되어야 한다.
  handleCopySuyongaAddress() {
    if(!this.suyongaInfo.state.suyongaInfo.suyongaAddress){
      citizenAlert('수용가 주소를 입력해 주세요.');
      return false;
    }
    const applicantState = this.applicantInfo.state;
    //const viewSourceInfo = this.suyongaInfo.state.viewSuyongaInfo;
    const suyongaInfo = this.suyongaInfo.state.suyongaInfo;
    //const viewDestInfo = this.applicantInfo.state.viewApplyInfo;
    
    let displayAddr = suyongaInfo.suyongaAddress ? suyongaInfo.suyongaAddress : ""//요약주소(보여주기용)
    displayAddr = suyongaInfo.suyongaDetailAddress.trim().length > 0 ? displayAddr + " " + suyongaInfo.suyongaDetailAddress : displayAddr;
    //let displayAddr = (suyongaInfo.suyongaAddress && detailAddr)  ? suyongaInfo.suyongaAddress+" "+detailAddr : ""//요약주소(보여주기용)
    

    this.applicantInfo.setState({
      ...applicantState,
      applyInfo: {
        ...applicantState.applyInfo,
        // 신청인 주소에 도로 주소를 복사한다.
        applyAddress: suyongaInfo.suyongaAddress,
        applyDetailAddress: suyongaInfo.suyongaDetailAddress,
        applyDisplayAddress: displayAddr,
        // 신청인의 우편번호에 수용가 우편번호를 넣는다.
        applyPostNumber: suyongaInfo.suyongaPostNumber,
        zipcode: suyongaInfo.suyongaPostNumber,
        sido: suyongaInfo.csSido,
        sigungu: suyongaInfo.csGuCdNm,
        fullDoroAddr: suyongaInfo.suyongaAddress,
        umd: suyongaInfo.csBdongCdNm,//법정동명
        hdongNm: suyongaInfo.csHdongCdNm,//행정동명
        dong: '',
        doroCd: '',
        doroNm: suyongaInfo.csRn,//도로명
        dzipcode: '',
        bupd: suyongaInfo.csStdBdongCd,//(수전주소-표준법정동 코드) <-> reqStdBdongCd(청구지수조 - 표준법정동 코드)
        bdMgrNum: '',
        bdBonNum: suyongaInfo.csBldBon,//건물본번
        bdBuNum: suyongaInfo.csBldBu,//건물부번
        bdnm: suyongaInfo.csBldNm,//건물명
        bdDtNm: suyongaInfo.csEtcAddr,//기타주소
        addr2: suyongaInfo.csAddr2,//주소2
        addr1: suyongaInfo.csAddr1,//주소1
        bunji: suyongaInfo.csBon,//본번
        ho: suyongaInfo.csBu,//부번
        extraAdd: suyongaInfo.csEtcAddr,//기타주소
        specAddr: suyongaInfo.csBldNm,//건물명
        specDng: suyongaInfo.csBldDong,//동
        specHo: suyongaInfo.csBldHo,//호
        floors: suyongaInfo.csUgFloorNo//지하 층 번호
      },
      viewApplyInfo: {
        //...viewDestInfo,
        applyPostNumber: suyongaInfo.suyongaPostNumber,
        applyAddress: suyongaInfo.suyongaAddress
      }
    });
    this.applicantInfo.setState({
      ...this.applicantInfo.state,
        copySuyongaAddress : true
    })
    this.applicantInfo.render();
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
    if (!this.suyongaInfo.verify()) return false;
    if (!this.applicantInfo.verify()) return false;
    
    // 통합민원 다건 선택 시 본인 확인 체크
    const authCheck = $("#authentication").hasClass("display-none");
    if(!authCheck && !this.authenticationInfo.state.isAuthenticated){
      if(this.authenticationInfo3.state.isAuthenticated){
        return true;
      }
      citizenAlert('본인 확인이 필요합니다.');
      return false;
    }

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
  
  //
  getAddData(){
    return this.applicantInfo.state.addData;
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
  
  handleUnityMinwonClick(minwonCd: string, opt: string){
    const that = this;
    const defaultMinwon = that.parent.state.minwonCd;
    if(defaultMinwon === minwonCd){
      return;
    }
    //통합민원 선택 시 처리
    toggleMW(opt);
    that.unityMinwons.setUnityMinwon(minwonCd, !that.unityMinwons.getUnityMinwon(minwonCd));
    if((defaultMinwon === "B04") && that.unityMinwons.authCheck()){
      $("#authentication").removeClass("display-none");
      that.authenticationInfo.render();
    }else if((defaultMinwon === "B04") && !that.unityMinwons.authCheck()){
      $("#authentication").addClass("display-none");
    }
  }

  // 신청을 위한 데이터를 수집한다.
  getSuyongaQueryString() {

    const data = this.suyongaInfo.state.suyongaInfo;
    //신청인 정보
    const data1 = this.applicantInfo.state.applyInfo;
    const phoneArr = phonePattern.exec(data1.applyPhone);
    const mobileArr = mobilePattern.exec(data1.applyMobile);
    const applyEmail = data1.applyEmailId + "@" + data1.applyEmailProvider;
    const applyRelation1 = data1.applyRelation1 !== '직접입력' ? data1.applyRelation1 : data1.applyRelation2;
    
    let cvplAdresTy;
    const minwonCd = this.parent.state.minwonCd;
    if(minwonCd === "I10" && this.parent.state.steps['I10'].step[1].state.minwonGubun === "A10"){
      cvplAdresTy = "TUBE";
    } else {
      cvplAdresTy = "OWNER";//A03,A12,B04,B13,B14,B19,B25
    }
    let authYn = '';
    if(minwonCd === 'A12' || minwonCd === "I10" || minwonCd === 'B13' || minwonCd === 'B19'){
      authYn = 'Y';
    }
    const recSec = $('#recSec').val() || null
    return {
      // 신청 기본 정보
      'cvplInfo.cvpl.treatSec': '001',
      'cvplInfo.cvpl.recSec': recSec? recSec:'003',
      'cvplInfo.cvpl.mgrNo': data.suyongaNumber,
      
      //본인확인
      'authCertResultVO.reqSeq' : this.authenticationInfo3.state.authInfo.data.reqSeq,
      
      // 신청 부가 정보
      'cvplInfo.cvplProcnd.cyberUserKey': $('#userKey').val(),
      'cvplInfo.cvplProcnd.officeYn': 'N',
      'cvplInfo.cvplProcnd.privacyAgree': this.state.privacyAgree ? 'Y' : 'N',
      'cvplInfo.cvplProcnd.smsAllowYn': this.state.smsAgree ? 'Y' : 'N',
      'cvplInfo.cvplProcnd.authYn': authYn,

      // 수용가 정보
      'cvplInfo.cvplOwner.csOfficeCd': data.csOfficeCd,
      'cvplInfo.cvplOwner.mblckCd': data.mblckCd,
      'cvplInfo.cvplOwner.mblckCdNm': data.mblckCdNm,
      'cvplInfo.cvplOwner.sblckCd': data.sblckCd,
      'cvplInfo.cvplOwner.sblckCdNm': data.sblckCdNm,
      'cvplInfo.cvplOwner.ownerNm': data.suyongaName,
      'cvplInfo.cvplOwner.usrName': data.usrName,
      'cvplInfo.cvplOwner.idtCdSNm': data.idtCdSNm,
      'cvplInfo.cvplOwner.reqKbnNm': '',

      // 수용자 주소 정보
      'cvplInfo.cvplAddr[0].cvplAdresTy': cvplAdresTy,
      'cvplInfo.cvplAddr[0].sido': data.csSido,
      'cvplInfo.cvplAddr[0].sigungu': data.csGuCdNm,
      'cvplInfo.cvplAddr[0].umd': data.csBdongCdNm,//법정동명
      'cvplInfo.cvplAddr[0].hdongNm': data.csHdongCdNm,//행정동명
      'cvplInfo.cvplAddr[0].dong': '',
      'cvplInfo.cvplAddr[0].doroCd': '',
      'cvplInfo.cvplAddr[0].doroNm': data.csRn,
      'cvplInfo.cvplAddr[0].dzipcode': '',            // 도로우편번호
      'cvplInfo.cvplAddr[0].bupd': data.csStdBdongCd,
      'cvplInfo.cvplAddr[0].bdMgrNum': '',            // 빌딩관리번호
      'cvplInfo.cvplAddr[0].bdBonNum': data.csBldBon,
      'cvplInfo.cvplAddr[0].bdBuNum': data.csBldBu,
      'cvplInfo.cvplAddr[0].bdnm': data.csBldNm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)
      'cvplInfo.cvplAddr[0].bdDtNm': data.csEtcAddr,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력
      'cvplInfo.cvplAddr[0].addr2': data.csAddr2,
      'cvplInfo.cvplAddr[0].zipcode': data.suyongaPostNumber,
      'cvplInfo.cvplAddr[0].fullDoroAddr': data.suyongaAddress,
      'cvplInfo.cvplAddr[0].addr1': data.csAddr1,
      'cvplInfo.cvplAddr[0].bunji': data.csBon,
      'cvplInfo.cvplAddr[0].ho': data.csBu,
      'cvplInfo.cvplAddr[0].extraAdd': data.suyongaDetailAddress,
      'cvplInfo.cvplAddr[0].specAddr': data.csBldNm,
      'cvplInfo.cvplAddr[0].specDng': data.csBldDong,
      'cvplInfo.cvplAddr[0].specHo': data.csBldHo,
      'cvplInfo.cvplAddr[0].floors': data.csUgFloorNo,

      // 신청인 정보
      'cvplInfo.cvpl.applyNm': this.applicantInfo.state.applyInfo.applyName,  // 신청인 이름
      'cvplInfo.cvplApplcnt.telno1': phoneArr ? phoneArr[1] : '',
      'cvplInfo.cvplApplcnt.telno2': phoneArr ? phoneArr[2] : '',
      'cvplInfo.cvplApplcnt.telno3': phoneArr ? phoneArr[3] : '',
      'cvplInfo.cvplApplcnt.hpno1': mobileArr ? mobileArr[1] : '',
      'cvplInfo.cvplApplcnt.hpno2': mobileArr ? mobileArr[2] : '',
      'cvplInfo.cvplApplcnt.hpno3': mobileArr ? mobileArr[3] : '',
      'cvplInfo.cvplApplcnt.email': applyEmail, //this.applicantInfo.state.viewApplyInfo.viewApplyEmail[0],
      'cvplInfo.cvplApplcnt.relation1': this.applicantInfo.state.applyInfo.applyRelation,
      'cvplInfo.cvplApplcnt.relation2': applyRelation1, // 기존은 사용자/소유자 -> 관계로 설정 / 사용여부 고려 해봐야 => TM_CVPL_APPLCNT table 데이터 필요. 기존대로 변경.

      // 신청인 주소 정보
      'cvplInfo.cvplAddr[1].cvplAdresTy': 'APPLY',
      'cvplInfo.cvplAddr[1].sido': data1.sido,                                                     
      'cvplInfo.cvplAddr[1].sigungu': data1.sigungu,                                               
      'cvplInfo.cvplAddr[1].umd': data1.umd,                                                       
      'cvplInfo.cvplAddr[1].hdongNm': data1.hdongNm,                                               
      'cvplInfo.cvplAddr[1].dong': data1.dong,                                                     
      'cvplInfo.cvplAddr[1].doroCd': data1.doroCd,                                                 
      'cvplInfo.cvplAddr[1].doroNm': data1.doroNm,                                                 
      'cvplInfo.cvplAddr[1].dzipcode': data1.dzipcode,            // 도로우편번호                        
      'cvplInfo.cvplAddr[1].bupd': data1.bupd,                                                     
      'cvplInfo.cvplAddr[1].bdMgrNum': data1.bdMgrNum,            // 빌딩관리번호                        
      'cvplInfo.cvplAddr[1].bdBonNum': data1.bdBonNum,                                             
      'cvplInfo.cvplAddr[1].bdBuNum': data1.bdBuNum,                                               
      'cvplInfo.cvplAddr[1].bdnm': data1.bdnm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)          
      'cvplInfo.cvplAddr[1].bdDtNm': data1.bdDtNm,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력   
      'cvplInfo.cvplAddr[1].addr2': data1.addr2,                                                   
      'cvplInfo.cvplAddr[1].zipcode': data1.zipcode,                                               
      'cvplInfo.cvplAddr[1].fullDoroAddr': data1.applyAddress,                                     
      'cvplInfo.cvplAddr[1].addr1': data1.addr1,                                                   
      'cvplInfo.cvplAddr[1].bunji': data1.bunji,                                                   
      'cvplInfo.cvplAddr[1].ho': data1.ho,                                                         
      'cvplInfo.cvplAddr[1].extraAdd': data1.applyDetailAddress,                                             
      'cvplInfo.cvplAddr[1].specAddr': data1.specAddr,                                             
      'cvplInfo.cvplAddr[1].specDng': data1.specDng,                                               
      'cvplInfo.cvplAddr[1].specHo': data1.specHo,                                                 
      'cvplInfo.cvplAddr[1].floors': data1.floors
    };
  }

  // 화면을 그려주는 부분이다.
  render() {
    const that = this;
    const minwonCd = that.parent.state.minwonCd;
    const userIp = $("#userIp").val();
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc"></div><!-- //mw-box -->
    `;
    template += `
      <div class="mw-box info" id="suyonga"></div><!-- //mw-box -->
    `;
    if(minwonCd !== "B04" && minwonCd !== "B14" && minwonCd !== "B14_1"  && minwonCd !== "B25"){
      template += `
        <!-- 본인확인 -->      
        <div class="mw-box" id="authentication"></div>
      `;
    }else{
      template += `
        <!-- 본인확인 -->      
        <div class="mw-box display-none" id="authentication"></div>
      `;
    }
    template += `
    
      <!-- 신청인정보 -->
      <div class="mw-box" id="applicant"></div><!-- //mw-box -->
  
      <!-- 민원 신청 안내 및 동의 -->
      <div class="mw-box">
        <div id="form-mw-p" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="toggleLayer('#form-mw-p');" title="펼치기">
            <span class="i-53">민원 신청 안내 및 동의</span></a>
          </div>
          <div class="form-mw-box display-block row">
            <div class="form-mv row">
              <ul class="policy2">
                <li>
                  <label><span class="sr-only">개인정보 수집·이용에 동의합니다</span></label>
                  <input type="checkbox" name="ch83" id="ch83" 
                    onclick="${that.path}.handleOnClickForPrivateInfo(event)"
                    ${that.state.privacyAgree ? 'checked' : ''}>
                    <label class="chk-type chk-typeS" for="ch83"><span>개인정보 수집·이용에 동의합니다.<p class="tx-opt">(필수)</p></span></label>
                    <a href="javascript:void(0);" onClick="${that.path}.priavcyAgreeLayer()" class="btn btnSS btnTypeC agreeDetail"><span>자세히</span></a>
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
                    onclick="${that.path}.handleOnClickForSmsInfo(event)"
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
    document.getElementById('privacyAgreeInfo')!.innerHTML = getPrivacyAgree();
    // 후처리를 위한 로직이 수행될 부분들
    that.afterRender();
  }

  afterRender() {
    // 안내 절차를 받아온다.
    const minwonCd = this.parent.state.minwonCd;
    this.parent.state.steps[this.parent.state.minwonCd].step[1].renderDescription(document.getElementById('desc'));
//    if(minwonCd === "B04" || minwonCd === 'B14' ||minwonCd === 'B19' || minwonCd === 'B25'){
//      if(minwonCd === "B04") addMW("#dGubun1");
//      if(minwonCd === "B14") addMW("#dGubun2");
//      if(minwonCd === "B19") addMW("#dGubun3");
//      if(minwonCd === "B25") addMW("#dGubun4");
//    }
    this.suyongaInfo.render();
//    if(minwonCd === "B14"){
//      this.authenticationInfo.render();
//    }else 
    if(minwonCd !== "B04" && minwonCd !== "B14" && minwonCd !== "B14_1" && minwonCd !== "B25"){
      this.authenticationInfo3.render();
    }
    this.applicantInfo.render();
    if(minwonCd === 'B14'){
      const serverTimeCall = serverTime()
      serverTimeCall.then(val => {
        console.log(`serverTime ::${val}`)
        //real 20240126180000 20240127060000
        //test 20240125100000 20240125170000
        if(!this.noticeCheck && val >= '20240126180000' && val <= '20240127060000'){
          this.showNotice()
        }
      })
    }
  }
  
  showNotice(){
//    const title = `자동납부 전자서명 간편인증 서비스 일시 중단 안내`
    let noticeMsg = `
      <div style="text-align:center;"><span class="txStrong" style="font-size:16px; text-decoration: underline;">간편인증 서비스 일시 중단 안내</span></div>
      <p class="txBlue txStrong" style="text-align:justify;">- 중단일시 : 2024.1.26.(금) 22:00 ~ 1.27.(토) 06:00</p><br>
      <p style="text-align:justify;">간편인증 시스템 개선 작업으로 서비스가 일시 중단 되오니,<br>해당 시간동안은 다른 인증수단을 이용해 주시기 바랍니다.<br>이용에 불편을 드려 죄송합니다.</p>
    `
//    const UserAgent = navigator.userAgent;
//    if(UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null 
//                || UserAgent.match(/LG|SAMSUNG|Samsung/) != null){ //모바일인 경우
//      noticeMsg += `<p class="bd-gray">해당 기간 금융인증서로만 전자서명이 가능하오니 자동납부 신청/해지시 참고 바랍니다.</p>`
//    }else{
//      noticeMsg += `<p class="bd-gray">해당 기간 금융인증서 및 공동인증서로만 전자서명이 가능하오니 자동납부 신청/해지시 참고 바랍니다.</p>`
//    }
    citizenAlert3(noticeMsg).then(result => {
      if(result){
        this.noticeCheck = true
        console.log(`notice end`)
      }else{
        return;
      }
    });
//    citizenAlert2(title, noticeMsg, true).then(result => {
//      if(result){
//        console.log(`notice end`)
//      }else{
//        return;
//      }
//    });
  }
}