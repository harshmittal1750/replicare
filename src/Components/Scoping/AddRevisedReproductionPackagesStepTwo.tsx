import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  ListItem,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { revised_reproduction_packages } from "../../types";
interface props {
  scopingData: any;
  setScopingData: any;
}

const AddRevisedReproductionPackagesStepTwo = ({
  scopingData,
  setScopingData,
}: props) => {
  // const [count, setCount] = React.useState(0);
  // const renderAdditional = () => {
  //   setCount(count + 1);
  // };
  // handle change
  const addRevisedPackageChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setScopingData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  const addIntoSystem = () => {
    if (revisedPackage.name.length > 0 && revisedPackage.url.length > 0) {
      setScopingData({
        ...scopingData,
        original_reproduction_packages: [
          ...scopingData.original_reproduction_packages,
          revisedPackage,
        ],
      });
      setRevisedPackage({
        name: "",
        url: "",
        stage: "original",
        content_type: "code",
      });
    } else {
      alert("Please fill the required fields");
    }
  };
  const [revisedPackage, setRevisedPackage] =
    useState<revised_reproduction_packages>({
      name: "",
      url: "",
      stage: "original",
      content_type: "code",
    });
  // const renderedComponents = Array.from({ length: count }, (_, index) => (
  //   <AdditionalInfo key={index} />
  // ));
  return (
    <div>
      {scopingData.original_reproduction_packages.length > 0 &&
        scopingData.original_reproduction_packages.map(
          (item: any, index: number) => {
            return (
              <div key={index}>
                <Box py={2} boxShadow={1} my={1} px={3} mx={2}>
                  <FormHelperText>
                    Contents of reproduction package
                  </FormHelperText>
                  <div>
                    {" "}
                    <TextField
                      required
                      fullWidth
                      variant="standard"
                      name="name"
                      type={"text"}
                      defaultValue={item.name}
                      placeholder="e.g. Main code repository with data"
                      onChange={(event: any) => {
                        if (event.target.value.length > 0) {
                          setRevisedPackage({
                            ...revisedPackage,
                            name: event.target.value,
                          });
                        }
                      }}
                    ></TextField>
                  </div>
                  <div>
                    {" "}
                    <TextField
                      required
                      type={"text"}
                      fullWidth
                      variant="standard"
                      name="url"
                      defaultValue={item.url}
                      placeholder="e.g. https://github.com/paper/paper"
                      onChange={(event: any) => {
                        // required validation
                        if (event.target.value.length > 0) {
                          setRevisedPackage({
                            ...revisedPackage,
                            url: event.target.value,
                          });
                        }
                      }}
                    ></TextField>
                  </div>
                </Box>
              </div>
            );
          }
        )}
      <Box boxShadow={4} my={4}>
        <ListItem>
          <FormControl required fullWidth sx={{ py: 1 }}>
            <FormLabel>
              Record the main repository that stores the code for the
              reproduction package provided by the authors.
            </FormLabel>
            <FormHelperText>Contents of reproduction package</FormHelperText>
            <TextField
              variant="standard"
              type={"text"}
              value={revisedPackage.name}
              defaultValue={revisedPackage.name}
              onChange={(event: any) => {
                setRevisedPackage({
                  ...revisedPackage,
                  name: event.target.value,
                });
              }}
              name="name"
              placeholder="e.g. Main code repository with data"
            ></TextField>
            <TextField
              type={"text"}
              value={revisedPackage.url}
              defaultValue={revisedPackage.url}
              variant="standard"
              onChange={(event: any) => {
                setRevisedPackage({
                  ...revisedPackage,
                  url: event.target.value,
                });
              }}
              name="url"
              placeholder="e.g. https://github.com/paper/paper"
            ></TextField>
            <FormLabel>
              Are there additional data in different repositories? Use the
              button below to add links to these as well.
            </FormLabel>{" "}
            {/* {renderedComponents} */}
            <Button variant="contained" onClick={addIntoSystem}>
              + Add additional reproduction packages for data
            </Button>
          </FormControl>
        </ListItem>
      </Box>
    </div>
  );
};

export default AddRevisedReproductionPackagesStepTwo;