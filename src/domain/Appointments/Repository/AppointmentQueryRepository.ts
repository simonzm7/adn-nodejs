export abstract class AppointmentQueryRepository{
    public abstract executeAgendaList(parameters: {}[]) : Promise<{}[]>;
}