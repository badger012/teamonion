import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MyOrderPresenter from './MyOrderPresenter';
import { userOrderAPI } from '../../../api/userApi';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const MyOrderContainer = () => {
  const { me } = useSelector(state => state.user);
  const [orders, setOrders] = useState([]);
  const [changedData, setChangedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const localToken = localStorage.getItem('TOKEN');
  const sessionToken = sessionStorage.getItem('TOKEN');

  const token = localToken
    ? `Bearer ${localToken}`
    : '' || sessionToken
    ? `Bearer ${sessionToken}`
    : '';

  const sockJsProtocols = ['xhr-streaming', 'xhr-polling'];
  // const [currentOrderList, setCurrentOrderList] = useState([]);
  const client = Stomp.over(
    new SockJS('http://teamonion-idev.tmon.co.kr/teamonion', null, {
      headers: { Authorization: token, transports: sockJsProtocols },
    }),
  );

  const socketMyOrderInit = () => {
    if (client.connected === false) {
      client.connect({}, frame => {
        // 의문점 : 콜백 함수안에 들어가면 처음 초기의 빈값이 계속유지됨
        // componentdidmount 라이프 사이클 안에서 실행되서 그런듯하다
        console.log(frame);
        alert(`socket conneted: ${frame}`);
        client.subscribe('/topic/order', msg => {
          console.log('message : ' + msg);
          // const newArrayOrders = [...orders];
          const Data = msg.body && JSON.parse(msg.body);
          setChangedData(Data);
          console.dir(changedData);
        });
        console.log(client);
        // client.send('/api/orders/update', {}, JSON.stringify({ memberId: me.id }));
      });
    }
  };
  useEffect(() => {
    console.log('im in didmount effect');
    const fetchMyOrder = async () => {
      try {
        if (me) {
          const {
            data: { content },
          } = await userOrderAPI(me.id, false);
          // console.log(content);
          setOrders([...content]);
          await socketMyOrderInit(); // 웹 소켓 연결
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchMyOrder();
    setIsLoading(false);
    // console.log(orders);
    return () => {
      try {
        if (client.connected === true) {
          client.disconnect(() => {
            alert('socket disconnected!');
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
  }, []);

  useEffect(() => {
    console.log('im useeffect in somthing');
    console.dir(orders);
    console.dir(changedData);
    if (orders.length > 0 && changedData) {
      console.dir(orders);
      let newOrders = [...orders];
      console.dir(newOrders);
      console.dir(changedData);
      const changedDataIndex = newOrders.findIndex(e => {
        // 변화된 주문정보 찾기
        return e.id === changedData.id;
      });
      console.log('dataindex:' + changedDataIndex);
      if (changedData.pickup === true) {
        // 픽업된 주문정보 삭제
        const ordersWithoutAfterPickup = [
          ...newOrders.slice(0, changedDataIndex),
          ...newOrders.slice(changedDataIndex + 1, newOrders.length),
        ];
        newOrders = [...ordersWithoutAfterPickup];
      } else {
        // 변화만 된 주문정보 변경
        newOrders[changedDataIndex] = {
          ...newOrders[changedDataIndex],
          made: changedData.made,
          paid: changedData.paid,
        };
        console.dir(newOrders[changedDataIndex]);
      }
      console.dir(newOrders);
      setOrders([...newOrders]);
    }
  }, [changedData]);

  return (
    <>
      <MyOrderPresenter
        isLoading={isLoading}
        orders={orders}
        setOrders={setOrders}
        userId={me.id}
      />
    </>
  );
};

export default MyOrderContainer;
