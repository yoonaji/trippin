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
  style,
}) => {
  return (
    <SearchBarContainer style={style}>
      <SearchInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.gray5}
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
  padding: 12px 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.gray7};
`;

const SearchIcon = styled.Image`
  width: 20px;
  height: 20px;
  tint-color: ${colors.gray7};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: ${colors.gray7};
  padding: 0;
  background-color: transparent;
`;
