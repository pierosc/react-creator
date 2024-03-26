import { UCC } from "../StringFunctions";

function useApplication(artifactId) {
  const file = `package com.${artifactId};

  import org.modelmapper.ModelMapper;
  import org.modelmapper.convention.MatchingStrategies;
  import org.springframework.boot.SpringApplication;
  import org.springframework.boot.autoconfigure.SpringBootApplication;
  import org.springframework.context.annotation.Bean;
  
  @SpringBootApplication
  public class ${UCC(artifactId)}Application {
  
      public static void main(String[] args) {
          SpringApplication.run(${UCC(artifactId)}Application.class, args);
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
      name: `${UCC(artifactId)}Application.java`,
      content: file,
    };
  };
  return { getFile };
}

export default useApplication;
