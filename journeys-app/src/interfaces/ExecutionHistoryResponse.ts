export interface ExecutionHistoryResponse {
    events: ExecutionEvent[];
}

export interface ExecutionEvent {
    id: number;
    previousEventId: number;
    timestamp: number;
    type: ExecutionType
}

export enum ExecutionType {
    ExecutionStarted = 'ExecutionStarted',
    TaskStateEntered = 'TaskStateEntered',
    TaskScheduled = 'TaskScheduled',
    TaskStarted = 'TaskStarted',
    TaskSubmitted = 'TaskSubmitted'
}
