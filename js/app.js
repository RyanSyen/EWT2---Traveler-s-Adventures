// TODO: Load component e.g. load('page1')

//but our file is not page1, its _page1 so we need to do some manipulation at the fetch
function load(comp) {
    //return function with resolve method
    //this function will be called by the vue router
    //vue router will call the function whenever it tries to load the component
    //then we need to fetch from server, after fetch it will return with a respond
    //we want to read the html text of the respond then we will get the html content
    // then we want to append html content into the index (SPA) page meaning the template and the script in _page1.html will put in the index (SPA) page
    return resolve => fetch(`_${comp}.html`).then(resp => resp.text()). then(text => {
        //using jqueryslim
        //the content will be appended in the index (SPA) document body
        $(document.body).append(text);

        //return component back to client
        resolve(Vue.component(comp));
    });
}

// TODO: Format a number to the given decimal places
Vue.filter('number', (value, decimal = 2) => {
    return parseFloat(value).toFixed(decimal);
});
    // -> 'number' is just the name of the filter
    // -> value will be the number or value that you want to apply the filter to
    // -> another param value is decimal where you can let the user choose the decimal points but here we fix it to 2dp
    // -> parseFloat is to convert the value into float format and fix it into 2dpp

// TODO: Auto focus on a given input field when component is loaded
Vue.directive('focus', {
    inserted(el){
        el.focus();
    }
});

// TODO(10): Format gender to its relevant emoji and full word
Vue.filter('gender', (value) => { //here the value or data is only 'F' or 'M'
    return value == 'F' ? '👧 Female' : '👦 Male';
});

// Format fb profile id to fb profile photo url
Vue.filter('fb', value => {
    return `https://graph.facebook.com/${value}/picture?width=100&height=100`;
});

// PURPOSE: Center-crop image to the width and height specified (upscale)
function crop(f, w, h, to = 'blob', type = 'image/jpeg') {
    return new Promise((resolve, reject) => { 
        const img = document.createElement('img');
        
        img.onload = e => {
            URL.revokeObjectURL(img.src);
            
            // Resize algorithm ---------------------------
            let ratio = w / h;

            let nw = img.naturalWidth;
            let nh = img.naturalHeight;
            let nratio = nw / nh;

            let sx, sy, sw, sh;

            if (ratio >= nratio) {
                // Retain width, calculate height
                sw = nw;
                sh = nw / ratio;
                sx = 0;
                sy = (nh - sh) / 2;
            }
            else {
                // Retain height, calculate width
                sw = nh * ratio;
                sh = nh;
                sx = (nw - sw) / 2;
                sy = 0;
            }
            // --------------------------------------------

            const can = document.createElement('canvas');
            can.width  = w;
            can.height = h;
            can.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

            // Resolve to blob or dataURL
            if (to == 'blob') {
                can.toBlob(blob => resolve(blob), type);
            }
            else if (to == 'dataURL') {
                let dataURL = can.toDataURL(type);
                resolve(dataURL);
            }
            else {
                reject('ERROR: Specify blob or dataURL');
            }
        };

        img.onerror = e => {
            URL.revokeObjectURL(img.src);
            reject('ERROR: File is not an image');
        };

        img.src = URL.createObjectURL(f);
    });
}

// PURPOSE: Best-fit image within the width and height specified (no upscale)
function fit(f, w, h, to = 'blob', type = 'image/jpeg') {
    return new Promise((resolve, reject) => { 
        const img = document.createElement('img');
        
        img.onload = e => {
            URL.revokeObjectURL(img.src);
            
            // Resize algorithm ---------------------------
            let ratio = w / h;

            let nw = img.naturalWidth;
            let nh = img.naturalHeight;
            let nratio = nw / nh;

            if (nw <= w && nh <= h) {
                // Smaller than targetted width and height, do nothing
                w = nw;
                h = nh;
            }
            else {
                if (nratio >= ratio) {
                    // Retain width, calculate height
                    h = w / nratio;
                }
                else {
                    // Retain height, calculate width
                    w = h * nratio;
                }
            }
            // --------------------------------------------

            const can = document.createElement('canvas');
            can.width  = w;
            can.height = h;
            can.getContext('2d').drawImage(img, 0, 0, w, h);

            // Resolve
            if (to == 'blob') {
                can.toBlob(blob => resolve(blob), type);
            }
            else if (to == 'dataURL') {
                let dataURL = can.toDataURL(type);
                resolve(dataURL);
            }
            else {
                reject('ERROR: Specify blob or dataURL');
            }
        };

        img.onerror = e => {
            URL.revokeObjectURL(img.src);
            reject('ERROR: File is not an image');
        };

        img.src = URL.createObjectURL(f);
    });
}