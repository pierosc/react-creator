function useConverter(metaData) {
  const file = `package ${metaData.packageName}.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.json.JSONArray;
import java.util.List;

public class Converter {

    /**
     * Converts a list of any type of entities to a JSONArray.
     * 
     * @param <T>        the type of the objects in the list
     * @param entityList The list of entities to convert.
     * @return JSONArray representing the list of entities.
     */
    public static <T> JSONArray ListToJsonArray(List<T> entityList) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(SerializationFeature.INDENT_OUTPUT); // Optional, for pretty printing
        try {
            // Convert list to JSON string
            String jsonString = mapper.writeValueAsString(entityList);
            // Convert JSON string to JSONArray
            return new JSONArray(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            return new JSONArray(); // Return an empty array in case of error
        }
    }
}`;
  const getFile = () => {
    return {
      type: "file",
      name: `Converter.java`,
      content: file,
    };
  };

  return { getFile };
}

export default useConverter;
