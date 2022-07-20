
declare var $: any;
declare var gVariables: any;
declare var alert_msg: (msg: string) => void

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
  console.log("addMW", opt);
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

  } else {
    $(layer).addClass("display-block");
    $(layer).removeClass("display-none");
    $(layer).closest("a").attr('title', '보기');
  }
}

// 핸드폰 번호에 대한 화면 검증
export function phoneNumberInputValidation(target: any, length: number, pattern: any) {
  if (!pattern.test(target.value.substring(0, length))) {
    target.classList.remove('success')
    target.classList.add('err')
  } else {
    target.classList.remove('err')
    target.classList.add('success')
  }
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
    alert_msg("업로드가 제한된 파일입니다. 확장자를 체크해 주세요.\n[업로드 가능 파일 : " + gVariables['imgFileUploadPosible'].toString() + " ]");
    //		$("#"+id).focus();
    return false;
  }

  //	if(undefined != ("#"+id)[0].files){
  //		var fileSize = $("#"+id)[0].files[0].size;
  //		var maxSize = gVariables['fileUploadSize'] * 1024 *1024;
  //		if (fileSize > maxSize){
  //			alert_msg("파일용량 " + gVariables['fileUploadSize'] + "MB를 초과하였습니다.");
  //			$("#"+id).focus();
  //			return false;
  //		}
  //	}
  //	return true;
}