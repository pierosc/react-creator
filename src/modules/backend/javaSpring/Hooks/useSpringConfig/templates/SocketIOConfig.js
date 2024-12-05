export const getSocketIOConfig = (metaData) => {
  return `package ${metaData.group}.config;
  
import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
  
@Configuration
public class SocketIOConfig {

    @Bean
    public SocketIOServer socketIOServer() {
        Configuration config = new Configuration();
        config.setHostname("localhost");
        config.setPort(9092); // Puerto para Socket.IO
        return new SocketIOServer(config);
    }
}`;
};
