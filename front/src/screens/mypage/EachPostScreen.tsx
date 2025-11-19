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

const CommentBlock = styled.View`
    margin-bottom: 10px;
    padding: 10px 12px;
    background-color: #fff;
    border-radius: 20px;
    border-width: 1px;
    border-color: ${colors.gray2};
  
`;

const CommentUser = styled.Text`
    font-weight: bold;
    font-size: 14px;
`;

const CommentText = styled.Text`
    font-size: 14px;
    margin-top: 2px;
`;

const EditButton = styled.Text`
    background-color: ${colors.blue};
    color: #fff;
    padding: 14px 120px;
    border-radius: 30px;
    font-weight: bold;
    font-size: 16px;
    overflow: hidden;
    text-align: center;
`;

const EachPostScreen = () => {
    const route = useRoute<EachPostScreenRouteProp>();
    const { post } = route.params;

    const comments = [
        { user: 'Jiwon', text: '재밌었어? 다음에 같이 가자' },
        { user: 'YUJIN', text: '먹으러 감?' },
        { user: 'ID857', text: '나도 오늘 대구 다녀왔어' },
    ];

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
            <View style={{ marginTop: 12 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>
                인생 첫 대구 방문
                </Text>
                <Text style={{ color: colors.gray4, fontSize: 13, marginBottom: 10 }}>
                {post.date} | {post.location}
                </Text>
                
                <Text style={{ fontSize: 15, marginBottom: 12, lineHeight: 20 }}>{post.text}</Text>
            </View>

            <View style={{ marginTop: 10 }}>
                {comments.map((cmt, idx) => (
                <CommentBlock key={idx}>
                    <CommentUser>{cmt.user}</CommentUser>
                    <CommentText>{cmt.text}</CommentText>
                </CommentBlock>
                ))}
            </View>
        </ContentColumn>
        </Block>

        <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <EditButton>수정하기</EditButton>
        </View>
    </ScrollView>
    </Container>
    );
};

export default EachPostScreen;
