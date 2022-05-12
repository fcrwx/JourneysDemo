export interface JourneyTask {
    id: number;
    type: string;
    title: string;
    description: string;
    complete: boolean;
    disabled: boolean;
}
