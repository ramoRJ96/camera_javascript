feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot, user] = buttons;

const constraints = {
    video: {
        width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
        },
        height: {
            min: 720,
            ideal: 1080,
            max: 1440
        },
        facingMode: 'environment'
    },
};

const changeCamera = (facingMode) => {
    const supports = navigator.mediaDevices.getSupportedConstraints();
    if (!supports['facingMode']) {
        alert('Browser Not supported!');
        return;
    }

    let stream;

    const capture = async facingMode => {
        constraints = {
            ...constraints,
            video: {
                facingMode,
            },
        };

        try {
            if (stream) {
                console.log("tonga ato ve ?");
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (e) {
            alert(e);
            return;
        }
        video.srcObject = null;
        video.srcObject = stream;
        video.play();

        play.classList.add('d-none');
        pause.classList.remove('d-none');
        user.classList.remove('d-none');
        screenshot.classList.remove('d-none');
    }

    return facingMode === '' ? capture() : capture(facingMode);
}

cameraOptions.onchange = () => {
    const updatedConstraints = {
        ...constraints,
        deviceId: {
            exact: cameraOptions.value
        }
    };
    changeCamera(updatedConstraints);
};

play.onclick = () => {
    if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        user.classList.remove('d-none');
        pause.classList.remove('d-none');
        return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
            ...constraints,
            deviceId: {
                exact: cameraOptions.value
            }
        };
        changeCamera(updatedConstraints);
    }
};

user.onclick = () => {
    if (constraints.video.facingMode === 'user') {
        changeCamera('environment');
    } else if (constraints.video.facingMode === 'environment') {
        
        changeCamera('user');
    }
    console.log(constraints.video.facingMode);
};

const pauseStream = () => {
    video.pause();
    play.classList.remove('d-none');
    user.classList.add('d-none');
    pause.classList.add('d-none');
};

const doScreenshot = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    screenshotImage.src = canvas.toDataURL('image/webp');
    screenshotImage.classList.remove('d-none');
};

pause.onclick = pauseStream;
screenshot.onclick = doScreenshot;

// const startStream = async (constraints) => {
//   const stream = await  navigator.mediaDevices.getUserMedia(constraints);
//   handleStream(stream);
// };


// const handleStream = (stream) => {
//   video.srcObject = stream;

// };


const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
};

getCameraSelection();