export class DataServic {
    getDetails(): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('Data')
            }, 1500)
        });
    }
}
