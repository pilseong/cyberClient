

class B19DetailPage {
  constructor(parent, root) {
    this.state = {
      parent,
      root
    }
  }

  setEventListeners() {
  }

  render() {
    let template = `
      <div class="mw-box">
      <div id="form-mw20" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw20');" class="off" title="닫기"><span class="i-01">전자고지 신청 (신규/변경/해지)</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>전자고지 유형을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="aGubun1" class="off"><a href="javascript:void(0);" onClick="setGubunMulti('#aGubun1','#mw-box1')"><span>문자</span></a></li>
                  <li id="aGubun2" class="off"><a href="javascript:void(0);" onClick="setGubunMulti('#aGubun2','#mw-box2')"><span>이메일</span></a></li>
                </ul>
              </li>
  
              <li>
                <label for="eGubun" class="input-label-1"><span>본인인증</span></label>
                <select id="eGubun" name="eGubun" title="선택" class="input-box input-w-2">
                  <option value="001">개인</option>
                  <option value="002">법인</option>
                  <option value="003">외국인</option>
                </select>
  
                <label for="form-mw56-tx"><span class="sr-only">성명(사업자명)</span></label>
                <input type="text" id="form-mw56-tx" class="input-box input-w-2" placeholder="성명(사업자명)" readOnly>
                <a href="javascript:void(0);" class="btn btnSS btnTypeA"><span>휴대폰인증</span></a>
                <a href="javascript:void(0);" class="btn btnSS btnTypeA"><span>공공아이핀</span></a>
                <p class="form-cmt form-cmt-1">* 인증 오류는 <a href="https://www.niceid.co.kr/index.nc" target="_blank">NICE평가정보</a>에 문의해 주시기 바랍니다. (Tel.1600-1522)</p>
              </li>
  
              <li>
                <label for="form-mw66-tx"><span class="sr-only">인증번호</span></label><input type="text" id="form-mw66-tx" class="input-box input-w-1" placeholder="인증번호"  readOnly>
                <p class="form-cmt form-cmt-1">
                  <span class="txStrongColor">* 개인, 외국인(생년월일:YYMMDD), 법인(사업자번호:XXXXXXXXXX)</span><br>
                  * 인증번호는 이메일 수신시 암호로 사용됩니다.
                </p>
              </li>
  
                <li>
                  <div class="txStrong">사용현황</div>
                  <p class="display-block form-info form-info-box txStrongColor">
                      <span class="mw-info-label txStrongColor ">문자</span> 사용현황없음<br>
                      <span class="mw-info-label txStrongColor">이메일</span> 사용현황없음<br>
                      <span class="mw-info-label txStrongColor">앱</span> 사용현황없음<br>
                      <span class="mw-info-label txStrongColor">종이고지서</span> 사용현황없음<br>
                  </p>
                  <p class="form-cmt form-cmt-1">
                    <span class="txStrongColor">* 앱 전자고지는 네이버(전자문서), 카카오톡(카카오페이-내문서함), 페이코, 신한페이판(my bill&pay) 앱에서 신청/해지하세요.</span>
                  </p>
  
                </li>
  
            </ul>
          </div>
        </div>
      </div><!-- //form-mw20 -->
      </div><!-- //mw-box -->
  
      <div id="mw-box1" class="mw-box display-none row">
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw21');" class="on" title="닫기"><span class="i-01">문자 전자고시 신청정보</span></a></div>
        <div class="form-mw-box display-block row">
  
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>전자고지신청 구분을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="bGubun1" class="dGubun disable"><a href="javascript:void(0);" tabindex="-1"><span>신규</span></a></li>
                  <li id="bGubun2" class="bGubun off"><a href="javascript:void(0);" onClick="addMW('#bGubun2','.bGubun')"><span>변경</span></a></li>
                  <li id="bGubun3" class="bGubun off"><a href="javascript:void(0);" onClick="addMW('#bGubun3','.bGubun')"><span>해지</span></a></li>
                </ul>
              </li>
              <li>
                <label class="input-label"><span>안내방법을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="cGubun1" class="cGubun off"><a href="javascript:void(0);" onClick="addMW('#cGubun1','.cGubun')"><span>알림톡</span></a></li>
                  <li id="cGubun2" class="cGubun off"><a href="javascript:void(0);" onClick="addMW('#cGubun2','.cGubun')"><span>문자</span></a></li>
                </ul>
              </li>
              <li><label for="form-mw46-tx" class="input-label"><span>연락처</span></label><input type="text" id="form-mw46-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력"></li>
            </ul>
          </div>
  
        </div>
      </div><!-- //form-mw21 -->
      </div><!-- //mw-box1 -->
  
      <div id="mw-box2" class="mw-box display-none row">
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw22');" class="on" title="닫기"><span class="i-01">이메일 전자고시 신청정보</span></a></div>
        <div class="form-mw-box display-block row">
  
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>전자고지신청 구분을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="dGubun1" class="dGubun off"><a href="javascript:void(0);" onClick="addMW('#dGubun1','.dGubun')"><span>신규</span></a></li>
                  <li id="dGubun2" class="dGubun off"><a href="javascript:void(0);" onClick="addMW('#dGubun2','.dGubun')"><span>변경</span></a></li>
                  <li id="dGubun3" class="dGubun off"><a href="javascript:void(0);" onClick="addMW('#dGubun3','.dGubun')"><span>해지</span></a></li>
                </ul>
              </li>
              <li><label for="form-mw371-tx" class="input-label"><span>이메일</span></label><input type="text" id="form-mw371-tx" class="input-box input-w-mail"> @
                <label for="form-mw372-tx"><span class="sr-only">이메일 주소</span></label><input type="text" id="form-mw372-tx" class="input-box input-w-mail">
                <label for="email3"><span class="sr-only">이메일 선택</span></label>
                <select name="email3" id="email3" title="이메일도메인선택" class="input-box input-w-mail2">
                    <option value="">직접입력</option>
                    <option value="naver.com">naver.com</option>
                    <option value="hotmail.com">hotmail.com</option>
                    <option value="chol.com">chol.com</option>
                    <option value="dreamwiz.com">dreamwiz.com</option>
                    <option value="empal.com">empal.com</option>
                    <option value="freechal.com">freechal.com</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="hanmail.net">hanmail.net</option>
                    <option value="hanafos.com">hanafos.com</option>
                    <option value="hanmir.com">hanmir.com</option>
                    <option value="hitel.net">hitel.net</option>
                    <option value="korea.com">korea.com</option>
                    <option value="nate.com">nate.com</option>
                    <option value="netian.com">netian.com</option>
                    <option value="paran.com">paran.com</option>
                    <option value="yahoo.com">yahoo.com</option>
                </select>
              </li>
  
            </ul>
          </div>
  
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box -->
  
      <div class="mw-box">
      <div id="form-mw24" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw24');" class="on" title="펼치기"><span class="i-01">종이고지서 발행 신청</span></a></div>
        <div class="form-mw-box row display-none">
          <div class="form-mv row">
            <ul>
              <li><label><span class="sr-only"> 종이 고지서 발행 신청</span></label>
                <input type="checkbox" name="ch31" id="ch31">
                <label class="chk-type" for="ch31"> <span>종이 고지서 발행 (전자고지 + 종이 고지서 발송) 희망 시 체크</span></label>
                <a href="javascript:void(0);" onClick="showHideInfo('#form-mw23-info');" class="btn btnSS btnTypeC"><span>안내사항</span></a>
  
                  <p id="form-mw23-info" class="display-none form-info-box">
                    <span class="tit-mw-h5 row">안내사항</span>
                    1. 종이 고지서 발행을 선택하는 경우 요금이 감면되지 않습니다.(상수도 요금의 1% 최소 200 ~ 1,000원)<br>
                    2. 당월 8일 까지 “신청/변경/해지” 건은 당월 납기에 반영되고, 당월 8일 후 “신청/변경/해지” 건은 다음 납기에 반영됩니다.<br>
                    3. 향후, 이사정산을 하는 경우 전입자가 고지서를 받는 못하는 사례를 방지하기 위해 종이고지서를 발행하는 전자고지로 직권변경 및 직권해지 될 수 있습니다.
                </p>
  
              </li>
  
            </ul>
          </div>
  
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->
  
  
      <div id="mw-box11" class="mw-box display-none row">
      <!-- 신계좌 정보 -->
      <div id="form-mw25" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw25');" class="off" title="닫기"><span class="i-01">신규 계좌정보를 입력하세요.</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="n_bank_nm_new" class="input-label"><span class="form-req">은행 </span></label>
                <select id="n_bank_nm_new" name="n_bank_nm_new" title="은행명 선택" class="input-box input-w-2">
                  <option value="000" selected="selected">은행선택</option>
                  <option value="020">우리은행</option>
                  <option value="003">기업은행</option>
                  <option value="004">국민은행</option>
                  <option value="088">신한은행</option>
                  <option value="081">KEB하나은행</option>
                  <option value="011">농협(중앙)</option>
                  <option value="012">농협(단위)</option>
                  <option value="071">우체국</option>
                  <option value="007">수협</option>
                  <option value="090">카카오뱅크</option>
                  <option value="089">케이뱅크</option>
                  <option value="002">산업은행</option>
                  <option value="023">제일은행</option>
                  <option value="045">새마을금고</option>
                  <option value="027">한국씨티은행</option>
                  <option value="031">대구은행</option>
                  <option value="032">부산은행</option>
                  <option value="034">광주은행</option>
                  <option value="035">제주은행</option>
                  <option value="037">전북은행</option>
                  <option value="039">경남은행</option>
                  <option value="048">신용협동조합</option>
                  <option value="050">상호저축은행</option>
                  <option value="064">산림조합중앙회</option>
                  <option value="100">기타</option>
                </select>
              </li>
              <li><label for="form-mw35-tx" class="input-label"><span class="form-req">계좌번호 </span></label><input type="text" id="form-mw35-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <a href="#" class="btn btnSS"><span>계좌확인</span></a><a href="#" class="btn btnSS"><span>계좌이력확인</span></a>
              </li>
              <li>
                <label for="fGubun" class="input-label"><span>인증정보</span></label>
                <select id="fGubun" name="fGubun" title="선택" class="input-box input-w-2">
                  <option value="001">개인</option>
                  <option value="002">법인</option>
                  <option value="003">외국인</option>
                </select>
                <label for="form-mw76-tx"><span class="sr-only">인증정보</span></label><input type="text" id="form-mw76-tx" class="input-box input-w-2" placeholder="인증정보">
                <p class="form-cmt-1">
                  <span class="txStrongColor">* 개인, 외국인(생년월일:Y2022-03-15YMMDD), 법인(사업자번호:XXXXXXXXXX)</span><br>
                </p>
              </li>
              <li>
                <label for="dGubun" class="input-label"><span>성명(예금주)</span></label>
                <input type="text" id="dGubun" class="input-box input-w-2" placeholder="성명(예금주)">
                <a href="javascript:void(0);" class="btn btnSS btnTypeA"><span>휴대폰인증</span></a>
                <a href="javascript:void(0);" class="btn btnSS btnTypeA"><span>공공아이핀</span></a>
                <p class="form-cmt">* 인증 오류는 <a href="https://www.niceid.co.kr/index.nc" target="_blank">NICE평가정보</a>에 문의해 주시기 바랍니다. (Tel.1600-1522)</p>
              </li>
  
              <li><label class="input-label"><span class="sr-only">수신 동의</span></label>
                <input type="checkbox" name="ch51" id="ch51">
                <label class="chk-type" for="ch51"> <span>자동납부  출금 및 미출금내역 메시지 수신 동의</span></label>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box11 -->
  
  
      <div id="mw-box21" class="mw-box display-none row">
      <!-- 신계좌 정보 -->
      <div id="form-mw26" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw26');" class="off" title="닫기"><span class="i-01">자동납부 해지정보를 입력하세요.</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="form-mw18-tx" class="input-label"><span class="form-req">은행명</span></label><input type="text" id="form-mw18-tx" class="input-box input-w-2" placeholder="은행명">
              </li>
              <li>
                <label for="form-mw28-tx" class="input-label"><span class="form-req">계좌번호</span></label><input type="text" id="form-mw28-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
              </li>
              <li>
                <label for="form-mw38-tx" class="input-label"><span class="form-req">성명(예금주)</span></label><input type="text" id="form-mw38-tx" class="input-box input-w-2" placeholder="성명(예금주)">
                <p class="form-cmt">* 예금주명과 주민등록번호가 표시되어(이미 저장됨) 있으면 변경할 수 없습니다.</p>
              </li>
              <li>
                <label for="form-mw48-tx" class="input-label"><span class="form-req">생년월일</span></label><input type="text" id="form-mw48-tx" class="input-box input-w-2" placeholder="생년월일">
              </li>
  
              <li><label for="form-mw35-tx" class="input-label"><span>약관동의</span></label>
                <p class="form-info">
                  <input type="checkbox" name="ch71" id="ch71">
                  <label class="chk-type" for="ch71"> <span>자동납부 출금 및 미출금 내역 메시지 수신 동의 <span class="tx-opt-a">(선택)</span></span></label><br>
  
                  <input type="checkbox" name="ch72" id="ch72">
                  <label class="chk-type" for="ch72"> <span>예금주와 신청인이 동일하며, 동일하지 않은 경우 예금주로부터 출금동의 받음<span class="tx-opt">(필수) </span></span></label><br>
  
                  <input type="checkbox" name="ch73" id="ch73">
                  <label class="chk-type" for="ch73"> <span>자동납부 출금 및 미출금 내역 메시지 수신 동의 <span class="tx-opt-a">(선택)</span></span></label>
                  <a href="javascript:fncFileDownload(4);" class="btn btnSS btnDGray"><span>약관보기</span></a>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box21 -->    
    `;
    this.state.root.innerHTML = template;
    this.setEventListeners();
  }
}

class B14DetailPage {
  constructor(parent, root) {
    this.state = {
      parent,
      root
    }
  }

  setEventListeners() {
  }

  render() {
    let template = `
      <!-- 신청내용 -->
      <div class="mw-box">
      <!-- 자동납부 신청(신규/변경/해지) -->
      <div id="form-mw21" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw21');" class="off" title="닫기"><span class="i-01">자동납부 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>자동납부 신청을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="aGubun1" class="off"><a href="javascript:void(0);" onClick="setGubunMulti('#aGubun1','#mw-box1')"><span>신규</span></a></li>
                  <li id="aGubun2" class="off"><a href="javascript:void(0);" onClick="setGubunMulti('#aGubun2','#mw-box2')"><span>해지</span></a></li>
                </ul>
              </li>
              <li>
                <label for="contents" class="input-label-1"><span>비고</span></label>
                <textarea name="contents" id="contents" maxlength="1500" title="비고"  class="textarea-box"></textarea>
                <p class="form-cmt form-cmt-1 txStrongColor">
                  * 증권계좌는 자동납부 신청이 불가합니다.<br>
                  * 지방세징수법에 의거 증권사는 지방세수납대행기관에 해당되지 않습니다.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw21 -->
      </div><!-- //mw-box -->
  
  
      <div id="mw-box1" class="mw-box display-none row">
      <!-- 신계좌 정보 -->
      <div id="form-mw22" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw22');" class="off" title="닫기"><span class="i-01">자동납부(계좌) 신규 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="n_bank_nm_new" class="input-label"><span class="form-req">은행 </span></label>
                <select id="n_bank_nm_new" name="n_bank_nm_new" title="은행명 선택" class="input-box input-w-2">
                  <option value="000" selected="selected">은행선택</option>
                  <option value="020">우리은행</option>
                  <option value="003">기업은행</option>
                  <option value="004">국민은행</option>
                  <option value="088">신한은행</option>
                  <option value="081">KEB하나은행</option>
                  <option value="011">농협(중앙)</option>
                  <option value="012">농협(단위)</option>
                  <option value="071">우체국</option>
                  <option value="007">수협</option>
                  <option value="090">카카오뱅크</option>
                  <option value="089">케이뱅크</option>
                  <option value="002">산업은행</option>
                  <option value="023">제일은행</option>
                  <option value="045">새마을금고</option>
                  <option value="027">한국씨티은행</option>
                  <option value="031">대구은행</option>
                  <option value="032">부산은행</option>
                  <option value="034">광주은행</option>
                  <option value="035">제주은행</option>
                  <option value="037">전북은행</option>
                  <option value="039">경남은행</option>
                  <option value="048">신용협동조합</option>
                  <option value="050">상호저축은행</option>
                  <option value="064">산림조합중앙회</option>
                  <option value="100">기타</option>
                </select>
              </li>
              <li><label for="form-mw35-tx" class="input-label"><span class="form-req">계좌번호 </span></label><input type="text" id="form-mw35-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <a href="#" class="btn btnSS"><span>계좌확인</span></a><a href="#" class="btn btnSS"><span>계좌이력확인</span></a>
              </li>
              <li>
                <label for="eGubun" class="input-label-1"><span>본인인증</span></label>
                <select id="eGubun" name="eGubun" title="선택" class="input-box input-w-2">
                  <option value="001">개인</option>
                  <option value="002">법인</option>
                  <option value="003">외국인</option>
                </select>
  
                <label for="form-mw56-tx"><span class="sr-only">성명(예금주)</span></label>
                <input type="text" id="form-mw56-tx" class="input-box input-w-2" placeholder="성명(예금주)" readOnly>
                <a href="javascript:void(0);" class="btn btnSS"><span>휴대폰인증</span></a>
                <a href="javascript:void(0);" class="btn btnSS"><span>공공아이핀</span></a>
                <p class="form-cmt form-cmt-1">* 인증 오류는 <a href="https://www.niceid.co.kr/index.nc" target="_blank">NICE평가정보</a>에 문의해 주시기 바랍니다. (Tel.1600-1522)</p>
              </li>
  
              <li>
                <label for="form-mw46-tx"><span class="sr-only">인증번호</span></label><input type="text" id="form-mw46-tx" class="input-box input-w-1" placeholder="인증번호"  readOnly>
                <p class="form-cmt form-cmt-1">
                  <span class="txStrongColor">* 개인, 외국인(생년월일:YYMMDD), 법인(사업자번호:XXXXXXXXXX)</span><br>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw22 -->
      </div><!-- //mw-box -->
  
      <div id="mw-box2" class="mw-box display-none row">
      <!-- 자동납부(계좌) 해지 신청 -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw23');" class="off" title="닫기"><span class="i-01">자동납부(계좌) 해지 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label for="form-mw18-tx" class="input-label"><span>은행명</span></label><input type="text" id="form-mw18-tx" class="input-box input-w-2" placeholder="은행명" readOnly>
              </li>
              <li>
                <label for="form-mw28-tx" class="input-label"><span>계좌번호</span></label><input type="text" id="form-mw28-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력" readOnly>
              </li>
              <li>
                <label for="form-mw38-tx" class="input-label"><span>성명(예금주)</span></label><input type="text" id="form-mw38-tx" class="input-box input-w-2" placeholder="성명(예금주)" readOnly>
                <p class="form-cmt">* 예금주명과 주민등록번호가 표시되어(이미 저장됨) 있으면 변경할 수 없습니다.</p>
              </li>
              <li>
                <label for="form-mw48-tx" class="input-label"><span>생년월일</span></label><input type="text" id="form-mw48-tx" class="input-box input-w-2" placeholder="생년월일" readOnly>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->
  
      <div class="mw-box row">
      <!-- 약관동의 -->
      <div id="form-mw24" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw24');" class="off" title="닫기"><span class="i-01">이용약관</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li><label for="form-mw35-tx" class="input-label"><span>이용약관에 동의하세요.</span></label>
                <p class="form-info">
                  <input type="checkbox" name="ch71" id="ch71">
                  <label class="chk-type" for="ch71"> <span>자동납부 출금 및 미출금 내역 메시지 수신 동의 <span class="tx-opt-a">(선택)</span></span></label><br>
  
                  <input type="checkbox" name="ch72" id="ch72">
                  <label class="chk-type" for="ch72"> <span>예금주와 신청인이 동일하며, 동일하지 않은 경우 예금주로부터 출금동의 받음<span class="tx-opt">(필수) </span></span></label><br>
  
                  <input type="checkbox" name="ch73" id="ch73">
                  <label class="chk-type" for="ch73"> <span>자동납부 출금 및 미출금 내역 메시지 수신 동의 <span class="tx-opt-a">(선택)</span></span></label>
                  <a href="https://www.xrp.kr/_arisu/data/use-info.hwp" target="_blank" class="btn btnSS btnTypeC"><span>내용보기</span></a>
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div><!-- //form-mw24 -->
      </div><!-- //mw-box -->        
    `;
    this.state.root.innerHTML = template;
    this.setEventListeners();
  }
}

class B25DetailPage {
  constructor(parent, root) {
    this.state = {
      parent,
      root
    }
  }

  setEventListeners() {
  }

  render() {
    let template = `
      <!-- 민원안내 -->
      <div class="mw-box">
        <div id="form-mw0" class="row">
          <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw0');" class="on" title="닫기"><span class="i-06 txStrongColor">민원안내 및 처리절차</span></a></div>
          <div class="form-mw-box display-none row">
  
            <div class="info-mw row">
              <div class="tit-mw-h5 row"><span>계량기고장유형</span></div>
              <div class="info-mw-list">
                <ul>
                  <li>동파 : 겨울철 동결로 유리부가 파손되어 판독이 불가한 경우</li>
                  <li>외갑누수 : 계량기 외갑에서 물이 새어 나올 경우</li>
                  <li>화상 : 화재 또는 해빙작업 등으로 손상을 입은 경우</li>
                  <li>초파 : 사용자 관리부주의로 유리부가 파손된 경우</li>
                  <li>망실 : 계량기가 분실된 경우</li>
                  <li>침비 : 계량기 숫자의 일부 단위 작동상태가 비정상인 경우</li>
                  <li>불회전·회전불량 : 수돗물을 사용하고 있음에도 계량기 숫자가 회전하지 않거나, 회전상태가 불량인 경우</li>
                </ul>
              </div>
  
              <div class="tit-mw-h5 row"><span>신청방법</span></div>
              - 수도사업소 방문, 전화, 인터넷 등으로 신청가능 합니다.<br>
              <div class="tit-mw-h5 row"><span>처리기간</span></div>
              - 법정 5일, 신속 3일<br>
              <div class="tit-mw-h5 row"><span>처리부서</span></div>
              - 수도사업소 요금과, 현장민원과 ( 총괄부서: 본부 계측관리과 )<br>
              <div class="tit-mw-h5 row"><span>신청서류</span></div>
              - 수도계량기 교체 신청서<br>
              <div class="tit-mw-h5 row"><span>관련법규</span></div>
              - 민원 처리에 관한 법률 제2조<br>
              <div class="tit-mw-h5 row"><span>처리절차</span></div>
              01.계량기교체신청(동파,몸통누수) → 02.계량기교체(요금과,현장민원과) → 03.계량기대금부과(몸통누수 제외)→ 04.계량기교체신청(열손상,유리파손,망실,지침비정상) → 05.현장조사(요금과) → 06.계량기교체(요금과, 현장민원과)→ 07.계량기대금 및 설치대금부과 → 08.계량기교체신청(고장발생분) → 09.요금조정(요금관리팀) → 10.계량기교체(요금과, 현장민원과)
            </div>
          </div>
        </div><!-- //info-mw -->
      </div><!-- //mw-box -->
  
  
      <!-- 신청내용 -->
      <div class="mw-box">
      <!-- 수도요금 바로알림 신청 (신규/변경/해지) -->
      <div id="form-mw23" class="row">
        <div class="tit-mw-h3"><a href="javascript:void(0);" onClick="showHideLayer('#form-mw23');" class="off" title="닫기"><span class="i-01">수도요금 바로알림 신청</span></a></div>
        <div class="form-mw-box display-block row">
          <div class="form-mv row">
            <ul>
              <li>
                <label class="input-label-1"><span>민원신청 구분을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="aGubun1" class="aGubun off"><a href="javascript:void(0);" onClick="addMW('#aGubun1','.aGubun')"><span>신규</span></a></li>
                  <li id="aGubun2" class="aGubun off"><a href="javascript:void(0);" onClick="addMW('#aGubun2','.aGubun')"><span>변경</span></a></li>
                  <li id="aGubun3" class="aGubun off"><a href="javascript:void(0);" onClick="addMW('#aGubun3','.aGubun')"><span>해지</span></a></li>
                </ul>
              </li>
              <li>
                <label class="input-label"><span>안내방법을 선택하세요.</span></label>
                <ul class="mw-opt mw-opt-6 row">
                  <li id="bGubun1" class="bGubun off"><a href="javascript:void(0);" onClick="addMW('#bGubun1','.bGubun')"><span>알림톡</span></a></li>
                  <li id="bGubun2" class="bGubun off"><a href="javascript:void(0);" onClick="addMW('#bGubun2','.bGubun')"><span>문자</span></a></li>
                </ul>
              </li>
  
              <li><label class="input-label"><span>기존신청정보</span></label>
                <p class="form-info">신청정보가 없습니다.</p>
              </li>
  
              <li>
                <label for="form-mw36-tx" class="input-label"><span>휴대폰번호</span></label><input type="text" id="form-mw36-tx" class="input-box input-w-2" placeholder="'-' 없이 번호입력">
                <p class="form-cmt txStrongColor">
                  * 신규/변경/해지할 휴대폰 번호를 입력하세요.</p>
              </li>
                <li><label class="input-label"><span class="sr-only">수도요금 바로알림 수신여부</span></label>
                  <p class="form-info">
                    <input type="checkbox" name="ch81" id="ch81">
                    <label class="chk-type" for="ch81"> <span>수도요금 바로알림 수신동의<span class="tx-opt">(필수) </span></span></label>
                    <a href="javascript:void(0);" onClick="showHideInfo('#form-mw23-info');" class="btn btnSS btnTypeC"><span>내용보기</span></a>
                  </p>
  
                  <p id="form-mw23-info" class="display-none form-info-box">
                    <span class="tit-mw-h5 row">수도요금바로알림</span>
                  메시지 수신 설정 상태, 데이터 상태, 시스템 오류, 통신장애, 휴대폰 사용 정지, 휴대폰 전원 상태 등으로 메시지 수신이 불가할 수 있습니다.
                  메시지내용은 발송일 기준으로 작성된 것이므로 이 후 변동사항은 해당 사업소로 문의하시기 바랍니다.
                  서비스 받으실 이동전화번호가 변경된 경우, 변경신청 하여야 하며, 신청 지연 및 신청내용 오류로 인하여 신청자 또는 제3자에게 발생된 사태나 손해에 대하여 서비스 기관이 책임지지 않습니다.
                  전·출입을 반영하여 서비스 하지 않으므로 사유발생 시, 해지 및 신규 신청하여야 하며 그렇지 않아 발생할 수 있는 불이익 등에 대한 책임은 서비스 기관에 없으며, 이를 예방하기 위한 조치로 직권해지 할 수 있습니다.
                  매월 8일까지 신청분은 당월에 적용하며, 이후 신청분은 차월 납기부터 적용합니다.
                  메시지 전송일은 요금결정 다음날인 12일 전·후이며 변경될 수 있습니다.
                  </p>
                </li>
            </ul>
          </div>
        </div><!-- //form-mw-box -->
      </div><!-- //form-mw23 -->
      </div><!-- //mw-box -->    
      `;

    this.state.root.innerHTML = template;
    this.setEventListeners();
  }
}