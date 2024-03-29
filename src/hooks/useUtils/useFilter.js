function useFilter(metaData) {
  const file = `package ${metaData.packageName}.utils;

    import jakarta.persistence.criteria.Predicate;
    import java.lang.reflect.Field;
    import java.util.ArrayList;
    import java.util.List;
    import org.springframework.data.jpa.domain.Specification;
    
    public class Filter {
        public static <T> Specification<T> buildSpecification(Object filterDTO) {
            ServiceUtils.printObjectDetails(filterDTO);
            return (root, query, criteriaBuilder) -> {
                List<Predicate> predicates = new ArrayList<>();
    
                for (Field field : filterDTO.getClass().getDeclaredFields()) {
                    field.setAccessible(true);
                    try {
                        Object value = field.get(filterDTO);
                        if (value != null && !value.equals(getDefaultValueForType(field.getType()))) {
                            if (field.getType() == String.class) {
                                String stringValue = value.toString();
                                if (stringValue.startsWith("%") || stringValue.endsWith("%")) {
                                    predicates.add(criteriaBuilder.like(
                                            criteriaBuilder.lower(root.get(field.getName())),
                                            stringValue.toLowerCase()));
                                } else {
                                    predicates.add(criteriaBuilder.equal(root.get(field.getName()), value));
                                }
                            } else {
                                predicates.add(criteriaBuilder.equal(root.get(field.getName()), value));
                            }
                        }
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                }
    
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            };
        }
    
        private static Object getDefaultValueForType(Class<?> type) {
            if (type == String.class) {
                return "";
            } else if (type == Integer.class || type == int.class) {
                return 0;
            } else if (type == Long.class || type == long.class) {
                return 0L;
            } else if (type == Double.class || type == double.class) {
                return 0.0;
            } else if (type == Float.class || type == float.class) {
                return 0.0f;
            } else if (type == Boolean.class || type == boolean.class) {
                return false;
            } else {
                return null;
            }
        }
    }
    `;

  const getFile = () => {
    return {
      type: "file",
      name: `Filter.java`,
      content: file,
    };
  };
  return { getFile };
}

export default useFilter;
