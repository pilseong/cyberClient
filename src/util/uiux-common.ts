import { fetch } from "../util/unity_resource";
declare var document: any;
declare var $: any;
declare var gVariables: any;
declare var fncTrim: (str: string) => string;
declare var checkDuplicateMinwon: (body: any) => string;
var timeWorker: any;

export const phonePattern = /^(050[0-9]{1}|01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/;
export const mobilePattern = /^(01[016789]{1})(\d{3,4})(\d{4})$/;
export const enNumPassWordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,12}$/; //영문, 숫자를 포함하는 4~12자리 비밀번호
export const emailPattern = /^([\w\.\_\-])*[a-zA-Z0-9]+([\w\.\_\-])*([a-zA-Z0-9])+([\w\.\_\-])+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/i;
export const emailProviderPattern = /^([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/i;

//사업소 정보
export const saupsoInfo = [
      {saupsoCd:'091',shortName:'중부',fullName:'중부수도사업소',region:'종로구, 중구, 용산구, 성북구',telNo:'02-3146-2000'},
      {saupsoCd:'093',shortName:'동부',fullName:'동부수도사업소',region:'성동구, 동대문구, 중랑구, 광진구',telNo:'02-3146-2600'},
      {saupsoCd:'095',shortName:'북부',fullName:'북부수도사업소',region:'도봉구, 노원구, 강북구',telNo:'02-3146-3200'},
      {saupsoCd:'096',shortName:'서부',fullName:'서부수도사업소',region:'은평구, 마포구, 서대문구',telNo:'02-3146-3500'},
      {saupsoCd:'097',shortName:'강서',fullName:'강서수도사업소',region:'양천구, 강서구, 구로구',telNo:'02-3146-3800'},
      {saupsoCd:'099',shortName:'남부',fullName:'남부수도사업소',region:'동작구, 관악구, 영등포구, 금천구',telNo:'02-3146-4400'},
      {saupsoCd:'100',shortName:'강남',fullName:'강남수도사업소',region:'강남구, 서초구',telNo:'02-3146-4700'},
      {saupsoCd:'101',shortName:'강동',fullName:'강동수도사업소',region:'송파구, 강동구',telNo:'02-3146-5000'},
    ];
//Layer는 DIV를 display none으로 설정
//MW는 해당 버튼의 활성화 비활성화 설정
//레이어 표시/숨기기
export function showHideLayer(layer: string) {
  if ($(layer + ">.form-mw-box").hasClass("display-block")) {
    hideLayer(layer);
  } else {
    showLayer(layer);
  }
}

export function toggleLayer(layer: string) {
  if ($(layer + ">.form-mw-box").hasClass("display-block")) {
    hideLayer(layer);
  } else {
    showLayer(layer);
  }
}

export function showLayer(layer: string) {
  $(layer + ">.form-mw-box").addClass("display-block");
  $(layer + ">.form-mw-box").removeClass("display-none");
  $(layer + ">.tit-mw-h3>a").removeClass("on");
  $(layer + ">.tit-mw-h3>a").addClass("off");
  $(layer + ">.tit-mw-h3>a").attr('title', '닫기');
}

export function hideLayer(layer: string) {
  $(layer + ">.form-mw-box").addClass("display-none");
  $(layer + ">.form-mw-box").removeClass("display-block");
  $(layer + ">.tit-mw-h3>a").removeClass("off");
  $(layer + ">.tit-mw-h3>a").addClass("on");
  $(layer + ">.tit-mw-h3>a").attr('title', '펼치기');
}

//옵션선택 표시/숨기기
export function setGubunMulti(opt: string, layer: string) {
  if ($(opt).hasClass("on")) {
    hideGubunMulti(opt, layer);
  } else {
    showGubunMulti(opt, layer);
  }
}

export function hideGubunMulti(opt: string, layer: string) {
  $(layer).addClass("display-none");
  $(layer).removeClass("display-block");
  $(opt).removeClass("on");
  $(opt).addClass("off");
  $(opt).attr('title', '');
}

export function showGubunMulti(opt: string, layer: string) {
  $(layer).removeClass("display-none");
  $(layer).addClass("display-block");
  $(opt).removeClass("off");
  $(opt).addClass("on");
  $(opt).attr('title', '선택됨');
}


export function toggleMW(opt: string) {
  if ($(opt).hasClass("on")) {
    removeMW(opt);
  } else {
    addMW(opt);
  }
}

export function addMW(opt: string) {
  //		$(gubun).removeClass("on");
  //		$(gubun).addClass("off");
  //		$(gubun).attr( 'title', '' );
  $(opt).addClass("on");
  $(opt).removeClass("off");
  $(opt).attr('title', '선택됨');
}

export function removeMW(opt: string) {
  //   $(gubun).removeClass("on");
  //   $(gubun).addClass("off");
  //   $(gubun).attr( 'title', '' );
  $(opt).addClass("off");
  $(opt).removeClass("on");
  $(opt).removeAttr('title');
}

export function disableMW(opt: string) {
  $(opt).addClass("disable");
  $(opt).removeClass("off");
  $(opt).removeClass("on");
  $(opt).removeAttr('title');
}

//라디오 버튼 class 관리
export function radioMW(opt: string, gubun: string) {
  $(gubun).removeClass("on");
  $(gubun).addClass("off");
  $(gubun).attr('title', '');
  $(opt).addClass("on");
  $(opt).removeClass("off");
  $(opt).attr('title', '선택됨');
}

//약관/설명 표시/숨기기
export function showHideInfo(layer: string) {
  if ($(layer).hasClass("display-block")) {
    $(layer).addClass("display-none");
    $(layer).removeClass("display-block");
    $(layer).closest(".btnTypeC").attr('title', '닫기');
    if(layer.indexOf("AgreeInfo") !== -1){
      $(layer).siblings("a").children().text("자세히")
    }
  } else {
    $(layer).addClass("display-block");
    $(layer).removeClass("display-none");
    $(layer).closest("a").attr('title', '보기');
    if(layer.indexOf("AgreeInfo") !== -1){
      $(layer).siblings("a").children().text("자세히")
    }
  }
}

//약관/설명 표시/숨기기
export function showHideInfo2(layer: string, e:any) {
  if ($(layer).hasClass("display-block")) {
    $(layer).addClass("display-none");
    $(layer).removeClass("display-block");
    e.target.innerText = "보기";
    //$(layer).closest(".btnTypeC").next().text('보기');
    
  } else {
    $(layer).addClass("display-block");
    $(layer).removeClass("display-none");
    e.target.innerText = "닫기";
    //$(layer).closest("a").next().text('닫기');
  }
}

// 핸드폰 번호에 대한 화면 검증
export function phoneNumberInputValidation(target: any, length: number, pattern: any) {
  if (!pattern.test(target.value.replace(/[^0-9]/g,"").substring(0, length))) {
    target.classList.remove('success')
    target.classList.add('err')
  } else {
    target.classList.remove('err')
    target.classList.add('success')
  }
}
//필수 값이 아닌 전화번호를 다 지웠을 경우에 성공/실패 클래스 제거 용도의 함수
export function phoneNumberInputValidationRemove(target: any) {
    target.classList.remove('success', 'err');
}

export function hideElement(ele: string) {
  $(ele).addClass("display-none");
  $(ele).removeClass("display-block");
  $(ele).closest(".btnTypeC").attr('title', '닫기');
}

export function showElement(ele: string) {
  $(ele).addClass("display-block");
  $(ele).removeClass("display-none");
  $(ele).closest("a").attr('title', '보기');
}

/**
 * 업로드 이미지파일 확장자 체크.
 */
export function fncCheckImgFileExt(fileName: any, fileObj: any) {
  var ext = fileName.val().split(".").pop().toLowerCase();
  if ($.inArray(ext, gVariables['imgFileUploadPosible']) < 0) {
    citizenAlert("업로드가 제한된 파일입니다. 확장자를 체크해 주세요.\n[업로드 가능 파일 : " + gVariables['imgFileUploadPosible'].toString() + " ]");
    //		$("#"+id).focus();
    return false;
  }

  //	if(undefined != ("#"+id)[0].files){
  //		var fileSize = $("#"+id)[0].files[0].size;
  //		var maxSize = gVariables['fileUploadSize'] * 1024 *1024;
  //		if (fileSize > maxSize){
  //			citizenAlert("파일용량 " + gVariables['fileUploadSize'] + "MB를 초과하였습니다.");
  //			$("#"+id).focus();
  //			return false;
  //		}
  //	}
  //	return true;
}

export function pwInputValValidation(inputPw: string, target: any){
  let pwFmt = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-z0-9])(?!.*\s).{4,12}$/;
  if(pwFmt.test(inputPw)){
    target.classList.remove('err');
    target.classList.add('success');
    return true;
  }else{
    target.classList.remove('success');
    target.classList.add('err');
    return false;
  }
}

export function birthdayInputValidation(target: any, length: number){
  const birthdayPattern6 = /([0-9]{2}(0[1-9]|1[0-2])(0[1-9]|[1,2][0-9]|3[0,1]))/g
  const birthdayPattern8 = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/g
  if(length == 6){
    if(birthdayPattern6.test(target.value)){
      target.classList.remove('err');
      target.classList.add('success');
      return true;
    }else{
      target.classList.remove('success');
      target.classList.add('err');
      return false;
    }
  }else{
    if(birthdayPattern8.test(target.value)){
      target.classList.remove('err');
      target.classList.add('success');
      return true;
    }else{
      target.classList.remove('success');
      target.classList.add('err');
      return false;
    }
  }
}

async function checkDupMinwon(minwonCd: string, mkey: string){
  let url = "";
  let resultYn = "N";
//  if(minwonCd === "B04"){
//    url = "/basic/checkDuplicateMinwonUnity.do";
//  }else 
  if(minwonCd !== "A07" && minwonCd !== "A12"){
    url = "/basic/checkDuplicateMinwon.do";
  }
  let formData = new FormData();
  formData.append("mgrNo",mkey);
  formData.append("minwonCd",minwonCd);
  try{
    
    let res = await window.fetch(url,{
      method: 'post',
      body: formData
    });
    let data = await res.json();
    if(data){
      resultYn = "Y";
    }else{
      resultYn = "N";
    }
    return resultYn;
  }catch(err){
    citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
    return resultYn;
  }
  
}

export function checkDuplicate(mgrNo:string, minwonCd:string){
  let url = "/basic/checkDuplicateMinwon.do";
  let queryString = "mgrNo=" + mgrNo + "&minwonCd=" + minwonCd;
  fetch('GET', url, queryString, function (error: any, data: any) {
    // 에러가 발생한 경우
    if (error) {
      citizenAlert("서버가 응답하지 않습니다. 잠시 후 다시 조회해 주세요.");
      $("#suyongaSearch").prop('disabled', false);
      return;
    }

    if (data > 0) {
      citizenAlert('동일 수용가로 처리 중인 민원이 있습니다. 수용가(고객번호)를 확인해 주세요.');
      $("#owner_mkey").focus();
      $("#suyongaSearch").prop('disabled', false);
      return false;
    }else{
      return true;
    }
  });
}

export function applyMinwonCheck(minwonCd: string, suyongaInfo: any) {
  
  //A05 가정용 외 신청 금지
  if(minwonCd === "A05" && suyongaInfo.idtCdSNm !== "가정용(10)"){
    citizenAlert("가정용(업종) 수용가가 아닙니다.<br />2014. 5. 7. 이후<br />가정용 수용가만<br />옥내 누수진단 신청이 가능합니다.");
    return false;
  }
  //임시 급수 확인 B04
  if(minwonCd === "B04"){
    
    if(suyongaInfo.idtcCds === "31"){
      citizenAlert("임시급수 수용가입니다.\n사용자(소유자)명의변경 신청시 요금과 동 담당에게 문의 바랍니다.");
      return false;
    }
  }
  //폐전 여부 확인 tapStatusCd 04 ugStatusCd 4
  if(minwonCd !== "B03"){
    if(suyongaInfo.tapStatusCd === "04"){
      citizenAlert('급수설비 폐지 수용가로 민원을 신청할 수 없습니다. 수용가(고객번호)를 다시 확인해 주세요.');
      return false;
    }else if(suyongaInfo.ugStatusCd === "4"){
      citizenAlert('급수설비 폐지 수용가로 민원을 신청할 수 없습니다. 수용가(고객번호)를 다시 확인해 주세요.');
      return false;
    }
  }
  //급수설비 폐지 신청 B05
  //정수처분 tapStatusCd 02, 급수중지 상태 tapStatusCd 03 확인
  if(minwonCd === "B05"){
    if(suyongaInfo.tapStatusCd === "02" || suyongaInfo.tapStatusCd === "03"){
      citizenAlert("정수처분 중 이거나 급수중지 상태의 수용가이므로 폐전 처리 할 수 없습니다.");
      return false;
    }
  //지하수 수전수 csJCnt > 0  지하수 포함 수전 tapStatusCd 01 지하수 수용가 tapStatusCd 빈 값
    if(parseInt(suyongaInfo.csJCnt) > 0){
      citizenAlert("지하수와 함께 있는 수용가는 지하수를 분리 후 처리하시기 바랍니다.");
      return false;
    }else if(suyongaInfo.tapStatusCd == ""){
      citizenAlert("지하수 수용가입니다. 자치구에 신청하도록 안내 바랍니다.");
      return false;
    }
  }
  
  //수도계량기 교체 A02
  //지하수 수전 csJCnt == 1 csApthouseCd == 8, csJCnt >= 1 && csApthouseCd != "8"
  if(minwonCd === "A02"){
    
    if(suyongaInfo.csJCnt === "1" && suyongaInfo.csApthouseCd === "8"){
      citizenAlert("지하수 계량기는 수도계량기교체 신청을 할 수 없습니다.");
      return false;
    }
    //2023.05.19. 지하수 포함 상수도 수도계량기는 교체 허용으로 주석 처리
//    else if(parseInt(suyongaInfo.csJCnt) >= 1 && suyongaInfo.csApthouseCd !== "8"){
//      citizenAlert("해당 수용가는 지하수 계량기를 포함하고 있습니다.<br> 교체하려는 계량기가 지하수 계량기인 경우에는 처리불가하오니 민원인께 해당 구청에 신청하시도록 안내하여 주시기 바랍니다.");
//      return false;
//    }
  }
  
  //2023.08.23. 자동납부 카드납부의 경우 해지 불가
  if(minwonCd === "B14"){
    if(suyongaInfo.autoPayFlag === "Y" && suyongaInfo.insttSe === "02"){
      citizenAlert("입력하신 고객번호는 카드 자동납부 신청되어 있어, 해지처리가 불가능합니다.<br><br>카드 자동납부 해지는 서울시지방세납부시스템(ETAX)에서 회원가입 후 공인인증서로 로그인 후 신청하실 수 있습니다.")
      return false;
    }
  }
  
  return true;
}

export function popPayWin(mgrNo: string){
  
  if(mgrNo === "" || mgrNo === undefined){
    citizenAlert("고객번호를 입력해 주세요.");
    return false;
  }
  let url = "/citizen/common/searchProofPaymentPopup.do?mgrNo=" + mgrNo;
  let popupX = (window.screen.width /2) - (790/2);
  let popupY = (window.screen.height /2) - (280/2);
  window.open(url, "체납확인", "width=790,height=280, top="+popupY+", left="+popupX+", toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no");
}

//납부확인 팝업
export function popPaymentCheck(){
  if($("input:checkbox[name=payMentEqpCheck]").is(":checked")) {
    var url = "/citizen/common/paymentEqpCheckPopup.do";
    var popupX = (window.screen.width /2) - (400/2);
    var popupY = (window.screen.height /2) - (520/2);
    window.open(url,"납부확인","width=400,height=520, top="+popupY+", left="+popupX+",toolbar=no,location=0,directories=0,status=0,menubar=0,scrollbars=yes,resizable=1");
  }
  else {
    $("#chargeFlag").val("");
    $("#bankCd").val("");
    $("#bankNm").val("");
    $("#bankBranch").val("");
    $("#paidDt").val("");
    $("#paidAmount").val("");
  }
}

export const submitOnce = (fn: Function) => {
  let oneClick = false;
  return (...args: any) => {
    if(!oneClick){
      oneClick = true;
      fn(...args)
    }
  }
}

export function fncFileDownload(ord : number){
  location.href = "getFileDownload.do?ord="+ord;
}

function modalTemplate(message: string, type: string){
  let template = ``;
  if(type === "alert"){
    template += `
      <div id="dialogoverlay"></div>
      <div id="dialogbox" class="slit-in-vertical">
        <div>
          <div id="dialogboxbody">${message}</div>
          <input id="alertOk" type="button" value="확인" />
        </div>
      </div>
    `;
  }else{
    template += `
      <div class="confirm">
      <div></div>
      <div>
        <div id="confirmMessage">${message}</div>
        <div>
          <a href="javascript:void(0);" id="confirmYes" class="btn btnSS btnTypeB"><span>예</span></a>
          <a href="javascript:void(0);" id="confirmNo" class="btn btnSS btnTypeC"><span>아니요</span></a>
        </div>
      </div>
      </div>
    `;
  }
  return template;
}

export const createConfirm = (message: string) => {
  return new Promise((resolve, reject) => {
//    document.getElementById('app').insertAdjacentHTML('beforeend', modalTemplate(message, 'confirm'));
    $('#confirmMessage').html(message);
    $('#confirmYes').off('click');
    $('#confirmNo').off('click');
    $('#confirmYes').on('click', ()=> { $('.confirm').hide(); resolve(true); });
    $('#confirmNo').on('click', ()=> { $('.confirm').hide(); resolve(false); });
    $('#confirmMessageBox').on('keydown', (e:any)=> { 
//      console.log(`code::${e.code}||key::${e.key}`)
      if(e.key === "Escape"){
        $('.confirm').hide(); 
        resolve(false);
      }else if(e.key === "Tab"){
        
        e.preventDefault();
        const id = $(':focus').attr('id')
        if(id === "confirmYes"){ $('#confirmNo').focus();}
        else{$('#confirmYes').focus();}
      }
    });
    $('#confirmYes').on('keyup', (e:any)=> { 
      if(e.key === "Enter" || e.key === "Space"){
        
        $('.confirm').hide(); 
        resolve(true); 
      }
    });
    $('#confirmNo').on('keyup', (e:any)=> { 
      if(e.key === "Enter" || e.key === "Space" || e.key === "Escape"){
        
        $('.confirm').hide(); 
        resolve(false); 
      }
    });
    var offset = $(document).scrollTop();
    var viewportHeight = $(window).height();
    var $customConfirm = $('.confirm > div:last-of-type');
    $customConfirm.css('top', (offset + (viewportHeight/2)) - ($customConfirm.outerHeight()/2));
    $('.confirm').show();
    $('#confirmYes').focus();
  });
};

export const createAlert = (message: string) => {
  return new Promise((resolve, reject) => {
//    document.getElementById('app').insertAdjacentHTML('beforeend', modalTemplate(message, 'alert'));
    $('#alertMessage').html(message);
    $('#alertOk').off('click');
    $('#alertOk').on('click', ()=> { $('.alert').hide(); resolve(true); });
    var enterCnt = 0;
    $('#alertMessageBox').on('keydown', (e:any)=> { 
//      console.log(`code::${e.code}||key::${e.key}`)
//      console.log(`enterCnt::${enterCnt}`)
      if(e.key === "Escape"){
        $('.alert').hide(); 
        resolve(true);
      }else{
        e.preventDefault();
        $('#alertOk').focus();
      }
    });
    $('#alertOk').on('keyup', (e:any)=> { 
      
      if(e.key === "Enter"){
        enterCnt++; 
//        console.log(`enterCnt::${enterCnt}`)
      }
      if(e.key === "Enter" && enterCnt > 1){
//        console.log(`enterCnt::${enterCnt}`)
        e.preventDefault();
        $('.alert').hide(); 
        resolve(true);
      }
    });
    var offset = $(document).scrollTop();
    var viewportHeight = $(window).height();
    var $customAlert = $('.alert > div:last-of-type');
    $customAlert.css('top', (offset + (viewportHeight/2)) - ($customAlert.outerHeight()/2));
    $('.alert').show();
    $('#alertOk').focus();
    //enterCnt++;
  });
}

export const createAlert2 = (title: string, message: string, agreeBtnYn?:boolean) => {
  return new Promise((resolve, reject) => {
//    document.getElementById('app').insertAdjacentHTML('beforeend', modalTemplate(message, 'alert'));
    $('#messageBox').html(message);
    $('#popupHeader').text(title);
//    $('#agreeBtnYn').off('click');
    $('.btn-close').off('click');
    $('.btn-close').on('click', ()=> { $('.alert2').hide(); resolve(false); });
    $('#policyMessageBox').on('keydown', (e:any)=> { 
//      console.log(`code::${e.code}||key::${e.key}`)
      if(e.key === "Escape"){
        $('.alert2').hide(); 
        resolve(false);
      }else if(e.key === "Tab"){
        e.preventDefault();
        let id = $(':focus').attr('id')
        let isShift = e.shiftKey
//        console.log(`isShift::${isShift}`)
//        console.log(`id::${id}`)
        if(id === "popupHeader"){ !isShift?$('#alert2Close').focus():$('#agreeBtnYn').focus()}
        else if(id === "alert2Close"){ !isShift?$('#agreeBtnYn').focus():$('#popupHeader').focus()}
        else if(id === "agreeBtnYn"){!isShift?$('#popupHeader').focus():$('#alert2Close').focus()}
      }
    });
    var offset = $(document).scrollTop();
    var viewportHeight = $(window).height();
    var $customAlert = $('.alert2 > div:nth-of-type(2)');
    $customAlert.css('top', (offset + (viewportHeight/2)) - ($customAlert.outerHeight()/2));
    $('.alert2').show();
    $('#popupHeader').focus();
    
    //확인버튼
    if(agreeBtnYn){
      $('#messageBox').append("<div class='form-btn-wrap row' style='padding-bottom:0px;'><button type='button' class='btn btnM btnWL' id='agreeBtnYn' title='확인'>확인</button></div>");
      $("#agreeBtnYn").on('click', () => { $('.alert2').hide();$('.agreeDetail').focus(); resolve(true); });//agreeDetail
      $("#agreeBtnYn").on('keyup', (e:any)=> { 
        if(e.key === "Enter" || e.key === "Space"){
          $('.alert2').hide();
          resolve(true); 
        }
      })
    }
  });
}

export const createAlert3 = (message: string) => {
  return new Promise((resolve, reject) => {
//    document.getElementById('app').insertAdjacentHTML('beforeend', modalTemplate(message, 'alert'));
    $('#alertMessage2').html(message);
    $('#alertOk2').off('click');
    $('#alertOk2').on('click', ()=> { $('.alert3').hide(); resolve(true); });
    var enterCnt = 0;
    $('#alertMessageBox2').on('keydown', (e:any)=> { 
//      console.log(`code::${e.code}||key::${e.key}`)
//      console.log(`enterCnt::${enterCnt}`)
      if(e.key === "Escape"){
        $('.alert3').hide(); 
        resolve(true);
      }else{
        e.preventDefault();
        $('#alertOk2').focus();
      }
    });
    $('#alertOk2').on('keyup', (e:any)=> { 
      
      if(e.key === "Enter"){
        enterCnt++; 
//        console.log(`enterCnt::${enterCnt}`)
      }
      if(e.key === "Enter" && enterCnt > 1){
//        console.log(`enterCnt::${enterCnt}`)
        e.preventDefault();
        $('.alert3').hide(); 
        resolve(true);
      }
    });
    var offset = $(document).scrollTop();
    var viewportHeight = $(window).height();
    var $customAlert = $('.alert3 > div:last-of-type');
    $customAlert.css('top', (offset + (viewportHeight/2)) - ($customAlert.outerHeight()/2));
    $('.alert3').show();
    $('#alertOk2').focus();
    //enterCnt++;
  });
}

export async function citizenConfirm(message: string){
//  let result = false;
  const realResult = (async() => {
    const confirmResult = await createConfirm(message);
    if(confirmResult){
      return true;
    }else{
      return false;
    }
  })();
  return await realResult;
}
  
export async function citizen_alert(message: string){
  const realResult = true;
  await citizenAlert(message);
//  .then(result =>{
//    return result;
//  });
  return realResult;
}
export async function citizenAlert(message: string) {
  const realResult = (async() => {
    const alertResult = await createAlert(message);
    if(alertResult){
      return true;
    }
//    return await createAlert(message);;
  })();
  return await realResult;
}
export async function citizenAlert2(title: string, message: string, agreeBtnYn?:boolean) {
  const realResult = (async() => {
    const alertResult = await createAlert2(title, message, agreeBtnYn);
    if(alertResult){
      return true;
    }
//    return await createAlert(message);;
  })();
  return await realResult;
}
export async function citizenAlert3(message: string) {
  const realResult = (async() => {
    const alertResult = await createAlert3(message);
    if(alertResult){
      return true;
    }
//    return await createAlert(message);;
  })();
  return await realResult;
}
/**
 * 3자리마다 ',' 넣기
 * @param str
 */
export function numberWithCommas(str:String) {
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 특정문자로 마스킹 처리
 * @param str
 */
export const maskingFnc = {
  nullCheck : function(str: string){
    if(typeof str == "undefined" || str == null || str == ""){
      return true;
    }else{
      return false;
    }
  },
  name : function(str: string, masking: string){
    let oStr = str;
    const strLen = str.length;
    let maskingStr = "";
    if(this.nullCheck(str)){
      return '-';
    }
    if(strLen < 3){
      maskingStr = str.substring(0, strLen - 1) + masking;
    }else if(strLen == 3){
      maskingStr = `${str.substring(0,1)}*${str.substring(2)}`;
    }else if(strLen < 6){
      maskingStr = `${str.substring(0,1)}**${str.substring(3)}`;
    }else{
      maskingStr = `${str.substring(0,strLen-4)}****`;
    }
    return maskingStr;
  },
  account : function(acc: string, masking: string, len: number){
    let oStr = acc;
    let maskingStr = "";
    if(this.nullCheck(acc)){
      return '-';
    }
    const strLen = acc.length;
    let makingDigit = ``;
    for(let i = 0; i<len; i++){
      makingDigit += masking;
    } 
    maskingStr = `${acc.substring(0, strLen - len)}${makingDigit}`;
    return maskingStr;
  },
  telNo : function(telNo: string, masking: string){
    let oStr = telNo;
    let maskingStr = "";
    if(this.nullCheck(telNo)){
      return '-';
    }
    const strLen = telNo.length;
    //6~8 번째 자리 마스킹
    if(strLen >= 9){
      maskingStr = `${telNo.substring(0,strLen-6)}****${telNo.substring(strLen-2)}`;
    }else{
      maskingStr = oStr;
    }
    return maskingStr;
  },
  email : function(email: string, masking: string, len: number){
    let oStr = email;
    let maskingStr = "";
    if(this.nullCheck(email)){
      return '-';
    }
    //이메일 ID 4자리 이상 인 경우 "@" 앞 세자리 마스킹
    //3자리 이하 "@" 앞 한자리 마스킹
    let emailId = email.substring(0, email.indexOf("@"));
    const strLen = emailId.length;
    let makingDigit = ``;
    for(let i = 0; i<len; i++){
      makingDigit += masking;
    }
    if(strLen < 4){
      maskingStr = `${emailId.replace(/.$/,masking)}${email.substring(email.indexOf("@"))}`;
    }else{
      maskingStr = `${emailId.replace(/.{3}$/,makingDigit)}${email.substring(email.indexOf("@"))}`;
    }
    return maskingStr;
  },
  emailId : function(id: string, masking: string, len: number){
    let oStr = id;
    let maskingStr = "";
    if(this.nullCheck(id)){
      return oStr;
    }
    const strLen = id.length;
    let makingDigit = ``;
    for(let i = 0; i<len; i++){
      makingDigit += masking;
    }
    if(strLen < 4){
      maskingStr = `${id.replace(/.$/,masking)}`;
    }else{
      maskingStr = `${id.replace(/.{3}$/,makingDigit)}`;
    }
    return maskingStr;
  },
  authNumber : function(authNumber: string, masking: string){
    let oStr = authNumber;
    let maskingStr = "";
    if(this.nullCheck(authNumber)){
      return '-';
    }
    const strLen = authNumber.length;
    if(strLen === 13){
      maskingStr = `${authNumber.substring(0,6)}-*******`;
    }else{
      maskingStr = `${oStr.replace(/.{3}/,'***')}`;
    }
    return maskingStr;
  },
  businessNumber : function(bizNum: string, masking: string, len: number){
    if(this.nullCheck(bizNum)){
      return bizNum;
    }
    let maskingStr = "";
    const strLen = bizNum.length;
    let makingDigit = ``;
    for(let i = 0; i<len; i++){
      makingDigit += masking;
    }
    const bizNumRegex = new RegExp(`.{${len}}$`)
    if(strLen === 10){
      maskingStr = `${bizNum.replace(bizNumRegex,makingDigit)}`;
    }else{
      maskingStr = bizNum;
    }
    return maskingStr;
  }
}
/**
 * 오브젝트 초기화
 * @param obj(any) : 모든 값 삭제할 오브젝트
 * @param saveKeyArry(Object[]) : 삭제에서 제외할 오브젝트 또는 변수
 * remark : 변수와 동명의 id 화면 값 제거
 * remark : saveKeyArry는 없어도 사용 가능
 */
export function clearObject(obj:any, saveKeyArry?:Object[]) {
    for(var key in obj){
      if(saveKeyArry != null && saveKeyArry.indexOf(key) == -1){
        obj[key] = "";
        $("#"+key).val("");
        if(key.indexOf("DisplayAddress") > 1){
          $("#"+key).text("");
          $("#"+key).parent().addClass("display-none");
        }
      } else if(!saveKeyArry){
        obj[key] = "";
        $("#"+key).val("");
        if(key.indexOf("DisplayAddress") > 1){
          $("#"+key).text("");
          $("#"+key).parent().addClass("display-none");
        }
      }
    }
  }
  
/**
 * 오늘 정보 조회
 * return map
 * remark : 오늘의 년도(yyyy), 월(mm), 일(dd), 시(hh), 분(mi), 초(ss), 날짜(yyyymmdd, yyyy/mm/dd, yyyy-mm-dd)를 가져온다.
 */
export function getNowDate() {
  
  let map = new Map();
  const date = new Date();
  map.set("year", date.getFullYear());
  map.set("month", date.getMonth()+1);
  map.set("date", date.getDate());
  map.set("hours", date.getHours());
  map.set("minutes", date.getMinutes());
  map.set("seconds", date.getSeconds());
  map.set("yyyymmdd", date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString());
  map.set("yyyy/mm/dd", date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate());
  map.set("yyyy-mm-dd", date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
  
  return map;
  }
  
export function lpad(str: String, padLen:Number, padStr:String) {
    if (padStr.length > padLen) {
        return str;
    }
    str += ""; // 문자로
    padStr += ""; // 문자로
    while (str.length < padLen)
        str = padStr.toString() + str.toString();
    str = str.length >= padLen ? str.substring(0, Number(padLen)) : str;
    return str;
}

export function setTimer(cyberminwon: any, data: any, delayTime: number, reset: boolean, gubun: string) {
  if(typeof timeWorker === 'undefined'){
    timeWorker = new Worker('/js/workerTimeout.js');
  }else{
    timeWorker.terminate();
    timeWorker = new Worker('/js/workerTimeout.js');
  }
  
  timeWorker.postMessage([delayTime, reset, gubun]);
  timeWorker.onmessage = function(e: any){
    data.getStorageData()? data.clear():"";
    cyberminwon.state.unityMinwon.retsetUnityMinwon(gubun);
    citizenAlert("신청(등록) 중 내용이 지워집니다.<br />초기화면으로 이동합니다.").then(result => {
      if(result){
        cyberminwon.goFront();
        timeWorker.terminate();
        timeWorker = undefined;
      }
    });
  };
}

export function diplayTime(remainTime : number){
  let now = new Date();
  let endTime = now.getTime() + remainTime;
  
}

//납부확인 팝업
export function jsDeptTelPop(){
  var url = "/citizen/common/jsDeptTelPopup.do";
  var popupX = (window.screen.width /2) - (850/2);
  var popupY = (window.screen.height /2) - (710/2);
  window.open(url, "사업소연락처보기", "width=530,height=860, top="+popupY+", left="+popupX+", toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no");
}

//서버시간
export async function serverTime(){
  const url = "/citizen/common/getServerTime.do";
  try{
    let res = await window.fetch(url)
    if(!res.ok){
      throw new Error(`serverTime call error: ${res.status}`)
    }
    let data = await res.json()
    if(data){
      console.log(data)
      return data
    }
  }catch(err){
    console.error('serverTime check error: ',err)
  }
}