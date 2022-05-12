export interface StateMachineDefinition {
    Comment: string;
    StartAt: string;
    States: StateMachineState;
}

export interface StateMachineState {
    [key: string]: StateMachineStateDetails;
}

export interface StateMachineStateDetails {
    Type: string;
    Resource: string;
    Next: string;
    Comment: string;
}
