import React, {useEffect} from 'react';
import './App.scss';
import Stack from '@mui/material/Stack';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {IJourneyItem} from "./interfaces/IJourneyItem";
import {StartExecutionResponse} from "./interfaces/StartExecutionResponse";
import {ExecutionHistoryResponse, ExecutionType} from "./interfaces/ExecutionHistoryResponse";
import {v4 as uuidv4} from 'uuid';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const startExecutionUrl = 'https://chs5cc0z8f.execute-api.us-east-1.amazonaws.com/alpha/startExecution';
const getExecutionHistoryUrl = 'https://chs5cc0z8f.execute-api.us-east-1.amazonaws.com/alpha/getExecutionHistory';
const sendTaskSuccessUrl = 'https://chs5cc0z8f.execute-api.us-east-1.amazonaws.com/alpha/startExecution';
const stateMachineArn = 'arn:aws:states:us-east-2:241070116743:stateMachine:MyFirstJourney';

function App() {
    const [items, setItems] = React.useState<IJourneyItem[]>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(0);
    const [executionArn, setExecutionArn] = React.useState('');

    useEffect(() => {
        const startExecution = async () => {
            const request = new Request(startExecutionUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    name: uuidv4(),
                    stateMachineArn: stateMachineArn
                })
            });
            const response = await fetch(request);
            console.dir(response);
            const data = await response.json() as StartExecutionResponse;
            setExecutionArn(data.executionArn);
        };

        const getExecutionHistory = async () => {
            const request = new Request(getExecutionHistoryUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({
                    executionArn: executionArn,
                    includeExecutionData: true,
                    maxResults: 100,
                    reverseOrder: false
                })
            });
            const response = await fetch(request);
            const data = await response.json() as ExecutionHistoryResponse;
            console.dir(data);
            await buildTasks(data);
        };

        const buildTasks = async (data: ExecutionHistoryResponse) => {
            const executionItems: IJourneyItem[] = [];
            data.events.forEach((eventItem) => {
                if ([ExecutionType.TaskSubmitted, ExecutionType.TaskScheduled, ExecutionType.TaskStarted, ExecutionType.TaskStateEntered].includes(eventItem.type)) {
                    const newItem: IJourneyItem = {
                        id: eventItem.id,
                        title: `Event ${eventItem.id}`,
                        description: `Description for Event ${eventItem.id}`,
                        complete: false
                    }
                    executionItems.push(newItem);
                }
            });
            setItems(executionItems);
        }

        startExecution().then(() => {
            getExecutionHistory().then();
        });
    }, [executionArn, items]);

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
                <div className="page-title">Journeys Demo</div>
                <div className="introduction">
                    Sit amet purus gravida quis blandit. Purus semper eget duis at tellus. Ac turpis egestas integer eget aliquet. Vel facilisis volutpat est
                    velit egestas dui id ornare. Sit amet porttitor eget dolor. Pretium aenean pharetra magna ac placerat. Magna fermentum iaculis eu non.
                    Libero justo laoreet sit amet cursus sit amet. Odio aenean sed adipiscing diam donec adipiscing. Sed ullamcorper morbi tincidunt ornare
                    massa eget egestas. Id ornare arcu odio ut sem nulla pharetra diam.
                </div>
            </div>

            <Stack spacing={2}>
                {/*<JourneyItem item={items[0]} launch={handleClickOpen}></JourneyItem>*/}
                {/*<JourneyItem item={items[1]} launch={handleClickOpen}></JourneyItem>*/}
                {/*<JourneyItem item={items[2]} launch={handleClickOpen}></JourneyItem>*/}
            </Stack>

            {/*<Dialog*/}
            {/*    fullScreen*/}
            {/*    open={open}*/}
            {/*    onClose={handleClose}*/}
            {/*    TransitionComponent={Transition}*/}
            {/*>*/}
            {/*    <AppBar sx={{position: 'relative'}}>*/}
            {/*        <Toolbar>*/}
            {/*            <IconButton*/}
            {/*                edge="start"*/}
            {/*                color="inherit"*/}
            {/*                onClick={handleClose}*/}
            {/*                aria-label="close"*/}
            {/*            >*/}
            {/*                <CloseIcon/>*/}
            {/*            </IconButton>*/}
            {/*            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">*/}
            {/*                Article: {items[selectedItem].title}*/}
            {/*            </Typography>*/}
            {/*            <Button autoFocus color="inherit" onClick={() => {*/}
            {/*                let newArr = [...items];*/}
            {/*                newArr[selectedItem].complete = true;*/}
            {/*                console.dir(newArr);*/}
            {/*                setItems(newArr);*/}
            {/*                handleClose()*/}
            {/*            }}>*/}
            {/*                Mark Read*/}
            {/*            </Button>*/}
            {/*        </Toolbar>*/}
            {/*    </AppBar>*/}
            {/*    <div className="article-content">*/}
            {/*        {items[selectedItem].description}*/}
            {/*    </div>*/}
            {/*</Dialog>*/}
        </div>
    );
}

export default App;
