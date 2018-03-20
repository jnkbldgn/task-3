(function(){
    const canvasObject = document.querySelector('.canvas');
    const textElement = document.querySelector('.text');
    const canvasNoise = document.querySelector('.canvas-noise');
    const canvasVolume = document.querySelector('.canvas-volume');
    const boxVideo = document.querySelector('.video-background');
    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    const contextCanvas = canvasObject.getContext('2d');
    const contextNoise = canvasNoise.getContext('2d');
    const contexWidth = canvasObject.clientWidth;
    const contexHight = canvasObject.clientHeight;
    const contextVolume = canvasVolume.getContext('2d');
    const contexVolimeWidth = canvasVolume.clientWidth;
    const video = document.createElement('video');
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const audioProcessor = audioContext.createScriptProcessor(512);
    // Получаем видеопоток с камеры
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
            width: canvasObject.clientWidth,
            height: canvasObject.clientHeight
        }
    }).then(stream => {
        video.src = URL.createObjectURL(stream);
        getVolume(stream);
    }).catch(error => {
        alert('Произошла ошибка при получении видео.');
        return;
    });
    video.addEventListener('loadedmetadata', function(){
        this.play();
        canvasObject.height = video.videoHeight;
        canvasObject.width = video.videoWidth;
        contextCanvas.translate(canvasObject.width, 0);
        contextCanvas.scale(-1, 1);
        drawVideo(this, contextCanvas, contexWidth, contexHight);
    });
    //отрисовываем видео в канвас
    function drawVideo(video, context, width, height){
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        addNoise(contextNoise, width, height);
        setTextInterface();
        volumeDisplay();
        requestAnimationFrame(drawVideo.bind(this, video, context, width, height));
    }
    //добавление шума
    function addNoise(context, width, height){
        let randomY = Math.floor( Math.random() * height);
        let randomX = Math.floor( Math.random() * width);
        context.clearRect(0, 0, width, height);
        context.strokeStyle = '#fff';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(randomX,randomY);
        context.lineTo(randomX + 10,randomY);
        context.fill();
        context.stroke()
        //context.closePath();
    }
    //отображение бегающих цифр сверху
    function setTextInterface(){
        let textInput = generetText();
        for (i = 1; i <= textInput.length; i++){
            textElement.value = textInput.substr(0, i);
        }
    }
    //генирация массива случайных чисел
    function generetText(){
        let numbersForDisplay = [];
        for(i = 0; i < 20; i++){
            numbersForDisplay.push(Math.floor(Math.random() * 100).toString(2));
        } 
        return numbersForDisplay.join(" ");
    }
    //получение уровня громкости
    function getVolume(stream){
        let mediaStreamSource =  audioContext.createMediaStreamSource(stream);
        audioProcessor.onaudioprocess = volumeAudioProcess;
        audioProcessor.volume = 0;
	    audioProcessor.averaging = 0.95;
        audioProcessor.connect(audioContext.destination);
        mediaStreamSource.connect(audioProcessor);
    }
    //вычесление уровня громкости
    function volumeAudioProcess(event) {
        let buffer = event.inputBuffer.getChannelData(0);
        let bufferLength = buffer.length;
        let summa = 0;
        let x;

        for (let i = 0; i < bufferLength; i++) {
            x = buffer[i];
            summa += x * x;
        }
        var rms =  Math.sqrt(summa / bufferLength);
        this.volume = Math.max(rms, this.volume*this.averaging);
        if(this.volume >= 0.2){
            boxVideo.style.backgroundColor = 'rgba(216, 25, 25, 0.726)';
        } else {
            boxVideo.style.backgroundColor = 'rgba(24, 202, 54, 0.726)';
        }
    }
    //отображение уровня громкости
    function volumeDisplay( time ) {
        contextVolume.clearRect(0,0,contexVolimeWidth, 110);
        contextVolume.fillStyle = "rgba(255, 255, 255, 0.712)";
        contextVolume.fillRect(0, 0, audioProcessor.volume*contexVolimeWidth*1.5, 110);
    }    
})();