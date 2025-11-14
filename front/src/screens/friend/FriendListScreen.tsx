import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import { colors } from '../../styles/colors';
import SearchBar from './SearchBar.tsx';
import api from '../../../axiosConfig.ts';
import { showError, showSuccess } from '../../utils/toast.ts';
import FriendListItem from '../../components/ui/friend/FriendListItem.tsx';

type Friend = {
  id: number;
  nickname: string;
  email: string;
};

const FriendListScreen = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState('');

  const fetchFriends = async () => {
    try {
      const res = await api.get('/api/friends');
      const data = res.data;

      if (Array.isArray(data)) {
        setFriends(data);
      } else {
        setFriends([]);
      }
    } catch (error: any) {
      console.error('친구 목록 불러오기 오류:', error);
      showError('불러오기 실패', error.response?.data?.message);
    }
  };

  const deleteFriend = async (email: string) => {
    try {
      const res = await api.delete(`/api/friends/${encodeURIComponent(email)}`);
      const msg = res.data?.message;

      if (msg?.includes('UNFRIENDED')) {
        setFriends(prev => prev.filter(f => f.email !== email));
        showSuccess('삭제 완료', '친구가 삭제되었습니다.');
      }
    } catch (error: any) {
      console.error('친구 삭제 오류:', error);
      showError('삭제 실패', error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const filteredFriends = friends.filter(friend => {
    const searchText = search.toLowerCase();
    if (!searchText) {
      return true;
    }
    const nicknameMatch = friend.nickname.toLowerCase().includes(searchText);
    const emailMatch = friend.email.toLowerCase().includes(searchText);
    return nicknameMatch || emailMatch;
  });

  return (
    <Container>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="이메일로 친구 검색"
        onClear={() => setSearch('')}
        style={{ marginTop: 16, marginHorizontal: 10 }}
      />

      {filteredFriends.map(friend => (
        <FriendListItem
          key={friend.id}
          nickname={friend.nickname}
          email={friend.email}
          onDelete={deleteFriend}
        />
      ))}
    </Container>
  );
};

export default FriendListScreen;

const ProfileImage = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: gray;
  margin-right: 12px;
  margin-left: 22px;
`;

const DeleteButton = styled.TouchableOpacity`
  margin-left: auto;
  margin-right: 20px;
  padding: 6px 12px;
  border-radius: 40px;
  border-width: 1px;
  background-color: ${colors.blue};
  border-color: ${colors.cream};
`;

const ButtonText = styled.Text`
  color: ${colors.gray8};
  font-size: 13px;
`;

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 0.5px;
  border-color: ${colors.gray2};
`;

const UserName = styled.Text`
  flex: 1;
  font-weight: bold;
  font-size: 16px;
  color: ${colors.gray8};
`;
