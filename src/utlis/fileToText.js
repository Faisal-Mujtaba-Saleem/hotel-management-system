export default async function fileToText(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString("utf-8");
}