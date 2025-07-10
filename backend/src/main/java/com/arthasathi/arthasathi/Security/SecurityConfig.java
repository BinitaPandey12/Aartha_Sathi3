package com.arthasathi.arthasathi.Security;

import com.arthasathi.arthasathi.CustomAccessDeniedHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private CustomAccessDeniedHandler customAccessDeniedHandler;


    public SecurityConfig (JwtAuthenticationFilter jwtAuthenticationFilter,
                           CustomAccessDeniedHandler customAccessDeniedHandler){
        this.jwtAuthenticationFilter=jwtAuthenticationFilter;
        this.customAccessDeniedHandler=customAccessDeniedHandler;
    }



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,CustomAccessDeniedHandler accessDeniedHandler)throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() //for public access without any authentication.
                        .requestMatchers("/api/test/**").permitAll() // Test endpoints
                        .requestMatchers("/api/loan-requests/**").permitAll()
                        .requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/loan-offers").hasAuthority("LENDER")
                                .requestMatchers(HttpMethod.POST, "/api/loan-offers/awaiting-payment").hasAnyAuthority("LENDER","BORROWER")
                                .requestMatchers(HttpMethod.PUT, "/api/loan-offers/mark-paid/{id} ").hasAuthority("LENDER")
                                .requestMatchers("/api/loan-offers/**").permitAll()
                                .requestMatchers(HttpMethod.GET,"/api/loan-requests/accepted-by-me").hasAnyAuthority("LENDER","BORROWER")
//                        .requestMatchers("/api/loan-offers/**").authenticated()// Temporary for testing
                                .requestMatchers("/api/loan-requests/**").permitAll()
                                .requestMatchers("/api/dashboard/**").permitAll() // Temporary for testing
                        .requestMatchers("/api/admin/**").hasAuthority("ADMIN")  //users with role=ADMIN can access it
                        .anyRequest().authenticated()

                )
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .formLogin().disable()
                .httpBasic().disable()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }






}
