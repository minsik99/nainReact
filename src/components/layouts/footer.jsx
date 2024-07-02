import { observer } from "mobx-react";

const Footer = observer(() => {
  return (
    <>
      <div>
      <hr width={"100%"}/>
        <img
          className="pAioneer_Logo"
          src="/image/pAioneer_Logo.png"
          width={"100px"}
          alt="pAioneer_Logo"
        />
      </div>
      <div>
        <p>
          서울특별시 강남구 상우동 1가 1-3페이지 5층 대표이사 이혜림
          사업자등록번호 421-88-00471
          <br />
          통신판매업신고번호 2017-서울중구-1784호 문의전화 070-1234-5678 (운영
          시간:평일 11:00~18:00)이메일 pAioneer@gpAioneer.ai @pAioneer,Inc
        </p>
      </div>
    </>
  );
});

export default Footer;
