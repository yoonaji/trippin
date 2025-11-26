import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import { colors } from '../../styles/colors';
import api from '../../../axiosConfig.ts';
import { showError, showSuccess } from '../../utils/toast.ts';
import FriendListItem from '../../components/ui/friend/FriendListItem.tsx';
import SearchBar from '../../components/ui/SearchBar.tsx';

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
        placeholder="친구 검색"
        onClear={() => setSearch('')}
        style={{ marginBottom: 28 }}
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
