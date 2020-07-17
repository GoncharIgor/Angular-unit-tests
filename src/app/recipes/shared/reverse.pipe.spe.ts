import {ReversePip} from "./reverse.pip";

// isolated test - not requires Angular testing module and its f()'s
describe('ReversePipe', () => {
    it('should create the component', () => {
        const reversePipe = new ReversePip();

        expect(reversePipe.transform('hello')).toEqual('olleh');
    });
});
