export interface CreateReport {
    title: string;
    department: string | null;
    equipment: string | null;
    description: string;
    preventionAction: string | null;
    riskAction: string | null;
    workshift: string;
    enterpriseId: number | null; 
    employeeId: number | null;    
    date: Date;
    finishDate: Date | null;
    isFinished: boolean;
    isPriority: boolean;
}