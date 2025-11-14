import React, { useEffect } from 'react';
import { SearchBarContainer, SearchIcon, SearchInput } from '../../styles/searchbar';
import searchIcon from '../../assets/images/icon/search.png'; 
import { colors } from '../../styles/colors';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native'; 

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
    placeholder = "이메일로 친구 추가",
    onSearch,
}) => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhQGdtYWlsLmNvbSIsImNhdGVnb3J5IjoiYWNjZXNzIiwiaWF0IjoxNzYyOTU1NzE5LCJleHAiOjE3NjI5NTY2MTl9.YdOIVQykKt6liaMJl28zB4Fd6cCwZl9yiXe96juiN9k"; // 실제 토큰으로 교체

    // useEffect(() => {
    //     if (!value) return;

    //     const fetchData = async () => {
    //         try {
    //             const res = await fetch(`/api/friends/search?email=${encodeURIComponent(value)}`, {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${token}`,
    //                 },
    //             });
    //             const data = await res.json();
    //             console.log("검색 결과:", data);
    //         } catch (err) {
    //             console.error("API 호출 에러:", err);
    //         }
    //     };

    //     fetchData();
    // }, [value]);

    return (
        <SearchBarContainer style={{ marginBottom: 30 }}>

            <SearchIcon source={searchIcon} />
            <SearchInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.gray8}
            />
        <TouchableOpacity onPress={onSearch}> {/*  클릭 시 onSearch 실행 */}
            <SearchIcon source={searchIcon} />
        </TouchableOpacity>

        </SearchBarContainer>
    );
};



export default SearchBar;

