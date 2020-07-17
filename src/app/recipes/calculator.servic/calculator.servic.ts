import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CalculatorServic {

    constructor(private logger: LoggerService) {
    }

    add(n1: number, n2: number) {
        this.logger.printLog('Adding');
        return n1 + n2;
    }

    subtract(n1: number, n2: number) {
        this.logger.printLog('Subtraction');
        return n1 - n2;
    }
}


@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    printLog(message: string) {
        console.log(message);
    }
}
