function useResponse(metaData) {
  const file = `package ${metaData.packageName}.utils;

    import org.json.JSONObject;
    
    public class Response {
        public static JSONObject JSONObject(String message) {
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("message", message);
            return jsonResponse;
        }
    
        public static String Error(String message, Object additionalData) {
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("error", message);
    
            if (additionalData != null) {
                jsonResponse.put("data", additionalData);
            }
    
            return jsonResponse.toString();
        }
    }
    `;

  const getFile = () => {
    return {
      type: "file",
      name: `Response.java`,
      content: file,
    };
  };

  return { getFile };
}

export default useResponse;
