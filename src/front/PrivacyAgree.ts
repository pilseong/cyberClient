export function getPrivacyAgree(){
//    <span class="tit-mw-h5 row">개인정보 수집 및 이용 안내</span>
  const contents = `
    <h4>1. 개인정보의 수집 및 이용 목적 ( 「개인정보 보호법」 제15조 )</h4>
    <p class="p-depth-2 bg-gray">
    서울아리수본부 고객지원시스템(사이버고객센터>민원신청>온라인민원)은 관계 법령 등에서 정하는 담당 업무를 수행하기 위하여 다음과 같이 개인정보를 수집 및 이용합니다.<br>
    수집된 개인정보는 정해진 목적 이외의 용도로 이용하지 않으며 수집 목적이 변경될 경우 사전에 알리고 동의를 받을 예정입니다.
    </p>
    <h5> ※ 관계법령 등</h5>
    <ul class="p-depth-2 bd-gray">
    <li>민원 처리에 관한 법률, 같은 법 시행령과 시행규칙</li>
    <li>전자정부법, 같은 법 시행령과 시행규칙</li>
    <li>수도법, 같은 법 시행령과 시행규칙</li>
    <li>서울특별시 수도 조례, 같은 조례 시행조례와 시행규칙</li>
    </ul>

    <h5> 가. 민원 접수·처리·사후관리 서비스 제공</h5>
    <p class="p-depth-2 bd-gray">신청서에 포함된 개인정보는 민원의 접수·처리 등 담당 업무 수행을 위해 행정기관에서 이용합니다. 행정기관에는 법령에 따라 행정권한이 있거나 행정권한을 위임 또는 위탁받은 법인·단체 또는 그 기관이나 개인이 포함됩니다. ( 「민원 처리에 관한 법률」 제2조 제3호 )</p>
    <h5>나. 타 행정·공공기관 시스템 이용</h5>
    <ul class="p-depth-2 bd-gray">
    <p>민원의 전자적 처리를 위해 내부적으로 타 시스템 연계 및 이용 시 개인정보를 이용합니다.</p>
    <li>서울아리수본부 요금관리시스템(요금 관련 민원 처리)</li>
    <li>서울아리수본부 상수도 GIS(급수공사 신청, 수도계량기 및 상수도관(수도사업소) 신청 민원 처리)</li>
    <li>서울특별시 업무관리시스템(우리기관 전자문서 결재시스템)</li>
    <li>서울아리수본부 통합메시지 시스템(민원 처리결과 문자 등 전송)</li>
    </ul>

    <h5>다. 서울아리수본부 정책지원</h5>
    <ul class="p-depth-2 bd-gray style"><li>접수된 민원은 서울아리수본부가 제공하는 서비스 향상 및 정책 평가를 위하여 관계 법령에 따라 분석·평가 및 처리결과의 사후관리(만족도 조사 등)를 시행합니다.</li></ul>
    <h4>2. 수집하는 개인정보의 항목( 「개인정보 보호법」 제15조, 제16조 )</h4>
    <h5> 가. 필수</h5>
    <ul class="p-depth-2 bd-gray style">
    <li>(공통) 성명, 주소, 연락처(유선전화 번호 또는 휴대전화 번호)</li>
    <li>(민원 사무에 따라 필수)</li>
    <li><ul><li>자동납부 신청: 예금주의 이름과 생년월일(실명번호), 계좌번호, 전자서명 연계정보(CI)</li>
      <li>전자고지 신청: 전자고지 수령인의 이름과 생년월일(전자고지 확인번호),수령방법에 따라 전자우편 주소 또는 휴대전화 번호</li>
      <li>자가검침 신청, 수도요금 납부 증명서 신청, 자가검침 검침일 안내 신청, 수도요금 문자 안내 신청, 기타민원(절의, 건의, 고충) 신청 등 민원 처리결과 회신방법에 따라 전자우편 주소 또는 휴대전화 번호 또는 유선전화 번호 또는 팩스(Fax) 번호 필수</li>
      </ul></li>
    </ul>

    <h5>나. 선택 : 전자우편 주소</h5>

    <h5>다. 자동수집 항목: IP(Internet Protocal) 주소, 이용내용의 기록</h5>
    <ul class="p-depth-2 bd-gray style">
    <li>부정한 방법으로 타인명의를 사용하는 경우에 대비하기 위해 정보이용내역을 자동수집 합니다.</li>
    <li>※ 부정한 방법으로 타인명의 사용 시, 주민등록법 제37조(벌칙)에 의해 처벌 받을 수 있습니다.</li></ul>

    <h4>3. 개인정보의 보유 및 이용기간 ( 「공공기록물 관리에 관한 법률 시행령」 제26조 )</h4>
    <ul class="p-depth-2 bd-gray style">
    <li>개인정보 보존기간이 경과하거나, 처리목적이 달성된 경우에는 지체 없이 개인정보를 파기합니다.</li>
    <li>다만, 다른 법령에 따라 보존하여야 하는 경우에는 그러하지 않을 수 있습니다.</li>
    <li><ol><li class="txStrong">가. 민원 신청·처리 정보 : <span class="txRed">10년</span></li>
    <li class="txStrong">나. 자동 수집항목 중 IP주소 : <span class="txRed">1년</span></li></ol></li>
    </ul>

    <h4>4. 동의를 거부할 권리가 있다는 사실 및 동의 거부에 따른 불이익 내용 ( 「개인정보 보호법」 제16조 )</h4>
    <ul class="p-depth-2 bd-gray style"><li>개인정보 수집·이용에 동의를 거부하실 수 있으며, 동의를 거부하시는 경우에는 상수도 민원 신청 서비스 이용이 제한됩니다.</li></ul>
  `;
  
  return contents;
}