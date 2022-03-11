feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = [...controls.querySelectorAll('button')];
const supports = navigator.mediaDevices.getSupportedConstraints();
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
        facingMode: 'user'
    }
};

cameraOptions.onchange = () => {
    const updatedConstraints = {
        ...constraints,
        deviceId: {
            exact: cameraOptions.value
        }
    };
    startStream(updatedConstraints);
};

play.onclick = () => {
    if (streamStarted) {
        video.play();
        play.classList.add('d-none');
        pause.classList.remove('d-none');
        user.classList.remove('d-none');
        return;
    }
    if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
        const updatedConstraints = {
            ...constraints,
            deviceId: {
                exact: cameraOptions.value
            }
        };
        startStream(updatedConstraints);
    }
};

user.onclick = () => {
    console.log(constraints.video.facingMode);
    if (constraints.video.facingMode === 'user') constraints.video.facingMode = 'environment';
    else if (constraints.video.facingMode === 'environment') constraints.video.facingMode = 'user';
    startStream(constraints);
}

const pauseStream = () => {
    video.pause();
    play.classList.remove('d-none');
    pause.classList.add('d-none');
    user.classList.add('d-none');
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

const startStream = async (constraints) => {
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    try {
        if (stream) {
          let tracks = stream.getTracks();
          console.log(tracks)
          tracks.forEach(track => track.stop());
        }
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        console.log(e);
        return;
      }
    handleStream(stream);
};


const handleStream = (stream) => {
    video.srcObject = null;
    video.srcObject = stream;
    play.classList.add('d-none');
    pause.classList.remove('d-none');
    user.classList.remove('d-none');
    screenshot.classList.remove('d-none');
};


const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    if (videoDevices.length <= 1) cameraOptions.classList.add('d-none');
    const options = videoDevices.map(videoDevice => {
        return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
    });
    cameraOptions.innerHTML = options.join('');
};

getCameraSelection();