import React, { useState, useEffect } from 'react';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import { colors } from '../../styles/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FriendRequestItem from '../../components/ui/friend/FriendRequestItem.tsx';
import { useLoading } from '../../components/ui/LoadingContext.tsx';
import api from '../../../axiosConfig.ts';
import styled from 'styled-components/native';
import { showError, showSuccess } from '../../utils/toast.ts';
import SearchBar from '../../components/ui/SearchBar.tsx';
import FriendSearchModal from '../../components/ui/friend/FriendSearchModal.tsx';

type FriendRequest = {
  requestId: number;
  fromEmail: string;
  nickname: string;
};

const FriendHomeScreen = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [search, setSearch] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { setLoadingPromise } = useLoading();
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) {
          showError('로그인 오류', '로그인 정보를 찾을 수 없습니다.');
          return;
        }

        setUserEmail(email);

        const data = await setLoadingPromise(
          api
            .get('/api/friends/requests/incoming', {
              params: { email },
            })
            .then(res => res.data.data ?? res.data),
          '친구 요청 불러오는 중...',
        );

        if (Array.isArray(data)) {
          setFriendRequests(
            data.map((r: any) => ({
              requestId: r.id,
              fromEmail: r.email,
              nickname: r.nickname,
            })),
          );
        }
      } catch (err: any) {
        showError('불러오기 실패', err.response?.data?.message);
      }
    };

    load();
  }, []);

  const searchFriend = async () => {
    if (!search.trim()) return showError('입력 오류', '이메일을 입력하세요.');

    try {
      const res = await setLoadingPromise(
        api.get('/api/friends/search', {
          params: { email: search.trim() },
        }),
        '친구 검색 중...',
      );

      setSearchResult(res.data);
      setModalVisible(true);
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;

      let message = '검색에 실패했습니다.';

      if (status === 404 && typeof data === 'string') {
        message = data;
      }

      if (typeof data === 'object' && data.message) {
        message = data.message;
      }

      showError('검색 실패', message);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await setLoadingPromise(
        api.post(`/api/friends/requests/${id}/accept`),
        '요청 수락 중...',
      );

      setFriendRequests(prev => prev.filter(r => r.requestId !== id));
      showSuccess('완료', '친구 요청을 수락했습니다.');
    } catch (err: any) {
      showError('수락 실패', err.response?.data?.message);
    }
  };

  const handleReject = async (id: number) => {
    if (!userEmail) return showError('오류', '로그인 정보가 없습니다.');

    try {
      await setLoadingPromise(
        api.post(
          `/api/friends/requests/${id}/reject`,
          {},
          { params: { email: userEmail } },
        ),
        '요청 거절 중...',
      );

      setFriendRequests(prev => prev.filter(r => r.requestId !== id));
      showSuccess('완료', '친구 요청을 거절했습니다.');
    } catch (err: any) {
      showError('거절 실패', err.response?.data?.message);
    }
  };

  const sendFriendRequest = async () => {
    if (!userEmail) return showError('오류', '로그인 정보가 없습니다.');
    if (!search.trim()) return showError('입력 오류', '이메일을 입력하세요.');

    try {
      const res = await setLoadingPromise(
        api.post('/api/friends/requests', {
          fromEmail: userEmail,
          toEmail: search.trim(),
        }),
        '친구 요청 전송 중...',
      );

      showSuccess('전송 완료', `친구 요청이 전송되었습니다.`);
      setModalVisible(false);
      setSearch('');
    } catch (err: any) {
      showError('전송 실패', err.response?.data?.message);
    }
  };

  return (
    <Container>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="이메일로 친구 추가"
        onClear={() => setSearch('')}
        onSearch={searchFriend}
        style={{ marginBottom: 28 }}
      />

      {friendRequests.length === 0 ? (
        <EmptyText>받은 친구 요청이 없습니다.</EmptyText>
      ) : (
        friendRequests.map(item => (
          <FriendRequestItem
            key={item.requestId}
            nickname={item.nickname}
            onAccept={() => handleAccept(item.requestId)}
            onReject={() => handleReject(item.requestId)}
          />
        ))
      )}

      <FriendSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        user={searchResult}
        onSendRequest={sendFriendRequest}
      />
    </Container>
  );
};

export default FriendHomeScreen;

const EmptyText = styled(CustomText)`
  margin-top: 20px;
  text-align: center;
  color: ${colors.gray6};
`;
