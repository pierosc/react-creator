import { UCC } from "../StringFunctions";

function useApplication(metaData) {
  const file = `package ${metaData.packageName};

  import org.modelmapper.ModelMapper;
  import org.modelmapper.convention.MatchingStrategies;
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.context.annotation.Bean;
  
  @SpringBootApplication
  public class ${UCC(metaData.name)}Application {
  
      public static void main(String[] args) {
          SpringApplication.run(${UCC(metaData.name)}Application.class, args);
      }
  
      @Bean
      public ModelMapper modelMapper() {
  
          ModelMapper modelMapper = new ModelMapper();
          modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
          modelMapper.getConfiguration().setSkipNullEnabled(true);
          return modelMapper;
      }
  
  }`;
  const getFile = () => {
    return {
      type: "file",
      name: `${UCC(metaData.name)}Application.java`,
      content: file,
    };
  };
  return { getFile };
}

export default useApplication;
