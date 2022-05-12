import React, {useEffect} from 'react';
import './App.scss';
import {JourneyTask} from './interfaces/JourneyTask';
import {StartExecutionResponse} from './interfaces/StartExecutionResponse';
import {ExecutionHistoryResponse, ExecutionType} from './interfaces/ExecutionHistoryResponse';
import JourneyItem from './JourneyItem';
import {v4 as uuidv4} from 'uuid';
import {AppBar, Button, Dialog, IconButton, Toolbar, Typography} from '@mui/material';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import {TransitionProps} from '@mui/material/transitions';
import JourneyStepper from './JourneyStepper';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const startExecutionUrl = '/alpha/startExecution';
const getExecutionHistoryUrl = '/alpha/getExecutionHistory';
const sendTaskSuccessUrl = '/alpha/startExecution';
const describeStateMachineUrl = '/alpha/describeStateMachine';

const stateMachineArn = 'arn:aws:states:us-east-2:241070116743:stateMachine:MyFirstJourney';

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
            const data = await startExecutionResponse.json() as StartExecutionResponse;
            setExecutionArn(data.executionArn);

            const historyRequest = new Request(getExecutionHistoryUrl, {
                method: 'POST',
                body: JSON.stringify({
                    executionArn: data.executionArn,
                    includeExecutionData: true,
                    maxResults: 100,
                    reverseOrder: false
                })
            });
            const historyResponse = await fetch(historyRequest);
            const historyData = await historyResponse.json() as ExecutionHistoryResponse;
            await buildTasks(historyData);
        };

        const buildTasks = async (data: ExecutionHistoryResponse) => {
            const executionItems: JourneyTask[] = [];
            let number = 0;
            data.events.forEach((eventItem) => {
                if ([ExecutionType.TaskSubmitted, ExecutionType.TaskScheduled, ExecutionType.TaskStarted, ExecutionType.TaskStateEntered].includes(eventItem.type)) {
                    const newItem: JourneyTask = {
                        id: number,
                        title: `Event ${number}`,
                        description: `Description for Event ${number}`,
                        complete: false
                    }
                    executionItems.push(newItem);
                    number++;
                }
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

    return (
        <div className="App">
            <div className="page-header">
                <div className="page-title">DE&I Leader Program</div>
                <div className="introduction">
                    Sit amet purus gravida quis blandit. Purus semper eget duis at tellus. Ac turpis egestas integer eget aliquet. Vel facilisis volutpat est
                    velit egestas dui id ornare. Sit amet porttitor eget dolor. Pretium aenean pharetra magna ac placerat. Magna fermentum iaculis eu non.
                    Libero justo laoreet sit amet cursus sit amet. Odio aenean sed adipiscing diam donec adipiscing. Sed ullamcorper morbi tincidunt ornare
                    massa eget egestas. Id ornare arcu odio ut sem nulla pharetra diam.
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
                <JourneyStepper></JourneyStepper>
            </div>

            <Dialog
                fullScreen
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
                            Article: {items[selectedItem]?.title}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={() => {
                            let newArr = [...items];
                            newArr[selectedItem].complete = true;
                            setItems(newArr);
                            handleClose()
                        }}>
                            Mark Read
                        </Button>
                    </Toolbar>
                </AppBar>
                <div className="article-content">
                    {items[selectedItem]?.description}
                </div>
            </Dialog>
        </div>
    );
}

export default App;
