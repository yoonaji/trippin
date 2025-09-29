import React, { useState } from 'react';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Block, Header, UserInfo, ProfileImage, UserName, IconGroup, IconImage, ContentRow, LeftImage, InfoArea } from '../../styles/write.ts';
import heartIcon from '../../assets/images/icon/filledheart.png';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import chatIcon from '../../assets/images/icon/chat.png';
import { HeaderRow } from './InfoEditScreen.tsx';
import IconButton from '../../components/buttons/IconButton';
import heart from '../../assets/images/icon/hearthin.png';
import { TouchableOpacity } from 'react-native';
import EachPostScreen from './EachPostScreen';
import { PostType, MyPageStackParam } from './MyPageStack.tsx';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface LikedPostType {
    id: string;
    userName: string;
    location: string;
    date: string;
    text: string;
    image: string;
}

// styled-components는 기존과 동일
const FloatingButtonContainer = styled.View`
    position: absolute;
    bottom: 8px;
    right: 30px;
    flex-direction: column;
    align-items: center;
`;

const FloatingButtonWrapper = styled.View`
    background-color: ${colors.blue};
    width: 35px;
    height: 35px;
    border-radius: 35px;
    justify-content: center;
    align-items: center;
    margin-bottom: -10px;
    margin-right: 10px;
`;

const Divider = styled.View`
    height: .7px;
    background-color: ${colors.gray2};
    width: 100%;
    margin-bottom: 5px;
    margin-top: 5px;
`;

const LikedScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<MyPageStackParam>>();
    const [posts, setPosts] = useState<LikedPostType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const access_token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc1NzQxNzc3NiwiZXhwIjoxNzU3NDE4Njc2fQ.XvNlwU5Ulc1sUjy5xEn-zDnN9qwHMDG0OPU6DGdnWxQ'; 

    React.useEffect(() => {
        const fetchFavoritePosts = async () => {
            if (!access_token) {
                console.log('액세스 토큰이 없어 API 요청을 건너뜁니다.');
                setLoading(false);
                setError('액세스 토큰이 없습니다.');
                return;
            }
            
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch('http://10.0.2.2:8080/api/users/me/favorites', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                });

                if (!response.ok) {
                    const errorText = `네트워크 오류: ${response.status} ${response.statusText}`;
                    console.error('API 요청 실패:', errorText);
                    throw new Error(errorText);
                }

                const json = await response.json();
                const postsArray = Array.isArray(json) ? json : json.data;
                setPosts(postsArray);
                console.log('API 요청 성공:', postsArray);


            } catch (err: any) {
                console.error('API 요청 중 오류 발생:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritePosts();
    }, [access_token]); // access_token이 변경될 때마다 이 훅이 다시 실행됩니다.

    if (loading) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.blue} />
                <Text style={{ marginTop: 10 }}>게시물을 불러오는 중...</Text>
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>게시물을 불러오는 데 실패했습니다.</Text>
                <Text style={{ color: 'red', marginTop: 5 }}>오류: {error}</Text>
            </Container>
        );
    }

    if (posts.length === 0) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <HeaderRow>
                    <CustomText style={{ fontSize: 16, fontWeight: "700", color: colors.blue }}>
                        <FloatingButtonContainer>
                            <FloatingButtonWrapper>
                                <IconButton icon={heart} size={25} />
                            </FloatingButtonWrapper>
                        </FloatingButtonContainer>
                        좋아요
                    </CustomText>
                </HeaderRow>
                <Text style={{ marginTop: 20 }}>찜한 게시물이 아직 없습니다.</Text>
            </Container>
        );
    }

    return (
        <Container>
            <ScrollView showsVerticalScrollIndicator={false}>
                <HeaderRow>
                    <CustomText style={{ fontSize: 16, fontWeight: "700", color: colors.blue }}>
                        <FloatingButtonContainer>
                            <FloatingButtonWrapper>
                                <IconButton icon={heart} size={25} />
                            </FloatingButtonWrapper>
                        </FloatingButtonContainer>
                        좋아요
                    </CustomText>
                </HeaderRow>
                {posts.map((post) => (
                    <TouchableOpacity
                        key={post.id}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('EachPostScreen', { post })}
                    >
                        <Block>
                            <Header>
                                <UserInfo>
                                    <ProfileImage />
                                    <UserName>{post.userName}</UserName>
                                </UserInfo>
                            </Header>
                            <UserName style={{ marginTop: 16, fontWeight: 'normal', fontSize: 16 }}>
                                <ContentRow>
                                    <LeftImage source={{ uri: post.image }} />
                                    <InfoArea>
                                        <CustomText style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 2 }}>
                                            {post.location}
                                        </CustomText>
                                        <CustomText style={{ fontSize: 12, marginBottom: 3 }}>
                                            {post.date}
                                        </CustomText>
                                        <Divider />
                                        <CustomText style={{ fontSize: 12 }}>
                                            {post.text}
                                        </CustomText>
                                        <IconGroup style={{ marginTop: 10 }}>
                                            <IconImage source={heartIcon} style={{ width: 22, height: 20, tintColor: '#F48B8B' }} />
                                            <IconImage source={chatIcon} />
                                        </IconGroup>
                                    </InfoArea>
                                </ContentRow>
                            </UserName>
                        </Block>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Container>
    );
};

export default LikedScreen;
