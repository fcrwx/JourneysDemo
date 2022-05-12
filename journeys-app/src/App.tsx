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
const describeStateMachineUrl = '/alpha/describeStateMachine';

const stateMachineArn = 'arn:aws:states:us-east-2:241070116743:stateMachine:MyFirstJourney';

const introductionText = lorem.generateSentences(6);

function App() {
    const [items, setItems] = React.useState<JourneyTask[]>([]);
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
                    type: type,
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

    return (
        <div className="App">
            <div className="page-header">
                <div className="page-title">DE&I Leader Program</div>
                <div className="introduction">
                    {introductionText}
                </div>
            </div>

            <div className="stepper-container">
                <JourneyStepper steps={items} executionArn={executionArn}></JourneyStepper>
            </div>
        </div>
    );
}

export default App;
