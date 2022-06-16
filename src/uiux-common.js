
//Layer는 DIV를 display none으로 설정
//MW는 해당 버튼의 활성화 비활성화 설정
//레이어 표시/숨기기
 function showHideLayer(layer) {
	 if ($(layer+">.form-mw-box").hasClass( "display-block" ))	 {
	   hideLayer(layer);
	 } else {
	   showLayer(layer);
	 }
 }
 
 function toggleLayer(layer) {
   if ($(layer+">.form-mw-box").hasClass( "display-block" ))   {
     hideLayer(layer);
   } else {
     showLayer(layer);
   }
 }
 
 function showLayer(layer) {
   $(layer+">.form-mw-box").addClass("display-block");
   $(layer+">.form-mw-box").removeClass("display-none");
   $(layer+">.tit-mw-h3>a").removeClass("on");
   $(layer+">.tit-mw-h3>a").addClass("off");
   $(layer+">.tit-mw-h3>a").attr( 'title', '닫기' );
 }
 
 function hideLayer(layer) {
   $(layer+">.form-mw-box").addClass("display-none");
   $(layer+">.form-mw-box").removeClass("display-block");
   $(layer+">.tit-mw-h3>a").removeClass("off");
   $(layer+">.tit-mw-h3>a").addClass("on");
   $(layer+">.tit-mw-h3>a").attr( 'title', '펼치기' );
 }

 //옵션선택 표시/숨기기
 function setGubunMulti(opt,layer) {
	 if ($(opt).hasClass( "on" ))	 {
	   hideGubunMulti(opt, layer);
	 } else {
	   showGubunMulti(opt, layer);
	 }
 }

 function hideGubunMulti(opt, layer) {
   $(layer).addClass("display-none");
   $(layer).removeClass("display-block");
   $(opt).removeClass("on");
   $(opt).addClass("off");
   $(opt).attr( 'title', '' );
 }
 
 function showGubunMulti(opt, layer) {
   $(layer).removeClass("display-none");
   $(layer).addClass("display-block");
   $(opt).removeClass("off");
   $(opt).addClass("on");
   $(opt).attr( 'title', '선택됨' );
 }
 
 
 function toggleMW(opt) {
   if ($(opt).hasClass( "on" ))  {
     removeMW(opt);
   } else {
     addMW(opt);
   }
 }
 
 function addMW(opt) {
   console.log("addMW", opt);
//		$(gubun).removeClass("on");
//		$(gubun).addClass("off");
//		$(gubun).attr( 'title', '' );
		$(opt).addClass("on");
		$(opt).removeClass("off");
		$(opt).attr( 'title', '선택됨' );
 }
 
 function removeMW(opt) {
//   $(gubun).removeClass("on");
//   $(gubun).addClass("off");
//   $(gubun).attr( 'title', '' );
   $(opt).addClass("off");
   $(opt).removeClass("on");
   $(opt).removeAttr( 'title');
}

 //약관/설명 표시/숨기기
function showHideInfo(layer) {
	 if ($(layer).hasClass( "display-block" ))	 {
		$(layer).addClass("display-none");
		$(layer).removeClass("display-block");
		$(layer).closest(".btnTypeC").attr( 'title', '닫기' );

	 } else {
		$(layer).addClass("display-block");
		$(layer).removeClass("display-none");
		$(layer).closest("a").attr( 'title', '보기' );
	 }
}

// 핸드폰 번호에 대한 화면 검증
function phoneNumberInputValidation(target, length, pattern) {
  if (!pattern.test(target.value.substring(0, length))) {
    target.classList.remove('success')
    target.classList.add('err')
  } else {
    target.classList.remove('err')
    target.classList.add('success')
  }
}

function hideElement(ele) {
  $(ele).addClass("display-none");
  $(ele).removeClass("display-block");
  $(ele).closest(".btnTypeC").attr( 'title', '닫기' );
}

function showElement(ele) {   
  $(ele).addClass("display-block");
  $(ele).removeClass("display-none");
  $(ele).closest("a").attr( 'title', '보기' );
}
