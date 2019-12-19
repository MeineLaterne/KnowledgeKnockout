
export class Ajax {

    static request(method, url, data, headers) {
        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();

            xhr.open(method, url);

            if (headers) {
                for (let k in headers) {
                    xhr.setRequestHeader(k, headers[k]);
                }
            }

            xhr.onload = function () {
                resolve(JSON.parse(this.responseText));
            };

            xhr.onerror = function () {
                reject(this.status);
            };

            xhr.onabort = function () {
                reject(this.status);
            };

            xhr.send(data);

        });
    }

    static async post(url, data, headers) {
        try {
            let response = await Ajax.request('POST', url, data, headers);
            return response;
        } catch (error) {
            throw error;
        }
    }

}