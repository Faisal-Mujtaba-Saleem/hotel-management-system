export default function generate6DigitId() {
    const now = Date.now().toString(); // e.g. 1739446001234
    const nowLast3 = now.slice(-3); // take last 3 digits of timestamp
    const rand3 = Math.floor(Math.random() * 900 + 100); // 3 random digits
    console.log(nowLast3 + rand3); // total 6 digits
}
