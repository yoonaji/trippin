import searchIcon from '../../assets/images/icon/search.png';
import { colors } from '../../styles/colors';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onSearch?: () => void;
  style?: object;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = '이메일로 친구 추가',
  onSearch,
}) => {
  return (
    <SearchBarContainer style={{ marginBottom: 30 }}>
      <SearchIcon source={searchIcon} />
      <SearchInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray8}
      />
      <TouchableOpacity onPress={onSearch}>
        <SearchIcon source={searchIcon} />
      </TouchableOpacity>
    </SearchBarContainer>
  );
};
export default SearchBar;

const SearchBarContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.white};
  border-radius: 15px;
  padding: 8px 12px;
  elevation: 4;
`;

const SearchIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: ${colors.gray8};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: ${colors.gray8};
  padding: 0 8px;
  background-color: transparent;
`;
