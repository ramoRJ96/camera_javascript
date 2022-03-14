feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
let streamStarted = false;

const [play, pause, screenshot, user] = buttons;
let stream;
let constraints = {
    audio: false,
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

const changeCamera = async (constraints, facingMode) => {
    const supports = navigator.mediaDevices.getSupportedConstraints();
    if (!supports['facingMode']) {
        alert('Browser Not supported!');
        return;
    }
    
    if (facingMode) constraints.video.facingMode = facingMode;
    try {
        if (stream) {
            alert("tonga ato ve ?");
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

cameraOptions.onchange = async () => {
    const updatedConstraints = {
        ...constraints,
        deviceId: {
            exact: cameraOptions.value
        }
    };
    await changeCamera(updatedConstraints);
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

user.onclick = async () => {
    if (constraints.video.facingMode === 'user') {
        await changeCamera(constraints, 'environment');
    } else if (constraints.video.facingMode === 'environment') {
        await changeCamera(constraints, 'user');
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