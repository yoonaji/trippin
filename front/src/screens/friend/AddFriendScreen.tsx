import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import { colors } from '../../styles/colors';
import SearchBar from './SearchBar.tsx';

import {
  AcceptButton,
  RejectButton,
  ButtonLabel,
  ItemContainer,
  UserName,
} from '../../styles/friendlist.ts';

const ProfileImage = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: gray;
  margin-right: 12px;
  margin-left: 22px;
`;

type FriendRequest = {
  requestId: number; // 서버에서 주는 친구 요청 고유 ID
  fromEmail: string;
  nickname: string;
};

const API_BASE = "http://10.0.2.2:8080/api";//오류나면 이거 확인


const FriendRequestItem = ({
  request,
  onAccept,
  onReject,
}: {
  request: FriendRequest;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}) => (
  <ItemContainer>
    <ProfileImage />
    <UserName>{request.nickname}</UserName>
    <RejectButton onPress={() => onReject(request.requestId)}>
      <ButtonLabel reject>거절</ButtonLabel>
    </RejectButton>
    <AcceptButton onPress={() => onAccept(request.requestId)}>
      <ButtonLabel>수락</ButtonLabel>
    </AcceptButton>
  </ItemContainer>
);
//친구 요청 버튼 추가 필요

const FriendHomeScreen = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [search, setSearch] = useState('');

  // 실제 토큰은 로그인 후 저장된 값 불러오기
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc1ODUwMjcyOSwiZXhwIjoxNzU4NTAzNjI5fQ.jSBnY9z00nHMsp1tdc-aaoEB8GvlFunL-FVyWpEpe4U';
  const fromEmail = 'yoonn__a@gmail.com'; // 로그인 유저 이메일 (예시)

// useEffect에서 데이터 정리
useEffect(() => {
  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/friends/requests/incoming?email=${encodeURIComponent(fromEmail)}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error(`요청 실패: ${res.status}`);
      const data = await res.json();

      const cleanedData: FriendRequest[] = data
        .filter((r: any) => r && r.id && r.nickname)
        .map((r: any) => ({
          requestId: Number(r.id), // 서버 친구 요청 ID
          fromEmail: r.email,
          nickname: r.nickname,
        }));

      setFriendRequests(cleanedData);
    } catch (error) {
      console.error('친구 요청 불러오기 에러:', error);
      setFriendRequests([]);
    }
  };

  fetchRequests();
}, [fromEmail]);

//수락
const handleAccept = async (requestId: number) => {
  try {
    const res = await fetch(`${API_BASE}/friends/requests/${requestId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `수락 실패: ${res.status}`);
    }

    // 성공 시 요청 목록에서 제거
    setFriendRequests(prev => prev.filter(r => r.requestId !== requestId));
  } catch (error: any) {
    console.error('친구 요청 수락 에러:', error.message);
  }
};


const handleReject = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE}/friends/requests/${id}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || `거절 실패: ${res.status}`);
    }

    setFriendRequests(prev => prev.filter(r => r.requestId !== id));
  } catch (error: any) {
    console.error('친구 요청 거절 에러:', error.message);
  }
};

  //친구 요청 보내기
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

const sendFriendRequest = async () => {
  if (!search) {
    setStatusMessage('이메일을 입력하세요.');
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/friends/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fromEmail,
        toEmail: search, // 여기서 이메일을 보내야 함
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || `친구 요청 실패: ${res.status}`);
    }

    setStatusMessage(result.message || '친구 요청 성공');
  } catch (error: any) {
    setStatusMessage(error.message || '친구 요청 에러');
  }
};

  const Block = styled.View`
    flex: 1;
    width: 100%;
    background-color: ${colors.white};
    border-radius: 30px;
    padding: 8px 0 30px 0;
    margin: 18px 0 0 0;
    elevation: 4;
  `;

  return (
    <Container>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="이메일로 친구 추가"
        onClear={() => setSearch('')}
        style={{ marginTop: 16, marginHorizontal: 10 }}
      />
      <Block>
{friendRequests.map(request => (
  <FriendRequestItem
    key={request.requestId}
    request={request}
    onAccept={handleAccept}
    onReject={handleReject}
  />
))}
      </Block>
    </Container>
  );
};

export default FriendHomeScreen;
