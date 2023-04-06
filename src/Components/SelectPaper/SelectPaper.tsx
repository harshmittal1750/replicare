import React, { useState } from "react";
import { fetchDoi } from "../../api/fetchDOI";
import { camelizeKeys } from "../../utils/changeCase";
import AdditionalInfo from "../AdditionalInfo";
import { selectUserPaperData } from "../../firebase/firebaseFunctions";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  Checkbox,
  Box,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
} from "@mui/material";

const SelectPaper = () => {
  const navigate = useNavigate();
  const checkBoxOptions = [
    {
      label: "Provided reproduction package.",
    },
    {
      label:
        "Declined to share reproduction package, citing legal or ethical reasons.",
    },
    {
      label:
        "Declined to share reproduction package but did not provide a reason.",
    },
    {
      label:
        "Declined to share the missing materials, citing not ready to share. Record date when you estimate that the authors may be ready to share the missing materials:",
    },
    {
      label: "Author(s) state that they no longer have access to the data.",
    },
    {
      label:
        "Shared detailed instructions on how to access the data (for restricted access only).",
    },
    {
      label: "Did not respond. As of:",
    },
  ];
  const [doiString, setDoiString] = useState<string>();
  const [getDoi, setDoi] = useState<boolean>(false);
  const [isDisabled12, setDisabled12] = useState<boolean>(false);
  const [isDisabled13, setDisabled13] = useState<boolean>(false);
  const [isDisabled16, setDisabled16] = useState<boolean>(false);
  const [isChecked141, setChecked141] = useState<boolean>(false);

  const [count, setCount] = useState(0);
  const [isReproductionPackageAvailable, setReproductionPackageAvailable] =
    useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [doiResponse, setDoiResponse] = useState({
    yearOfPublication: "",
    publisher: "",
    title: "",
    author: "",
    doi: "",
    nameOfJournal: "",
  });
  const [checkedState, setCheckedState] = useState<boolean[]>(
    new Array(checkBoxOptions.length).fill(false)
  );

  const [formData, setFormData] = useState({
    reproductionPackageAvailable: false,
    authorContacted: false,
    authorAvailableForFurtherQuestion: false,
    buildFromScratch: false,
    reproductionData1: "",
    reproductionData2: "",
  });
  const formDataHandler = (event: any) => {
    setFormData((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });

    console.log("formData", formData);
  };

  const userID: string = sessionStorage.getItem("id") as string;
  const submitSelectPaperData = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    // send form data to fireStore database on button click
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    console.log("data", data);
    setFormData((prev) => {
      return {
        ...prev,
        checkBoxData: checkedState,
      };
    });
    selectUserPaperData(formData, userID, doiResponse)
      .then((res) => {
        console.log("res", res);
        if (res.status) {
          toast.success("Data submitted");
          navigate(`/reproductions/index/edit/${res?.userPaperID}`);
        } else {
          toast.error("Error submitting data");
        }
      })
      .catch((err) => {
        console.log("err", err);
        // toast.error("Error submitting data");
      });

    // setSelectPaperData("submitted");
  };
  const renderAdditional = () => {
    setCount(count + 1);
  };
  const renderedComponents = Array.from({ length: count }, (_, index) => (
    <AdditionalInfo key={index} />
  ));
  const disableClick = (toggle: boolean, count: string) => {
    if (count === "1.2") {
      setDisabled12(toggle);
    } else if (count === "1.3") {
      setDisabled13(toggle);
    } else if (count === "1.6") {
      setDisabled16(toggle);
    } else if (count === "1.41") {
      setChecked141(toggle);
    }
  };

  const handleCheckBoxData = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) => {
      return index === position ? !item : item;
    });

    setCheckedState(updatedCheckedState);
  };

  console.log("checkedState", checkedState);

  function submitHandler(event: any) {
    event.preventDefault();

    if (
      typeof doiString !== "undefined" &&
      doiString !== null &&
      doiString.length > 0
    ) {
      fetchDoi(doiString)
        .then(function (response: any) {
          setError(false);
          console.log("fetchDoi", response);
          setDoi((prev) => !prev);
          const newResponse = camelizeKeys(response);
          setDoiResponse((prev: any) => {
            return {
              ...prev,
              yearOfPublication: newResponse.message.created.dateTime,
              publisher: newResponse.message.publisher,
              nameOfJournal: newResponse.message.shortContainerTitle[0],
              title: newResponse.message.title[0],
              author: `${newResponse.message.author
                .map((author: any) => `${author.given} ${author.family}`)
                .join(", ")}`,

              doi: newResponse.message.doi,
            };
          });
        })
        .catch(function (error: any) {
          setError(true);
          console.log("fetchDoi error", error);
        });
    } else {
      setError(true);
    }

    // message->indexed->date-time
    // publisher
    // short-container-title
    // doi
    // title [0]
    // autour[0] -> given , family
  }
  console.log(doiResponse);

  return (
    <div>
      <Container>
        <ToastContainer />
        {/* Same as */}
        <ToastContainer />
        <Typography variant="h4" component={"h1"} textAlign={"center"} py={2}>
          Step 1: Declare a paper
        </Typography>
        <Typography variant={"subtitle1"} p={2}>
          Specify the research paper that you will analyze and provide some
          basic information about its reproduction package. Please refer to the
          documentation provided for further assistance
        </Typography>{" "}
        <Typography variant={"h5"} component="h6" p={2}>
          Basic information
        </Typography>
        <Typography variant={"subtitle1"} px={2}>
          At this point, you are not expected to review the reproduction
          materials in detail, as you will dedicate most of your time to this in
          later stages of the exercise. If materials are available, you will
          declare this paper as your target to reproduce. Only then you will be
          asked to read the paper and define the scope of the reproduction
          exercise.
        </Typography>
        <Grid
          container
          my={12}
          // TODO: this will create error after uncommenting
          component="form"
          noValidate
          onSubmit={submitSelectPaperData}
        >
          <List>
            <ListItem>
              <ListItemText>
                1.1 Enter the{" "}
                <span>
                  <a
                    href="https://en.wikipedia.org/wiki/Digital_object_identifier"
                    target={"_blank"}
                    rel="noreferrer"
                  >
                    DOI
                  </a>
                </span>{" "}
                for the paper that you have chosen to reproduce for this
                activity and we will fetch some basic information. Please use
                the prefix/suffix notation, e.g. 10.1257/aer.20101199.
              </ListItemText>
            </ListItem>
            <ListItem>
              <TextField
                label="Digital Object Identifier (or URL if no DOI available)"
                variant="standard"
                type={"text"}
                fullWidth
                id="doi"
                name="doi"
                onChange={(e: any) => setDoiString(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button
                      type="button"
                      onClick={submitHandler}
                      variant="contained"
                      sx={{ width: "20%" }}
                    >
                      Search DOI
                    </Button>
                  ),
                }}
              />
            </ListItem>{" "}
            <p style={{ color: "red", textAlign: "center" }}>
              {isError ? "Please enter DOI " : null}
            </p>
            {getDoi && Object.keys(doiResponse).length > 0 ? (
              <>
                <ListItem>
                  <TextField
                    label="Title of the paper"
                    type={"text"}
                    defaultValue={doiResponse?.title}
                    variant="standard"
                    fullWidth
                  />
                </ListItem>{" "}
                <ListItem>
                  <TextField
                    label="Name of the journal or publication"
                    type={"text"}
                    defaultValue={doiResponse?.nameOfJournal}
                    variant="standard"
                    fullWidth
                  />
                </ListItem>{" "}
                <ListItem>
                  <TextField
                    label="Digital Object Identifier (or URL if no DOI available)"
                    type={"text"}
                    defaultValue={doiResponse?.doi}
                    variant="standard"
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    label="Year of Publication"
                    type={"text"}
                    defaultValue={new Date(
                      doiResponse?.yearOfPublication
                    ).getFullYear()}
                    variant="standard"
                    fullWidth
                  />
                </ListItem>
                <ListItem>
                  <TextField
                    label="Authors"
                    type={"text"}
                    defaultValue={doiResponse?.author}
                    variant="standard"
                    fullWidth
                  />
                </ListItem>
              </>
            ) : null}
            {/* doi fetch ends here  */}
          </List>
          <List>
            <ListItem>
              <FormControl required>
                <FormLabel id="reproduction-package-available?">
                  1.2 is a reproduction package available for this paper?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="is a reproduction package available for this paper?"
                  defaultValue=""
                  onChange={formDataHandler}
                  name="reproductionPackageAvailable"
                >
                  <FormControlLabel
                    value="yes"
                    onClick={(event) => {
                      setReproductionPackageAvailable(() => true);
                      disableClick(true, "1.2");
                    }}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    onClick={() => {
                      setReproductionPackageAvailable(() => false);
                      disableClick(false, "1.2");
                    }}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl required disabled={isDisabled12}>
                <FormLabel id="permission">
                  1.3 Have you contacted the authors for a reproduction package?
                  Consult the ACRe Guide for recommendations on contacting
                  authors.
                </FormLabel>
                <RadioGroup
                  aria-labelledby="is a reproduction package available for this paper?"
                  defaultValue=""
                  name="authorContacted"
                  onChange={formDataHandler}
                >
                  <FormControlLabel
                    value="yes"
                    onClick={() => {
                      disableClick(false, "1.3");
                    }}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    onClick={() => {
                      disableClick(true, "1.3");
                    }}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              <FormHelperText>
                *Wait a few weeks for the authors to reply, then summarize your
                interaction below.
              </FormHelperText>
            </ListItem>
            <ListItem>
              <FormControl required disabled={isDisabled12 || isDisabled13}>
                <FormLabel>
                  1.4 How did the authors respond? Select all that apply.
                </FormLabel>
                {checkBoxOptions.map(({ label }, index) => {
                  return (
                    <>
                      <FormControlLabel
                        key={index}
                        control={
                          <Checkbox
                            name={label}
                            // value={name}
                            checked={checkedState[index]}
                            onChange={() => handleCheckBoxData(index)}
                          />
                        }
                        onClick={() => setDisabled16(true)}
                        label={label}
                        // sx={{ display: "block" }}
                      />
                    </>
                  );
                })}
              </FormControl>
            </ListItem>

            <ListItem>
              <FormControl required disabled={isDisabled12 || isDisabled13}>
                <FormLabel id="permission">
                  1.5 Are the authors available for further questions for ACRe
                  reproductions?
                </FormLabel>
                <RadioGroup
                  onChange={formDataHandler}
                  name="authorAvailableForFurtherQuestion"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </ListItem>
            <ListItem>
              <FormControl required disabled={isDisabled12}>
                <FormLabel id="permission">
                  1.6 If there are no reproduction packages, are you willing to
                  build a reproduction package from scratch?
                </FormLabel>
                <RadioGroup
                  defaultValue=""
                  onChange={formDataHandler}
                  name="buildFromScratch"
                >
                  <FormControlLabel
                    value="yes"
                    onClick={() => setDisabled16(true)}
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value="no"
                    onClick={() => setDisabled16(false)}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>
            {isDisabled16 ? (
              <ListItem>
                <Button variant="contained">
                  You can declare this paper and continue the scoping portion of
                  the exercise.
                </Button>
              </ListItem>
            ) : null}
            {isReproductionPackageAvailable ? (
              <ListItem>
                <FormControl required fullWidth sx={{ py: 1 }}>
                  <FormLabel>
                    Record the main repository that stores the code for the
                    reproduction package provided by the authors.
                  </FormLabel>
                  <FormHelperText>
                    Contents of reproduction package
                  </FormHelperText>
                  <TextField
                    variant="standard"
                    onChange={formDataHandler}
                    name="reproductionData1"
                    type={"text"}
                    placeholder="e.g. Main code repository with data"
                  ></TextField>
                  <TextField
                    type={"text"}
                    variant="standard"
                    onChange={formDataHandler}
                    name="reproductionData2"
                    placeholder="e.g. https://github.com/paper/paper"
                  ></TextField>
                  <FormLabel>
                    Are there additional data in different repositories? Use the
                    button below to add links to these as well.
                  </FormLabel>{" "}
                  {renderedComponents}
                  <Button variant="contained" onClick={renderAdditional}>
                    + Add additional reproduction packages for data
                  </Button>
                </FormControl>
              </ListItem>
            ) : null}
          </List>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
      </Container>
    </div>
  );
};

export default SelectPaper;