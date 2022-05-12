import React, {useEffect} from 'react';
import './App.scss';
import {JourneyTask} from './interfaces/JourneyTask';
import JourneyItem from './JourneyItem';
import {LoremIpsum} from "lorem-ipsum";
import {v4 as uuidv4} from 'uuid';
import {AppBar, Button, Dialog, IconButton, Toolbar, Typography} from '@mui/material';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import {TransitionProps} from '@mui/material/transitions';
import JourneyStepper from './JourneyStepper';
import {StartExecutionResponse} from './interfaces/StartExecutionResponse';
import {ExecutionHistoryResponse, ExecutionType, TaskScheduledEventDetailsParameters} from './interfaces/ExecutionHistoryResponse';
import {DescribeStateMachineResponse} from "./interfaces/DescribeStateMachineResponse";
import {StateMachineDefinition} from "./interfaces/StateMachineDefinition";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const lorem = new LoremIpsum();

const startExecutionUrl = '/alpha/startExecution';
const getExecutionHistoryUrl = '/alpha/getExecutionHistory';
const sendTaskSuccessUrl = '/alpha/sendTaskSuccess';
const describeStateMachineUrl = '/alpha/describeStateMachine';

const stateMachineArn = 'arn:aws:states:us-east-2:241070116743:stateMachine:MyFirstJourney';

const introductionText = lorem.generateSentences(6);

function App() {
    const [items, setItems] = React.useState<JourneyTask[]>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(0);
    const [executionArn, setExecutionArn] = React.useState('');

    useEffect(() => {
        const startExecution = async () => {
            const startExecutionRequest = new Request(startExecutionUrl, {
                method: 'POST',
                body: JSON.stringify({
                    name: uuidv4(),
                    stateMachineArn: stateMachineArn
                })
            });
            const startExecutionResponse = await fetch(startExecutionRequest);
            const startExecutionData = await startExecutionResponse.json() as StartExecutionResponse;
            setExecutionArn(startExecutionData.executionArn);

            const describeStateMachineRequest = new Request(describeStateMachineUrl, {
                method: 'POST',
                body: JSON.stringify({
                    stateMachineArn: 'arn:aws:states:us-east-2:241070116743:stateMachine:MyFirstJourney'
                })
            });
            const describeStateMachineResponse = await fetch(describeStateMachineRequest);
            const stateMachineData = await describeStateMachineResponse.json() as DescribeStateMachineResponse;
            const stateMachineDefinition = JSON.parse(stateMachineData.definition) as StateMachineDefinition;
            console.dir(stateMachineDefinition);
            await buildTasks(stateMachineDefinition);
        };

        const buildTasks = async (data: StateMachineDefinition) => {
            const executionItems: JourneyTask[] = [];
            const keys = Object.keys(data.States);
            keys.forEach((key, index) => {
                const type = key.split(':')[0];
                const newItem: JourneyTask = {
                    id: index,
                    title: `${type}: ${data.States[key].Comment}`,
                    description: lorem.generateSentences(4),
                    complete: false,
                    disabled: index !== 0
                }
                executionItems.push(newItem);
            });
            setItems(executionItems);
        }

        startExecution().then();
    }, []);

    const handleClickOpen = (_event: any, index: number) => {
        setSelectedItem(index);
        setOpen(true);
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
        <div className="App">
            <div className="page-header">
                <div className="page-title">DE&I Leader Program</div>
                <div className="introduction">
                    {introductionText}
                </div>
            </div>

            <Stack spacing={2}>
                {
                    items.map(function (item) {
                        return <JourneyItem key={item.id} item={item} launch={handleClickOpen}></JourneyItem>
                    })
                }
            </Stack>

            <div className="stepper-container">
                <JourneyStepper steps={items}></JourneyStepper>
            </div>

            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
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

export default App;
