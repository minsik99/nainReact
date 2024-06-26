import axios from "axios";
import React, { useEffect } from "react";
import instance from "../../api/axiosApi";
import { observer } from "mobx-react-lite";
import { TossPayments, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk"
import { loadTossPayments } from "@tosspayments/payment-sdk";

const Index = observer(() => {
                
    

    //페이호출 메소드
    const handlePayment = () => {
      const random = new Date().getTime() + Math.random(); //난수생성
      const randomId = btoa(random); //난수를 btoa(base64)로 인코딩한 orderID
 
        loadTossPayments("test_ck_6bJXmgo28e26vbqqGdA63LAnGKWx").then(tossPayments => {
          tossPayments.requestPayment('카드', {
            amount: 10000, //주문가격
            orderId: '1', //문자열 처리를 위한 ``사용
            orderName: '2', //결제 이름(여러건일 경우 복수처리)
            customerName: '테스트', //판매자, 판매처 이름
            successUrl: process.env.REACT_APP_TOSS_SUCCESS,
            failUrl: process.env.REACT_APP_TOSS_FAIL,
          })
        });
      
    }

    return (
        <div>
        <button onClick={handlePayment}>토스 결제하기</button>
        </div>
    );
});

                                    
export default Index;
