const download = document.querySelector(".download");
const dark = document.querySelector(".dark");
const light = document.querySelector(".light");

const qrContainer = document.querySelector("#qr-code");
const qrText = document.querySelector(".qr-text");
const shareBtn = document.querySelector(".share");
const sizes = document.querySelector(".sizes");


dark.addEventListener("input", handleDarkColor);
light.addEventListener("input", handleLightColor);

qrText.addEventListener("input", handleQrText);
shareBtn.addEventListener("click", handleShare);
sizes.addEventListener("change", handleSize);


const defaultUrl = "https://github.com/Amir83Nasr";
let colorDark = "#000";
let colorLight = "#fff";
let text = defaultUrl;
let size = 800;

function handleDarkColor(event) {
    colorDark = event.target.value;
    generateQrCode();
}

function handleLightColor(event) {
    colorLight = event.target.value;
    generateQrCode();
}

function handleQrText(event) {
    const value = event.target.value;
    text = value;
    if (!value) {
        text = defaultUrl;
    }
    generateQrCode();
}

async function generateQrCode() {
    qrContainer.innerHTML = "";
    new QRCode("qr-code", {
        text,
        height: size,
        width: size,
        colorLight,
        colorDark,
    });
    download.href = await resolveDataUrl();
}

async function handleShare() {
    setTimeout(async () => {
        try {
            const base64url = await resolveDataUrl();
            const blob = await (await fetch(base64url)).blob();
            const file = new File([blob], "QRCode.png", {
                type: blob.type,
            });
            await navigator.share({
                files: [file],
                title: text,
            });
        } catch (error) {
            alert("Your browser doesn't support sharing.");
        }
    }, 100);
}

function handleSize(event) {
    size = event.target.value;
    generateQrCode();
}

function resolveDataUrl() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const img = document.querySelector("#qr-code img");
            if (img.currentSrc) {
                resolve(img.currentSrc);
                return;
            }
            const canvas = document.querySelector("canvas");
            resolve(canvas.toDataURL());
        }, 50);
    });
}
generateQrCode();