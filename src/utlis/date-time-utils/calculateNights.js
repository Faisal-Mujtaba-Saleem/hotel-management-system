export default function calculateNights(checkIn, checkOut) {
    console.log({checkIn, checkOut});
    if (!checkIn || !checkOut) return 0;

    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    const diff = co - ci;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    console.log(days);
    
    return days > 0 ? days : 0;
}