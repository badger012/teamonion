import React, { useState, useEffect } from 'react';
import AdminOrderManagePresenter from './AdminOrderManagePresenter';
import getNonpickupAll from '../../../api/adminOrderApi';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const AdminOrderManageContainer = () => {
  const [currentOrderList, setCurrentOrderList] = useState([]);
  const localToken = localStorage.getItem('TOKEN');
  const sessionToken = sessionStorage.getItem('TOKEN');
  const token = localToken
    ? `Bearer ${localToken}`
    : '' || sessionToken
    ? `Bearer ${sessionToken}`
    : '';
  const client = Stomp.over(new SockJS('/teamonion', null, { Authorization: token }));
  console.log(client);

  const socketOrderInit = () => {
    client.connect({}, frame => {
      alert(`socket conneted: ${frame}`);
      client.subscribe('/topic/order', msg => {
        const res = JSON.parse(msg.body).content;
        const arrangedList = res.map(item => {
          return {
            order_id: item.id,
            menus: item.menuNameList,
            paymentType: item.paymentType,
            paid: item.paid,
            made: item.made,
            pickup: item.pickup,
            createdDate: item.createdDate,
            amount: item.amount,
            member_id: item.buyerId,
          };
        });
        setCurrentOrderList(arrangedList);
      });
    });
  };
  const socketSetOrderState = ({ order_id, member_id }, change) => {
    const payload = Object.assign({ orderId: order_id, buyerId: member_id }, change);

    client.send('api/orders/update', {}, JSON.stringify(payload));
  };

  const setOrderState = (orderId, stateToSet) => {
    // ex) setOrderState( 주문번호, { made: true } )
    const arrToReplace = currentOrderList.map(item =>
      item.order_id === orderId ? Object.assign(item, stateToSet) : item,
    );
    setCurrentOrderList(arrToReplace);
  };

  // 최초 api call
  useEffect(() => {
    socketOrderInit();
    return () => {
      client.disconnect(() => {
        alert('socket disconnected!');
      });
    };
  }, []);

  return (
    <AdminOrderManagePresenter
      currentOrderList={currentOrderList}
      setCurrentOrderList={setOrderState}
      socketSetOrderState={socketSetOrderState}
    />
  );
};

export default AdminOrderManageContainer;
