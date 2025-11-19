import React, { useEffect } from 'react';
import { SearchBarContainer, SearchIcon, SearchInput } from '../../styles/searchbar';
import searchIcon from '../../assets/images/icon/search.png'; 
import { colors } from '../../styles/colors';

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    style?: object;
};

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = "이메일로 친구 추가",
}) => {
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc1NzEyMjkzNywiZXhwIjoxNzU3MTIzODM3fQ.tKm-W0eOIoAxuRL1cbXTr8b0bE-8HA-AtSxvclCGAAk"; // 실제 토큰으로 교체

    useEffect(() => {
        if (!value) return;

        const fetchData = async () => {
            try {
                const res = await fetch(`/api/friends/search?email=${encodeURIComponent(value)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                console.log("검색 결과:", data);
            } catch (err) {
                console.error("API 호출 에러:", err);
            }
        };

        fetchData();
    }, [value]);

    return (
        <SearchBarContainer>
            <SearchIcon source={searchIcon} />
            <SearchInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.gray8}
            />
        </SearchBarContainer>
    );
};

export default SearchBar;
