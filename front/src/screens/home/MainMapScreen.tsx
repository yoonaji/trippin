import React, { useCallback, useEffect, useRef, useState } from 'react';
import TabMenu from '../../components/ui/home/TabMenu';
import styled from 'styled-components/native';
import BottomSheet, {
  BottomSheetRef,
} from '../../components/ui/home/BottomSheet';
import api from '../../../axiosConfig';
import { showError } from '../../utils/toast';
import { BottomListItem } from '../../types/BottomListItem';
import { PopularPostResponse } from '../../types/PopularPostReponse';
import { FavoritePostResponse } from '../../types/FavoritePostResponse';
import { MarkerData } from '../../types/MarkerData';
import { useLoading } from '../../components/ui/LoadingContext';
import MapView from 'react-native-map-clustering';
import markerImg from '../../assets/images/icon/marker.png';
import markerRed from '../../assets/images/icon/marker_red.png';
import { colors } from '../../styles/colors';
import { Image } from 'react-native';
import { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

type TabType = 'popular' | 'route' | 'favorite';
type ListType = 'popular' | 'favorite' | 'route' | 'place';

type RouteLinePoint = {
  latitude: number;
  longitude: number;
};

const INITIAL_REGION = {
  latitude: 36.5,
  longitude: 127.8,
  latitudeDelta: 5,
  longitudeDelta: 5,
};

const DEFAULT_FAVORITE_REGION = {
  latitude: 37.5,
  longitude: 127,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

const KOREA_BOUNDS = [
  { latitude: 43.0, longitude: 118.0 },
  { latitude: 30.0, longitude: 135.0 },
];

const MainMapScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const [listType, setListType] = useState<ListType>('popular');
  const sheetRef = useRef<BottomSheetRef>(null);
  const [listData, setListData] = useState<BottomListItem[]>([]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [routeLines, setRouteLines] = useState<RouteLinePoint[]>([]);
  const [center, setCenter] = useState({
    latitude: INITIAL_REGION.latitude,
    longitude: INITIAL_REGION.longitude,
  });
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);

  const mapRef = useRef<any>(null);

  const { setLoadingPromise } = useLoading();

  const fetchPopularPosts = useCallback(async () => {
    const res = await setLoadingPromise(
      api.get('/api/posts/popular'),
      '인기 장소 불러오는 중...',
    );

    const data = res.data.data as PopularPostResponse[];

    setListData(
      data.map(item => ({
        type: 'photo',
        photoId: item.photoId,
        postId: item.postId,
        authorName: item.author.name,
        authorProfileImage: item.author.profileImage,
        createdAt: item.createdAt,
        imageUrl: item.imageUrl,
        location: item.marker?.placeName?.replace(/^대한민국\s?/, '') ?? '',
        content: item.content,
        likeCount: item.likeCount,
        commentCount: item.commentCount,
      })),
    );
  }, [setLoadingPromise]);

  const fetchPopularMarkers = useCallback(async () => {
    const res = await api.get('/api/map/markers/popular');
    setMarkers(res.data.data as MarkerData[]);
    setRouteLines([]);
  }, []);

  const fetchFavoritePosts = useCallback(async () => {
    const res = await setLoadingPromise(
      api.get('/api/users/me/favorites'),
      '내가 좋아한 장소 불러오는 중...',
    );

    const data = res.data.data as FavoritePostResponse[];

    setListData(
      data.map(item => ({
        type: 'photo',
        photoId: item.photoId,
        postId: item.postId,
        authorName: item.authorName,
        authorProfileImage: item.authorProfileImage,
        createdAt: item.createdAt,
        imageUrl: item.imageUrl,
        location: item.placeName,
        content: item.content,
        likeCount: item.likeCount,
        commentCount: item.commentCount,
        liked: true,
      })),
    );

    setMarkers(
      data.map(item => ({
        id: item.photoId,
        placeName: item.placeName,
        lat: item.latitude,
        lng: item.longitude,
      })),
    );

    setRouteLines([]);
  }, [setLoadingPromise]);

  const fetchRouteData = useCallback(async () => {
    const res = await setLoadingPromise(
      api.get(
        `/api/map/routes/recommended?lat=${center.latitude}&lng=${center.longitude}&radius=5000`,
      ),
      '추천 경로 불러오는 중...',
    );

    const route = res.data.data[0];

    if (!route) {
      showError('추천 경로를 찾을 수 없습니다.');
      setMarkers([]);
      setRouteLines([]);
      return;
    }

    const routeMarkers: MarkerData[] = route.markers.map((m: any) => ({
      id: m.id,
      placeName: m.placeName,
      lat: m.lat,
      lng: m.lng,
    }));

    setListData([]);
    setMarkers(routeMarkers);

    setRouteLines(
      routeMarkers.map(m => ({
        latitude: m.lat,
        longitude: m.lng,
      })),
    );
  }, [setLoadingPromise, center]);

  const fetchDataByTab = useCallback(async () => {
    try {
      if (activeTab === 'popular') {
        await Promise.all([fetchPopularPosts(), fetchPopularMarkers()]);
        setListType('popular');
      } else if (activeTab === 'favorite') {
        await fetchFavoritePosts();
        setListType('favorite');
      } else if (activeTab === 'route') {
        await fetchRouteData();
        setListType('route');
      }
    } catch (e) {
      console.error(e);
      showError('데이터를 불러오지 못했습니다.');
    }
  }, [
    activeTab,
    fetchPopularPosts,
    fetchPopularMarkers,
    fetchFavoritePosts,
    fetchRouteData,
  ]);

  const handleMarkerPress = useCallback(
    async (marker: MarkerData) => {
      try {
        setSelectedMarkerId(marker.id);

        const res = await setLoadingPromise(
          api.get(`/api/map/markers/${marker.id}/posts`),
          '마커 게시글 불러오는 중...',
        );

        const markerData = res.data?.data;
        const photos = Array.isArray(markerData?.photos)
          ? markerData.photos
          : [];

        const mapped: BottomListItem[] = photos.map((p: any) => ({
          type: 'photo',
          photoId: p.photoId,
          postId: p.postId ?? 0,
          authorName: p.authorName ?? '',
          authorProfileImage: p.authorProfileImage ?? null,
          createdAt: p.createdAt,
          imageUrl: p.imageUrl,
          location: markerData.placeName ?? '',
          content: p.content,
          likeCount: p.likeCount,
          commentCount: p.commentCount,
        }));

        setListData(mapped);
        setListType('place');
      } catch (e) {
        console.error(e);
        showError('마커 게시글을 불러오지 못했습니다.');
      }
    },
    [setLoadingPromise],
  );

  useEffect(() => {
    fetchDataByTab();
    setSelectedMarkerId(null);
  }, [activeTab]);

  useEffect(() => {
    sheetRef.current?.reset();
  }, [listType]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (markers.length === 0) {
      if (activeTab === 'favorite') {
        mapRef.current.animateToRegion(DEFAULT_FAVORITE_REGION, 500);
        return;
      }

      mapRef.current.fitToCoordinates(KOREA_BOUNDS, {
        edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
        animated: true,
      });
      return;
    }

    mapRef.current.fitToCoordinates(
      markers.map(m => ({ latitude: m.lat, longitude: m.lng })),
      {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      },
    );
  }, [markers]);

  return (
    <MapViewContainer>
      <TabMenu activeTab={activeTab} onChange={setActiveTab} />

      <StyledMapView
        ref={mapRef}
        {...({
          clusteringEnabled: true,
          clusterColor: '#4895ef',
          clusterTextColor: '#ffffff',
          clusterFontSize: 14,
        } as any)}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        onRegionChangeComplete={region => {
          if (activeTab === 'route') return;
          setCenter(region);
        }}
      >
        {markers.map(m => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lng }}
            anchor={{ x: 0.5, y: 1 }}
            onPress={() => handleMarkerPress(m)}
          >
            <Image
              source={selectedMarkerId === m.id ? markerRed : markerImg}
              style={{
                width: selectedMarkerId === m.id ? 55 : 40,
                height: selectedMarkerId === m.id ? 78 : 57,
              }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        {activeTab === 'route' && routeLines.length > 1 && (
          <Polyline
            coordinates={routeLines}
            strokeColor={colors.blue3}
            strokeWidth={4}
          />
        )}
      </StyledMapView>

      {activeTab !== 'route' && (
        <BottomSheet
          ref={sheetRef}
          activeTab={listType}
          listData={listData}
          setListData={setListData}
        />
      )}
    </MapViewContainer>
  );
};

export default MainMapScreen;

const MapViewContainer = styled.View`
  flex: 1;
`;

const StyledMapView = styled(MapView)`
  flex: 1;
`;
