/**
 *  기본 신청 폼 - 수용가 정보와 신청인 정보를 관리하는 컴포넌트 
 */
import SpotInfo from "../components/SpotInfo";
import ApplicantInfo from "../components/ApplicantInfo";
import { citizenAlert, citizenAlert2, citizenConfirm, phonePattern, mobilePattern, clearObject } from './../util/uiux-common';
import { getPrivacyAgree } from './PrivacyAgree';
declare var $: any;
export default class NoSuyongaApplicationPage {  
  state: {
//    parent: any;
    privacyAgree: boolean,
    smsAgree: boolean
  };
  spotInfo: SpotInfo;
  applicantInfo: ApplicantInfo;
  path: string;

  constructor(private parent: any) {

    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
//      parent,
      privacyAgree: false,
      smsAgree: false
    };
    
    this.spotInfo = new SpotInfo(this);
    this.applicantInfo = new ApplicantInfo(this, false);
    this.path = "cyberMinwon.state.currentModule.state.currentPage";
  }
  
  reset(){
    this.state = {
      // 부모 즉 프로그램 전체를 감싸는 UnityMinwon의 객체를 참조한다.
      privacyAgree: false,
      smsAgree: false
    };
    this.applicantInfo = new ApplicantInfo(this, false);
  }
  
  setState(nextState: any) {
    this.state = nextState;
  }

  getViewInfo() {
    return {
      ...this.spotInfo.getSpotView(),
      ...this.applicantInfo.getApplyView(),
      privacyAgree: {
        title: '개인정보동의',
        privacyAgree: [this.state.privacyAgree ? '예' : '아니오', '개인정보 수집·이용 동의'],
        smsAgree: [this.state.smsAgree ? '예' : '아니오', '민원 진행현황 수신 동의'],
      }
    };
  }
  
  getAddData(){
    return this.applicantInfo.state.addData;
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
  
  // 수용가의 주소를 복사해서 신청인 주소에 입력한다.
  // 신청인 주소와 함께 우편번호도 복사해야 한다.
  // 주의점은 View 주소에는 우편번호와 주소 모두 포함되어야 한다.
  handleCopySpotAddress() {
    if(!this.spotInfo.state.spotInfo.spotAddress){
      citizenAlert('민원발생지 주소를 입력해 주세요.');
      return false;
    }
    const applicantState = this.applicantInfo.state;
    //const viewSourceInfo = this.suyongaInfo.state.viewSuyongaInfo;
    const spotInfo = this.spotInfo.state.spotInfo;
    //const viewDestInfo = this.applicantInfo.state.viewApplyInfo;
    
    let displayAddr = spotInfo.spotAddress ? spotInfo.spotAddress : ""//요약주소(보여주기용)
    displayAddr = spotInfo.spotDetailAddress.trim().length > 0 ? displayAddr + " " + spotInfo.spotDetailAddress : displayAddr;
    
    this.applicantInfo.setState({
      ...applicantState,
      applyInfo: {
        ...applicantState.applyInfo,
        // 신청인 주소에 도로 주소를 복사한다.
        applyAddress: spotInfo.spotAddress,
        applyDetailAddress: spotInfo.spotDetailAddress,
        applyDisplayAddress: displayAddr,
        // 신청인의 우편번호에 수용가 우편번호를 넣는다.
        applyPostNumber: spotInfo.spotPostNumber,
        zipcode: spotInfo.spotPostNumber,
        sido: spotInfo.sido,
        sigungu: spotInfo.sigungu,
        fullDoroAddr: spotInfo.fullDoroAddr,
        umd: spotInfo.umd,//법정동명
        hdongNm: spotInfo.hdongNm,//행정동명
        dong: '',
        doroCd: spotInfo.doroCd,
        doroNm: spotInfo.doroNm,//도로명
        dzipcode: '',
        bupd: spotInfo.bupd,//(수전주소-표준법정동 코드) <-> reqStdBdongCd(청구지수조 - 표준법정동 코드)

        bdMgrNum: '',
        bdBonNum: spotInfo.bdBonNum,//건물본번
        bdBuNum: spotInfo.bdBuNum,//건물부번
        bdnm: spotInfo.bdnm,//건물명
        bdDtNm: spotInfo.bdDtNm,//기타주소
        addr2: spotInfo.addr2,//주소2
        addr1: spotInfo.addr1,//주소1
        bunji: spotInfo.bunji,//본번
        ho: spotInfo.ho,//부번
        extraAdd: spotInfo.extraAdd,//기타주소
        specAddr: spotInfo.specAddr,//건물명
        specDng: spotInfo.specDng,//동
        specHo: spotInfo.specHo,//호
        floors: spotInfo.floors//지하 층 번호
      },
      viewSpotInfo: {
        viewSpotAddress: spotInfo.spotPostNumber+ " " + spotInfo.applyDisplayAddress,
      }
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
    if (!this.spotInfo.verify()) return false;
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
  
  // 신청을 위한 데이터를 수집한다.
  getSuyongaQueryString() {
    //민원발생지 주소정보
    const data = this.spotInfo.state.spotInfo;
    //민원발생지 주소 유형
    let cvplAdresTy = "";
    const minwonCd = this.parent.state.minwonCd;
    if(minwonCd === "A08"){
      cvplAdresTy = "YTRTD";
    }else if(minwonCd === "A09"){
      cvplAdresTy = "ACDNT";
    }else if(minwonCd === "C01"){
      cvplAdresTy = "OCCURR";
    }
    //신청인 정보
    const data1 = this.applicantInfo.state.applyInfo;
    const phoneArr = phonePattern.exec(data1.applyPhone);
    const mobileArr = mobilePattern.exec(data1.applyMobile);
    const applyEmail = data1.applyEmailId + "@" + data1.applyEmailProvider;
    const applyRelation1 = data1.applyRelation1 !== '직접입력' ? data1.applyRelation1 : data1.applyRelation2;
    const recSec = $('#recSec').val() || null
    return {
      // 신청 기본 정보
      'cvplInfo.cvpl.treatSec': '001',
      'cvplInfo.cvpl.recSec': recSec? recSec:'003',
      'cvplInfo.cvpl.mgrNo': '',
      
      // 신청 부가 정보
      'cvplInfo.cvplProcnd.cyberUserKey': $('#userKey').val(),
      'cvplInfo.cvplProcnd.officeYn': 'N',
      'cvplInfo.cvplProcnd.privacyAgree': this.state.privacyAgree ? 'Y' : 'N',
      'cvplInfo.cvplProcnd.smsAllowYn': this.state.smsAgree ? 'Y' : 'N',

      // 수용가 정보
      'cvplInfo.cvplOwner.csOfficeCd': '',
      'cvplInfo.cvplOwner.mblckCd': '',
      'cvplInfo.cvplOwner.mblckCdNm': '',
      'cvplInfo.cvplOwner.sblckCd': '',
      'cvplInfo.cvplOwner.sblckCdNm': '',
      'cvplInfo.cvplOwner.ownerNm': '',
      'cvplInfo.cvplOwner.usrName': '',
      'cvplInfo.cvplOwner.idtCdSNm': '',
      'cvplInfo.cvplOwner.reqKbnNm': '',

      // 수용자 주소 정보
      'cvplInfo.cvplAddr[0].cvplAdresTy': cvplAdresTy,
      'cvplInfo.cvplAddr[0].sido': data.sido,
      'cvplInfo.cvplAddr[0].sigungu': data.sigungu,
      'cvplInfo.cvplAddr[0].umd': data.umd,
      'cvplInfo.cvplAddr[0].hdongNm': data.hdongNm,
      'cvplInfo.cvplAddr[0].dong': data.dong,
      'cvplInfo.cvplAddr[0].doroCd': data.doroCd,
      'cvplInfo.cvplAddr[0].doroNm': data.doroNm,
      'cvplInfo.cvplAddr[0].dzipcode': data.dzipcode,            // 도로우편번호
      'cvplInfo.cvplAddr[0].bupd': data.bupd,
      'cvplInfo.cvplAddr[0].bdMgrNum': data.bdMgrNum,            // 빌딩관리번호
      'cvplInfo.cvplAddr[0].bdBonNum': data.bdBonNum,
      'cvplInfo.cvplAddr[0].bdBuNum': data.bdBuNum,
      'cvplInfo.cvplAddr[0].bdnm': data.bdnm,      // specAddr/csBldNm와 동일 특수주소(건물,아파트명)
      'cvplInfo.cvplAddr[0].bdDtNm': data.bdDtNm,  //extraAdd/csEtcAddr와 동일 특수주소(건물,아파트명) 기타 입력
      'cvplInfo.cvplAddr[0].addr2': data.addr2,
      'cvplInfo.cvplAddr[0].zipcode': data.zipcode,
      'cvplInfo.cvplAddr[0].fullDoroAddr': data.fullDoroAddr,
      'cvplInfo.cvplAddr[0].addr1': data.addr1,
      'cvplInfo.cvplAddr[0].bunji': data.bunji,
      'cvplInfo.cvplAddr[0].ho': data.ho,
      'cvplInfo.cvplAddr[0].extraAdd': data.extraAdd ? data.extraAdd+" "+data.spotDetailAddress : data.spotDetailAddress,
      'cvplInfo.cvplAddr[0].specAddr': data.specAddr,
      'cvplInfo.cvplAddr[0].specDng': data.specDng,
      'cvplInfo.cvplAddr[0].specHo': data.specHo,
      'cvplInfo.cvplAddr[0].floors': data.floors,

      // 신청인 정보
      'cvplInfo.cvpl.applyNm': data1.applyName,  // 신청인 이름
      'cvplInfo.cvplApplcnt.telno1': phoneArr ? phoneArr[1] : '',
      'cvplInfo.cvplApplcnt.telno2': phoneArr ? phoneArr[2] : '',
      'cvplInfo.cvplApplcnt.telno3': phoneArr ? phoneArr[3] : '',
      'cvplInfo.cvplApplcnt.hpno1': mobileArr ? mobileArr[1] : '',
      'cvplInfo.cvplApplcnt.hpno2': mobileArr ? mobileArr[2] : '',
      'cvplInfo.cvplApplcnt.hpno3': mobileArr ? mobileArr[3] : '',
      'cvplInfo.cvplApplcnt.email': applyEmail, //this.state.applicantInfo.state.viewApplyInfo.viewApplyEmail[0],
      'cvplInfo.cvplApplcnt.relation1': data1.applyRelation,
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
      'cvplInfo.cvplAddr[1].fullDoroAddr': data1.fullDoroAddr,                                     
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
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box" id="desc"></div><!-- //mw-box -->    
      <div class="mw-box" id="spot"></div><!-- //mw-box -->
      <!-- 신청인정보 -->
      <div class="mw-box" id="applicant">

      </div><!-- //mw-box -->
  
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
    this.afterRender();
  }

  afterRender() {
    // 안내 절차를 받아온다.
    this.parent.state.steps[this.parent.state.minwonCd].step[1].renderDescription(document.getElementById('desc'));
    this.spotInfo.render();
    this.applicantInfo.render();
  }
}