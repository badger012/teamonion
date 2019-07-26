import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MyOrderPresenter from './MyOrderPresenter';
import { userOrderAPI } from '../../../api/userApi';

const MyOrderContainer = () => {
  const { me } = useSelector(state => state.user);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyOrder() {
      try {
        if (me) {
          const {
            data: { content },
          } = await userOrderAPI(me.id, false);
          console.log(content);
          setOrders(content);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchMyOrder();
    setIsLoading(false);
    console.log(orders);
  }, []);

  // const dummyOrders = [
  //   {
  //     pickup: false,
  //     paid: '결제완료',
  //     made: '제작중',
  //     menu: ['아메리카노', '더치커피'],
  //   },
  //   {
  //     pickup: false,
  //     paid: '미결제',
  //     made: '제작완료',
  //     menu: ['아메리카노', '더치커피', '아포카토'],
  //   },
  // ];

  return (
    <MyOrderPresenter isLoading={isLoading} orders={orders} setOrders={setOrders} userId={me.id} />
  );
};

export default MyOrderContainer;
