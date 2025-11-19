import React from 'react';
import { ScrollView, View, Text, ImageSourcePropType, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Container } from '../../styles/GlobalStyles';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import { Block, Header, UserInfo, ProfileImage, UserName, IconGroup, IconImage, ContentRow, LeftImage, InfoArea } from '../../styles/write.ts';

type PostType = {
    userName: string;
    location: string;
    date: string;
    text: string;
    image?: ImageSourcePropType;
};

type MyPageStackParam = {
    EachPostScreen: { post: PostType };
};

type EachPostScreenRouteProp = RouteProp<MyPageStackParam, 'EachPostScreen'>;


const ContentColumn = styled.View`
    flex-direction: column;
    width: 100%;
`;

const PostImage = styled.Image`
    width: 220px;
    height: 220px;
    margin-top: 10px;
    margin-left: 60px;

`;


const EditButton = styled.Text`
    background-color: ${colors.blue};
    color: ${colors.white};
    padding: 14px 120px;
    border-radius: 30px;
    font-weight: bold;
    font-size: 16px;
    overflow: hidden;
    text-align: center;
`;
// 추가: 장소/날짜 블록 스타일
const InfoBlock = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: ${colors.white};
    padding: 10px 14px;
    border-radius: 12px;
    margin-bottom: 10px;
    border-width: 1px;
    border-color: ${colors.gray2};
`;

const InfoText = styled.Text`
    font-size: 14px;
    margin-left: 8px;
    width: 260px;

`;

// 아이콘 (수정예정)
const InfoIcon = styled.View`
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: ${colors.blue};
`;


const EachPostScreen = () => {
    const route = useRoute<EachPostScreenRouteProp>();
    const { post } = route.params;


return (
    <Container style={{ backgroundColor: colors.white }}>
    <ScrollView showsVerticalScrollIndicator={false}>
        <Block>
          {/* 유저 정보 */}
            <Header>
            <UserInfo>
                <ProfileImage />
                <UserName>{post.userName}</UserName>
            </UserInfo>
            </Header>

            <ContentColumn>
            {post.image && <PostImage source={post.image} resizeMode="cover" />}

            {/* 날짜 / 장소 - 하드코딩 */}
            <View style={{ marginTop: 16 }}>
                <InfoBlock>
                <InfoIcon />
                <InfoText>대전한화생명이글스파크</InfoText>
                </InfoBlock>

                <InfoBlock>
                <InfoIcon />
                <InfoText>2025.03.04 오후 05:00</InfoText>
                </InfoBlock>
            </View>

            {/* 본문 텍스트 */}
                <InfoBlock>
                <InfoIcon />

                <InfoText>

                대전에 있는 야구장에 갔다. 날이 따뜻하고 맛있는 음식도 먹고 좋아하는 팀의 경기도 봐서 재미있었던 하루였다.

                </InfoText>
                </InfoBlock>

            </ContentColumn>
        </Block>

        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <EditButton>업로드하기</EditButton>
        </View>
        </ScrollView>
    </Container>
  );
};

export default EachPostScreen;
