function useServiceUtils(metaData) {
  const file = `
  
package ${metaData.packageName}.utils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.lang.annotation.Annotation;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import org.springframework.data.jpa.repository.JpaRepository;


public class ServiceUtils {

    public static void printObjectDetails(Object obj) {
        if (obj == null) {
            System.out.println("Object is null");
            return;
        }

        Class<?> clazz = obj.getClass();
        System.out.println("--------------------------------------------------------------------------");
        System.out.println("Object type: " + clazz.getName());

        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            String fieldName = field.getName();
            Class<?> fieldType = field.getType();

            try {
                Object value = field.get(obj);
                if (value == null) {
                    System.out.println(fieldName + ": null");
                }
                // else if (fieldType.isArray()) {
                // System.out.println(fieldName + ": array of " +
                // fieldType.getComponentType().getName());
                // int length = Array.getLength(value);
                // for (int i = 0; i < length; i++) {
                // System.out.println(" [" + i + "]: " + Array.get(value, i));
                // }
                // } else if (value instanceof Collection) {
                // System.out.println(fieldName + ": collection of " + fieldType.getTypeName());
                // Collection<?> collection = (Collection<?>) value;
                // int index = 0;
                // for (Object item : collection) {
                // System.out.println(" [" + index++ + "]: " + item);
                // }
                // } else if (value instanceof Map) {
                // System.out.println(fieldName + ": map of " + fieldType.getTypeName());
                // Map<?, ?> map = (Map<?, ?>) value;
                // for (Map.Entry<?, ?> entry : map.entrySet()) {
                // System.out.println(" " + entry.getKey() + ": " + entry.getValue());
                // }
                // }
                else if (isEntity(fieldType)) {
                    System.out.println(fieldName + ": " + fieldType.getName() + " = " + value);
                    System.out.println("	Found an entity!");

                } else {
                    System.out.println(fieldName + ": " + fieldType.getName() + " = " + value);
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        System.out.println("--------------------------------------------------------------------------");
    }

    private static boolean isEntity(Class<?> clazz) {
        Package classPackage = clazz.getPackage();
        return classPackage != null && classPackage.getName().startsWith("com.users.entities");
    }

    private static boolean isDTO(Object value) {
        Class<?> tipo = value.getClass();
        String nombreTipo = tipo.getName();
        return nombreTipo.startsWith("com.users.dtos.responses")
                || nombreTipo.startsWith("com.users.dtos.requests");
    }

    public static <T, R> void updateFieldIfNotNull(T dto, JpaRepository<R, Integer> repository, String fieldName) {
        try {
            Field field = dto.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            Object value = field.get(dto);
            System.out.println(value);
            if (value != null) {
                List<R> resultList = repository.findAll();
                System.out.println("Lista de resultados");
                System.out.println(resultList);
                if (!resultList.isEmpty()) {
                    field.set(dto, resultList.get(0));
                }
            }
        } catch (NoSuchFieldException | IllegalAccessException e) {

        }
    }

}

`;

  const getFile = () => {
    return {
      type: "file",
      name: `ServiceUtils.java`,
      content: file,
    };
  };
  return { getFile };
}

export default useServiceUtils;

// OLD CODE

// public static List<String> validateEmptyNonNullFields(Object dto) {
//     List<String> emptyNonNullFields = new ArrayList<>();
//     Class<?> dtoClass = dto.getClass();
//     String className = dtoClass.getName();
//     System.out.println(className);
//     Class<?> newEntityClass = DTOMapping.getEntityClass(className);

//     try {
//         Field[] dtoFields = dto.getClass().getDeclaredFields();
//         Field[] entityFields = newEntityClass.getDeclaredFields();

//         // System.out.println("-------------------------------");
//         // System.out.println("DTOFields");
//         // System.out.println(dtoFields);
//         // System.out.println("EntityFields");
//         // System.out.println(entityFields);

//         for (Field entityField : entityFields) {
//             entityField.setAccessible(true);

//             // System.out.println("-----------");
//             // System.out.println("entityField");
//             // System.out.println(entityField);

//             // Check if the field is marked as non-nullable
//             Annotation[] annotations = entityField.getDeclaredAnnotations();
//             boolean isNonNullable = false;
//             for (Annotation annotation : annotations) {

//                 // System.out.println("--- annotation ---");
//                 // System.out.println(annotation);
//                 // System.out.println("Annotation Type");
//                 // System.out.println(annotation.annotationType());

//                 if (annotation.annotationType() == JoinColumn.class) {
//                     JoinColumn columnAnnotation = (JoinColumn) annotation;
//                     if (!columnAnnotation.nullable()) {
//                         isNonNullable = true;
//                         break;
//                     }
//                 } else if (annotation.annotationType() == Column.class) {
//                     Column columnAnnotation = (Column) annotation;
//                     if (!columnAnnotation.nullable()) {
//                         isNonNullable = true;
//                         break;
//                     }
//                 }

//                 else if (annotation.annotationType() == Id.class) {
//                     isNonNullable = true;
//                     break;
//                 }
//             }

//             System.out.println("isNonNullable: " + isNonNullable);

//             if (isNonNullable) {

//                 for (Field dtoField : dtoFields) {

//                     System.out.println("dtoField");
//                     System.out.println(dtoField);

//                     if (dtoField.getName().equals(entityField.getName())) {
//                         dtoField.setAccessible(true);
//                         Object value = dtoField.get(dto);

//                         if (value != null && isDTO(value)) {

//                             List<String> emptyFields = validateEmptyNonNullFields(value);

//                             if (!emptyFields.isEmpty()) {
//                                 System.out.println("Campos vacíos: " + emptyFields);
//                                 emptyNonNullFields.addAll(emptyFields);
//                             }

//                         }
//                         if (value == null || (value instanceof String && ((String) value).isEmpty())) {

//                             emptyNonNullFields.add(dtoField.getName());
//                         }
//                         break;
//                     }
//                 }
//             }
//         }
//     } catch (IllegalAccessException e) {
//         e.printStackTrace();
//     }
//     return emptyNonNullFields;
// }
