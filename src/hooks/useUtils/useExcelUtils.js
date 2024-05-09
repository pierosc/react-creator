function useExcelUtils(metaData) {
  const file = `
    package ${metaData.packageName}.utils;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.List;
import java.lang.reflect.Type;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

public class ExcelUtils {

    public static ResponseEntity<Resource> easyExcelDownloader(String filename, ByteArrayOutputStream archivo) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
        ByteArrayResource resource = new ByteArrayResource(archivo.toByteArray());
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    public static ByteArrayOutputStream jsonArrayToFile(JSONArray jsonArray, Class<?> dtoClass) {
        Workbook workbook = jsonArrayToWorkbook(jsonArray, dtoClass);
        ByteArrayOutputStream file = new ByteArrayOutputStream();
        try {

            workbook.write(file);
            workbook.close();

            return file;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return file;
    }

    public static Workbook jsonArrayToWorkbook(JSONArray jsonArray, Class<?> dtoClass) {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Data");
        Row headerRow = sheet.createRow(0);
        List<String> headers = new ArrayList<>();

        // Crear estilo de borde
        CellStyle borderStyle = workbook.createCellStyle();
        borderStyle.setBorderBottom(BorderStyle.THIN);
        borderStyle.setBottomBorderColor(IndexedColors.BLACK.getIndex());

        // Usar la reflexión para obtener los nombres de los campos del DTO
        Field[] fields = dtoClass.getDeclaredFields();
        for (Field field : fields) {
            expandFieldForHeaders(field, field.getName(), headers);
            System.out.println(headers);
        }

        // Establecer las cabeceras en el Excel
        for (int i = 0; i < headers.size(); i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers.get(i));
            cell.setCellStyle(borderStyle);
        }

        // Llenar las filas de datos
        int acum = 0;
        for (int j = 0; j < jsonArray.length(); j++) {

            JSONObject obj = jsonArray.getJSONObject(j);

            int rowQty = getRowQty(obj, headers);

            for (int i = 0; i < rowQty; i++) {
                Row dataRow = sheet.createRow(acum + 1);
                acum = acum + 1;
                for (int k = 0; k < headers.size(); k++) {

                    Cell cell = dataRow.createCell(k);
                    Object value = getValueByNestedKey(obj, headers.get(k), i);

                    cell.setCellValue(value != null ? value.toString() : "");
                    boolean isLastInnerRow = i == rowQty - 1;
                    cell.setCellStyle(isLastInnerRow ? borderStyle : null);
                }

            }
        }

        return workbook;

    }

    private static int getRowQty(JSONObject obj, List<String> headers) {
        int rowQty = 1;
        for (int k = 0; k < headers.size(); k++) {

            String nestedKey = headers.get(k);
            String[] keys = nestedKey.split("\\.");

            JSONObject currentObj = obj;

            Object nextObj = currentObj.get(keys[0]);
            if (nextObj instanceof JSONArray) {
                JSONArray jsonArray = (JSONArray) nextObj;

                if (jsonArray.length() > rowQty) {
                    rowQty = jsonArray.length();
                }
            }
        }
        return rowQty;
    }

    private static void expandFieldForHeaders(Field field, String baseKey, List<String> headers) {
        if (List.class.isAssignableFrom(field.getType())) {
            Type genericType = field.getGenericType();
            if (genericType instanceof ParameterizedType) {
                ParameterizedType pType = (ParameterizedType) genericType;
                Type[] fieldArgTypes = pType.getActualTypeArguments();
                if (fieldArgTypes.length > 0 && fieldArgTypes[0] instanceof Class) {
                    Class<?> fieldArgClass = (Class<?>) fieldArgTypes[0];
                    for (Field nestedField : fieldArgClass.getDeclaredFields()) {
                        expandFieldForHeaders(nestedField, baseKey + "." + nestedField.getName(), headers);
                    }
                }
            }
        } else if (field.getType().isAssignableFrom(JSONObject.class)) {
            for (Field nestedField : field.getType().getDeclaredFields()) {
                expandFieldForHeaders(nestedField, baseKey + "." + nestedField.getName(), headers);
            }
        } else {
            headers.add(baseKey);
        }
    }

    private static Object getValueByNestedKey(JSONObject jsonObject, String nestedKey, int rowQty) {

        String[] keys = nestedKey.split("\\.");
        JSONObject currentObj = jsonObject;

        for (int i = 0; i < keys.length; i++) {

            if (!currentObj.has(keys[i])) {
                return null; // Key does not exist, return null
            }
            if (i == keys.length - 1) {
                return currentObj.opt(keys[i]); // Retrieve the final value using the last key part
            }
            Object nextObj = currentObj.get(keys[i]);

            if (nextObj instanceof JSONArray) {
                JSONArray jsonArray = (JSONArray) nextObj;

                if (jsonArray.length() > 0) { // Ensure there is at least one element to avoid IndexOutOfBoundsException
                    if (jsonArray.length() > rowQty) {
                        currentObj = jsonArray.getJSONObject(rowQty);
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }

            } else if (nextObj instanceof JSONObject) {
                currentObj = (JSONObject) nextObj; // Navigate into the next nested JSONObject
            } else {
                return null; // Breaks prematurely because next part of path cannot be navigated
            }
        }
        return null; // Default return, should not be reached
    }

}
    `;

  const getFile = () => {
    return {
      type: "file",
      name: `ExcelUtils.java`,
      content: file,
    };
  };

  return { getFile };
}

export default useExcelUtils;
