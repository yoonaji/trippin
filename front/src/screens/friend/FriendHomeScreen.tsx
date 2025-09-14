import React, { useState, useEffect  } from 'react';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import IconButton from '../../components/buttons/IconButton';
import plus from '../../assets/images/icon/plus.png';
import listIcon from '../../assets/images/icon/listIcon.png'; 
// import userAddIcon from '../../assets/images/icon/userAddIcon.png'; 
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FriendStackParam } from './FriendStack';
import { useNavigation } from '@react-navigation/native';
import { Text, View ,Image, ScrollView} from 'react-native';
import { Block, Header, UserInfo, ProfileImage, UserName, IconGroup, IconImage, ContentRow, LeftImage, InfoArea } from '../../styles/write.ts';
import heartIcon from '../../assets/images/icon/heart.png';
import chatIcon from '../../assets/images/icon/chat.png';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import SearchBar from './SearchBar.tsx'; 
import stadium from '../../assets/images/data/sample_stadium.png';

type Navigation = NativeStackNavigationProp<FriendStackParam>;

const API_BASE = "http://10.0.2.2:8080";

  // 버튼 컨테이너
const FloatingButtonContainer = styled.View`
  position: absolute;
  bottom: 8px;
  right: 30px;
  flex-direction: column;
  align-items: center;
`;

const FloatingButtonWrapper = styled.View`
  background-color:  ${colors.blue};
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px; 
`;


const FriendHomeScreen = () => {
  const navigation = useNavigation<Navigation>();
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/friends/feed`);
        const json = await res.json();
        if (json.status === 200) {
          setPosts(json.data);
        } else {
          console.error("API Error:", json.message);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);



return (
  <Container>
    <SearchBar
      value={email}
      onChangeText={setEmail}
      placeholder="이메일로 친구 추가"
      onClear={() => setEmail('')}
      style={{ marginTop: 16, marginHorizontal: 10 }}
    />

    <ScrollView
      showsVerticalScrollIndicator={false}
    >
        {posts.map((post) => (
          <Block key={post.postId}>
            <Header>
              <UserInfo>
                {post.authorProfileImage ? (
                  <ProfileImage source={{ uri: post.authorProfileImage }} />
                ) : (
                  <ProfileImage />
                )}
                <UserName>{post.authorName}</UserName>
              </UserInfo>
            </Header>

            <ContentRow style={{ marginTop: 16 }}>
              <LeftImage source={{ uri: post.thumbnailUrl }} />
              <InfoArea>
                <CustomText style={{ marginBottom: 6, fontSize: 15 }}>
                  {post.title}
                </CustomText>
                <CustomText style={{ fontSize: 13, color: colors.gray8 }}>
                  {/* 위에 gray 색체크 */}
                  {post.period}
                </CustomText>
              </InfoArea>
            </ContentRow>

            <IconGroup style={{ marginTop: 6 }}>
              <IconImage source={heartIcon} />
              <IconImage source={chatIcon} />
            </IconGroup>
          </Block>
        ))}
    </ScrollView>

      <FloatingButtonContainer>
        <FloatingButtonWrapper>
          <IconButton icon={listIcon} size={25} color= {colors.white} onPress={() => navigation.navigate('FriendListScreen')} />
        </FloatingButtonWrapper>

        <FloatingButtonWrapper>
          <IconButton icon={plus} size={35} color={colors.white} onPress={() => navigation.navigate('AddFriendScreen')} />
        </FloatingButtonWrapper>

      </FloatingButtonContainer>
    </Container>
  );
};

export default FriendHomeScreen;
