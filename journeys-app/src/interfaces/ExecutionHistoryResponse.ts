export interface ExecutionHistoryResponse {
    events: ExecutionEvent[];
}

export interface ExecutionEvent {
    id: number;
    previousEventId: number;
    timestamp: number;
    type: ExecutionType;
    taskScheduledEventDetails: TaskScheduledEventDetails;
}

export enum ExecutionType {
    ExecutionStarted = 'ExecutionStarted',
    TaskStateEntered = 'TaskStateEntered',
    TaskScheduled = 'TaskScheduled',
    TaskStarted = 'TaskStarted',
    TaskSubmitted = 'TaskSubmitted'
}

export interface TaskScheduledEventDetails {
    parameters: string;
    region: string;
    resource: string;
    resourceType: string;
}

export interface TaskScheduledEventDetailsParameters {
    FunctionName: string;
    Payload: TaskScheduledEventDetailsParametersPayload;
}

export interface TaskScheduledEventDetailsParametersPayload {
    token: string;
}
