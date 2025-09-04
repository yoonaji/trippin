package com.springboot.be.security.oauth2;

import com.springboot.be.entity.OAuthUser;
import com.springboot.be.entity.User;
import com.springboot.be.repository.OAuthUserRepository;
import com.springboot.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomOauthService extends DefaultOAuth2UserService {

    private final OAuthUserRepository oAuthUserRepository;
    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("loadUser 시작");
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println("registraionId 받아오기 시작");
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        System.out.println("registraionId : " + registrationId + "usernameAttribute 받아오기 시작");
        String userNameAttribute = userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        OAuth2Attribute attributes = OAuth2Attribute.of(registrationId, userNameAttribute, oAuth2User.getAttributes());
        Map<String, Object> attributeMap = attributes.convertToMap();
        System.out.println("providerId 받아오기 시작");
        String providerId = attributes.getProviderId();
        System.out.println("providerId : " + providerId);
        String email = attributes.getEmail();
        System.out.println("email : " + email);
        System.out.println("registrationId : " + registrationId);

        Optional<OAuthUser> oAuthUserOpt = oAuthUserRepository.findByProviderAndProviderId(registrationId, providerId);

        User user;
        if (oAuthUserOpt.isPresent()) {
            user = oAuthUserOpt.get().getUser();
            System.out.println("찾았다!!!");
        } else {
            user = userRepository.findByEmail(email).orElseGet(() ->
                    userRepository.save(User.builder()
                            .email(email)
                            .username(attributes.getName())
                            .role("ROLE_USER")
                            .birthDate(attributes.getBirthDate())
                            .age(attributes.getAge())
                            .gender(attributes.getGender())
                            .build()));

            OAuthUser oAuthUser = OAuthUser.builder()
                    .provider(registrationId)
                    .providerId(providerId)
                    .user(user)
                    .build();
            oAuthUserRepository.save(oAuthUser);

            System.out.println("User saved: " + user.getId() + ", " + user.getEmail());
        }

        System.out.println("Attributes from OAuth provider: " + attributeMap);


        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                attributeMap,
                "email"
        );

    }
}
