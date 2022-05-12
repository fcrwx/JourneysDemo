import React, {useEffect, useState} from 'react';
import './JourneyStepper.scss';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { JourneyTask } from './interfaces/JourneyTask';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import { IconButton, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {LoremIpsum} from "lorem-ipsum";
import {TransitionProps} from '@mui/material/transitions';
import { ExecutionHistoryResponse, ExecutionType, TaskScheduledEventDetailsParameters } from './interfaces/ExecutionHistoryResponse';

function JourneyStepper(props: { steps: JourneyTask[], executionArn: string}) {

    useEffect(() => {
        setItems(props.steps);
        setExecutionArn(props.executionArn);
    }); 

    const [activeStep, setActiveStep] = React.useState(0);
    const [items, setItems] = React.useState<JourneyTask[]>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(0);
    const [executionArn, setExecutionArn] = React.useState('');

    const lorem = new LoremIpsum();
    const getExecutionHistoryUrl = '/alpha/getExecutionHistory';
    const sendTaskSuccessUrl = '/alpha/sendTaskSuccess';

    const handleNext = (index: number) => {
        setSelectedItem(index);
        setOpen(true);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    
    const handleReset = () => {
        setActiveStep(0);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getExecutionHistory = async () => {
        const getExecutionHistoryRequest = new Request(getExecutionHistoryUrl, {
            method: 'POST',
            body: JSON.stringify({
                executionArn: executionArn,
                includeExecutionData: true,
                maxResults: 100,
                reverseOrder: false
            })
        });
        const getExecutionHistoryResponse = await fetch(getExecutionHistoryRequest);
        return await getExecutionHistoryResponse.json() as ExecutionHistoryResponse;
    }

    const sendTaskSuccess = async () => {
        const executionHistory: ExecutionHistoryResponse = await getExecutionHistory();
        const currentTask = executionHistory.events.find((eventItem) => eventItem.type === ExecutionType.TaskScheduled);
        if (currentTask) {
            const taskParameters = JSON.parse(currentTask.taskScheduledEventDetails.parameters) as TaskScheduledEventDetailsParameters;
            const token = taskParameters.Payload.token;

            const sendTaskSuccessRequest = new Request(sendTaskSuccessUrl, {
                method: 'POST',
                body: JSON.stringify({
                    output: "{}",
                    taskToken: token
                })
            });
            const sendTaskSuccessResponse = await fetch(sendTaskSuccessRequest);
            console.log(sendTaskSuccessResponse);
        }
    }

    return (
        <div className="stepper-container">
        <Box>
        <Stepper activeStep={activeStep} orientation="vertical">
            {items.map((step, index) => (
            <Step key={step.title}>
                <StepLabel className="step-label"
                optional={
                    index === 2 ? (
                    <Typography variant="caption">Last step</Typography>
                    ) : null
                }
                >
                {step.title}
                </StepLabel>
                <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                    <div>
                    <Button
                        variant="contained"
                        onClick={() => handleNext(index)}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        {index === items.length - 1 ? 'Finish' : 'Launch'}
                    </Button>
                    <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                    >
                        Back
                    </Button>
                    </div>
                </Box>
                </StepContent>
            </Step>
            ))}
        </Stepper>
      {activeStep === items.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>

    <Dialog
        fullWidth={true}
        maxWidth={'lg'}
        open={open}
        onClose={handleClose}
    >
    <AppBar sx={{position: 'relative'}}>
        <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="close"
                onClick={handleClose}
            >
                <CloseIcon/>
            </IconButton>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                {items[selectedItem]?.title}
            </Typography>
            <Button autoFocus color="inherit" onClick={() => {
                let newArr = [...items];
                newArr[selectedItem].complete = true;
                newArr[selectedItem].disabled = true;
                if (selectedItem !== newArr.length - 1) {
                    newArr[selectedItem + 1].disabled = false;
                }
                setItems(newArr);
                sendTaskSuccess().then();
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                handleClose();
            }}>
                Mark Done
            </Button>
        </Toolbar>
    </AppBar>
    <div className="article-content">
        {lorem.generateSentences(10)}<br/><br/>
        {lorem.generateSentences(10)}<br/><br/>
        {lorem.generateSentences(10)}<br/><br/>
        {lorem.generateSentences(10)}<br/><br/>
    </div>
    </Dialog>
</div>
  );
}

export default JourneyStepper;