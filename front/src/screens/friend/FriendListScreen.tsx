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
    border-radius: 40px;
    border-width: 1px;
    background-color: ${colors.blue };
    border-color: ${colors.cream};

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

const ButtonText = styled.Text`
    color: ${colors.gray8};
    font-size: 13px;
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
            <ButtonText>친구삭제</ButtonText>
        </DeleteButton>
    </ItemContainer>
);


const FriendHomeScreen = () => {
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [search, setSearch] = useState('');

    const access_token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc2MzAyNDY3MywiZXhwIjoxNzYzMDI1NTczfQ.0QZl742rgv0jpitl2YL22OiXW4W4owTK2ZslTszV3yM';   // 실제 토큰으로 변경?
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
const onDeleteFriend = async (friendEmail: string) => {
    try {
        const response = await fetch(
        `http://10.0.2.2:8080/api/friends/${encodeURIComponent(friendEmail)}`,
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

    // 서버가 단순 메시지 반환한다고 가정
    const result = await response.text(); 
    if (result.includes('UNFRIENDED')) {
        setFriendRequests(prev => prev.filter(f => f.email !== friendEmail));
    }
    } catch (error) {
    console.error('삭제 중 오류 발생: ', error);
    }
};


const filteredFriends = friendRequests.filter(friend => {
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

            {/* <Block> */}
                {filteredFriends.map(request => (
                    <FriendRequestItem
                        key={request.id}
                        request={request}
                        onDelete={onDeleteFriend}
                    />
                ))}
            {/* </Block> */}
        </Container>
    );
};

export default FriendHomeScreen;
