import moment from 'moment';
export interface CreateReport {
    title: string;
    department: string | null;
    equipment: string | null;
    description: string;
    preventionAction: string | null;
    riskAction: string | null;
    workshift: string;
    companyId: number | null; 
    employeeId: number | null;    
    date: moment.Moment;
    finishDate:  moment.Moment | null;
    isFinished: boolean;
    isPriority: boolean;
}