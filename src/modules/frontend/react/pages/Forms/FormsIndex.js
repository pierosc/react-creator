import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import CDialog from "../../Components/Dialog/CDialog";
import CTextfield from "../../Components/Textfield/CTextfield";
import { useFormik } from "formik";
import { TC } from "../../../../../StringFunctions";

// const CreateDriverValidationSchema = z
//   .object({
//     email: z.string().email(),
//     password: z.string().min(6),
//     confirmPassword: z.string().min(6),
//     name: z.string().min(1, { message: "El nombre es requerido" }),
//     lastName: z.string().min(1, { message: "El apellido es requerido" }),
//     phone: z.string().min(9, { message: "El celular es requerido" }),
//     color: z.string().min(1, { message: "El color es requerido" }),
//     plate: z.string().min(1, { message: "La placa es requerida" }),
//     dni: z.string().min(8).max(8),
//   })
//   .refine(
//     (values) => {
//       return values.password === values.confirmPassword;
//     },
//     {
//       message: "Las contraseñas no coinciden",
//       path: ["confirmPassword"],
//     }
//   );

const validateForm = (values) => {
  try {
    // CreateDriverValidationSchema.parse(values);
  } catch (error) {
    if (error) {
      return error.formErrors.fieldErrors;
    }
  }
};

function FormsIndex({ table }) {
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      lastName: "",
      phone: "",
      color: "",
      plate: "",
      dni: "",
    },
    validate: validateForm,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  console.log(table);

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        OPEN {table.name}
      </Button>
      <CDialog
        open={open}
        title={`ADD ${TC(table.name).toUpperCase()}`}
        onClickClose={onClose}
        actions={
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Button
              fullWidth
              size="large"
              // onClick={() => handleSubmit()}
            >
              ADD
            </Button>
            <Typography
              variant="body2"
              component="span"
              width="75%"
              textAlign="center"
              marginTop="12px"
            >
              Al confirmar el conductor podrá entrar a su App con correo y DNI.
            </Typography>
          </Box>
        }
      >
        <Typography
          variant="body2"
          textAlign="center"
          fontWeight={600}
          sx={{ marginBottom: "12px" }}
        >
          {TC(table.name)} data
        </Typography>
        {table.attributes.map(
          (attr) =>
            !attr.pk &&
            attr.type !== "timestamp" && (
              <CTextfield
                name={attr.name}
                label={TC(attr.name)}
                type="email"
                placeholder="jorge@gmail.com"
                fullWidth
                //  value={values.email}
                //  error={touched.email && !!errors.email}
                //  helperText={touched.email && errors.email}
                //  onChange={handleChange}
              />
            )
        )}
      </CDialog>
    </div>
  );
}

export default FormsIndex;
