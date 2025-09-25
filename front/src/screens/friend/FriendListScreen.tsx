import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import { colors } from '../../styles/colors';
import SearchBar from './SearchBar.tsx'; 
import { Text} from 'react-native';

import {
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

const DeleteButton = styled.TouchableOpacity`
    margin-left: auto;
    margin-right: 20px;
    padding: 6px 12px;
    background-color: ${colors.gray1};
    border-radius: 10px;
`;

const Block = styled.View`
        flex: 1;
        width: 100%;
        background-color: ${colors.white};
        border-radius: 30px;
        padding: 8px 0 30px 0;
        margin: 18px 0 0 0;
        elevation: 4;
`;

type FriendRequest = {
    id: number;               // API에 맞게 number 타입
    nickname: string;
    email: string;

};

type FriendRequestItemProps = {
    request: FriendRequest;
    onDelete: (email: string) => void;
};

const FriendRequestItem = ({
    request, onDelete
}: FriendRequestItemProps) => (
    <ItemContainer>
        <ProfileImage />
        <UserName>{request.nickname}</UserName>
        <DeleteButton onPress={() => onDelete(request.email!)}>
            <Text>친구삭제</Text>
        </DeleteButton>
    </ItemContainer>
);


const FriendHomeScreen = () => {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [search, setSearch] = useState('');

    const access_token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc1ODUwMjcyOSwiZXhwIjoxNzU4NTAzNjI5fQ.jSBnY9z00nHMsp1tdc-aaoEB8GvlFunL-FVyWpEpe4U';   // 실제 토큰으로 변경?
    const userEmail = 'yoonn__a@gmail.com';      
    
    
  // 친구 목록 API 
useEffect(() => {
    const fetchFriends = async () => {
        try {
        const response = await fetch(`http://10.0.2.2:8080/api/friends?email=${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${access_token}`,
        },
        });
        if (!response.ok) {
            console.error('친구 목록 불러오기 실패:', response.status);
            return;
        }
        const data = await response.json();
        const friends: FriendRequest[] = data.map((item: any) => ({
            id: item.id,
            nickname: item.nickname,
            email: item.email,
        }));
        setFriendRequests(friends);
        } catch (error) {
            console.error('친구 목록 불러오기 오류:', error);
        }
    };
    fetchFriends();
}, [userEmail]);



// 친구 삭제 함수
const onDeleteFriend = async (bEmail: string) => {
  try { 
    const response = await fetch(
  `http://10.0.2.2:8080/api/friends?aEmail=${encodeURIComponent(userEmail)}&bEmail=${encodeURIComponent(bEmail)}`,
  {
    method: 'DELETE',
    headers: {
        'Authorization': `Bearer ${access_token}`,
    },
    }
);
    if (!response.ok) {
        console.error('삭제 요청 실패:', response.status);
        return;
    }
    const result = await response.text(); // 서버가 단순 메시지 반환하면 text()
    if (result.includes('UNFRIENDED')) {
        setFriendRequests(prev => prev.filter(f => f.email !== bEmail));
    }
    } catch (error) {
    console.error('삭제 중 오류 발생: ', error);
    }
};


    return (
        <Container>
            <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="이메일로 친구 검색"
                onClear={() => setSearch('')}
                style={{ marginTop: 16, marginHorizontal: 10 }}
            />

            <Block>
                {friendRequests.map(request => (
                    <FriendRequestItem
                        key={request.id}
                        request={request}
                        onDelete={onDeleteFriend}
                    />
                ))}
            </Block>
        </Container>
    );
};

export default FriendHomeScreen;
