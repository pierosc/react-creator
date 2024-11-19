export const getWebClientConfig = (metaData) => `
package ${metaData.group}.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import reactor.netty.tcp.TcpClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;
import java.time.Duration;

@Configuration
// @EnableConfigurationProperties(ExternalApiProperties.class)
public class WebClientConfig {

    // private final ExternalApiProperties externalApiProperties;

    // public WebClientConfig(ExternalApiProperties externalApiProperties) {
    // this.externalApiProperties = externalApiProperties;
    // }

    @Bean
    public WebClient webClient(WebClient.Builder builder) {

        // Configure the HttpClient directly
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000) // Connection Timeout
                .responseTimeout(Duration.ofSeconds(10)) // Response Timeout
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(10)) // Read Timeout
                        .addHandlerLast(new WriteTimeoutHandler(10))); // Write Timeout

        return builder.baseUrl("http://172.17.32.97:8080/")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }
}
`;
