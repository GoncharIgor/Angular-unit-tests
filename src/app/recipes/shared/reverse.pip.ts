import {Pipe} from "@angular/core";

@Pipe({
    name: 'reversePipe'
})
export class ReversePip {
    transform(value: string) {
        return value.split('').reverse().join('');
    }
}
