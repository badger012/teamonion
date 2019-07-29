import React, { useState, useEffect } from 'react';
import AdminMemberManagePresenter from './AdminMemberManagePresenter';
import { getUserList, setUserPoint, searchUser } from '../../../api/userApi';

const AdminMemberManageContainer = () => {
  const [memberListData, setMemberListData] = useState([]);
  const [memberListPageData, setMemberPageData] = useState({});

  const getUserByPage = ({ itemSize, page }) => {
    getUserList({ itemSize, page })
      .then(res => {
        const { content, totalPages, size } = res.data;
        setMemberListData(content);
        setMemberPageData({ page, totalPages, itemSize: size });
      })
      .catch(err => alert(`userList 가져오기 실패: ${err}`));
  };

  const setPoint = ({ id, changePoint }) => {
    setUserPoint({ id, changePoint })
      .then(() => {
        const result = memberListData.map(item =>
          item.id === id ? { ...item, point: changePoint } : item,
        );
        setMemberListData(result);
      })
      .catch(err => {
        alert(`포인트 수정 실패 : ${err}`);
        console.dir(err);
      });
  };

  const searchUserByID = async memberId => {
    try {
      const userList = await searchUser(memberId);
      setMemberListData(userList.data.content);
    } catch (err) {
      alert(`유저검색 실패 : ${err}`);
    }
  };

  useEffect(() => {
    getUserByPage({ itemSize: 10, page: 0 });
  }, []);

  return (
    <AdminMemberManagePresenter
      memberListData={memberListData}
      memberListPageData={memberListPageData}
      setPoint={setPoint}
      getUserByPage={getUserByPage}
      searchUserByID={searchUserByID}
    />
  );
};

export default AdminMemberManageContainer;
